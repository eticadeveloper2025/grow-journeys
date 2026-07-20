import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DemoBanner } from "@/components/DemoBanner";
import { toast } from "sonner";

export const Route = createFileRoute("/_aluno/aluno/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Nerya" }] }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">Conta</p>
        <h1 className="mt-1 font-serif text-4xl">Perfil</h1>
      </div>
      <DemoBanner>Alterações não são persistidas na versão demonstrativa.</DemoBanner>
      <form
        className="space-y-4 rounded-xl border border-border/60 bg-card p-6"
        onSubmit={(e) => { e.preventDefault(); toast.success("Perfil atualizado (demo)."); }}
      >
        <div>
          <Label>Nome</Label>
          <Input defaultValue={user.fullName} />
        </div>
        <div>
          <Label>E-mail</Label>
          <Input defaultValue={user.email} type="email" />
        </div>
        <Button type="submit">Salvar</Button>
      </form>
    </div>
  );
}
