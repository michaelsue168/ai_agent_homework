import { input } from "@inquirer/prompts";
import { embedText } from "../lib/embeddings.js";
import { CHAT_MODEL, client } from "../lib/openai.js";
import { loadVectorStore, searchTopK } from "../lib/vector-store.js";
import { round } from "../utils/math.js";

const STORE_PATH = ".data/knowledge-vectors.json";
const TOP_K = 3;
const MIN_CONFIDENCE_SCORE = 0.25;
const DEBUG = process.argv.includes("--debug");

const records = loadVectorStore(STORE_PATH);

function rejectResponse() {
  return {
    answer: "我在知識庫中找不到足夠資訊來回答這個問題。",
    citations: [],
  };
}

function buildContext(topRecords) {
  return topRecords
    .map(
      (item, idx) =>
        `[${idx + 1}] topic=${item.topic}; score=${round(item.score)}\n${item.content}`,
    )
    .join("\n\n");
}

async function generateRagAnswer(query, topRecords) {
  const allowedTopics = topRecords.map((item) => item.topic);
  const context = buildContext(topRecords);

  const response = await client.chat.completions.create({
    model: CHAT_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "developer",
        content:
          "You are a strict RAG assistant. Answer in Traditional Chinese. " +
          "Use only the provided knowledge context. " +
          "If context is insufficient, answer that you do not know. " +
          "Return JSON only with keys: answer (string), citations (string[]). " +
          "citations must contain topic names from context that support the answer.",
      },
      {
        role: "user",
        content:
          `Question:\n${query}\n\n` +
          `Knowledge Context:\n${context}\n\n` +
          `Allowed topics: ${allowedTopics.join(", ")}`,
      },
    ],
  });

  const text = response.choices[0].message.content ?? "{}";
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return rejectResponse();
  }

  if (!parsed || typeof parsed.answer !== "string" || !Array.isArray(parsed.citations)) {
    return rejectResponse();
  }

  const citations = parsed.citations.filter((topic) => allowedTopics.includes(topic));
  if (citations.length === 0) return rejectResponse();

  return {
    answer: parsed.answer.trim() || rejectResponse().answer,
    citations,
  };
}

console.log("作業3：知識庫搜尋 + RAG回答");
console.log('您可以試著詢問程式語言相關問題');
console.log("輸入問題，輸入 exit 可離開。\n");

while (true) {
  const query = (await input({ message: "Query:" })).trim();
  if (!query) continue;
  if (query.toLowerCase() === "exit") break;

  try {
    const qVec = await embedText(query);
    const top = searchTopK(records, qVec, TOP_K);

    if (DEBUG) {
      console.log("Top results:");
      top.forEach((item, i) => {
        console.log(`${i + 1}. ${item.topic} (score=${round(item.score)})`);
        console.log(`   ${item.content}`);
      });
      console.log("");
    }

    if (!top.length || top[0].score < MIN_CONFIDENCE_SCORE) {
      const rejected = rejectResponse();
      console.log(`回答: ${rejected.answer}\n`);
      continue;
    }

    const result = await generateRagAnswer(query, top);
    console.log(`回答: ${result.answer}`);
    if (result.citations.length > 0) {
      console.log(`來源: ${result.citations.join(", ")}`);
    }
    console.log("");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.log(`回答: 查詢失敗，請稍後再試。(${reason})\n`);
  }
}
