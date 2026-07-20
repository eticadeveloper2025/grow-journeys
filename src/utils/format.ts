import { format, formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatPriceBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function formatDateBR(iso: string): string {
  return format(new Date(iso), "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateLong(iso: string): string {
  return format(new Date(iso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function timeAgo(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true, locale: ptBR });
}

export function formatWorkload(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function shortCode(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
