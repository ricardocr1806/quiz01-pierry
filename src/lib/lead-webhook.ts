import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  flow: z.string(),
});

const WEBHOOK_URL = "https://falume.com.br/api/webhooks/lead/lf_5e20241321c0cb73f96cf402b8c3340eb78a";

export const sendLead = createServerFn({ method: "POST" })
  .validator(LeadSchema)
  .handler(async ({ data }) => {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        tags: [data.flow === "flow1" ? "quiz-pais" : "quiz-filhos"],
        source: "quiz-mapa-identidade",
      }),
    });
    const json = await res.json() as any;
    return { ok: json.ok ?? false };
  });
