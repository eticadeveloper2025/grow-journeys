import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoBanner } from "@/components/DemoBanner";
import { authRepository } from "@/repositories";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastrar")({
  head: () => ({ meta: [{ title: "Criar conta — Nerya" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authRepository.register(form);
      toast.success("Conta criada! Bem-vinda(o).");
      navigate({ to: "/aluno", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <PublicLayout>
      <section className="container-page flex items-center justify-center py-16">
        <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-xl border border-border/60 bg-card p-8">
          <p className="text-xs uppercase tracking-widest text-primary">Nova conta</p>
          <h1 className="mt-1 font-display text-3xl">Criar conta</h1>
          <DemoBanner>Conta demonstrativa. Nenhum e-mail é enviado.</DemoBanner>
          <div>
            <Label>Nome completo</Label>
            <Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>Senha</Label>
            <Input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Criando…" : "Criar conta"}</Button>
          <div className="text-center text-sm text-muted-foreground">
            Já tem conta? <Link to="/entrar" className="text-primary hover:underline">Entre</Link>
          </div>
        </form>
      </section>
    </PublicLayout>
  );
}
