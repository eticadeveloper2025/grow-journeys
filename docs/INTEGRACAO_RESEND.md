# Integracao com Resend

Esta fase implementa captação real de leads por e-mail para os formulários públicos de
`/contato` e `/agendar`. O restante do sistema continua mockado: login, planos, créditos,
reservas completas, pagamentos, histórico e área do aluno ainda não usam backend real.

## Regra de segurança

- Nunca colocar chave real do Resend no código-fonte.
- Nunca criar `VITE_RESEND_API_KEY`, `VITE_EMAIL_SECRET` ou qualquer `VITE_*` com segredo.
- O navegador chama apenas `POST /api/leads`; ele nunca chama o Resend diretamente.
- A chave `RESEND_API_KEY` fica somente no servidor Render.
- Arquivos `.env`, `.env.local`, `.env.production.local` e equivalentes `*.local` estão ignorados pelo Git.

## Modo híbrido

Use:

```text
VITE_DATA_SOURCE=mock
VITE_LEADS_DATA_SOURCE=api
VITE_API_BASE_URL=/api
```

Isso mantém repositórios, autenticação, planos, créditos e reservas em modo mock, mas envia leads
por `/api/leads`.

Para voltar a leads mockados:

```text
VITE_LEADS_DATA_SOURCE=mock
```

Nesse modo, os leads públicos voltam a ser salvos localmente em `nerya:lead-requests`.

## Fluxos

E-mail:

```text
Frontend -> POST /api/leads -> backend valida payload e anti-spam -> Resend -> professor
```

WhatsApp:

```text
Frontend -> wa.me com mensagem preenchida -> usuário revisa e envia manualmente
```

## Endpoint

`POST /api/leads` aceita:

```ts
{
  intent: "contact" | "scheduling";
  fullName: string;
  email: string;
  whatsapp?: string;
  preferredChannel: "email" | "whatsapp";
  preferredSchedule?: string;
  message: string;
  origin?: string;
  website?: string;
  renderedAt?: string;
}
```

O backend valida método, `Content-Type`, JSON, campos obrigatórios, e-mail, enums, tamanho do body,
tamanho dos campos, honeypot e rate limit por IP. O assunto final é gerado no servidor.

O e-mail contém origem, nome, e-mail, WhatsApp, canal preferido, horário preferido, página de origem,
data/hora e mensagem em HTML e texto simples.

## Variáveis

Servidor:

```text
RESEND_API_KEY=
RESEND_FROM_EMAIL=Nerya <onboarding@resend.dev>
RESEND_TO_EMAIL=guilherme.augusto.nery1@gmail.com
```

Frontend público:

```text
VITE_APP_ENV=production
VITE_DATA_SOURCE=mock
VITE_LEADS_DATA_SOURCE=api
VITE_API_BASE_URL=/api
VITE_PUBLIC_CONTACT_EMAIL=guilherme.augusto.nery1@gmail.com
VITE_PUBLIC_WHATSAPP_NUMBER=
```

## Domínio Resend

Para teste controlado sem domínio verificado, use:

```text
RESEND_FROM_EMAIL=Nerya <onboarding@resend.dev>
```

Limitação: `onboarding@resend.dev` só envia para o e-mail associado à própria conta Resend.

Para produção, verifique um domínio no Resend e depois use:

```text
RESEND_FROM_EMAIL=Nerya <contato@DOMINIO_VERIFICADO>
```

## Anti-spam MVP

Implementado nesta fase:

- honeypot invisível;
- botão bloqueado enquanto envia;
- limite de tamanho do body;
- limite de tamanho por campo;
- tempo mínimo entre renderização e envio;
- rate limit em memória por IP.

Limitação: o rate limit em memória reinicia em deploys/restarts e não é compartilhado entre múltiplas
instâncias. Ele é aceitável para MVP, mas não substitui proteção persistente ou CAPTCHA em escala.

## Diagnóstico

Verificações rápidas:

- `GET /api/health` deve retornar HTTP 200.
- `POST /api/leads` com envs ausentes retorna erro controlado de configuração.
- Falhas do Resend retornam erro amigável, sem stack trace e sem resposta bruta do provedor.
- Logs não devem conter API key, corpo completo do lead, telefone completo ou e-mail completo.

## Próximos passos

- Persistir leads em banco se for necessário histórico confiável ou painel.
- Implementar autenticação real.
- Implementar créditos, planos e reservas reais.
- Integrar pagamentos.
- Substituir rate limit em memória por Redis/Postgres quando houver múltiplas instâncias.
