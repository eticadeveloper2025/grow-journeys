import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { enrollmentRepository, progressRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState, LoadingBlock } from "@/components/States";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockLessons, mockModules } from "@/mocks/courses";

export const Route = createFileRoute("/_aluno/aluno/cursos/")({
  head: () => ({ meta: [{ title: "Meus cursos — Nerya" }] }),
  component: MyCourses,
});

const STATUS_LABEL = {
  not_started: "Não iniciado",
  in_progress: "Em andamento",
  completed: "Concluído",
  expired: "Expirado",
} as const;

function MyCourses() {
  const { user } = useAuth();
  const { data, isPending } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: () => enrollmentRepository.listForUser(user!.id),
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Aprendizado</p>
        <h1 className="mt-1 font-display text-4xl">Meus cursos</h1>
      </div>
      {isPending && <LoadingBlock />}
      {data && data.data.length === 0 && (
        <EmptyState
          title="Você ainda não está matriculado em nenhum curso"
          description="Explore a biblioteca e comece agora mesmo."
          action={<Button asChild><Link to="/cursos">Ver cursos</Link></Button>}
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.data.map((e) => (
          <MyCourseCard
            key={e.id}
            enrollmentId={e.id}
            courseId={e.courseId}
            slug={e.course.slug}
            title={e.course.title}
            cover={e.course.coverUrl}
            status={e.status}
          />
        ))}
      </div>
    </div>
  );
}

function MyCourseCard({ enrollmentId, courseId, slug, title, cover, status }: { enrollmentId: string; courseId: string; slug: string; title: string; cover: string; status: keyof typeof STATUS_LABEL }) {
  const { data } = useQuery({
    queryKey: ["progress", enrollmentId],
    queryFn: () => progressRepository.forEnrollment(enrollmentId),
  });
  const total = mockLessons.filter((l) => mockModules.find((m) => m.id === l.moduleId)?.courseId === courseId).length;
  const done = data?.data.filter((p) => p.completed).length ?? 0;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <Link to="/aluno/cursos/$slug" params={{ slug }} className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition hover:border-primary/40">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={cover} alt={title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-primary/10 text-primary">{STATUS_LABEL[status]}</Badge>
          <span className="text-xs text-muted-foreground">{pct}%</span>
        </div>
        <h3 className="font-display text-xl leading-tight">{title}</h3>
        <Progress value={pct} className="mt-auto h-1.5" />
      </div>
    </Link>
  );
}
