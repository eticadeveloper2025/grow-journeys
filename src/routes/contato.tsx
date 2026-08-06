import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { env } from "@/config/env";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Nerya" },
      {
        name: "description",
        content: "Fale com a Nerya sobre planos, créditos e aulas particulares de inglês.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PublicLayout>
      <section className="container-page grid max-w-4xl gap-10 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Contato</p>
          <h1 className="mt-2 font-display text-5xl leading-tight">Fale com a gente.</h1>
          <p className="mt-4 text-muted-foreground">
            Dúvidas sobre planos, créditos, horários ou objetivos de inglês. Respondemos em até 2
            dias úteis.
          </p>
          <div className="mt-6 space-y-1 text-sm text-muted-foreground">
            <div>{env.publicContactEmail}</div>
            <div>São Paulo — Brasil</div>
          </div>
        </div>
        <LeadCaptureForm intent="contact" />
      </section>
    </PublicLayout>
  );
}
