import test from "node:test";
import assert from "node:assert/strict";
import {
  createMessage,
  createConversation
} from "../../brain/context/messages.js";

test("creates a valid message", () => {
  const message = createMessage("user", "Hello");

  assert.deepEqual(message, {
    role: "user",
    content: "Hello"
  });
});

test("creates a conversation", () => {
  const conversation = createConversation([
    {
      role: "user",
      content: "Hello"
    }
  ]);

  assert.equal(conversation.length, 1);
  assert.equal(conversation[0].role, "user");
});

test("rejects invalid message content", () => {
  assert.throws(() => {
    createMessage("user", 123);
  });
});
