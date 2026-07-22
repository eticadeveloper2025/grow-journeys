# Nerya — Guia do Projeto

Documento de referência para futuras alterações na plataforma **Nerya — escola de inglês online**. Leia antes de mexer em qualquer código.

> **Posicionamento da marca**: *"Inglês que conecta. Fluência que transforma."*
> **Logo**: sempre em minúsculas — `nerya.`
> **Nicho**: exclusivamente ensino de **inglês** (viagens, conversação, trabalho, pronúncia). Nunca reintroduzir cursos de tecnologia/design.

---

## 1. Stack técnica

| Camada | Tecnologia |
|--------|------------|
| Framework | **TanStack Start v1** (React 19 + Vite 7, SSR/SSG capaz) |
| Roteamento | **TanStack Router** file-based (`src/routes/`) |
| Estilo | **Tailwind CSS v4** via `src/styles.css` (tokens `@theme`) |
| UI Kit | **shadcn/ui** (Radix + variantes) em `src/components/ui/` |
| Estado servidor | **TanStack Query** (`QueryClient` em `src/router.tsx`) |
| Formulários | `react-hook-form` + `zod` |
| PDF de certificado | `html2canvas` + `jspdf` (client-side) |
| Datas / formatação | `date-fns` (locale pt-BR) |

**Não usar**: Supabase, Lovable Cloud, Firebase, banco real, Edge Functions, pagamentos reais, envio de e-mail real. O projeto é **mock-first** até integração futura com API própria + PostgreSQL no Render.

---

## 2. Arquitetura Mock-First

Regra de ouro: **componentes nunca importam mocks ou `localStorage` diretamente**. O fluxo é sempre:

```
UI (componentes / rotas)
  → hooks (useAuth, etc.)
    → services / repositories (interfaces)
      → mock  (padrão, src/repositories/mock)
      → api   (stubs futuros, src/repositories/api)
        → src/mocks/*  ou  fetch(VITE_API_BASE_URL)
```

### Estrutura de pastas

```
src/
  components/       Componentes reutilizáveis (UI + domínio)
    ui/             Primitives shadcn — NÃO renomear/mover
  routes/           Rotas file-based TanStack (ver §5)
  layouts/          PublicLayout, AlunoLayout (shells)
  mocks/            Base de dados fictícia (users, courses, plans, posts, enrollments)
  repositories/
    interfaces.ts   Contratos (AuthRepository, CourseRepository, ...)
    mock/           Implementação padrão consumindo src/mocks/
    api/            Stubs REST futuros (não implementados ainda)
    index.ts        Fábrica lê VITE_DATA_SOURCE (mock|api)
  hooks/            useAuth e outros hooks de aplicação
  lib/              storage.ts (única porta para localStorage), utils
  utils/            mockDelay, format, mapping
  types/            Modelos de domínio + ApiResponse/ApiListResponse
  config/           env.ts — leitura tipada de import.meta.env
  styles.css        Tokens do design system (Tailwind v4)
```

---

## 3. Design System (Escuro Editorial)

Todos os tokens vivem em `src/styles.css` sob `@theme`. **Nunca hardcode cores** (`bg-white`, `text-[#123]`) nos componentes — sempre semântico (`bg-background`, `text-primary`).

- Paleta principal: azul-marinho profundo, azul acinzentado (`#536184`), lilás, coral, amarelo pontual, papel quente.
- Tipografia:
  - **Display** (títulos): `Anton` / `Archivo Black` (condensada) → classe `font-display`.
  - **UI/Body**: `Inter` / `Manrope`.
  - Fontes carregadas via `<link>` em `src/routes/__root.tsx` (nunca `@import` remoto no CSS).
- Cantos discretos, sombras suaves, micro-animações (150–300ms, easing suave).
- Respeitar `prefers-reduced-motion` em qualquer animação nova.

---

## 4. Persistência local

Toda gravação em `localStorage` passa por `src/lib/storage.ts` com chaves centralizadas em `STORAGE_KEYS`:

```
nerya:session         → sessão do usuário logado
nerya:progress        → progresso por aula
nerya:enrollments     → matrículas
nerya:certificates    → certificados emitidos
nerya:favorites:*     → favoritos (cursos/posts)
nerya:plan            → plano ativo
nerya:prefs           → preferências
nerya:quiz            → tentativas de quiz
```

**Nunca** ler/escrever `localStorage` fora de `storage.ts`. Leitura de estado de UI deve ocorrer em `useEffect` (SSR-safe).

---

## 5. Rotas (TanStack file-based)

Convenção **flat com pontos**, não pastas aninhadas. `routeTree.gen.ts` é auto-gerado — **não editar à mão**.

### Público (`PublicLayout`)
`/` `/cursos` `/cursos/$slug` `/conteudos` `/conteudos/$slug` `/planos` `/planos/checkout` `/planos/sucesso` `/sobre` `/contato` `/entrar` `/cadastrar` `/recuperar-senha` `/redefinir-senha` `/certificados/validar/$codigo`

### Aluno (`_aluno` layout com guard)
`/aluno` `/aluno/cursos` `/aluno/cursos/$slug` `/aluno/cursos/$slug/aulas/$lessonId` `/aluno/cursos/$slug/quiz` `/aluno/certificados` `/aluno/certificados/$id` `/aluno/favoritos` `/aluno/perfil` `/aluno/assinatura`

### Guards
`src/routes/_aluno.tsx` faz `beforeLoad` checando `nerya:session`; se ausente, redireciona para `/entrar`. Comentário obrigatório: *"Validação real deve ocorrer no backend — este guard é apenas UX."*

### Regras obrigatórias
- Cada rota tem `head()` com **título e description únicos** (nunca reutilizar da home).
- Rota com hero/capa: incluir `og:image` + `twitter:image` com URL absoluta.
- Novo `<Link to="...">` só depois de criar o arquivo da rota — build type-checa.
- Nunca usar `src/pages/`, nunca `react-router-dom`.

---

## 6. Autenticação demo

| Papel | E-mail | Senha |
|-------|--------|-------|
| Aluno | `aluno@nerya.demo` | `demo123` |
| Aluno | `bruno@nerya.demo` | `demo123` |
| Admin | `admin@nerya.demo` | `admin123` |

Fluxos (login, logout, recuperar, redefinir) simulados em `mockAuthRepository`. Toasts genéricos de "e-mail enviado" — nunca prometer envio real.

---

## 7. Variáveis de ambiente

Copiar `.env.example` para `.env.local`:

| Variável | Default | Papel |
|----------|---------|-------|
| `VITE_APP_NAME` | `Nerya` | Nome público |
| `VITE_APP_ENV` | `development` | Ambiente |
| `VITE_DATA_SOURCE` | `mock` | `mock` ou `api` (troca a fábrica) |
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Base da API futura |
| `VITE_ENABLE_MOCK_ERRORS` | `false` | Injeta ~15% de falhas para testar retry |

**Nunca** colocar segredos em `VITE_*` (vão para o bundle público).

---

## 8. Simulação de API

- `utils/mockDelay.ts`: `await mockDelay(300..600)` antes de cada resposta.
- `utils/maybeMockError.ts`: se `VITE_ENABLE_MOCK_ERRORS=true`, falha aleatória para testar UI.
- Formato de resposta (bater com API futura):
  ```ts
  ApiResponse<T>     = { data: T; message?: string }
  ApiListResponse<T> = { data: T[]; meta: { total, page, pageSize } }
  ApiError           = { error: { code, message, details? } }
  ```
- Todo `MockRepository` documenta no JSDoc o endpoint REST correspondente (`POST /api/auth/login`, etc.).

---

## 9. Estados de UI obrigatórios

Toda listagem/detalhe cobre: **loading (skeleton)**, **vazio**, **erro com retry**, **sucesso**. Componentes prontos em `src/components/States.tsx`. Botões sem ação real → toast *"Funcionalidade demonstrativa"*.

---

## 10. Como adicionar coisas

### Novo curso de inglês
1. Editar `src/mocks/courses.ts` (id UUID fixo, slug, módulos, aulas com YouTube URL).
2. Se necessário, adicionar matrícula demo em `src/mocks/enrollments.ts`.
3. Nada mais — repositórios já leem daí.

### Novo campo no domínio
1. Atualizar type em `src/types/index.ts`.
2. Atualizar mocks.
3. Atualizar `interfaces.ts` se muda contrato.
4. Atualizar `mock/` e `api/` (stub) em `src/repositories/`.
5. Ajustar UI consumidora.

### Nova rota
1. Criar arquivo em `src/routes/` seguindo convenção flat (`area.sub.tsx`).
2. Definir `head()` único.
3. Nunca editar `routeTree.gen.ts`.

### Novo repositório
1. Adicionar interface em `src/repositories/interfaces.ts`.
2. Implementar em `mock/` (funcional) e `api/` (stub que lança "não implementado").
3. Registrar na fábrica `src/repositories/index.ts`.

---

## 11. Certificados demo

1. `certificateService.canIssue(enrollmentId)` valida `required_progress_percentage` e `minimum_score_percentage`.
2. Emite com `certificate_code` (UUID curto) em `nerya:certificates`.
3. Página renderiza selo **"Certificado demonstrativo"** visível.
4. PDF via `html2canvas` + `jspdf` (client-only).
5. `/certificados/validar/$codigo` procura no store local.

---

## 12. Planos e checkout demo

- Toggle mensal/anual em `/planos`.
- Cupom `NERYA20` → -20% visual.
- Checkout pede **apenas nome e e-mail**. Nunca cartão/CVV/CPF.
- Banner persistente: *"Ambiente demonstrativo — nenhum pagamento será realizado."*
- Ativação/cancelamento apenas em `nerya:plan`.

---

## 13. Deploy no Render (Static Site)

- Build command: `npm install && npm run build`
- Publish dir: `dist`
- Configurar todas as `VITE_*` no painel antes do build.
- TanStack Start resolve deep links — **não** criar `_redirects` manualmente.

### Arquitetura futura
```
Frontend (Render Static Site)
    → API HTTPS (Render Web Service)
        → PostgreSQL (Render)
```
Para migrar: implementar `src/repositories/api/*`, setar `VITE_DATA_SOURCE=api` e `VITE_API_BASE_URL`. Nenhum componente muda.

---

## 14. Checklist antes de commitar

- [ ] Nada em `src/pages/`, nada de `react-router-dom`.
- [ ] Sem cor hardcoded (`text-white`, `#hex`) — só tokens semânticos.
- [ ] Sem `localStorage.*` fora de `src/lib/storage.ts`.
- [ ] Sem menção a Supabase/Firebase/tecnologia genérica de cursos.
- [ ] Cursos, posts e planos permanecem sobre **inglês**.
- [ ] Toda rota nova tem `head()` único.
- [ ] Estados loading/vazio/erro cobertos.
- [ ] `prefers-reduced-motion` respeitado em animações novas.
- [ ] Logo escrita como `nerya.` (minúsculas).

---

## 15. Fora do escopo desta etapa

Sem backend real, sem banco, sem auth de terceiros, sem pagamento real, sem envio de e-mail, sem upload de arquivo em servidor, sem emissão oficial de certificado, sem Edge Functions. Todos os fluxos "Ambiente demonstrativo" são simulações locais.
