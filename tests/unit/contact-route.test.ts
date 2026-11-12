// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";

const EMAILJS_ENV = {
  EMAILJS_SERVICE_ID: "service_test",
  EMAILJS_TEMPLATE_ID: "template_test",
  EMAILJS_PUBLIC_KEY: "public_test",
  EMAILJS_PRIVATE_KEY: "private_test",
};

let ipCounter = 0;

function submit(body: Record<string, unknown>) {
  // A fresh IP per request keeps the in-memory rate limiter out of the way.
  ipCounter += 1;
  return POST(
    new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": `10.0.0.${ipCounter}`,
      },
      body: JSON.stringify(body),
    }),
  );
}

const validForm = {
  fullName: "דני כהן",
  phone: "050-1234567",
  email: "",
  description: "קליטת הזמנות",
  consent: true,
  honeypot: "",
};

describe("POST /api/contact", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("WEBHOOK_URL", "");
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("sends through EmailJS when it's configured", async () => {
    for (const [k, v] of Object.entries(EMAILJS_ENV)) vi.stubEnv(k, v);
    fetchMock.mockResolvedValue(new Response("OK", { status: 200 }));

    const res = await submit(validForm);

    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.emailjs.com/api/v1.0/email/send");
    const payload = JSON.parse(init.body);
    expect(payload).toMatchObject({
      service_id: "service_test",
      template_id: "template_test",
      user_id: "public_test",
      accessToken: "private_test",
      template_params: {
        fullName: "דני כהן",
        phone: "050-1234567",
        email: "-",
        description: "קליטת הזמנות",
      },
    });
  });

  it("reports a failure instead of faking success when EmailJS rejects", async () => {
    for (const [k, v] of Object.entries(EMAILJS_ENV)) vi.stubEnv(k, v);
    fetchMock.mockResolvedValue(new Response("Forbidden", { status: 403 }));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await submit(validForm);

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "email_failed" });
  });

  it("returns no_webhook when nothing is configured", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    const res = await submit(validForm);

    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
