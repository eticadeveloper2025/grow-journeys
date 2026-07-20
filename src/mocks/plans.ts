import type { Plan } from "@/types";

export const mockPlans: Plan[] = [
  {
    id: "p-free",
    name: "Explorar",
    slug: "explorar",
    description: "Comece sem custo e conheça a plataforma.",
    monthlyPriceCents: 0,
    yearlyPriceCents: 0,
    featured: false,
    status: "active",
    features: [
      { id: "pf-1", planId: "p-free", feature: "Acesso a cursos gratuitos", included: true, position: 1 },
      { id: "pf-2", planId: "p-free", feature: "Certificado demonstrativo", included: true, position: 2 },
      { id: "pf-3", planId: "p-free", feature: "Trilhas exclusivas", included: false, position: 3 },
      { id: "pf-4", planId: "p-free", feature: "Mentorias ao vivo", included: false, position: 4 },
    ],
  },
  {
    id: "p-pro",
    name: "Profissional",
    slug: "profissional",
    description: "Acesso completo à biblioteca de cursos e certificados oficiais.",
    monthlyPriceCents: 8900,
    yearlyPriceCents: 89000,
    featured: true,
    status: "active",
    features: [
      { id: "pf-5", planId: "p-pro", feature: "Todos os cursos publicados", included: true, position: 1 },
      { id: "pf-6", planId: "p-pro", feature: "Certificados oficiais", included: true, position: 2 },
      { id: "pf-7", planId: "p-pro", feature: "Trilhas exclusivas", included: true, position: 3 },
      { id: "pf-8", planId: "p-pro", feature: "Mentorias ao vivo mensais", included: false, position: 4 },
    ],
  },
  {
    id: "p-premium",
    name: "Premium",
    slug: "premium",
    description: "Tudo do Profissional, com mentorias ao vivo e suporte prioritário.",
    monthlyPriceCents: 14900,
    yearlyPriceCents: 149000,
    featured: false,
    status: "active",
    features: [
      { id: "pf-9", planId: "p-premium", feature: "Todos os cursos publicados", included: true, position: 1 },
      { id: "pf-10", planId: "p-premium", feature: "Certificados oficiais", included: true, position: 2 },
      { id: "pf-11", planId: "p-premium", feature: "Trilhas exclusivas", included: true, position: 3 },
      { id: "pf-12", planId: "p-premium", feature: "Mentorias ao vivo mensais", included: true, position: 4 },
      { id: "pf-13", planId: "p-premium", feature: "Suporte prioritário", included: true, position: 5 },
    ],
  },
];
