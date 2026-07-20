import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import type { Session } from "@/types";

/**
 * Guard demonstrativo. A validação real de autorização
 * deverá ser feita pelo backend com verificação de role.
 */
export const Route = createFileRoute("/_admin")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const session = storage.get<Session | null>(STORAGE_KEYS.session, null);
    if (!session) {
      throw redirect({ to: "/entrar", search: { redirect: location.href } });
    }
    if (session.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});
