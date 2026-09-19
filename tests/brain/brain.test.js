import test from "node:test";
import assert from "node:assert/strict";

import { AIEngine } from "../../brain/engine/ai-engine.js";
import { MemoryStore } from "../../brain/memory/memory-store.js";
import { ReasoningRouter } from "../../brain/reasoning/reasoning-router.js";

const engine = new AIEngine({
  provider: "mock"
});

test("Veyra routes knowledge questions to its knowledge base", async () => {
  const result = await engine.generate([
    {
      role: "user",
      content: "What is quantum physics?"
    }
  ]);

  assert.equal(result.source, "knowledge");
  assert.match(result.content, /quantum physics/i);
});

test("Veyra can use the calculator tool", async () => {
  const result = await engine.generate([
    {
      role: "user",
      content: "calculate 12 * 8"
    }
  ]);

  assert.equal(result.source, "calculator");
  assert.match(result.content, /96/);
});

test("Veyra falls back to the model", async () => {
  const result = await engine.generate([
    {
      role: "user",
      content: "Hello Veyra"
    }
  ]);

  assert.equal(result.source, "model");
});

test("reasoning router recognizes planning and summarization", () => {
  const router = new ReasoningRouter();

  assert.equal(
    router.classify("Help me plan a trip to Japan"),
    "planning"
  );

  assert.equal(
    router.classify("Summarize this article in three bullet points"),
    "summarization"
  );
});

test("memory keeps separate conversations isolated", () => {
  const memory = new MemoryStore();

  memory.add(
    "user",
    "My name is Alex.",
    {
      type: "fact",
      key: "name",
      value: "Alex"
    },
    "session-a"
  );

  memory.add(
    "user",
    "My name is Sam.",
    {
      type: "fact",
      key: "name",
      value: "Sam"
    },
    "session-b"
  );

  assert.deepEqual(memory.getConversation("session-a").length, 1);
  assert.deepEqual(memory.getConversation("session-b").length, 1);
  assert.equal(
    memory.findUserFacts("session-a")[0].metadata.value,
    "Alex"
  );
  assert.equal(
    memory.findUserFacts("session-b")[0].metadata.value,
    "Sam"
  );
});

test("memory remembers names and previous questions across turns", async () => {
  const brain = new AIEngine({ provider: "mock" }).brain;

  const first = await brain.think([
    { role: "user", content: "My name is Alex." }
  ], "session-turns");

  const second = await brain.think([
    { role: "user", content: "What is my name?" }
  ], "session-turns");

  assert.match(first.content, /remember/i);
  assert.match(second.content, /Alex/i);

  const history = brain.memory.getConversation("session-turns");
  assert.ok(history.some(item => item.content.includes("Alex")));
});
