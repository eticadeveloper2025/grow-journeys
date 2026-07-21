import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoBanner } from "@/components/DemoBanner";
import { authRepository } from "@/repositories";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({ meta: [{ title: "Redefinir senha — Nerya" }] }),
  component: Reset,
});

function Reset() {
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <PublicLayout>
      <section className="container-page flex items-center justify-center py-16">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await authRepository.resetPassword("demo-token", pwd);
            setLoading(false);
            toast.success("Senha redefinida (demo).");
          }}
          className="w-full max-w-md space-y-4 rounded-xl border border-border/60 bg-card p-8"
        >
          <h1 className="font-display text-3xl">Nova senha</h1>
          <DemoBanner />
          <div>
            <Label>Nova senha</Label>
            <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>Redefinir</Button>
          <div className="text-center text-sm">
            <Link to="/entrar" className="text-primary hover:underline">Ir para o login</Link>
          </div>
        </form>
      </section>
    </PublicLayout>
  );
}
