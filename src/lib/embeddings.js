import { EMBEDDING_MODEL, client } from "./openai.js";
import { spinner } from "../utils/spinner.js";

export async function embedText(text) {
  const spin = spinner("建立文字向量中...").start();
  let response;
  try {
    response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    spin.succeed("文字向量建立完成");
  } catch (error) {
    spin.fail("文字向量建立失敗");
    throw error;
  }
  return response.data[0].embedding;
}

export async function embedMany(texts) {
  const spin = spinner("批次建立向量中...").start();
  let response;
  try {
    response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });
    spin.succeed("批次向量建立完成");
  } catch (error) {
    spin.fail("批次向量建立失敗");
    throw error;
  }
  return response.data.map((item) => item.embedding);
}
