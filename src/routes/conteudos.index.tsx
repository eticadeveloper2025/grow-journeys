import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useQuery } from "@tanstack/react-query";
import { blogRepository } from "@/repositories";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/States";
import { formatDateBR } from "@/utils/format";

export const Route = createFileRoute("/conteudos/")({
  head: () => ({
    meta: [
      { title: "Conteúdos — Nerya" },
      { name: "description", content: "Curiosidades, vocabulário, cultura e dicas para deixar o inglês mais próximo da sua rotina." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [cat, setCat] = useState<string>("");
  const { data: catData } = useQuery({ queryKey: ["categories"], queryFn: () => blogRepository.categories() });
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["posts", { cat }],
    queryFn: () => blogRepository.list({ category: cat || undefined }),
  });

  return (
    <PublicLayout>
      <section className="container-page py-14">
        <p className="text-xs uppercase tracking-widest text-primary">Editorial</p>
        <h1 className="mt-2 font-display text-5xl">Conteúdos</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Curiosidades, vocabulário, cultura e dicas para deixar o inglês mais próximo da sua rotina.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button size="sm" variant={cat === "" ? "default" : "ghost"} onClick={() => setCat("")}>Todos</Button>
          {catData?.data.map((c) => (
            <Button key={c.id} size="sm" variant={cat === c.slug ? "default" : "ghost"} onClick={() => setCat(c.slug)}>
              {c.name}
            </Button>
          ))}
        </div>

        <div className="mt-10">
          {isPending && <LoadingBlock />}
          {error && <ErrorState error={error} onRetry={() => refetch()} />}
          {data && data.data.length === 0 && <EmptyState title="Sem posts nesta categoria" />}
          {data && data.data.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((p) => (
                <Link
                  key={p.id}
                  to="/conteudos/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition hover:border-primary/40"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img src={p.coverUrl} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="text-xs uppercase tracking-widest text-primary">{p.category.name}</div>
                    <h3 className="font-display text-xl leading-tight">{p.title}</h3>
                    <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {p.publishedAt && formatDateBR(p.publishedAt)} · {p.readingMinutes} min
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
