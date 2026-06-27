import { useState } from "react";

export type Lead = { name: string; email: string; whatsapp: string };

type Props = {
  flow: "flow1" | "flow2" | null;
  onSubmit: (lead: Lead) => void;
};

const COPY = {
  flow1: {
    title: "Última etapa antes de receber o Mapa da Identidade do seu filho(a)…",
    subtitle:
      "Informe seu Nome, Email e WhatsApp onde você vai receber o diagnóstico personalizado da sua família:",
  },
  flow2: {
    title: "Última etapa antes de receber o seu Mapa da Identidade…",
    subtitle:
      "Informe seu Nome, Email e WhatsApp onde você vai receber o seu diagnóstico pessoal:",
  },
} as const;

function formatBRPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function isValidBRPhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length !== 10 && d.length !== 11) return false;
  const ddd = parseInt(d.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  // celular tem 11 dígitos e o terceiro deve ser 9
  if (d.length === 11 && d[2] !== "9") return false;
  return true;
}

const WEBHOOK_URL = "https://falume.com.br/api/webhooks/lead/lf_5e20241321c0cb73f96cf402b8c3340eb78a";

function fbq(...args: any[]) {
  if (typeof window !== "undefined" && (window as any).fbq) (window as any).fbq(...args);
}

function sendToWebhook(lead: Lead, flow: string) {
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      phone: lead.whatsapp,
      tags: [flow === "flow1" ? "quiz-pais" : "quiz-filhos"],
      source: "quiz-mapa-identidade",
    }),
  }).catch(() => {});
}

export function LeadForm({ flow, onSubmit }: Props) {
  const c = COPY[flow ?? "flow2"];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [touched, setTouched] = useState(false);

  const nameOk = name.trim().length > 1;
  const emailOk = /\S+@\S+\.\S+/.test(email.trim());
  const phoneOk = isValidBRPhone(whatsapp);
  const valid = nameOk && emailOk && phoneOk;

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-balance">{c.title}</h1>
      <p className="mt-3 text-base font-semibold text-foreground">{c.subtitle}</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (valid) {
            const lead = { name: name.trim(), email: email.trim(), whatsapp: whatsapp.trim() };
            sendToWebhook(lead, flow ?? "flow2");
            fbq("track", "Lead", { content_name: "Quiz — Mapa da Identidade Homossexual" });
            onSubmit(lead);
          }
        }}
      >
        <label className="block">
          <span className="text-sm font-medium text-foreground">Primeiro nome</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu primeiro nome..."
            maxLength={60}
            className="mt-1 w-full rounded-2xl border-2 px-4 py-3 text-base outline-none focus:border-[var(--rainbow-violet)] bg-card"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu Email..."
            maxLength={120}
            className="mt-1 w-full rounded-2xl border-2 px-4 py-3 text-base outline-none focus:border-[var(--rainbow-violet)] bg-card"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">WhatsApp</span>
          <input
            type="tel"
            inputMode="numeric"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatBRPhone(e.target.value))}
            placeholder="(11) 91234-5678"
            maxLength={16}
            className="mt-1 w-full rounded-2xl border-2 px-4 py-3 text-base outline-none focus:border-[var(--rainbow-violet)] bg-card"
            required
          />
          {touched && !phoneOk && (
            <span className="block mt-1 text-xs font-medium" style={{ color: "var(--rainbow-orange)" }}>
              Informe um número de WhatsApp válido com DDD.
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={!valid}
          className="w-full py-4 rounded-full font-semibold text-white text-base sm:text-lg shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{ background: "var(--gradient-rainbow-no-red)" }}
        >
          Continuar
        </button>
      </form>
    </div>
  );
}
