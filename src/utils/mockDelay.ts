import { env } from "@/config/env";
import { ApiError } from "@/types";

export function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Injeta falha aleatória (~15%) se VITE_ENABLE_MOCK_ERRORS=true.
 * Serve para validar estados de erro/retry na UI.
 */
export function maybeMockError(context = "operação"): void {
  if (!env.enableMockErrors) return;
  if (Math.random() < 0.15) {
    throw new ApiError({
      code: "MOCK_ERROR",
      message: `Falha simulada na ${context}. Tente novamente.`,
    });
  }
}
