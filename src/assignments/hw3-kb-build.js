import { embedMany } from "../lib/embeddings.js";
import { saveVectorStore } from "../lib/vector-store.js";
import { KNOWLEDGE_ITEMS } from "../data/knowledge-seed.js";

const STORE_PATH = ".data/knowledge-vectors.json";

console.log("作業3：建立迷你知識庫向量...");

const texts = KNOWLEDGE_ITEMS.map((item) => item.content);
const embeddings = await embedMany(texts);

const records = KNOWLEDGE_ITEMS.map((item, idx) => ({
  id: item.id,
  topic: item.topic,
  content: item.content,
  embedding: embeddings[idx],
}));

saveVectorStore(STORE_PATH, records);

console.log(`完成，已寫入 ${records.length} 筆資料到 ${STORE_PATH}`);

