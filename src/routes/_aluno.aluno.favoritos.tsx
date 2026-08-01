import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_aluno/aluno/favoritos")({
  head: () => ({ meta: [{ title: "Redirecionando para próximas aulas — Nerya" }] }),
  beforeLoad: () => {
    throw redirect({ to: "/aluno/aulas", replace: true });
  },
});
