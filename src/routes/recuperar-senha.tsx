import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoBanner } from "@/components/DemoBanner";
import { authRepository } from "@/repositories";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({ meta: [{ title: "Recuperar senha — Nerya" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <PublicLayout>
      <section className="container-page flex items-center justify-center py-16">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await authRepository.forgotPassword(email);
            setLoading(false);
            toast.success("Se o e-mail existir, um link foi enviado (demo).");
          }}
          className="w-full max-w-md space-y-4 rounded-xl border border-border/60 bg-card p-8"
        >
          <h1 className="font-display text-3xl">Recuperar senha</h1>
          <DemoBanner />
          <div>
            <Label>E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>Enviar link</Button>
          <div className="text-center text-sm">
            <Link to="/entrar" className="text-primary hover:underline">Voltar</Link>
          </div>
        </form>
      </section>
    </PublicLayout>
  );
}
