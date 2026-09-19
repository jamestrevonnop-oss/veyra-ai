const base = process.env.VEYRA_URL || "http://127.0.0.1:3000";

const tests = [
  ["GET", "/", 200],
  ["GET", "/chat", 200],
  ["GET", "/api", 200],
  ["GET", "/usage", 200],
  ["GET", "/health-page", 200],
  ["GET", "/models", 200],
  ["GET", "/assets/app.css", 200],
  ["GET", "/assets/app.js", 200],
  ["GET", "/health", 200],
  ["GET", "/v1/models", 200],
  ["GET", "/v1/usage", 200],
  ["GET", "/v1/api-keys", 200]
];

let failed = 0;

console.log("");
console.log("========================================");
console.log("       VEYRA STEP 8 UI TESTER");
console.log("========================================");
console.log("");

for (const [method, path, expected] of tests) {
  try {
    const response = await fetch(base + path, {
      method
    });

    const ok = response.status === expected;

    console.log(
      `${ok ? "PASS" : "FAIL"}  ${method.padEnd(4)} ${path.padEnd(25)} ${response.status}`
    );

    if (!ok) {
      failed++;
    }
  } catch (error) {
    console.log(
      `FAIL  ${method.padEnd(4)} ${path.padEnd(25)} ${error.message}`
    );

    failed++;
  }
}

console.log("");

try {
  const response = await fetch(
    `${base}/v1/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "Reply with exactly: Veyra test successful."
          }
        ]
      })
    }
  );

  const data = await response.json();

  const answer =
    data?.choices?.[0]?.message?.content || "";

  if (response.ok && answer.trim()) {
    console.log("PASS  POST /v1/chat/completions");
    console.log("      Response:", answer.slice(0, 160));
  } else {
    console.log("FAIL  POST /v1/chat/completions");
    console.log(JSON.stringify(data, null, 2));
    failed++;
  }
} catch (error) {
  console.log(
    "FAIL  POST /v1/chat/completions",
    error.message
  );

  failed++;
}

console.log("");

if (failed === 0) {
  console.log("========================================");
  console.log("ALL STEP 8 TESTS PASSED");
  console.log("========================================");
  process.exit(0);
}

console.log("========================================");
console.log(`${failed} TEST(S) FAILED`);
console.log("========================================");
process.exit(1);
