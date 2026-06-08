import { CHAT_MODEL, client } from "./openai.js";
import { spinner } from "../utils/spinner.js";

export async function runToolConversation({
  systemPrompt,
  tools,
  toolHandlers,
  userInput,
}) {
  const messages = [
    { role: "developer", content: systemPrompt },
    { role: "user", content: userInput },
  ];

  while (true) {
    const spin = spinner("AI 思考中...").start();
    let response;
    try {
      response = await client.chat.completions.create({
        model: CHAT_MODEL,
        messages,
        tools,
        tool_choice: "auto",
      });
      spin.succeed("已收到 AI 回覆");
    } catch (error) {
      spin.fail("AI 回覆失敗");
      throw error;
    }

    const message = response.choices[0].message;
    messages.push(message);

    if (!message.tool_calls || message.tool_calls.length === 0) {
      return message.content ?? "";
    }

    for (const call of message.tool_calls) {
      const name = call.function.name;
      const args = JSON.parse(call.function.arguments || "{}");
      const handler = toolHandlers[name];

      if (!handler) {
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify({ error: `Unknown tool: ${name}` }),
        });
        continue;
      }

      const toolSpin = spinner(`執行工具 ${name} 中...`).start();
      let result;
      try {
        result = await handler(args);
        toolSpin.succeed(`工具 ${name} 執行完成`);
      } catch (error) {
        toolSpin.fail(`工具 ${name} 執行失敗`);
        throw error;
      }
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }
  }
}
