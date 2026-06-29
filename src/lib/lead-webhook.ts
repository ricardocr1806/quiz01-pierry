import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  flow: z.string(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  fbclid: z.string().optional(),
});

const WEBHOOK_URL = "https://falume.com.br/api/webhooks/lead/lf_5e20241321c0cb73f96cf402b8c3340eb78a";

export const sendLead = createServerFn({ method: "POST" })
  .validator(LeadSchema)
  .handler(async ({ data }) => {
    const { name, email, phone, flow, ...utms } = data;
    const utmFields: Record<string, string> = {};
    (Object.entries(utms) as [string, string | undefined][]).forEach(([k, v]) => { if (v) utmFields[k] = v; });

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        tags: [flow === "flow1" ? "quiz-pais" : "quiz-filhos"],
        source: "quiz-mapa-identidade",
        ...utmFields,
      }),
    });
    const json = await res.json() as any;
    return { ok: json.ok ?? false };
  });
