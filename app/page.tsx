"use client"

import { useState } from "react"
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleHelp,
  Code2,
  Command,
  Copy,
  KeyRound,
  Menu,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Terminal,
  Timer,
  Trash2,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react"
import "./styles.css"

type View =
  | "Chat"
  | "Playground"
  | "API"
  | "Models"
  | "Docs"
  | "Usage"
  | "API Health"
  | "Settings"

type CodeLanguage = "cURL" | "JavaScript" | "Python"
type DateRange = "1 day" | "7 days" | "30 days"

const navGroups = [
  {
    label: "BUILD",
    items: [
      { name: "Chat", icon: MessageSquare },
      { name: "Playground", icon: Terminal },
    ],
  },
  {
    label: "DEVELOP",
    items: [
      { name: "API", icon: Code2 },
      { name: "Models", icon: BrainCircuit },
      { name: "Docs", icon: BookOpen },
    ],
  },
  {
    label: "MONITOR",
    items: [
      { name: "Usage", icon: TrendingUp },
      { name: "API Health", icon: Activity },
    ],
  },
  {
    label: "SYSTEM",
    items: [{ name: "Settings", icon: Settings }],
  },
]

const models = [
  {
    name: "Veyra Core 70B",
    id: "veyra-core-70b",
    type: "Chat",
    context: "128K",
    status: "Available",
    speed: "Fast",
  },
  {
    name: "Veyra Swift 8B",
    id: "veyra-swift-8b",
    type: "Chat",
    context: "32K",
    status: "Available",
    speed: "Very fast",
  },
  {
    name: "Veyra Reason 32B",
    id: "veyra-reason-32b",
    type: "Reasoning",
    context: "64K",
    status: "Available",
    speed: "Balanced",
  },
  {
    name: "Veyra Vision",
    id: "veyra-vision-11b",
    type: "Multimodal",
    context: "32K",
    status: "Beta",
    speed: "Fast",
  },
]

export default function Home() {
  const [view, setView] = useState<View>("Chat")
  const [dark, setDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [commandOpen, setCommandOpen] = useState(false)
  const [workspace, setWorkspace] = useState({
    name: "Acme workspace",
    slug: "acme",
  })

  const renderView = () => {
    if (view === "Chat") return <ChatView />
    if (view === "Playground") return <PlaygroundView />
    if (view === "API") return <ApiView navigate={setView} />
    if (view === "Models") return <ModelsView navigate={setView} />
    if (view === "Docs") return <DocsView />
    if (view === "Usage") return <UsageView />
    if (view === "API Health") return <HealthView />

    return (
      <SettingsView
        workspace={workspace}
        setWorkspace={setWorkspace}
        dark={dark}
        setDark={setDark}
      />
    )
  }

  return (
    <main className={dark ? "app dark" : "app"}>
      <aside className={sidebarOpen ? "sidebar" : "sidebar collapsed"}>
        <div className="brand">
          <div className="brand-mark">V</div>

          {sidebarOpen && (
            <>
              <span>VEYRA</span>
              <span className="brand-tag">DEV</span>
            </>
          )}
        </div>

        {sidebarOpen && (
          <div className="workspace">
            <div className="workspace-icon">{workspace.name[0] || "V"}</div>

            <div>
              <strong>{workspace.name}</strong>
              <span>Free workspace</span>
            </div>

            <ChevronDown size={14} />
          </div>
        )}

        <nav>
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              {sidebarOpen && <div className="nav-label">{group.label}</div>}

              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <button
                    key={item.name}
                    className={
                      view === item.name
                        ? "nav-item active"
                        : "nav-item"
                    }
                    onClick={() => setView(item.name as View)}
                    title={item.name}
                  >
                    <Icon size={16} />

                    {sidebarOpen && <span>{item.name}</span>}

                    {item.name === "API" && sidebarOpen && (
                      <span className="new-dot" />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() => setView("Docs")}
          >
            <CircleHelp size={16} />

            {sidebarOpen && <span>Help center</span>}
          </button>

          <button
            className="profile"
            onClick={() => setView("Settings")}
            title="Open profile settings"
          >
            <div className="avatar">JD</div>

            {sidebarOpen && (
              <div>
                <strong>Jordan Davis</strong>
                <span>jordan@acme.co</span>
              </div>
            )}

            <ChevronDown size={14} />
          </button>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="crumb">
            <span>Workspace</span>
            <span className="slash">/</span>
            <strong>{view}</strong>
          </div>

          <div className="top-actions">
            <button
              className="top-link"
              onClick={() => setView("Docs")}
            >
              <BookOpen size={15} />
              Docs
            </button>

            <span className="status">
              <i />
              All systems operational
            </span>

            <button
              className="command-trigger"
              onClick={() => setCommandOpen(true)}
            >
              <Search size={15} />
              <span>Search</span>
              <kbd>⌘ K</kbd>
            </button>

            <button
              className="icon-button"
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </header>

        <div className="page">{renderView()}</div>
      </section>

      {commandOpen && (
        <CommandPalette
          close={() => setCommandOpen(false)}
          navigate={(nextView) => {
            setView(nextView)
            setCommandOpen(false)
          }}
        />
      )}
    </main>
  )
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="page-header">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}

      <div className="header-row">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {action}
      </div>
    </div>
  )
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`card ${className}`}>{children}</div>
}

function Status({
  children,
  tone = "green",
}: {
  children: React.ReactNode
  tone?: string
}) {
  return (
    <span className={`status-badge ${tone}`}>
      <i />
      {children}
    </span>
  )
}

function CopyButton({ text = "Copy" }: { text?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(text)
    } catch {
      // Clipboard access can be unavailable in some preview environments.
    }

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1200)
  }

  return (
    <button className="copy-button" onClick={copy}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : text}
    </button>
  )
}

function ChatView() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([])
  const [attached, setAttached] = useState(false)

  const send = () => {
    const trimmed = message.trim()

    if (!trimmed) return

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      {
        role: "assistant",
        text: `I can help with that. Here is a focused starting point for: ${trimmed}`,
      },
    ])

    setMessage("")
  }

  return (
    <>
      <PageHeader
        eyebrow="BUILD / CHAT"
        title="Chat"
        description="Test models and explore responses in a focused workspace."
        action={
          <button
            className="button secondary"
            onClick={() => setMessages([])}
          >
            <Trash2 size={16} />
            Clear
          </button>
        }
      />

      <div className="chat-shell">
        <div className="conversation-head">
          <div className="model-chip">
            <div className="model-glyph">
              <Bot size={15} />
            </div>

            <div>
              <strong>Veyra Core 70B</strong>
              <span>veyra-core-70b</span>
            </div>

            <ChevronDown size={14} />
          </div>

          <div className="conversation-actions">
            <span className="soft-label">
              {messages.length
                ? `${messages.length} messages`
                : "Unsaved conversation"}
            </span>

            <button
              className="icon-button"
              onClick={() => setMessage("Show model settings")}
              aria-label="Model settings"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-mark">
                <Sparkles size={22} />
              </div>

              <h2>What are you building?</h2>

              <p>
                Start a conversation with Veyra. Ask a question,
                generate code, or explore an idea.
              </p>

              <div className="prompt-suggestions">
                <button
                  onClick={() =>
                    setMessage(
                      "Explain how streaming works in the Veyra API"
                    )
                  }
                >
                  Explain streaming in the API
                  <ArrowUpRight size={14} />
                </button>

                <button
                  onClick={() =>
                    setMessage(
                      "Write a TypeScript function to summarize text"
                    )
                  }
                >
                  Write a TypeScript function
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((item, index) => (
                <div
                  className={`chat-message ${item.role}`}
                  key={`${item.text}-${index}`}
                >
                  <span className="avatar">
                    {item.role === "user" ? "JD" : "V"}
                  </span>

                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="composer">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing &&
                event.keyCode !== 229
              ) {
                event.preventDefault()
                send()
              }
            }}
            placeholder="Message Veyra..."
          />

          <div className="composer-actions">
            <label className="icon-button" title="Attach file">
              <Upload size={16} />

              <input
                type="file"
                hidden
                onChange={() => setAttached(true)}
              />
            </label>

            <span>
              {attached
                ? "File attached"
                : "Shift + Enter for new line"}
            </span>

            <button className="button primary" onClick={send}>
              <ArrowUpRight size={15} />
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function PlaygroundView() {
  const [tab, setTab] = useState("Request")
  const [ran, setRan] = useState(false)
  const [prompt, setPrompt] = useState(
    "Write a concise explanation of how transformer models work."
  )
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1024)
  const [messages, setMessages] = useState([
    "Write a concise explanation of how transformer models work.",
  ])

  const run = () => {
    setRan(true)
    setTab("Response")
  }

  return (
    <>
      <PageHeader
        eyebrow="BUILD / PLAYGROUND"
        title="Playground"
        description="Make requests, inspect responses, and generate production-ready code."
        action={
          <button className="button primary" onClick={run}>
            <Play size={15} />
            {ran ? "Run again" : "Run request"}
          </button>
        }
      />

      <div className="play-toolbar">
        <div className="method">POST</div>

        <div className="endpoint">
          <span>https://api.veyra.ai</span>
          /v1/chat/completions
        </div>

        <div className="toolbar-model">
          <Bot size={14} />
          veyra-core-70b
          <ChevronDown size={13} />
        </div>

        <span className="toolbar-spacer" />

        <button
          className="icon-button"
          onClick={() => setTab("Request")}
          aria-label="Request settings"
        >
          <Settings size={16} />
        </button>
      </div>

      <div className="playground-grid">
        <Card className="panel">
          <div className="panel-tabs">
            {["Request", "Response", "Code"].map((item) => (
              <button
                key={item}
                className={tab === item ? "tab active" : "tab"}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {tab === "Request" ? (
            <div className="request-body">
              <label>Messages</label>

              {messages.map((item, index) => (
                <div className="message-editor" key={index}>
                  <div className="editor-role">
                    <span className="role-dot user" />
                    user
                    <ChevronDown size={13} />

                    <button
                      onClick={() =>
                        setMessages(
                          messages.filter(
                            (_, messageIndex) =>
                              messageIndex !== index
                          )
                        )
                      }
                      aria-label="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <textarea
                    value={item}
                    onChange={(event) => {
                      const next = [...messages]
                      next[index] = event.target.value
                      setMessages(next)
                      setPrompt(event.target.value)
                    }}
                  />
                </div>
              ))}

              <button
                className="add-message"
                onClick={() =>
                  setMessages([...messages, ""])
                }
              >
                <Plus size={14} />
                Add message
              </button>

              <div className="parameter-header">
                <label>Parameters</label>

                <button
                  className="reset"
                  onClick={() => {
                    setTemperature(0.7)
                    setMaxTokens(1024)
                  }}
                >
                  Reset
                </button>
              </div>

              <div className="parameters">
                <div>
                  <span>Temperature</span>
                  <strong>{temperature.toFixed(1)}</strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(event) =>
                    setTemperature(Number(event.target.value))
                  }
                />

                <div>
                  <span>Max tokens</span>
                  <strong>{maxTokens}</strong>
                </div>

                <input
                  type="range"
                  min="128"
                  max="4096"
                  step="128"
                  value={maxTokens}
                  onChange={(event) =>
                    setMaxTokens(Number(event.target.value))
                  }
                />
              </div>
            </div>
          ) : tab === "Response" ? (
            <Response ran={ran} prompt={prompt} />
          ) : (
            <CodePanel />
          )}
        </Card>

        <Card className="panel response-panel">
          <div className="response-head">
            <div>
              <label>Response</label>
              <Status>200 OK</Status>
            </div>

            <span className="latency">
              <Timer size={13} />
              {ran ? "842ms" : "—"}
            </span>
          </div>

          <div className="response-content">
            {ran ? (
              <Response ran={ran} prompt={prompt} />
            ) : (
              <div className="response-placeholder">
                <Play size={20} />
                <span>Run a request to see the response.</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}

function Response({
  ran,
  prompt,
}: {
  ran: boolean
  prompt?: string
}) {
  const response = {
    id: ran ? "chatcmpl_demo" : "",
    object: "chat.completion",
    model: "veyra-core-70b",
    choices: ran
      ? [
          {
            index: 0,
            message: {
              role: "assistant",
              content: `A transformer model processes sequences using attention to relate tokens and generate context-aware output for: ${prompt}`,
            },
            finish_reason: "stop",
          },
        ]
      : [],
    usage: ran
      ? {
          prompt_tokens: 18,
          completion_tokens: 34,
          total_tokens: 52,
        }
      : {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
  }

  return (
    <div className="code-area">
      <pre>{JSON.stringify(response, null, 2)}</pre>
      <CopyButton text="Copy response" />
    </div>
  )
}

function CodePanel() {
  const [language, setLanguage] =
    useState<CodeLanguage>("cURL")

  const code: Record<CodeLanguage, string> = {
    "cURL": `curl https://api.veyra.ai/v1/chat/completions \\
  -H "Authorization: Bearer $VEYRA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"veyra-core-70b","messages":[{"role":"user","content":"Hello"}]}'`,

    JavaScript: `const response = await fetch("https://api.veyra.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.VEYRA_API_KEY}\`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "veyra-core-70b",
    messages: [{ role: "user", content: "Hello" }]
  })
});`,

    Python: `import os
import requests

response = requests.post(
    "https://api.veyra.ai/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {os.environ['VEYRA_API_KEY']}"
    },
    json={
        "model": "veyra-core-70b",
        "messages": [{"role": "user", "content": "Hello"}]
    }
)`,
  }

  return (
    <div className="code-panel">
      <div className="code-tabs">
        {(["cURL", "JavaScript", "Python"] as CodeLanguage[]).map(
          (item) => (
            <button
              key={item}
              className={
                language === item ? "code-active" : ""
              }
              onClick={() => setLanguage(item)}
            >
              {item}
            </button>
          )
        )}

        <CopyButton text={code[language]} />
      </div>

      <div className="code-area">
        <pre>{code[language]}</pre>
      </div>
    </div>
  )
}

function ApiView({
  navigate,
}: {
  navigate: (view: View) => void
}) {
  const [keys, setKeys] = useState([
    {
      id: 1,
      name: "Production key",
      value: "vra_live_••••••••••••8f2a",
      created: "Today",
      last: "Never",
    },
    {
      id: 2,
      name: "Development key",
      value: "vra_test_••••••••••••3c91",
      created: "Aug 24, 2024",
      last: "Never",
    },
  ])

  const createKey = () => {
    setKeys((current) => [
      ...current,
      {
        id: Date.now(),
        name: `Development key ${current.length + 1}`,
        value: `vra_test_••••••••••••${Math.random()
          .toString(16)
          .slice(2, 6)}`,
        created: "Just now",
        last: "Never",
      },
    ])
  }

  return (
    <>
      <PageHeader
        eyebrow="DEVELOP / API"
        title="API"
        description="Everything you need to integrate Veyra into your application."
        action={
          <button className="button primary" onClick={createKey}>
            <Plus size={15} />
            Create API key
          </button>
        }
      />

      <div className="metric-strip">
        <div>
          <span>API status</span>
          <strong>
            <i className="live-dot" />
            Operational
          </strong>
        </div>

        <div>
          <span>Requests this month</span>
          <strong>0</strong>
        </div>

        <div>
          <span>Workspace access</span>
          <strong>Free</strong>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>API keys</h2>
            <p>
              Keys authenticate requests to the Veyra API. Keep them
              secure.
            </p>
          </div>

          <button
            className="button secondary"
            onClick={() => navigate("Docs")}
          >
            <KeyRound size={15} />
            Documentation
          </button>
        </div>

        <Card>
          <div className="table">
            <div className="table-head key-grid">
              <span>Name</span>
              <span>Key</span>
              <span>Created</span>
              <span>Last used</span>
              <span />
            </div>

            {keys.length ? (
              keys.map((key) => (
                <div
                  className="table-row key-grid"
                  key={key.id}
                >
                  <div className="key-name">
                    <div className="key-icon">
                      <KeyRound size={14} />
                    </div>

                    <strong>{key.name}</strong>
                  </div>

                  <code>{key.value}</code>
                  <span>{key.created}</span>
                  <span>{key.last}</span>

                  <button
                    className="row-menu"
                    title={`Delete ${key.name}`}
                    onClick={() =>
                      setKeys(
                        keys.filter(
                          (item) => item.id !== key.id
                        )
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-settings">
                <KeyRound size={20} />
                <span>
                  No API keys. Create one when you are ready.
                </span>
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Endpoints</h2>
            <p>
              Available API endpoints and their current status.
            </p>
          </div>
        </div>

        <Card>
          <div className="table">
            <div className="table-head endpoint-grid">
              <span>Method</span>
              <span>Endpoint</span>
              <span>Description</span>
              <span>Status</span>
            </div>

            {[
              [
                "POST",
                "/v1/chat/completions",
                "Generate a model response",
              ],
              ["GET", "/v1/models", "List available models"],
              ["GET", "/v1/usage", "View usage statistics"],
              ["GET", "/v1/health", "Check API health"],
            ].map((row) => (
              <div
                className="table-row endpoint-grid"
                key={row[1]}
              >
                <span
                  className={`method-badge ${row[0].toLowerCase()}`}
                >
                  {row[0]}
                </span>

                <code>{row[1]}</code>
                <span>{row[2]}</span>
                <Status>Operational</Status>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  )
}

function ModelsView({
  navigate,
}: {
  navigate: (view: View) => void
}) {
  const [query, setQuery] = useState("")

  const filtered = models.filter((model) =>
    `${model.name} ${model.id}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <>
      <PageHeader
        eyebrow="DEVELOP / MODELS"
        title="Models"
        description="Explore Veyra's model lineup and find the right fit for your workload."
        action={
          <button
            className="button secondary"
            onClick={() => navigate("Docs")}
          >
            <BookOpen size={15} />
            Model docs
          </button>
        }
      />

      <div className="filter-row">
        <div className="search-input">
          <Search size={15} />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter models..."
          />
        </div>

        <span className="soft-label">
          {filtered.length} models
        </span>
      </div>

      <Card>
        <div className="table">
          <div className="table-head models-grid">
            <span>Model</span>
            <span>Type</span>
            <span>Context window</span>
            <span>Speed</span>
            <span>Status</span>
          </div>

          {filtered.map((model) => (
            <div
              className="table-row models-grid"
              key={model.id}
            >
              <div className="model-name">
                <div className="model-glyph">
                  <Bot size={15} />
                </div>

                <div>
                  <strong>{model.name}</strong>
                  <code>{model.id}</code>
                </div>
              </div>

              <span>{model.type}</span>
              <span>{model.context} tokens</span>
              <span>{model.speed}</span>

              <Status
                tone={
                  model.status === "Beta"
                    ? "blue"
                    : "green"
                }
              >
                {model.status}
              </Status>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

const docsContent: Record<
  string,
  {
    section: string
    read: string
    intro: string
    blocks: {
      title: string
      body: string
      code?: string
    }[]
  }
> = {
  Introduction: {
    section: "GETTING STARTED",
    read: "4 min read",
    intro:
      "Build intelligent applications with Veyra's fast, reliable language models.",
    blocks: [
      {
        title: "Build with Veyra",
        body:
          "Veyra is a developer-focused AI platform built around its own model, brain, tools, memory, retrieval, and API layers.",
      },
      {
        title: "What you can build",
        body:
          "Create chat experiences, coding tools, automations, model-powered applications, and developer workflows using the Veyra API.",
      },
    ],
  },

  Quickstart: {
    section: "GETTING STARTED",
    read: "6 min read",
    intro:
      "Send your first model request from a local project.",
    blocks: [
      {
        title: "Create a key",
        body:
          "Create a development key from API and keep it in an environment variable before sending requests.",
      },
      {
        title: "Create a request",
        body:
          "Send a model and messages array to the chat completions endpoint.",
        code: `curl http://localhost:3001/v1/chat/completions \\
  -H "Authorization: Bearer $VEYRA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"veyra-dev","messages":[{"role":"user","content":"Hello, Veyra"}]}'`,
      },
    ],
  },

  Authentication: {
    section: "GETTING STARTED",
    read: "3 min read",
    intro:
      "Authenticate API requests with a workspace key.",
    blocks: [
      {
        title: "Bearer authentication",
        body:
          "Send the key in the Authorization header. Never expose production keys in browser code or commit them to source control.",
      },
    ],
  },

  "First Request": {
    section: "GETTING STARTED",
    read: "4 min read",
    intro:
      "Understand the smallest valid chat completion request.",
    blocks: [
      {
        title: "Required fields",
        body:
          "Every request includes a model identifier and at least one message with a role and content.",
      },
    ],
  },

  "Chat Completions": {
    section: "API",
    read: "8 min read",
    intro:
      "Generate conversational responses with Veyra models.",
    blocks: [
      {
        title: "Endpoint",
        body:
          "POST /v1/chat/completions accepts messages and model information for generation.",
      },
      {
        title: "Streaming",
        body:
          "Streaming can deliver generated content incrementally when supported by the active model server.",
      },
    ],
  },

  Models: {
    section: "API",
    read: "5 min read",
    intro:
      "Understand the models exposed by your Veyra installation.",
    blocks: [
      {
        title: "Available models",
        body:
          "The current Veyra development model is exposed through the model registry and API. Additional model names shown in the console are interface placeholders until corresponding model implementations exist.",
      },
    ],
  },

  "API Keys": {
    section: "API",
    read: "4 min read",
    intro:
      "Create and manage keys for your workspace.",
    blocks: [
      {
        title: "Key safety",
        body:
          "Use development keys for testing, revoke unused credentials, and keep production credentials on your server.",
      },
    ],
  },

  Usage: {
    section: "API",
    read: "4 min read",
    intro:
      "Monitor request volume and token consumption.",
    blocks: [
      {
        title: "Usage metrics",
        body:
          "Usage reporting can track requests and token activity as the API becomes connected to the console.",
      },
    ],
  },

  Health: {
    section: "API",
    read: "2 min read",
    intro:
      "Check service availability before sending work.",
    blocks: [
      {
        title: "Health endpoint",
        body:
          "GET /v1/health returns operational information for the Veyra API.",
      },
    ],
  },

  Errors: {
    section: "API",
    read: "6 min read",
    intro:
      "Handle validation, authentication, and server errors.",
    blocks: [
      {
        title: "Error handling",
        body:
          "Check HTTP status codes and the returned error payload when a request cannot be processed.",
      },
    ],
  },

  "Using Veyra": {
    section: "GUIDES",
    read: "7 min read",
    intro:
      "Patterns for building reliable Veyra integrations.",
    blocks: [
      {
        title: "Development checklist",
        body:
          "Keep API keys server-side, validate requests, handle failures, and test against the health endpoint.",
      },
    ],
  },

  Playground: {
    section: "GUIDES",
    read: "3 min read",
    intro:
      "Iterate on requests before integrating them into an application.",
    blocks: [
      {
        title: "Try a request",
        body:
          "Edit the request message, adjust parameters, run it, and use the Code tab to inspect the request format.",
      },
    ],
  },

  "API Errors": {
    section: "GUIDES",
    read: "6 min read",
    intro:
      "Diagnose common API failures quickly.",
    blocks: [
      {
        title: "Debugging flow",
        body:
          "Confirm the endpoint, authorization header, model ID, JSON shape, and API health status.",
      },
    ],
  },

  Streaming: {
    section: "GUIDES",
    read: "8 min read",
    intro:
      "Deliver generated text incrementally when streaming is enabled.",
    blocks: [
      {
        title: "Streaming",
        body:
          "Consume streamed chunks and append generated content to the active response.",
      },
    ],
  },

  "API Reference": {
    section: "REFERENCE",
    read: "10 min read",
    intro:
      "Overview of the Veyra HTTP resources currently exposed by the API.",
    blocks: [
      {
        title: "Resources",
        body:
          "Use /v1/chat/completions for generation and /v1/health for API status. Other resources should only be documented once implemented by the backend.",
      },
    ],
  },

  Responses: {
    section: "REFERENCE",
    read: "5 min read",
    intro:
      "Interpret completion responses and metadata.",
    blocks: [
      {
        title: "Completion object",
        body:
          "A completion response contains generated content and model information according to the API implementation.",
      },
    ],
  },
}

function DocsView() {
  const [doc, setDoc] = useState("Introduction")
  const [query, setQuery] = useState("")

  const content =
    docsContent[doc] ?? docsContent.Introduction

  const groups = [
    [
      "GETTING STARTED",
      [
        "Introduction",
        "Quickstart",
        "Authentication",
        "First Request",
      ],
    ],
    [
      "API",
      [
        "Chat Completions",
        "Models",
        "API Keys",
        "Usage",
        "Health",
        "Errors",
      ],
    ],
    [
      "GUIDES",
      [
        "Using Veyra",
        "Playground",
        "API Errors",
        "Streaming",
      ],
    ],
    [
      "REFERENCE",
      ["API Reference", "Responses"],
    ],
  ] as const

  return (
    <div className="docs-layout">
      <aside className="docs-nav">
        <label className="docs-search">
          <Search size={14} />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search docs..."
          />

          <kbd>⌘ K</kbd>
        </label>

        {groups.map(([group, items]) => (
          <div className="docs-group" key={group}>
            <label>{group}</label>

            {items
              .filter(
                (item) =>
                  !query.trim() ||
                  item
                    .toLowerCase()
                    .includes(query.toLowerCase())
              )
              .map((item) => (
                <button
                  key={item}
                  className={
                    doc === item
                      ? "doc-link active"
                      : "doc-link"
                  }
                  onClick={() => setDoc(item)}
                >
                  {item}
                </button>
              ))}
          </div>
        ))}
      </aside>

      <article className="doc-article">
        <div className="eyebrow">{content.section}</div>

        <h1>{doc}</h1>

        <p className="lead">{content.intro}</p>

        <div className="doc-updated">
          Last updated Sep 19, 2026
          <span>·</span>
          {content.read}
        </div>

        {content.blocks.map((block, index) => (
          <section
            key={block.title}
            id={block.title
              .toLowerCase()
              .replaceAll(" ", "-")}
          >
            <h2>{block.title}</h2>

            <p>{block.body}</p>

            {block.code && (
              <div className="doc-code">
                <div>
                  <span>Example</span>
                  <CopyButton text={block.code} />
                </div>

                <pre>{block.code}</pre>
              </div>
            )}

            {index === 0 && (
              <div className="callout">
                <Zap size={17} />

                <div>
                  <strong>Tip</strong>

                  <p>
                    Use the Playground to test the request
                    shape before integrating the API.
                  </p>
                </div>
              </div>
            )}
          </section>
        ))}
      </article>

      <aside className="on-page">
        <label>ON THIS PAGE</label>

        {content.blocks.map((block) => (
          <a
            href={`#${block.title
              .toLowerCase()
              .replaceAll(" ", "-")}`}
            key={block.title}
          >
            {block.title}
          </a>
        ))}
      </aside>
    </div>
  )
}

function UsageView() {
  const [range, setRange] =
    useState<DateRange>("30 days")

  return (
    <>
      <PageHeader
        eyebrow="MONITOR / USAGE"
        title="Usage"
        description="Track requests and tokens across your workspace."
        action={
          <select
            className="button secondary"
            value={range}
            onChange={(event) =>
              setRange(
                event.target.value as DateRange
              )
            }
          >
            <option>1 day</option>
            <option>7 days</option>
            <option>30 days</option>
          </select>
        }
      />

      <div className="usage-metrics">
        <Card>
          <span>Total requests</span>
          <strong>0</strong>
          <small>No requests in the last {range}</small>
        </Card>

        <Card>
          <span>Tokens processed</span>
          <strong>0</strong>
          <small>No tokens processed yet</small>
        </Card>
      </div>

      <Card className="chart-card">
        <div className="chart-heading">
          <div>
            <h2>Requests</h2>
            <p>Daily request volume · {range}</p>
          </div>

          <div className="legend">
            <i />
            Requests
            <i className="orange" />
            Tokens
          </div>
        </div>

        <div className="chart">
          <div className="chart-y">
            <span>2k</span>
            <span>1.5k</span>
            <span>1k</span>
            <span>500</span>
            <span>0</span>
          </div>

          <div className="chart-lines">
            <div />
            <div />
            <div />
            <div />
            <div />

            <div className="chart-empty">
              <strong>No usage recorded yet</strong>
              <span>
                Run a request in Playground to see activity
                here.
              </span>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

function HealthView() {
  return (
    <>
      <PageHeader
        eyebrow="MONITOR / API HEALTH"
        title="API health"
        description="Real-time status and performance for Veyra services."
        action={
          <span className="status large">
            <i />
            All systems operational
          </span>
        }
      />

      <div className="health-summary">
        <div className="health-mark">
          <Check size={25} />
        </div>

        <div>
          <h2>Everything is operational</h2>
          <p>
            The Veyra API health endpoint is available.
          </p>
        </div>

        <span>Updated just now</span>
      </div>

      <div className="health-grid">
        {[
          ["API service", "Operational", "—", "—"],
          ["Model service", "Development", "—", "—"],
          ["Dashboard", "Operational", "—", "—"],
          ["Health endpoint", "Available", "—", "—"],
        ].map((item) => (
          <Card key={item[0]}>
            <div className="health-card-head">
              <span className="health-icon">
                <Activity size={16} />
              </span>

              <Status>{item[1]}</Status>
            </div>

            <h3>{item[0]}</h3>

            <div className="health-values">
              <span>
                <small>Uptime</small>
                <strong>{item[2]}</strong>
              </span>

              <span>
                <small>Latency</small>
                <strong>{item[3]}</strong>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

function SettingsView({
  workspace,
  setWorkspace,
  dark,
  setDark,
}: {
  workspace: { name: string; slug: string }
  setWorkspace: (value: {
    name: string
    slug: string
  }) => void
  dark: boolean
  setDark: (value: boolean) => void
}) {
  const [section, setSection] = useState("General")
  const [draft, setDraft] = useState(workspace)
  const [saved, setSaved] = useState(false)

  const sections = ["General", "Workspace", "Members"]

  return (
    <>
      <PageHeader
        eyebrow="SYSTEM / SETTINGS"
        title="Settings"
        description="Manage your workspace and developer preferences."
      />

      <div className="settings-layout">
        <aside className="settings-nav">
          {sections.map((item) => (
            <button
              key={item}
              className={
                section === item ? "active" : ""
              }
              onClick={() => setSection(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        <Card className="settings-content">
          {section === "General" ? (
            <>
              <div className="settings-section">
                <h2>General</h2>
                <p>
                  Update your workspace details and
                  preferences.
                </p>

                <label>
                  Workspace name

                  <input
                    value={draft.name}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        name: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Workspace slug

                  <div className="input-prefix">
                    <span>veyra.ai/</span>

                    <input
                      value={draft.slug}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          slug: event.target.value
                            .toLowerCase()
                            .replace(
                              /[^a-z0-9-]/g,
                              "-"
                            ),
                        })
                      }
                    />
                  </div>
                </label>

                <button
                  className="button primary"
                  onClick={() => {
                    setWorkspace(draft)
                    setSaved(true)

                    setTimeout(
                      () => setSaved(false),
                      1800
                    )
                  }}
                >
                  {saved ? (
                    <>
                      <Check size={15} />
                      Saved
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>

              <div className="settings-section">
                <h2>Appearance</h2>

                <p>
                  Customize how Veyra looks for you.
                </p>

                <div className="theme-options">
                  <button
                    className={!dark ? "selected" : ""}
                    onClick={() => setDark(false)}
                  >
                    <div className="light-preview" />
                    Light
                    {!dark && <Check size={14} />}
                  </button>

                  <button
                    className={dark ? "selected" : ""}
                    onClick={() => setDark(true)}
                  >
                    <div className="dark-preview" />
                    Dark
                    {dark && <Check size={14} />}
                  </button>

                  <button onClick={() => setDark(false)}>
                    <div className="system-preview" />
                    System
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="settings-section">
              <h2>{section}</h2>

              <p>
                {section === "Workspace"
                  ? "Your workspace is currently on the Free plan. Billing is not enabled."
                  : "Invite and member controls will be available when collaboration is enabled."}
              </p>

              <div className="empty-settings">
                <ShieldCheck size={20} />

                <span>
                  {section === "Workspace"
                    ? "No billing settings to configure on the Free plan."
                    : "No changes to configure yet."}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  )
}

function CommandPalette({
  close,
  navigate,
}: {
  close: () => void
  navigate: (view: View) => void
}) {
  const commands: View[] = [
    "Chat",
    "Playground",
    "API",
    "Models",
    "Docs",
    "Usage",
    "API Health",
    "Settings",
  ]

  const [query, setQuery] = useState("")

  const filtered = commands.filter((command) =>
    command.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="command-overlay" onClick={close}>
      <div
        className="command-palette"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="command-search">
          <Search size={17} />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search pages, docs, and actions..."
          />

          <kbd>ESC</kbd>
        </div>

        <div className="command-list">
          <label>QUICK NAVIGATION</label>

          {filtered.map((command, index) => (
            <button
              key={command}
              onClick={() => navigate(command)}
            >
              <span className="command-icon">
                {index < 2 ? (
                  <MessageSquare size={15} />
                ) : (
                  <Command size={15} />
                )}
              </span>

              {command}
            </button>
          ))}
        </div>

        <div className="command-foot">
          <span>Open</span>
          <span>
            <kbd>ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  )
}
