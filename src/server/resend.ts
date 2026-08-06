import { Resend } from "resend";

export type LeadEmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo: string;
};

export type LeadEmailResult = {
  id?: string;
};

export type LeadEmailProvider = {
  send(payload: LeadEmailPayload, apiKey: string): Promise<LeadEmailResult>;
};

export const resendLeadEmailProvider: LeadEmailProvider = {
  async send(payload, apiKey) {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo,
    });

    if (result.error) {
      throw new Error("RESEND_PROVIDER_ERROR");
    }

    return { id: result.data?.id };
  },
};
