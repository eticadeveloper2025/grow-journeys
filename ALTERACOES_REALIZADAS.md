# Alterações Realizadas — Nerya

Resumo das alterações recentes validadas nesta auditoria.

## Domínio

- A Nerya foi reposicionada como plataforma demonstrativa de aulas particulares de inglês ao vivo com um único professor.
- A navegação pública e autenticada deixou de apresentar Cursos, Conteúdos, Favoritos, Certificados e Assinatura.
- Rotas antigas foram mantidas como redirects para preservar links externos e histórico local.
- O dashboard, próximas aulas, histórico e plano passaram a focar em créditos, reservas e aulas realizadas.

## Planos

- Os planos foram centralizados em `src/mocks/plans.ts`.
- A página `/planos` usa preços formatados com `Intl.NumberFormat` em `pt-BR` e moeda `BRL`.
- Os cards exibem preço original riscado, preço final, economia, créditos e indicação de plano recomendado.
- A seleção de plano preserva o fluxo: visitante vai para login, aluno autenticado segue para checkout demonstrativo.

## Agendamento

- Foi criado o calendário em `src/components/SchedulingCalendar.tsx`.
- A rota pública `/agendar` e a rota autenticada `/aluno/agendar` compartilham o mesmo componente.
- As regras de disponibilidade foram centralizadas em `src/config/scheduling.ts`.
- O serviço `src/services/bookingService.ts` valida disponibilidade, créditos e conflitos antes de criar a reserva.
- A criação de reserva consome crédito apenas depois da confirmação.
- Cancelamentos demonstrativos devolvem crédito quando aplicável.

## Notificações

- Foi criado o contrato `NotificationRepository`.
- O modo mock registra tentativas locais de confirmação/cancelamento/reagendamento.
- Nenhum e-mail real é enviado nesta etapa.
- O frontend não contém SDK Resend, chamada direta ao Resend ou segredo em `VITE_*`.

## Auditoria

- Removido o componente legado `src/components/CourseCard.tsx`, que não era usado e apontava para o domínio antigo.
- Removido import não utilizado no calendário de agendamento.
- Documentação atualizada para refletir domínio, arquitetura mock-first e integração futura segura com Resend.

