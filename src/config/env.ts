/**
 * Configuração centralizada de ambiente.
 * Lê variáveis VITE_* de forma tipada e tolerante a ausência.
 */
type DataSource = "mock" | "api";

function readString(key: string, fallback: string): string {
  const v = (import.meta.env as Record<string, string | undefined>)[key];
  return v && v.length > 0 ? v : fallback;
}

function readBool(key: string, fallback: boolean): boolean {
  const v = (import.meta.env as Record<string, string | undefined>)[key];
  if (v === undefined) return fallback;
  return v === "true" || v === "1";
}

export const env = {
  appName: readString("VITE_APP_NAME", "Nerya"),
  appEnv: readString("VITE_APP_ENV", "development"),
  dataSource: readString("VITE_DATA_SOURCE", "mock") as DataSource,
  leadsDataSource: readString("VITE_LEADS_DATA_SOURCE", "mock") as DataSource,
  apiBaseUrl: readString("VITE_API_BASE_URL", "http://localhost:3000/api"),
  enableMockErrors: readBool("VITE_ENABLE_MOCK_ERRORS", false),
  publicContactEmail: readString("VITE_PUBLIC_CONTACT_EMAIL", "oi@nerya.demo"),
  publicWhatsAppNumber: readString("VITE_PUBLIC_WHATSAPP_NUMBER", ""),
} as const;
