import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificateRepository, enrollmentRepository, progressRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState, LoadingBlock } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { formatDateBR } from "@/utils/format";
import { toast } from "sonner";
import { mockLessons, mockModules } from "@/mocks/courses";

export const Route = createFileRoute("/_aluno/aluno/certificados/")({
  head: () => ({ meta: [{ title: "Certificados — Nerya" }] }),
  component: CertList,
});

function CertList() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["certificates", user?.id],
    queryFn: () => certificateRepository.listForUser(user!.id),
    enabled: !!user,
  });
  const { data: enrollments } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: () => enrollmentRepository.listForUser(user!.id),
    enabled: !!user,
  });

  const issue = useMutation({
    mutationFn: (enrollmentId: string) => certificateRepository.issue(enrollmentId, user!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("Certificado emitido.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isPending) return <LoadingBlock />;

  const issued = data?.data ?? [];
  const completedEnrollments = enrollments?.data.filter((e) => e.status === "completed") ?? [];
  const withoutCert = completedEnrollments.filter((e) => !issued.some((c) => c.enrollmentId === e.id && c.status === "issued"));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Reconhecimento</p>
        <h1 className="mt-1 font-display text-4xl">Meus certificados</h1>
      </div>

      {issued.length === 0 && withoutCert.length === 0 && (
        <EmptyState title="Você ainda não possui certificados" description="Conclua um curso para desbloquear." />
      )}

      {issued.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl">Emitidos</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {issued.map((c) => (
              <div key={c.id} className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-lg leading-tight">{c.course.title}</div>
                  <div className="text-xs text-muted-foreground">Emitido em {formatDateBR(c.issueDate)} · {c.certificateCode}</div>
                </div>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/aluno/certificados/$id" params={{ id: c.id }}>Ver</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {withoutCert.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl">Disponíveis para emissão</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {withoutCert.map((e) => (
              <div key={e.id} className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4">
                <div className="flex-1">
                  <div className="font-display text-lg leading-tight">{e.course.title}</div>
                  <div className="text-xs text-muted-foreground">Concluído</div>
                </div>
                <Button size="sm" onClick={() => issue.mutate(e.id)} disabled={issue.isPending}>Emitir</Button>
              </div>
            ))}
          </div>
        </section>
      )}

      <BlockedList />
    </div>
  );
}

function BlockedList() {
  const { user } = useAuth();
  const { data: enrollments } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: () => enrollmentRepository.listForUser(user!.id),
    enabled: !!user,
  });
  const inProgress = enrollments?.data.filter((e) => e.status !== "completed") ?? [];
  if (inProgress.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl">Ainda em progresso</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {inProgress.map((e) => (
          <BlockedRow key={e.id} enrollmentId={e.id} title={e.course.title} required={e.course.requiredProgressPercentage} courseId={e.courseId} />
        ))}
      </div>
    </section>
  );
}

function BlockedRow({ enrollmentId, title, required, courseId }: { enrollmentId: string; title: string; required: number; courseId: string }) {
  const { data } = useQuery({
    queryKey: ["progress", enrollmentId],
    queryFn: () => progressRepository.forEnrollment(enrollmentId),
  });
  const total = mockLessons.filter((l) => mockModules.find((m) => m.id === l.moduleId)?.courseId === courseId).length;
  const done = data?.data.filter((p) => p.completed).length ?? 0;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="font-display text-lg leading-tight">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">Progresso {pct}% de {required}% exigido para o certificado.</div>
    </div>
  );
}
