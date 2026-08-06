import { afterEach, describe, expect, it, vi } from "vitest";
import type { ApiResponse, LeadSubmissionResult } from "@/types";

const successResponse: ApiResponse<LeadSubmissionResult> = {
  data: {
    id: "lead-123",
    status: "queued",
    provider: "backend",
    message: "Solicitacao enviada com sucesso.",
    createdAt: "2026-08-05T20:00:00.000Z",
  },
};

function localStorageStub() {
  const data = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => data.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => data.set(key, value)),
    removeItem: vi.fn((key: string) => data.delete(key)),
  };
}

async function importLeadService(env: Record<string, string>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value);
  }
  return import("./leadService");
}

describe("leadService", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("resolves email submissions only after the API confirms success", async () => {
    const { leadService } = await importLeadService({
      VITE_LEADS_DATA_SOURCE: "api",
      VITE_API_BASE_URL: "/api",
    });

    let resolveFetch: (response: Response) => void = () => {};
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );
    vi.stubGlobal("window", { location: { href: "https://nerya.example/contato" } });

    const submission = leadService.submit({
      intent: "contact",
      fullName: "Guilherme Nery",
      email: "guilherme@example.com",
      preferredChannel: "email",
      message: "Quero saber mais.",
      renderedAt: "2026-08-05T20:00:00.000Z",
    });

    let settled = false;
    void submission.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);

    resolveFetch(
      new Response(JSON.stringify(successResponse), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );

    await expect(submission).resolves.toEqual(successResponse);
    expect(settled).toBe(true);
  });

  it("keeps WhatsApp as a manual send flow", async () => {
    const open = vi.fn();
    const storage = localStorageStub();
    vi.stubGlobal("window", {
      location: { href: "https://nerya.example/agendar" },
      open,
      localStorage: storage,
    });

    const { leadService } = await importLeadService({
      VITE_LEADS_DATA_SOURCE: "api",
      VITE_PUBLIC_WHATSAPP_NUMBER: "5511999999999",
    });

    const response = await leadService.submit({
      intent: "scheduling",
      fullName: "Guilherme Nery",
      email: "guilherme@example.com",
      whatsapp: "(11) 99999-9999",
      preferredChannel: "whatsapp",
      preferredSchedule: "tercas a noite",
      message: "Quero agendar uma aula.",
    });

    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("https://wa.me/5511999999999"),
      "_blank",
      "noopener,noreferrer",
    );
    expect(response.data.provider).toBe("whatsapp-web");
    expect(response.data.message.toLowerCase()).toContain("revise e envie");
    expect(response.data.message.toLowerCase()).not.toContain("enviada automaticamente");
  });
});
