import type { SchedulingConfig } from "@/types";

export const schedulingConfig: SchedulingConfig = {
  timezone: "America/Bahia",
  workingDays: [1, 2, 3, 4, 5],
  startTime: "08:00",
  endTime: "19:00",
  lessonDurationMinutes: 50,
  bufferMinutes: 10,
  minimumAdvanceHours: 12,
  bookingWindowDays: 45,
  cancellationLimitHours: 12,
};
