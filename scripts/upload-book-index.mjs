// Puts the book index into PRIVATE storage so the deployed site can search it.
//
//   npm run upload-book-index
//
// Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (or .env).
// The index is uploaded to a private Supabase Storage bucket: it can only be
// read with the service-role key, which lives on the server. Only the index
// is uploaded, never the PDF, and nothing goes into the git repository.
//
// The deployed site needs the same two variables in its environment settings.

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readEnv() {
  const env = { ...process.env };
  for (const file of [".env", ".env.local"]) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) continue;
    for (const line of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (!m || !m[2]) continue;
      env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

async function main() {
  const env = readEnv();
  const base = (env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY || "";
  const bucket = env.BOOK_INDEX_BUCKET || "tem-book";
  const object = env.BOOK_INDEX_OBJECT || "index.json.gz";

  if (!base || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local.\n" +
        "Find the service-role key in the Supabase dashboard under Project Settings > API keys."
    );
  }

  const indexPath = path.join(root, "book", "index.json");
  if (!fs.existsSync(indexPath)) throw new Error("book/index.json not found. Run: npm run index-book");

  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  const gz = zlib.gzipSync(Buffer.from(JSON.stringify(index)), { level: 9 });
  console.log(`Index: ${index.passages.length} passages, ${(gz.length / 1048576).toFixed(1)} MB compressed`);

  const headers = { Authorization: `Bearer ${key}`, apikey: key };

  // 1. make sure the bucket exists and is private
  const existing = await fetch(`${base}/storage/v1/bucket/${bucket}`, { headers });
  if (existing.ok) {
    const info = await existing.json();
    if (info.public) {
      const fix = await fetch(`${base}/storage/v1/bucket/${bucket}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ public: false }),
      });
      if (!fix.ok) throw new Error(`Bucket "${bucket}" is public and could not be made private (HTTP ${fix.status}).`);
      console.log(`Bucket "${bucket}" was public; it is now private.`);
    }
  } else {
    const created = await fetch(`${base}/storage/v1/bucket`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id: bucket, name: bucket, public: false }),
    });
    if (!created.ok) {
      throw new Error(`Could not create bucket "${bucket}" (HTTP ${created.status}): ${await created.text()}`);
    }
    console.log(`Created private bucket "${bucket}".`);
  }

  // 2. upload (replace any earlier copy)
  const up = await fetch(`${base}/storage/v1/object/${bucket}/${object}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/gzip", "x-upsert": "true" },
    body: gz,
  });
  if (!up.ok) throw new Error(`Upload failed (HTTP ${up.status}): ${await up.text()}`);
  console.log(`Uploaded to ${bucket}/${object}.`);

  // 3. prove it is private: it must not be readable without the key
  const anon = await fetch(`${base}/storage/v1/object/public/${bucket}/${object}`);
  const bare = await fetch(`${base}/storage/v1/object/${bucket}/${object}`);
  if (anon.ok || bare.ok) {
    throw new Error("The index is readable without a key. Make the bucket private in the Supabase dashboard.");
  }
  const withKey = await fetch(`${base}/storage/v1/object/${bucket}/${object}`, { headers, method: "HEAD" });
  if (!withKey.ok) throw new Error(`The index could not be read back with the key (HTTP ${withKey.status}).`);

  console.log("Verified: readable with the service-role key, not readable without it.");
  console.log("\nNext: add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the deployed site's environment and redeploy.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
