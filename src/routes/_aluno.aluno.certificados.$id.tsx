import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { certificateRepository } from "@/repositories";
import { useAuth } from "@/hooks/useAuth";
import { LoadingBlock } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { formatDateLong, formatWorkload } from "@/utils/format";
import { useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/aluno/certificados/$id")({
  component: CertView,
});

function CertView() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { data, isPending } = useQuery({
    queryKey: ["certificate", id, user?.id],
    queryFn: () => certificateRepository.byId(id, user!.id),
    enabled: !!user,
  });
  const ref = useRef<HTMLDivElement>(null);

  const download = async () => {
    if (!ref.current) return;
    toast.loading("Gerando PDF…", { id: "pdf" });
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#141420" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, (pdf.internal.pageSize.getHeight() - h) / 2, w, h);
      pdf.save(`certificado-${data?.data.certificateCode}.pdf`);
      toast.success("PDF baixado.", { id: "pdf" });
    } catch (e) {
      toast.error("Erro ao gerar PDF.", { id: "pdf" });
    }
  };

  if (isPending || !data) return <LoadingBlock />;
  const cert = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/aluno/certificados" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <Button onClick={download}><Download className="mr-2 h-4 w-4" /> Baixar PDF</Button>
      </div>

      <div
        ref={ref}
        className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-primary/30 bg-card p-12"
        style={{ background: "linear-gradient(135deg, oklch(0.18 0.02 260), oklch(0.22 0.02 260))" }}
      >
        <div className="border border-primary/40 p-10 text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-primary">Certificado demonstrativo</div>
          <div className="mt-4 font-serif text-2xl">Nerya</div>

          <h1 className="mt-10 font-serif text-4xl leading-tight">Certificamos que</h1>
          <div className="mt-4 font-serif text-5xl text-primary">{cert.user.fullName}</div>
          <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground">
            concluiu o curso <b>{cert.course.title}</b>, com carga horária de {formatWorkload(cert.workloadMinutes)},
            em {formatDateLong(cert.completionDate)}.
          </p>

          <div className="mt-12 flex items-end justify-between text-left text-xs text-muted-foreground">
            <div>
              <div className="border-t border-border pt-2">Direção Pedagógica</div>
            </div>
            <div className="text-right">
              <div>Código: <span className="text-foreground">{cert.certificateCode}</span></div>
              <div>Emissão: {formatDateLong(cert.issueDate)}</div>
              <div className="mt-1">Valide em {cert.verificationUrl}</div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          Documento demonstrativo — não substitui certificação oficial
        </p>
      </div>
    </div>
  );
}
