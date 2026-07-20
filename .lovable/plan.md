
# Nerya — Plataforma de Cursos (Etapa 1: Mock-First)

Aplicação frontend completa, sem backend real, preparada para futura API REST + PostgreSQL no Render. Tudo em português, tema escuro premium editorial, vídeos via YouTube embed.

## 1. Arquitetura em camadas

```text
src/
  components/         UI reutilizável (shadcn + componentes de domínio)
  routes/             Rotas TanStack (páginas)
  layouts/            Shells (público, aluno, admin)
  features/           Blocos de UI por domínio (courses, blog, checkout...)
  services/           Regras de aplicação (courseService, authService...)
  repositories/
    interfaces/       Contratos (AuthRepository, CourseRepository, ...)
    mock/             MockAuthRepository, MockCourseRepository, ...
    api/              ApiAuthRepository stubs (não conectam a nada ainda)
    index.ts          Fábrica que escolhe mock|api via VITE_DATA_SOURCE
  mocks/              users, courses, modules, lessons, enrollments,
                      progress, certificates, plans, posts, categories
  types/              Modelos de domínio + tipos de resposta (ApiResponse,
                      ApiListResponse, ApiError)
  hooks/              useAuth, useCourse, useProgress, useCertificate...
  utils/              mockDelay, maybeMockError, slugify, formatters,
                      mapping DTO↔modelo (snake_case ↔ camelCase)
  config/             env.ts (leitura tipada de import.meta.env)
  lib/                storageService (única porta para localStorage)
```

Componentes **nunca** importam mocks ou localStorage diretamente — passam por services → repositories.

## 2. Configuração de ambiente

Arquivo `.env.example`:

```text
VITE_APP_NAME=Nerya
VITE_APP_ENV=development
VITE_DATA_SOURCE=mock
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MOCK_ERRORS=false
```

`src/config/env.ts` valida e expõe tipado. Fábrica de repositories lê `VITE_DATA_SOURCE`; `mock` = MockRepository, `api` = ApiRepository (stubs que lançam "não implementado").

## 3. Dados mockados (src/mocks/)

IDs UUID fixos (constantes), relacionamentos consistentes:
- 2 alunos + 1 admin + 2 professores
- 6 cursos (níveis e cargas variadas), 3+ módulos por curso, 20+ aulas totais (com YouTube URLs públicas de amostra)
- 3 planos (Free, Pro mensal/anual, Premium) com `plan_features`
- 8 posts + 4 categorias
- Matrículas em estados: `not_started`, `in_progress`, `completed`, `expired`
- Progresso parcial em algumas aulas
- 2 certificados emitidos, 1 bloqueado por progresso, 1 bloqueado por nota
- Quiz de exemplo em 2 cursos

## 4. Persistência local

`storageService` centraliza namespaces:
`nerya:session`, `nerya:progress`, `nerya:favorites:courses`, `nerya:favorites:posts`, `nerya:enrollments`, `nerya:certificates`, `nerya:prefs`, `nerya:quiz`, `nerya:plan`.

Se vazio → restaura a partir dos mocks. Botão "Restaurar dados de demonstração" no admin limpa e recarrega.

## 5. Autenticação demo

Contas: `aluno@nerya.demo / demo123` e `admin@nerya.demo / admin123`.
Fluxos simulados: login, logout, recuperar senha (sempre "e-mail enviado"), reset. `authService` grava sessão em `nerya:session`.

**Route guards** em TanStack Router usando layouts pathless:
- `src/routes/_aluno.tsx` — exige sessão de aluno; `beforeLoad` redireciona para `/entrar?redirect=...`
- `src/routes/_admin.tsx` — exige role admin; redireciona para `/` se não-admin

Comentário em cada guard: "Validação real deve ocorrer no backend — este guard é apenas UX."

## 6. Simulação de API assíncrona

`utils/mockDelay.ts` — `await mockDelay(300..600)`. `utils/maybeMockError.ts` — se `VITE_ENABLE_MOCK_ERRORS=true`, injeta falha ~15% para testar estados de erro/retry. Todos os services devolvem `ApiResponse<T>` / `ApiListResponse<T>` / `ApiError` no mesmo formato da futura API.

## 7. Contratos da futura API

Cada MockRepository documenta no JSDoc o endpoint REST futuro correspondente (`POST /api/auth/login`, `GET /api/courses`, etc.), com o mesmo shape de request/response. Trocar `mock`→`api` no `.env` só requer implementar os `ApiRepository` stubs — nenhum componente muda.

## 8. Mapa de rotas (TanStack file-based)

Público (layout `PublicLayout` com header/footer):
- `/` — home
- `/cursos` — catálogo com filtros
- `/cursos/$slug` — detalhe do curso + CTA matricular
- `/conteudos` — blog
- `/conteudos/$slug` — post
- `/planos` — pricing (toggle mensal/anual)
- `/planos/checkout` — checkout demo (só nome/e-mail, sem cartão)
- `/planos/sucesso` — confirmação demo
- `/sobre`, `/contato`
- `/entrar`, `/cadastrar`, `/recuperar-senha`, `/redefinir-senha`
- `/certificados/validar/$codigo` — validação pública demo

Área do aluno (`_aluno` layout com sidebar):
- `/aluno` — dashboard (cursos em andamento, próximos passos)
- `/aluno/cursos` — meus cursos
- `/aluno/cursos/$slug` — player + lista de aulas + progresso
- `/aluno/cursos/$slug/aulas/$lessonId` — player com YouTube iframe, marca concluída
- `/aluno/cursos/$slug/quiz` — quiz + resultado
- `/aluno/certificados` — lista e emissão
- `/aluno/certificados/$id` — visualização + download PDF demo
- `/aluno/favoritos`, `/aluno/perfil`, `/aluno/assinatura`

Área admin (`_admin` layout):
- `/admin` — dashboard com métricas mock
- `/admin/cursos`, `/admin/cursos/novo`, `/admin/cursos/$id/editar` (formulários funcionais salvam em localStorage)
- `/admin/aulas`, `/admin/matriculas`, `/admin/alunos`, `/admin/professores`
- `/admin/posts`, `/admin/posts/novo`, `/admin/posts/$id/editar`
- `/admin/planos`, `/admin/certificados` (com ação revogar)
- `/admin/configuracoes` — inclui "Restaurar dados de demonstração"

Cada rota tem `head()` com título/description próprios.

## 9. Certificado demo

Fluxo:
1. `certificateService.canIssue(enrollmentId)` checa `required_progress_percentage` e `minimum_score_percentage`.
2. Se ok, emite certificado com `certificate_code` (UUID curto) e persiste em `nerya:certificates`.
3. Página de visualização renderiza o layout do certificado em HTML/CSS com o selo **"Certificado demonstrativo"** bem visível.
4. Download PDF via `html2canvas` + `jspdf` (client-side, apenas demonstrativo).
5. Página `/certificados/validar/$codigo` procura no store local e exibe status; nota que futuramente consultará `GET /api/certificates/:code/verify`.

## 10. Planos e checkout demo

- `/planos`: toggle mensal/anual, destaque no plano recomendado, features do `plan_features`.
- Cupom demo: `NERYA20` aplica -20% visualmente.
- Checkout pede apenas nome e e-mail (nunca cartão/CVV/CPF).
- Banner persistente: **"Ambiente demonstrativo — nenhum pagamento será realizado."**
- Simula ativação de assinatura em `nerya:plan`; histórico de cobrança fictício em `/aluno/assinatura`.
- Ações cancelar/alterar plano funcionam localmente.

## 11. Deploy no Render (Static Site)

Cria `README.md` com:
- `npm install && npm run build` como build command, `dist` como publish directory
- Lista de variáveis `VITE_*`
- Instruções de deploy Render + nota sobre futura separação em Frontend Static / Backend Web Service / PostgreSQL

Como o projeto usa TanStack Start, o build já resolve deep links (rotas `/cursos`, `/aluno`, `/admin`, `/certificados/validar/:codigo` funcionam ao recarregar sem 404). Reforço no README para não adicionar `_redirects` manualmente.

## 12. Identidade visual (Escuro Premium)

- Base neutra escura (background ~ oklch(0.14 0.02 260)), superfícies em camadas
- Acento único quente/dourado para CTAs e marcações premium
- Tipografia: serifa moderna para títulos (ex: Instrument Serif) + sans neutra para corpo (Work Sans) — carregada via `<link>` no `__root.tsx`
- Cantos discretos (radius 0.5rem), sombras suaves com glow do acento
- Todos os tokens em `src/styles.css` (oklch); nenhuma cor hardcoded nos componentes
- Micro-animações contidas (fade/slide) — sem efeitos genéricos exagerados

## 13. Estados de UI obrigatórios

Toda listagem/detalhe cobre: **loading (skeleton)**, **vazio**, **erro com retry**, **sucesso**. Botões sem ação real exibem toast "Funcionalidade demonstrativa".

## 14. Detalhes técnicos

- `head()` do `__root.tsx` atualizado: título "Nerya — Plataforma de Cursos", description e OG apropriados
- `src/routes/index.tsx` substitui o placeholder pela home real
- shadcn/ui usado para primitives (button, card, dialog, tabs, form, toast, sidebar)
- Sidebar collapsible nas áreas aluno/admin (padrão shadcn)
- Player: `<iframe>` YouTube com aspect-ratio + marca "aula concluída" ao clicar
- Bibliotecas novas: `html2canvas`, `jspdf` (para PDF demo), `date-fns` (formatação pt-BR), `zod` (validação de forms)
- Formulários com `react-hook-form` + `zod`
- Query cache com TanStack Query (já presente); services chamados via `useQuery`/`useMutation`

## 15. Fora do escopo desta etapa

Sem Supabase/Firebase/Lovable Cloud, sem backend real, sem pagamento real, sem envio de e-mails, sem upload em servidor, sem emissão oficial de certificado, sem edge functions.

## Entregável

Ao aprovar, implemento tudo isso em uma sequência de edições em lote: types → mocks → storage/services/repositories → layouts e guards → rotas públicas → área do aluno (incluindo player e certificado) → área admin → README/.env.example → tema escuro premium aplicado.
