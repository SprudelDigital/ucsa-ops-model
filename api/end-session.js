import { Redis } from "@upstash/redis";
import { Resend } from "resend";

const redis = Redis.fromEnv();
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

    const session = await redis.get(`session:${sessionId}`);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.ended) {
      return res.status(200).json({ ok: true, message: "Already ended" });
    }

    const { html, dateStr } = formatTranscript(session);

    if (NOTIFY_EMAILS.length > 0) {
      await resend.emails.send({
        from: "UCSA Chat <onboarding@resend.dev>",
        to: NOTIFY_EMAILS,
        subject: `UCSA Chat — ${session.name} — ${dateStr}`,
        html,
      });
    }

    await redis.set(`session:${sessionId}`, { ...session, ended: true }, { ex: 86400 * 30 });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("End session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
