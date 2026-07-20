import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useQuery } from "@tanstack/react-query";
import { certificateRepository } from "@/repositories";
import { LoadingBlock } from "@/components/States";
import { formatDateLong, formatWorkload } from "@/utils/format";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/certificados/validar/$codigo")({
  head: ({ params }) => ({
    meta: [
      { title: `Validação de certificado ${params.codigo} — Nerya` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Verify,
});

function Verify() {
  const { codigo } = Route.useParams();
  const { data, isPending } = useQuery({
    queryKey: ["verify", codigo],
    queryFn: () => certificateRepository.verifyByCode(codigo),
  });

  return (
    <PublicLayout>
      <section className="container-page max-w-2xl py-16">
        <p className="text-xs uppercase tracking-widest text-primary">Validação de certificado</p>
        <h1 className="mt-2 font-serif text-4xl">Código: {codigo}</h1>

        <div className="mt-8">
          {isPending && <LoadingBlock label="Consultando registro…" />}
          {!isPending && !data?.data && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-6">
              <XCircle className="mt-0.5 h-6 w-6 text-destructive" />
              <div>
                <h2 className="font-serif text-xl">Não encontrado</h2>
                <p className="text-sm text-muted-foreground">Nenhum certificado corresponde a este código.</p>
              </div>
            </div>
          )}
          {data?.data && data.data.status === "issued" && (
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-6 w-6 text-primary" />
                <div className="flex-1">
                  <h2 className="font-serif text-2xl">Certificado válido</h2>
                  <p className="text-sm text-muted-foreground">
                    Emitido para <b>{data.data.user.fullName}</b> em {formatDateLong(data.data.issueDate)}.
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-muted-foreground">Curso</dt><dd>{data.data.course.title}</dd></div>
                    <div><dt className="text-muted-foreground">Carga horária</dt><dd>{formatWorkload(data.data.workloadMinutes)}</dd></div>
                    <div><dt className="text-muted-foreground">Tipo</dt><dd className="capitalize">{data.data.certificateType}</dd></div>
                    <div><dt className="text-muted-foreground">Conclusão</dt><dd>{formatDateLong(data.data.completionDate)}</dd></div>
                  </dl>
                </div>
              </div>
            </div>
          )}
          {data?.data && data.data.status === "revoked" && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6">
              <h2 className="font-serif text-xl">Certificado revogado</h2>
              <p className="mt-1 text-sm text-muted-foreground">Motivo: {data.data.revocationReason ?? "não informado"}</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-start gap-2 rounded-md border border-border/60 bg-card/40 p-3 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5" />
          Verificação demonstrativa baseada em dados locais. Em produção, esta página consultará o endpoint
          <code className="mx-1 rounded bg-muted px-1">GET /api/certificates/:code/verify</code>.
        </div>
      </section>
    </PublicLayout>
  );
}
