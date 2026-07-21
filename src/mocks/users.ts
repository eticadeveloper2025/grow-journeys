import type { User, Instructor } from "@/types";

const NOW = "2026-01-15T10:00:00.000Z";

export const mockUsers: User[] = [
  {
    id: "u-aluno-01",
    fullName: "Marina Alves",
    email: "aluno@nerya.demo",
    role: "student",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "u-aluno-02",
    fullName: "Bruno Cardoso",
    email: "bruno@nerya.demo",
    role: "student",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=13",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "u-admin-01",
    fullName: "Camila Nogueira",
    email: "admin@nerya.demo",
    role: "admin",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "u-prof-01",
    fullName: "Ana Martins",
    email: "ana@nerya.demo",
    role: "instructor",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "u-prof-02",
    fullName: "Lucas Moraes",
    email: "lucas@nerya.demo",
    role: "instructor",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const mockInstructors: Instructor[] = [
  {
    id: "i-01",
    userId: "u-prof-01",
    displayName: "Ana Martins",
    bio: "Professora de inglês com foco em iniciantes e conversação. Especialista em ajudar alunos a perderem o medo de falar.",
    photoUrl: "https://i.pravatar.cc/300?img=32",
    status: "active",
  },
  {
    id: "i-02",
    userId: "u-prof-02",
    displayName: "Lucas Moraes",
    bio: "Professor de inglês com experiência em aulas para adultos, inglês para viagens, trabalho e pronúncia.",
    photoUrl: "https://i.pravatar.cc/300?img=33",
    status: "active",
  },
];

/** Credenciais demo — apenas para simulação. Nunca use em produção. */
export const MOCK_CREDENTIALS: Record<string, { userId: string; password: string }> = {
  "aluno@nerya.demo": { userId: "u-aluno-01", password: "demo123" },
  "bruno@nerya.demo": { userId: "u-aluno-02", password: "demo123" },
  "admin@nerya.demo": { userId: "u-admin-01", password: "admin123" },
};
