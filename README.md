# Nerya — Aulas particulares de inglês (versão demonstrativa)

Frontend mock-first construído com **TanStack Start + React 19 + Tailwind v4 + shadcn/ui**.
A Nerya é uma plataforma demonstrativa para um único professor de inglês: alunos contratam planos, consultam créditos, agendam aulas ao vivo e acompanham próximas aulas e histórico.

## Executar localmente

```bash
npm install
npm run dev    # http://localhost:8080
npm run build
npm run start  # produção, depois do build
```

## Credenciais demonstrativas

| Papel | E-mail             | Senha      |
| ----- | ------------------ | ---------- |
| Aluno | `aluno@nerya.demo` | `demo123`  |
| Aluno | `bruno@nerya.demo` | `demo123`  |
| Admin | `admin@nerya.demo` | `admin123` |

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste conforme necessário.

| Variável                      | Descrição                                       | Padrão                              |
| ----------------------------- | ----------------------------------------------- | ----------------------------------- |
| `VITE_APP_NAME`               | Nome público do app                             | `Nerya`                             |
| `VITE_APP_ENV`                | Ambiente (`development` / `production`)         | `development`                       |
| `VITE_DATA_SOURCE`            | `mock` (dados locais) ou `api` (futuro)         | `mock`                              |
| `VITE_LEADS_DATA_SOURCE`      | `mock` ou `api` apenas para leads públicos      | `mock`                              |
| `VITE_API_BASE_URL`           | URL base da API                                 | `/api`                              |
| `VITE_ENABLE_MOCK_ERRORS`     | Injeta falhas simuladas para testar erro/retry  | `false`                             |
| `VITE_PUBLIC_CONTACT_EMAIL`   | E-mail publico exibido no site                  | `guilherme...@gmail.com`            |
| `VITE_PUBLIC_WHATSAPP_NUMBER` | Numero publico para WhatsApp Web, com DDI e DDD | vazio                               |
| `RESEND_API_KEY`              | Chave secreta do Resend, somente servidor       | vazio                               |
| `RESEND_FROM_EMAIL`           | Remetente verificado do Resend                  | `Nerya <onboarding@resend.dev>`     |
| `RESEND_TO_EMAIL`             | Destinatario dos leads                          | `guilherme.augusto.nery1@gmail.com` |

Nunca coloque segredos (`DATABASE_URL`, `JWT_SECRET`, chaves de pagamento) em variáveis `VITE_*`.

## Arquitetura

```
src/
  components/      UI reutilizável
  routes/          Rotas file-based TanStack
  layouts/         Layouts público e aluno
  repositories/    Contratos + mocks + stubs de API
  mocks/           Dados fictícios
  types/           Modelos de domínio + respostas
  hooks/           useAuth etc.
  utils/           Datas, preços, agendamentos
  config/env.ts    Leitura tipada de variáveis
  lib/storage.ts   Camada única sobre localStorage
```

Nenhum componente acessa `localStorage` diretamente; o fluxo passa por hooks, repositórios e `src/lib/storage.ts`.

## Fluxo demonstrativo

- **Planos**: frequência de aulas e créditos mensais.
- **Agendamento**: consulta de disponibilidade e reserva de horários.
- **Área do aluno**: dashboard, agendar aula, próximas aulas, histórico, plano/créditos e perfil.
- **Histórico**: aulas realizadas com data, horário, duração, status, tópico e observações.
- **Notificações**: tentativas são registradas localmente em modo mock; nenhum e-mail real é enviado.

## Integracao com Resend e WhatsApp

O frontend não deve chamar o Resend diretamente e nenhuma chave deve ser criada como `VITE_*`.
Detalhes do contrato e do modo híbrido estão em [`docs/INTEGRACAO_RESEND.md`](docs/INTEGRACAO_RESEND.md).

Fluxo de leads por e-mail nesta fase:

```
Frontend -> POST /api/leads -> backend -> Resend -> professor
```

Fluxo de WhatsApp:

```
Frontend -> WhatsApp Web com mensagem preenchida
```

A chave `RESEND_API_KEY` deve ficar somente no backend. Use `VITE_DATA_SOURCE=mock` e
`VITE_LEADS_DATA_SOURCE=api` para ativar apenas leads reais, mantendo o restante mockado.

## Rotas principais

Públicas: `/`, `/planos`, `/agendar`, `/como-funciona`, `/contato`, `/entrar`.

Área do aluno: `/aluno`, `/aluno/agendar`, `/aluno/aulas`, `/aluno/historico`, `/aluno/plano`, `/aluno/perfil`.

Rotas antigas relacionadas a cursos, conteúdos e certificados foram mantidas apenas como redirects de compatibilidade.

## Documentação de auditoria

- [`PROJETO.md`](PROJETO.md): guia de domínio e arquitetura.
- [`ALTERACOES_REALIZADAS.md`](ALTERACOES_REALIZADAS.md): resumo das mudanças recentes.
- [`MELHORIAS_FUTURAS.md`](MELHORIAS_FUTURAS.md): pendências e evolução planejada.
- [`docs/INTEGRACAO_RESEND.md`](docs/INTEGRACAO_RESEND.md): contrato seguro para notificações futuras.

## Deploy no Render (Web Service Node)

- **Build command**: `npm ci && npm run build`
- **Start command**: `npm run start`
- **Health check path**: `/api/health`
- **Server entry**: `.output/server/index.mjs`

O projeto inclui `render.yaml`. Configure os segredos no painel do Render, especialmente
`RESEND_API_KEY` e `RESEND_FROM_EMAIL`.

## Fora do escopo desta etapa

Sem banco de dados, autenticação real, pagamentos reais, créditos reais ou reserva real de calendário.
Nesta fase, somente a captação de leads por e-mail é real quando `VITE_LEADS_DATA_SOURCE=api`.
