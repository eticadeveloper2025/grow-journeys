import { Link } from "@tanstack/react-router";
import { Clock, Signal } from "lucide-react";
import type { Course } from "@/types";
import { formatPriceBRL, formatWorkload } from "@/utils/format";
import { Badge } from "@/components/ui/badge";

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
      className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition hover:border-primary/40"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={course.coverUrl}
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Signal className="h-3.5 w-3.5" />
          {LEVEL_LABEL[course.level]}
          <span>·</span>
          <Clock className="h-3.5 w-3.5" />
          {formatWorkload(course.workloadMinutes)}
        </div>
        <h3 className="font-display text-xl leading-tight text-foreground uppercase">{course.title}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
          {course.shortDescription}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15">
            {course.priceCents === 0 ? "Gratuito" : formatPriceBRL(course.priceCents)}
          </Badge>
          <span className="text-xs text-muted-foreground group-hover:text-primary">Ver curso →</span>
        </div>
      </div>
    </Link>
  );
}
