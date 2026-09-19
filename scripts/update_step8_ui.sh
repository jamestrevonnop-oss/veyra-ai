#!/usr/bin/env bash
set -e

ROOT="/workspaces/veyra-ai"
WEB="$ROOT/web"

cd "$ROOT"

mkdir -p "$WEB/pages" "$WEB/assets" "$ROOT/scripts"

echo "=========================================="
echo "        VEYRA STEP 8 UI UPDATE"
echo "=========================================="

cat > "$WEB/assets/app.css" <<'CSS'
:root {
  --bg: #ffffff;
  --sidebar: #f7f7f5;
  --panel: #ffffff;
  --panel-soft: #fafafa;
  --border: #e8e8e5;
  --text: #171716;
  --muted: #777773;
  --muted-2: #999995;
  --accent: #d97706;
  --accent-soft: #fff7ed;
  --success: #16803c;
  --danger: #c2410c;
  --shadow: 0 8px 30px rgba(0,0,0,.05);
  --sidebar-width: 228px;
  --radius: 12px;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  width: 100%;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background: var(--bg);
  color: var(--text);
}

body {
  overflow-x: hidden;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

.app {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--sidebar-width);
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 18px 12px;
  z-index: 50;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 9px 20px;
}

.brand-mark {
  width: 29px;
  height: 29px;
  border-radius: 9px;
  background: #171716;
  color: white;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 800;
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -.02em;
}

.brand-version {
  margin-left: auto;
  font-size: 10px;
  color: var(--muted-2);
}

.nav-section {
  margin-top: 8px;
}

.nav-label {
  padding: 0 10px 7px;
  color: var(--muted-2);
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: 9px;
  font-weight: 700;
}

.nav {
  display: grid;
  gap: 3px;
}

.nav-link {
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  border-radius: 8px;
  color: #646460;
  font-size: 13px;
  font-weight: 500;
  transition: .15s ease;
}

.nav-link:hover {
  background: #eeeeeb;
  color: var(--text);
}

.nav-link.active {
  background: #e9e9e5;
  color: var(--text);
  font-weight: 650;
}

.nav-icon {
  width: 17px;
  text-align: center;
  font-size: 14px;
}

.sidebar-bottom {
  margin-top: auto;
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

.status-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  color: var(--muted);
  font-size: 11px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--success);
}

.main {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  width: calc(100% - var(--sidebar-width));
  display: flex;
  flex-direction: column;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 58px;
  flex: 0 0 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  border-bottom: 1px solid var(--border);
  background: rgba(255,255,255,.94);
  backdrop-filter: blur(12px);
}

.page-title {
  font-size: 14px;
  font-weight: 650;
  letter-spacing: -.01em;
}

.page-subtitle {
  margin-left: 9px;
  color: var(--muted-2);
  font-size: 11px;
}

.connection {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 9px;
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--muted);
  background: var(--panel);
  font-size: 11px;
}

.connection-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
}

.content {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 30px;
}

.content.narrow {
  max-width: 980px;
}

.hero {
  margin-bottom: 26px;
}

.hero h1 {
  margin: 0;
  font-size: 25px;
  line-height: 1.15;
  letter-spacing: -.035em;
}

.hero p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
  max-width: 680px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.card-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 13px;
  font-weight: 700;
}

.card-description {
  margin-top: 4px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}

.card-body {
  padding: 20px;
}

.grid {
  display: grid;
  gap: 14px;
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stat {
  padding: 18px;
}

.stat-label {
  color: var(--muted);
  font-size: 11px;
}

.stat-value {
  margin-top: 9px;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: -.035em;
}

.stat-meta {
  margin-top: 5px;
  color: var(--muted-2);
  font-size: 10px;
}

.form-row {
  display: flex;
  gap: 8px;
}

.input {
  width: 100%;
  height: 38px;
  padding: 0 11px;
  border: 1px solid var(--border);
  border-radius: 8px;
  outline: none;
  background: white;
  color: var(--text);
  font-size: 12px;
}

.input:focus {
  border-color: #b8b8b2;
  box-shadow: 0 0 0 3px rgba(0,0,0,.035);
}

.btn {
  min-height: 36px;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0 12px;
  background: white;
  color: var(--text);
  font-size: 11px;
  font-weight: 600;
  transition: .15s ease;
}

.btn:hover {
  background: #f7f7f5;
}

.btn.primary {
  border-color: #171716;
  background: #171716;
  color: white;
}

.btn.primary:hover {
  background: #292927;
}

.btn.danger {
  color: var(--danger);
}

.key-box {
  margin-top: 16px;
  padding: 13px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--panel-soft);
}

.key-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.key-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: #555550;
}

.key-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th,
td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  font-size: 11px;
}

th {
  color: var(--muted);
  font-weight: 600;
  background: var(--panel-soft);
}

td {
  color: #444440;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 7px;
  border-radius: 6px;
  background: #f2f2ef;
  color: #666661;
  font-size: 9px;
  font-weight: 700;
}

.badge.success {
  background: #ecfdf3;
  color: var(--success);
}

.badge.warning {
  background: #fff7ed;
  color: var(--accent);
}

.endpoint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px solid var(--border);
}

.endpoint:last-child {
  border-bottom: 0;
}

.endpoint-method {
  min-width: 45px;
  font-family: ui-monospace, monospace;
  font-size: 10px;
  font-weight: 800;
}

.endpoint-path {
  flex: 1;
  font-family: ui-monospace, monospace;
  font-size: 11px;
}

.empty {
  padding: 35px 20px;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
}

.code {
  padding: 15px;
  overflow-x: auto;
  border-radius: 9px;
  background: #181817;
  color: #f3f3ef;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  line-height: 1.65;
  white-space: pre;
}

.chat-page {
  height: calc(100vh - 58px);
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 34px 30px 160px;
}

.chat-inner {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
}

.chat-empty {
  padding-top: 14vh;
  text-align: center;
}

.chat-empty h1 {
  margin: 0;
  font-size: 28px;
  letter-spacing: -.045em;
}

.chat-empty p {
  margin: 9px auto 0;
  max-width: 460px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

.message {
  display: flex;
  gap: 12px;
  margin: 0 0 27px;
}

.message-avatar {
  flex: 0 0 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 800;
}

.message.user .message-avatar {
  background: #ecece8;
}

.message.assistant .message-avatar {
  background: #171716;
  color: white;
}

.message-body {
  min-width: 0;
  flex: 1;
}

.message-role {
  margin-bottom: 5px;
  font-size: 10px;
  font-weight: 700;
  color: var(--muted);
}

.message-content {
  color: #292925;
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.chat-composer-wrap {
  position: fixed;
  left: var(--sidebar-width);
  right: 0;
  bottom: 0;
  padding: 14px 30px 20px;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,.96) 22%
  );
  pointer-events: none;
}

.chat-composer {
  pointer-events: auto;
  max-width: 820px;
  margin: 0 auto;
  padding: 10px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 13px;
  box-shadow: 0 10px 35px rgba(0,0,0,.09);
}

.chat-input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chat-input {
  flex: 1;
  min-height: 40px;
  max-height: 150px;
  resize: none;
  border: 0;
  outline: 0;
  padding: 9px 10px;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  line-height: 1.5;
}

.send-btn {
  width: 37px;
  height: 37px;
  flex: 0 0 37px;
  border: 0;
  border-radius: 9px;
  background: #171716;
  color: white;
  font-size: 14px;
}

.send-btn:disabled {
  opacity: .4;
  cursor: default;
}

.composer-meta {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px 1px;
  color: var(--muted-2);
  font-size: 9px;
}

.mobile-toggle {
  display: none;
}

.toast-container {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 100;
  display: grid;
  gap: 8px;
}

.toast {
  width: min(340px, calc(100vw - 36px));
  padding: 11px 13px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,.1);
  color: #3f3f3b;
  font-size: 11px;
}

.toast.error {
  border-color: #fed7aa;
}

.toast.success {
  border-color: #bbf7d0;
}

.loading {
  opacity: .65;
}

@media (max-width: 900px) {
  :root {
    --sidebar-width: 68px;
  }

  .brand {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
  }

  .brand-name,
  .brand-version,
  .nav-label,
  .nav-link span:not(.nav-icon),
  .status-mini span:not(.status-dot) {
    display: none;
  }

  .nav-link {
    justify-content: center;
    padding: 0;
  }

  .sidebar-bottom {
    display: flex;
    justify-content: center;
  }

  .topbar {
    padding: 0 18px;
  }

  .content {
    padding: 22px 18px;
  }

  .chat-composer-wrap {
    left: var(--sidebar-width);
    padding-left: 18px;
    padding-right: 18px;
  }

  .chat-messages {
    padding-left: 18px;
    padding-right: 18px;
  }
}

@media (max-width: 650px) {
  :root {
    --sidebar-width: 0px;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: transform .2s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .mobile-toggle {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: white;
  }

  .topbar {
    padding: 0 12px;
  }

  .page-subtitle,
  .connection {
    display: none;
  }

  .content {
    padding: 20px 14px;
  }

  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }

  .form-row {
    flex-direction: column;
  }

  .chat-composer-wrap {
    left: 0;
    padding: 10px 10px 13px;
  }

  .chat-messages {
    padding: 22px 12px 140px;
  }

  .chat-empty h1 {
    font-size: 24px;
  }
}
CSS

cat > "$WEB/assets/app.js" <<'JS'
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
JS

create_page() {
  local file="$1"
  local page="$2"
  local title="$3"
  local body="$4"

  cat > "$WEB/pages/$file" <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1.0"
  >
  <title>Veyra — $title</title>
  <link rel="stylesheet" href="/assets/app.css">
</head>

<body data-page="$page">

<div class="app">

  <aside class="sidebar">

    <div class="brand">
      <div class="brand-mark">V</div>
      <div class="brand-name">Veyra</div>
      <div class="brand-version">0.2</div>
    </div>

    <div class="nav-section">
      <div class="nav-label">Workspace</div>

      <nav class="nav">
        <a class="nav-link" data-page="chat" href="/chat">
          <span class="nav-icon">⌁</span>
          <span>Chat</span>
        </a>

        <a class="nav-link" data-page="api" href="/api">
          <span class="nav-icon">⌘</span>
          <span>API</span>
        </a>

        <a class="nav-link" data-page="usage" href="/usage">
          <span class="nav-icon">◫</span>
          <span>Usage</span>
        </a>

        <a class="nav-link" data-page="health" href="/health-page">
          <span class="nav-icon">◉</span>
          <span>API Health</span>
        </a>

        <a class="nav-link" data-page="models" href="/models">
          <span class="nav-icon">◇</span>
          <span>Models</span>
        </a>
      </nav>
    </div>

    <div class="sidebar-bottom">
      <div class="status-mini">
        <span class="status-dot"></span>
        <span>Veyra API connected</span>
      </div>
    </div>

  </aside>

  <main class="main">

    <header class="topbar">
      <div style="display:flex;align-items:center">
        <button class="mobile-toggle" aria-label="Open menu">☰</button>
        <div class="page-title">$title</div>
        <div class="page-subtitle">Veyra AI Platform</div>
      </div>

      <div class="connection">
        <span class="connection-dot"></span>
        Connected
      </div>
    </header>

    $body

  </main>

</div>

<div class="toast-container"></div>

<script src="/assets/app.js"></script>

</body>
</html>
HTML
}

create_page \
  "chat.html" \
  "chat" \
  "Chat" \
  '
<section class="chat-page">

  <div id="chatMessages" class="chat-messages">
    <div class="chat-inner"></div>
  </div>

  <div class="chat-composer-wrap">
    <div class="chat-composer">

      <div class="chat-input-row">

        <textarea
          id="chatInput"
          class="chat-input"
          rows="1"
          placeholder="Message Veyra..."
          autocomplete="off"
        ></textarea>

        <button
          id="sendButton"
          class="send-btn"
          disabled
          aria-label="Send"
        >
          ↑
        </button>

      </div>

      <div class="composer-meta">
        <span>Enter to send · Shift + Enter for new line</span>
        <span>veyra-dev</span>
      </div>

    </div>
  </div>

</section>
'

create_page \
  "api.html" \
  "api" \
  "API" \
  '
<div class="content narrow">

  <div class="hero">
    <h1>API</h1>
    <p>
      Manage API keys and connect external applications to the Veyra platform.
    </p>
  </div>

  <div id="apiKeysContent"></div>

  <div class="card" style="margin-top:14px">

    <div class="card-header">
      <div class="card-title">Quick start</div>
      <div class="card-description">
        Send your first request from an external application.
      </div>
    </div>

    <div class="card-body">
      <div class="code">curl -X POST http://localhost:3000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_VEYRA_API_KEY" \\
  -d '\''{
    "model": "veyra-dev",
    "messages": [
      {
        "role": "user",
        "content": "Hello Veyra"
      }
    ]
  }'\''</div>
    </div>

  </div>

</div>
'

create_page \
  "usage.html" \
  "usage" \
  "Usage" \
  '
<div class="content">

  <div class="hero">
    <h1>Usage</h1>
    <p>
      Monitor requests flowing through your Veyra API.
    </p>
  </div>

  <div id="usageContent"></div>

</div>
'

create_page \
  "health.html" \
  "health" \
  "API Health" \
  '
<div class="content">

  <div class="hero">
    <h1>API Health</h1>
    <p>
      Live status and availability of the Veyra API service.
    </p>
  </div>

  <div id="healthContent"></div>

</div>
'

create_page \
  "models.html" \
  "models" \
  "Models" \
  '
<div class="content">

  <div class="hero">
    <h1>Models</h1>
    <p>
      Models currently exposed through the Veyra platform.
    </p>
  </div>

  <div id="modelsContent"></div>

</div>
'

python - <<'PY'
from pathlib import Path

path = Path("api/server.js")
text = path.read_text()

old = '''const indexPath = path.join(webRoot, "index.html");'''

new = '''const indexPath = path.join(webRoot, "pages/chat.html");

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
};'''

if old in text:
    text = text.replace(old, new, 1)

marker = '''  if (request.method === "GET" && url.pathname === "/") {'''

replacement = '''  if (request.method === "GET" && pageFiles[url.pathname]) {
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
      const relative = url.pathname.replace(/^\\/assets\\//, "");
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

  if (request.method === "GET" && url.pathname === "/") {'''

if marker in text and "pageFiles[url.pathname]" not in text:
    text = text.replace(marker, replacement, 1)

path.write_text(text)
PY

cat > "$ROOT/scripts/test_step8_ui.mjs" <<'JS'
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
JS

chmod +x scripts/update_step8_ui.sh

echo ""
echo "UI files created."
echo "Testing JavaScript syntax..."

node --check scripts/test_step8_ui.mjs
node --check api/server.js

echo ""
echo "=========================================="
echo "STEP 8 UI UPDATE COMPLETE"
echo "=========================================="
echo ""
echo "IMPORTANT:"
echo "Restart the Veyra Node server so the new routes load."
echo ""
echo "Run:"
echo "  npm start"
echo ""
echo "Then in another terminal:"
echo "  node scripts/test_step8_ui.mjs"
echo ""
echo "Pages:"
echo "  /chat"
echo "  /api"
echo "  /usage"
echo "  /health-page"
echo "  /models"
echo ""
