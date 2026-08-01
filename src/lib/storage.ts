/**
 * Serviço único de acesso ao localStorage.
 * Nenhum componente deve chamar window.localStorage diretamente.
 */

const PREFIX = "nerya:";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* ignore quota */
    }
  },
  remove(key: string): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(PREFIX + key);
  },
  clearAll(): void {
    if (!isBrowser()) return;
    const keys = Object.keys(window.localStorage).filter((k) => k.startsWith(PREFIX));
    keys.forEach((k) => window.localStorage.removeItem(k));
  },
};

export const STORAGE_KEYS = {
  session: "session",
  progress: "progress",
  favoritesCourses: "favorites:courses",
  favoritesPosts: "favorites:posts",
  enrollments: "enrollments",
  certificates: "certificates",
  prefs: "prefs",
  quiz: "quiz",
  plan: "plan",
  bookings: "bookings",
  credits: "credits",
  notifications: "notifications",
  users: "users",
} as const;
