import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle2, Clock3, MailCheck, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona — Nerya" },
      {
        name: "description",
        content:
          "Entenda como funcionam os planos, a solicitação de horário e as aulas particulares na Nerya.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    icon: Clock3,
    title: "Escolha uma frequência",
    text: "Os planos mostram quantas aulas cabem na sua rotina e o valor mensal estimado.",
  },
  {
    icon: CalendarDays,
    title: "Escolha um horário",
    text: "Consulte a disponibilidade e envie uma solicitação pelo formulário.",
  },
  {
    icon: MailCheck,
    title: "Confirme por e-mail",
    text: "Você recebe o retorno com a confirmação do horário e próximos passos.",
  },
  {
    icon: MessageCircle,
    title: "Participe da aula",
    text: "A aula acontece ao vivo, com foco em conversação, pronúncia e seus objetivos.",
  },
];

function HowItWorks() {
  return (
    <PublicLayout>
      <section className="container-page max-w-5xl py-20">
        <p className="text-xs uppercase tracking-widest text-coral">Como funciona</p>
        <h1 className="mt-2 font-display text-5xl leading-[0.95] md:text-7xl">
          INGLÊS AO VIVO,
          <br />
          COM <span className="text-lilac">ROTINA CLARA</span>.
        </h1>
        <p className="mt-8 max-w-3xl text-lg text-muted-foreground">
          A Nerya organiza a experiência inicial de aulas particulares: você escolhe uma frequência,
          solicita um horário e recebe a confirmação por e-mail.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {STEPS.map((step) => (
            <div key={step.title} className="rounded-lg border border-border/60 bg-card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-2xl text-foreground">
                {step.title.toUpperCase()}
              </div>
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
              "Combinação clara de frequência, horário e objetivo.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/agendar">Agendar aula</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/planos">Ver planos</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
