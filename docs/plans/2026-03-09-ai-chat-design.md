# AI Chat Assistant — Design Document

## Goal

Add a slide-out AI chat panel to the UCSA business plan app so investors and internal team can ask questions about the plan. Conversations are saved to Vercel KV and emailed as transcripts to petrus@utilityconsult.co.za and reuben@sprudel.co.za.

## Architecture

Vercel Serverless (Approach 1) — everything in one repo.

```
React SPA
  └── ChatPanel.jsx (slide-out, bottom-right toggle)
        │
        ├── POST /api/chat      → Claude API (Opus 4.6) + save to KV
        └── POST /api/end-session → read KV, email via Resend, mark ended
              │
        ┌─────┴─────┐
     Vercel KV    Resend → Gmail
```

### Key decisions

- Conversation history sent with each request + persisted to KV
- Session ID (UUID) generated on first message, stored in browser sessionStorage
- System prompt cached via Claude prompt caching (~18K tokens static)
- Auto-trigger end-session on tab close via `beforeunload` (best-effort)
- Rate limit: 50 messages per session

## Source Documents

- `src/data/businessPlan.md` — V4 PDF converted to clean markdown (primary knowledge source)
- `src/data/businessPlan.js` — structured financial data for precise figures
- Both included in the system prompt, cached

## System Prompt

```
You are the UCSA Asset Company business plan assistant. You help
investors and team members understand the business plan.

PERSONALITY: Knowledgeable, conversational, professional. You can
discuss the SA energy market, solar economics, and regulatory
context when relevant.

RULES:
- Ground all financial figures in the source data — never fabricate
- When citing specific numbers, reference which scenario (Base/DFI/Stress)
- If asked something not covered by the plan, say so honestly
- Never disclose that you're reading from a specific document
- Format currency as "ZAR X.XM" consistently
- Keep answers concise but thorough — investors' time is valuable

The investor's name is: {name}

SOURCE DOCUMENT:
{businessPlan.md content}

FINANCIAL DATA:
{businessPlan.js key figures}
```

## UI

### Chat toggle button
- Fixed bottom-right, circular, brand lime accent (#C4D32F)
- Subtle pulse animation on first page load
- Badge for unread count if AI responds while panel closed

### Chat panel
- Slides in from right, ~400px wide, full height
- Dark theme matching app (#0D1526 surface, #080E1A background)
- Mobile (<768px): full-screen overlay

### Three states

1. **Name prompt** — "Hi, I'm the UCSA business plan assistant. What's your name?" Text input, stored in sessionStorage.
2. **Chat view** — message bubbles (user right, AI left). AI messages rendered as markdown. Typing indicator while waiting. Input box at bottom.
3. **Session end** — "Thanks {name}, your session has been saved." Triggers email.

## API Endpoints

### POST /api/chat
- Input: `{ sessionId, name, message, history[] }`
- Calls Claude API with cached system prompt + history
- Saves to KV: `session:{sessionId}` → `{ name, startedAt, messages[], ended }`
- Returns: `{ response: "..." }`
- Rate limit: 50 messages/session

### POST /api/end-session
- Input: `{ sessionId }`
- Reads conversation from KV
- Sends email via Resend to both notify addresses
- Marks session ended in KV
- Returns: `{ ok: true }`

## Vercel KV Structure

```json
{
  "name": "John Smith",
  "startedAt": "2026-03-09T14:30:00Z",
  "ended": false,
  "messages": [
    { "role": "user", "content": "...", "timestamp": "..." },
    { "role": "assistant", "content": "...", "timestamp": "..." }
  ]
}
```

## Email Format

**Subject:** `UCSA Chat — {name} — {date}`

**Recipients:** petrus@utilityconsult.co.za, reuben@sprudel.co.za

**Body:** HTML-formatted transcript showing investor name, date, duration, message count, then full Q&A pairs.

## Environment Variables (Vercel Dashboard)

- `ANTHROPIC_API_KEY` — Claude API key
- `RESEND_API_KEY` — Resend API key
- `NOTIFY_EMAILS` — petrus@utilityconsult.co.za,reuben@sprudel.co.za
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` — auto-set by Vercel KV

## Cost Estimate

- 20-question session with Opus 4.6 + prompt caching: ~$3
- Vercel KV free tier: 30K requests/month
- Resend free tier: 100 emails/day
- Total infrastructure: $0/month within free tiers
