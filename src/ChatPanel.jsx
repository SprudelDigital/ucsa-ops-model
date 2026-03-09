import { useState, useEffect, useRef, useCallback } from "react";
import { theme as t } from "./theme";

// ─── HELPERS ────────────────────────────────────────────────────────────────

function genId() {
  return "s_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Parse AI text into safe React elements — handles bold, bullets, paragraphs */
function renderAIText(text) {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((para, pi) => {
    const lines = para.split("\n");
    const elements = lines.map((line, li) => {
      const isBullet = /^[-•]\s+/.test(line);
      const content = isBullet ? line.replace(/^[-•]\s+/, "") : line;
      const rendered = renderInlineFormatting(content);

      if (isBullet) {
        return (
          <div key={li} style={{ display: "flex", gap: 8, marginTop: li > 0 ? 4 : 0 }}>
            <span style={{ color: t.accentLime, flexShrink: 0 }}>{"\u2022"}</span>
            <span>{rendered}</span>
          </div>
        );
      }
      return (
        <div key={li}>
          {rendered}
        </div>
      );
    });
    return (
      <div key={pi} style={{ marginTop: pi > 0 ? 12 : 0 }}>
        {elements}
      </div>
    );
  });
}

/** Handle **bold** inline formatting */
function renderInlineFormatting(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 600, color: t.text1 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── KEYFRAMES (injected once) ──────────────────────────────────────────────

const chatStyles = `
@keyframes chatPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(196,211,47,0.5); }
  50% { box-shadow: 0 0 0 14px rgba(196,211,47,0); }
}
@keyframes chatSlideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes chatSlideOut {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
@keyframes chatDot {
  0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}
`;

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [name, setName] = useState(() => sessionStorage.getItem("chat_name") || "");
  const [nameSubmitted, setNameSubmitted] = useState(() => !!sessionStorage.getItem("chat_name"));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [ended, setEnded] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [btnHover, setBtnHover] = useState(false);

  const sessionIdRef = useRef(
    sessionStorage.getItem("chat_session_id") || genId()
  );
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Persist session ID
  useEffect(() => {
    sessionStorage.setItem("chat_session_id", sessionIdRef.current);
  }, []);

  // Stop pulse after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Focus input after name submit or when panel opens
  useEffect(() => {
    if (open && nameSubmitted && !ended && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, nameSubmitted, ended]);

  // End session on tab close
  useEffect(() => {
    function handleUnload() {
      if (messages.length > 0 && !ended) {
        const data = JSON.stringify({ sessionId: sessionIdRef.current });
        navigator.sendBeacon("/api/end-session", new Blob([data], { type: "application/json" }));
      }
    }
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [messages.length, ended]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 250);
  }, []);

  const handleNameSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    sessionStorage.setItem("chat_name", trimmed);
    setName(trimmed);
    setNameSubmitted(true);
  }, [name]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setInput("");
    setError("");
    const userMsg = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          name,
          message: trimmed,
          history: messages,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [input, sending, name, messages]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleEndSession = useCallback(async () => {
    try {
      await fetch("/api/end-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      });
    } catch {
      // best-effort
    }
    setEnded(true);
  }, []);

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{chatStyles}</style>

      {/* Floating toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          aria-label="Open chat"
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
            fontFamily: t.fontMono,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
            transform: btnHover ? "scale(1.1)" : "scale(1)",
            animation: showPulse ? "chatPulse 2s ease-in-out infinite" : "none",
          }}
        >
          AI
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: window.innerWidth < 768 ? "100vw" : 400,
            background: t.bg,
            borderLeft: `1px solid ${t.border}`,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            animation: closing ? "chatSlideOut 0.25s ease-in forwards" : "chatSlideIn 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${t.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div>
              <div style={{
                fontFamily: t.fontHead,
                fontSize: 15,
                fontWeight: 600,
                color: t.text1,
              }}>
                Business Plan Assistant
              </div>
              <div style={{
                fontFamily: t.fontMono,
                fontSize: 10,
                color: t.text2,
                marginTop: 2,
              }}>
                Powered by Claude
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {messages.length > 0 && !ended && (
                <button
                  onClick={handleEndSession}
                  style={{
                    background: "transparent",
                    border: `1px solid ${t.border}`,
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontFamily: t.fontMono,
                    fontSize: 10,
                    color: t.text2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  End session
                </button>
              )}
              <button
                onClick={handleClose}
                aria-label="Close chat"
                style={{
                  background: "transparent",
                  border: "none",
                  color: t.text2,
                  fontSize: 20,
                  cursor: "pointer",
                  padding: "4px 8px",
                  lineHeight: 1,
                }}
              >
                {"\u2715"}
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {ended ? (
              /* Session ended state */
              <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 32,
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: t.fontHead,
                    fontSize: 16,
                    fontWeight: 600,
                    color: t.text1,
                    marginBottom: 8,
                  }}>
                    Thanks {name}, your session has been saved.
                  </div>
                  <div style={{
                    fontFamily: t.fontMono,
                    fontSize: 11,
                    color: t.text2,
                  }}>
                    A transcript has been sent to the team.
                  </div>
                </div>
              </div>
            ) : !nameSubmitted ? (
              /* Name prompt state */
              <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 32,
              }}>
                <div style={{ width: "100%", maxWidth: 320 }}>
                  <div style={{
                    fontFamily: t.fontHead,
                    fontSize: 16,
                    fontWeight: 600,
                    color: t.text1,
                    marginBottom: 8,
                    lineHeight: 1.5,
                  }}>
                    Hi, I'm the UCSA business plan assistant.
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: t.text2,
                    marginBottom: 24,
                    lineHeight: 1.6,
                  }}>
                    I can answer questions about our investment case, operations model, financials, and market strategy. What's your name?
                  </div>
                  <form onSubmit={handleNameSubmit}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: t.surface,
                        border: `1px solid ${t.border}`,
                        borderRadius: 8,
                        color: t.text1,
                        fontSize: 14,
                        fontFamily: t.fontBody,
                        outline: "none",
                        boxSizing: "border-box",
                        marginBottom: 12,
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: t.accentLime,
                        border: "none",
                        borderRadius: 8,
                        color: "#080E1A",
                        fontFamily: t.fontBody,
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      Start chatting
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* Chat view state */
              <>
                <div style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px 20px",
                }}>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div style={{
                        maxWidth: "85%",
                        padding: "10px 14px",
                        borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        background: msg.role === "user" ? (t.accentLime + "1A") : t.surface,
                        border: `1px solid ${msg.role === "user" ? (t.accentLime + "30") : t.border}`,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: t.text1,
                        fontFamily: t.fontBody,
                      }}>
                        {msg.role === "assistant" ? renderAIText(msg.content) : msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {sending && (
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginBottom: 12,
                    }}>
                      <div style={{
                        padding: "12px 18px",
                        borderRadius: "14px 14px 14px 4px",
                        background: t.surface,
                        border: `1px solid ${t.border}`,
                        display: "flex",
                        gap: 5,
                        alignItems: "center",
                      }}>
                        {[0, 1, 2].map((n) => (
                          <div
                            key={n}
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: t.text2,
                              animation: `chatDot 1.4s ease-in-out ${n * 0.2}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error display */}
                  {error && (
                    <div style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: "#ef444420",
                      border: "1px solid #ef444440",
                      fontSize: 12,
                      color: "#ef4444",
                      marginBottom: 12,
                    }}>
                      {error}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div style={{
                  padding: "12px 16px",
                  borderTop: `1px solid ${t.border}`,
                  flexShrink: 0,
                }}>
                  <div style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-end",
                  }}>
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about the business plan..."
                      rows={1}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        background: t.surface,
                        border: `1px solid ${t.border}`,
                        borderRadius: 8,
                        color: t.text1,
                        fontSize: 13,
                        fontFamily: t.fontBody,
                        outline: "none",
                        resize: "none",
                        lineHeight: 1.5,
                        maxHeight: 100,
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || sending}
                      aria-label="Send message"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        border: "none",
                        background: input.trim() && !sending ? t.accentLime : t.surfaceHigh,
                        color: input.trim() && !sending ? "#080E1A" : t.text2,
                        fontSize: 18,
                        cursor: input.trim() && !sending ? "pointer" : "default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}
                    >
                      {"\u2191"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
