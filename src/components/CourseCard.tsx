import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Signal } from "lucide-react";
import type { Course } from "@/types";
import { formatPriceBRL, formatWorkload } from "@/utils/format";

const LEVEL_LABEL: Record<Course["level"], string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to="/cursos/$slug"
      params={{ slug: course.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition duration-200 hover:-translate-y-0.5 hover:border-brand/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={course.coverUrl}
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Signal className="h-3.5 w-3.5" />
            {LEVEL_LABEL[course.level]}
          </span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatWorkload(course.workloadMinutes)}
          </span>
        </div>
        <h3 className="text-lg leading-tight text-foreground">{course.title}</h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {course.shortDescription}
        </p>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-medium text-foreground">
            {course.priceCents === 0 ? "Gratuito" : formatPriceBRL(course.priceCents)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground transition group-hover:text-brand-light">
            Ver curso <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
