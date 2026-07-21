import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/cursos", label: "Cursos" },
  { to: "/planos", label: "Planos" },
  { to: "/conteudos", label: "Conteúdos" },
  { to: "/sobre", label: "Como funciona" },
  { to: "/contato", label: "Contato" },
] as const;

export function PublicLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-3xl leading-none tracking-tight text-foreground">
              nerya<span className="text-coral">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {loading ? null : user ? (
              <Button asChild size="sm" variant="secondary">
                <Link to={user.role === "admin" ? "/" : "/aluno"}>
                  {user.role === "admin" ? "Admin" : "Minha área"}
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/entrar">Entrar</Link>
                </Button>
                <Button asChild size="sm" className="bg-coral hover:opacity-90">
                  <Link to="/cadastrar">Começar a aprender</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className={cn("border-t border-border/60 lg:hidden", open ? "block" : "hidden")}>
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <Button asChild size="sm" className="flex-1">
                  <Link to={user.role === "admin" ? "/" : "/aluno"}>Minha área</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="sm" variant="ghost" className="flex-1">
                    <Link to="/entrar">Entrar</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-coral hover:opacity-90">
                    <Link to="/cadastrar">Começar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 bg-[color:var(--background-soft)]">
        <div className="container-page grid gap-8 py-12 md:grid-cols-4">
          <div>
            <div className="font-display text-3xl">
              nerya<span className="text-coral">.</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Inglês online que conecta. Aulas práticas, cursos, conversação e certificados de conclusão.
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest text-lilac">Nerya | Inglês Online</p>
          </div>
          <div>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Aprender</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cursos" className="hover:text-foreground">Cursos</Link></li>
              <li><Link to="/planos" className="hover:text-foreground">Planos</Link></li>
              <li><Link to="/conteudos" className="hover:text-foreground">Conteúdos</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Institucional</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" className="hover:text-foreground">Como funciona</Link></li>
              <li><Link to="/contato" className="hover:text-foreground">Contato</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Aviso</div>
            <p className="text-xs text-muted-foreground">
              Esta versão é demonstrativa. Nenhum pagamento é processado e os certificados aqui emitidos são apenas ilustrativos.
            </p>
          </div>
        </div>
        <div className="border-t border-border/60">
          <div className="container-page py-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nerya. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
