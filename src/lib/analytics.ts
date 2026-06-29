import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const STEPS = [
  { key: "1_page_view",         label: "Página carregada" },
  { key: "2_quiz_started",      label: "Quiz iniciado" },
  { key: "3_halfway",           label: "50% das perguntas" },
  { key: "4_questions_done",    label: "Perguntas concluídas" },
  { key: "5_lead_view",         label: "Formulário visualizado" },
  { key: "6_lead_submit",       label: "Lead enviado" },
  { key: "7_result_view",       label: "Resultado visualizado" },
  { key: "8_checkout_click",    label: "Checkout clicado" },
] as const;

export type StepKey = typeof STEPS[number]["key"];

const CF_ACCOUNT = "8da9fa4b9b400831f74c8f9099550b7d";
const KV_NS      = "6de0f9e30a4d4f548c16c5a01d03c08b";
const CF_TOKEN   = process.env.CF_KV_TOKEN ?? "";

const KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/storage/kv/namespaces/${KV_NS}/values`;

async function kvGet(key: string): Promise<number> {
  const res = await fetch(`${KV_BASE}/${key}`, {
    headers: { Authorization: `Bearer ${CF_TOKEN}` },
  });
  if (!res.ok) return 0;
  const text = await res.text();
  return parseInt(text, 10) || 0;
}

async function kvIncrement(key: string): Promise<void> {
  const current = await kvGet(key);
  await fetch(`${KV_BASE}/${key}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${CF_TOKEN}`, "Content-Type": "text/plain" },
    body: String(current + 1),
  });
}

export const trackStep = createServerFn({ method: "POST" })
  .validator(z.object({ step: z.string() }))
  .handler(async ({ data }) => {
    await kvIncrement(data.step);
    return { ok: true };
  });

export const getStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const counts = await Promise.all(STEPS.map(s => kvGet(s.key)));
    const total = counts[0] ?? 1;
    const steps = STEPS.map((s, i) => ({
      key: s.key,
      label: s.label,
      count: counts[i],
      pct: total > 0 ? Math.round((counts[i] / total) * 100) : 0,
    }));

    // Comparativo entre os 3 sites
    const [lp01Views, lp01Clicks, lp2Views, lp2Clicks] = await Promise.all([
      kvGet("lp01_page_view"),
      kvGet("lp01_checkout_click"),
      kvGet("lp2_page_view"),
      kvGet("lp2_checkout_click"),
    ]);
    const quizViews  = counts[0];
    const quizClicks = counts[7]; // 8_checkout_click

    const sites = [
      { id: "lp01", name: "LP 01 — Imersão", url: "lp01.pierryrodrigues.com.br", views: lp01Views, clicks: lp01Clicks },
      { id: "lp2",  name: "LP 2 — Pais",     url: "lp2.pierryrodrigues.com.br",  views: lp2Views,  clicks: lp2Clicks  },
      { id: "quiz", name: "Quiz",             url: "quiz.pierryrodrigues.com.br", views: quizViews, clicks: quizClicks },
    ].map(s => ({
      ...s,
      ctr: s.views > 0 ? Math.round((s.clicks / s.views) * 100) : 0,
    }));

    return { steps, total, sites };
  });
