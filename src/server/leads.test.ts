import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleLeadRequest, resetLeadRateLimit } from "./leads";
import type { LeadEmailProvider } from "./resend";

const env = {
  RESEND_API_KEY: "test-key",
  RESEND_FROM_EMAIL: "Nerya <onboarding@resend.dev>",
  RESEND_TO_EMAIL: "guilherme.augusto.nery1@gmail.com",
};

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    intent: "contact",
    fullName: "Guilherme Nery",
    email: "guilherme@example.com",
    whatsapp: "(11) 99999-9999",
    preferredChannel: "email",
    preferredSchedule: "tercas a noite",
    message: "Quero saber mais sobre as aulas.",
    origin: "https://nerya.example/contato",
    renderedAt: "2026-08-05T20:00:00.000Z",
    ...overrides,
  };
}

function request(payload: unknown, headers: Record<string, string> = {}) {
  return new Request("https://nerya.example/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "198.51.100.10",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

function provider() {
  const send = vi.fn<LeadEmailProvider["send"]>().mockResolvedValue({ id: "email_123" });
  return { send };
}

async function json(response: Response) {
  return response.json() as Promise<{
    message?: string;
    data?: { provider?: string; status?: string };
  }>;
}

describe("handleLeadRequest", () => {
  beforeEach(() => {
    resetLeadRateLimit();
  });

  it("accepts a valid payload and sends through the email provider", async () => {
    const emailProvider = provider();

    const response = await handleLeadRequest(request(validPayload()), env, {
      emailProvider,
      now: () => new Date("2026-08-05T20:00:03.000Z"),
    });

    expect(response.status).toBe(201);
    expect(emailProvider.send).toHaveBeenCalledTimes(2);
    const [payload] = emailProvider.send.mock.calls[0]!;
    expect(payload.to).toBe("guilherme.augusto.nery1@gmail.com");
    expect(payload.replyTo).toBe("guilherme@example.com");
    expect(payload.subject).toBe("Nerya - Contato pelo site");
    expect(payload.html).toContain("/logoo.png");

    const [confirmation] = emailProvider.send.mock.calls[1]!;
    expect(confirmation.to).toBe("guilherme@example.com");
    expect(confirmation.replyTo).toBe("guilherme.augusto.nery1@gmail.com");
    expect(confirmation.subject).toBe("Recebemos sua solicitação - Nerya");
  });

  it("rejects an invalid email", async () => {
    const emailProvider = provider();
    const response = await handleLeadRequest(request(validPayload({ email: "invalid" })), env, {
      emailProvider,
      now: () => new Date("2026-08-05T20:00:03.000Z"),
    });

    expect(response.status).toBe(422);
    expect(emailProvider.send).not.toHaveBeenCalled();
  });

  it("rejects missing required fields", async () => {
    const emailProvider = provider();
    const response = await handleLeadRequest(request(validPayload({ fullName: "" })), env, {
      emailProvider,
      now: () => new Date("2026-08-05T20:00:03.000Z"),
    });

    expect(response.status).toBe(422);
    expect(emailProvider.send).not.toHaveBeenCalled();
  });

  it("rejects invalid enum values", async () => {
    const emailProvider = provider();
    const response = await handleLeadRequest(
      request(validPayload({ intent: "demo", preferredChannel: "sms" })),
      env,
      {
        emailProvider,
        now: () => new Date("2026-08-05T20:00:03.000Z"),
      },
    );

    expect(response.status).toBe(422);
    expect(emailProvider.send).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const emailProvider = provider();
    const response = await handleLeadRequest(
      request(validPayload({ website: "https://spam.example" })),
      env,
      {
        emailProvider,
        now: () => new Date("2026-08-05T20:00:03.000Z"),
      },
    );
    const body = await json(response);

    expect(response.status).toBe(200);
    expect(body.data?.provider).toBe("backend");
    expect(emailProvider.send).not.toHaveBeenCalled();
  });

  it("enforces in-memory rate limit", async () => {
    const emailProvider = provider();
    const deps = {
      emailProvider,
      rateLimit: { maxRequests: 1, windowMs: 60_000 },
      now: () => new Date("2026-08-05T20:00:03.000Z"),
    };

    const first = await handleLeadRequest(request(validPayload()), env, deps);
    const second = await handleLeadRequest(request(validPayload()), env, deps);

    expect(first.status).toBe(201);
    expect(second.status).toBe(429);
    expect(emailProvider.send).toHaveBeenCalledTimes(2);
  });

  it("keeps the lead accepted when the confirmation email fails", async () => {
    const send = vi
      .fn<LeadEmailProvider["send"]>()
      .mockResolvedValueOnce({ id: "lead_email" })
      .mockRejectedValueOnce(new Error("confirmation failed"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const response = await handleLeadRequest(request(validPayload()), env, {
      emailProvider: { send },
      now: () => new Date("2026-08-05T20:00:03.000Z"),
    });

    expect(response.status).toBe(201);
    expect(send).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledWith(
      "Lead confirmation email failed.",
      expect.objectContaining({ emailDomain: "example.com" }),
    );

    warn.mockRestore();
  });

  it("returns a controlled error when Resend variables are missing", async () => {
    const emailProvider = provider();
    const response = await handleLeadRequest(
      request(validPayload()),
      {},
      {
        emailProvider,
        now: () => new Date("2026-08-05T20:00:03.000Z"),
      },
    );

    expect(response.status).toBe(503);
    expect(emailProvider.send).not.toHaveBeenCalled();
  });

  it("returns a controlled provider error when Resend returns an error", async () => {
    const emailProvider: LeadEmailProvider = {
      send: vi.fn().mockRejectedValue(new Error("RESEND_PROVIDER_ERROR")),
    };

    const response = await handleLeadRequest(request(validPayload()), env, {
      emailProvider,
      now: () => new Date("2026-08-05T20:00:03.000Z"),
    });

    expect(response.status).toBe(503);
    expect((await json(response)).message).toBe(
      "Nao foi possivel enviar agora. Tente novamente em alguns minutos.",
    );
  });

  it("returns a controlled provider error when the SDK throws", async () => {
    const emailProvider: LeadEmailProvider = {
      send: vi.fn().mockRejectedValue(new Error("network failed")),
    };

    const response = await handleLeadRequest(request(validPayload()), env, {
      emailProvider,
      now: () => new Date("2026-08-05T20:00:03.000Z"),
    });

    expect(response.status).toBe(503);
    expect((await json(response)).message).not.toContain("network failed");
  });
});
