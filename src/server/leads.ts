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
  const email = buildLeadEmail(lead, createdAt);

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
): {
  subject: string;
  html: string;
  text: string;
} {
  const intentLabel = lead.intent === "scheduling" ? "Agendamento" : "Contato";
  const channelLabel = lead.preferredChannel === "whatsapp" ? "WhatsApp" : "E-mail";
  const subject = `Nerya - ${intentLabel} pelo site`;
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
      '<div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f2937">',
      "<h1>Nerya - novo lead recebido</h1>",
      "<table>",
      htmlRows,
      "</table>",
      "<h2>Mensagem</h2>",
      `<p style="white-space:pre-wrap">${escapeHtml(lead.message)}</p>`,
      "</div>",
    ].join(""),
    text: ["Nerya - novo lead recebido", "", textRows, "", "Mensagem:", lead.message].join("\n"),
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
