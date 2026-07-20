import type { Post } from "@/types";

const NOW = "2026-01-10T10:00:00.000Z";

const LOREM = `A construção de produtos digitais evoluiu de decisões isoladas para uma disciplina colaborativa que integra pesquisa, design, engenharia e negócios. Neste conteúdo exploramos práticas que times de alta performance usam para reduzir retrabalho e aumentar previsibilidade.

Desde a definição de métricas de sucesso até a instrumentação de eventos e a análise contínua, cada etapa oferece oportunidades de aprendizado. O segredo está em criar ciclos curtos: hipótese, experimento, medição, decisão.

Boas equipes não terceirizam a escuta do usuário. Elas incorporam pesquisa qualitativa e quantitativa ao ritmo do desenvolvimento, transformando insights em melhorias tangíveis nos produtos.`;

function mkPost(overrides: Partial<Post> & { id: string; title: string; slug: string; categoryId: string; coverUrl: string }): Post {
  return {
    authorId: "u-prof-01",
    excerpt: LOREM.slice(0, 160) + "…",
    content: LOREM,
    status: "published",
    publishedAt: NOW,
    readingMinutes: 6,
    ...overrides,
  };
}

export const mockPosts: Post[] = [
  mkPost({
    id: "post-01",
    title: "Como estruturar um design system escalável",
    slug: "design-system-escalavel",
    categoryId: "cat-01",
    coverUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80",
  }),
  mkPost({
    id: "post-02",
    title: "TypeScript: 7 padrões que todo time deveria conhecer",
    slug: "typescript-7-padroes",
    categoryId: "cat-02",
    coverUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&q=80",
  }),
  mkPost({
    id: "post-03",
    title: "Pesquisa qualitativa em ciclos curtos",
    slug: "pesquisa-qualitativa",
    categoryId: "cat-03",
    coverUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
  }),
  mkPost({
    id: "post-04",
    title: "Do sênior ao líder técnico",
    slug: "do-senior-ao-lider",
    categoryId: "cat-04",
    coverUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
  }),
  mkPost({
    id: "post-05",
    title: "Arquiteturas frontend em 2026",
    slug: "arquiteturas-frontend-2026",
    categoryId: "cat-02",
    coverUrl: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=1200&q=80",
  }),
  mkPost({
    id: "post-06",
    title: "Métricas que importam para produtos digitais",
    slug: "metricas-produto",
    categoryId: "cat-03",
    coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  }),
  mkPost({
    id: "post-07",
    title: "Tokens de design: teoria e prática",
    slug: "tokens-de-design",
    categoryId: "cat-01",
    coverUrl: "https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=1200&q=80",
  }),
  mkPost({
    id: "post-08",
    title: "Feedback contínuo em times remotos",
    slug: "feedback-remotos",
    categoryId: "cat-04",
    coverUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  }),
];
