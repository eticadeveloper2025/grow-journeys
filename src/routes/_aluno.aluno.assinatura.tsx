import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_aluno/aluno/assinatura")({
  head: () => ({ meta: [{ title: "Redirecionando para plano — Nerya" }] }),
  beforeLoad: () => {
    throw redirect({ to: "/aluno/plano", replace: true });
  },
});
