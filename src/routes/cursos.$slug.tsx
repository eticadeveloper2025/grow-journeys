import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseRepository, enrollmentRepository } from "@/repositories";
import { ErrorState, LoadingBlock } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Signal, Award, CheckCircle2, PlayCircle } from "lucide-react";
import { formatPriceBRL, formatWorkload } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/cursos/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Curso — Nerya` },
      { name: "description", content: `Detalhes do curso ${params.slug} na Nerya.` },
    ],
  }),
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => courseRepository.bySlug(slug),
  });

  const enroll = useMutation({
    mutationFn: () => enrollmentRepository.enroll(user!.id, data!.data.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("Matrícula realizada! Boa jornada.");
      navigate({ to: "/aluno/cursos/$slug", params: { slug } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isPending)
    return (
      <PublicLayout>
        <div className="container-page py-16"><LoadingBlock /></div>
      </PublicLayout>
    );
  if (error)
    return (
      <PublicLayout>
        <div className="container-page py-16"><ErrorState error={error} onRetry={() => refetch()} /></div>
      </PublicLayout>
    );

  const course = data!.data;
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <PublicLayout>
      <section className="border-b border-border/60 bg-card/40">
        <div className="container-page grid gap-10 py-14 md:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary">Curso</div>
            <h1 className="mt-2 font-display text-5xl leading-tight">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{course.shortDescription}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="bg-primary/10 text-primary">{course.level}</Badge>
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {formatWorkload(course.workloadMinutes)}</span>
              <span className="inline-flex items-center gap-1"><Signal className="h-4 w-4" /> {course.modality.replace("_", " ")}</span>
              <span className="inline-flex items-center gap-1"><Award className="h-4 w-4" /> Certificado de {course.certificateType}</span>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <img src="https://i.pravatar.cc/80" alt={course.instructor.displayName} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <div className="text-xs text-muted-foreground">Instrutor</div>
                <div className="font-medium">{course.instructor.displayName}</div>
              </div>
            </div>
          </div>

          <aside className="rounded-xl border border-border/60 bg-card p-6">
            <img src={course.coverUrl} alt={course.title} className="mb-5 aspect-video w-full rounded-md object-cover" />
            <div className="mb-4 font-display text-3xl">
              {course.priceCents === 0 ? "Gratuito" : formatPriceBRL(course.priceCents)}
            </div>
            {user ? (
              <Button size="lg" className="w-full" disabled={enroll.isPending} onClick={() => enroll.mutate()}>
                {enroll.isPending ? "Matriculando…" : "Matricular-me"}
              </Button>
            ) : (
              <Button size="lg" className="w-full" asChild>
                <Link to="/entrar">Entre para matricular-se</Link>
              </Button>
            )}
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {totalLessons} aulas em vídeo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Acesso vitalício</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Certificado demonstrativo</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="container-page grid gap-12 py-14 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-3xl">Sobre este curso</h2>
          <p className="mt-4 whitespace-pre-line text-muted-foreground">{course.description}</p>

          <h2 className="mt-12 font-display text-3xl">Programa</h2>
          <div className="mt-6 space-y-4">
            {course.modules.map((mod) => (
              <div key={mod.id} className="rounded-lg border border-border/60 bg-card p-5">
                <div className="mb-1 text-xs uppercase tracking-widest text-primary">Módulo {mod.position}</div>
                <h3 className="font-display text-xl">{mod.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{mod.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {mod.lessons.map((l) => (
                    <li key={l.id} className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-primary/70" />
                        {l.title}
                      </span>
                      <span className="text-xs">{formatWorkload(l.durationMinutes)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="text-xs uppercase tracking-widest text-primary">Instrutor</div>
            <div className="mt-3 flex items-center gap-3">
              <img src={course.instructor.photoUrl} alt={course.instructor.displayName} className="h-14 w-14 rounded-full object-cover" />
              <div>
                <div className="font-display text-lg">{course.instructor.displayName}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{course.instructor.bio}</p>
          </div>
        </aside>
      </section>
    </PublicLayout>
  );
}
