import { input } from "@inquirer/prompts";
import { CHAT_MODEL, client } from "./openai.js";
import { spinner } from "../utils/spinner.js";

export function createConversation(systemPrompt) {
  return [{ role: "developer", content: systemPrompt }];
}

export async function runSimpleChatLoop({ systemPrompt, onMessage }) {
  const messages = createConversation(systemPrompt);
  console.log("輸入 exit 可結束對話。\n");

  while (true) {
    const text = (await input({ message: "你：" })).trim();
    if (!text) continue;
    if (text.toLowerCase() === "exit") break;

    messages.push({ role: "user", content: text });

    const spin = spinner("AI 思考中...").start();
    let response;
    try {
      response = await client.chat.completions.create({
        model: CHAT_MODEL,
        messages,
      });
      spin.succeed("已收到 AI 回覆");
    } catch (error) {
      spin.fail("AI 回覆失敗");
      throw error;
    }

    const content = response.choices[0].message.content ?? "";
    messages.push({ role: "assistant", content });
    console.log(`AI：${content}\n`);

    if (onMessage) {
      onMessage({ user: text, assistant: content, messages });
    }
  }
}

