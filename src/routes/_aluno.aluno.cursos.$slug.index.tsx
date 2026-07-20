import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseRepository, enrollmentRepository, progressRepository, certificateRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { LoadingBlock, ErrorState } from "@/components/States";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Award } from "lucide-react";
import { formatWorkload } from "@/utils/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/aluno/cursos/$slug/")({
  component: CourseInside,
});

function CourseInside() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: courseData, isPending, error, refetch } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => courseRepository.bySlug(slug),
  });

  const { data: enrollmentData } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: () => enrollmentRepository.listForUser(user!.id),
    enabled: !!user,
  });
  const enrollment = enrollmentData?.data.find((e) => e.courseId === courseData?.data.id);

  const { data: progressData } = useQuery({
    queryKey: ["progress", enrollment?.id],
    queryFn: () => progressRepository.forEnrollment(enrollment!.id),
    enabled: !!enrollment,
  });

  const issue = useMutation({
    mutationFn: () => certificateRepository.issue(enrollment!.id, user!.id),
    onSuccess: (r) => {
      toast.success(r.message ?? "Certificado emitido.");
      qc.invalidateQueries({ queryKey: ["certificates"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isPending) return <LoadingBlock />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;

  const course = courseData!.data;
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const done = progressData?.data.filter((p) => p.completed).length ?? 0;
  const pct = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
  const isCompleted = pct >= course.requiredProgressPercentage;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Curso</p>
        <h1 className="mt-1 font-serif text-4xl leading-tight">{course.title}</h1>
        <div className="mt-4 flex items-center gap-4">
          <Progress value={pct} className="h-2 flex-1" />
          <span className="text-sm text-muted-foreground">{pct}%</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {course.modules.map((m) => (
            <div key={m.id} className="rounded-xl border border-border/60 bg-card p-5">
              <div className="text-xs uppercase tracking-widest text-primary">Módulo {m.position}</div>
              <h2 className="font-serif text-xl">{m.title}</h2>
              <ul className="mt-4 divide-y divide-border/40">
                {m.lessons.map((l) => {
                  const isDone = progressData?.data.some((p) => p.lessonId === l.id && p.completed);
                  return (
                    <li key={l.id} className="flex items-center justify-between py-2.5">
                      <Link
                        to="/aluno/cursos/$slug/aulas/$lessonId"
                        params={{ slug, lessonId: l.id }}
                        className="flex flex-1 items-center gap-3 text-sm hover:text-primary"
                      >
                        {isDone ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                        {l.title}
                      </Link>
                      <span className="text-xs text-muted-foreground">{formatWorkload(l.durationMinutes)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <div className="text-xs uppercase tracking-widest text-primary">Certificado</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Requer {course.requiredProgressPercentage}% de conclusão
              {course.minimumScorePercentage > 0 && ` e nota mínima de ${course.minimumScorePercentage}%`}.
            </p>
            <Button
              className="mt-4 w-full"
              disabled={!enrollment || !isCompleted || issue.isPending}
              onClick={() => issue.mutate()}
            >
              <Award className="mr-2 h-4 w-4" />
              {issue.isPending ? "Emitindo…" : "Emitir certificado"}
            </Button>
            {course.minimumScorePercentage > 0 && (
              <Button asChild variant="ghost" className="mt-2 w-full">
                <Link to="/aluno/cursos/$slug/quiz" params={{ slug }}>Fazer avaliação</Link>
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
