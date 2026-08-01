import { formatDateLong } from "@/utils/format";
import type { Booking, BookingStatus } from "@/types";

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  scheduled: "Agendada",
  completed: "Realizada",
  cancelled: "Cancelada",
  no_show: "Ausente",
};

export function formatBookingDateTime(booking: Pick<Booking, "date" | "startTime" | "endTime">): string {
  return `${formatDateLong(`${booking.date}T12:00:00`)} · ${booking.startTime}-${booking.endTime}`;
}

export function sortBookingsAsc(a: Booking, b: Booking): number {
  return `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`);
}
