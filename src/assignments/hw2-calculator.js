import { input } from "@inquirer/prompts";
import { runToolConversation } from "../lib/tool-runner.js";
import { calculate, calculateTool } from "../tools/calculate.js";

const systemPrompt = `你是一位會使用工具的助理。當使用者問題涉及數學計算時，必須呼叫 calculate 工具，
不要自行心算。取得工具結果後，用繁體中文回覆簡短答案。`;

console.log("作業2：計算機 Function Calling（輸入 exit 結束）\n");

while (true) {
  const question = (await input({ message: "你：" })).trim();
  if (!question) continue;
  if (question.toLowerCase() === "exit") break;

  const answer = await runToolConversation({
    systemPrompt,
    tools: [calculateTool],
    toolHandlers: { calculate },
    userInput: question,
  });

  console.log(`AI：${answer}\n`);
}

