# Nerya — Plataforma de Cursos (versão demonstrativa)

Frontend mock-first construído com **TanStack Start + React 19 + Tailwind v4 + shadcn/ui**.
Todos os dados vêm de mocks locais; a arquitetura de repositórios está pronta para trocar por uma API REST + PostgreSQL sem reescrever componentes.

## Executar localmente

```bash
npm install
npm run dev    # http://localhost:8080
npm run build  # gera dist/ para produção
```

## Credenciais demonstrativas

| Papel | E-mail | Senha |
|-------|--------|-------|
| Aluno | `aluno@nerya.demo` | `demo123` |
| Aluno | `bruno@nerya.demo` | `demo123` |
| Admin | `admin@nerya.demo` | `admin123` |

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste conforme necessário.

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_APP_NAME` | Nome público do app | `Nerya` |
| `VITE_APP_ENV` | Ambiente (`development` / `production`) | `development` |
| `VITE_DATA_SOURCE` | `mock` (dados locais) ou `api` (futuro) | `mock` |
| `VITE_API_BASE_URL` | URL base da API real (uso futuro) | `http://localhost:3000/api` |
| `VITE_ENABLE_MOCK_ERRORS` | Injeta falhas simuladas para testar erro/retry | `false` |

Nunca coloque segredos (`DATABASE_URL`, `JWT_SECRET`, chaves de pagamento) em variáveis `VITE_*` — elas são embutidas no bundle público.

## Arquitetura

```
src/
  components/      UI reutilizável (shadcn + domínio)
  routes/          Rotas file-based (TanStack Router)
  layouts/         Layouts públicos, aluno, admin
  services/        Regras de aplicação
  repositories/
    interfaces.ts  Contratos
    mock/          Implementações locais (padrão)
    api/           Stubs para API REST futura
    index.ts       Fábrica escolhida por VITE_DATA_SOURCE
  mocks/           Base de dados fictícia
  types/           Modelos de domínio + tipos de resposta
  hooks/           useAuth etc.
  utils/           mockDelay, format, etc.
  config/env.ts    Leitura tipada de variáveis
  lib/storage.ts   Camada única sobre localStorage
```

Nenhum componente acessa `localStorage` ou os mocks diretamente — sempre passa por `services/repositories`.

## Deploy no Render (Static Site)

- **Build command**: `npm install && npm run build`
- **Publish directory**: `dist`
- **Redirects**: TanStack Start já resolve rotas profundas — não é necessário criar `_redirects` manualmente.

Configure as variáveis `VITE_*` no painel do Render antes do build.

## Fluxo demonstrativo

- **Cursos**: catálogo, detalhe, matrícula, player YouTube, marcar aula, quiz.
- **Certificados**: emissão local com verificação de progresso/nota, PDF client-side, página pública de validação em `/certificados/validar/:codigo`.
- **Planos**: pricing com toggle mensal/anual, cupom `NERYA20` (-20%), checkout sem dados de cartão, ativação/cancelamento local.
- **Blog**: listagem, filtros por categoria, post detalhado.
- **Área do aluno**: dashboard, meus cursos, certificados, favoritos, assinatura, perfil.

## Arquitetura futura

```
Frontend (Render Static Site)
    → API HTTPS (Render Web Service)
        → PostgreSQL (Render)
```

Contratos REST previstos estão documentados no JSDoc de cada `MockRepository`
em `src/repositories/mock/index.ts`. Para migrar:

1. Implementar métodos em `src/repositories/api/index.ts`.
2. Definir `VITE_DATA_SOURCE=api` e `VITE_API_BASE_URL=https://sua-api.com/api`.
3. Nenhum componente precisa ser alterado.

## Fora do escopo desta etapa

Sem backend real, sem banco de dados, sem autenticação de terceiros, sem pagamentos reais, sem envio de e-mails, sem emissão oficial de certificados, sem edge functions. Todos os fluxos indicados com **Ambiente demonstrativo** são simulações locais.
