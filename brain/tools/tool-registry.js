import { calculate } from "./calculator.js";

export class ToolRegistry {
  constructor() {
    this.tools = new Map();

    this.register("calculator", {
      description: "Performs basic arithmetic.",
      execute: calculate
    });
  }

  register(name, tool) {
    if (!name || !tool || typeof tool.execute !== "function") {
      throw new Error("Invalid tool registration.");
    }

    this.tools.set(name, tool);
  }

  has(name) {
    return this.tools.has(name);
  }

  async execute(name, input) {
    const tool = this.tools.get(name);

    if (!tool) {
      throw new Error(`Unknown Veyra tool: ${name}`);
    }

    return tool.execute(input);
  }

  list() {
    return [...this.tools.entries()].map(([name, tool]) => ({
      name,
      description: tool.description
    }));
  }
}
