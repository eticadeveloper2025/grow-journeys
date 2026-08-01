import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/conteudos/")({
  head: () => ({ meta: [{ title: "Redirecionando para como funciona — Nerya" }] }),
  beforeLoad: () => {
    throw redirect({ to: "/como-funciona", replace: true });
  },
});
