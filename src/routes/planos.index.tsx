import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useQuery } from "@tanstack/react-query";
import { planRepository } from "@/repositories";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Check, X, Star } from "lucide-react";
import { formatPriceBRL } from "@/utils/format";
import { DemoBanner } from "@/components/DemoBanner";
import { LoadingBlock } from "@/components/States";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planos/")({
  head: () => ({
    meta: [
      { title: "Planos — Nerya" },
      { name: "description", content: "Escolha o plano que combina com seu ritmo de estudo." },
    ],
  }),
  component: Plans,
});

function Plans() {
  const [yearly, setYearly] = useState(false);
  const { data, isPending } = useQuery({ queryKey: ["plans"], queryFn: () => planRepository.list() });

  return (
    <PublicLayout>
      <section className="container-page py-16">
        <p className="text-xs uppercase tracking-widest text-primary">Planos</p>
        <h1 className="mt-2 font-serif text-5xl">Assine e desbloqueie tudo.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Comece pelo Explorar. Evolua quando quiser.
        </p>

        <div className="mt-6"><DemoBanner>Ambiente demonstrativo — nenhum pagamento será realizado.</DemoBanner></div>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm">
          <span className={cn(!yearly && "text-foreground", yearly && "text-muted-foreground")}>Mensal</span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span className={cn(yearly && "text-foreground", !yearly && "text-muted-foreground")}>
            Anual <span className="ml-1 rounded bg-primary/15 px-1.5 py-0.5 text-xs text-primary">-2 meses</span>
          </span>
        </div>

        {isPending && <div className="mt-10"><LoadingBlock /></div>}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {data?.data.map((plan) => {
            const price = yearly ? plan.yearlyPriceCents : plan.monthlyPriceCents;
            const cycle = yearly ? "/ ano" : "/ mês";
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border border-border/60 bg-card p-7",
                  plan.featured && "border-primary/50 glow-accent",
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Star className="h-3 w-3" /> Recomendado
                  </span>
                )}
                <div className="font-serif text-2xl">{plan.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6">
                  <span className="font-serif text-5xl">{price === 0 ? "Grátis" : formatPriceBRL(price)}</span>
                  {price > 0 && <span className="ml-1 text-sm text-muted-foreground">{cycle}</span>}
                </div>
                <ul className="mt-6 flex-1 space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f.id} className="flex items-start gap-2">
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span className={cn(!f.included && "text-muted-foreground/60")}>{f.feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full" variant={plan.featured ? "default" : "secondary"}>
                  <Link
                    to="/planos/checkout"
                    search={{ plan: plan.id, cycle: yearly ? "yearly" : "monthly" }}
                  >
                    {price === 0 ? "Começar" : "Assinar"}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}
