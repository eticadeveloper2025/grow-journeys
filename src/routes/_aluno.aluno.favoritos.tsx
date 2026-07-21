import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/States";

export const Route = createFileRoute("/_aluno/aluno/favoritos")({
  head: () => ({ meta: [{ title: "Favoritos — Nerya" }] }),
  component: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Curadoria pessoal</p>
        <h1 className="mt-1 font-display text-4xl">Favoritos</h1>
      </div>
      <EmptyState
        title="Você ainda não favoritou nenhum item"
        description="Explore cursos e conteúdos e salve os que quiser revisitar."
      />
    </div>
  ),
});
