import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AlunoLayout } from "@/layouts/AlunoLayout";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import type { Session } from "@/types";

/**
 * Guard demonstrativo. A validação real de autorização
 * deverá ser feita pelo backend (JWT/cookie de sessão).
 */
export const Route = createFileRoute("/_aluno")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const session = storage.get<Session | null>(STORAGE_KEYS.session, null);
    if (!session) {
      throw redirect({ to: "/entrar", search: { redirect: location.href } });
    }
  },
  component: () => (
    <AlunoLayout>
      <Outlet />
    </AlunoLayout>
  ),
});
