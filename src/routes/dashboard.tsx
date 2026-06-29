import { createFileRoute } from "@tanstack/react-router";
import { getStats, STEPS } from "@/lib/analytics";

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
  const { steps, total } = Route.useLoaderData();

  const checkoutStep = steps.find(s => s.key === "8_checkout_click");
  const leadStep = steps.find(s => s.key === "6_lead_submit");

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard do Quiz</h1>
          <p className="text-gray-500 mt-1">Funil de conversão — total de sessões: <strong>{total.toLocaleString("pt-BR")}</strong></p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
            <div className="text-3xl font-bold text-green-500">{leadStep?.pct ?? 0}%</div>
            <div className="text-sm text-gray-500 mt-1">Enviaram lead</div>
            <div className="text-xs text-gray-400">{leadStep?.count.toLocaleString("pt-BR")} pessoas</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
            <div className="text-3xl font-bold text-violet-500">{checkoutStep?.pct ?? 0}%</div>
            <div className="text-sm text-gray-500 mt-1">Clicaram no checkout</div>
            <div className="text-xs text-gray-400">{checkoutStep?.count.toLocaleString("pt-BR")} pessoas</div>
          </div>
        </div>

        {/* Funil por etapa */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-700">Etapas do funil</h2>
          </div>
          <div className="divide-y">
            {steps.map((s, i) => (
              <div key={s.key} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-800">{s.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{s.pct}%</span>
                    <span className="text-xs text-gray-400 ml-2">({s.count.toLocaleString("pt-BR")})</span>
                  </div>
                </div>
                <Bar pct={s.pct} />
                {i > 0 && steps[i - 1].count > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    ↓ {Math.round((s.count / steps[i - 1].count) * 100)}% dos que passaram pela etapa anterior
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
