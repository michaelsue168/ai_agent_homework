const SAFE_EXPRESSION = /^[\d+\-*/().\s]+$/;

export const calculateTool = {
  type: "function",
  function: {
    name: "calculate",
    description: "Calculate a math expression and return the numeric result.",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "Math expression, e.g. (10 + 5) * 2 / 3",
        },
      },
      required: ["expression"],
    },
  },
};

export async function calculate({ expression }) {
  if (typeof expression !== "string" || expression.trim() === "") {
    return { error: "expression must be a non-empty string" };
  }

  if (!SAFE_EXPRESSION.test(expression)) {
    return { error: "expression contains invalid characters" };
  }

  try {
    // Safety: we validate expression characters before evaluation.
    const result = Function(`"use strict"; return (${expression});`)();
    if (typeof result !== "number" || Number.isNaN(result)) {
      return { error: "expression did not evaluate to a number" };
    }
    return { expression, result };
  } catch {
    return { error: "invalid math expression" };
  }
}

