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

const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

/** EmailJS is used only when all four values are set (see DEPLOY.md). */
function emailJsConfig() {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  if (!serviceId || !templateId || !publicKey || !privateKey) return null;
  return { serviceId, templateId, publicKey, privateKey };
}

/** Sent from the server through EmailJS's REST API, so the private key
 * never reaches the browser. Requires "Allow EmailJS API for non-browser
 * applications" in the EmailJS account's security settings. */
async function sendWithEmailJs(
  config: NonNullable<ReturnType<typeof emailJsConfig>>,
  params: Record<string, string>,
) {
  const res = await fetch(EMAILJS_SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      accessToken: config.privateKey,
      template_params: params,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `EmailJS responded with ${res.status}: ${await res.text()}`,
    );
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
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

  const emailJs = emailJsConfig();

  if (emailJs) {
    try {
      await sendWithEmailJs(emailJs, {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || "-",
        description: data.description || "-",
        submittedAt: new Date().toLocaleString("he-IL", {
          timeZone: "Asia/Jerusalem",
        }),
      });
    } catch (error) {
      console.error("[contact] EmailJS delivery failed:", error);
      return NextResponse.json(
        { ok: false, error: "email_failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  }

  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[contact] Neither EmailJS nor WEBHOOK_URL is set. Submission:",
        data,
      );
    }
    return NextResponse.json(
      { ok: false, error: "no_webhook" },
      { status: 503 },
    );
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
    return NextResponse.json(
      { ok: false, error: "webhook_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
