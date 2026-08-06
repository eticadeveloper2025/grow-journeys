import { env } from "@/config/env";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import type { ApiResponse, LeadRequest, LeadSubmissionResult } from "@/types";
import { buildWhatsAppUrl } from "@/utils/contact";
import { shortCode } from "@/utils/format";

type LeadSubmissionInput = Omit<LeadRequest, "id" | "createdAt"> & {
  website?: string;
  renderedAt?: string;
};

type LeadApiPayload = LeadRequest & {
  website?: string;
  renderedAt?: string;
};

function loadLocalLeads(): LeadRequest[] {
  return storage.get<LeadRequest[]>(STORAGE_KEYS.leadRequests, []);
}

function saveLocalLead(lead: LeadRequest): void {
  storage.set(STORAGE_KEYS.leadRequests, [...loadLocalLeads(), lead]);
}

function apiUrl(path: string): string {
  return `${env.apiBaseUrl.replace(/\/$/, "")}${path}`;
}

async function submitLeadToApi(lead: LeadApiPayload): Promise<ApiResponse<LeadSubmissionResult>> {
  const response = await fetch(apiUrl("/leads"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: lead.intent,
      fullName: lead.fullName,
      email: lead.email,
      whatsapp: lead.whatsapp,
      preferredChannel: lead.preferredChannel,
      preferredSchedule: lead.preferredSchedule,
      message: lead.message,
      origin: lead.origin,
      website: lead.website,
      renderedAt: lead.renderedAt,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Nao foi possivel enviar sua solicitacao agora.");
  }

  return response.json() as Promise<ApiResponse<LeadSubmissionResult>>;
}

export const leadService = {
  async submit(input: LeadSubmissionInput): Promise<ApiResponse<LeadSubmissionResult>> {
    const now = new Date().toISOString();
    const lead: LeadRequest = {
      ...input,
      fullName: input.fullName.trim(),
      email: input.email.trim(),
      whatsapp: input.whatsapp?.trim() || undefined,
      preferredSchedule: input.preferredSchedule?.trim() || undefined,
      message: input.message.trim(),
      origin: input.origin?.trim() || getCurrentOrigin(),
      id: `lead-${shortCode()}`,
      createdAt: now,
    };

    if (lead.preferredChannel === "whatsapp") {
      const whatsappUrl = buildWhatsAppUrl(lead);
      if (!whatsappUrl) {
        throw new Error("Configure VITE_PUBLIC_WHATSAPP_NUMBER para usar WhatsApp Web.");
      }
      saveLocalLead(lead);
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      return {
        data: {
          id: lead.id,
          status: "redirected",
          provider: "whatsapp-web",
          message: "Abrimos o WhatsApp Web com sua mensagem preenchida. Revise e envie por la.",
          whatsappUrl,
          createdAt: now,
        },
      };
    }

    if (env.leadsDataSource === "api") {
      return submitLeadToApi({
        ...lead,
        website: input.website,
        renderedAt: input.renderedAt,
      });
    }

    saveLocalLead(lead);
    return {
      data: {
        id: lead.id,
        status: "simulated",
        provider: "mock",
        message: "Solicitacao registrada localmente. Nenhum e-mail real foi enviado em modo mock.",
        createdAt: now,
      },
    };
  },
};

function getCurrentOrigin(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.location.href;
}
