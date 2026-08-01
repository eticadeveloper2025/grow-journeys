import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingRepository, planRepository } from "@/repositories";
import { bookingService } from "@/services/bookingService";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, Clock3, CreditCard } from "lucide-react";
import { formatBookingDateTime, BOOKING_STATUS_LABEL } from "@/utils/bookings";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/aluno/")({
  head: () => ({
    meta: [
      { title: "Minha área — Nerya" },
      { name: "description", content: "Dashboard do aluno com próximas aulas, créditos, plano atual e histórico recente." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const upcoming = useQuery({
    queryKey: ["bookings", "upcoming", user?.id],
    queryFn: () => bookingRepository.upcomingForUser(user!.id),
    enabled: !!user,
  });
  const history = useQuery({
    queryKey: ["bookings", "history", user?.id],
    queryFn: () => bookingRepository.historyForUser(user!.id),
    enabled: !!user,
  });
  const credits = useQuery({
    queryKey: ["credits", user?.id],
    queryFn: () => bookingRepository.creditBalance(user!.id),
    enabled: !!user,
  });
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => planRepository.list() });
  const cancel = useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking({ bookingId, user: user!, reason: "Cancelada pelo aluno." }),
    onSuccess: () => {
      toast.success("Aula cancelada (demonstrativo). Nenhum e-mail real foi enviado.");
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["credits"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Nao foi possivel cancelar."),
  });

  const currentPlan = plans.data?.data.find((p) => p.id === credits.data?.data.planId);
  const nextLesson = upcoming.data?.data[0];
  const isLoading = upcoming.isPending || history.isPending || credits.isPending || plans.isPending;
  const error = upcoming.error ?? history.error ?? credits.error ?? plans.error;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Bem-vinda(o) de volta</p>
        <h1 className="mt-1 font-display text-4xl">Olá, {user?.fullName.split(" ")[0]}.</h1>
      </div>

      {isLoading && <LoadingBlock label="Carregando sua agenda…" />}
      {error && (
        <ErrorState
          error={error}
          onRetry={() => {
            upcoming.refetch();
            history.refetch();
            credits.refetch();
            plans.refetch();
          }}
        />
      )}

      {!isLoading && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard icon={<CalendarDays className="h-4 w-4" />} label="Próximas aulas" value={upcoming.data?.data.length ?? 0} />
            <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Aulas realizadas" value={history.data?.data.filter((b) => b.status === "completed").length ?? 0} />
            <StatCard icon={<Clock3 className="h-4 w-4" />} label="Créditos disponíveis" value={credits.data?.data.remainingCredits ?? 0} />
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><CreditCard className="h-4 w-4" />Plano atual</div>
              <div className="mt-2 font-display text-3xl">{currentPlan?.name ?? "Sem plano"}</div>
              {credits.data?.data && <div className="mt-1 text-xs text-muted-foreground">{credits.data.data.totalCredits} créditos por ciclo</div>}
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary">Próxima aula</p>
                  <h2 className="font-display text-2xl">Horário reservado</h2>
                </div>
                <Button asChild size="sm"><Link to="/aluno/agendar">Agendar nova aula</Link></Button>
              </div>
              {!nextLesson ? (
                <EmptyState
                  title="Nenhuma aula agendada"
                  description="Reserve um horário para continuar praticando."
                  action={<Button asChild><Link to="/aluno/agendar">Agendar nova aula</Link></Button>}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-medium">{formatBookingDateTime(nextLesson)}</div>
                    <div className="mt-1 text-sm text-muted-foreground">Duração: {nextLesson.durationMinutes} min · Formato: online</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{BOOKING_STATUS_LABEL[nextLesson.status]}</Badge>
                    {nextLesson.topic && <Badge variant="outline">{nextLesson.topic}</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="secondary"><Link to="/aluno/aulas">Visualizar detalhes</Link></Button>
                    <Button variant="ghost" onClick={() => cancel.mutate(nextLesson.id)} disabled={cancel.isPending}>
                      {cancel.isPending ? "Cancelando…" : "Cancelar aula"}
                    </Button>
                    <Button asChild variant="ghost"><Link to="/aluno/agendar">Reagendar</Link></Button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl">Próximas aulas</h2>
                <Button asChild variant="ghost" size="sm"><Link to="/aluno/aulas">Ver todas</Link></Button>
              </div>
              {(upcoming.data?.data.length ?? 0) === 0 ? (
                <EmptyState title="Agenda vazia" description="Quando houver reservas, elas aparecerão aqui." />
              ) : (
                <div className="space-y-3">
                  {upcoming.data?.data.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
                      <div className="text-sm font-medium">{formatBookingDateTime(booking)}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{booking.topic ?? "Tema a definir"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border/60 bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">Histórico recente</h2>
              <Button asChild variant="ghost" size="sm"><Link to="/aluno/historico">Ver histórico</Link></Button>
            </div>
            {(history.data?.data.length ?? 0) === 0 ? (
              <EmptyState title="Sem aulas realizadas" description="Seu histórico aparecerá após as primeiras aulas." />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {history.data?.data.slice(0, 4).map((booking) => (
                  <div key={booking.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium">{formatBookingDateTime(booking)}</div>
                      <Badge variant="secondary">{BOOKING_STATUS_LABEL[booking.status]}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{booking.topic ?? "Tema registrado na aula"}</div>
                    {booking.notes && <div className="mt-1 text-xs text-muted-foreground">{booking.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-2 font-display text-4xl">{value}</div>
    </div>
  );
}
