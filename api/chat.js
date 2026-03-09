import Anthropic from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_EMAILS = (process.env.NOTIFY_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);

const USER_FRIENDLY_MESSAGE =
  "I'm taking a quick coffee break — please try again in a moment. If this keeps happening, the team has already been notified.";

async function notifyError(error, context) {
  if (NOTIFY_EMAILS.length === 0) return;
  try {
    await resend.emails.send({
      from: "UCSA Chat <onboarding@resend.dev>",
      to: NOTIFY_EMAILS,
      subject: `⚠️ UCSA Chat Error — ${error?.status || "Unknown"}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 12px;">Chat API Error</h2>
          <table style="font-size: 14px; margin-bottom: 24px;">
            <tr><td style="padding: 4px 16px 4px 0; color: #666;">Time:</td><td>${new Date().toISOString()}</td></tr>
            <tr><td style="padding: 4px 16px 4px 0; color: #666;">Investor:</td><td><strong>${context.name || "Unknown"}</strong></td></tr>
            <tr><td style="padding: 4px 16px 4px 0; color: #666;">Status:</td><td>${error?.status || "N/A"}</td></tr>
            <tr><td style="padding: 4px 16px 4px 0; color: #666;">Error:</td><td style="color: #ef4444;">${error?.message || String(error)}</td></tr>
            <tr><td style="padding: 4px 16px 4px 0; color: #666;">User message:</td><td>${context.message || "N/A"}</td></tr>
          </table>
        </div>`,
    });
  } catch (emailErr) {
    console.error("Failed to send error notification:", emailErr);
  }
}

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

    const session = await redis.get(`session:${sessionId}`);
    if (session && session.messages && session.messages.length >= MAX_MESSAGES * 2) {
      return res.status(429).json({ error: "Session message limit reached" });
    }

    const messages = [
      ...(history || []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
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

    await redis.set(`session:${sessionId}`, updatedSession, { ex: 86400 * 30 });

    return res.status(200).json({ response: assistantMessage });
  } catch (error) {
    console.error("Chat API error:", error?.status, error?.message || error);
    await notifyError(error, { name, message });
    return res.status(200).json({ response: USER_FRIENDLY_MESSAGE });
  }
}
