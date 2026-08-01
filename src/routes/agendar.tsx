import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { SchedulingCalendar } from "@/components/SchedulingCalendar";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar aula — Nerya" },
      { name: "description", content: "Consulte o calendário de disponibilidade e agende uma aula particular de inglês ao vivo." },
    ],
  }),
  component: SchedulePublic,
});

function SchedulePublic() {
  return (
    <PublicLayout>
      <section className="container-page py-10 md:py-14">
        <SchedulingCalendar framed={false} />
      </section>
    </PublicLayout>
  );
}
