import { createFileRoute } from "@tanstack/react-router";
import { SchedulingCalendar } from "@/components/SchedulingCalendar";

export const Route = createFileRoute("/_aluno/aluno/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar aula — Minha área Nerya" },
      { name: "description", content: "Reserve horários disponíveis usando seus créditos de aula." },
    ],
  }),
  component: StudentSchedule,
});

function StudentSchedule() {
  return <SchedulingCalendar />;
}
