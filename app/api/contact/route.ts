import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

/** Best-effort, in-memory limiter. On serverless deployments with multiple
 * instances this resets per-instance — adequate as a basic spam deterrent
 * per the spec, not a substitute for a durable store (e.g. Upstash) in a
 * high-traffic production setup. */
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const { honeypot, ...data } = parsed.data;

  // Bots that fill the hidden honeypot field get a silent fake success —
  // we never tell them what tripped the filter.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] WEBHOOK_URL is not set. Submission:", data);
    }
    return NextResponse.json({ ok: false, error: "no_webhook" }, { status: 503 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
    });
    if (!res.ok) {
      throw new Error(`Webhook responded with ${res.status}`);
    }
  } catch (error) {
    console.error("[contact] Webhook delivery failed:", error);
    return NextResponse.json({ ok: false, error: "webhook_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
