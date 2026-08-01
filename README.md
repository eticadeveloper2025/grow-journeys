# Nerya — Aulas particulares de inglês (versão demonstrativa)

Frontend mock-first construído com **TanStack Start + React 19 + Tailwind v4 + shadcn/ui**.
A Nerya é uma plataforma demonstrativa para um único professor de inglês: alunos contratam planos, consultam créditos, agendam aulas ao vivo e acompanham próximas aulas e histórico.

## Executar localmente

```bash
npm install
npm run dev    # http://localhost:8080
npm run build
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

## Integração futura com Resend

O frontend não deve chamar o Resend diretamente e nenhuma chave deve ser criada como `VITE_*`.
Detalhes do contrato e do modo mock estão em [`docs/INTEGRACAO_RESEND.md`](docs/INTEGRACAO_RESEND.md).

Fluxo atual mock:

```
Frontend -> bookingService -> MockBookingRepository -> MockNotificationRepository
```

Fluxo futuro API:

```
Frontend -> POST /api/bookings -> backend -> Resend
```

A chave `RESEND_API_KEY`, quando existir, deve ficar somente no backend.

## Rotas principais

Públicas: `/`, `/planos`, `/agendar`, `/como-funciona`, `/contato`, `/entrar`.

Área do aluno: `/aluno`, `/aluno/agendar`, `/aluno/aulas`, `/aluno/historico`, `/aluno/plano`, `/aluno/perfil`.

Rotas antigas relacionadas a cursos, conteúdos e certificados foram mantidas apenas como redirects de compatibilidade.

## Documentação de auditoria

- [`PROJETO.md`](PROJETO.md): guia de domínio e arquitetura.
- [`ALTERACOES_REALIZADAS.md`](ALTERACOES_REALIZADAS.md): resumo das mudanças recentes.
- [`MELHORIAS_FUTURAS.md`](MELHORIAS_FUTURAS.md): pendências e evolução planejada.
- [`docs/INTEGRACAO_RESEND.md`](docs/INTEGRACAO_RESEND.md): contrato seguro para notificações futuras.

## Deploy no Render (Static Site)

- **Build command**: `npm install && npm run build`
- **Publish directory**: `dist`
- **Redirects**: TanStack Start resolve rotas profundas.

Configure as variáveis `VITE_*` no painel do Render antes do build.

## Fora do escopo desta etapa

Sem backend real, banco de dados, autenticação de terceiros, pagamentos reais, envio de e-mails ou reserva real de calendário. Todos os fluxos indicados como demonstrativos são simulações locais.
