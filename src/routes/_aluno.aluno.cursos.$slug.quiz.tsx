import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { quizRepository, courseRepository, enrollmentRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { LoadingBlock, EmptyState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { QuizAttempt } from "@/types";

export const Route = createFileRoute("/_aluno/aluno/cursos/$slug/quiz")({
  component: QuizPage,
});

function QuizPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const { data: course } = useQuery({ queryKey: ["course", slug], queryFn: () => courseRepository.bySlug(slug) });
  const { data: enrollments } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: () => enrollmentRepository.listForUser(user!.id),
    enabled: !!user,
  });
  const enrollment = enrollments?.data.find((e) => e.courseId === course?.data.id);
  const { data: quizData } = useQuery({
    queryKey: ["quiz", course?.data.id],
    queryFn: () => quizRepository.byCourse(course!.data.id),
    enabled: !!course,
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttempt | null>(null);

  const submit = useMutation({
    mutationFn: () => quizRepository.submitAttempt(quizData!.data!.id, user!.id, enrollment!.id, answers),
    onSuccess: (r) => {
      setResult(r.data);
      if (r.data.passed) toast.success("Aprovado!");
      else toast.error(`Nota ${r.data.scorePercentage}% — mínimo ${quizData!.data!.minimumScorePercentage}%.`);
    },
  });

  if (!quizData) return <LoadingBlock />;
  if (!quizData.data) return <EmptyState title="Este curso não possui avaliação." />;

  const quiz = quizData.data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Avaliação</p>
        <h1 className="mt-1 font-serif text-3xl">{quiz.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Nota mínima: {quiz.minimumScorePercentage}%</p>
      </div>

      {result ? (
        <div className={`rounded-xl border p-6 ${result.passed ? "border-primary/40 bg-primary/5" : "border-destructive/40 bg-destructive/10"}`}>
          <div className="flex items-center gap-3">
            {result.passed ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <XCircle className="h-6 w-6 text-destructive" />}
            <div>
              <h2 className="font-serif text-2xl">Sua nota: {result.scorePercentage}%</h2>
              <p className="text-sm text-muted-foreground">{result.passed ? "Você foi aprovada(o)." : "Você não atingiu a nota mínima."}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild variant="secondary"><Link to="/aluno/cursos/$slug" params={{ slug }}>Voltar ao curso</Link></Button>
            {!result.passed && (
              <Button onClick={() => { setResult(null); setAnswers({}); }}>Refazer</Button>
            )}
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); submit.mutate(); }}
          className="space-y-6"
        >
          {quiz.questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-border/60 bg-card p-5">
              <p className="mb-4 font-medium">{q.position}. {q.question}</p>
              <RadioGroup value={answers[q.id] ?? ""} onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}>
                {q.options.map((o) => (
                  <div key={o.id} className="flex items-center gap-2 py-1">
                    <RadioGroupItem id={o.id} value={o.id} />
                    <Label htmlFor={o.id} className="cursor-pointer text-sm">{o.optionText}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button type="submit" disabled={submit.isPending || Object.keys(answers).length < quiz.questions.length}>
            {submit.isPending ? "Enviando…" : "Enviar respostas"}
          </Button>
        </form>
      )}
    </div>
  );
}
