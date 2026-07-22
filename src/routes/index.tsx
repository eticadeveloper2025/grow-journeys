import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { courseRepository } from "@/repositories";
import {
  ArrowRight,
  Award,
  BookOpen,
  Headphones,
  MessagesSquare,
  PlayCircle,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nerya | Inglês Online" },
      {
        name: "description",
        content:
          "Aprenda inglês com aulas práticas, cursos online, conversação, viagens, trabalho e certificados de conclusão.",
      },
    ],
  }),
  component: HomePage,
});

const FORMATS = [
  { icon: PlayCircle, title: "Curso gravado", text: "Estude no seu ritmo, reveja aulas e acompanhe a evolução." },
  { icon: Users, title: "Turma ao vivo", text: "Aprenda em grupo e pratique conversação toda semana." },
  { icon: MessagesSquare, title: "Aula particular", text: "Plano de estudos sob medida para os seus objetivos." },
  { icon: Headphones, title: "Clube de conversação", text: "Encontros focados em situações reais do dia a dia." },
  { icon: BookOpen, title: "Aula avulsa", text: "Escolha um tema específico e faça uma aula sem assinatura." },
  { icon: Sparkles, title: "Intensivo", text: "Uma jornada concentrada para acelerar seu aprendizado." },
];

function HomePage() {
  const { data } = useQuery({
    queryKey: ["courses", "featured"],
    queryFn: () => courseRepository.list(),
  });
  const featured = data?.data.slice(0, 6) ?? [];

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 15% 0%, color-mix(in oklab, var(--brand) 22%, transparent), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, color-mix(in oklab, var(--brand-light) 12%, transparent), transparent 60%)",
          }}
        />
        <div className="container-page relative grid items-center gap-14 py-20 md:grid-cols-[1.1fr_1fr] md:py-28">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Primeira aula gratuita
            </span>
            <h1 className="mt-6 font-display text-foreground">
              Inglês que <span className="text-brand-light">conecta.</span>
              <br />
              Fluência que <span className="text-brand">transforma.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Aulas práticas, conteúdos atuais e acompanhamento da sua evolução — do primeiro contato com o idioma até a confiança para conversar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand text-primary-foreground hover:bg-brand-dark">
                <Link to="/cadastrar">
                  Fazer aula gratuita <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="border border-border bg-transparent hover:bg-surface">
                <Link to="/cursos">Conhecer os cursos</Link>
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-light" /> Aulas online
              </li>
              <li className="inline-flex items-center gap-2">
                <Award className="h-4 w-4 text-brand-light" /> Certificado de conclusão
              </li>
              <li className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-light" /> Turmas e particulares
              </li>
            </ul>
          </div>

          {/* Card mock — clean */}
          <div className="relative hidden min-h-[420px] md:block">
            <div className="absolute inset-0 rounded-2xl border border-border bg-surface/60 backdrop-blur-sm" />
            <div className="relative flex h-full flex-col justify-between rounded-2xl p-8">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Lesson 01 · Greetings</div>
                <div className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Ao vivo
                </div>
              </div>

              <div className="my-8">
                <p className="font-display text-4xl leading-tight text-foreground md:text-5xl">
                  You say <span className="text-brand-light">hello</span>,<br />
                  I say <span className="text-brand">hi</span>.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Pratique cumprimentos e apresentações em contextos reais.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                    <span>Progresso do módulo</span>
                    <span className="text-foreground">62%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-brand" style={{ width: "62%" }} />
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-brand/15 text-brand-light">
                    <PlayCircle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-foreground">Small talk no trabalho</div>
                    <div className="text-xs text-muted-foreground">Próxima aula · 12 min</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAIXA DE DIFERENCIAIS */}
      <section className="border-b border-border">
        <div className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-3 lg:grid-cols-6">
          {[
            "Aulas ao vivo e gravadas",
            "Conteúdo no seu ritmo",
            "Exercícios práticos",
            "Progresso acompanhado",
            "Certificado de conclusão",
            "Primeira aula gratuita",
          ].map((f) => (
            <div key={f} className="flex items-start gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" /> {f}
            </div>
          ))}
        </div>
      </section>

      {/* COMO VOCÊ QUER APRENDER */}
      <section className="container-page py-20 md:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">Modalidades</p>
          <h2 className="mt-3 text-foreground">
            Como você quer <span className="text-brand-light">aprender?</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Escolha o formato que combina com a sua rotina. Você pode combinar mais de um ao longo da jornada.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMATS.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-0.5 hover:border-brand/50"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand-light transition group-hover:bg-brand/15">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CURSOS EM DESTAQUE */}
      <section className="border-t border-border bg-[color:var(--background-soft)]">
        <div className="container-page py-20 md:py-24">
          <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">Cursos de inglês</p>
              <h2 className="mt-3 text-foreground">
                Do primeiro <span className="text-brand-light">hello</span> à conversa de verdade.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Trilhas organizadas por objetivo — viagens, trabalho, conversação e mais.
              </p>
            </div>
            <Button asChild variant="ghost" className="justify-self-start text-brand-light hover:bg-surface hover:text-foreground md:justify-self-end">
              <Link to="/cursos">
                Ver todos os cursos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="border-y border-border">
        <div className="container-page grid gap-10 py-20 md:grid-cols-2 md:gap-16 md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">Nosso jeito</p>
            <h2 className="mt-3 text-foreground">
              Inglês que faz parte da <span className="text-brand-light">vida real.</span>
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              A Nerya nasceu para tornar o inglês mais próximo, prático e possível. O aprendizado não fica preso a regras decoradas: ele aparece em conversas, viagens, trabalho, música e situações do dia a dia.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {["Aprender fazendo", "Errar faz parte", "Evolução visível", "Ritmo possível"].map((it) => (
                <li key={it} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-brand-light" /> {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">Bora começar?</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-foreground">
          Seu inglês não precisa ficar só no <span className="text-brand-light">caderno.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Crie sua conta demonstrativa em segundos e faça sua primeira aula gratuita.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-brand text-primary-foreground hover:bg-brand-dark">
            <Link to="/cadastrar">Fazer aula gratuita</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="border border-border bg-transparent hover:bg-surface">
            <Link to="/entrar">Já sou aluno</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
