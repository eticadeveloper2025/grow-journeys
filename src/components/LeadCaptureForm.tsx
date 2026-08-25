import { useEffect, useState, type FormEvent } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { DemoBanner } from "@/components/DemoBanner";
import { leadService } from "@/services/leadService";
import { hasConfiguredWhatsApp } from "@/utils/contact";
import type { LeadIntent, LeadPreferredChannel } from "@/types";

type LeadCaptureFormProps = {
  intent: LeadIntent;
  title?: string;
  description?: string;
  preferredSchedulePreset?: string;
  requirePreferredSchedule?: boolean;
  hidePreferredScheduleInput?: boolean;
};

type LeadFormState = {
  fullName: string;
  email: string;
  whatsapp: string;
  preferredChannel: LeadPreferredChannel;
  preferredSchedule: string;
  message: string;
  website: string;
};

const emptyForm: LeadFormState = {
  fullName: "",
  email: "",
  whatsapp: "",
  preferredChannel: "email",
  preferredSchedule: "",
  message: "",
  website: "",
};

function defaultTitle(intent: LeadIntent): string {
  return intent === "scheduling" ? "Solicitar agendamento" : "Enviar mensagem";
}

function defaultDescription(intent: LeadIntent): string {
  return intent === "scheduling"
    ? "Conte seus objetivos e melhores horários. A resposta pode chegar por e-mail ou pelo WhatsApp Web."
    : "Envie sua dúvida sobre planos, horários ou objetivos de inglês.";
}

export function LeadCaptureForm({
  intent,
  title,
  description,
  preferredSchedulePreset,
  requirePreferredSchedule = false,
  hidePreferredScheduleInput = false,
}: LeadCaptureFormProps) {
  const [form, setForm] = useState<LeadFormState>(emptyForm);
  const [renderedAt, setRenderedAt] = useState(() => new Date().toISOString());
  const [loading, setLoading] = useState(false);
  const whatsappReady = hasConfiguredWhatsApp();
  const isMock = env.leadsDataSource === "mock";
  const needsSchedule = intent === "scheduling" && requirePreferredSchedule;
  const missingSchedule = needsSchedule && form.preferredSchedule.trim().length === 0;

  useEffect(() => {
    if (!preferredSchedulePreset) return;
    setForm((current) => ({
      ...current,
      preferredSchedule: preferredSchedulePreset,
      message:
        current.message.trim().length > 0
          ? current.message
          : `Gostaria de solicitar uma aula neste horário: ${preferredSchedulePreset}.`,
    }));
  }, [preferredSchedulePreset]);

  const update = <K extends keyof LeadFormState>(key: K, value: LeadFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (missingSchedule) {
      toast.info("Escolha uma data e um horário no calendário.");
      return;
    }
    setLoading(true);
    try {
      const response = await leadService.submit({
        intent,
        fullName: form.fullName,
        email: form.email,
        whatsapp: form.whatsapp,
        preferredChannel: form.preferredChannel,
        preferredSchedule: form.preferredSchedule,
        message: form.message,
        website: form.website,
        renderedAt,
      });
      toast.success(response.data.message);
      setForm(emptyForm);
      setRenderedAt(new Date().toISOString());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel enviar agora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-lg border border-border/60 bg-card p-5 md:p-6"
    >
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">
          {intent === "scheduling" ? "Agendamento" : "Contato"}
        </p>
        <h2 className="mt-2 font-display text-3xl">{title ?? defaultTitle(intent)}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {description ?? defaultDescription(intent)}
        </p>
      </div>

      {isMock && (
        <DemoBanner>
          Modo mock: e-mails ficam apenas registrados localmente. Em API, o envio deve sair pelo
          backend com Resend.
        </DemoBanner>
      )}

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <Label htmlFor={`${intent}-website`}>Website</Label>
        <Input
          id={`${intent}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${intent}-name`}>Nome</Label>
          <Input
            id={`${intent}-name`}
            required
            value={form.fullName}
            onChange={(event) => update("fullName", event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`${intent}-email`}>E-mail</Label>
          <Input
            id={`${intent}-email`}
            type="email"
            required
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </div>
      </div>

      <div className={`grid gap-4 ${hidePreferredScheduleInput ? "" : "sm:grid-cols-2"}`}>
        <div>
          <Label htmlFor={`${intent}-whatsapp`}>WhatsApp</Label>
          <Input
            id={`${intent}-whatsapp`}
            inputMode="tel"
            placeholder="(11) 99999-9999"
            value={form.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
          />
        </div>
        {!hidePreferredScheduleInput && (
          <div>
            <Label htmlFor={`${intent}-schedule`}>Melhores horários</Label>
            <Input
              id={`${intent}-schedule`}
              placeholder="Ex.: terças à noite"
              value={form.preferredSchedule}
              onChange={(event) => update("preferredSchedule", event.target.value)}
            />
          </div>
        )}
      </div>

      {hidePreferredScheduleInput && (
        <div className="rounded-md border border-border/60 bg-background/40 px-3 py-3">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Horário escolhido
          </div>
          <div className="mt-1 text-sm font-medium text-foreground">
            {form.preferredSchedule || "Escolha uma data e um horário no calendário."}
          </div>
        </div>
      )}

      <div>
        <Label>Preferência de resposta</Label>
        <RadioGroup
          value={form.preferredChannel}
          onValueChange={(value) => update("preferredChannel", value as LeadPreferredChannel)}
          className="mt-2 grid gap-2 sm:grid-cols-2"
        >
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm">
            <RadioGroupItem value="email" id={`${intent}-channel-email`} />
            <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>E-mail</span>
          </label>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm data-disabled:opacity-50">
            <RadioGroupItem
              value="whatsapp"
              id={`${intent}-channel-whatsapp`}
              disabled={!whatsappReady}
            />
            <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>WhatsApp Web</span>
          </label>
        </RadioGroup>
        {!whatsappReady && (
          <p className="mt-2 text-xs text-muted-foreground">
            WhatsApp Web sera habilitado quando o numero de atendimento estiver configurado.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor={`${intent}-message`}>Mensagem</Label>
        <Textarea
          id={`${intent}-message`}
          rows={5}
          required
          placeholder={
            intent === "scheduling"
              ? "Conte seu nível e objetivo."
              : "Escreva sua dúvida ou objetivo."
          }
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={loading || missingSchedule}
        className="w-full bg-brand text-primary-foreground hover:bg-brand-dark"
      >
        {loading
          ? "Enviando..."
          : missingSchedule
            ? "Escolha um horário no calendário"
            : form.preferredChannel === "whatsapp"
              ? "Abrir WhatsApp Web"
              : "Enviar por e-mail"}
      </Button>
    </form>
  );
}
