import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { SchedulingCalendar } from "@/components/SchedulingCalendar";
import { formatDateLong } from "@/utils/format";
import type { AvailabilitySlot } from "@/types";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar aula — Nerya" },
      {
        name: "description",
        content:
          "Escolha um horário no calendário e envie uma solicitação de aula particular de inglês.",
      },
    ],
  }),
  component: SchedulePublic,
});

function SchedulePublic() {
  const [requestedSchedule, setRequestedSchedule] = useState("");

  const requestSlot = (slot: AvailabilitySlot) => {
    setRequestedSchedule(
      `${formatDateLong(`${slot.date}T12:00:00`)} das ${slot.startTime} às ${slot.endTime}`,
    );
  };

  return (
    <PublicLayout>
      <section className="container-page grid gap-8 py-10 md:py-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <LeadCaptureForm
          intent="scheduling"
          title="Pedir um horário"
          description="Escolha uma data e horário no calendário. Depois envie seus dados para confirmação por e-mail."
          preferredSchedulePreset={requestedSchedule}
          requirePreferredSchedule
          hidePreferredScheduleInput
        />
        <SchedulingCalendar framed={false} publicLeadMode onRequestSlot={requestSlot} />
      </section>
    </PublicLayout>
  );
}
