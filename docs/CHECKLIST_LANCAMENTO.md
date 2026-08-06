# Checklist de lancamento

## Estado atual

- Captação por e-mail dos formulários públicos de `/contato` e `/agendar` foi implementada em `POST /api/leads`.
- WhatsApp Web continua abrindo `wa.me` com mensagem preenchida; o usuário ainda precisa revisar e enviar.
- O restante do site continua mock-first: sem banco real, autenticação real, pagamento real, créditos reais e reservas reais.
- O modo correto para produção desta fase é `VITE_DATA_SOURCE=mock` com `VITE_LEADS_DATA_SOURCE=api`.

## Banco de dados

Banco não é obrigatório para esta Fase 1 se o objetivo for receber leads por e-mail.

Banco passa a ser necessário para:

- painel administrativo de leads;
- histórico confiável de solicitações;
- login real de alunos;
- créditos, planos e agendamentos reais;
- bloqueio de horários com concorrência;
- auditoria de cancelamentos/reagendamentos;
- pagamentos e assinaturas.

## Render Web Service Node

Use Render Web Service, não Static Site.

```text
Build Command: npm ci && npm run build
Start Command: npm run start
Health Check Path: /api/health
```

O build deve gerar:

```text
.output/server/index.mjs
```

## Variáveis no Render

```text
NODE_ENV=production
HOST=0.0.0.0
NITRO_PRESET=node-server
RESEND_API_KEY=<cadastrar como secret>
RESEND_FROM_EMAIL=Nerya <onboarding@resend.dev>
RESEND_TO_EMAIL=guilherme.augusto.nery1@gmail.com
VITE_APP_ENV=production
VITE_DATA_SOURCE=mock
VITE_LEADS_DATA_SOURCE=api
VITE_API_BASE_URL=/api
VITE_PUBLIC_CONTACT_EMAIL=guilherme.augusto.nery1@gmail.com
VITE_PUBLIC_WHATSAPP_NUMBER=<opcional>
```

Para produção final, trocar `RESEND_FROM_EMAIL` para `Nerya <contato@DOMINIO_VERIFICADO>` depois de
verificar o domínio no Resend.

## Antes de publicar

- Configurar `RESEND_API_KEY` no Environment do Render.
- Confirmar se `guilherme.augusto.nery1@gmail.com` é o e-mail permitido para teste com `onboarding@resend.dev`.
- Verificar domínio no Resend antes de enviar para destinatários fora das regras de teste.
- Revisar se `/entrar`, `/cadastrar`, planos e área do aluno devem continuar visíveis como demonstrativos.
- Revisar políticas obrigatórias: privacidade, termos e consentimento de contato.
- Rodar `npm run build`, `npm run typecheck` e `npm test`.

## Teste manual controlado

1. Configurar as variáveis no Render.
2. Fazer deploy.
3. Abrir `/api/health` e confirmar HTTP 200.
4. Enviar uma única solicitação real pelo formulário.
5. Confirmar recebimento no Gmail configurado.

Não existe endpoint público de teste de e-mail.
