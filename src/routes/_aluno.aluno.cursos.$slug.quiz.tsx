import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_aluno/aluno/cursos/$slug/quiz")({
  head: () => ({ meta: [{ title: "Redirecionando para histórico — Nerya" }] }),
  beforeLoad: () => {
    throw redirect({ to: "/aluno/historico", replace: true });
  },
});
