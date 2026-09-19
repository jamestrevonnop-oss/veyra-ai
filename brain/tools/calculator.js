function safeExpression(expression) {
  return /^[0-9+\-*/().%\s]+$/.test(expression);
}

export function calculate(expression) {
  const cleaned = expression.trim();

  if (!cleaned) {
    throw new Error("Calculator expression is empty.");
  }

  if (!safeExpression(cleaned)) {
    throw new Error("Calculator only accepts arithmetic expressions.");
  }

  const result = Function(`"use strict"; return (${cleaned})`)();

  if (typeof result !== "number" || !Number.isFinite(result)) {
    throw new Error("Calculator produced an invalid result.");
  }

  return result;
}
