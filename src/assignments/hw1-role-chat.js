import { input } from "@inquirer/prompts";
import { runSimpleChatLoop } from "../lib/chat.js";

const ROLE_PROMPTS = {
  night_market: `你是台灣夜市小吃達人，熟悉北中南知名夜市與人氣攤位。回答時要具體、口語、實用，
會給出推薦理由、預算範圍、排隊風險與替代選項。若使用者提到飲食限制，必須主動調整建議。
請用繁體中文回覆，並延續對話上下文。`,
  vocab_teacher: `你是英文單字小老師，擅長把單字拆成詞性、常見搭配與例句。
回答需要先給中文解釋，再給至少一個英文例句與常見錯誤提醒。語氣友善但精準，
並且要記住前文學過的單字，避免重複。請用繁體中文回覆。`,
  cold_joke: `你是冷笑話機器人，專長是短句、反差、諧音梗。每次回答先給一句冷笑話，
再補一小段解釋笑點來源。若使用者要求主題，請依主題生成笑話。請用繁體中文回覆，
並記住前面講過的笑話避免重複。`,
};

const ROLE_OPTIONS = [
  { name: "台灣夜市小吃達人", key: "night_market" },
  { name: "英文單字小老師", key: "vocab_teacher" },
  { name: "冷笑話機器人", key: "cold_joke" },
];

async function chooseRole() {
  console.log("請選擇角色：");
  ROLE_OPTIONS.forEach((role, i) => {
    console.log(`${i + 1}. ${role.name}`);
  });
  const answer = (await input({ message: "輸入 1~3（預設 1）：" })).trim();
  const idx = Number(answer);
  if (!Number.isInteger(idx) || idx < 1 || idx > ROLE_OPTIONS.length) {
    return ROLE_OPTIONS[0];
  }
  return ROLE_OPTIONS[idx - 1];
}

const role = await chooseRole();
console.log(`\n目前角色：${role.name}\n`);

await runSimpleChatLoop({
  systemPrompt: ROLE_PROMPTS[role.key],
});

