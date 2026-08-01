import { env } from "@/config/env";
import { bookingRepository, notificationRepository, planRepository } from "@/repositories";
import type { ApiResponse, Booking, User } from "@/types";

type BookingServiceResult = ApiResponse<{
  booking: Booking;
  notificationMessage?: string;
}>;

const isMock = env.dataSource === "mock";

export const bookingService = {
  async confirmBooking(input: { user: User; slotId: string; topic?: string }): Promise<BookingServiceResult> {
    const bookingResponse = await bookingRepository.book(input.user.id, input.slotId, input.topic);

    if (!isMock) {
      return {
        data: { booking: bookingResponse.data },
        message: bookingResponse.message,
      };
    }

    const credits = await bookingRepository.creditBalance(input.user.id);
    const plan = await planRepository.byId(credits.data.planId).catch(() => null);
    const notification = await notificationRepository.sendBookingConfirmation({
      booking: bookingResponse.data,
      user: input.user,
      plan: plan?.data,
    });

    return {
      data: {
        booking: bookingResponse.data,
        notificationMessage: notification.data.message,
      },
      message: "Aula agendada em ambiente demonstrativo.",
    };
  },

  async cancelBooking(input: { user: User; bookingId: string; reason?: string }): Promise<BookingServiceResult> {
    const bookingResponse = await bookingRepository.cancel(input.bookingId, input.user.id);

    if (!isMock) {
      return {
        data: { booking: bookingResponse.data },
        message: bookingResponse.message,
      };
    }

    const notification = await notificationRepository.sendBookingCancellation({
      booking: bookingResponse.data,
      user: input.user,
      reason: input.reason,
    });

    return {
      data: {
        booking: bookingResponse.data,
        notificationMessage: notification.data.message,
      },
      message: "Aula cancelada em ambiente demonstrativo.",
    };
  },
};
