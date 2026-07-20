import type { Course, CourseModule, Lesson, Category } from "@/types";

const NOW = "2026-01-01T10:00:00.000Z";

export const mockCategories: Category[] = [
  { id: "cat-01", name: "Design", slug: "design" },
  { id: "cat-02", name: "Desenvolvimento", slug: "desenvolvimento" },
  { id: "cat-03", name: "Produto", slug: "produto" },
  { id: "cat-04", name: "Liderança", slug: "lideranca" },
];

export const mockCourses: Course[] = [
  {
    id: "c-01",
    instructorId: "i-01",
    title: "Fundamentos de Design de Produto",
    slug: "fundamentos-design-produto",
    shortDescription: "Do briefing à entrega: aprenda o processo completo de design de produtos digitais.",
    description:
      "Curso completo para quem quer entender como grandes produtos são desenhados. Cobrimos pesquisa, wireframes, protótipos, design systems e handoff com engenharia.",
    level: "iniciante",
    modality: "gravado",
    workloadMinutes: 480,
    priceCents: 29700,
    coverUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
    status: "published",
    certificateType: "aproveitamento",
    requiredProgressPercentage: 80,
    minimumScorePercentage: 70,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["design", "produto"],
  },
  {
    id: "c-02",
    instructorId: "i-02",
    title: "TypeScript Avançado na Prática",
    slug: "typescript-avancado",
    shortDescription: "Generics, inferência, template literals e patterns de tipagem em codebases reais.",
    description:
      "Domine os recursos mais poderosos do TypeScript com exemplos extraídos de projetos open source.",
    level: "avancado",
    modality: "gravado",
    workloadMinutes: 360,
    priceCents: 39700,
    coverUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80",
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 90,
    minimumScorePercentage: 0,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["desenvolvimento"],
  },
  {
    id: "c-03",
    instructorId: "i-01",
    title: "Design Systems do Zero",
    slug: "design-systems",
    shortDescription: "Construa um design system robusto usado por times multidisciplinares.",
    description: "Tokens, componentes, documentação, versionamento e governança de design systems.",
    level: "intermediario",
    modality: "hibrido",
    workloadMinutes: 600,
    priceCents: 49700,
    coverUrl: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=1200&q=80",
    status: "published",
    certificateType: "aproveitamento",
    requiredProgressPercentage: 85,
    minimumScorePercentage: 75,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["design"],
  },
  {
    id: "c-04",
    instructorId: "i-02",
    title: "Arquitetura Frontend Moderna",
    slug: "arquitetura-frontend",
    shortDescription: "SSR, ilhas, edge functions e as decisões que moldam apps de alta escala.",
    description:
      "Um panorama profundo das decisões arquiteturais em frontends modernos: monorepos, roteamento, cache e observabilidade.",
    level: "avancado",
    modality: "gravado",
    workloadMinutes: 540,
    priceCents: 59700,
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 80,
    minimumScorePercentage: 0,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["desenvolvimento"],
  },
  {
    id: "c-05",
    instructorId: "i-01",
    title: "Pesquisa com Usuários",
    slug: "pesquisa-com-usuarios",
    shortDescription: "Entrevistas, testes de usabilidade e análise qualitativa que geram decisões.",
    description: "Metodologia completa de pesquisa aplicada ao design de produtos.",
    level: "iniciante",
    modality: "gravado",
    workloadMinutes: 300,
    priceCents: 24700,
    coverUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 75,
    minimumScorePercentage: 0,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["produto"],
  },
  {
    id: "c-06",
    instructorId: "i-02",
    title: "Liderança Técnica",
    slug: "lideranca-tecnica",
    shortDescription: "Como evoluir de engenheiro sênior para líder técnico de times de alta performance.",
    description: "Comunicação, mentoria, roadmap técnico e resolução de conflitos em times de engenharia.",
    level: "intermediario",
    modality: "ao_vivo",
    workloadMinutes: 420,
    priceCents: 69700,
    coverUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 80,
    minimumScorePercentage: 0,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["lideranca"],
  },
];

// Módulos: 2 por curso
export const mockModules: CourseModule[] = mockCourses.flatMap((c, idx) => [
  {
    id: `m-${c.id}-1`,
    courseId: c.id,
    title: "Fundamentos",
    description: `Introdução aos conceitos essenciais do curso ${c.title}.`,
    position: 1,
  },
  {
    id: `m-${c.id}-2`,
    courseId: c.id,
    title: idx % 2 === 0 ? "Prática" : "Aprofundamento",
    description: "Aplicação prática dos conceitos com exercícios guiados.",
    position: 2,
  },
]);

// Aulas — 3-4 por módulo, ~20+ totais
const VIDEOS = [
  "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "https://www.youtube.com/embed/aqz-KE-bpKQ",
  "https://www.youtube.com/embed/9bZkp7q19f0",
  "https://www.youtube.com/embed/kJQP7kiw5Fk",
];

function makeLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  mockModules.forEach((mod) => {
    const count = 3;
    for (let i = 1; i <= count; i++) {
      const lid = `l-${mod.id}-${i}`;
      lessons.push({
        id: lid,
        moduleId: mod.id,
        title: `${mod.title} — Aula ${i}`,
        slug: `${mod.id}-aula-${i}`,
        description: "Conteúdo em vídeo com exercícios acompanhados.",
        contentType: "video",
        videoUrl: VIDEOS[(i + mod.position) % VIDEOS.length],
        durationMinutes: 15 + (i % 3) * 10,
        position: i,
        isRequired: true,
        isPreview: i === 1 && mod.position === 1,
        status: "active",
      });
    }
  });
  return lessons;
}

export const mockLessons: Lesson[] = makeLessons();
