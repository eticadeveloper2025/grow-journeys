import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingRepository, planRepository, subscriptionRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/States";
import { Button } from "@/components/ui/button";
import { DemoBanner } from "@/components/DemoBanner";
import { formatDateBR, formatPriceBRL } from "@/utils/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/aluno/plano")({
  head: () => ({
    meta: [
      { title: "Plano e créditos — Nerya" },
      { name: "description", content: "Consulte seu plano atual, créditos disponíveis e ciclo de aulas." },
    ],
  }),
  component: StudentPlan,
});

function StudentPlan() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const credits = useQuery({
    queryKey: ["credits", user?.id],
    queryFn: () => bookingRepository.creditBalance(user!.id),
    enabled: !!user,
  });
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => planRepository.list() });
  const sub = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: () => subscriptionRepository.current(user!.id),
    enabled: !!user,
  });
  const cancel = useMutation({
    mutationFn: () => subscriptionRepository.cancel(user!.id),
    onSuccess: () => {
      toast.success("Plano cancelado (demonstrativo).");
      qc.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
  const error = credits.error ?? plans.error ?? sub.error;
  const currentPlan = plans.data?.data.find((p) => p.id === credits.data?.data.planId) ?? sub.data?.data?.plan;

  if (credits.isPending || plans.isPending || sub.isPending) return <LoadingBlock label="Carregando plano…" />;
  if (error) return <ErrorState error={error} onRetry={() => { credits.refetch(); plans.refetch(); sub.refetch(); }} />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Plano</p>
        <h1 className="mt-1 font-display text-4xl">Plano e créditos</h1>
      </div>
      <DemoBanner>Ambiente demonstrativo — nenhum pagamento será realizado.</DemoBanner>

      {!currentPlan || !credits.data?.data ? (
        <EmptyState
          title="Sem plano ativo"
          description="Escolha um plano para reservar aulas particulares."
          action={<Button asChild><Link to="/planos">Ver planos</Link></Button>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="text-xs uppercase tracking-widest text-primary">Plano atual</div>
            <div className="mt-1 font-display text-3xl">{currentPlan.name}</div>
            <p className="mt-2 text-sm text-muted-foreground">{currentPlan.description}</p>
            <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
              <div>
                <div className="text-muted-foreground">Ciclo</div>
                <div>{formatDateBR(credits.data.data.cycleStart)} a {formatDateBR(credits.data.data.cycleEnd)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Créditos usados</div>
                <div>{credits.data.data.usedCredits} de {credits.data.data.totalCredits}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Valor mensal</div>
                <div>{formatPriceBRL(currentPlan.monthlyPriceCents)}</div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild variant="secondary"><Link to="/planos">Alterar plano</Link></Button>
              <Button variant="ghost" onClick={() => cancel.mutate()} disabled={cancel.isPending || sub.data?.data?.status === "canceled"}>
                {sub.data?.data?.status === "canceled" ? "Cancelado" : "Cancelar plano"}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="text-xs uppercase tracking-widest text-primary">Créditos disponíveis</div>
            <div className="mt-3 font-display text-6xl">{credits.data.data.remainingCredits}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Use seus créditos para reservar novos horários neste ciclo.
            </p>
            <Button asChild className="mt-6 w-full"><Link to="/aluno/agendar">Agendar aula</Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
