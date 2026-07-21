import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Como funciona — Nerya | Inglês Online" },
      { name: "description", content: "Conheça a Nerya: escola online de inglês com aulas práticas, conversação e certificados de conclusão." },
    ],
  }),
  component: About,
});

const PILARES = [
  { t: "Aprender fazendo", d: "Você pratica desde a primeira aula, com situações reais de uso do inglês." },
  { t: "Errar faz parte", d: "Um ambiente seguro para tentar, se corrigir e evoluir sem julgamento." },
  { t: "Evolução visível", d: "Acompanhe seu progresso, aulas concluídas e vocabulário aprendido." },
  { t: "Conteúdo atual", d: "Inglês que aparece em filmes, séries, viagens, trabalho e redes sociais." },
  { t: "Ritmo possível", d: "Aulas gravadas para estudar quando puder e ao vivo quando quiser praticar." },
  { t: "Inglês pra vida real", d: "Do primeiro hello à confiança para conversar em qualquer situação." },
];

function About() {
  return (
    <PublicLayout>
      <section className="container-page max-w-4xl py-20">
        <p className="text-xs uppercase tracking-widest text-coral">Sobre a Nerya</p>
        <h1 className="mt-2 font-display text-5xl leading-[0.95] md:text-7xl">
          INGLÊS QUE FAZ PARTE<br />DA <span className="text-lilac">VIDA REAL</span>.
        </h1>
        <div className="mt-8 space-y-5 text-lg text-muted-foreground">
          <p>
            A Nerya nasceu para tornar o inglês mais próximo, prático e possível. Aqui, o aprendizado não fica preso a regras decoradas: ele aparece em conversas, viagens, trabalho, música, filmes e situações que fazem parte da sua rotina.
          </p>
          <p>
            Nossa proposta é simples: aulas práticas, conteúdo atual, professores próximos e uma jornada onde você vê a sua evolução acontecendo — do primeiro <em>hello</em> até uma conversa de verdade.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {PILARES.map((p) => (
            <div key={p.t} className="rounded-lg border border-border/60 bg-card p-5">
              <div className="font-display text-2xl text-foreground">{p.t.toUpperCase()}</div>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
