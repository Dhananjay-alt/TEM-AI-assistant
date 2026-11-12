/**
 * Page-accurate retrieval over the indexed textbook.
 *
 * The index is produced by `npm run index-book`. Each passage keeps the lines
 * it was built from together with their position on the page.
 *
 * Where the index comes from:
 *  - locally: book/index.json next to the PDF, which enables the page viewer;
 *  - on a deployed site: a private object in storage, fetched by the server
 *    and held in memory. Neither the PDF nor the index is ever sent to a
 *    visitor, and neither belongs in the repository.
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

export interface BookLine {
  /** Text of the line. */
  t: string;
  /** Position on the page as fractions of page size: [x, y, width, height]. */
  r: [number, number, number, number];
}

export interface BookPassage {
  id: string;
  page: number;
  text: string;
  lines: BookLine[];
}

interface OutlineEntry {
  title: string;
  page: number;
  level: number;
}

interface BookIndexFile {
  version: number;
  title: string;
  file: string;
  numPages: number;
  indexedAt: string;
  pageLabels: string[] | null;
  outline: OutlineEntry[];
  passages: BookPassage[];
}

interface LoadedBook {
  data: BookIndexFile;
  postings: Map<string, Array<[number, number]>>;
  docLen: number[];
  avgLen: number;
}

export const BOOK_DIR = path.join(process.cwd(), "book");
const INDEX_PATH = path.join(BOOK_DIR, "index.json");

type Origin = "local" | "remote";
let cache: { key: string; origin: Origin; book: LoadedBook } | null = null;
let remoteLoad: Promise<LoadedBook | null> | null = null;
let remoteFailedAt = 0;

const STOPWORDS = new Set(
  "a an and are as at be been but by can could did do does for from had has have how if in into is it its may might more most must no nor not of on or our should so such than that the their them then there these they this those through to was we were what when where which while who why will with would you your about above after again against all also am any because before being below between both each few further here itself just me my off once only other out over own same some too under until up very".split(
    " "
  )
);

export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.toLowerCase().split(/[^a-z0-9]+/)) {
    if (raw.length < 2 || STOPWORDS.has(raw)) continue;
    // very light stemming so "lenses" matches "lens", "aberrations" matches "aberration"
    let w = raw;
    if (w.length > 4 && w.endsWith("es") && !w.endsWith("ses")) w = w.slice(0, -1);
    if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1);
    out.push(w);
  }
  return out;
}

function buildBook(data: BookIndexFile): LoadedBook | null {
  if (!data || !Array.isArray(data.passages) || data.passages.length === 0) return null;
  if (!Array.isArray(data.outline)) data.outline = [];

  const postings = new Map<string, Array<[number, number]>>();
  const docLen: number[] = [];
  let total = 0;
  data.passages.forEach((p, idx) => {
    const tf = new Map<string, number>();
    const tokens = tokenize(p.text);
    for (const tok of tokens) tf.set(tok, (tf.get(tok) || 0) + 1);
    docLen.push(tokens.length);
    total += tokens.length;
    tf.forEach((count, term) => {
      let list = postings.get(term);
      if (!list) {
        list = [];
        postings.set(term, list);
      }
      list.push([idx, count]);
    });
  });

  return { data, postings, docLen, avgLen: total / Math.max(1, docLen.length) };
}

/** BOOK_SOURCE=remote ignores a local book folder (used to test the deployed set-up). */
const localAllowed = () => process.env.BOOK_SOURCE !== "remote";

function loadLocal(): LoadedBook | null {
  if (!localAllowed()) return null;
  let stat: fs.Stats;
  try {
    stat = fs.statSync(INDEX_PATH);
  } catch {
    if (cache?.origin === "local") cache = null;
    return null;
  }
  const key = `local:${stat.mtimeMs}`;
  if (cache && cache.key === key) return cache.book;

  try {
    const book = buildBook(JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as BookIndexFile);
    if (!book) return null;
    cache = { key, origin: "local", book };
    return book;
  } catch (err) {
    console.warn("Could not read book/index.json:", err);
    return null;
  }
}

/**
 * Where the private copy of the index lives, from the environment:
 *  - BOOK_INDEX_URL (+ optional BOOK_INDEX_TOKEN sent as a Bearer token), or
 *  - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY: a private Supabase Storage bucket
 *    (BOOK_INDEX_BUCKET, default "tem-book"; BOOK_INDEX_OBJECT, default "index.json.gz").
 */
export function remoteIndexConfig(): { url: string; headers: Record<string, string> } | null {
  const url = (process.env.BOOK_INDEX_URL || "").trim();
  if (url) {
    const token = (process.env.BOOK_INDEX_TOKEN || "").trim();
    return { url, headers: token ? { Authorization: `Bearer ${token}` } : {} };
  }
  const base = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (base && key) {
    const bucket = (process.env.BOOK_INDEX_BUCKET || "tem-book").trim();
    const object = (process.env.BOOK_INDEX_OBJECT || "index.json.gz").trim();
    return {
      url: `${base}/storage/v1/object/${bucket}/${object}`,
      headers: { Authorization: `Bearer ${key}`, apikey: key },
    };
  }
  return null;
}

async function fetchRemote(cfg: { url: string; headers: Record<string, string> }): Promise<LoadedBook | null> {
  const res = await fetch(cfg.url, {
    headers: cfg.headers,
    cache: "no-store",
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`index download failed with HTTP ${res.status}`);
  let buf: Buffer = Buffer.from(await res.arrayBuffer());
  if (buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b) buf = zlib.gunzipSync(buf);
  const book = buildBook(JSON.parse(buf.toString("utf8")) as BookIndexFile);
  if (!book) throw new Error("the downloaded index contains no passages");
  return book;
}

/**
 * Makes sure the index is in memory, downloading it from private storage when
 * there is no local copy. Call this once at the start of a request; the
 * synchronous helpers below then read from memory.
 */
export async function ensureBook(): Promise<LoadedBook | null> {
  const local = loadLocal();
  if (local) return local;

  const cfg = remoteIndexConfig();
  if (!cfg) return null;
  if (cache?.origin === "remote" && cache.key === cfg.url) return cache.book;
  // after a failure, wait a little before trying again so every request is not slowed down
  if (Date.now() - remoteFailedAt < 30000) return null;

  if (!remoteLoad) {
    remoteLoad = fetchRemote(cfg)
      .then((book) => {
        if (book) cache = { key: cfg.url, origin: "remote", book };
        return book;
      })
      .catch((err) => {
        remoteFailedAt = Date.now();
        console.error("Could not load the book index from private storage:", err?.message || err);
        return null;
      })
      .finally(() => {
        remoteLoad = null;
      });
  }
  return remoteLoad;
}

/** The index currently in memory (local file, or the remote copy once ensureBook() has run). */
export function loadBook(): LoadedBook | null {
  const local = loadLocal();
  if (local) return local;
  return cache?.origin === "remote" ? cache.book : null;
}

function localPdfPath(book: LoadedBook): string | null {
  if (cache?.origin !== "local") return null;
  // basename() guards against a tampered index pointing outside book/
  const file = path.join(BOOK_DIR, path.basename(book.data.file));
  return fs.existsSync(file) ? file : null;
}

/**
 * "pages": the PDF is on this machine, so a reference opens the page itself.
 * "reference": only chapter, section, page number and a short quotation are
 * shown (always the case on a deployed site). BOOK_VIEW=reference forces it.
 */
export type BookView = "pages" | "reference";
export function bookView(): BookView {
  const book = loadBook();
  if (!book || process.env.BOOK_VIEW === "reference") return "reference";
  return localPdfPath(book) ? "pages" : "reference";
}

/** The PDF's own title, or its first bookmark when the title is just the file name. */
function displayTitle(book: LoadedBook): string {
  const { title, file, outline } = book.data;
  const first = outline[0];
  const isFileName = title === file.replace(/\.pdf$/i, "");
  if (isFileName && first && first.level === 0 && first.page <= 5 && first.title.length > 3) return first.title;
  return title;
}

export interface BookStatus {
  available: boolean;
  title?: string;
  numPages?: number;
  passages?: number;
  view?: BookView;
}

export async function getBookStatus(): Promise<BookStatus> {
  const book = await ensureBook();
  if (!book) return { available: false };
  return {
    available: true,
    title: displayTitle(book),
    numPages: book.data.numPages,
    passages: book.data.passages.length,
    view: bookView(),
  };
}

/** Path of the PDF for the local page viewer; null whenever pages must not be served. */
export function getBookPdfPath(): string | null {
  const book = loadBook();
  if (!book || bookView() !== "pages") return null;
  return localPdfPath(book);
}

export interface BookHit {
  passage: BookPassage;
  score: number;
  bookTitle: string;
  pageLabel: string;
  chapterNumber: number;
  chapterTitle: string;
  sectionTitle: string;
  sectionNumber: string;
}

const ACRONYMS = "TEM STEM SEM HRTEM CBED SAD SAED EELS XEDS EDS WDS FEG CCD HOLZ ZOLZ FOLZ BF DF WBDF CTF DP DPs ADF HAADF EFTEM ELNES EXELFS AEM".split(" ");

/** Bookmark titles written in capitals ("1.2 WHY USE ELECTRONS?") are shown in sentence case. */
function tidyTitle(title: string): string {
  if (/[a-z]/.test(title)) return title;
  let seenWord = false;
  return title
    .split(/(\s+|-)/)
    .map((word) => {
      if (!/[A-Z]/.test(word)) return word;
      const acronym = ACRONYMS.find((a) => a.toUpperCase() === word.replace(/[^A-Z]/gi, "").toUpperCase());
      if (acronym) {
        seenWord = true;
        return word.replace(/[A-Za-z]+/, acronym);
      }
      const lower = word.toLowerCase();
      if (seenWord) return lower;
      seenWord = true;
      return lower.replace(/[a-z]/, (c) => c.toUpperCase());
    })
    .join("");
}

function locate(book: LoadedBook, page: number) {
  const outline = book.data.outline;
  const isChapter = (e: OutlineEntry, i: number) =>
    e.level === 0 && i > 0 && !/^(part\s+\d+|index|contents|preface|foreword)\b/i.test(e.title);

  let chapterIdx = -1;
  let chapterCount = 0;
  let chapterNumber = 0;
  let section: OutlineEntry | null = null;
  for (let i = 0; i < outline.length; i++) {
    const entry = outline[i];
    if (entry.page > page) break;
    if (entry.level === 0) {
      section = null;
      if (isChapter(entry, i)) {
        chapterIdx = i;
        chapterCount++;
        // prefer the number printed in the chapter's own headings ("12.3 ...")
        const own = entry.title.match(/^(?:chapter\s+)?(\d+)[\s.:]/i) || outline[i + 1]?.title.match(/^(\d+)\./);
        chapterNumber = own && outline[i + 1]?.level !== 0 ? parseInt(own[1], 10) : chapterCount;
      } else {
        chapterIdx = -1;
      }
    } else {
      section = entry;
    }
  }

  const chapter = chapterIdx >= 0 ? outline[chapterIdx] : null;
  const sectionMatch = section?.title.match(/^(\d+(?:\.[\dA-Z]+)*)\s+(.*)$/);
  return {
    chapterNumber: chapter ? chapterNumber : 0,
    chapterTitle: chapter ? chapter.title.replace(/^(?:chapter\s+)?\d+[\s.:]+/i, "").trim() : "",
    sectionTitle: section ? tidyTitle(section.title) : "",
    sectionNumber: sectionMatch ? sectionMatch[1] : "",
  };
}

export function pageLabelOf(book: LoadedBook, page: number): string {
  const label = book.data.pageLabels?.[page - 1];
  return label && String(label).trim() ? String(label) : String(page);
}

/** BM25 search over the indexed passages. */
export function searchBook(query: string, topK = 4): BookHit[] {
  const book = loadBook();
  if (!book) return [];
  const N = book.data.passages.length;
  const k1 = 1.4;
  const b = 0.75;
  const scores = new Map<number, number>();

  for (const term of Array.from(new Set(tokenize(query)))) {
    const list = book.postings.get(term);
    if (!list) continue;
    const idf = Math.log(1 + (N - list.length + 0.5) / (list.length + 0.5));
    for (const [idx, tf] of list) {
      const norm = tf + k1 * (1 - b + (b * book.docLen[idx]) / book.avgLen);
      scores.set(idx, (scores.get(idx) || 0) + idf * ((tf * (k1 + 1)) / norm));
    }
  }

  const ranked = Array.from(scores.entries()).sort((a, c) => c[1] - a[1]);
  const hits: BookHit[] = [];
  const outside: BookHit[] = [];
  for (const [idx, score] of ranked.slice(0, topK * 6)) {
    if (hits.length >= topK) break;
    const passage = book.data.passages[idx];
    const hit: BookHit = {
      passage,
      score,
      bookTitle: displayTitle(book),
      pageLabel: pageLabelOf(book, passage.page),
      ...locate(book, passage.page),
    };
    // The table of contents and the index match almost every query but explain
    // nothing, so passages outside a chapter are only used as a last resort.
    if (hit.chapterTitle) hits.push(hit);
    else outside.push(hit);
  }
  return hits.length > 0 ? hits : outside.slice(0, topK);
}
