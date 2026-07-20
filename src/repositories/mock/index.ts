import type {
  AuthRepository,
  BlogRepository,
  CertificateRepository,
  CourseRepository,
  EnrollmentRepository,
  LessonRepository,
  PlanRepository,
  ProgressRepository,
  QuizRepository,
  SubscriptionRepository,
  UserRepository,
  AdminRepository,
} from "../interfaces";
import { mockDelay, maybeMockError } from "@/utils/mockDelay";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { mockUsers, mockInstructors, MOCK_CREDENTIALS } from "@/mocks/users";
import { mockCourses, mockModules, mockLessons, mockCategories } from "@/mocks/courses";
import { mockEnrollments, mockLessonProgress, mockCertificates, mockQuizzes } from "@/mocks/enrollments";
import { mockPlans } from "@/mocks/plans";
import { mockPosts } from "@/mocks/posts";
import type {
  ApiListResponse,
  ApiResponse,
  Certificate,
  Course,
  Enrollment,
  LessonProgress,
  Plan,
  Post,
  QuizAttempt,
  Session,
  Subscription,
  User,
} from "@/types";
import { ApiError } from "@/types";
import { shortCode } from "@/utils/format";

/* ---------------- helpers de persistência (mescla mocks + overrides) ---------------- */

function loadEnrollments(): Enrollment[] {
  return storage.get<Enrollment[]>(STORAGE_KEYS.enrollments, mockEnrollments);
}
function saveEnrollments(list: Enrollment[]): void {
  storage.set(STORAGE_KEYS.enrollments, list);
}
function loadProgress(): LessonProgress[] {
  return storage.get<LessonProgress[]>(STORAGE_KEYS.progress, mockLessonProgress);
}
function saveProgress(list: LessonProgress[]): void {
  storage.set(STORAGE_KEYS.progress, list);
}
function loadCertificates(): Certificate[] {
  return storage.get<Certificate[]>(STORAGE_KEYS.certificates, mockCertificates);
}
function saveCertificates(list: Certificate[]): void {
  storage.set(STORAGE_KEYS.certificates, list);
}
function loadUsers(): User[] {
  return storage.get<User[]>(STORAGE_KEYS.users, mockUsers);
}
function saveUsers(list: User[]): void {
  storage.set(STORAGE_KEYS.users, list);
}

/* ---------------- Auth ---------------- */

export const mockAuthRepository: AuthRepository = {
  async login(email, password) {
    await mockDelay();
    maybeMockError("autenticação");
    const cred = MOCK_CREDENTIALS[email.toLowerCase()];
    if (!cred || cred.password !== password) {
      throw new ApiError({ code: "INVALID_CREDENTIALS", message: "E-mail ou senha inválidos." });
    }
    const users = loadUsers();
    const user = users.find((u) => u.id === cred.userId);
    if (!user) throw new ApiError({ code: "USER_NOT_FOUND", message: "Usuário não encontrado." });
    const session: Session = {
      userId: user.id,
      role: user.role,
      token: `demo-${shortCode()}`,
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.session, session);
    return { data: { session, user }, message: "Login realizado com sucesso." };
  },
  async logout() {
    await mockDelay(150);
    storage.remove(STORAGE_KEYS.session);
    return { data: null };
  },
  async me() {
    await mockDelay(80);
    const session = storage.get<Session | null>(STORAGE_KEYS.session, null);
    if (!session) return { data: null };
    const users = loadUsers();
    return { data: users.find((u) => u.id === session.userId) ?? null };
  },
  async forgotPassword(_email) {
    await mockDelay();
    return { data: null, message: "Se o e-mail existir, um link de recuperação foi enviado." };
  },
  async resetPassword(_token, _password) {
    await mockDelay();
    return { data: null, message: "Senha redefinida (demonstrativo)." };
  },
  async register({ fullName, email, password: _password }) {
    await mockDelay();
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new ApiError({ code: "EMAIL_TAKEN", message: "Este e-mail já está cadastrado." });
    }
    const now = new Date().toISOString();
    const user: User = {
      id: `u-${shortCode()}`,
      fullName,
      email,
      role: "student",
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    const next = [...users, user];
    saveUsers(next);
    // Registra credenciais em memória (demo apenas)
    MOCK_CREDENTIALS[email.toLowerCase()] = { userId: user.id, password: _password };
    const session: Session = {
      userId: user.id,
      role: user.role,
      token: `demo-${shortCode()}`,
      createdAt: now,
    };
    storage.set(STORAGE_KEYS.session, session);
    return { data: { session, user }, message: "Conta criada." };
  },
};

/* ---------------- Courses ---------------- */

export const mockCourseRepository: CourseRepository = {
  async list(params) {
    await mockDelay();
    maybeMockError("busca de cursos");
    let items = [...mockCourses];
    if (params?.q) {
      const q = params.q.toLowerCase();
      items = items.filter((c) => c.title.toLowerCase().includes(q) || c.shortDescription.toLowerCase().includes(q));
    }
    if (params?.category) {
      items = items.filter((c) => c.categoryTags?.includes(params.category!));
    }
    if (params?.level) {
      items = items.filter((c) => c.level === params.level);
    }
    return {
      data: items,
      meta: { page: 1, perPage: items.length, total: items.length, totalPages: 1 },
    };
  },
  async bySlug(slug) {
    await mockDelay();
    const course = mockCourses.find((c) => c.slug === slug);
    if (!course) throw new ApiError({ code: "NOT_FOUND", message: "Curso não encontrado." });
    const instructor = mockInstructors.find((i) => i.id === course.instructorId)!;
    const modules = mockModules
      .filter((m) => m.courseId === course.id)
      .sort((a, b) => a.position - b.position)
      .map((m) => ({ ...m, lessons: mockLessons.filter((l) => l.moduleId === m.id).sort((a, b) => a.position - b.position) }));
    return { data: { ...course, instructor, modules } };
  },
  async modules(courseId) {
    await mockDelay();
    const modules = mockModules
      .filter((m) => m.courseId === courseId)
      .map((m) => ({ ...m, lessons: mockLessons.filter((l) => l.moduleId === m.id) }));
    return { data: modules };
  },
  async create(input) {
    await mockDelay();
    const now = new Date().toISOString();
    const course: Course = {
      id: `c-${shortCode()}`,
      instructorId: input.instructorId ?? "i-01",
      title: input.title ?? "Novo curso",
      slug: input.slug ?? `novo-curso-${shortCode().toLowerCase()}`,
      shortDescription: input.shortDescription ?? "",
      description: input.description ?? "",
      level: input.level ?? "iniciante",
      modality: input.modality ?? "gravado",
      workloadMinutes: input.workloadMinutes ?? 60,
      priceCents: input.priceCents ?? 0,
      coverUrl: input.coverUrl ?? "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
      status: input.status ?? "draft",
      certificateType: input.certificateType ?? "conclusao",
      requiredProgressPercentage: input.requiredProgressPercentage ?? 80,
      minimumScorePercentage: input.minimumScorePercentage ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    mockCourses.push(course);
    return { data: course, message: "Curso criado (demonstrativo)." };
  },
  async update(id, input) {
    await mockDelay();
    const idx = mockCourses.findIndex((c) => c.id === id);
    if (idx < 0) throw new ApiError({ code: "NOT_FOUND", message: "Curso não encontrado." });
    mockCourses[idx] = { ...mockCourses[idx], ...input, updatedAt: new Date().toISOString() };
    return { data: mockCourses[idx], message: "Curso atualizado (demonstrativo)." };
  },
  async remove(id) {
    await mockDelay();
    const idx = mockCourses.findIndex((c) => c.id === id);
    if (idx >= 0) mockCourses.splice(idx, 1);
    return { data: null };
  },
};

/* ---------------- Lessons ---------------- */

export const mockLessonRepository: LessonRepository = {
  async byId(id) {
    await mockDelay(120);
    const lesson = mockLessons.find((l) => l.id === id);
    if (!lesson) throw new ApiError({ code: "NOT_FOUND", message: "Aula não encontrada." });
    return { data: lesson };
  },
};

/* ---------------- Enrollments ---------------- */

export const mockEnrollmentRepository: EnrollmentRepository = {
  async listForUser(userId) {
    await mockDelay();
    const list = loadEnrollments()
      .filter((e) => e.userId === userId)
      .map((e) => ({ ...e, course: mockCourses.find((c) => c.id === e.courseId)! }))
      .filter((e) => e.course);
    return { data: list, meta: { page: 1, perPage: list.length, total: list.length, totalPages: 1 } };
  },
  async enroll(userId, courseId) {
    await mockDelay();
    const list = loadEnrollments();
    const existing = list.find((e) => e.userId === userId && e.courseId === courseId);
    if (existing) return { data: existing, message: "Você já está matriculado neste curso." };
    const now = new Date().toISOString();
    const enrollment: Enrollment = {
      id: `e-${shortCode()}`,
      userId,
      courseId,
      status: "not_started",
      enrolledAt: now,
    };
    saveEnrollments([...list, enrollment]);
    return { data: enrollment, message: "Matrícula realizada (demonstrativo)." };
  },
  async byId(id) {
    await mockDelay(100);
    const e = loadEnrollments().find((x) => x.id === id);
    if (!e) throw new ApiError({ code: "NOT_FOUND", message: "Matrícula não encontrada." });
    return { data: e };
  },
};

/* ---------------- Progress ---------------- */

export const mockProgressRepository: ProgressRepository = {
  async forEnrollment(enrollmentId) {
    await mockDelay(120);
    return { data: loadProgress().filter((p) => p.enrollmentId === enrollmentId) };
  },
  async markLesson(enrollmentId, lessonId, completed) {
    await mockDelay(120);
    const list = loadProgress();
    const now = new Date().toISOString();
    const idx = list.findIndex((p) => p.enrollmentId === enrollmentId && p.lessonId === lessonId);
    let record: LessonProgress;
    if (idx >= 0) {
      record = {
        ...list[idx],
        completed,
        progressPercentage: completed ? 100 : 0,
        completedAt: completed ? now : undefined,
        updatedAt: now,
      };
      list[idx] = record;
    } else {
      record = {
        id: `lp-${shortCode()}`,
        enrollmentId,
        lessonId,
        progressPercentage: completed ? 100 : 0,
        completed,
        lastPositionSeconds: 0,
        startedAt: now,
        completedAt: completed ? now : undefined,
        updatedAt: now,
      };
      list.push(record);
    }
    saveProgress(list);

    // Atualiza status da matrícula
    const enrollments = loadEnrollments();
    const eIdx = enrollments.findIndex((e) => e.id === enrollmentId);
    if (eIdx >= 0) {
      const enrollment = enrollments[eIdx];
      const courseLessons = mockLessons.filter((l) => {
        const mod = mockModules.find((m) => m.id === l.moduleId);
        return mod?.courseId === enrollment.courseId;
      });
      const enrollmentProgress = list.filter((p) => p.enrollmentId === enrollmentId && p.completed);
      const allDone = enrollmentProgress.length >= courseLessons.length;
      enrollments[eIdx] = {
        ...enrollment,
        status: allDone ? "completed" : "in_progress",
        startedAt: enrollment.startedAt ?? now,
        completedAt: allDone ? now : enrollment.completedAt,
      };
      saveEnrollments(enrollments);
    }
    return { data: record };
  },
};

/* ---------------- Quiz ---------------- */

export const mockQuizRepository: QuizRepository = {
  async byCourse(courseId) {
    await mockDelay(150);
    return { data: mockQuizzes.find((q) => q.courseId === courseId) ?? null };
  },
  async submitAttempt(quizId, userId, enrollmentId, answers) {
    await mockDelay();
    const quiz = mockQuizzes.find((q) => q.id === quizId);
    if (!quiz) throw new ApiError({ code: "NOT_FOUND", message: "Quiz não encontrado." });
    let correct = 0;
    quiz.questions.forEach((q) => {
      const selected = answers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (selected && selected === correctOpt?.id) correct++;
    });
    const scorePercentage = Math.round((correct / quiz.questions.length) * 100);
    const attempt: QuizAttempt = {
      id: `qa-${shortCode()}`,
      quizId,
      userId,
      enrollmentId,
      scorePercentage,
      passed: scorePercentage >= quiz.minimumScorePercentage,
      finishedAt: new Date().toISOString(),
    };
    // Persiste última tentativa por quiz
    const key = `${STORAGE_KEYS.quiz}:${quizId}:${userId}`;
    storage.set(key, attempt);
    return { data: attempt };
  },
};

/* ---------------- Certificates ---------------- */

function attemptFor(quizId: string, userId: string): QuizAttempt | null {
  return storage.get<QuizAttempt | null>(`${STORAGE_KEYS.quiz}:${quizId}:${userId}`, null);
}

export const mockCertificateRepository: CertificateRepository = {
  async listForUser(userId) {
    await mockDelay();
    const list = loadCertificates()
      .filter((c) => c.userId === userId)
      .map((c) => ({ ...c, course: mockCourses.find((x) => x.id === c.courseId)! }))
      .filter((c) => c.course);
    return { data: list, meta: { page: 1, perPage: list.length, total: list.length, totalPages: 1 } };
  },
  async issue(enrollmentId, userId) {
    await mockDelay();
    const enrollment = loadEnrollments().find((e) => e.id === enrollmentId);
    if (!enrollment) throw new ApiError({ code: "NOT_FOUND", message: "Matrícula não encontrada." });
    const course = mockCourses.find((c) => c.id === enrollment.courseId);
    if (!course) throw new ApiError({ code: "NOT_FOUND", message: "Curso não encontrado." });

    // Verificações
    const courseLessons = mockLessons.filter((l) => {
      const mod = mockModules.find((m) => m.id === l.moduleId);
      return mod?.courseId === course.id;
    });
    const done = loadProgress().filter((p) => p.enrollmentId === enrollmentId && p.completed).length;
    const percentage = courseLessons.length > 0 ? (done / courseLessons.length) * 100 : 0;
    if (percentage < course.requiredProgressPercentage) {
      throw new ApiError({
        code: "INSUFFICIENT_PROGRESS",
        message: `Você precisa concluir ao menos ${course.requiredProgressPercentage}% do curso.`,
      });
    }
    if (course.certificateType === "aproveitamento") {
      const quiz = mockQuizzes.find((q) => q.courseId === course.id);
      if (quiz) {
        const attempt = attemptFor(quiz.id, userId);
        if (!attempt) {
          throw new ApiError({ code: "QUIZ_NOT_TAKEN", message: "Realize a avaliação antes de emitir o certificado." });
        }
        if (attempt.scorePercentage < course.minimumScorePercentage) {
          throw new ApiError({
            code: "INSUFFICIENT_SCORE",
            message: `Sua nota (${attempt.scorePercentage}%) é menor que o mínimo exigido (${course.minimumScorePercentage}%).`,
          });
        }
      }
    }

    const list = loadCertificates();
    const existing = list.find((c) => c.enrollmentId === enrollmentId && c.status === "issued");
    if (existing) return { data: existing, message: "Certificado já emitido." };

    const code = `NRY-${shortCode()}`;
    const now = new Date().toISOString();
    const cert: Certificate = {
      id: `cert-${shortCode()}`,
      userId,
      courseId: course.id,
      enrollmentId,
      certificateCode: code,
      certificateType: course.certificateType,
      workloadMinutes: course.workloadMinutes,
      issueDate: now,
      completionDate: enrollment.completedAt ?? now,
      status: "issued",
      verificationUrl: `/certificados/validar/${code}`,
    };
    saveCertificates([...list, cert]);
    return { data: cert, message: "Certificado demonstrativo emitido." };
  },
  async verifyByCode(code) {
    await mockDelay(300);
    const cert = loadCertificates().find((c) => c.certificateCode === code);
    if (!cert) return { data: null };
    const course = mockCourses.find((c) => c.id === cert.courseId)!;
    const user = loadUsers().find((u) => u.id === cert.userId)!;
    return { data: { ...cert, course, user } };
  },
  async listAll() {
    await mockDelay();
    const list = loadCertificates().map((c) => ({
      ...c,
      course: mockCourses.find((x) => x.id === c.courseId)!,
      user: loadUsers().find((u) => u.id === c.userId)!,
    }));
    return { data: list, meta: { page: 1, perPage: list.length, total: list.length, totalPages: 1 } };
  },
  async revoke(id, reason) {
    await mockDelay();
    const list = loadCertificates();
    const idx = list.findIndex((c) => c.id === id);
    if (idx < 0) throw new ApiError({ code: "NOT_FOUND", message: "Certificado não encontrado." });
    list[idx] = { ...list[idx], status: "revoked", revokedAt: new Date().toISOString(), revocationReason: reason };
    saveCertificates(list);
    return { data: list[idx], message: "Certificado revogado." };
  },
  async byId(id, userId) {
    await mockDelay(150);
    const cert = loadCertificates().find((c) => c.id === id && c.userId === userId);
    if (!cert) throw new ApiError({ code: "NOT_FOUND", message: "Certificado não encontrado." });
    const course = mockCourses.find((c) => c.id === cert.courseId)!;
    const user = loadUsers().find((u) => u.id === cert.userId)!;
    return { data: { ...cert, course, user } };
  },
};

/* ---------------- Plans / Subscriptions ---------------- */

export const mockPlanRepository: PlanRepository = {
  async list() {
    await mockDelay(150);
    return { data: mockPlans, meta: { page: 1, perPage: mockPlans.length, total: mockPlans.length, totalPages: 1 } };
  },
  async byId(id) {
    await mockDelay(80);
    const plan = mockPlans.find((p) => p.id === id);
    if (!plan) throw new ApiError({ code: "NOT_FOUND", message: "Plano não encontrado." });
    return { data: plan };
  },
};

export const mockSubscriptionRepository: SubscriptionRepository = {
  async current(userId) {
    await mockDelay(120);
    const sub = storage.get<Subscription | null>(`${STORAGE_KEYS.plan}:${userId}`, null);
    if (!sub) return { data: null };
    const plan = mockPlans.find((p) => p.id === sub.planId);
    if (!plan) return { data: null };
    return { data: { ...sub, plan } };
  },
  async subscribe(userId, planId, cycle) {
    await mockDelay();
    const now = new Date();
    const renewal = new Date(now);
    if (cycle === "monthly") renewal.setMonth(renewal.getMonth() + 1);
    else renewal.setFullYear(renewal.getFullYear() + 1);
    const sub: Subscription = {
      id: `sub-${shortCode()}`,
      userId,
      planId,
      provider: "demo",
      status: "active",
      billingCycle: cycle,
      startedAt: now.toISOString(),
      renewalAt: renewal.toISOString(),
    };
    storage.set(`${STORAGE_KEYS.plan}:${userId}`, sub);
    return { data: sub, message: "Assinatura ativada (demonstrativo)." };
  },
  async cancel(userId) {
    await mockDelay();
    const sub = storage.get<Subscription | null>(`${STORAGE_KEYS.plan}:${userId}`, null);
    if (sub) {
      storage.set(`${STORAGE_KEYS.plan}:${userId}`, { ...sub, status: "canceled", canceledAt: new Date().toISOString() });
    }
    return { data: null, message: "Assinatura cancelada (demonstrativo)." };
  },
};

/* ---------------- Blog ---------------- */

export const mockBlogRepository: BlogRepository = {
  async list(params) {
    await mockDelay();
    let items = [...mockPosts];
    if (params?.category) {
      const cat = mockCategories.find((c) => c.slug === params.category);
      if (cat) items = items.filter((p) => p.categoryId === cat.id);
    }
    if (params?.q) {
      const q = params.q.toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(q));
    }
    const data = items.map((p) => ({
      ...p,
      category: mockCategories.find((c) => c.id === p.categoryId)!,
      author: mockUsers.find((u) => u.id === p.authorId)!,
    }));
    return { data, meta: { page: 1, perPage: data.length, total: data.length, totalPages: 1 } };
  },
  async bySlug(slug) {
    await mockDelay();
    const post = mockPosts.find((p) => p.slug === slug);
    if (!post) throw new ApiError({ code: "NOT_FOUND", message: "Post não encontrado." });
    return {
      data: {
        ...post,
        category: mockCategories.find((c) => c.id === post.categoryId)!,
        author: mockUsers.find((u) => u.id === post.authorId)!,
      },
    };
  },
  async categories() {
    await mockDelay(80);
    return { data: mockCategories };
  },
  async create(input) {
    await mockDelay();
    const now = new Date().toISOString();
    const post: Post = {
      id: `post-${shortCode()}`,
      authorId: input.authorId ?? "u-admin-01",
      categoryId: input.categoryId ?? "cat-01",
      title: input.title ?? "Novo post",
      slug: input.slug ?? `novo-post-${shortCode().toLowerCase()}`,
      excerpt: input.excerpt ?? "",
      content: input.content ?? "",
      coverUrl: input.coverUrl ?? "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
      status: input.status ?? "draft",
      publishedAt: now,
      readingMinutes: input.readingMinutes ?? 4,
    };
    mockPosts.unshift(post);
    return { data: post, message: "Post criado (demonstrativo)." };
  },
  async update(id, input) {
    await mockDelay();
    const idx = mockPosts.findIndex((p) => p.id === id);
    if (idx < 0) throw new ApiError({ code: "NOT_FOUND", message: "Post não encontrado." });
    mockPosts[idx] = { ...mockPosts[idx], ...input };
    return { data: mockPosts[idx], message: "Post atualizado (demonstrativo)." };
  },
  async remove(id) {
    await mockDelay();
    const idx = mockPosts.findIndex((p) => p.id === id);
    if (idx >= 0) mockPosts.splice(idx, 1);
    return { data: null };
  },
};

/* ---------------- Users / Admin ---------------- */

export const mockUserRepository: UserRepository = {
  async list() {
    await mockDelay();
    const list = loadUsers();
    return { data: list, meta: { page: 1, perPage: list.length, total: list.length, totalPages: 1 } };
  },
  async byId(id) {
    await mockDelay(80);
    const user = loadUsers().find((u) => u.id === id);
    if (!user) throw new ApiError({ code: "NOT_FOUND", message: "Usuário não encontrado." });
    return { data: user };
  },
};

export const mockAdminRepository: AdminRepository = {
  async dashboard() {
    await mockDelay();
    const enrollments = loadEnrollments();
    const users = loadUsers();
    const certs = loadCertificates();
    return {
      data: {
        studentsCount: users.filter((u) => u.role === "student").length,
        coursesCount: mockCourses.length,
        certificatesCount: certs.filter((c) => c.status === "issued").length,
        revenueCents: 1284000,
        recentEnrollments: enrollments.slice(-5).map((e) => ({
          ...e,
          user: users.find((u) => u.id === e.userId)!,
          course: mockCourses.find((c) => c.id === e.courseId)!,
        })),
      },
    };
  },
};
