import { env } from "@/config/env";
import type { LeadRequest } from "@/types";

type LeadMessageInput = Pick<
  LeadRequest,
  "intent" | "fullName" | "email" | "whatsapp" | "preferredSchedule" | "message"
>;

export function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export function hasConfiguredWhatsApp(): boolean {
  return normalizeWhatsAppNumber(env.publicWhatsAppNumber).length >= 10;
}

export function formatLeadSubject(input: Pick<LeadRequest, "intent" | "fullName">): string {
  const prefix = input.intent === "scheduling" ? "Solicitacao de agendamento" : "Contato pelo site";
  return `${prefix} - ${input.fullName}`;
}

export function formatLeadMessage(input: LeadMessageInput): string {
  const intent = input.intent === "scheduling" ? "agendar uma aula" : "falar com a Nerya";
  return [
    `Ola, quero ${intent}.`,
    "",
    `Nome: ${input.fullName}`,
    `E-mail: ${input.email}`,
    input.whatsapp ? `WhatsApp: ${input.whatsapp}` : null,
    input.preferredSchedule ? `Melhores horarios: ${input.preferredSchedule}` : null,
    "",
    "Mensagem:",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildWhatsAppUrl(input: LeadMessageInput): string | null {
  const target = normalizeWhatsAppNumber(env.publicWhatsAppNumber);
  if (!target) return null;
  const text = encodeURIComponent(formatLeadMessage(input));
  return `https://wa.me/${target}?text=${text}`;
}
