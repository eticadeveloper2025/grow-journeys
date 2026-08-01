import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/planos/sucesso")({
  validateSearch: (s) => z.object({ plan: z.string().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Plano ativo — Nerya" },
      { name: "description", content: "Plano demonstrativo de aulas particulares ativado com sucesso." },
    ],
  }),
  component: Success,
});

function Success() {
  const { plan } = useSearch({ from: "/planos/sucesso" });
  return (
    <PublicLayout>
      <section className="container-page flex flex-col items-center py-24 text-center">
        <CheckCircle2 className="mb-4 h-14 w-14 text-primary" />
        <h1 className="font-display text-4xl">Tudo certo (demo).</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Seu plano demonstrativo {plan ? <b>{plan}</b> : ""} foi ativado. Nenhum pagamento foi processado.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild><Link to="/aluno">Ir para minha área</Link></Button>
          <Button asChild variant="ghost"><Link to="/aluno/agendar">Agendar aula</Link></Button>
        </div>
      </section>
    </PublicLayout>
  );
}
