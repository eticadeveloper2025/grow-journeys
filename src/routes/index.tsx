import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nerya | Aulas particulares de inglês" },
      {
        name: "description",
        content:
          "Aulas particulares de inglês ao vivo com acompanhamento individual, planos por frequência e solicitação de horário online.",
      },
    ],
  }),
  component: HomePage,
});

const FOCUS = [
  {
    icon: MessageCircle,
    title: "Conversação",
    text: "Prática guiada para falar com mais naturalidade.",
  },
  { icon: Sparkles, title: "Pronúncia", text: "Correções pontuais para melhorar clareza e ritmo." },
  {
    icon: CalendarDays,
    title: "Viagens",
    text: "Situações reais para aeroporto, hotel, passeios e restaurantes.",
  },
  {
    icon: UserRoundCheck,
    title: "Profissional",
    text: "Reuniões, apresentações, entrevistas e small talk.",
  },
];

function HomePage() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 15% 0%, color-mix(in oklab, var(--brand) 22%, transparent), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, color-mix(in oklab, var(--brand-light) 12%, transparent), transparent 60%)",
          }}
        />
        <div className="container-page relative grid items-center gap-14 py-20 md:grid-cols-[1.05fr_0.95fr] md:py-28">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Aulas particulares ao vivo
            </span>
            <h1 className="mt-6 font-display text-foreground">
              Inglês que <span className="text-brand-light">conecta.</span>
              <br />
              Fluência que <span className="text-brand">transforma.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Aprenda inglês em aulas individuais com um professor, agenda flexível e acompanhamento
              da sua frequência a cada ciclo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-brand text-primary-foreground hover:bg-brand-dark"
              >
                <Link to="/agendar">
                  Agendar aula <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border border-border bg-transparent hover:bg-surface"
              >
                <Link to="/planos">Ver planos</Link>
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-light" /> Professor único
              </li>
              <li className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-brand-light" /> Solicitação por e-mail
              </li>
              <li className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-brand-light" /> Horários reservados
              </li>
            </ul>
          </div>

          <div className="relative hidden min-h-[420px] md:block">
            <div className="absolute inset-0 rounded-2xl border border-border bg-surface/60 backdrop-blur-sm" />
            <div className="relative flex h-full flex-col justify-between rounded-2xl p-8">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Solicitação de aula
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Por e-mail
                </div>
              </div>

              <div className="my-8">
                <p className="font-display text-4xl leading-tight text-foreground md:text-5xl">
                  Escolha seu <span className="text-brand-light">horário</span>
                  <br />
                  online.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Escolha um horário disponível e receba a confirmação direto no seu e-mail.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  ["Data e horário", "Você escolhe"],
                  ["Formato", "Online"],
                  ["Confirmação", "Por e-mail"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3"
                  >
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {label}
                    </span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            "Conversação real",
            "Pronúncia guiada",
            "Inglês para viagens",
            "Inglês profissional",
          ].map((f) => (
            <div
              key={f}
              className="flex items-start gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" /> {f}
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-20 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            Acompanhamento individual
          </p>
          <h2 className="mt-3 text-foreground">
            Uma rotina de inglês que cabe na <span className="text-brand-light">sua semana.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Você escolhe uma frequência, solicita um horário disponível e recebe a confirmação por
            e-mail.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOCUS.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-surface p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand-light">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-[color:var(--background-soft)]">
        <div className="container-page grid gap-10 py-20 md:grid-cols-2 md:gap-16 md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
              Como funciona
            </p>
            <h2 className="mt-3 text-foreground">
              Plano, horário escolhido e confirmação sem complicar.
            </h2>
          </div>
          <ol className="grid gap-4 text-sm text-muted-foreground">
            {[
              "Escolha a frequência ideal para seu momento.",
              "Escolha um horário disponível e envie sua solicitação.",
              "Participe das aulas ao vivo com foco no seu objetivo.",
              "Receba a confirmação por e-mail e combine os próximos passos.",
            ].map((item, index) => (
              <li key={item} className="flex gap-4 rounded-lg border border-border/60 bg-card p-4">
                <span className="font-display text-2xl text-brand-light">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Bora começar?
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-foreground">
          Reserve um horário e transforme estudo em conversa.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Nesta fase, o site recebe pedidos de aula por e-mail sem exigir cadastro ou banco de
          dados.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-brand text-primary-foreground hover:bg-brand-dark"
          >
            <Link to="/agendar">Agendar aula</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="border border-border bg-transparent hover:bg-surface"
          >
            <Link to="/contato">Tirar dúvidas</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
