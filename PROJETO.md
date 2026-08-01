# Nerya — Guia do Projeto

Documento de referência para futuras alterações na plataforma **Nerya — aulas particulares de inglês online**.

> **Posicionamento da marca**: *"Inglês que conecta. Fluência que transforma."*
> **Logo**: sempre em minúsculas — `nerya.`
> **Nicho**: aulas particulares de **inglês** com um único professor, ao vivo, com planos, créditos, agendamento e histórico.

---

## 1. Stack técnica

| Camada | Tecnologia |
|--------|------------|
| Framework | **TanStack Start v1** (React 19 + Vite 7/8, SSR/SSG capaz) |
| Roteamento | **TanStack Router** file-based (`src/routes/`) |
| Estilo | **Tailwind CSS v4** via `src/styles.css` |
| UI Kit | **shadcn/ui** em `src/components/ui/` |
| Estado servidor | **TanStack Query** |
| Formulários | `react-hook-form` + `zod` quando necessário |
| Datas / formatação | `date-fns` (locale pt-BR) |

**Não usar**: Supabase, Lovable Cloud, Firebase, banco real, Edge Functions, pagamentos reais, envio de e-mail real ou reserva real em calendário externo. O projeto é **mock-first** até integração futura com API própria + PostgreSQL no Render.

---

## 2. Domínio funcional

A Nerya é uma plataforma de aulas particulares de inglês conduzidas ao vivo por um único professor.

O produto deve focar em:

- conversação;
- pronúncia;
- inglês para viagens;
- inglês profissional;
- acompanhamento individual;
- frequência de aulas;
- créditos;
- agendamento;
- próximas aulas;
- histórico de aulas realizadas.

Não reintroduzir: catálogo de cursos, módulos, aula gravada, aula em vídeo, player, percentual assistido, matrícula em curso, certificado de curso, quiz, favoritos de conteúdo ou trilha de conteúdo.

---

## 3. Arquitetura mock-first

Regra de ouro: **componentes nunca importam mocks ou `localStorage` diretamente**. O fluxo é sempre:

```
UI (componentes / rotas)
  -> hooks
    -> services / repositories
      -> mock  (src/repositories/mock)
      -> api   (src/repositories/api)
        -> src/mocks/* ou fetch(VITE_API_BASE_URL)
```

### Estrutura de pastas

```
src/
  components/       Componentes reutilizáveis
  routes/           Rotas file-based TanStack
  layouts/          PublicLayout, AlunoLayout
  mocks/            Base de dados fictícia
  repositories/
    interfaces.ts   Contratos
    mock/           Implementação padrão
    api/            Stubs REST futuros
    index.ts        Fábrica lê VITE_DATA_SOURCE
  hooks/            useAuth e hooks de aplicação
  lib/              storage.ts
  utils/            mockDelay, format, bookings
  types/            Modelos de domínio + ApiResponse/ApiListResponse
  config/           env.ts
  styles.css        Tokens do design system
```

---

## 4. Modelos principais

- `Plan`: plano comercial com preço, recursos e frequência descrita em features.
- `Booking`: aula agendada ou realizada.
- `AvailabilitySlot`: horário disponível para reserva.
- `StudentCreditBalance`: créditos do aluno no ciclo atual.
- `Subscription`: contratação demonstrativa de plano.

Rotas antigas e repositórios antigos ligados a cursos podem existir apenas como compatibilidade temporária, sem aparecer na navegação ou nas telas principais.

---

## 5. Persistência local

Toda gravação em `localStorage` passa por `src/lib/storage.ts`.

Chaves atuais:

```
nerya:session      -> sessão do usuário logado
nerya:bookings     -> aulas agendadas e histórico
nerya:credits      -> créditos por aluno
nerya:plan         -> plano ativo
nerya:prefs        -> preferências
nerya:users        -> usuários demo
nerya:notifications -> tentativas mockadas de notificação
```

Chaves legadas podem permanecer apenas para compatibilidade de migração.

---

## 6. Rotas

Convenção **flat com pontos**, não pastas aninhadas. `routeTree.gen.ts` é auto-gerado — **não editar à mão**.

### Público

`/` `/planos` `/planos/checkout` `/planos/sucesso` `/agendar` `/como-funciona` `/contato` `/entrar` `/cadastrar` `/recuperar-senha` `/redefinir-senha`

### Aluno

`/aluno` `/aluno/agendar` `/aluno/aulas` `/aluno/historico` `/aluno/plano` `/aluno/perfil`

### Compatibilidade temporária

As rotas antigas `/cursos`, `/conteudos`, `/sobre`, `/aluno/cursos`, `/aluno/certificados`, `/aluno/favoritos` e `/aluno/assinatura` devem redirecionar para destinos atuais. Não remover enquanto houver chance de links externos ou histórico local apontarem para elas.

### Guard

`src/routes/_aluno.tsx` faz `beforeLoad` checando `nerya:session`; se ausente, redireciona para `/entrar`. Comentário obrigatório:

`Validação real deve ocorrer no backend — este guard é apenas UX.`

---

## 7. Estados de UI obrigatórios

Toda listagem/detalhe cobre:

- loading;
- vazio;
- erro com retry;
- sucesso.

Componentes prontos ficam em `src/components/States.tsx`.

---

## 8. Planos e checkout demo

- Planos representam frequência de aulas e créditos por ciclo.
- Cupom `NERYA20` aplica desconto visual.
- Checkout pede apenas nome e e-mail.
- Nunca pedir cartão, CVV ou CPF.
- Banner persistente: *"Ambiente demonstrativo — nenhum pagamento será realizado."*
- Ativação/cancelamento apenas em `nerya:plan`.

---

## 9. Agendamento demo

- Disponibilidades vêm de `src/mocks/bookings.ts`.
- Agendar uma aula consome um crédito.
- Cancelar uma aula agendada devolve um crédito.
- Histórico não deve exibir thumbnail, player, vídeo ou percentual assistido.
- Aulas realizadas mostram data, horário, duração, status, tópico e observação opcional.
- O fluxo de criação passa por `src/services/bookingService.ts`.
- Notificações são simuladas por `MockNotificationRepository`; nenhum e-mail real é enviado.

---

## 10. Notificações e Resend futuro

Não colocar segredo em `VITE_*`. Variáveis `VITE_*` entram no bundle público.

Nesta etapa não há envio real de e-mail. O comportamento correto é:

```
Frontend
  -> bookingService
    -> MockBookingRepository
    -> MockNotificationRepository
```

No modo API futuro:

```
Frontend
  -> POST /api/bookings
    -> backend valida e persiste
    -> backend envia via Resend
    -> backend retorna a reserva
```

O frontend nunca chama a API do Resend diretamente. A chave futura `RESEND_API_KEY` deve existir apenas no backend.

Contrato detalhado: [`docs/INTEGRACAO_RESEND.md`](docs/INTEGRACAO_RESEND.md).

---

## 11. Checklist antes de commitar

- [ ] Navegação pública contém Início, Planos, Agendar aula, Como funciona, Contato e Entrar.
- [ ] Área do aluno contém Dashboard, Agendar aula, Próximas aulas, Histórico, Plano e Perfil.
- [ ] Sem links novos para rotas antigas.
- [ ] Rotas antigas relevantes redirecionam.
- [ ] Sem `localStorage.*` fora de `src/lib/storage.ts`.
- [ ] Sem chave ou SDK Resend no frontend.
- [ ] Sem variável `VITE_*` contendo segredo.
- [ ] Sem menção visível a catálogo, aulas gravadas, player, progresso de vídeo, certificado de curso ou quiz.
- [ ] Toda rota nova tem `head()` próprio.
- [ ] Estados loading/vazio/erro/sucesso cobertos nas páginas de dados.
- [ ] Logo escrita como `nerya.`.

---

## 12. Fora do escopo

Sem backend real, banco, auth de terceiros, pagamento real, envio de e-mail, upload em servidor, certificado oficial ou reserva real de calendário. Todos os fluxos são simulações locais.
