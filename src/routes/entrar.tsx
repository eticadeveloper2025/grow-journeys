import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoBanner } from "@/components/DemoBanner";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/entrar")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [{ title: "Entrar — Nerya" }, { name: "description", content: "Acesse sua conta demonstrativa da Nerya." }],
  }),
  component: Login,
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/entrar" });
  const [email, setEmail] = useState("aluno@nerya.demo");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await login(email, password);
      toast.success(`Olá, ${user.fullName.split(" ")[0]}!`);
      const target = redirect ?? (user.role === "admin" ? "/admin" : "/aluno");
      navigate({ to: target, replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="container-page flex items-center justify-center py-16">
        <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-xl border border-border/60 bg-card p-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Área do aluno</p>
            <h1 className="mt-1 font-display text-3xl">Entrar</h1>
          </div>
          <DemoBanner>
            Credenciais demo: <b>aluno@nerya.demo / demo123</b> · <b>admin@nerya.demo / admin123</b>
          </DemoBanner>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
          <div className="flex justify-between text-sm">
            <Link to="/recuperar-senha" className="text-muted-foreground hover:text-primary">Esqueci a senha</Link>
            <Link to="/cadastrar" className="text-muted-foreground hover:text-primary">Criar conta</Link>
          </div>
        </form>
      </section>
    </PublicLayout>
  );
}
