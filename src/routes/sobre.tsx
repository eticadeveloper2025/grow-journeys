import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Nerya" },
      { name: "description", content: "Conheça a Nerya, plataforma editorial de cursos para times de tecnologia." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PublicLayout>
      <section className="container-page max-w-3xl py-16">
        <p className="text-xs uppercase tracking-widest text-primary">Sobre</p>
        <h1 className="mt-2 font-serif text-5xl leading-tight">Um estúdio editorial de conhecimento em tecnologia.</h1>
        <div className="mt-8 space-y-5 text-lg text-muted-foreground">
          <p>
            A Nerya nasceu da vontade de trazer profundidade e cuidado editorial ao aprendizado técnico. Selecionamos instrutores que praticam antes de ensinar, e produzimos cursos como se fossem publicações.
          </p>
          <p>
            Nossa curadoria cobre design, produto e engenharia — os três pilares de qualquer time de tecnologia moderno. Cada curso é revisado, testado com alunos-piloto e mantido por editores.
          </p>
          <p>
            Somos um time pequeno com ambição grande: elevar o padrão do que se aprende no dia a dia dos produtos digitais.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
