// Copies the pdf.js browser build into public/pdfjs so the source viewer can
// load it directly in the browser without going through the bundler.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const from = path.join(root, "node_modules", "pdfjs-dist", "build");
const to = path.join(root, "public", "pdfjs");

if (!fs.existsSync(from)) {
  console.warn("[copy-pdfjs] pdfjs-dist is not installed; skipping.");
  process.exit(0);
}

fs.mkdirSync(to, { recursive: true });
for (const file of ["pdf.min.mjs", "pdf.worker.min.mjs"]) {
  fs.copyFileSync(path.join(from, file), path.join(to, file));
}
console.log("[copy-pdfjs] pdf.js copied to public/pdfjs");
