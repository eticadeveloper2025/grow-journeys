import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cursos/")({
  head: () => ({ meta: [{ title: "Redirecionando para agendamento — Nerya" }] }),
  beforeLoad: () => {
    throw redirect({ to: "/agendar", replace: true });
  },
});
