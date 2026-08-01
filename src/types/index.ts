/**
 * Modelos de domínio do frontend (camelCase).
 * A futura API REST usará snake_case; o mapeamento fica em src/utils/mappers.ts.
 */

export type UserRole = "student" | "admin" | "instructor";
export type EntityStatus = "active" | "inactive" | "draft" | "archived";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: EntityStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  photoUrl: string;
  status: EntityStatus;
}

export type CourseLevel = "iniciante" | "intermediario" | "avancado";
export type CourseModality = "gravado" | "ao_vivo" | "hibrido";
export type CertificateType = "conclusao" | "aproveitamento";

export interface Course {
  id: string;
  instructorId: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  level: CourseLevel;
  modality: CourseModality;
  workloadMinutes: number;
  priceCents: number;
  coverUrl: string;
  status: "published" | "draft" | "archived";
  certificateType: CertificateType;
  requiredProgressPercentage: number;
  minimumScorePercentage: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  categoryTags?: string[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  position: number;
}

export type LessonContentType = "video" | "audio" | "pdf" | "text";

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  description: string;
  contentType: LessonContentType;
  videoUrl?: string;
  durationMinutes: number;
  position: number;
  isRequired: boolean;
  isPreview: boolean;
  status: EntityStatus;
}

export type EnrollmentStatus = "not_started" | "in_progress" | "completed" | "expired";

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  progressPercentage: number;
  completed: boolean;
  lastPositionSeconds: number;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  minimumScorePercentage: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  position: number;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  position: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  enrollmentId: string;
  scorePercentage: number;
  passed: boolean;
  finishedAt: string;
}

export type CertificateStatus = "issued" | "revoked" | "blocked_progress" | "blocked_score";

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  enrollmentId: string;
  certificateCode: string;
  certificateType: CertificateType;
  workloadMinutes: number;
  issueDate: string;
  completionDate: string;
  status: CertificateStatus;
  verificationUrl: string;
  revokedAt?: string;
  revocationReason?: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  lessonsPerWeek: number;
  lessonsPerMonth: number;
  originalMonthlyPriceCents?: number;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  featured: boolean;
  status: EntityStatus;
  features: PlanFeature[];
}

export interface PlanFeature {
  id: string;
  planId: string;
  feature: string;
  included: boolean;
  position: number;
}

export type BookingStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export interface Booking {
  id: string;
  studentId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  format: "online";
  status: BookingStatus;
  topic?: string;
  notes?: string;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  unavailableReason?: "outside_window" | "booked" | "past" | "blocked";
}

export interface StudentCreditBalance {
  studentId: string;
  planId: string;
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  cycleStart: string;
  cycleEnd: string;
}

export interface SchedulingConfig {
  timezone: string;
  workingDays: number[];
  startTime: string;
  endTime: string;
  lessonDurationMinutes: number;
  bufferMinutes: number;
  minimumAdvanceHours: number;
  bookingWindowDays: number;
  cancellationLimitHours: number;
}

export interface NotificationAttempt {
  id: string;
  bookingId: string;
  userId: string;
  channel: "email";
  status: "queued" | "sent" | "failed";
  createdAt: string;
  message: string;
}

export interface BookingConfirmationNotification {
  booking: Booking;
  user: User;
  plan?: Plan;
}

export interface BookingCancellationNotification {
  booking: Booking;
  user: User;
  reason?: string;
}

export interface BookingRescheduledNotification {
  previousBooking: Booking;
  nextBooking: Booking;
  user: User;
}

export interface NotificationResult {
  id: string;
  status: "simulated" | "queued" | "skipped";
  provider: "mock" | "backend";
  message: string;
  createdAt: string;
}

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  provider: "demo";
  status: SubscriptionStatus;
  billingCycle: "monthly" | "yearly";
  startedAt: string;
  renewalAt: string;
  canceledAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  authorId: string;
  categoryId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  status: "published" | "draft";
  publishedAt?: string;
  readingMinutes: number;
}

export interface Favorite {
  id: string;
  userId: string;
  entityType: "course" | "post";
  entityId: string;
  createdAt: string;
}

/* Sessão de autenticação demo */
export interface Session {
  userId: string;
  role: UserRole;
  token: string;
  createdAt: string;
}

/* Formato de resposta padronizado (espelha futura API REST) */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export class ApiError extends Error {
  code: string;
  fields?: Record<string, string>;
  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.code = payload.code;
    this.fields = payload.fields;
  }
}
