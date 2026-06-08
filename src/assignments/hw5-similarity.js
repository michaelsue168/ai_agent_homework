import { embedMany } from "../lib/embeddings.js";
import { cosineSimilarity, round } from "../utils/math.js";

const sentenceGroups = [
  {
    name: "第1組（語意接近）",
    sentences: ["我喜歡貓", "貓咪很可愛", "我養了一隻貓"],
  },
  {
    name: "第2組（語意不同）",
    sentences: ["今天天氣很好", "我要去買菜", "電腦壞了"],
  },
  {
    name: "第3組（自訂案例）",
    sentences: ["我想安排沖繩旅遊", "沖繩自由行行程怎麼排", "如何學習線性代數"],
  },
];

function pairwiseScores(vectors) {
  const scores = [];
  for (let i = 0; i < vectors.length; i += 1) {
    for (let j = i + 1; j < vectors.length; j += 1) {
      scores.push({ i, j, score: cosineSimilarity(vectors[i], vectors[j]) });
    }
  }
  return scores;
}

console.log("作業5：向量相似度實驗\n");

for (const group of sentenceGroups) {
  const vectors = await embedMany(group.sentences);
  const scores = pairwiseScores(vectors);
  const avg =
    scores.reduce((acc, item) => acc + item.score, 0) / Math.max(scores.length, 1);

  console.log(group.name);
  group.sentences.forEach((s, idx) => {
    console.log(`  ${idx + 1}. ${s}`);
  });

  scores.forEach((item) => {
    console.log(
      `  sim(句${item.i + 1}, 句${item.j + 1}) = ${round(item.score)}`,
    );
  });
  console.log(`  平均相似度 = ${round(avg)}\n`);
}

console.log("分析建議：第1組平均分數應顯著高於第2組。");

