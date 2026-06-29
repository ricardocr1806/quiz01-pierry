import { createFileRoute } from "@tanstack/react-router";
import { getStats } from "@/lib/analytics";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Quiz Analytics" }, { name: "robots", content: "noindex" }] }),
  loader: async () => getStats(),
  component: Dashboard,
});

function Bar({ pct }: { pct: number }) {
  const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#eab308" : "#ef4444";
  return (
    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
      <div
        className="h-4 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function Dashboard() {
  const data = Route.useLoaderData();
  const steps = data.steps ?? [];
  const total = data.total ?? 0;
  const sites = (data as any).sites ?? [];

  const checkoutStep = steps.find((s: any) => s.key === "8_checkout_click");
  const leadStep = steps.find((s: any) => s.key === "6_lead_submit");

  const SITE_COLORS: Record<string, string> = {
    lp01: "#6366f1",
    lp2:  "#f59e0b",
    quiz: "#22c55e",
  };

  const best = sites.length > 0
    ? sites.reduce((a: any, b: any) => (b.ctr > a.ctr ? b : a), sites[0])
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-500 mt-1">Pierry Rodrigues</p>
        </div>

        {/* Comparativo CTR */}
        {sites.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">Taxa de clique no checkout (CTR)</h2>
              {best && sites.some((s: any) => s.views > 0) && (
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
                  Melhor: {best.name}
                </span>
              )}
            </div>
            <div className="divide-y">
              {sites.map((s: any) => (
                <div key={s.id} className="px-6 py-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: SITE_COLORS[s.id] ?? "#888" }} />
                        <span className="font-semibold text-gray-800">{s.name}</span>
                        {best && s.id === best.id && s.views > 0 && (
                          <span className="text-xs bg-green-100 text-green-600 font-bold px-1.5 py-0.5 rounded">Melhor</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 ml-4">{s.url}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold" style={{ color: SITE_COLORS[s.id] ?? "#888" }}>{s.ctr}%</span>
                      <div className="text-xs text-gray-400">{s.clicks} cliques / {s.views} visitas</div>
                    </div>
                  </div>
                  <Bar pct={s.ctr} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KPIs do quiz */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
            <div className="text-3xl font-bold text-green-500">{leadStep?.pct ?? 0}%</div>
            <div className="text-sm text-gray-500 mt-1">Enviaram lead</div>
            <div className="text-xs text-gray-400">{leadStep?.count?.toLocaleString("pt-BR") ?? 0} pessoas</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
            <div className="text-3xl font-bold text-violet-500">{checkoutStep?.pct ?? 0}%</div>
            <div className="text-sm text-gray-500 mt-1">Clicaram no checkout</div>
            <div className="text-xs text-gray-400">{checkoutStep?.count?.toLocaleString("pt-BR") ?? 0} pessoas</div>
          </div>
        </div>

        {/* Funil do quiz */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">Funil do Quiz</h2>
            <span className="text-xs text-gray-400">{total.toLocaleString("pt-BR")} sessões</span>
          </div>
          <div className="divide-y">
            {steps.map((s: any, i: number) => (
              <div key={s.key} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-800">{s.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{s.pct}%</span>
                    <span className="text-xs text-gray-400 ml-2">({s.count?.toLocaleString("pt-BR")})</span>
                  </div>
                </div>
                <Bar pct={s.pct} />
                {i > 0 && steps[i - 1]?.count > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    ↓ {Math.round((s.count / steps[i - 1].count) * 100)}% da etapa anterior
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Atualizado em tempo real · quiz.pierryrodrigues.com.br/dashboard
        </p>
      </div>
    </div>
  );
}
