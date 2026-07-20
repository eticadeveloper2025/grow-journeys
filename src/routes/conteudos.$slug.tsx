import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useQuery } from "@tanstack/react-query";
import { blogRepository } from "@/repositories";
import { ErrorState, LoadingBlock } from "@/components/States";
import { formatDateLong } from "@/utils/format";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/conteudos/$slug")({
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => blogRepository.bySlug(slug),
  });

  return (
    <PublicLayout>
      <article className="container-page max-w-3xl py-14">
        <Link to="/conteudos" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        {isPending && <LoadingBlock />}
        {error && <ErrorState error={error} onRetry={() => refetch()} />}
        {data && (
          <>
            <div className="text-xs uppercase tracking-widest text-primary">{data.data.category.name}</div>
            <h1 className="mt-3 font-serif text-5xl leading-tight">{data.data.title}</h1>
            <div className="mt-4 text-sm text-muted-foreground">
              Por {data.data.author.fullName} · {data.data.publishedAt && formatDateLong(data.data.publishedAt)} · {data.data.readingMinutes} min
            </div>
            <img src={data.data.coverUrl} alt={data.data.title} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" />
            <div className="prose prose-invert mt-8 max-w-none whitespace-pre-line text-muted-foreground">
              {data.data.content}
            </div>
          </>
        )}
      </article>
    </PublicLayout>
  );
}
