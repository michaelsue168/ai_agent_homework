import { input } from "@inquirer/prompts";
import { runToolConversation } from "../lib/tool-runner.js";
import { getTime, getTimeTool } from "../tools/time.js";
import { getWeather, getWeatherTool } from "../tools/weather.js";

const systemPrompt = `你是生活助理。你可以透過工具查詢目前時間與城市天氣。
當問題涉及時間請呼叫 get_time，涉及天氣請呼叫 get_weather。
若同時問時間與天氣，請呼叫兩個工具並整合成一段繁體中文回答。`;

console.log("作業4：時間 + 天氣工具整合（輸入 exit 結束）\n");

while (true) {
  const question = (await input({ message: "你：" })).trim();
  if (!question) continue;
  if (question.toLowerCase() === "exit") break;

  const answer = await runToolConversation({
    systemPrompt,
    tools: [getTimeTool, getWeatherTool],
    toolHandlers: {
      get_time: getTime,
      get_weather: getWeather,
    },
    userInput: question,
  });

  console.log(`AI：${answer}\n`);
}

