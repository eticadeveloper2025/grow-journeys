import type { User, Instructor } from "@/types";

const NOW = "2026-01-15T10:00:00.000Z";

export const mockUsers: User[] = [
  {
    id: "u-aluno-01",
    fullName: "Ana Ribeiro",
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
    fullName: "Marina Alves",
    email: "admin@nerya.demo",
    role: "admin",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "u-prof-01",
    fullName: "Ricardo Menezes",
    email: "ricardo@nerya.demo",
    role: "instructor",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "u-prof-02",
    fullName: "Helena Costa",
    email: "helena@nerya.demo",
    role: "instructor",
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const mockInstructors: Instructor[] = [
  {
    id: "i-01",
    userId: "u-prof-01",
    displayName: "Ricardo Menezes",
    bio: "Designer de produto com 15 anos de experiência em times de tecnologia. Ensina design systems e pesquisa aplicada.",
    photoUrl: "https://i.pravatar.cc/300?img=33",
    status: "active",
  },
  {
    id: "i-02",
    userId: "u-prof-02",
    displayName: "Helena Costa",
    bio: "Engenheira de software especializada em arquitetura frontend, autora de dois livros sobre TypeScript.",
    photoUrl: "https://i.pravatar.cc/300?img=32",
    status: "active",
  },
];

/** Credenciais demo — apenas para simulação. Nunca use em produção. */
export const MOCK_CREDENTIALS: Record<string, { userId: string; password: string }> = {
  "aluno@nerya.demo": { userId: "u-aluno-01", password: "demo123" },
  "bruno@nerya.demo": { userId: "u-aluno-02", password: "demo123" },
  "admin@nerya.demo": { userId: "u-admin-01", password: "admin123" },
};
