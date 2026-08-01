import { addDays, addMinutes, differenceInCalendarDays, eachDayOfInterval, format, isBefore, parseISO } from "date-fns";
import type { AvailabilitySlot, Booking, SchedulingConfig } from "@/types";

function minutesFromTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function dateTimeFromParts(date: string, time: string): Date {
  return parseISO(`${date}T${time}:00`);
}

export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function monthRange(monthDate: Date): { from: string; to: string } {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const last = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  return { from: dateKey(first), to: dateKey(last) };
}

export function buildAvailabilitySlots(
  config: SchedulingConfig,
  bookings: Booking[],
  range?: { from?: string; to?: string },
  now = new Date(),
): AvailabilitySlot[] {
  const windowStart = addMinutes(now, config.minimumAdvanceHours * 60);
  const windowEnd = addDays(now, config.bookingWindowDays);
  const requestedStart = range?.from ? parseISO(`${range.from}T00:00:00`) : now;
  const requestedEnd = range?.to ? parseISO(`${range.to}T23:59:59`) : windowEnd;
  const from = isBefore(requestedStart, now) ? now : requestedStart;
  const to = isBefore(windowEnd, requestedEnd) ? windowEnd : requestedEnd;
  if (isBefore(to, from)) return [];

  const booked = new Set(
    bookings
      .filter((booking) => booking.status === "scheduled")
      .map((booking) => `${booking.date}-${booking.startTime}`),
  );
  const startMinutes = minutesFromTime(config.startTime);
  const endMinutes = minutesFromTime(config.endTime);
  const step = config.lessonDurationMinutes + config.bufferMinutes;

  return eachDayOfInterval({ start: from, end: to }).flatMap((day) => {
    if (!config.workingDays.includes(day.getDay())) return [];
    const dayKey = dateKey(day);
    const slots: AvailabilitySlot[] = [];
    for (let start = startMinutes; start + config.lessonDurationMinutes <= endMinutes; start += step) {
      const startTime = timeFromMinutes(start);
      const endTime = timeFromMinutes(start + config.lessonDurationMinutes);
      const slotDate = dateTimeFromParts(dayKey, startTime);
      const key = `${dayKey}-${startTime}`;
      const tooSoon = isBefore(slotDate, windowStart);
      const isBooked = booked.has(key);
      slots.push({
        id: `slot-${dayKey}-${startTime.replace(":", "")}`,
        date: dayKey,
        startTime,
        endTime,
        available: !tooSoon && !isBooked,
        unavailableReason: tooSoon ? "past" : isBooked ? "booked" : undefined,
      });
    }
    return slots;
  });
}

export function isWithinBookingWindow(date: string, config: SchedulingConfig, now = new Date()): boolean {
  const target = parseISO(`${date}T12:00:00`);
  const days = differenceInCalendarDays(target, now);
  return days >= 0 && days <= config.bookingWindowDays;
}
