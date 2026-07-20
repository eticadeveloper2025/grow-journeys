import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { LayoutDashboard, GraduationCap, Award, Heart, User as UserIcon, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { to: "/aluno", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/aluno/cursos", label: "Meus cursos", icon: GraduationCap },
  { to: "/aluno/certificados", label: "Certificados", icon: Award },
  { to: "/aluno/favoritos", label: "Favoritos", icon: Heart },
  { to: "/aluno/assinatura", label: "Assinatura", icon: CreditCard },
  { to: "/aluno/perfil", label: "Perfil", icon: UserIcon },
] as const;

export function AlunoLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Você saiu.");
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-sidebar md:flex md:flex-col">
        <div className="border-b border-border/60 px-5 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl leading-none">Nerya</span>
            <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-primary">
              aluno
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-3">
          <div className="mb-2 px-2 text-xs text-muted-foreground">
            {user?.fullName}
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border/60 bg-background px-5 md:hidden">
          <Link to="/" className="font-serif text-xl">Nerya</Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <div className="flex-1 p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
