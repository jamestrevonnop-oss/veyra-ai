const state = {
  chat: [],
  sending: false
};

function $(selector) {
  return document.querySelector(selector);
}

function toast(message, type = "success") {
  let container = $(".toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const item = document.createElement("div");
  item.className = `toast ${type}`;
  item.textContent = message;

  container.appendChild(item);

  setTimeout(() => {
    item.remove();
  }, 3500);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      data?.error ||
      `Request failed with ${response.status}`
    );
  }

  return data;
}

function setupMobileNav() {
  const button = $(".mobile-toggle");
  const sidebar = $(".sidebar");

  if (!button || !sidebar) return;

  button.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  });
}

function renderChat() {
  const container = $("#chatMessages");

  if (!container) return;

  if (!state.chat.length) {
    container.innerHTML = `
      <div class="chat-empty">
        <h1>How can Veyra help?</h1>
        <p>
          Ask a question, work through an idea, write code,
          calculate something, or test the Veyra brain.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.chat.map(message => `
    <div class="message ${message.role}">
      <div class="message-avatar">
        ${message.role === "user" ? "YOU" : "V"}
      </div>
      <div class="message-body">
        <div class="message-role">
          ${message.role === "user" ? "You" : "Veyra"}
        </div>
        <div class="message-content"></div>
      </div>
    </div>
  `).join("");

  const contents = container.querySelectorAll(".message-content");

  state.chat.forEach((message, index) => {
    contents[index].textContent = message.content;
  });

  container.scrollTop = container.scrollHeight;
}

function setupChat() {
  const input = $("#chatInput");
  const send = $("#sendButton");

  if (!input || !send) return;

  function updateButton() {
    send.disabled =
      state.sending ||
      input.value.trim().length === 0;
  }

  async function sendMessage() {
    const content = input.value.trim();

    if (!content || state.sending) {
      return;
    }

    state.sending = true;
    updateButton();

    state.chat.push({
      role: "user",
      content
    });

    renderChat();

    input.value = "";
    input.style.height = "40px";

    try {
      const result = await api("/v1/chat/completions", {
        method: "POST",
        body: JSON.stringify({
          model: "veyra-dev",
          messages: state.chat
        })
      });

      const answer =
        result?.choices?.[0]?.message?.content ||
        "Veyra returned an empty response.";

      state.chat.push({
        role: "assistant",
        content: answer
      });

      renderChat();
    } catch (error) {
      state.chat.push({
        role: "assistant",
        content: `I couldn't complete that request.\n\n${error.message}`
      });

      renderChat();
      toast(error.message, "error");
    } finally {
      state.sending = false;
      updateButton();
      input.focus();
    }
  }

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height =
      Math.min(input.scrollHeight, 150) + "px";

    updateButton();
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  send.addEventListener("click", sendMessage);

  updateButton();
}

async function setupHealth() {
  const target = $("#healthContent");

  if (!target) return;

  try {
    const health = await api("/health");

    target.innerHTML = `
      <div class="grid grid-3">
        <div class="card stat">
          <div class="stat-label">Status</div>
          <div class="stat-value">
            <span class="badge success">Healthy</span>
          </div>
          <div class="stat-meta">${health.service}</div>
        </div>

        <div class="card stat">
          <div class="stat-label">Model</div>
          <div class="stat-value">${health.model}</div>
          <div class="stat-meta">Active model</div>
        </div>

        <div class="card stat">
          <div class="stat-label">Uptime</div>
          <div class="stat-value">${health.uptime}s</div>
          <div class="stat-meta">${health.responseTime}</div>
        </div>
      </div>

      <div class="card" style="margin-top:14px">
        <div class="card-header">
          <div class="card-title">API endpoints</div>
          <div class="card-description">
            Current Veyra platform endpoints.
          </div>
        </div>
        <div class="card-body">
          ${[
            ["GET", "/health"],
            ["GET", "/v1/models"],
            ["POST", "/v1/chat/completions"],
            ["GET", "/v1/api-keys"],
            ["POST", "/v1/api-keys"],
            ["GET", "/v1/usage"]
          ].map(([method, path]) => `
            <div class="endpoint">
              <div class="endpoint-method">${method}</div>
              <div class="endpoint-path">${path}</div>
              <span class="badge success">Available</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  } catch (error) {
    target.innerHTML = `
      <div class="card">
        <div class="empty">
          Health check failed: ${error.message}
        </div>
      </div>
    `;
  }
}

async function setupModels() {
  const target = $("#modelsContent");

  if (!target) return;

  try {
    const result = await api("/v1/models");

    const models = result.data || [];

    target.innerHTML = `
      <div class="grid grid-2">
        ${
          models.length
            ? models.map(model => `
              <div class="card">
                <div class="card-body">
                  <div style="display:flex;justify-content:space-between;gap:12px">
                    <div>
                      <div class="card-title">${model.id}</div>
                      <div class="card-description">
                        Owned by ${model.owned_by || "veyra"}
                      </div>
                    </div>
                    <span class="badge success">
                      ${model.status || "available"}
                    </span>
                  </div>

                  <div style="margin-top:18px;color:var(--muted);font-size:11px">
                    Type: ${model.type || "model"}
                  </div>
                </div>
              </div>
            `).join("")
            : `
              <div class="card">
                <div class="empty">No models available.</div>
              </div>
            `
        }
      </div>
    `;
  } catch (error) {
    target.innerHTML = `
      <div class="card">
        <div class="empty">
          Could not load models: ${error.message}
        </div>
      </div>
    `;
  }
}

async function setupUsage() {
  const target = $("#usageContent");

  if (!target) return;

  try {
    const result = await api("/v1/usage");

    const usage = result.usage || result;

    const requests = usage.requests || [];

    target.innerHTML = `
      <div class="grid grid-3">
        <div class="card stat">
          <div class="stat-label">Total requests</div>
          <div class="stat-value">${usage.totalRequests || 0}</div>
          <div class="stat-meta">All API requests</div>
        </div>

        <div class="card stat">
          <div class="stat-label">Successful</div>
          <div class="stat-value">${usage.successfulRequests || 0}</div>
          <div class="stat-meta">Completed requests</div>
        </div>

        <div class="card stat">
          <div class="stat-label">Failed</div>
          <div class="stat-value">${usage.failedRequests || 0}</div>
          <div class="stat-meta">Failed requests</div>
        </div>
      </div>

      <div class="card" style="margin-top:14px">
        <div class="card-header">
          <div class="card-title">Recent requests</div>
          <div class="card-description">
            Latest activity recorded by the Veyra API.
          </div>
        </div>

        <div class="table-wrap">
          ${
            requests.length
              ? `
                <table>
                  <thead>
                    <tr>
                      <th>Endpoint</th>
                      <th>Model</th>
                      <th>Status</th>
                      <th>Duration</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${requests.map(request => `
                      <tr>
                        <td>${request.endpoint || "-"}</td>
                        <td>${request.model || "-"}</td>
                        <td>
                          <span class="badge ${
                            request.status === "success"
                              ? "success"
                              : "warning"
                          }">
                            ${request.status}
                          </span>
                        </td>
                        <td>${request.duration ?? "-"}ms</td>
                        <td>
                          ${request.timestamp
                            ? new Date(request.timestamp).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              `
              : `<div class="empty">No API requests recorded yet.</div>`
          }
        </div>
      </div>
    `;
  } catch (error) {
    target.innerHTML = `
      <div class="card">
        <div class="empty">
          Could not load usage: ${error.message}
        </div>
      </div>
    `;
  }
}

async function setupApiKeys() {
  const target = $("#apiKeysContent");

  if (!target) return;

  async function loadKeys() {
    try {
      const result = await api("/v1/api-keys");
      const keys = result.data || [];

      target.innerHTML = `
        <div class="card">
          <div class="card-header">
            <div class="card-title">Create API key</div>
            <div class="card-description">
              Create a key for applications that connect to Veyra.
            </div>
          </div>

          <div class="card-body">
            <div class="form-row">
              <input
                id="newKeyName"
                class="input"
                placeholder="Key name, e.g. My App"
              />
              <button id="createKey" class="btn primary">
                Create key
              </button>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:14px">
          <div class="card-header">
            <div class="card-title">Your API keys</div>
            <div class="card-description">
              Keys are used by external applications to authenticate with Veyra.
            </div>
          </div>

          <div class="card-body">
            ${
              keys.length
                ? keys.map(key => `
                  <div class="key-box">
                    <div style="display:flex;justify-content:space-between;gap:10px">
                      <div>
                        <div style="font-size:12px;font-weight:700">
                          ${key.name}
                        </div>
                        <div style="margin-top:4px;color:var(--muted);font-size:10px">
                          Created ${new Date(key.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <span class="badge ${
                        key.active ? "success" : ""
                      }">
                        ${key.active ? "Active" : "Revoked"}
                      </span>
                    </div>

                    <div class="key-line" style="margin-top:12px">
                      <div
                        class="key-value"
                        data-key="${key.id}"
                        data-hidden="true"
                      >${maskKey(key.key)}</div>

                      <button
                        class="btn"
                        data-action="toggle"
                        data-id="${key.id}"
                      >
                        Show
                      </button>

                      <button
                        class="btn"
                        data-action="copy"
                        data-value="${key.key}"
                      >
                        Copy
                      </button>
                    </div>

                    ${
                      key.active
                        ? `
                          <div class="key-actions">
                            <button
                              class="btn danger"
                              data-action="revoke"
                              data-id="${key.id}"
                            >
                              Revoke key
                            </button>
                          </div>
                        `
                        : ""
                    }
                  </div>
                `).join("")
                : `<div class="empty">No API keys yet.</div>`
            }
          </div>
        </div>
      `;

      const createButton = $("#createKey");

      createButton?.addEventListener("click", async () => {
        const input = $("#newKeyName");
        const name = input.value.trim() || "Untitled API";

        createButton.disabled = true;

        try {
          await api("/v1/api-keys", {
            method: "POST",
            body: JSON.stringify({ name })
          });

          toast("API key created.");
          await loadKeys();
        } catch (error) {
          toast(error.message, "error");
        }
      });

      target.querySelectorAll("[data-action='toggle']").forEach(button => {
        button.addEventListener("click", () => {
          const value = target.querySelector(
            `[data-key="${button.dataset.id}"]`
          );

          if (!value) return;

          const key = value.parentElement
            ?.querySelector("[data-action='copy']")
            ?.dataset.value;

          if (!key) return;

          const hidden = value.dataset.hidden === "true";

          value.textContent = hidden
            ? key
            : maskKey(key);

          value.dataset.hidden = hidden ? "false" : "true";
          button.textContent = hidden ? "Hide" : "Show";
        });
      });

      target.querySelectorAll("[data-action='copy']").forEach(button => {
        button.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(
              button.dataset.value
            );

            toast("API key copied.");
          } catch {
            toast("Could not copy API key.", "error");
          }
        });
      });

      target.querySelectorAll("[data-action='revoke']").forEach(button => {
        button.addEventListener("click", async () => {
          try {
            await api(`/v1/api-keys/${button.dataset.id}`, {
              method: "DELETE"
            });

            toast("API key revoked.");
            await loadKeys();
          } catch (error) {
            toast(error.message, "error");
          }
        });
      });
    } catch (error) {
      target.innerHTML = `
        <div class="card">
          <div class="empty">
            Could not load API keys: ${error.message}
          </div>
        </div>
      `;
    }
  }

  await loadKeys();
}

function maskKey(key) {
  if (!key) return "••••••••••••••••••••";

  if (key.length <= 12) {
    return "••••••••••••";
  }

  return (
    key.slice(0, 7) +
    "••••••••••••••••••" +
    key.slice(-4)
  );
}

function setActiveNav() {
  const page = document.body.dataset.page;

  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setupMobileNav();

  if (document.body.dataset.page === "chat") {
    setupChat();
  }

  if (document.body.dataset.page === "api") {
    setupApiKeys();
  }

  if (document.body.dataset.page === "usage") {
    setupUsage();
  }

  if (document.body.dataset.page === "health") {
    setupHealth();
  }

  if (document.body.dataset.page === "models") {
    setupModels();
  }
});
