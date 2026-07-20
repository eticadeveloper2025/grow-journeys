import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/planos/sucesso")({
  validateSearch: (s) => z.object({ plan: z.string().optional() }).parse(s),
  head: () => ({ meta: [{ title: "Assinatura ativa — Nerya" }] }),
  component: Success,
});

function Success() {
  const { plan } = useSearch({ from: "/planos/sucesso" });
  return (
    <PublicLayout>
      <section className="container-page flex flex-col items-center py-24 text-center">
        <CheckCircle2 className="mb-4 h-14 w-14 text-primary" />
        <h1 className="font-serif text-4xl">Tudo certo (demo).</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Sua assinatura demonstrativa {plan ? <b>{plan}</b> : ""} foi ativada. Nenhum pagamento foi processado.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild><Link to="/aluno">Ir para minha área</Link></Button>
          <Button asChild variant="ghost"><Link to="/cursos">Explorar cursos</Link></Button>
        </div>
      </section>
    </PublicLayout>
  );
}
