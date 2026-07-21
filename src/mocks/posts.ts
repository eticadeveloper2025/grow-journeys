import type { Post } from "@/types";

const NOW = "2026-01-10T10:00:00.000Z";

const LOREM = `Aprender inglês é muito mais do que decorar regras: é entrar em contato com uma outra forma de pensar, de conversar e de se relacionar com o mundo. Neste conteúdo, vamos explorar como pequenas descobertas sobre o idioma podem transformar a maneira como você estuda.

Cada palavra tem uma história. Muitas expressões que usamos hoje nasceram séculos atrás, em contextos completamente diferentes. Conhecer essa origem ajuda a memorizar naturalmente e a entender por que certas frases soam do jeito que soam.

O segredo para evoluir no inglês está em criar curiosidade genuína: assistir séries prestando atenção nas expressões, anotar palavras novas, praticar em situações reais e, principalmente, permitir-se errar. Errar é parte do processo — e cada erro é uma aula.`;

function mkPost(overrides: Partial<Post> & { id: string; title: string; slug: string; categoryId: string; coverUrl: string }): Post {
  return {
    authorId: "u-prof-01",
    excerpt: LOREM.slice(0, 160) + "…",
    content: LOREM,
    status: "published",
    publishedAt: NOW,
    readingMinutes: 5,
    ...overrides,
  };
}

export const mockPosts: Post[] = [
  mkPost({
    id: "post-01",
    title: "Você sabia que “goodbye” nasceu de uma oração?",
    slug: "goodbye-origem",
    categoryId: "cat-08",
    coverUrl: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=1200&q=80",
  }),
  mkPost({
    id: "post-02",
    title: "Por que “breakfast” significa quebrar o jejum?",
    slug: "breakfast-significado",
    categoryId: "cat-08",
    coverUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=80",
  }),
  mkPost({
    id: "post-03",
    title: "De onde vem a expressão “mayday”?",
    slug: "mayday-origem",
    categoryId: "cat-08",
    coverUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
  }),
  mkPost({
    id: "post-04",
    title: "Palavras em inglês que mudaram com o tempo",
    slug: "palavras-que-mudaram",
    categoryId: "cat-02",
    coverUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1200&q=80",
  }),
  mkPost({
    id: "post-05",
    title: "O inglês quase perdeu a palavra “you”?",
    slug: "historia-do-you",
    categoryId: "cat-08",
    coverUrl: "https://images.unsplash.com/photo-1522543558187-768b6df7c25c?w=1200&q=80",
  }),
  mkPost({
    id: "post-06",
    title: "Expressões que não devem ser traduzidas literalmente",
    slug: "expressoes-nao-literais",
    categoryId: "cat-02",
    coverUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
  }),
  mkPost({
    id: "post-07",
    title: "Como pedir comida em inglês sem travar",
    slug: "pedir-comida-em-ingles",
    categoryId: "cat-06",
    coverUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  }),
  mkPost({
    id: "post-08",
    title: "Diferença entre “say”, “tell” e “speak”",
    slug: "say-tell-speak",
    categoryId: "cat-04",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80",
  }),
  mkPost({
    id: "post-09",
    title: "Erros de pronúncia comuns entre brasileiros",
    slug: "erros-pronuncia-brasileiros",
    categoryId: "cat-03",
    coverUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80",
  }),
  mkPost({
    id: "post-10",
    title: "Frases essenciais para viajar",
    slug: "frases-para-viajar",
    categoryId: "cat-06",
    coverUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
  }),
  mkPost({
    id: "post-11",
    title: "Como pensar em inglês sem traduzir tudo",
    slug: "pensar-em-ingles",
    categoryId: "cat-01",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80",
  }),
  mkPost({
    id: "post-12",
    title: "Falsos cognatos que confundem brasileiros",
    slug: "falsos-cognatos",
    categoryId: "cat-02",
    coverUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80",
  }),
];
