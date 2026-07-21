import type { Enrollment, LessonProgress, Certificate, Quiz } from "@/types";
import { mockLessons } from "./courses";

const NOW = "2026-01-15T10:00:00.000Z";

export const mockEnrollments: Enrollment[] = [
  {
    id: "e-01",
    userId: "u-aluno-01",
    courseId: "c-01",
    status: "in_progress",
    enrolledAt: "2026-01-05T10:00:00.000Z",
    startedAt: "2026-01-06T10:00:00.000Z",
  },
  {
    id: "e-02",
    userId: "u-aluno-01",
    courseId: "c-02",
    status: "completed",
    enrolledAt: "2025-11-01T10:00:00.000Z",
    startedAt: "2025-11-02T10:00:00.000Z",
    completedAt: "2025-12-15T10:00:00.000Z",
  },
  {
    id: "e-03",
    userId: "u-aluno-01",
    courseId: "c-03",
    status: "not_started",
    enrolledAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "e-04",
    userId: "u-aluno-01",
    courseId: "c-05",
    status: "in_progress",
    enrolledAt: "2025-12-20T10:00:00.000Z",
    startedAt: "2025-12-21T10:00:00.000Z",
  },
  {
    id: "e-05",
    userId: "u-aluno-01",
    courseId: "c-06",
    status: "completed",
    enrolledAt: "2025-10-01T10:00:00.000Z",
    startedAt: "2025-10-02T10:00:00.000Z",
    completedAt: "2025-11-30T10:00:00.000Z",
  },
];

// Progresso: c-01 parcial (~40%), c-02 completo (100%), c-05 baixo (~20%), c-06 completo mas nota baixa
function buildProgress(): LessonProgress[] {
  const out: LessonProgress[] = [];
  const mark = (enrollmentId: string, lessonIds: string[], completed: boolean) => {
    lessonIds.forEach((lessonId) => {
      out.push({
        id: `lp-${enrollmentId}-${lessonId}`,
        enrollmentId,
        lessonId,
        progressPercentage: completed ? 100 : 40,
        completed,
        lastPositionSeconds: completed ? 900 : 300,
        startedAt: NOW,
        completedAt: completed ? NOW : undefined,
        updatedAt: NOW,
      });
    });
  };

  const c01Lessons = mockLessons.filter((l) => l.moduleId.startsWith("m-c-01"));
  mark("e-01", c01Lessons.slice(0, 2).map((l) => l.id), true); // 2/6

  const c02Lessons = mockLessons.filter((l) => l.moduleId.startsWith("m-c-02"));
  mark("e-02", c02Lessons.map((l) => l.id), true); // 100%

  const c05Lessons = mockLessons.filter((l) => l.moduleId.startsWith("m-c-05"));
  mark("e-04", c05Lessons.slice(0, 1).map((l) => l.id), true);

  const c06Lessons = mockLessons.filter((l) => l.moduleId.startsWith("m-c-06"));
  mark("e-05", c06Lessons.map((l) => l.id), true);

  return out;
}

export const mockLessonProgress: LessonProgress[] = buildProgress();

/** Quizzes de exemplo — todos sobre inglês */
export const mockQuizzes: Quiz[] = [
  {
    id: "q-c-01",
    courseId: "c-01",
    title: "Avaliação — Inglês do Zero",
    minimumScorePercentage: 70,
    questions: [
      {
        id: "qq-1",
        quizId: "q-c-01",
        question: "Como você se apresenta em inglês?",
        position: 1,
        options: [
          { id: "qo-1a", questionId: "qq-1", optionText: "My name is Ana.", isCorrect: true, position: 1 },
          { id: "qo-1b", questionId: "qq-1", optionText: "I am name Ana.", isCorrect: false, position: 2 },
          { id: "qo-1c", questionId: "qq-1", optionText: "Me call Ana.", isCorrect: false, position: 3 },
        ],
      },
      {
        id: "qq-2",
        quizId: "q-c-01",
        question: "Qual é a tradução de “breakfast”?",
        position: 2,
        options: [
          { id: "qo-2a", questionId: "qq-2", optionText: "Almoço", isCorrect: false, position: 1 },
          { id: "qo-2b", questionId: "qq-2", optionText: "Café da manhã", isCorrect: true, position: 2 },
          { id: "qo-2c", questionId: "qq-2", optionText: "Jantar", isCorrect: false, position: 3 },
        ],
      },
      {
        id: "qq-3",
        quizId: "q-c-01",
        question: "Qual frase é usada para pedir informação de forma educada?",
        position: 3,
        options: [
          { id: "qo-3a", questionId: "qq-3", optionText: "Excuse me, could you help me?", isCorrect: true, position: 1 },
          { id: "qo-3b", questionId: "qq-3", optionText: "Hey, help now!", isCorrect: false, position: 2 },
          { id: "qo-3c", questionId: "qq-3", optionText: "You help me.", isCorrect: false, position: 3 },
        ],
      },
    ],
  },
  {
    id: "q-c-06",
    courseId: "c-06",
    title: "Avaliação — Expressões do Dia a Dia",
    minimumScorePercentage: 70,
    questions: [
      {
        id: "qq6-1",
        quizId: "q-c-06",
        question: "O que significa a expressão “to hit the books”?",
        position: 1,
        options: [
          { id: "qo6-1a", questionId: "qq6-1", optionText: "Estudar bastante", isCorrect: true, position: 1 },
          { id: "qo6-1b", questionId: "qq6-1", optionText: "Rasgar os livros", isCorrect: false, position: 2 },
        ],
      },
    ],
  },
];

/** Certificados iniciais:
 * - 2 emitidos (e-02 e um extra para outro aluno)
 * - 1 bloqueado por progresso (e-01)
 * - 1 bloqueado por nota (e-05 — completo mas quiz reprovado)
 */
export const mockCertificates: Certificate[] = [
  {
    id: "cert-01",
    userId: "u-aluno-01",
    courseId: "c-02",
    enrollmentId: "e-02",
    certificateCode: "NRY-A1B2C3D4",
    certificateType: "conclusao",
    workloadMinutes: 360,
    issueDate: "2025-12-16T10:00:00.000Z",
    completionDate: "2025-12-15T10:00:00.000Z",
    status: "issued",
    verificationUrl: "/certificados/validar/NRY-A1B2C3D4",
  },
  {
    id: "cert-02",
    userId: "u-aluno-02",
    courseId: "c-05",
    enrollmentId: "e-x-bruno",
    certificateCode: "NRY-E5F6G7H8",
    certificateType: "conclusao",
    workloadMinutes: 300,
    issueDate: "2025-11-10T10:00:00.000Z",
    completionDate: "2025-11-09T10:00:00.000Z",
    status: "issued",
    verificationUrl: "/certificados/validar/NRY-E5F6G7H8",
  },
];
