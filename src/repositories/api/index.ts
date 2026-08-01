import { ApiError } from "@/types";

/**
 * Stubs de repositórios que futuramente falarão com a API REST em VITE_API_BASE_URL.
 * Nenhum endpoint real é chamado nesta etapa — trocar VITE_DATA_SOURCE=api hoje
 * fará qualquer chamada lançar NOT_IMPLEMENTED. Implemente conforme o backend for entregue.
 */

function notImplemented(name: string): never {
  throw new ApiError({
    code: "NOT_IMPLEMENTED",
    message: `${name}: repositório de API ainda não implementado.`,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stub = (name: string): any =>
  new Proxy(
    {},
    {
      get: (_t, prop) => async () => notImplemented(`${name}.${String(prop)}`),
    },
  );

export const apiAuthRepository = stub("ApiAuthRepository");
export const apiCourseRepository = stub("ApiCourseRepository");
export const apiLessonRepository = stub("ApiLessonRepository");
export const apiEnrollmentRepository = stub("ApiEnrollmentRepository");
export const apiProgressRepository = stub("ApiProgressRepository");
export const apiQuizRepository = stub("ApiQuizRepository");
export const apiCertificateRepository = stub("ApiCertificateRepository");
export const apiPlanRepository = stub("ApiPlanRepository");
export const apiSubscriptionRepository = stub("ApiSubscriptionRepository");
export const apiBookingRepository = stub("ApiBookingRepository");
export const apiNotificationRepository = stub("ApiNotificationRepository");
export const apiBlogRepository = stub("ApiBlogRepository");
export const apiUserRepository = stub("ApiUserRepository");
export const apiAdminRepository = stub("ApiAdminRepository");
