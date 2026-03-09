# AI Chat Assistant Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a slide-out AI chat panel where investors ask questions about the UCSA business plan, with conversations saved to Vercel KV and emailed as transcripts.

**Architecture:** Vercel Serverless functions handle Claude API calls and email. React frontend renders a slide-out chat panel. Vercel KV stores conversations. Resend sends email transcripts to two addresses.

**Tech Stack:** React 19, Vite 7, Vercel Serverless Functions (Node.js), Anthropic SDK, Vercel KV (`@vercel/kv`), Resend (`resend`), inline styles (no CSS framework — matches existing app).

**Design doc:** `docs/plans/2026-03-09-ai-chat-design.md`

**Existing app context:**
- Entry: `src/main.jsx` → `<PasswordGate>` → `<App />`
- Theme: `src/theme.js` — dark theme, colors: bg `#080E1A`, surface `#0D1526`, accent `#C4D32F`
- No existing backend, no API routes, no .env file
- Deployed on Vercel from GitHub (`SprudelDigital/ucsa-ops-model`)
- Pure client-side SPA with inline styles throughout

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install server-side dependencies**

```bash
cd "/Users/reubennaude/Cursor/UCSA App/ucsa-ops-model"
npm install @anthropic-ai/sdk @vercel/kv resend
```

These are server-side only (used in `api/` functions), but Vercel resolves them from the root `package.json`.

**Step 2: Verify install succeeded**

```bash
cat package.json | grep -E "anthropic|vercel/kv|resend"
```

Expected: Three new entries in `dependencies`.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add anthropic, vercel/kv, and resend dependencies"
```

---

### Task 2: Convert V4 PDF to markdown source document

**Files:**
- Create: `src/data/businessPlan.md`

**Step 1: Convert the PDF**

Read the PDF at `/Users/reubennaude/Library/CloudStorage/OneDrive-SprudelPtyLtd/Sprudel/Clients/UCSA/Claude Analysis/UCSA Business Plan V4 Source.pdf` and convert it to clean markdown.

Rules for conversion:
- Strip all page numbers, headers/footers, table of contents page references
- Convert tables to markdown tables
- Preserve all financial figures exactly
- Remove any "V4" or version references (investor-facing)
- Use `##` for sections, `###` for subsections
- Keep it concise — remove redundant formatting but preserve all content
- Target: ~15-20K tokens

**Step 2: Verify the file is readable**

```bash
wc -l src/data/businessPlan.md
```

Expected: 400-800 lines of clean markdown.

**Step 3: Commit**

```bash
git add src/data/businessPlan.md
git commit -m "feat: add business plan markdown for AI chat context"
```

---

### Task 3: Create the chat API endpoint

**Files:**
- Create: `api/chat.js`

**Step 1: Create the `api/` directory**

```bash
ls -la api/ 2>/dev/null || mkdir api
```

**Step 2: Write the chat endpoint**

Create `api/chat.js`:

```javascript
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";
import { readFileSync } from "fs";
import { join } from "path";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Load source documents at cold start (cached across invocations)
const businessPlanMd = readFileSync(
  join(process.cwd(), "src/data/businessPlan.md"),
  "utf-8"
);

const SYSTEM_PROMPT = `You are the UCSA Asset Company business plan assistant. You help investors and team members understand the business plan.

PERSONALITY: Knowledgeable, conversational, professional. You can discuss the SA energy market, solar economics, and regulatory context when relevant.

RULES:
- Ground all financial figures in the source data — never fabricate numbers
- When citing specific numbers, reference which scenario (Base Case, DFI Confirmed, or Stress)
- If asked something not covered by the plan, say so honestly
- Never disclose that you are reading from a specific document or data file
- Format currency as "ZAR X.XM" consistently
- Keep answers concise but thorough — investors' time is valuable
- Use plain text formatting — bold with asterisks, bullet points with dashes

SOURCE DOCUMENT:
${businessPlanMd}`;

const MAX_MESSAGES = 50;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId, name, message, history } = req.body;

    if (!sessionId || !name || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Rate limit check
    const session = await kv.get(`session:${sessionId}`);
    if (session && session.messages && session.messages.length >= MAX_MESSAGES * 2) {
      return res.status(429).json({ error: "Session message limit reached" });
    }

    // Build messages array from history
    const messages = [
      ...(history || []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    // Call Claude API with prompt caching
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT + `\n\nThe investor's name is: ${name}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    const assistantMessage = response.content[0].text;

    // Save to KV
    const now = new Date().toISOString();
    const updatedSession = {
      name,
      startedAt: session?.startedAt || now,
      ended: false,
      messages: [
        ...(session?.messages || []),
        { role: "user", content: message, timestamp: now },
        { role: "assistant", content: assistantMessage, timestamp: now },
      ],
    };

    await kv.set(`session:${sessionId}`, updatedSession, { ex: 86400 * 30 }); // 30 day TTL

    return res.status(200).json({ response: assistantMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
```

**Important notes for the implementer:**
- The model is `claude-sonnet-4-20250514` (Sonnet for cost efficiency — change to `claude-opus-4-20250514` if the user requests Opus)
- `cache_control: { type: "ephemeral" }` enables prompt caching on the system prompt
- KV entries expire after 30 days (`ex: 86400 * 30`)
- The `readFileSync` at module level is intentional — it runs once at cold start and is reused

**Step 3: Verify the file exists and has correct syntax**

```bash
node -c api/chat.js
```

Expected: No syntax errors.

**Step 4: Commit**

```bash
git add api/chat.js
git commit -m "feat: add /api/chat serverless endpoint for Claude AI"
```

---

### Task 4: Create the end-session API endpoint

**Files:**
- Create: `api/end-session.js`

**Step 1: Write the end-session endpoint**

Create `api/end-session.js`:

```javascript
import { kv } from "@vercel/kv";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_EMAILS = (process.env.NOTIFY_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTranscript(session) {
  const startDate = new Date(session.startedAt);
  const lastMsg = session.messages[session.messages.length - 1];
  const endDate = lastMsg ? new Date(lastMsg.timestamp) : startDate;
  const durationMin = Math.round((endDate - startDate) / 60000);
  const msgCount = session.messages.filter((m) => m.role === "user").length;

  const dateStr = startDate.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = startDate.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #333;">
      <h2 style="color: #080E1A; border-bottom: 2px solid #C4D32F; padding-bottom: 12px;">
        UCSA Business Plan — Investor Chat Transcript
      </h2>
      <table style="font-size: 14px; margin-bottom: 24px;">
        <tr><td style="padding: 4px 16px 4px 0; color: #666;">Investor:</td><td><strong>${escapeHtml(session.name)}</strong></td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #666;">Date:</td><td>${dateStr}, ${timeStr} (${durationMin} min)</td></tr>
        <tr><td style="padding: 4px 16px 4px 0; color: #666;">Messages:</td><td>${msgCount}</td></tr>
      </table>
  `;

  for (const msg of session.messages) {
    const content = escapeHtml(msg.content);
    if (msg.role === "user") {
      html += `
        <div style="margin: 16px 0 8px; padding: 12px 16px; background: #f0f4f8; border-radius: 8px;">
          <div style="font-size: 11px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">Question</div>
          <div style="font-size: 14px; line-height: 1.6;">${content}</div>
        </div>`;
    } else {
      html += `
        <div style="margin: 0 0 16px; padding: 12px 16px; border-left: 3px solid #C4D32F;">
          <div style="font-size: 11px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">Answer</div>
          <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${content}</div>
        </div>`;
    }
  }

  html += `</div>`;
  return { html, dateStr, msgCount };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const session = await kv.get(`session:${sessionId}`);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.ended) {
      return res.status(200).json({ ok: true, message: "Already ended" });
    }

    // Format and send email
    const { html, dateStr } = formatTranscript(session);

    if (NOTIFY_EMAILS.length > 0) {
      await resend.emails.send({
        from: "UCSA Chat <onboarding@resend.dev>",
        to: NOTIFY_EMAILS,
        subject: `UCSA Chat — ${session.name} — ${dateStr}`,
        html,
      });
    }

    // Mark session as ended
    await kv.set(`session:${sessionId}`, { ...session, ended: true }, { ex: 86400 * 30 });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("End session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
```

**Important notes:**
- `escapeHtml()` sanitises all user-provided content before inserting into HTML email
- `from: "UCSA Chat <onboarding@resend.dev>"` uses Resend's default sender. To use a custom domain, verify a domain in Resend dashboard later.
- Idempotent: calling end-session twice returns `ok: true` without re-sending email.

**Step 2: Verify syntax**

```bash
node -c api/end-session.js
```

**Step 3: Commit**

```bash
git add api/end-session.js
git commit -m "feat: add /api/end-session endpoint with email transcript"
```

---

### Task 5: Build the ChatPanel React component

**Files:**
- Create: `src/ChatPanel.jsx`

**Step 1: Create ChatPanel.jsx**

This is the main UI component. It handles:
- Floating toggle button (bottom-right)
- Name prompt state
- Chat message list (plain text rendering, no innerHTML)
- Input box
- Session management (start, send, end)
- `beforeunload` handler for tab close

Create `src/ChatPanel.jsx`:

```jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { theme as t } from "./theme";

const SESSION_KEY = "ucsa_chat_session";
const NAME_KEY = "ucsa_chat_name";

function generateId() {
  return "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Render AI text as React elements — handles line breaks and basic structure
// No dangerouslySetInnerHTML — all content rendered safely as text nodes
function MessageText({ text }) {
  const lines = text.split("\n");
  return (
    <div style={{ fontSize: 13, color: t.text1, lineHeight: 1.6 }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        // Bullet points
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          return (
            <div key={i} style={{ display: "flex", gap: 6, marginLeft: 8, marginTop: 2 }}>
              <span style={{ color: t.accentLime }}>•</span>
              <span>{trimmed.slice(2)}</span>
            </div>
          );
        }
        // Bold lines (wrapped in **)
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <div key={i} style={{ fontWeight: 600, marginTop: i > 0 ? 8 : 0 }}>
              {trimmed.slice(2, -2)}
            </div>
          );
        }
        // Empty lines = paragraph break
        if (trimmed === "") {
          return <div key={i} style={{ height: 8 }} />;
        }
        // Regular text
        return <div key={i}>{line}</div>;
      })}
    </div>
  );
}

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(() => sessionStorage.getItem(NAME_KEY) || "");
  const [nameConfirmed, setNameConfirmed] = useState(() => !!sessionStorage.getItem(NAME_KEY));
  const [sessionId] = useState(() => sessionStorage.getItem(SESSION_KEY) || generateId());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasSessionRef = useRef(false);

  // Persist session ID
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }, [sessionId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && nameConfirmed && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, nameConfirmed]);

  // End session on tab close (best-effort)
  const endSession = useCallback(async () => {
    if (!hasSessionRef.current || ended) return;
    try {
      await fetch("/api/end-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      // Best-effort — tab is closing
    }
  }, [sessionId, ended]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasSessionRef.current && !ended) {
        navigator.sendBeacon(
          "/api/end-session",
          new Blob([JSON.stringify({ sessionId })], { type: "application/json" })
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sessionId, ended]);

  function handleNameSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    sessionStorage.setItem(NAME_KEY, name.trim());
    setNameConfirmed(true);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);
    hasSessionRef.current = true;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name,
          message: userMessage,
          history: messages,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get response");
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEndSession() {
    await endSession();
    setEnded(true);
    hasSessionRef.current = false;
  }

  // Pulse animation for button (first 5 seconds)
  const [showPulse, setShowPulse] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196, 211, 47, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(196, 211, 47, 0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>

      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "none",
            background: t.accentLime,
            color: "#080E1A",
            fontSize: 22,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: showPulse ? "chatPulse 2s ease-in-out infinite" : "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          AI
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: window.innerWidth < 768 ? "100vw" : 400,
          height: "100vh",
          background: t.bg,
          borderLeft: `1px solid ${t.border}`,
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
          boxShadow: "-4px 0 30px rgba(0,0,0,0.4)",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${t.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <div>
              <div style={{ fontFamily: t.fontHead, fontSize: 14, fontWeight: 600, color: t.text1 }}>
                Business Plan Assistant
              </div>
              <div style={{ fontFamily: t.fontMono, fontSize: 10, color: t.text2, marginTop: 2 }}>
                Powered by Claude
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {nameConfirmed && messages.length > 0 && !ended && (
                <button
                  onClick={handleEndSession}
                  style={{
                    background: "transparent",
                    border: `1px solid ${t.border}`,
                    borderRadius: 4,
                    padding: "4px 10px",
                    fontFamily: t.fontMono,
                    fontSize: 10,
                    color: t.text2,
                    cursor: "pointer",
                  }}
                >
                  End session
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={{
                  background: "transparent",
                  border: "none",
                  color: t.text2,
                  fontSize: 20,
                  cursor: "pointer",
                  padding: "0 4px",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* State: Name prompt */}
            {!nameConfirmed && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
                <div style={{ textAlign: "center", maxWidth: 300 }}>
                  <div style={{ fontSize: 28, marginBottom: 16 }}>◈</div>
                  <p style={{ fontSize: 15, color: t.text1, lineHeight: 1.6, marginBottom: 24 }}>
                    Hi, I'm the UCSA business plan assistant. I can answer questions about our investment case, financials, and operations model.
                  </p>
                  <p style={{ fontSize: 13, color: t.text2, marginBottom: 20 }}>
                    What's your name?
                  </p>
                  <form onSubmit={handleNameSubmit}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        background: t.surface,
                        border: `1px solid ${t.border}`,
                        borderRadius: 8,
                        color: t.text1,
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                        marginBottom: 10,
                        fontFamily: t.fontBody,
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: t.accentLime,
                        border: "none",
                        borderRadius: 8,
                        color: "#080E1A",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: t.fontBody,
                      }}
                    >
                      Start chatting
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* State: Session ended */}
            {nameConfirmed && ended && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
                <div style={{ textAlign: "center", maxWidth: 300 }}>
                  <div style={{ fontSize: 28, marginBottom: 16 }}>✓</div>
                  <p style={{ fontSize: 15, color: t.text1, lineHeight: 1.6, marginBottom: 8 }}>
                    Thanks {name}, your session has been saved.
                  </p>
                  <p style={{ fontSize: 13, color: t.text2 }}>
                    A transcript has been sent to the team. Feel free to close this panel.
                  </p>
                </div>
              </div>
            )}

            {/* State: Chat */}
            {nameConfirmed && !ended && (
              <>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <p style={{ fontSize: 13, color: t.text2 }}>
                        Ask me anything about the UCSA business plan, {name}.
                      </p>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "85%",
                          padding: "10px 14px",
                          borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                          background: msg.role === "user" ? t.accentLime + "22" : t.surface,
                          border: `1px solid ${msg.role === "user" ? t.accentLime + "33" : t.border}`,
                        }}
                      >
                        {msg.role === "user" ? (
                          <div style={{ fontSize: 13, color: t.text1, lineHeight: 1.6 }}>
                            {msg.content}
                          </div>
                        ) : (
                          <MessageText text={msg.content} />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
                      <div style={{
                        padding: "12px 18px",
                        borderRadius: "12px 12px 12px 2px",
                        background: t.surface,
                        border: `1px solid ${t.border}`,
                        display: "flex",
                        gap: 4,
                      }}>
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: t.text2,
                              display: "inline-block",
                              animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div style={{
                      padding: "8px 12px",
                      background: "#2D151522",
                      border: "1px solid #F8717133",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#F87171",
                      marginBottom: 12,
                    }}>
                      {error}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSend}
                  style={{
                    padding: "12px 20px",
                    borderTop: `1px solid ${t.border}`,
                    display: "flex",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      background: t.surface,
                      border: `1px solid ${t.border}`,
                      borderRadius: 8,
                      color: t.text1,
                      fontSize: 13,
                      outline: "none",
                      fontFamily: t.fontBody,
                      opacity: loading ? 0.5 : 1,
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{
                      padding: "10px 16px",
                      background: loading || !input.trim() ? t.surface : t.accentLime,
                      border: `1px solid ${loading || !input.trim() ? t.border : t.accentLime}`,
                      borderRadius: 8,
                      color: loading || !input.trim() ? t.text2 : "#080E1A",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: loading || !input.trim() ? "default" : "pointer",
                      fontFamily: t.fontBody,
                      transition: "all 0.15s",
                    }}
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

**Key implementation notes:**
- `MessageText` component renders AI responses safely as React elements — no `dangerouslySetInnerHTML`. Handles line breaks, bullet points, and bold lines.
- `sendBeacon` in `beforeunload` is more reliable than `fetch` during page unload.
- `window.innerWidth < 768` for responsive: full-screen on mobile, 400px panel on desktop.
- User messages rendered as plain text. AI messages use `MessageText` component.
- Chat button uses "AI" text (no emoji).

**Step 2: Verify build works**

This will be verified after integration in Task 6.

**Step 3: Commit**

```bash
git add src/ChatPanel.jsx
git commit -m "feat: add ChatPanel slide-out component"
```

---

### Task 6: Integrate ChatPanel into the app

**Files:**
- Modify: `src/App.jsx`

**Step 1: Import and render ChatPanel**

Add the import at the top of `src/App.jsx` (after the existing imports on line 4):

```jsx
import ChatPanel from "./ChatPanel";
```

Add `<ChatPanel />` just before the closing `</div>` of the root element. The render section should end as:

```jsx
      {mode === "investment" ? <InvestmentCase /> : <OpsModel />}
      <ChatPanel />
    </div>
```

**Step 2: Build and verify**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: integrate ChatPanel into App layout"
```

---

### Task 7: Configure Vercel for serverless functions

**Files:**
- Create: `vercel.json`

**Step 1: Create Vercel config**

Vercel auto-detects `api/` directory functions, but we need to ensure the source files are included in the serverless function bundle.

Create `vercel.json`:

```json
{
  "functions": {
    "api/chat.js": {
      "includeFiles": "src/data/businessPlan.md"
    }
  }
}
```

This ensures the markdown file is bundled with the chat function (needed for the `readFileSync` call).

**Step 2: Commit**

```bash
git add vercel.json
git commit -m "feat: add vercel.json for serverless function config"
```

---

### Task 8: Set up environment variables and deploy

**This task requires manual steps from the user.**

**Step 1: Set up Vercel KV**

In the Vercel dashboard:
1. Go to the project → Storage tab
2. Click "Create Database" → select "KV" (Redis)
3. Name it `ucsa-chat-kv`
4. Connect it to the project
5. This auto-sets `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables

**Step 2: Set up Resend**

1. Go to https://resend.com and create an account
2. Get API key from dashboard
3. Note: the free tier uses `onboarding@resend.dev` as sender — works for testing. For a custom "from" address, verify a domain later.

**Step 3: Set environment variables in Vercel**

In Vercel dashboard → Project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | (user provides) |
| `RESEND_API_KEY` | (from Resend dashboard) |
| `NOTIFY_EMAILS` | `petrus@utilityconsult.co.za,reuben@sprudel.co.za` |

**Step 4: Push and deploy**

```bash
git push
```

Vercel will auto-deploy. Test by:
1. Opening the deployed URL
2. Entering the password (`EnergyWealth2030`)
3. Clicking the chat button (bottom-right, lime green with "AI" text)
4. Entering a name
5. Asking a question like "What is the equity IRR in the base case?"
6. Clicking "End session" and checking email

**Step 5: Verify email arrives**

Both petrus@utilityconsult.co.za and reuben@sprudel.co.za should receive the transcript.

---

### Task 9: Final verification checklist

**Run through these manually after deployment:**

- [ ] Chat button appears bottom-right with pulse animation
- [ ] Clicking opens panel (400px on desktop, full-screen on mobile)
- [ ] Name prompt appears first
- [ ] After entering name, chat view shows
- [ ] Sending a question shows typing indicator, then response
- [ ] AI response is grounded in business plan data (test: "What is the CAPEX?" → "ZAR 165M")
- [ ] AI handles scenario questions (test: "Compare base and DFI equity IRR")
- [ ] "End session" button sends email transcript
- [ ] Closing tab also triggers email (best-effort via sendBeacon)
- [ ] 50-message rate limit works (optional stress test)
- [ ] Panel close button works
- [ ] Re-opening panel preserves conversation in same browser session
