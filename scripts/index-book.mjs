// Indexes the textbook PDF for page-accurate citations.
//
//   1. Put the PDF in the `book/` folder (or pass a path: npm run index-book -- "C:\path\book.pdf")
//   2. npm run index-book
//
// Writes book/index.json: every page is split into short passages, and every
// line of text keeps its position on the page so the viewer can highlight it.
// Both the PDF and the index stay on this machine (book/ is git-ignored).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bookDir = path.join(root, "book");
fs.mkdirSync(bookDir, { recursive: true });

function findPdf() {
  const arg = process.argv[2];
  if (arg) {
    const src = path.resolve(arg);
    if (!fs.existsSync(src)) throw new Error(`File not found: ${src}`);
    if (path.dirname(src) === bookDir) return src;
    const dest = path.join(bookDir, path.basename(src));
    fs.copyFileSync(src, dest);
    console.log(`Copied ${path.basename(src)} into book/`);
    return dest;
  }
  const pdfs = fs.readdirSync(bookDir).filter((f) => f.toLowerCase().endsWith(".pdf"));
  if (pdfs.length === 0) {
    throw new Error('No PDF found. Put the textbook PDF in the "book" folder, then run: npm run index-book');
  }
  if (pdfs.length > 1) console.warn(`Several PDFs found in book/; using ${pdfs[0]}`);
  return path.join(bookDir, pdfs[0]);
}

const round = (n) => Math.round(n * 10000) / 10000;

/** Groups the text items of one page into lines in reading order. */
function extractLines(items, vp) {
  const W = vp.width;
  const H = vp.height;
  const frags = [];
  for (const it of items) {
    if (!it.str || !it.str.trim()) continue;
    const [, , c, d, e, f] = it.transform;
    const h = it.height || Math.hypot(c, d) || 10;
    const [x, yBase] = vp.convertToViewportPoint(e, f);
    frags.push({ s: it.str, x, y: yBase - h, w: it.width, h });
  }
  frags.sort((a, b) => a.y - b.y || a.x - b.x);

  // 1. rows: fragments sharing a baseline
  const rows = [];
  for (const fr of frags) {
    const row = rows[rows.length - 1];
    if (row && Math.abs(fr.y + fr.h - row.base) < Math.max(fr.h, row.h) * 0.45) {
      row.frags.push(fr);
      row.h = Math.max(row.h, fr.h);
    } else {
      rows.push({ base: fr.y + fr.h, h: fr.h, frags: [fr] });
    }
  }

  // 2. segments: a row is split where there is a wide gap (column gutter)
  const segs = [];
  for (const row of rows) {
    row.frags.sort((a, b) => a.x - b.x);
    let cur = null;
    for (const fr of row.frags) {
      if (cur && fr.x - (cur.x + cur.w) < Math.max(fr.h, cur.h) * 1.5) {
        const gap = fr.x - (cur.x + cur.w);
        const needsSpace = gap > fr.h * 0.18 && !cur.t.endsWith(" ") && !fr.s.startsWith(" ");
        cur.t += (needsSpace ? " " : "") + fr.s;
        cur.w = Math.max(cur.x + cur.w, fr.x + fr.w) - cur.x;
        cur.y = Math.min(cur.y, fr.y);
        cur.h = Math.max(cur.h, fr.h);
      } else {
        cur = { t: fr.s, x: fr.x, y: fr.y, w: fr.w, h: fr.h };
        segs.push(cur);
      }
    }
  }

  // 3. reading order for two-column pages: left column, then right column,
  //    with full-width lines (titles, captions) acting as separators.
  const mid = W / 2;
  const tol = W * 0.03;
  const colOf = (s) => (s.x + s.w <= mid + tol ? 0 : s.x >= mid - tol ? 1 : 2);
  const ordered = [];
  let left = [];
  let right = [];
  const flush = () => {
    ordered.push(...left, ...right);
    left = [];
    right = [];
  };
  for (const s of segs) {
    const col = colOf(s);
    s.col = col;
    if (col === 0) left.push(s);
    else if (col === 1) right.push(s);
    else {
      flush();
      ordered.push(s);
    }
  }
  flush();

  return ordered
    .map((s) => ({
      t: s.t.replace(/\s+/g, " ").trim(),
      col: s.col,
      yAbs: s.y,
      hAbs: s.h,
      r: [round(s.x / W), round(s.y / H), round(s.w / W), round(s.h / H)],
    }))
    .filter((l) => l.t.length > 0);
}

/** Splits the ordered lines of a page into passages of a few lines each. */
function buildPassages(lines, pageNo) {
  const passages = [];
  let cur = [];
  let chars = 0;
  const push = () => {
    if (cur.length === 0) return;
    let text = "";
    for (const l of cur) {
      if (text.endsWith("-") && /^[a-z]/.test(l.t)) text = text.slice(0, -1) + l.t;
      else text += (text ? " " : "") + l.t;
    }
    if (text.length >= 40) {
      passages.push({
        id: `p${pageNo}-${passages.length + 1}`,
        page: pageNo,
        text,
        lines: cur.map((l) => ({ t: l.t, r: l.r })),
      });
    }
    cur = [];
    chars = 0;
  };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const prev = cur[cur.length - 1];
    if (prev) {
      const columnChange = l.col !== prev.col;
      const bigGap = Math.abs(l.yAbs - prev.yAbs) > prev.hAbs * 2.4;
      if (chars > 750 || ((columnChange || bigGap) && chars > 260)) push();
    }
    cur.push(l);
    chars += l.t.length + 1;
  }
  push();
  return passages;
}

async function readOutline(doc) {
  const out = [];
  let outline = null;
  try {
    outline = await doc.getOutline();
  } catch {
    return out;
  }
  if (!outline) return out;
  const walk = async (nodes, level) => {
    for (const node of nodes) {
      try {
        const dest = typeof node.dest === "string" ? await doc.getDestination(node.dest) : node.dest;
        if (dest && dest[0]) {
          const page = (await doc.getPageIndex(dest[0])) + 1;
          out.push({ title: String(node.title || "").replace(/\s+/g, " ").trim(), page, level });
        }
      } catch {
        // unresolved bookmark; skip
      }
      if (node.items && node.items.length && level < 2) await walk(node.items, level + 1);
    }
  };
  await walk(outline, 0);
  return out.sort((a, b) => a.page - b.page || a.level - b.level);
}

async function main() {
  const pdfPath = findPdf();
  console.log(`Indexing ${path.basename(pdfPath)} ...`);
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await getDocument({ data, useSystemFonts: true, isEvalSupported: false, verbosity: 0 }).promise;

  let title = path.basename(pdfPath, path.extname(pdfPath));
  try {
    const meta = await doc.getMetadata();
    if (meta?.info?.Title && String(meta.info.Title).trim().length > 3) title = String(meta.info.Title).trim();
  } catch {
    // keep the file name
  }

  let pageLabels = null;
  try {
    pageLabels = await doc.getPageLabels();
  } catch {
    pageLabels = null;
  }

  const outline = await readOutline(doc);
  const passages = [];
  let emptyPages = 0;
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const vp = page.getViewport({ scale: 1 });
    const tc = await page.getTextContent();
    const lines = extractLines(tc.items, vp);
    if (lines.length === 0) emptyPages++;
    passages.push(...buildPassages(lines, n));
    page.cleanup();
    if (n % 50 === 0 || n === doc.numPages) process.stdout.write(`\r  page ${n} / ${doc.numPages}`);
  }
  process.stdout.write("\n");

  const index = {
    version: 1,
    title,
    file: path.basename(pdfPath),
    numPages: doc.numPages,
    indexedAt: new Date().toISOString(),
    pageLabels,
    outline,
    passages,
  };
  fs.writeFileSync(path.join(bookDir, "index.json"), JSON.stringify(index));
  console.log(`Done: ${passages.length} passages from ${doc.numPages} pages -> book/index.json`);
  if (emptyPages > doc.numPages * 0.5) {
    console.warn(
      "Warning: most pages contain no selectable text. This looks like a scanned PDF; run OCR on it first, then index again."
    );
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
