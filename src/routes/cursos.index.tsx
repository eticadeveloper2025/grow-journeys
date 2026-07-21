import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useQuery } from "@tanstack/react-query";
import { courseRepository } from "@/repositories";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/States";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cursos/")({
  head: () => ({
    meta: [
      { title: "Cursos — Nerya" },
      { name: "description", content: "Explore a biblioteca completa de cursos de inglês da Nerya: conversação, viagens, trabalho e mais." },
    ],
  }),
  component: CoursesPage,
});

const LEVELS = [
  { value: "", label: "Todos os níveis" },
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

function CoursesPage() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("");

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["courses", { q, level }],
    queryFn: () => courseRepository.list({ q: q || undefined, level: level || undefined }),
  });

  return (
    <PublicLayout>
      <section className="container-page py-14">
        <p className="text-xs uppercase tracking-widest text-primary">Biblioteca</p>
        <h1 className="mt-2 font-display text-5xl">Cursos</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {data?.meta.total ?? 0} cursos disponíveis. Comece pelo que faz mais sentido agora.
        </p>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cursos…" className="pl-9" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {LEVELS.map((l) => (
              <Button
                key={l.value}
                size="sm"
                variant={level === l.value ? "default" : "ghost"}
                onClick={() => setLevel(l.value)}
              >
                {l.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {isPending && <LoadingBlock label="Carregando cursos…" />}
          {error && <ErrorState error={error} onRetry={() => refetch()} />}
          {data && data.data.length === 0 && (
            <EmptyState title="Nenhum curso encontrado" description="Ajuste os filtros e tente novamente." />
          )}
          {data && data.data.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Não encontrou o que buscava? <Link to="/contato" className="text-primary hover:underline">Fale com a gente</Link>.
        </p>
      </section>
    </PublicLayout>
  );
}
