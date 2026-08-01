# Melhorias Futuras — Nerya

Este arquivo registra evoluções planejadas depois da readequação para uma plataforma mock-first de aulas particulares ao vivo com um único professor.

## Backend e persistência

- Criar API própria para autenticação, planos, créditos, disponibilidade, reservas, cancelamentos e histórico.
- Persistir dados em PostgreSQL, com transações para evitar reserva duplicada e consumo duplicado de crédito.
- Mover validações críticas de sessão, crédito, disponibilidade e cancelamento para o backend.
- Substituir os stubs de `src/repositories/api` por chamadas reais aos endpoints versionados.

## Agendamento

- Criar painel administrativo para configurar dias de atendimento, bloqueios manuais, feriados e exceções.
- Manter a regra de um único professor até existir configuração explícita de múltiplos professores ou aulas em grupo.
- Adicionar sincronização com calendário externo somente via backend.
- Cobrir conflitos concorrentes com testes de integração quando houver API real.

## Notificações

- Integrar Resend somente no backend, usando `RESEND_API_KEY` fora do bundle público.
- Enviar confirmações, cancelamentos e reagendamentos após a reserva persistida.
- Registrar tentativas, falhas e reprocessamento de notificações.
- Manter o frontend exibindo mensagens compatíveis com o resultado retornado pela API, sem prometer envio quando estiver em modo mock.

## Qualidade

- Adicionar testes de fluxo para seleção de plano, saldo de créditos, agendamento, cancelamento e histórico.
- Adicionar testes visuais/responsivos para planos e calendário em mobile, tablet e desktop.
- Automatizar checagens de acessibilidade para foco, nomes acessíveis e contraste.
- Planejar remoção definitiva de tipos, mocks e repositórios legados de cursos após o período de redirects.

