import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, CalendarCheck2, ChevronLeft, ChevronRight, Clock3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bookingRepository, planRepository } from "@/repositories";
import { bookingService } from "@/services/bookingService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState, ErrorState } from "@/components/States";
import { schedulingConfig } from "@/config/scheduling";
import { formatDateLong } from "@/utils/format";
import { monthRange } from "@/utils/scheduling";
import { cn } from "@/lib/utils";
import type { AvailabilitySlot, Booking, Plan } from "@/types";
import { ApiError } from "@/types";

type SchedulingCalendarProps = {
  framed?: boolean;
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function formatSlotDate(slot: AvailabilitySlot): string {
  return formatDateLong(`${slot.date}T12:00:00`);
}

function statusText(slot: AvailabilitySlot): string {
  if (slot.available) return "Disponível";
  if (slot.unavailableReason === "booked") return "Reservado";
  if (slot.unavailableReason === "past") return "Indisponível";
  return "Bloqueado";
}

function mutationMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "SLOT_UNAVAILABLE") return "Esse horário acabou de ser reservado. Escolha outro horário.";
    if (error.code === "NO_CREDITS") return "Você não possui créditos disponíveis para confirmar esta aula.";
    return error.message;
  }
  return error instanceof Error ? error.message : "Não foi possível confirmar o agendamento.";
}

function planFrequency(plan?: Plan): string {
  if (!plan) return "Sem plano ativo";
  return plan.lessonsPerWeek > 0 ? `${plan.lessonsPerWeek}x por semana` : "Aula avulsa";
}

export function SchedulingCalendar({ framed = true }: SchedulingCalendarProps) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const range = useMemo(() => monthRange(visibleMonth), [visibleMonth]);
  const availability = useQuery({
    queryKey: ["availability", range],
    queryFn: () => bookingRepository.availability(range),
  });
  const credits = useQuery({
    queryKey: ["credits", user?.id],
    queryFn: () => bookingRepository.creditBalance(user!.id),
    enabled: !!user,
  });
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => planRepository.list() });

  const slots = availability.data?.data ?? [];
  const availableSlots = slots.filter((slot) => slot.available);
  const availableDates = useMemo(() => new Set(availableSlots.map((slot) => slot.date)), [availableSlots]);
  const selectedDaySlots = slots.filter((slot) => slot.date === selectedDate);
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  const activePlan = plans.data?.data.find((plan) => plan.id === credits.data?.data.planId);
  const balance = credits.data?.data;
  const hasCredits = (balance?.remainingCredits ?? 0) > 0;
  const isSessionExpired = !authLoading && !user;
  const isCalendarLoading = availability.isPending;
  const isTimesLoading = availability.isFetching && !!selectedDate;
  const error = availability.error ?? credits.error ?? plans.error;

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 0 });
    const days: Date[] = [];
    for (let day = start; day <= end; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
      days.push(day);
    }
    return days;
  }, [visibleMonth]);

  useEffect(() => {
    if (selectedDate && availableDates.has(selectedDate)) return;
    const first = availableSlots[0];
    setSelectedDate(first?.date ?? "");
    setSelectedSlotId("");
  }, [availableDates, availableSlots, selectedDate]);

  const confirm = useMutation({
    mutationFn: () => {
      if (!user || !selectedSlot) throw new ApiError({ code: "SESSION_REQUIRED", message: "Entre novamente para agendar." });
      return bookingService.confirmBooking({ user, slotId: selectedSlot.id });
    },
    onSuccess: ({ data }) => {
      setConfirmedBooking(data.booking);
      setConfirmOpen(false);
      setSelectedSlotId("");
      toast.success("Aula agendada (demonstrativo).");
      qc.invalidateQueries({ queryKey: ["availability"] });
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["credits"] });
    },
    onError: (err) => toast.error(mutationMessage(err)),
  });

  const retryAll = () => {
    availability.refetch();
    credits.refetch();
    plans.refetch();
  };

  const content = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Agenda</p>
          <h1 className="mt-1 font-display text-4xl">Agende sua próxima aula</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Escolha uma data, selecione um horário disponível e confirme a reserva usando um crédito.
          </p>
        </div>
        <SummaryPill label="Créditos" value={authLoading ? "..." : String(balance?.remainingCredits ?? 0)} />
        <SummaryPill label="Plano ativo" value={plans.isPending ? "..." : planFrequency(activePlan)} />
      </div>

      {isSessionExpired && (
        <Alert className="border-primary/30 bg-primary/10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sessão necessária</AlertTitle>
          <AlertDescription>
            Entre na sua conta demonstrativa para consultar créditos e confirmar o agendamento.
            <Button asChild size="sm" className="mt-3 bg-brand text-primary-foreground hover:bg-brand-dark">
              <Link to="/entrar" search={{ redirect: "/agendar" }}>Entrar para agendar</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!isSessionExpired && !credits.isPending && !hasCredits && (
        <Alert className="border-destructive/40 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Créditos insuficientes</AlertTitle>
          <AlertDescription>
            Você precisa de créditos disponíveis para reservar um horário. Escolha um plano ou aguarde o próximo ciclo.
          </AlertDescription>
        </Alert>
      )}

      {confirmedBooking && (
        <Alert className="border-primary/30 bg-primary/10">
          <CalendarCheck2 className="h-4 w-4" />
          <AlertTitle>Agendamento confirmado</AlertTitle>
          <AlertDescription>
            Aula reservada para {formatDateLong(`${confirmedBooking.date}T12:00:00`)} das {confirmedBooking.startTime} às {confirmedBooking.endTime}.
            A tentativa de notificação mockada foi registrada. Nenhum e-mail real foi enviado.
          </AlertDescription>
        </Alert>
      )}

      {confirm.isError && (
        <Alert className="border-destructive/40 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Não foi possível confirmar</AlertTitle>
          <AlertDescription>{mutationMessage(confirm.error)}</AlertDescription>
        </Alert>
      )}

      {error ? (
        <ErrorState error={error} onRetry={retryAll} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-lg border border-border/60 bg-card p-4 md:p-6" aria-labelledby="calendar-title">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 id="calendar-title" className="font-display text-2xl">Calendário</h2>
                <p className="text-sm text-muted-foreground">
                  {format(visibleMonth, "MMMM yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label="Mês anterior"
                  onClick={() => {
                    setVisibleMonth((month) => addMonths(month, -1));
                    setSelectedSlotId("");
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label="Próximo mês"
                  onClick={() => {
                    setVisibleMonth((month) => addMonths(month, 1));
                    setSelectedSlotId("");
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isCalendarLoading ? (
              <CalendarSkeleton />
            ) : availableSlots.length === 0 ? (
              <EmptyState title="Nenhum dia disponível" description="Não há horários livres neste mês. Tente navegar para o próximo mês." />
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {WEEKDAYS.map((day) => <div key={day} className="py-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const key = format(day, "yyyy-MM-dd");
                    const available = availableDates.has(key);
                    const selected = selectedDate === key;
                    const currentMonth = isSameMonth(day, visibleMonth);
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={!available}
                        aria-pressed={selected}
                        aria-current={isToday(day) ? "date" : undefined}
                        onClick={() => {
                          setSelectedDate(key);
                          setSelectedSlotId("");
                        }}
                        className={cn(
                          "aspect-square rounded-md border text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          currentMonth ? "text-foreground" : "text-muted-foreground/40",
                          available
                            ? "border-primary/30 bg-primary/10 hover:border-primary hover:bg-primary/15"
                            : "border-border/40 bg-background/30 text-muted-foreground/40",
                          selected && "border-primary bg-primary text-primary-foreground hover:bg-primary",
                          isToday(day) && !selected && "ring-1 ring-primary/60",
                        )}
                      >
                        {format(day, "d")}
                        <span className="sr-only">
                          {available ? ", com horários disponíveis" : ", indisponível"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Disponível</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-primary" /> Hoje</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted" /> Indisponível</span>
                </div>
              </>
            )}
          </section>

          <section className="rounded-lg border border-border/60 bg-card p-4 md:p-6" aria-labelledby="times-title">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 id="times-title" className="font-display text-2xl">Horários</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedDate ? formatDateLong(`${selectedDate}T12:00:00`) : "Selecione uma data disponível"}
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {schedulingConfig.lessonDurationMinutes} min
              </Badge>
            </div>
            <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
              Período: {schedulingConfig.startTime}-{schedulingConfig.endTime}
            </p>

            {isTimesLoading ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-14" />)}
              </div>
            ) : selectedDate && selectedDaySlots.length === 0 ? (
              <EmptyState title="Nenhum horário disponível" description="Escolha outra data no calendário." />
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {selectedDaySlots.map((slot) => {
                  const selected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      aria-pressed={selected}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={cn(
                        "flex min-h-14 items-center justify-between rounded-md border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        slot.available
                          ? "border-border/60 bg-background/50 hover:border-primary/60"
                          : "border-border/40 bg-background/20 text-muted-foreground/60",
                        selected && "border-primary bg-primary/15",
                      )}
                    >
                      <span>
                        <span className="block text-sm font-medium">{slot.startTime}-{slot.endTime}</span>
                        <span className="block text-xs text-muted-foreground">{statusText(slot)}</span>
                      </span>
                      <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-6 rounded-lg border border-border/60 bg-background/40 p-4">
              <h3 className="font-display text-xl">Resumo</h3>
              {selectedSlot ? (
                <dl className="mt-3 grid gap-2 text-sm">
                  <SummaryRow label="Data" value={formatSlotDate(selectedSlot)} />
                  <SummaryRow label="Horário" value={`${selectedSlot.startTime}-${selectedSlot.endTime}`} />
                  <SummaryRow label="Duração" value={`${schedulingConfig.lessonDurationMinutes} min`} />
                  <SummaryRow label="Plano" value={planFrequency(activePlan)} />
                  <SummaryRow label="Saldo após reserva" value={`${Math.max((balance?.remainingCredits ?? 0) - 1, 0)} créditos`} />
                </dl>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Selecione um horário para revisar a reserva.</p>
              )}
              <Button
                className="mt-4 w-full bg-brand text-primary-foreground hover:bg-brand-dark"
                disabled={!selectedSlot || confirm.isPending || !hasCredits}
                onClick={() => {
                  if (!user) {
                    navigate({ to: "/entrar", search: { redirect: "/agendar" } });
                    return;
                  }
                  if (selectedSlot) setConfirmOpen(true);
                }}
              >
                Revisar e confirmar
              </Button>
            </div>
          </section>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={(open) => !confirm.isPending && setConfirmOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar agendamento</DialogTitle>
            <DialogDescription>
              Revise os dados antes de consumir um crédito. A disponibilidade será validada novamente na confirmação.
            </DialogDescription>
          </DialogHeader>
          {selectedSlot && (
            <div className="rounded-lg border border-border/60 bg-surface p-4">
              <dl className="grid gap-2 text-sm">
                <SummaryRow label="Data" value={formatSlotDate(selectedSlot)} />
                <SummaryRow label="Horário" value={`${selectedSlot.startTime}-${selectedSlot.endTime}`} />
                <SummaryRow label="Duração" value={`${schedulingConfig.lessonDurationMinutes} min`} />
                <SummaryRow label="Plano" value={planFrequency(activePlan)} />
                <SummaryRow label="Crédito usado" value="1 crédito" />
                <SummaryRow label="Saldo após reserva" value={`${Math.max((balance?.remainingCredits ?? 0) - 1, 0)} créditos`} />
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">
                Cancelamentos seguem o prazo mínimo de {schedulingConfig.cancellationLimitHours} horas de antecedência.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" disabled={confirm.isPending} onClick={() => setConfirmOpen(false)}>
              Voltar
            </Button>
            <Button
              type="button"
              className="bg-brand text-primary-foreground hover:bg-brand-dark"
              disabled={!selectedSlot || confirm.isPending || !hasCredits}
              onClick={() => confirm.mutate()}
            >
              {confirm.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando
                </>
              ) : (
                "Confirmar agendamento"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return framed ? <div className="rounded-xl border border-border/60 bg-card/60 p-5 md:p-6">{content}</div> : content;
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-36 rounded-lg border border-border/60 bg-card px-4 py-3">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl">{value}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, index) => <Skeleton key={index} className="h-8" />)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, index) => <Skeleton key={index} className="aspect-square" />)}
      </div>
    </div>
  );
}
