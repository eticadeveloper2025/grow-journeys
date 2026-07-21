import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { enrollmentRepository, progressRepository, certificateRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { LoadingBlock } from "@/components/States";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, PlayCircle } from "lucide-react";
import { mockLessons, mockModules } from "@/mocks/courses";

export const Route = createFileRoute("/_aluno/aluno/")({
  head: () => ({ meta: [{ title: "Minha área — Nerya" }] }),
  component: Dashboard,
});

function lessonCountFor(courseId: string) {
  return mockLessons.filter((l) => mockModules.find((m) => m.id === l.moduleId)?.courseId === courseId).length;
}

function Dashboard() {
  const { user } = useAuth();
  const { data: enrollments, isPending } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: () => enrollmentRepository.listForUser(user!.id),
    enabled: !!user,
  });
  const { data: certs } = useQuery({
    queryKey: ["certificates", user?.id],
    queryFn: () => certificateRepository.listForUser(user!.id),
    enabled: !!user,
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Bem-vinda(o) de volta</p>
        <h1 className="mt-1 font-display text-4xl">Olá, {user?.fullName.split(" ")[0]}.</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<BookOpen className="h-4 w-4" />} label="Cursos matriculados" value={enrollments?.data.length ?? 0} />
        <StatCard
          icon={<PlayCircle className="h-4 w-4" />}
          label="Em andamento"
          value={enrollments?.data.filter((e) => e.status === "in_progress").length ?? 0}
        />
        <StatCard icon={<Award className="h-4 w-4" />} label="Certificados" value={certs?.data.filter((c) => c.status === "issued").length ?? 0} />
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">Continue de onde parou</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/aluno/cursos">Ver todos</Link></Button>
        </div>
        {isPending && <LoadingBlock />}
        <div className="grid gap-4 md:grid-cols-2">
          {enrollments?.data.filter((e) => e.status !== "completed").slice(0, 4).map((e) => (
            <EnrollmentRow key={e.id} enrollmentId={e.id} courseSlug={e.course.slug} title={e.course.title} cover={e.course.coverUrl} courseId={e.courseId} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-2 font-display text-4xl">{value}</div>
    </div>
  );
}

function EnrollmentRow({ enrollmentId, courseSlug, title, cover, courseId }: { enrollmentId: string; courseSlug: string; title: string; cover: string; courseId: string }) {
  const { data } = useQuery({
    queryKey: ["progress", enrollmentId],
    queryFn: () => progressRepository.forEnrollment(enrollmentId),
  });
  const total = lessonCountFor(courseId);
  const done = data?.data.filter((p) => p.completed).length ?? 0;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <Link to="/aluno/cursos/$slug" params={{ slug: courseSlug }} className="flex gap-4 rounded-xl border border-border/60 bg-card p-4 transition hover:border-primary/40">
      <img src={cover} alt={title} className="h-20 w-28 shrink-0 rounded-md object-cover" />
      <div className="min-w-0 flex-1">
        <div className="font-display text-lg leading-tight">{title}</div>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          {done}/{total} aulas
        </div>
        <Progress value={pct} className="mt-2 h-1.5" />
      </div>
    </Link>
  );
}
