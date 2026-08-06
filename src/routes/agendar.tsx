import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { SchedulingCalendar } from "@/components/SchedulingCalendar";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar aula — Nerya" },
      {
        name: "description",
        content:
          "Consulte o calendário de disponibilidade e agende uma aula particular de inglês ao vivo.",
      },
    ],
  }),
  component: SchedulePublic,
});

function SchedulePublic() {
  return (
    <PublicLayout>
      <section className="container-page grid gap-8 py-10 md:py-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <LeadCaptureForm
          intent="scheduling"
          title="Pedir um horário"
          description="Envie sua disponibilidade e objetivo. A resposta pode chegar por e-mail ou pelo WhatsApp Web com mensagem preenchida."
        />
        <SchedulingCalendar framed={false} />
      </section>
    </PublicLayout>
  );
}
