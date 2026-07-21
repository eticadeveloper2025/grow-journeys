import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonRepository, courseRepository, enrollmentRepository, progressRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { LoadingBlock } from "@/components/States";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/aluno/cursos/$slug/aulas/$lessonId")({
  component: LessonPage,
});

function LessonPage() {
  const { slug, lessonId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: lessonData } = useQuery({ queryKey: ["lesson", lessonId], queryFn: () => lessonRepository.byId(lessonId) });
  const { data: courseData } = useQuery({ queryKey: ["course", slug], queryFn: () => courseRepository.bySlug(slug) });
  const { data: enrollments } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: () => enrollmentRepository.listForUser(user!.id),
    enabled: !!user,
  });
  const enrollment = enrollments?.data.find((e) => e.courseId === courseData?.data.id);
  const { data: progress } = useQuery({
    queryKey: ["progress", enrollment?.id],
    queryFn: () => progressRepository.forEnrollment(enrollment!.id),
    enabled: !!enrollment,
  });

  const complete = useMutation({
    mutationFn: (done: boolean) => progressRepository.markLesson(enrollment!.id, lessonId, done),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["progress", enrollment?.id] });
      qc.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!lessonData || !courseData) return <LoadingBlock />;

  const lesson = lessonData.data;
  const course = courseData.data;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  const isDone = !!progress?.data.some((p) => p.lessonId === lessonId && p.completed);

  return (
    <div className="space-y-6">
      <Link to="/aluno/cursos/$slug" params={{ slug }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Voltar ao curso
      </Link>

      <div>
        <div className="text-xs uppercase tracking-widest text-primary">{course.title}</div>
        <h1 className="mt-1 font-display text-3xl">{lesson.title}</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-black">
        {lesson.videoUrl ? (
          <div className="aspect-video">
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted" />
        )}
      </div>

      <p className="text-muted-foreground">{lesson.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-4">
        <Button
          variant={isDone ? "secondary" : "default"}
          onClick={() => complete.mutate(!isDone)}
          disabled={complete.isPending || !enrollment}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {isDone ? "Marcada como concluída" : "Marcar como concluída"}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={!prev}
            onClick={() => prev && navigate({ to: "/aluno/cursos/$slug/aulas/$lessonId", params: { slug, lessonId: prev.id } })}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Anterior
          </Button>
          <Button
            size="sm"
            disabled={!next}
            onClick={() => next && navigate({ to: "/aluno/cursos/$slug/aulas/$lessonId", params: { slug, lessonId: next.id } })}
          >
            Próxima <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
