import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { LoadingBlock, EmptyState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { DemoBanner } from "@/components/DemoBanner";
import { formatDateBR, formatPriceBRL } from "@/utils/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/aluno/assinatura")({
  head: () => ({ meta: [{ title: "Assinatura — Nerya" }] }),
  component: SubscriptionPage,
});

function SubscriptionPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: () => subscriptionRepository.current(user!.id),
    enabled: !!user,
  });
  const cancel = useMutation({
    mutationFn: () => subscriptionRepository.cancel(user!.id),
    onSuccess: () => {
      toast.success("Assinatura cancelada (demo).");
      qc.invalidateQueries({ queryKey: ["subscription"] });
    },
  });

  if (isPending) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Financeiro</p>
        <h1 className="mt-1 font-serif text-4xl">Assinatura</h1>
      </div>
      <DemoBanner />

      {!data?.data ? (
        <EmptyState
          title="Sem assinatura ativa"
          description="Escolha um plano para desbloquear todo o catálogo."
          action={<Button asChild><Link to="/planos">Ver planos</Link></Button>}
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="text-xs uppercase tracking-widest text-primary">Plano atual</div>
            <div className="mt-1 font-serif text-3xl">{data.data.plan.name}</div>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              <div>
                <div className="text-muted-foreground">Ciclo</div>
                <div>{data.data.billingCycle === "monthly" ? "Mensal" : "Anual"}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Próxima renovação</div>
                <div>{formatDateBR(data.data.renewalAt)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Valor</div>
                <div>{formatPriceBRL(data.data.billingCycle === "monthly" ? data.data.plan.monthlyPriceCents : data.data.plan.yearlyPriceCents)}</div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button asChild variant="secondary"><Link to="/planos">Alterar plano</Link></Button>
              <Button variant="ghost" onClick={() => cancel.mutate()} disabled={cancel.isPending || data.data.status === "canceled"}>
                {data.data.status === "canceled" ? "Cancelada" : "Cancelar"}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="mb-4 text-xs uppercase tracking-widest text-primary">Histórico (fictício)</div>
            <ul className="divide-y divide-border/40 text-sm">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center justify-between py-2.5">
                  <span>Cobrança #{String(1000 + i)}</span>
                  <span className="text-muted-foreground">{formatPriceBRL(data.data.plan.monthlyPriceCents)}</span>
                  <span className="text-xs text-primary">Pago</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
