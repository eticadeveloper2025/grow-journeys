import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { bookingRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/States";
import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_LABEL, formatBookingDateTime } from "@/utils/bookings";

export const Route = createFileRoute("/_aluno/aluno/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de aulas — Nerya" },
      { name: "description", content: "Visualize as aulas realizadas, status, tópicos trabalhados e observações." },
    ],
  }),
  component: LessonHistory,
});

function LessonHistory() {
  const { user } = useAuth();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["bookings", "history", user?.id],
    queryFn: () => bookingRepository.historyForUser(user!.id),
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Participação</p>
        <h1 className="mt-1 font-display text-4xl">Histórico de aulas</h1>
      </div>
      {isPending && <LoadingBlock label="Carregando histórico…" />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EmptyState title="Sem aulas no histórico" description="As aulas realizadas serão registradas aqui." />
      )}
      <div className="space-y-3">
        {data?.data.map((booking) => (
          <div key={booking.id} className="rounded-xl border border-border/60 bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-2xl">{formatBookingDateTime(booking)}</h2>
              <Badge variant="secondary">{BOOKING_STATUS_LABEL[booking.status]}</Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Duração: {booking.durationMinutes} min · Formato: online</div>
            {booking.topic && <p className="mt-4 text-sm text-foreground">Assunto trabalhado: {booking.topic}</p>}
            {booking.notes && <p className="mt-1 text-sm text-muted-foreground">Observação: {booking.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
