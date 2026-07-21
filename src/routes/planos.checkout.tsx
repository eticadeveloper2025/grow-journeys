import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoBanner } from "@/components/DemoBanner";
import { useQuery } from "@tanstack/react-query";
import { planRepository, subscriptionRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { formatPriceBRL } from "@/utils/format";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  plan: z.string(),
  cycle: z.enum(["monthly", "yearly"]).default("monthly"),
});

export const Route = createFileRoute("/planos/checkout")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Checkout — Nerya" }] }),
  component: Checkout,
});

const COUPON = "NERYA20";

function Checkout() {
  const { plan: planId, cycle } = useSearch({ from: "/planos/checkout" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = useQuery({ queryKey: ["plan", planId], queryFn: () => planRepository.byId(planId) });
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const plan = data?.data;
  const basePrice = plan ? (cycle === "yearly" ? plan.yearlyPriceCents : plan.monthlyPriceCents) : 0;
  const finalPrice = applied ? Math.round(basePrice * 0.8) : basePrice;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Faça login para continuar.");
      navigate({ to: "/entrar", search: { redirect: "/planos" } });
      return;
    }
    if (!plan) return;
    setLoading(true);
    try {
      await subscriptionRepository.subscribe(user.id, plan.id, cycle);
      navigate({ to: "/planos/sucesso", search: { plan: plan.id } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="container-page grid max-w-5xl gap-8 py-14 md:grid-cols-[1.2fr_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
          <h1 className="font-display text-3xl">Checkout</h1>
          <DemoBanner>Não pedimos dados de pagamento. Isto é apenas uma simulação.</DemoBanner>
          <div>
            <Label>Nome</Label>
            <Input required defaultValue={user?.fullName ?? ""} />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input required type="email" defaultValue={user?.email ?? ""} />
          </div>
          <div>
            <Label>Cupom</Label>
            <div className="flex gap-2">
              <Input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="NERYA20" />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (coupon === COUPON) {
                    setApplied(true);
                    toast.success("Cupom aplicado (demo).");
                  } else {
                    toast.error("Cupom inválido.");
                  }
                }}
              >
                Aplicar
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !plan}>
            {loading ? "Processando…" : "Confirmar (demo)"}
          </Button>
          <div className="text-center text-xs text-muted-foreground">
            <Link to="/planos" className="hover:text-primary">← Voltar aos planos</Link>
          </div>
        </form>

        <aside className="h-fit rounded-xl border border-border/60 bg-card p-6">
          <div className="text-xs uppercase tracking-widest text-primary">Resumo</div>
          {plan && (
            <>
              <div className="mt-3 font-display text-2xl">{plan.name}</div>
              <div className="text-sm text-muted-foreground">Ciclo: {cycle === "yearly" ? "Anual" : "Mensal"}</div>
              <div className="mt-6 space-y-1.5 border-t border-border/60 pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{formatPriceBRL(basePrice)}</span>
                </div>
                {applied && (
                  <div className="flex justify-between text-primary">
                    <span>Cupom NERYA20</span><span>-{formatPriceBRL(basePrice - finalPrice)}</span>
                  </div>
                )}
                <div className="mt-4 flex justify-between border-t border-border/60 pt-3 font-display text-lg text-foreground">
                  <span>Total</span><span>{formatPriceBRL(finalPrice)}</span>
                </div>
              </div>
            </>
          )}
        </aside>
      </section>
    </PublicLayout>
  );
}
