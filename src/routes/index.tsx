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
  {
    icon: PlayCircle,
    title: "Curso gravado",
    text: "Estude inglês no seu ritmo, reveja as aulas e acompanhe sua evolução.",
    color: "bg-navy text-paper",
  },
  {
    icon: Users,
    title: "Turma ao vivo",
    text: "Aprenda em grupo, participe das aulas e pratique conversação.",
    color: "bg-lilac",
  },
  {
    icon: MessagesSquare,
    title: "Aula particular",
    text: "Plano de estudos personalizado para seus objetivos com inglês.",
    color: "bg-coral",
  },
  {
    icon: Headphones,
    title: "Clube de conversação",
    text: "Pratique inglês em encontros focados em situações reais.",
    color: "bg-yellow-brand",
  },
  {
    icon: BookOpen,
    title: "Aula avulsa",
    text: "Escolha um tema específico e faça uma aula sem assinatura.",
    color: "bg-paper",
  },
  {
    icon: Sparkles,
    title: "Intensivo",
    text: "Uma jornada concentrada para acelerar seu aprendizado.",
    color: "bg-navy-light text-paper",
  },
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
      <section className="relative overflow-hidden border-b border-border/60 grain">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 15% 10%, color-mix(in oklab, var(--navy-light) 55%, transparent), transparent 55%), radial-gradient(ellipse at 85% 90%, color-mix(in oklab, var(--brand-lilac) 35%, transparent), transparent 55%)",
          }}
        />
        <div className="container-page relative grid gap-12 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-brand px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
              ★ Primeira aula gratuita
            </span>
            <h1 className="mt-6 font-display text-6xl leading-[0.9] text-foreground md:text-8xl">
              <span className="text-paper">INGLÊS QUE </span>
              <span className="text-coral">CONECTA.</span>
              <br />
              <span className="text-lilac">FLUÊNCIA </span>
              <span className="text-paper">QUE TRANSFORMA.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Aprenda inglês com aulas práticas, conteúdos atuais e acompanhamento da sua evolução — do primeiro contato com o idioma até a confiança para conversar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-coral hover:opacity-90">
                <Link to="/cadastrar">
                  Fazer aula gratuita <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/cursos">Conhecer os cursos</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-lilac" /> Aulas online
              </span>
              <span className="inline-flex items-center gap-2">
                <Award className="h-4 w-4 text-lilac" /> Certificado de conclusão
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-lilac" /> Turmas e particulares
              </span>
            </div>
          </div>

          {/* Colagem editorial */}
          <div className="relative min-h-[420px]">
            <div className="absolute inset-x-6 top-0 rotate-[-3deg] rounded-md bg-navy p-6 shadow-2xl">
              <p className="font-display text-2xl leading-tight text-paper">
                YOU SAY <span className="text-coral">HELLO</span>,<br />
                I SAY <span className="text-yellow-brand">HI</span>.
              </p>
              <p className="mt-3 text-xs uppercase tracking-widest text-paper/70">Lesson 01 · Greetings</p>
            </div>
            <div className="absolute right-4 top-32 w-64 rotate-[4deg] overflow-hidden rounded-md border-4 border-paper shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80"
                alt="Aluna com fones estudando inglês"
                className="h-56 w-full object-cover"
                style={{ filter: "grayscale(20%) contrast(1.05)" }}
              />
            </div>
            <div className="absolute bottom-4 left-2 w-56 rotate-[-2deg] bg-paper p-4 shadow-2xl">
              <p className="font-display text-xl leading-tight text-[color:var(--navy)]">
                DID YOU KNOW?
              </p>
              <p className="mt-1 text-sm text-[color:var(--navy)]/80">
                “Breakfast” = <span className="text-[color:var(--red-brand)] font-semibold">break</span> the <span className="text-[color:var(--red-brand)] font-semibold">fast</span>.
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-[color:var(--navy)]/60">
                @somosnerya →
              </p>
            </div>
            <div className="absolute bottom-16 right-0 rotate-[6deg] rounded-full bg-coral px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-xl">
              Fluência de verdade
            </div>
          </div>
        </div>
      </section>

      {/* FAIXA DE DIFERENCIAIS */}
      <section className="border-b border-border/60 bg-[color:var(--background-soft)]">
        <div className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-3 lg:grid-cols-6">
          {[
            "Aulas ao vivo e gravadas",
            "Conteúdo no seu ritmo",
            "Exercícios práticos",
            "Progresso acompanhado",
            "Certificado de conclusão",
            "Primeira aula gratuita",
          ].map((f) => (
            <div key={f} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="text-lilac">→</span> {f}
            </div>
          ))}
        </div>
      </section>

      {/* COMO VOCÊ QUER APRENDER */}
      <section className="container-page py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-coral">Modalidades</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl">
            COMO VOCÊ <span className="text-lilac">QUER</span> APRENDER?
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FORMATS.map((f) => (
            <div
              key={f.title}
              className={`group relative overflow-hidden rounded-lg border border-border/40 p-6 transition hover:-translate-y-1 ${f.color}`}
            >
              <f.icon className="h-6 w-6 opacity-80" />
              <h3 className="mt-4 font-display text-2xl leading-tight">{f.title}</h3>
              <p className="mt-2 text-sm opacity-80">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CURSOS EM DESTAQUE */}
      <section className="border-t border-border/60 bg-[color:var(--background-soft)]">
        <div className="container-page py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-coral">Cursos de inglês</p>
              <h2 className="mt-2 font-display text-5xl md:text-6xl">
                DO PRIMEIRO <span className="text-yellow-brand">HELLO</span><br />
                À CONVERSA DE VERDADE.
              </h2>
            </div>
            <Button asChild variant="secondary">
              <Link to="/cursos">Ver todos os cursos <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="border-y border-border/60 paper-texture">
        <div className="container-page grid gap-10 py-20 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-widest text-[color:var(--red-brand)]">Nosso jeito</p>
            <h2 className="mt-3 font-display text-5xl leading-[0.95] text-[color:var(--navy)] md:text-7xl">
              INGLÊS QUE FAZ PARTE<br />
              DA <span className="text-[color:var(--red-brand)]">VIDA REAL</span>.
            </h2>
          </div>
          <div className="space-y-5 text-lg text-[color:var(--navy)]/85">
            <p>
              A Nerya nasceu para tornar o inglês mais próximo, prático e possível. Aqui, o aprendizado não fica preso a regras decoradas: ele aparece em conversas, viagens, trabalho, música, filmes e situações do dia a dia.
            </p>
            <p>
              Aprender fazendo. Errar faz parte. Evolução visível. Ritmo possível. Inglês para a vida real.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-coral">Bora começar?</p>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-5xl md:text-7xl">
          SEU INGLÊS NÃO PRECISA<br />FICAR SÓ NO <span className="text-lilac">CADERNO</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Crie sua conta demonstrativa em segundos e faça sua primeira aula gratuita.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-coral hover:opacity-90">
            <Link to="/cadastrar">Fazer aula gratuita</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/entrar">Já sou aluno</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
