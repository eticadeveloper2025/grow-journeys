import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle2, CreditCard, History, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona — Nerya" },
      {
        name: "description",
        content: "Entenda como funcionam os planos, créditos, agendamento e histórico de aulas particulares na Nerya.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { icon: CreditCard, title: "Contrate um plano", text: "Cada plano libera créditos mensais para reservar aulas particulares." },
  { icon: CalendarDays, title: "Escolha um horário", text: "Consulte a disponibilidade e confirme o melhor horário para sua rotina." },
  { icon: MessageCircle, title: "Participe da aula", text: "A aula acontece ao vivo, com foco em conversação, pronúncia e seus objetivos." },
  { icon: History, title: "Acompanhe seu histórico", text: "Depois, consulte aulas realizadas, frequência, tópicos trabalhados e observações." },
];

function HowItWorks() {
  return (
    <PublicLayout>
      <section className="container-page max-w-5xl py-20">
        <p className="text-xs uppercase tracking-widest text-coral">Como funciona</p>
        <h1 className="mt-2 font-display text-5xl leading-[0.95] md:text-7xl">
          INGLÊS AO VIVO,<br />COM <span className="text-lilac">ROTINA CLARA</span>.
        </h1>
        <p className="mt-8 max-w-3xl text-lg text-muted-foreground">
          A Nerya organiza a experiência de aulas particulares: você contrata uma frequência, acompanha créditos, agenda horários e visualiza seu histórico.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-lg border border-border/60 bg-card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-2xl text-foreground">{step.title.toUpperCase()}</div>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-border/60 bg-[color:var(--background-soft)] p-6">
          <h2 className="font-display text-3xl">O acompanhamento é individual.</h2>
          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            {[
              "Foco em conversação e segurança para falar.",
              "Correção de pronúncia durante a prática.",
              "Temas alinhados a viagens, trabalho e rotina.",
              "Histórico de participação e tópicos trabalhados.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild><Link to="/agendar">Agendar aula</Link></Button>
          <Button asChild variant="secondary"><Link to="/planos">Ver planos</Link></Button>
        </div>
      </section>
    </PublicLayout>
  );
}
