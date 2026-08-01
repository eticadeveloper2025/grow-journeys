import { env } from "@/config/env";
import * as mock from "./mock";
import * as api from "./api";
import type {
  AdminRepository,
  AuthRepository,
  BlogRepository,
  BookingRepository,
  CertificateRepository,
  CourseRepository,
  EnrollmentRepository,
  LessonRepository,
  NotificationRepository,
  PlanRepository,
  ProgressRepository,
  QuizRepository,
  SubscriptionRepository,
  UserRepository,
} from "./interfaces";

const useMock = env.dataSource === "mock";

export const authRepository: AuthRepository = useMock ? mock.mockAuthRepository : api.apiAuthRepository;
export const courseRepository: CourseRepository = useMock ? mock.mockCourseRepository : api.apiCourseRepository;
export const lessonRepository: LessonRepository = useMock ? mock.mockLessonRepository : api.apiLessonRepository;
export const enrollmentRepository: EnrollmentRepository = useMock ? mock.mockEnrollmentRepository : api.apiEnrollmentRepository;
export const progressRepository: ProgressRepository = useMock ? mock.mockProgressRepository : api.apiProgressRepository;
export const quizRepository: QuizRepository = useMock ? mock.mockQuizRepository : api.apiQuizRepository;
export const certificateRepository: CertificateRepository = useMock ? mock.mockCertificateRepository : api.apiCertificateRepository;
export const planRepository: PlanRepository = useMock ? mock.mockPlanRepository : api.apiPlanRepository;
export const subscriptionRepository: SubscriptionRepository = useMock ? mock.mockSubscriptionRepository : api.apiSubscriptionRepository;
export const bookingRepository: BookingRepository = useMock ? mock.mockBookingRepository : api.apiBookingRepository;
export const notificationRepository: NotificationRepository = useMock ? mock.mockNotificationRepository : api.apiNotificationRepository;
export const blogRepository: BlogRepository = useMock ? mock.mockBlogRepository : api.apiBlogRepository;
export const userRepository: UserRepository = useMock ? mock.mockUserRepository : api.apiUserRepository;
export const adminRepository: AdminRepository = useMock ? mock.mockAdminRepository : api.apiAdminRepository;
