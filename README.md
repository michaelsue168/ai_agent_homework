# AI Agent Homework (1~5)

本專案為 `guid.md` 的五題作業完整實作，採獨立 `assignments/` 專案。

## Environment

1. Node.js `>=22`
2. 複製 `.env.example` 為 `.env`
3. 設定：
   - `OPENAI_API_KEY`
   - `OPENWEATHER_API_KEY`

## Install

```bash
npm install
```

## Run Commands

```bash
npm run hw1          # 作業1：角色聊天機器人
npm run hw2          # 作業2：Function Calling 計算機
npm run hw3:build    # 作業3：建立迷你知識庫向量
npm run hw3:search   # 作業3：測試知識庫查詢
npm run hw4          # 作業4：整合時間與天氣工具
npm run hw5          # 作業5：向量相似度實驗
npm run test:manual  # 手動驗收提示
```

## Assignment Mapping

- 作業1：`src/assignments/hw1-role-chat.js`
- 作業2：`src/assignments/hw2-calculator.js`, `src/tools/calculate.js`
- 作業3：`src/assignments/hw3-kb-build.js`, `src/assignments/hw3-kb-search.js`
- 作業4：`src/assignments/hw4-weather-time.js`, `src/tools/time.js`, `src/tools/weather.js`
- 作業5：`src/assignments/hw5-similarity.js`

## Manual Verification Checklist

1. 作業1：對話至少 5 輪，確認角色一致且可記住前文。
2. 作業2：測試 `10 + 5 * 2`、`(9 - 1) / 2` 與非法輸入 `2 + abc`。
3. 作業3：先 `hw3:build`，再用 3 種問法查詢，確認 Top 結果相關。
4. 作業4：測試「現在幾點？」「台北天氣如何？」「現在幾點？台北天氣好嗎？」。
5. 作業5：檢查「語意接近組」分數高於「語意不同組」。

