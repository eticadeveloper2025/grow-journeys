import type { ApiResponse, LeadIntent, LeadPreferredChannel, LeadSubmissionResult } from "@/types";
import type { LeadEmailProvider } from "./resend";
import { resendLeadEmailProvider } from "./resend";

type RuntimeEnv = Record<string, string | undefined>;

type RawLeadPayload = {
  intent?: unknown;
  fullName?: unknown;
  email?: unknown;
  whatsapp?: unknown;
  preferredChannel?: unknown;
  preferredSchedule?: unknown;
  message?: unknown;
  subject?: unknown;
  origin?: unknown;
  website?: unknown;
  renderedAt?: unknown;
};

type NormalizedLead = {
  intent: LeadIntent;
  fullName: string;
  email: string;
  whatsapp?: string;
  preferredChannel: LeadPreferredChannel;
  preferredSchedule?: string;
  message: string;
  origin?: string;
  renderedAt?: string;
};

type LeadHandlerDeps = {
  emailProvider?: LeadEmailProvider;
  now?: () => Date;
  rateLimit?: RateLimitOptions;
};

type RateLimitOptions = {
  maxRequests: number;
  windowMs: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const BODY_LIMIT_BYTES = 12_000;
const MIN_SUBMIT_MS = 1_200;
const DEFAULT_RATE_LIMIT: RateLimitOptions = {
  maxRequests: 5,
  windowMs: 10 * 60 * 1000,
};

const FIELD_LIMITS = {
  fullName: 120,
  email: 254,
  whatsapp: 40,
  preferredSchedule: 160,
  message: 2_000,
  origin: 500,
  website: 200,
} as const;

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export function resetLeadRateLimit(): void {
  rateLimitBuckets.clear();
}

export async function handleLeadRequest(
  request: Request,
  runtimeEnv: unknown,
  deps: LeadHandlerDeps = {},
): Promise<Response> {
  if (request.method !== "POST") {
    return json({ message: "Metodo nao permitido." }, 405);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ message: "Envie os dados em JSON." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > BODY_LIMIT_BYTES) {
    return json({ message: "Solicitacao muito grande." }, 413);
  }

  const ip = clientIp(request);
  if (!consumeRateLimit(ip, deps.rateLimit ?? DEFAULT_RATE_LIMIT, deps.now?.() ?? new Date())) {
    return json({ message: "Muitas tentativas. Aguarde alguns minutos e tente novamente." }, 429);
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return json({ message: "Nao foi possivel ler a solicitacao." }, 400);
  }

  if (byteLength(rawText) > BODY_LIMIT_BYTES) {
    return json({ message: "Solicitacao muito grande." }, 413);
  }

  let payload: RawLeadPayload;
  try {
    payload = JSON.parse(rawText) as RawLeadPayload;
  } catch {
    return json({ message: "JSON invalido." }, 400);
  }

  if (normalizeOptional(payload.website, FIELD_LIMITS.website)) {
    return json(successResult("Solicitacao recebida. Obrigado pelo contato."), 200);
  }

  const validation = validatePayload(payload, deps.now?.() ?? new Date());
  if (!validation.ok) {
    return json({ message: validation.message, fields: validation.fields }, 422);
  }

  const env = readRuntimeEnv(runtimeEnv);
  const config = readResendConfig(env);
  if (!config.ok) {
    return json({ message: "Envio de e-mail ainda nao configurado." }, 503);
  }

  const lead = validation.lead;
  const createdAt = (deps.now?.() ?? new Date()).toISOString();
  const siteOrigin = new URL(request.url).origin;
  const email = buildLeadEmail(lead, createdAt, siteOrigin);

  try {
    await (deps.emailProvider ?? resendLeadEmailProvider).send(
      {
        from: config.from,
        to: config.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        replyTo: lead.email,
      },
      config.apiKey,
    );
  } catch {
    return json(
      { message: "Nao foi possivel enviar agora. Tente novamente em alguns minutos." },
      503,
    );
  }

  const confirmation = buildConfirmationEmail(lead, siteOrigin);
  try {
    await (deps.emailProvider ?? resendLeadEmailProvider).send(
      {
        from: config.from,
        to: lead.email,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
        replyTo: config.to,
      },
      config.apiKey,
    );
  } catch (error) {
    console.warn("Lead confirmation email failed.", {
      emailDomain: lead.email.split("@")[1] ?? "unknown",
      error: error instanceof Error ? error.message : "unknown",
    });
  }

  return json(
    successResult(
      "Solicitacao enviada com sucesso. Responderemos pelo canal escolhido.",
      createdAt,
    ),
    201,
  );
}

function validatePayload(
  payload: RawLeadPayload,
  now: Date,
):
  | { ok: true; lead: NormalizedLead }
  | { ok: false; message: string; fields?: Record<string, string> } {
  const fields: Record<string, string> = {};
  const fullName = normalizeRequired(payload.fullName, FIELD_LIMITS.fullName);
  const email = normalizeRequired(payload.email, FIELD_LIMITS.email);
  const message = normalizeRequired(payload.message, FIELD_LIMITS.message);
  const whatsapp = normalizeOptional(payload.whatsapp, FIELD_LIMITS.whatsapp);
  const preferredSchedule = normalizeOptional(
    payload.preferredSchedule,
    FIELD_LIMITS.preferredSchedule,
  );
  const origin = normalizeOptional(payload.origin, FIELD_LIMITS.origin);
  const renderedAt = normalizeOptional(payload.renderedAt, 40);

  if (!fullName) fields.fullName = "Informe seu nome.";
  if (!email || !isValidEmail(email)) fields.email = "Informe um e-mail valido.";
  if (!message) fields.message = "Informe uma mensagem.";

  const intent = payload.intent;
  if (intent !== "contact" && intent !== "scheduling") {
    fields.intent = "Origem invalida.";
  }

  const preferredChannel = payload.preferredChannel;
  if (preferredChannel !== "email" && preferredChannel !== "whatsapp") {
    fields.preferredChannel = "Canal preferido invalido.";
  }

  if (renderedAt && isTooFast(renderedAt, now)) {
    fields.form = "Aguarde um instante antes de enviar novamente.";
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, message: "Revise os campos informados.", fields };
  }

  return {
    ok: true,
    lead: {
      intent: intent as LeadIntent,
      fullName: fullName!,
      email: email!,
      whatsapp,
      preferredChannel: preferredChannel as LeadPreferredChannel,
      preferredSchedule,
      message: message!,
      origin,
      renderedAt,
    },
  };
}

function buildLeadEmail(
  lead: NormalizedLead,
  createdAt: string,
  siteOrigin: string,
): {
  subject: string;
  html: string;
  text: string;
} {
  const intentLabel = lead.intent === "scheduling" ? "Agendamento" : "Contato";
  const channelLabel = lead.preferredChannel === "whatsapp" ? "WhatsApp" : "E-mail";
  const subject = `Nerya - ${intentLabel} pelo site`;
  const logoUrl = `${siteOrigin}/logoo.png`;
  const rows = [
    ["Origem", intentLabel],
    ["Nome", lead.fullName],
    ["E-mail", lead.email],
    ["WhatsApp", lead.whatsapp ?? "Nao informado"],
    ["Canal preferido", channelLabel],
    ["Horario preferido", lead.preferredSchedule ?? "Nao informado"],
    ["Pagina de origem", lead.origin ?? "Nao informada"],
    ["Data e horario", createdAt],
  ];

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const textRows = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  return {
    subject,
    html: [
      '<div style="margin:0;background:#f7f8fb;padding:24px;font-family:Arial,sans-serif;line-height:1.5;color:#1f2937">',
      '<div style="margin:0 auto;max-width:640px;border:1px solid #e5e7eb;border-radius:14px;background:#ffffff;overflow:hidden">',
      '<div style="background:#0b111c;padding:22px 24px">',
      `<img src="${escapeHtml(logoUrl)}" alt="Nerya" width="44" height="44" style="display:block;border-radius:10px" />`,
      "</div>",
      '<div style="padding:28px 24px">',
      '<p style="margin:0 0 8px;color:#536184;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">Novo lead recebido</p>',
      '<h1 style="margin:0 0 20px;font-size:28px;line-height:1.15;color:#111827">Nerya - solicitação pelo site</h1>',
      '<table style="width:100%;border-collapse:collapse">',
      htmlRows,
      "</table>",
      '<h2 style="margin:26px 0 8px;font-size:18px;color:#111827">Mensagem</h2>',
      `<p style="margin:0;white-space:pre-wrap;color:#374151">${escapeHtml(lead.message)}</p>`,
      "</div>",
      "</div>",
      "</div>",
    ].join(""),
    text: ["Nerya - novo lead recebido", "", textRows, "", "Mensagem:", lead.message].join("\n"),
  };
}

function buildConfirmationEmail(
  lead: NormalizedLead,
  siteOrigin: string,
): {
  subject: string;
  html: string;
  text: string;
} {
  const intentLabel = lead.intent === "scheduling" ? "solicitação de agendamento" : "mensagem";
  const schedule = lead.preferredSchedule ?? "horário a combinar";
  const logoUrl = `${siteOrigin}/logoo.png`;
  const escapedName = escapeHtml(lead.fullName);
  const escapedSchedule = escapeHtml(schedule);

  return {
    subject: "Recebemos sua solicitação - Nerya",
    html: [
      '<div style="margin:0;background:#f7f8fb;padding:24px;font-family:Arial,sans-serif;line-height:1.55;color:#1f2937">',
      '<div style="margin:0 auto;max-width:600px;border:1px solid #e5e7eb;border-radius:14px;background:#ffffff;overflow:hidden">',
      '<div style="background:#0b111c;padding:22px 24px">',
      `<img src="${escapeHtml(logoUrl)}" alt="Nerya" width="44" height="44" style="display:block;border-radius:10px" />`,
      "</div>",
      '<div style="padding:28px 24px">',
      '<p style="margin:0 0 8px;color:#536184;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">Solicitação recebida</p>',
      `<h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;color:#111827">Obrigado, ${escapedName}.</h1>`,
      `<p style="margin:0 0 16px;color:#374151">Recebemos sua ${intentLabel} e vamos responder em breve pelo canal escolhido.</p>`,
      '<div style="margin:22px 0;padding:16px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb">',
      '<p style="margin:0 0 6px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Horário informado</p>',
      `<p style="margin:0;color:#111827;font-size:16px">${escapedSchedule}</p>`,
      "</div>",
      '<p style="margin:0;color:#374151">Se quiser acrescentar alguma informação, responda diretamente este e-mail.</p>',
      "</div>",
      "</div>",
      "</div>",
    ].join(""),
    text: [
      "Recebemos sua solicitação - Nerya",
      "",
      `Obrigado, ${lead.fullName}.`,
      `Recebemos sua ${intentLabel} e vamos responder em breve pelo canal escolhido.`,
      `Horario informado: ${schedule}`,
      "",
      "Se quiser acrescentar alguma informação, responda diretamente este e-mail.",
    ].join("\n"),
  };
}

function successResult(
  message: string,
  createdAt = new Date().toISOString(),
): ApiResponse<LeadSubmissionResult> {
  return {
    data: {
      id: `lead-${randomId()}`,
      status: "queued",
      provider: "backend",
      message,
      createdAt,
    },
  };
}

function normalizeRequired(value: unknown, max: number): string | null {
  const normalized = normalizeOptional(value, max);
  return normalized && normalized.length > 0 ? normalized : null;
}

function normalizeOptional(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.slice(0, max) || undefined;
}

function isValidEmail(value: string): boolean {
  return value.length <= FIELD_LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isTooFast(renderedAt: string, now: Date): boolean {
  const renderedTime = Date.parse(renderedAt);
  if (Number.isNaN(renderedTime)) return false;
  return now.getTime() - renderedTime < MIN_SUBMIT_MS;
}

function consumeRateLimit(ip: string, options: RateLimitOptions, now: Date): boolean {
  const currentTime = now.getTime();
  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= currentTime) rateLimitBuckets.delete(key);
  }

  const current = rateLimitBuckets.get(ip);
  if (!current || current.resetAt <= currentTime) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: currentTime + options.windowMs });
    return true;
  }

  if (current.count >= options.maxRequests) return false;
  current.count += 1;
  return true;
}

function readRuntimeEnv(runtimeEnv: unknown): RuntimeEnv {
  const fromRequest =
    runtimeEnv && typeof runtimeEnv === "object" ? (runtimeEnv as RuntimeEnv) : {};
  return {
    RESEND_API_KEY: fromRequest.RESEND_API_KEY ?? process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: fromRequest.RESEND_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL,
    RESEND_TO_EMAIL: fromRequest.RESEND_TO_EMAIL ?? process.env.RESEND_TO_EMAIL,
  };
}

function readResendConfig(
  env: RuntimeEnv,
): { ok: true; apiKey: string; from: string; to: string } | { ok: false } {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM_EMAIL?.trim();
  const to = env.RESEND_TO_EMAIL?.trim();

  if (!apiKey || !from || !to) return { ok: false };
  return { ok: true, apiKey, from, to };
}

function clientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? "unknown";
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function randomId(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 12);
}
