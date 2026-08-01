import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingRepository } from "@/repositories";
import { bookingService } from "@/services/bookingService";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_LABEL, formatBookingDateTime } from "@/utils/bookings";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/aluno/aulas")({
  head: () => ({
    meta: [
      { title: "Próximas aulas — Nerya" },
      { name: "description", content: "Consulte suas próximas aulas particulares de inglês agendadas." },
    ],
  }),
  component: UpcomingLessons,
});

function UpcomingLessons() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["bookings", "upcoming", user?.id],
    queryFn: () => bookingRepository.upcomingForUser(user!.id),
    enabled: !!user,
  });
  const cancel = useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking({ bookingId, user: user!, reason: "Cancelada pelo aluno." }),
    onSuccess: () => {
      toast.success("Aula cancelada (demonstrativo). Nenhum e-mail real foi enviado.");
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["credits"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Nao foi possivel cancelar."),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Agenda</p>
          <h1 className="mt-1 font-display text-4xl">Próximas aulas</h1>
        </div>
        <Button asChild><Link to="/aluno/agendar">Agendar nova aula</Link></Button>
      </div>

      {isPending && <LoadingBlock label="Carregando próximas aulas…" />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EmptyState
          title="Nenhuma aula agendada"
          description="Reserve seu próximo horário para manter a frequência."
          action={<Button asChild><Link to="/aluno/agendar">Agendar nova aula</Link></Button>}
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.data.map((booking) => (
          <div key={booking.id} className="rounded-xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary">{BOOKING_STATUS_LABEL[booking.status]}</Badge>
              <span className="text-xs text-muted-foreground">{booking.durationMinutes} min</span>
            </div>
            <h2 className="mt-4 font-display text-2xl">{formatBookingDateTime(booking)}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{booking.topic ?? "Tema a definir com o professor."}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="secondary"><Link to="/aluno/agendar">Reagendar</Link></Button>
              <Button variant="ghost" onClick={() => cancel.mutate(booking.id)} disabled={cancel.isPending}>
                {cancel.isPending ? "Cancelando…" : "Cancelar aula"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
