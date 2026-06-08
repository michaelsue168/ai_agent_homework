import ora from "ora";

export function spinner(text = "等待回覆中...") {
  return ora(text);
}

