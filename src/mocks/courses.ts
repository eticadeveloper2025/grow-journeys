import type { Course, CourseModule, Lesson, Category } from "@/types";

const NOW = "2026-01-01T10:00:00.000Z";

export const mockCategories: Category[] = [
  { id: "cat-01", name: "Conversação", slug: "conversacao" },
  { id: "cat-02", name: "Vocabulário", slug: "vocabulario" },
  { id: "cat-03", name: "Pronúncia", slug: "pronuncia" },
  { id: "cat-04", name: "Gramática", slug: "gramatica" },
  { id: "cat-05", name: "Cultura", slug: "cultura" },
  { id: "cat-06", name: "Viagens", slug: "viagens" },
  { id: "cat-07", name: "Trabalho", slug: "trabalho" },
  { id: "cat-08", name: "Curiosidades", slug: "curiosidades" },
];

// Capas coerentes com estudo de inglês: fones, cadernos, viagens, conversação
const COVERS = {
  beginner: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
  conversation: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=80",
  travel: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
  business: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
  pronunciation: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80",
  everyday: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  club: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&q=80",
  interview: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
};

export const mockCourses: Course[] = [
  {
    id: "c-01",
    instructorId: "i-01",
    title: "Inglês do Zero",
    slug: "ingles-do-zero",
    shortDescription: "Fundamentos do idioma para quem está começando agora.",
    description:
      "Do primeiro hello às primeiras frases completas. Alfabeto, números, verbo to be, saudações, apresentações e vocabulário essencial para dar os primeiros passos com confiança.",
    level: "iniciante",
    modality: "gravado",
    workloadMinutes: 480,
    priceCents: 0,
    coverUrl: COVERS.beginner,
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 80,
    minimumScorePercentage: 70,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["conversacao", "vocabulario"],
  },
  {
    id: "c-02",
    instructorId: "i-01",
    title: "Conversação sem Bloqueios",
    slug: "conversacao-sem-bloqueios",
    shortDescription: "Prática guiada para ganhar confiança ao falar inglês.",
    description:
      "Turmas ao vivo com foco em quebrar o bloqueio da fala. Técnicas para pensar em inglês, responder rápido e manter uma conversa sem travar.",
    level: "intermediario",
    modality: "ao_vivo",
    workloadMinutes: 360,
    priceCents: 14900,
    coverUrl: COVERS.conversation,
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 80,
    minimumScorePercentage: 0,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["conversacao"],
  },
  {
    id: "c-03",
    instructorId: "i-02",
    title: "Inglês para Viagens",
    slug: "ingles-para-viagens",
    shortDescription: "Situações reais em aeroporto, hotel, restaurante e passeios.",
    description:
      "Vocabulário e frases prontas para viajar sem medo: check-in, imigração, transporte, compras, pedir comida e resolver imprevistos no exterior.",
    level: "iniciante",
    modality: "gravado",
    workloadMinutes: 300,
    priceCents: 8900,
    coverUrl: COVERS.travel,
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 75,
    minimumScorePercentage: 0,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["viagens", "vocabulario"],
  },
  {
    id: "c-04",
    instructorId: "i-02",
    title: "Inglês para o Trabalho",
    slug: "ingles-para-o-trabalho",
    shortDescription: "Reuniões, apresentações, e-mails e vocabulário profissional.",
    description:
      "Comunicação profissional em inglês: e-mails claros, reuniões, small talk, negociações e vocabulário específico para diferentes áreas.",
    level: "intermediario",
    modality: "ao_vivo",
    workloadMinutes: 420,
    priceCents: 19700,
    coverUrl: COVERS.business,
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 85,
    minimumScorePercentage: 70,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["trabalho", "conversacao"],
  },
  {
    id: "c-05",
    instructorId: "i-02",
    title: "Pronúncia na Prática",
    slug: "pronuncia-na-pratica",
    shortDescription: "Sons, ritmo, entonação e correção de erros frequentes.",
    description:
      "Guia completo de pronúncia para brasileiros: sons difíceis, palavras confundidas, ritmo, entonação e como soar mais natural ao falar inglês.",
    level: "intermediario",
    modality: "gravado",
    workloadMinutes: 300,
    priceCents: 12900,
    coverUrl: COVERS.pronunciation,
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 80,
    minimumScorePercentage: 70,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["pronuncia"],
  },
  {
    id: "c-06",
    instructorId: "i-01",
    title: "Inglês Real: Expressões do Dia a Dia",
    slug: "ingles-real-expressoes",
    shortDescription: "Expressões usadas em conversas, filmes, séries e redes sociais.",
    description:
      "Aprenda o inglês que ninguém ensina na escola: gírias, expressões idiomáticas, phrasal verbs e o vocabulário que aparece em Netflix e redes sociais.",
    level: "intermediario",
    modality: "gravado",
    workloadMinutes: 360,
    priceCents: 9900,
    coverUrl: COVERS.everyday,
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 75,
    minimumScorePercentage: 60,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["vocabulario", "cultura"],
  },
  {
    id: "c-07",
    instructorId: "i-01",
    title: "Clube de Conversação Nerya",
    slug: "clube-de-conversacao",
    shortDescription: "Encontros semanais ao vivo para praticar inglês em grupo.",
    description:
      "Prática semanal em grupo com temas variados. Um espaço seguro para errar, aprender e ganhar fluência conversando com outros alunos e professora.",
    level: "intermediario",
    modality: "ao_vivo",
    workloadMinutes: 240,
    priceCents: 7900,
    coverUrl: COVERS.club,
    status: "published",
    certificateType: "conclusao",
    requiredProgressPercentage: 70,
    minimumScorePercentage: 0,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["conversacao"],
  },
  {
    id: "c-08",
    instructorId: "i-02",
    title: "Preparatório para Entrevistas em Inglês",
    slug: "entrevistas-em-ingles",
    shortDescription: "Respostas, vocabulário e simulações para entrevistas.",
    description:
      "Como responder às perguntas mais comuns, falar sobre você, apresentar experiências e passar segurança em entrevistas de emprego em inglês.",
    level: "avancado",
    modality: "ao_vivo",
    workloadMinutes: 300,
    priceCents: 24900,
    coverUrl: COVERS.interview,
    status: "published",
    certificateType: "aproveitamento",
    requiredProgressPercentage: 90,
    minimumScorePercentage: 75,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    categoryTags: ["trabalho", "conversacao"],
  },
];

// Módulos: 2 por curso, temas coerentes com inglês
const MODULE_TITLES: Record<string, [string, string]> = {
  "c-01": ["Primeiros Passos", "Frases Essenciais"],
  "c-02": ["Perdendo o Bloqueio", "Conversas Reais"],
  "c-03": ["No Aeroporto e Hotel", "Passeios e Imprevistos"],
  "c-04": ["Reuniões e E-mails", "Apresentações e Negociações"],
  "c-05": ["Sons e Ritmo", "Erros Frequentes"],
  "c-06": ["Expressões do Cotidiano", "Phrasal Verbs"],
  "c-07": ["Temas do Dia a Dia", "Cultura e Atualidades"],
  "c-08": ["Perguntas Clássicas", "Simulações"],
};

export const mockModules: CourseModule[] = mockCourses.flatMap((c) => {
  const titles = MODULE_TITLES[c.id] ?? ["Módulo 1", "Módulo 2"];
  return [
    {
      id: `m-${c.id}-1`,
      courseId: c.id,
      title: titles[0],
      description: `Base de ${c.title}.`,
      position: 1,
    },
    {
      id: `m-${c.id}-2`,
      courseId: c.id,
      title: titles[1],
      description: "Aplicação prática com exercícios guiados.",
      position: 2,
    },
  ];
});

// Aulas — títulos coerentes com inglês
const LESSON_TITLES: Record<string, string[]> = {
  "c-01": ["Alfabeto e sons", "Verbo to be", "Saudações e apresentações", "Números e horários", "Vocabulário do dia", "Primeiras frases"],
  "c-02": ["Como pensar em inglês", "Respondendo sem travar", "Small talk", "Mantendo a conversa", "Corrigindo-se com naturalidade", "Encerrando conversas"],
  "c-03": ["No check-in do aeroporto", "Passando pela imigração", "Hotel e reservas", "Pedindo comida", "Transporte e direções", "Compras e imprevistos"],
  "c-04": ["Vocabulário de e-mails", "Abrindo uma reunião", "Apresentando ideias", "Fazendo perguntas", "Negociando prazos", "Encerrando com clareza"],
  "c-05": ["Sons vogais difíceis", "Th, R e outras armadilhas", "Ritmo e entonação", "Palavras confundidas", "Word stress", "Naturalidade"],
  "c-06": ["Gírias comuns", "Expressões idiomáticas", "Phrasal verbs úteis", "Inglês em filmes", "Inglês em séries", "Inglês em redes sociais"],
  "c-07": ["Rotina e trabalho", "Viagens e planos", "Cultura pop", "Notícias e atualidades", "Comida e cultura", "Livre debate"],
  "c-08": ["Tell me about yourself", "Pontos fortes e fracos", "Falando de experiências", "Perguntas comportamentais", "Simulação — cargo júnior", "Simulação — cargo sênior"],
};

const VIDEOS = [
  "https://www.youtube.com/embed/juKd26qkNAw",
  "https://www.youtube.com/embed/ZUsdBtA__1Y",
  "https://www.youtube.com/embed/38xLFrIfIkE",
  "https://www.youtube.com/embed/l1jGeM4jOFs",
];

function makeLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  mockCourses.forEach((c) => {
    const titles = LESSON_TITLES[c.id] ?? [];
    [1, 2].forEach((modPos) => {
      const modId = `m-${c.id}-${modPos}`;
      const slice = titles.slice((modPos - 1) * 3, modPos * 3);
      slice.forEach((t, i) => {
        const pos = i + 1;
        const lid = `l-${modId}-${pos}`;
        lessons.push({
          id: lid,
          moduleId: modId,
          title: t,
          slug: `${modId}-aula-${pos}`,
          description: "Aula em vídeo com vocabulário, exemplos e exercícios.",
          contentType: "video",
          videoUrl: VIDEOS[(pos + modPos) % VIDEOS.length],
          durationMinutes: 15 + (pos % 3) * 10,
          position: pos,
          isRequired: true,
          isPreview: pos === 1 && modPos === 1,
          status: "active",
        });
      });
    });
  });
  return lessons;
}

export const mockLessons: Lesson[] = makeLessons();
