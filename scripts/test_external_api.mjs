const BASE_URL = "http://127.0.0.1:3000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return {
    status: response.status,
    data
  };
}

console.log("========================================");
console.log("       VEYRA EXTERNAL API TEST");
console.log("========================================");

const health = await request("/health");

console.log("\nAPI HEALTH");
console.log("Status:", health.status);
console.log(health.data);

if (health.status !== 200) {
  process.exit(1);
}

const models = await request("/v1/models");

console.log("\nMODELS");
console.log("Status:", models.status);
console.log(models.data);

if (models.status !== 200) {
  process.exit(1);
}

const chat = await request("/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "veyra-dev",
    messages: [
      {
        role: "user",
        content: "Hello Veyra. Give me a one sentence greeting."
      }
    ]
  })
});

console.log("\nCHAT COMPLETION");
console.log("Status:", chat.status);
console.log(JSON.stringify(chat.data, null, 2));

if (chat.status !== 200) {
  process.exit(1);
}

const content =
  chat.data?.choices?.[0]?.message?.content ??
  chat.data?.content ??
  "";

if (!content) {
  console.error("\nFAIL: API returned no assistant content.");
  process.exit(1);
}

console.log("\n========================================");
console.log("EXTERNAL API TEST PASSED");
console.log("========================================");
