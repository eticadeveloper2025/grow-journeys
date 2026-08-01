import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/planos", label: "Planos" },
  { to: "/agendar", label: "Agendar aula" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/contato", label: "Contato" },
] as const;

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-2xl leading-none tracking-tight text-foreground", className)}>
      nerya<span className="text-brand">.</span>
    </span>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-colors duration-200",
          scrolled
            ? "border-border bg-background/85 backdrop-blur-md"
            : "border-transparent bg-background/60 backdrop-blur",
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[72px]">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Nerya — Início">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{
                  className:
                    "text-foreground after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-brand",
                }}
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
                <Button asChild size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <Link to="/entrar">Entrar</Link>
                </Button>
                <Button asChild size="sm" className="bg-brand text-primary-foreground hover:bg-brand-dark">
                  <Link to="/agendar">Agendar aula</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="rounded-md p-2 text-foreground transition-colors hover:bg-surface lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}>
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-surface hover:text-foreground"
                activeProps={{ className: "bg-surface text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <Button asChild size="sm" className="flex-1 bg-brand hover:bg-brand-dark">
                  <Link to={user.role === "admin" ? "/" : "/aluno"}>Minha área</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="sm" variant="ghost" className="flex-1">
                    <Link to="/entrar">Entrar</Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-brand text-primary-foreground hover:bg-brand-dark">
                    <Link to="/agendar">Agendar aula</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-[color:var(--background-soft)]">
        <div className="container-page grid gap-10 py-14 md:grid-cols-4">
          <div>
            <Logo className="text-3xl" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Inglês online que conecta. Aulas particulares ao vivo, conversação e acompanhamento individual.
            </p>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Aulas</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/planos" className="transition hover:text-foreground">Planos</Link></li>
              <li><Link to="/agendar" className="transition hover:text-foreground">Agendar aula</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Institucional</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/como-funciona" className="transition hover:text-foreground">Como funciona</Link></li>
              <li><Link to="/contato" className="transition hover:text-foreground">Contato</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Aviso</div>
            <p className="text-xs text-muted-foreground">
              Versão demonstrativa. Nenhum pagamento é processado e nenhum horário real é reservado.
            </p>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Nerya. Todos os direitos reservados.</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Feito com foco em fluência.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
