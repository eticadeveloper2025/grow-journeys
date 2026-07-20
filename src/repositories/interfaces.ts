import type {
  ApiListResponse,
  ApiResponse,
  Category,
  Certificate,
  Course,
  CourseModule,
  Enrollment,
  Instructor,
  Lesson,
  LessonProgress,
  Plan,
  Post,
  Quiz,
  QuizAttempt,
  Session,
  Subscription,
  User,
} from "@/types";

/**
 * Contratos de repositório.
 * Cada método declara no JSDoc o endpoint REST equivalente da futura API.
 * Trocar mock → api significa apenas implementar essas interfaces em src/repositories/api.
 */

export interface AuthRepository {
  /** POST /api/auth/login */
  login(email: string, password: string): Promise<ApiResponse<{ session: Session; user: User }>>;
  /** POST /api/auth/logout */
  logout(): Promise<ApiResponse<null>>;
  /** GET /api/auth/me */
  me(): Promise<ApiResponse<User | null>>;
  /** POST /api/auth/forgot-password */
  forgotPassword(email: string): Promise<ApiResponse<null>>;
  /** POST /api/auth/reset-password */
  resetPassword(token: string, password: string): Promise<ApiResponse<null>>;
  /** POST /api/auth/register (demo local) */
  register(input: { fullName: string; email: string; password: string }): Promise<ApiResponse<{ session: Session; user: User }>>;
}

export interface CourseRepository {
  /** GET /api/courses */
  list(params?: { q?: string; category?: string; level?: string }): Promise<ApiListResponse<Course>>;
  /** GET /api/courses/:slug */
  bySlug(slug: string): Promise<ApiResponse<Course & { instructor: Instructor; modules: (CourseModule & { lessons: Lesson[] })[] }>>;
  /** GET /api/courses/:courseId/modules */
  modules(courseId: string): Promise<ApiResponse<(CourseModule & { lessons: Lesson[] })[]>>;
  create(input: Partial<Course>): Promise<ApiResponse<Course>>;
  update(id: string, input: Partial<Course>): Promise<ApiResponse<Course>>;
  remove(id: string): Promise<ApiResponse<null>>;
}

export interface LessonRepository {
  /** GET /api/lessons/:id */
  byId(id: string): Promise<ApiResponse<Lesson>>;
}

export interface EnrollmentRepository {
  /** GET /api/me/enrollments */
  listForUser(userId: string): Promise<ApiListResponse<Enrollment & { course: Course }>>;
  /** POST /api/courses/:courseId/enroll */
  enroll(userId: string, courseId: string): Promise<ApiResponse<Enrollment>>;
  /** GET /api/enrollments/:id */
  byId(id: string): Promise<ApiResponse<Enrollment>>;
}

export interface ProgressRepository {
  /** GET /api/enrollments/:id/progress */
  forEnrollment(enrollmentId: string): Promise<ApiResponse<LessonProgress[]>>;
  /** PUT /api/enrollments/:id/lessons/:lessonId/progress */
  markLesson(enrollmentId: string, lessonId: string, completed: boolean): Promise<ApiResponse<LessonProgress>>;
}

export interface QuizRepository {
  /** GET /api/courses/:courseId/quiz */
  byCourse(courseId: string): Promise<ApiResponse<Quiz | null>>;
  /** POST /api/quizzes/:id/attempts */
  submitAttempt(quizId: string, userId: string, enrollmentId: string, answers: Record<string, string>): Promise<ApiResponse<QuizAttempt>>;
}

export interface CertificateRepository {
  /** GET /api/me/certificates */
  listForUser(userId: string): Promise<ApiListResponse<Certificate & { course: Course }>>;
  /** POST /api/enrollments/:id/certificate */
  issue(enrollmentId: string, userId: string): Promise<ApiResponse<Certificate>>;
  /** GET /api/certificates/:code/verify */
  verifyByCode(code: string): Promise<ApiResponse<(Certificate & { course: Course; user: User }) | null>>;
  /** GET /api/admin/certificates */
  listAll(): Promise<ApiListResponse<Certificate & { course: Course; user: User }>>;
  revoke(id: string, reason: string): Promise<ApiResponse<Certificate>>;
  byId(id: string, userId: string): Promise<ApiResponse<Certificate & { course: Course; user: User }>>;
}

export interface PlanRepository {
  /** GET /api/plans */
  list(): Promise<ApiListResponse<Plan>>;
  byId(id: string): Promise<ApiResponse<Plan>>;
}

export interface SubscriptionRepository {
  /** GET /api/me/subscription */
  current(userId: string): Promise<ApiResponse<(Subscription & { plan: Plan }) | null>>;
  /** POST /api/subscriptions/checkout */
  subscribe(userId: string, planId: string, cycle: "monthly" | "yearly"): Promise<ApiResponse<Subscription>>;
  cancel(userId: string): Promise<ApiResponse<null>>;
}

export interface BlogRepository {
  /** GET /api/posts */
  list(params?: { category?: string; q?: string }): Promise<ApiListResponse<Post & { category: Category; author: User }>>;
  /** GET /api/posts/:slug */
  bySlug(slug: string): Promise<ApiResponse<Post & { category: Category; author: User }>>;
  /** GET /api/categories */
  categories(): Promise<ApiResponse<Category[]>>;
  create(input: Partial<Post>): Promise<ApiResponse<Post>>;
  update(id: string, input: Partial<Post>): Promise<ApiResponse<Post>>;
  remove(id: string): Promise<ApiResponse<null>>;
}

export interface UserRepository {
  list(): Promise<ApiListResponse<User>>;
  byId(id: string): Promise<ApiResponse<User>>;
}

export interface AdminRepository {
  dashboard(): Promise<
    ApiResponse<{
      studentsCount: number;
      coursesCount: number;
      certificatesCount: number;
      revenueCents: number;
      recentEnrollments: (Enrollment & { user: User; course: Course })[];
    }>
  >;
}
