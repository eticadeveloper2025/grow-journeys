import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DemoBanner } from "@/components/DemoBanner";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Nerya" },
      { name: "description", content: "Fale com o time da Nerya." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [loading, setLoading] = useState(false);
  return (
    <PublicLayout>
      <section className="container-page grid max-w-4xl gap-10 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Contato</p>
          <h1 className="mt-2 font-display text-5xl leading-tight">Fale com a gente.</h1>
          <p className="mt-4 text-muted-foreground">
            Dúvidas, parcerias, sugestões de curso. Respondemos em até 2 dias úteis.
          </p>
          <div className="mt-6 space-y-1 text-sm text-muted-foreground">
            <div>oi@nerya.demo</div>
            <div>São Paulo — Brasil</div>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              toast.success("Mensagem enviada (demonstrativo).");
              (e.target as HTMLFormElement).reset();
            }, 500);
          }}
          className="space-y-4 rounded-xl border border-border/60 bg-card p-6"
        >
          <DemoBanner />
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" required />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="msg">Mensagem</Label>
            <Textarea id="msg" rows={5} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enviando…" : "Enviar"}
          </Button>
        </form>
      </section>
    </PublicLayout>
  );
}
