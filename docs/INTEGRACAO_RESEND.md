# Integração Futura com Resend

Este projeto não envia e-mails reais na etapa atual. A arquitetura preparada é mock-first no frontend e reserva o envio real para uma API própria no backend.

## Regra de segurança

- Não instalar nem configurar chave real do Resend no frontend.
- Não criar `VITE_RESEND_API_KEY`, `VITE_EMAIL_SECRET` ou qualquer `VITE_*` que contenha segredo.
- Não chamar a API do Resend diretamente pelo navegador.
- Não exibir mensagem afirmando que um e-mail real foi enviado enquanto `VITE_DATA_SOURCE=mock`.
- O projeto deve funcionar sem nenhuma chave configurada.

## Fluxo atual mock

```text
Frontend
-> BookingService
-> MockBookingRepository
-> MockNotificationRepository
-> retorno simulado
```

O `MockNotificationRepository` registra tentativas locais de notificação e retorna uma mensagem explícita de simulação.

## Fluxo futuro API

```text
Frontend
-> POST /api/bookings
-> backend valida sessão, disponibilidade e créditos
-> backend persiste reserva no PostgreSQL
-> backend envia notificação pelo Resend
-> backend retorna o resultado da reserva
```

No modo API, o frontend continua falando apenas com a API da Nerya. O backend é o único responsável por usar `RESEND_API_KEY`.

## Contrato de notificação

O contrato fica desacoplado em `src/repositories/interfaces.ts`:

```ts
interface NotificationRepository {
  sendBookingConfirmation(input: BookingConfirmationNotification): Promise<NotificationResult>;
  sendBookingCancellation(input: BookingCancellationNotification): Promise<NotificationResult>;
  sendBookingRescheduled(input: BookingRescheduledNotification): Promise<NotificationResult>;
}
```

Tipos relacionados:

- `BookingConfirmationNotification`
- `BookingCancellationNotification`
- `BookingRescheduledNotification`
- `NotificationResult`
- `NotificationAttempt`

## Variáveis futuras

Variáveis secretas devem existir somente no backend:

```text
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
```

O frontend pode manter apenas variáveis públicas, sem segredo, como `VITE_API_BASE_URL`.

## Checklist antes da integração real

- Criar endpoint de reserva no backend.
- Validar sessão, crédito e disponibilidade no backend.
- Persistir reserva e consumo de crédito em uma transação.
- Enviar notificação depois da persistência confirmada.
- Registrar falhas de envio sem desfazer a reserva já confirmada, salvo decisão explícita de produto.
- Atualizar mensagens do frontend para refletir o status real retornado pela API.

