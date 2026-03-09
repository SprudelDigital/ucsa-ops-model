import Anthropic from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";
import { readFileSync } from "fs";
import { join } from "path";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const redis = Redis.fromEnv();

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
    const status = error?.status || 500;
    const msg = error?.status
      ? `API error: ${error.message}`
      : "Internal server error";
    return res.status(status).json({ error: msg });
  }
}
