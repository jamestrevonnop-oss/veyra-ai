import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { config } from "../config/index.js";
import { AIEngine } from "../brain/engine/ai-engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webRoot = path.join(__dirname, "../web");
const indexPath = path.join(webRoot, "pages/chat.html");

const pageFiles = {
  "/": "pages/chat.html",
  "/chat": "pages/chat.html",
  "/api": "pages/api.html",
  "/usage": "pages/usage.html",
  "/health-page": "pages/health.html",
  "/models": "pages/models.html"
};

const assetTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

const dataRoot = path.join(__dirname, "../data");
const platformFile = path.join(dataRoot, "platform.json");

fs.mkdirSync(dataRoot, { recursive: true });

function loadPlatform() {
  if (!fs.existsSync(platformFile)) {
    return {
      apiKeys: [],
      usage: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        requests: []
      }
    };
  }

  try {
    return JSON.parse(fs.readFileSync(platformFile, "utf8"));
  } catch {
    return {
      apiKeys: [],
      usage: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        requests: []
      }
    };
  }
}

const platform = loadPlatform();

function savePlatform() {
  fs.writeFileSync(
    platformFile,
    JSON.stringify(platform, null, 2),
    "utf8"
  );
}

const engine = new AIEngine({
  provider: config.provider
});

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });

  response.end(JSON.stringify(data));
}

function sendHtml(response, html) {
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache"
  });

  response.end(html);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", chunk => {
      body += chunk;

      if (body.length > 1024 * 1024) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    request.on("error", reject);
  });
}

function createApiKey() {
  return `veyra_${crypto.randomBytes(24).toString("hex")}`;
}

function createRequestId() {
  return `req_${crypto.randomBytes(10).toString("hex")}`;
}

function recordUsage({
  status,
  endpoint,
  model,
  duration,
  error = null
}) {
  platform.usage.totalRequests += 1;

  if (status === "success") {
    platform.usage.successfulRequests += 1;
  } else {
    platform.usage.failedRequests += 1;
  }

  platform.usage.requests.unshift({
    id: createRequestId(),
    endpoint,
    model,
    status,
    duration,
    error,
    timestamp: new Date().toISOString()
  });

  platform.usage.requests =
    platform.usage.requests.slice(0, 100);

  savePlatform();
}

function validateApiKey(request) {
  const authorization =
    request.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const key = authorization.slice(7).trim();

  return platform.apiKeys.find(
    item => item.key === key && item.active
  ) || null;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(
    request.url,
    `http://${request.headers.host || "localhost"}`
  );

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    });

    response.end();
    return;
  }

  if (request.method === "GET" && pageFiles[url.pathname]) {
    try {
      const filePath = path.join(
        webRoot,
        pageFiles[url.pathname]
      );

      const html = fs.readFileSync(filePath, "utf8");

      sendHtml(response, html);
    } catch (error) {
      sendJson(response, 500, {
        error: "Web page failed to load",
        details: error.message
      });
    }

    return;
  }

  if (
    request.method === "GET" &&
    url.pathname.startsWith("/assets/")
  ) {
    try {
      const relative = url.pathname.replace(/^\/assets\//, "");
      const filePath = path.join(webRoot, "assets", relative);
      const extension = path.extname(filePath);

      if (!assetTypes[extension]) {
        sendJson(response, 404, {
          error: "Asset type not supported"
        });
        return;
      }

      const asset = fs.readFileSync(filePath);

      response.writeHead(200, {
        "Content-Type": assetTypes[extension],
        "Cache-Control": "no-cache"
      });

      response.end(asset);
    } catch (error) {
      sendJson(response, 404, {
        error: "Asset not found"
      });
    }

    return;
  }

  if (request.method === "GET" && url.pathname === "/") {
    try {
      const html = fs.readFileSync(indexPath, "utf8");
      sendHtml(response, html);
    } catch (error) {
      sendJson(response, 500, {
        error: "Web interface failed to load",
        details: error.message
      });
    }

    return;
  }

  if (request.method === "GET" && url.pathname === "/api") {
    sendJson(response, 200, {
      name: "Veyra AI",
      version: "0.2.0",
      status: "online",
      model: config.model
    });

    return;
  }

  if (request.method === "GET" && url.pathname === "/health") {
    const started = performance.now();

    sendJson(response, 200, {
      status: "healthy",
      service: "veyra-api",
      version: "0.2.0",
      model: config.model,
      uptime: Math.floor(process.uptime()),
      responseTime: `${Math.round(performance.now() - started)}ms`,
      timestamp: new Date().toISOString()
    });

    return;
  }

  if (request.method === "GET" && url.pathname === "/v1/models") {
    sendJson(response, 200, {
      object: "list",
      data: [
        {
          id: "veyra-dev",
          object: "model",
          owned_by: "veyra",
          status: "available",
          type: "development"
        }
      ]
    });

    return;
  }

  if (
    request.method === "POST" &&
    url.pathname === "/v1/api-keys"
  ) {
    try {
      const body = await readBody(request);

      const name =
        typeof body.name === "string" &&
        body.name.trim()
          ? body.name.trim()
          : "Untitled API";

      const key = createApiKey();

      const apiKey = {
        id: `key_${crypto.randomBytes(8).toString("hex")}`,
        name,
        key,
        active: true,
        createdAt: new Date().toISOString(),
        lastUsedAt: null
      };

      platform.apiKeys.unshift(apiKey);

      savePlatform();

      sendJson(response, 201, {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key,
        active: apiKey.active,
        createdAt: apiKey.createdAt
      });
    } catch (error) {
      sendJson(response, 400, {
        error: error.message
      });
    }

    return;
  }

  if (
    request.method === "GET" &&
    url.pathname === "/v1/api-keys"
  ) {
    sendJson(response, 200, {
      object: "list",
      data: platform.apiKeys.map(item => ({
        id: item.id,
        name: item.name,
        key: item.key,
        active: item.active,
        createdAt: item.createdAt,
        lastUsedAt: item.lastUsedAt
      }))
    });

    return;
  }

  if (
    request.method === "DELETE" &&
    url.pathname.startsWith("/v1/api-keys/")
  ) {
    const id = url.pathname.split("/").pop();

    const apiKey = platform.apiKeys.find(
      item => item.id === id
    );

    if (!apiKey) {
      sendJson(response, 404, {
        error: "API key not found"
      });

      return;
    }

    apiKey.active = false;

    savePlatform();

    sendJson(response, 200, {
      success: true,
      id
    });

    return;
  }

  if (
    request.method === "GET" &&
    url.pathname === "/v1/usage"
  ) {
    sendJson(response, 200, {
      totalRequests: platform.usage.totalRequests,
      successfulRequests:
        platform.usage.successfulRequests,
      failedRequests:
        platform.usage.failedRequests,
      activeKeys:
        platform.apiKeys.filter(key => key.active).length,
      requests: platform.usage.requests
    });

    return;
  }

  if (
    request.method === "POST" &&
    url.pathname === "/v1/chat/completions"
  ) {
    const started = performance.now();
    const apiKey = validateApiKey(request);

    try {
      const body = await readBody(request);

      if (!Array.isArray(body.messages)) {
        recordUsage({
          status: "error",
          endpoint: "/v1/chat/completions",
          model: body.model || config.model,
          duration: Math.round(performance.now() - started),
          error: "messages must be an array"
        });

        sendJson(response, 400, {
          error: {
            message: "messages must be an array",
            type: "invalid_request_error"
          }
        });

        return;
      }

      const result = await engine.generate(body.messages);

      if (apiKey) {
        apiKey.lastUsedAt = new Date().toISOString();
      }

      recordUsage({
        status: "success",
        endpoint: "/v1/chat/completions",
        model: result.model || config.model,
        duration: Math.round(performance.now() - started)
      });

      sendJson(response, 200, {
        id: result.id || createRequestId(),
        object: "chat.completion",
        model: result.model || config.model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: result.content
            },
            finish_reason: "stop"
          }
        ],
        veyra: {
          intent: result.intent,
          source: result.source,
          sources: result.sources || []
        }
      });
    } catch (error) {
      recordUsage({
        status: "error",
        endpoint: "/v1/chat/completions",
        model: config.model,
        duration: Math.round(performance.now() - started),
        error: error.message
      });

      sendJson(response, 500, {
        error: {
          message: error.message,
          type: "server_error"
        }
      });
    }

    return;
  }

  sendJson(response, 404, {
    error: {
      message: "Not found",
      path: url.pathname
    }
  });
});

server.listen(config.port, "0.0.0.0", () => {
  console.log("");
  console.log("=================================");
  console.log("        VEYRA AI PLATFORM        ");
  console.log("=================================");
  console.log(`Web:    http://localhost:${config.port}/`);
  console.log(`API:    http://localhost:${config.port}/api`);
  console.log(`Health: http://localhost:${config.port}/health`);
  console.log(`Models: http://localhost:${config.port}/v1/models`);
  console.log("");
});
