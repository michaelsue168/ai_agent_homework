import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { cosineSimilarity } from "../utils/math.js";

function ensureParentDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function saveVectorStore(filePath, records) {
  const resolved = resolve(filePath);
  ensureParentDir(resolved);
  writeFileSync(resolved, JSON.stringify({ records }, null, 2), "utf8");
}

export function loadVectorStore(filePath) {
  const resolved = resolve(filePath);
  if (!existsSync(resolved)) {
    throw new Error(
      `Vector store not found: ${resolved}. Please run: npm run hw3:build`,
    );
  }
  const parsed = JSON.parse(readFileSync(resolved, "utf8"));
  return parsed.records;
}

export function searchTopK(records, queryVector, k = 3) {
  return records
    .map((record) => ({
      ...record,
      score: cosineSimilarity(record.embedding, queryVector),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

