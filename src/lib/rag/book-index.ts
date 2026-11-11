/**
 * Page-accurate retrieval over the locally indexed textbook PDF.
 *
 * The index (book/index.json) is produced by `npm run index-book`. Each passage
 * keeps the lines it was built from together with their position on the page,
 * which is what lets the source viewer highlight the exact lines.
 */

import fs from "node:fs";
import path from "node:path";

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

let cache: { mtimeMs: number; book: LoadedBook } | null = null;

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

export function loadBook(): LoadedBook | null {
  let stat: fs.Stats;
  try {
    stat = fs.statSync(INDEX_PATH);
  } catch {
    cache = null;
    return null;
  }
  if (cache && cache.mtimeMs === stat.mtimeMs) return cache.book;

  try {
    const data = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as BookIndexFile;
    if (!Array.isArray(data.passages) || data.passages.length === 0) return null;

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

    const book: LoadedBook = { data, postings, docLen, avgLen: total / Math.max(1, docLen.length) };
    cache = { mtimeMs: stat.mtimeMs, book };
    return book;
  } catch (err) {
    console.warn("Could not read book/index.json:", err);
    return null;
  }
}

export interface BookStatus {
  available: boolean;
  title?: string;
  numPages?: number;
  passages?: number;
}

export function getBookStatus(): BookStatus {
  const book = loadBook();
  if (!book) return { available: false };
  if (!fs.existsSync(path.join(BOOK_DIR, book.data.file))) return { available: false };
  return {
    available: true,
    title: book.data.title,
    numPages: book.data.numPages,
    passages: book.data.passages.length,
  };
}

export function getBookPdfPath(): string | null {
  const book = loadBook();
  if (!book) return null;
  // basename() guards against a tampered index pointing outside book/
  const file = path.join(BOOK_DIR, path.basename(book.data.file));
  return fs.existsSync(file) ? file : null;
}

export interface BookHit {
  passage: BookPassage;
  score: number;
  bookTitle: string;
  pageLabel: string;
  chapterNumber: number;
  chapterTitle: string;
  sectionTitle: string;
}

function locate(book: LoadedBook, page: number) {
  let chapter: OutlineEntry | null = null;
  let section: OutlineEntry | null = null;
  for (const entry of book.data.outline) {
    if (entry.page > page) break;
    // chapters are the entries whose title starts with a number, else top-level ones
    if (/^(chapter\s+)?\d+[\s.:]/i.test(entry.title) && entry.level <= 1) chapter = entry;
    else if (entry.level === 0 && !chapter) chapter = entry;
    section = entry;
  }
  const m = chapter?.title.match(/^(?:chapter\s+)?(\d+)[\s.:]+(.*)$/i);
  return {
    chapterNumber: m ? parseInt(m[1], 10) : 0,
    chapterTitle: m ? m[2].trim() : chapter?.title || "",
    sectionTitle: section && section !== chapter ? section.title : "",
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
  for (const [idx, score] of ranked) {
    if (hits.length >= topK) break;
    const passage = book.data.passages[idx];
    hits.push({
      passage,
      score,
      bookTitle: book.data.title,
      pageLabel: pageLabelOf(book, passage.page),
      ...locate(book, passage.page),
    });
  }
  return hits;
}
