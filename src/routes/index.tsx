import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { courseRepository } from "@/repositories";
import { ArrowRight, Award, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data } = useQuery({
    queryKey: ["courses", "featured"],
    queryFn: () => courseRepository.list(),
  });
  const featured = data?.data.slice(0, 3) ?? [];

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, oklch(0.82 0.13 82 / 0.15), transparent 60%), radial-gradient(ellipse at 80% 100%, oklch(0.7 0.16 200 / 0.10), transparent 60%)",
          }}
        />
        <div className="container-page relative grid gap-10 py-20 md:grid-cols-[1.2fr_1fr] md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <Sparkles className="h-3 w-3" /> Nova temporada de cursos
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-foreground md:text-7xl">
              Aprenda com quem <em className="text-primary not-italic">constrói</em> os produtos que você admira.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Cursos, mentorias e conteúdos aprofundados em design, produto e engenharia. Estúdio editorial, ritmo próprio, certificados de conclusão.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/cursos">
                  Explorar cursos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/planos">Ver planos</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> +12.000 alunos</span>
              <span className="inline-flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Certificados oficiais</span>
              <span>Ambiente demonstrativo</span>
            </div>
          </div>

          <div className="relative">
            <div
              className="glow-accent overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=80"
                alt="Time em workshop"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CURSOS EM DESTAQUE */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Cursos em destaque</p>
            <h2 className="mt-2 font-serif text-4xl">Trilhas para o próximo salto</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/cursos">Ver todos <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="container-page grid gap-10 py-20 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Nosso jeito</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
              Menos hype. Mais artesanato.
            </h2>
          </div>
          <div className="space-y-6 text-muted-foreground">
            <p>
              Selecionamos instrutores que praticam antes de ensinar. Cada curso é revisado por editores de conteúdo e passa por testes com alunos-piloto.
            </p>
            <p>
              O resultado: material profundo, direto ao ponto, sem enrolação — o mesmo que gostaríamos de ter tido quando começamos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-4xl md:text-5xl">
          Comece hoje. Estude no seu ritmo.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Crie sua conta demonstrativa em segundos e explore toda a biblioteca.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg"><Link to="/cadastrar">Criar conta</Link></Button>
          <Button asChild size="lg" variant="ghost"><Link to="/entrar">Já sou aluno</Link></Button>
        </div>
      </section>
    </PublicLayout>
  );
}
