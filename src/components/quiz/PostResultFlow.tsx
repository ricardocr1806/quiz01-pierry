import { useEffect, useState } from "react";

function fbq(...args: any[]) {
  if (typeof window !== "undefined" && (window as any).fbq) (window as any).fbq(...args);
}
import personSad from "@/assets/person-sad.jpg";
import personHappy from "@/assets/person-happy.jpg";
import familySad from "@/assets/family-sad.jpg";
import familyHappy from "@/assets/family-happy.jpg";
import pierryUrl from "@/assets/pierry.jpg";

type Flow = "flow1" | "flow2";

type Props = {
  flow: Flow;
  name: string;
  onRestart: () => void;
};

const RAINBOW = [
  "var(--rainbow-orange)",
  "var(--rainbow-yellow)",
  "var(--rainbow-green)",
  "var(--rainbow-blue)",
  "var(--rainbow-indigo)",
  "var(--rainbow-violet)",
];

const EVENT = {
  name: "De Frente com a Homossexualidade",
  dates: "04 e 05 de Julho",
  time: "Das 13h às 19h",
  format: "Online e Ao Vivo",
};

const COPY = {
  flow1: {
    /* ===== etapas anteriores ===== */
    reflectionTitle:
      "Agora que você começou a enxergar alguns padrões — você está disposto(a) a quebrar esse ciclo?",
    reflectionOptions: [
      "Sim — não quero perder meu filho",
      "Sim — mesmo que seja difícil encarar",
      "Acho que sim — quero tentar",
      "Ainda tenho medo do que vou encontrar",
    ],
    compareIntro:
      "Veja a diferença de quem vive em CICLO x quem decide RESTAURAR",
    leftTitle: "CICLO OCULTO",
    leftSubtitle: "O padrão diagnosticado nas suas respostas",
    rightTitle: "DECIDE RESTAURAR",
    rightSubtitle: "Quem passou pelo MAPA DA IDENTIDADE",
    sliders: [
      { label: "Padrão herdado da família", left: 78, right: 14 },
      { label: "Culpa sobre a criação", left: 81, right: 17 },
      { label: "Bloqueio de autoridade", left: 74, right: 19 },
      { label: "Conexão emocional com o filho", left: 22, right: 92 },
      { label: "Clareza para conversar", left: 18, right: 94 },
    ],
    quoteHeader:
      "E antes do Mapa da Identidade, a maioria dos pais contava a mesma história…",
    quote:
      "\"Eu rezo, eu tento conversar, eu me esforço… mas cada palavra parece empurrar meu filho pra mais longe.\"",
    quoteSub:
      "Pais e mães sentiam que algo invisível travava a relação — e não sabiam o que era.",
    transformTitle:
      "Depois de RESTAURAR A CONEXÃO no MAPA DA IDENTIDADE…",
    transformSubtitle: "Esses foram os resultados relatados",
    transformStats: [
      { value: "87%", text: "Quebraram padrões emocionais que afastavam o filho" },
      { value: "78%", text: "Retomaram conversas que pareciam impossíveis" },
    ],
    transformQuote:
      "Eles voltaram a conduzir o lar SEM medo, SEM ameaça e SEM perder o filho de vista.",

    /* ===== pitch final ===== */
    pitchKicker: "Ei {nome}…",
    pitchTitle: (
      <>
        Na imersão <span className="text-rainbow">De Frente com a Homossexualidade</span> você vai destravar a história do seu filho e mudar o destino da sua família.
      </>
    ),
    antesDepoisLabel: {
      antes: "Hoje na sua família",
      depois: "Depois da imersão",
    },
    antesDepoisCaption: [
      "Distância, silêncio e medo de errar",
      "Conexão restaurada, conversa sem culpa",
    ],
    receivedTitle: "VOCÊ RECEBERÁ:",
    mainCardTitle: "2 DIAS DE IMERSÃO AO VIVO",
    mainCardSub:
      "ENTENDER A HISTÓRIA DO SEU FILHO E ROMPER OS CICLOS DA SUA GERAÇÃO",
    pillars: [
      {
        title: "CAMINHO PARA UMA PATERNIDADE/MATERNIDADE SAUDÁVEL COM BASE EM PRINCÍPIOS BÍBLICOS",
        icon: "📖",
      },
      {
        title: "ENTENDER OS PADRÕES EMOCIONAIS QUE ESTÃO AFASTANDO SEU FILHO",
        icon: "🧠",
      },
    ],
    bibleQuote:
      "\"Enquanto você não curar aquilo que te feriu, você vai sangrar em cima de pessoas que não te cortaram.\"",
    progressTitle:
      "SEU PROGRESSO ESPERADO NA IMERSÃO DE FRENTE COM A HOMOSSEXUALIDADE",
    bullets: [
      { hl: "Você vai finalmente entender por que age como age", body: "Não é falta de fé. É um padrão que foi instalado na sua história — e que só muda quando você entende de onde veio." },
      { hl: "Você vai parar de sangrar em cima de quem não te cortou", body: "Seus relacionamentos e sua relação com seu filho vão mudar quando você identificar de onde vêm seus gatilhos." },
      { hl: "Você vai se ver como Deus te vê, não como as vozes do passado te viram", body: "Sua identidade não está no que disseram de você. Está em quem Ele diz que você é." },
      { hl: "Você vai ter ferramentas práticas para mudar ainda naquela semana", body: "Não é só teoria. Você sai com algo concreto para aplicar — e sentir a diferença imediatamente." },
      { hl: "Você vai entender como sua história está impactando a vida do seu filho", body: "O que não foi resolvido em você está chegando nele. A mentoria mostra como encerrar esse ciclo agora." },
      { hl: "Você vai receber direção prática de quem estuda e acompanha esse caminho", body: "Não é teoria solta — é um método para você aplicar e ver a diferença na sua família." },
    ],
  },

  flow2: {
    reflectionTitle:
      "Agora que você começou a enxergar alguns padrões — você está disposto(a) a olhar pra sua história de verdade?",
    reflectionOptions: [
      "Sim — eu mereço entender quem eu sou",
      "Sim — mesmo que seja doloroso",
      "Acho que sim — quero tentar",
      "Ainda tenho medo do que vou encontrar",
    ],
    compareIntro:
      "Veja a diferença de quem vive em CONFLITO x quem decide se RECONECTAR consigo",
    leftTitle: "CONFLITO OCULTO",
    leftSubtitle: "O padrão emocional diagnosticado",
    rightTitle: "RECONECTADO",
    rightSubtitle: "Quem percorreu o MAPA DA IDENTIDADE",
    sliders: [
      { label: "Sensação de não pertencer", left: 82, right: 13 },
      { label: "Necessidade de validação externa", left: 79, right: 18 },
      { label: "Peso da história não compreendida", left: 76, right: 16 },
      { label: "Clareza sobre quem eu sou", left: 16, right: 92 },
      { label: "Paz interior", left: 21, right: 88 },
    ],
    quoteHeader:
      "E antes do Mapa da Identidade, quase todos contavam a mesma história…",
    quote:
      "\"Eu pareço inteiro por fora, mas por dentro existe um vazio que nenhum relacionamento preenche.\"",
    quoteSub:
      "Pessoas sentiam que algo invisível segurava a vida delas no lugar — e não sabiam o nome do que sentiam.",
    transformTitle:
      "Depois de RESTAURAR A IDENTIDADE no MAPA DA IDENTIDADE…",
    transformSubtitle: "Esses foram os resultados relatados",
    transformStats: [
      { value: "89%", text: "Compreenderam a raiz das feridas que carregavam há anos" },
      { value: "84%", text: "Encontraram paz e clareza sobre quem realmente são" },
    ],
    transformQuote:
      "Eles deixaram de ser definidos pelas feridas e voltaram a se enxergar para além de qualquer rótulo.",

    pitchKicker: "Ei {nome}…",
    pitchTitle: (
      <>
        Na imersão <span className="text-rainbow">De Frente com a Homossexualidade</span> você vai destravar sua história e voltar a se enxergar para além de qualquer rótulo.
      </>
    ),
    antesDepoisLabel: {
      antes: "Como você se sente hoje",
      depois: "Depois da imersão",
    },
    antesDepoisCaption: [
      "Vazio, dúvida e busca por encaixe",
      "Clareza sobre quem você é de verdade",
    ],
    receivedTitle: "VOCÊ RECEBERÁ:",
    mainCardTitle: "2 DIAS DE IMERSÃO AO VIVO",
    mainCardSub:
      "ENTENDER SUA HISTÓRIA E REENCONTRAR SUA ESSÊNCIA NO SEU PRÓPRIO RITMO",
    pillars: [
      {
        title: "CAMINHO PARA UMA IDENTIDADE SAUDÁVEL COM BASE EM PRINCÍPIOS BÍBLICOS",
        icon: "📖",
      },
      {
        title: "ENTENDER AS FERIDAS EMOCIONAIS QUE AINDA DIRIGEM SUAS ESCOLHAS",
        icon: "🧠",
      },
    ],
    bibleQuote:
      "\"Enquanto você não curar aquilo que te feriu, você vai sangrar em cima de pessoas que não te cortaram.\"",
    progressTitle:
      "SEU PROGRESSO ESPERADO NA IMERSÃO DE FRENTE COM A HOMOSSEXUALIDADE",
    bullets: [
      { hl: "Você vai finalmente entender por que sente o que sente", body: "Não é frescura. Não é falta de fé. É uma história que precisa ser olhada com verdade — e que só muda quando você entende de onde veio." },
      { hl: "Você vai parar de tentar se encaixar para ser aceito", body: "Suas relações mudam quando você identifica de onde vêm os gatilhos — e para de descarregar dor antiga em quem te ama." },
      { hl: "Você vai se ver como Deus te vê, não como as vozes do passado te viram", body: "Sua identidade não está no que disseram de você. Está em quem Ele diz que você é. E essa descoberta muda tudo." },
      { hl: "Você vai ter ferramentas práticas para mudar ainda naquela semana", body: "Não é só teoria, não é só emoção. Você sai com algo concreto para aplicar — e sentir a diferença imediatamente." },
      { hl: "Você vai entender como sua história está impactando seus relacionamentos", body: "O que não foi resolvido em você chega em quem está perto. A mentoria mostra como encerrar esse ciclo agora." },
      { hl: "Você vai receber direção prática para aplicar dentro da sua semana", body: "Não é teoria solta — é um método para você aplicar e sentir mudança real em quem você é." },
    ],
  },
};

const BONUSES = [
  {
    code: "BÔNUS 01",
    title: "O CÓDIGO SECRETO DA IDENTIDADE",
    desc: "Como a mente constrói a identidade desde a infância, o que ela absorve sem você perceber, e como usar isso para construir um vínculo real e saudável.",
    price: "R$ 797,00",
    icon: "🔑",
    accent: "var(--rainbow-violet)",
  },
  {
    code: "BÔNUS 02",
    title: "OS 5 PILARES DE UMA FAMÍLIA FORTE",
    desc: "Família forte não é sorte. É construção. Descubra os 5 pilares fundamentais que sustentam uma união saudável e blindada contra qualquer tempestade.",
    price: "R$ 597,00",
    icon: "🏛️",
    accent: "var(--rainbow-indigo)",
  },
  {
    code: "BÔNUS 03",
    title: "CONEXÃO COM OS FILHOS",
    desc: "Crie vínculos reais, comunique com clareza e lidere com amor — sem gritar, sem culpa e sem perder a referência.",
    price: "R$ 197,00",
    icon: "💛",
    accent: "var(--rainbow-yellow)",
  },
  {
    code: "BÔNUS 04",
    title: "DE FRENTE COM A FÉ",
    desc: "Como sustentar princípios bíblicos com verdade e amor — sem fanatismo, sem rejeição, sem perder a relação com quem você ama.",
    price: "R$ 397,00",
    icon: "✝️",
    accent: "var(--rainbow-blue)",
  },
] as const;

const STACK = [
  { name: "2 DIAS DE IMERSÃO AO VIVO", price: "R$ 397" },
  { name: "O CÓDIGO SECRETO DA IDENTIDADE", price: "R$ 797" },
  { name: "OS 5 PILARES DE UMA FAMÍLIA FORTE", price: "R$ 597" },
  { name: "CONEXÃO COM OS FILHOS", price: "R$ 197" },
];

const ANTES = [
  "Repetir reações da sua história sem entender de onde vêm",
  "Sentir culpa por padrões que você nem escolheu ter",
  "Sangrar em cima de quem não te cortou — na família, no amor, nas amizades",
  "Aceitar menos do que merece por achar que essa é sua identidade",
  "Sentir que está vivendo no automático, sem entender por quê",
];

const DEPOIS = [
  "Dormir tranquilo sabendo de onde vêm seus padrões — e como mudar",
  "Romper com a culpa do passado e viver com mais leveza no presente",
  "Trazer paz pro seu lar e parar de repetir os mesmos conflitos",
  "Ver mudança real nos seus relacionamentos — sem se afastar da fé",
  "Romper o ciclo emocional que marcou sua família por gerações",
  "Construir uma referência diferente da que você recebeu — sem se destruir no caminho",
];

const RESULT_STATS = [
  { value: 83, text: "identificaram e começaram a romper padrões herdados já nas primeiras semanas." },
  { value: 88, text: "disseram que finalmente entenderam por que a vida estava travada." },
  { value: 95, text: "disseram que entenderam de onde vêm seus bloqueios — e sentiram clareza sobre o que fazer agora." },
  { value: 84, text: "com o mesmo perfil que o seu já vivem com mais paz, conexão e propósito após o treinamento." },
];

type Step = "reflection" | "comparison" | "story" | "transformation" | "pitch";

export function PostResultFlow({ flow, name, onRestart }: Props) {
  const [step, setStep] = useState<Step>("reflection");
  const c = COPY[flow];
  const displayName = name || "amigo(a)";

  const next = (s: Step) => () => setStep(s);

  return (
    <div className="w-full">
      {step === "reflection" && (
        <Reflection title={c.reflectionTitle} options={c.reflectionOptions} onSelect={next("comparison")} />
      )}
      {step === "comparison" && (
        <Comparison
          intro={c.compareIntro}
          leftTitle={c.leftTitle}
          leftSubtitle={c.leftSubtitle}
          rightTitle={c.rightTitle}
          rightSubtitle={c.rightSubtitle}
          sliders={c.sliders.slice()}
          onNext={next("story")}
        />
      )}
      {step === "story" && (
        <Story header={c.quoteHeader} quote={c.quote} sub={c.quoteSub} onNext={next("transformation")} />
      )}
      {step === "transformation" && (
        <Transformation
          title={c.transformTitle}
          subtitle={c.transformSubtitle}
          stats={c.transformStats.slice()}
          quote={c.transformQuote}
          onNext={next("pitch")}
        />
      )}
      {step === "pitch" && <FinalPitch flow={flow} name={displayName} onRestart={onRestart} />}
    </div>
  );
}

/* ============ STEP 1: REFLECTION ============ */
function Reflection({ title, options, onSelect }: { title: string; options: string[]; onSelect: () => void }) {
  const emojis = ["😔", "😌", "🙂", "😟"];
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-balance text-center">{title}</h2>
      <div className="mt-8 space-y-3">
        {options.map((opt, i) => {
          const col = RAINBOW[i % RAINBOW.length];
          return (
            <button
              key={opt}
              onClick={onSelect}
              className="w-full flex items-center gap-3 rounded-2xl border-2 bg-card px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: `color-mix(in oklab, ${col} 35%, white)` }}
            >
              <span className="text-2xl" aria-hidden>{emojis[i]}</span>
              <span className="font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============ STEP 2: COMPARISON ============ */
function Comparison({
  intro, leftTitle, leftSubtitle, rightTitle, rightSubtitle, sliders, onNext,
}: {
  intro: string; leftTitle: string; leftSubtitle: string; rightTitle: string; rightSubtitle: string;
  sliders: { label: string; left: number; right: number }[]; onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-center text-balance">{intro}</h2>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="rounded-2xl border-2 p-4 text-center" style={{ borderColor: "color-mix(in oklab, var(--rainbow-orange) 40%, white)" }}>
          <div className="font-bold" style={{ color: "var(--rainbow-orange)" }}>{leftTitle}</div>
          <p className="text-xs mt-2 text-muted-foreground">{leftSubtitle}</p>
        </div>
        <div className="rounded-2xl border-2 p-4 text-center" style={{ borderColor: "color-mix(in oklab, var(--rainbow-green) 40%, white)" }}>
          <div className="font-bold" style={{ color: "var(--rainbow-green)" }}>{rightTitle}</div>
          <p className="text-xs mt-2 text-muted-foreground">{rightSubtitle}</p>
        </div>
      </div>
      <div className="mt-6 space-y-5">
        {sliders.map((s) => (
          <div key={s.label} className="grid grid-cols-2 gap-4">
            <Bar label={s.label} value={s.left} color="var(--rainbow-orange)" />
            <Bar label={s.label} value={s.right} color="var(--rainbow-green)" align="right" />
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="mt-10 w-full py-4 rounded-full font-semibold text-white text-base sm:text-lg shadow-lg transition-transform hover:-translate-y-0.5"
        style={{ background: "var(--gradient-rainbow-no-red)" }}
      >
        Continuar
      </button>
    </div>
  );
}

function Bar({ label, value, color, align = "left" }: { label: string; value: number; color: string; align?: "left" | "right" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className={`text-muted-foreground ${align === "right" ? "order-2" : ""}`}>{label}</span>
        <span className="font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-accent overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

/* ============ STEP 3: STORY ============ */
function Story({ header, quote, sub, onNext }: { header: string; quote: string; sub: string; onNext: () => void }) {
  return (
    <div>
      <p className="text-center text-sm text-muted-foreground text-balance">{header}</p>
      <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-center text-balance">{quote}</h2>
      <p className="mt-6 text-center text-sm text-foreground text-balance">{sub}</p>
      <div
        className="mt-8 rounded-2xl border-2 p-5"
        style={{
          borderColor: "color-mix(in oklab, var(--rainbow-violet) 30%, white)",
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--rainbow-yellow) 12%, white), color-mix(in oklab, var(--rainbow-violet) 8%, white))",
        }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">Situação relatada:</div>
        <div className="mt-3 flex items-end justify-around h-32 gap-2">
          {[55, 78, 92, 70, 45, 28, 18].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md transition-all"
              style={{
                height: `${h}%`,
                background:
                  i < 3
                    ? "linear-gradient(180deg, var(--rainbow-orange), var(--rainbow-yellow))"
                    : "linear-gradient(180deg, var(--rainbow-yellow), var(--rainbow-green))",
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>Começo</span><span>1 mês</span><span>2 meses</span><span>3 meses</span>
        </div>
      </div>
      <p className="mt-6 text-center font-bold text-foreground">ERA MUITO ESFORÇO PARA POUCO RESULTADO</p>
      <button
        onClick={onNext}
        className="mt-8 w-full py-4 rounded-full font-semibold text-white text-base sm:text-lg shadow-lg transition-transform hover:-translate-y-0.5"
        style={{ background: "var(--gradient-rainbow-no-red)" }}
      >
        Continuar
      </button>
    </div>
  );
}

/* ============ STEP 4: TRANSFORMATION ============ */
function Transformation({
  title, subtitle, stats, quote, onNext,
}: {
  title: string; subtitle: string; stats: { value: string; text: string }[]; quote: string; onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-center text-balance">{title}</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {stats.map((s, i) => {
          const col = i === 0 ? "var(--rainbow-green)" : "var(--rainbow-blue)";
          return (
            <div key={s.value} className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: `color-mix(in oklab, ${col} 35%, white)` }}>
              <div
                className="mx-auto w-28 h-28 rounded-full grid place-items-center"
                style={{ background: `conic-gradient(${col} ${parseInt(s.value)}%, color-mix(in oklab, ${col} 12%, white) 0)` }}
              >
                <div className="w-20 h-20 rounded-full bg-card grid place-items-center font-bold text-xl" style={{ color: col }}>
                  {s.value}
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground text-balance">{s.text}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-2xl p-5 text-center font-semibold text-foreground" style={{ background: "color-mix(in oklab, var(--rainbow-green) 15%, white)" }}>
        {quote}
      </div>
      <button
        onClick={onNext}
        className="mt-8 w-full py-4 rounded-full font-semibold text-white text-base sm:text-lg shadow-lg transition-transform hover:-translate-y-0.5"
        style={{ background: "var(--gradient-rainbow-no-red)" }}
      >
        Continuar
      </button>
    </div>
  );
}

/* ===============================================================
   STEP 5: FINAL PITCH (long-scroll, mirrors reference screenshots)
   =============================================================== */
function FinalPitch({ flow, name, onRestart }: { flow: Flow; name: string; onRestart: () => void }) {
  const c = COPY[flow];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HERO */}
      <section>
        <div className="text-center text-sm font-medium text-muted-foreground">
          {c.pitchKicker.replace("{nome}", name)}
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-center text-balance leading-tight">
          {c.pitchTitle}
        </h2>

        {/* Antes / Depois */}
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <FamilyCard flow={flow} label="ANTES" mood="bad" caption={c.antesDepoisCaption[0]} subLabel={c.antesDepoisLabel.antes} />
          <div className="text-2xl font-black text-muted-foreground">›››</div>
          <FamilyCard flow={flow} label="DEPOIS" mood="good" caption={c.antesDepoisCaption[1]} subLabel={c.antesDepoisLabel.depois} />
        </div>
      </section>

      {/* VOCÊ RECEBERÁ */}
      <section>
        <div className="rounded-full mx-auto w-fit px-4 py-1 text-sm font-semibold text-muted-foreground bg-accent">
          {name}…
        </div>
        <h3 className="mt-3 text-center text-xl font-extrabold">{c.receivedTitle}</h3>

        <div
          className="mt-4 rounded-2xl border-2 overflow-hidden"
          style={{ borderColor: "color-mix(in oklab, var(--rainbow-violet) 40%, white)" }}
        >
          <div className="relative aspect-[2/3] sm:aspect-[3/4] overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0033, #4a0066)" }}>
            <img
              src={pierryUrl}
              alt="Pierry — instrutor da imersão"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)" }} />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
              <div className="text-[10px] uppercase tracking-widest opacity-80">Imersão Online • Com Pierry</div>
              <div className="mt-1 font-serif text-2xl italic">De Frente com</div>
              <div className="font-serif text-2xl italic text-rainbow">a Homossexualidade</div>
              <div className="mt-2 text-[11px] opacity-90">{EVENT.dates} • {EVENT.time}</div>
            </div>
          </div>
          <div className="p-4 bg-card text-center">
            <div className="inline-block font-extrabold px-2 py-0.5" style={{ background: "color-mix(in oklab, var(--rainbow-yellow) 70%, white)" }}>
              {c.mainCardTitle}
            </div>
            <p className="mt-2 font-bold text-foreground text-sm">{c.mainCardSub}</p>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.pillars.map((p, i) => (
            <div key={i} className="rounded-2xl border-2 bg-card overflow-hidden" style={{ borderColor: "color-mix(in oklab, var(--rainbow-blue) 30%, white)" }}>
              <div className="h-32 grid place-items-center text-5xl" style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${RAINBOW[i+2]} 20%, white), color-mix(in oklab, ${RAINBOW[i+3]} 20%, white))` }}>
                {p.icon}
              </div>
              <div className="p-4 text-center font-bold text-sm">{p.title}</div>
            </div>
          ))}
        </div>

        {/* Bible quote */}
        <div className="mt-5 rounded-2xl p-5 text-center text-white font-bold italic text-base" style={{ background: "var(--rainbow-violet)" }}>
          {c.bibleQuote}
        </div>
      </section>

      {/* PROGRESS CHART */}
      <section>
        <h3 className="text-center font-extrabold text-balance text-lg">{c.progressTitle}</h3>
        <p className="mt-1 text-center text-xs text-muted-foreground">(com base nas suas respostas)</p>
        <ProgressChart />
      </section>

      {/* BULLETS */}
      <section className="space-y-3">
        <div className="rounded-2xl p-4 text-center font-extrabold text-xl" style={{ background: "color-mix(in oklab, var(--rainbow-indigo) 15%, white)" }}>
          2 DIAS DE IMERSÃO AO VIVO
        </div>
        {c.bullets.map((b, i) => (
          <div key={i}>
            <div className="rounded-2xl p-3 font-bold text-foreground text-sm" style={{ background: "color-mix(in oklab, var(--rainbow-green) 22%, white)" }}>
              {b.hl}
            </div>
            <div className="mt-2 rounded-2xl p-3 bg-card border text-sm text-foreground">
              {b.body}
            </div>
          </div>
        ))}
        <div className="rounded-full mx-auto w-fit px-4 py-1 text-sm font-semibold text-muted-foreground bg-accent">
          É muita praticidade, {name}…
        </div>
      </section>

      {/* BÔNUS — removidos temporariamente. Quando voltarem, repor BONUSES + STACK + total seguindo o padrão anterior. */}


      {/* CHECKOUT BLOCK */}
      <Checkout name={name} />

      {/* RESULT STATS */}
      <section>
        <p className="text-center text-sm text-muted-foreground italic">de acordo com as suas respostas…</p>
        <h3 className="mt-2 text-center font-extrabold text-balance">
          Pessoas como você conseguiram excelentes resultados com a
        </h3>
        <div className="mt-1 text-center text-2xl font-extrabold" style={{ color: "var(--rainbow-green)" }}>
          IMERSÃO DE FRENTE COM A HOMOSSEXUALIDADE
        </div>

        <div className="mt-5 space-y-4">
          {RESULT_STATS.map((s) => (
            <div key={s.value} className="rounded-2xl border-2 bg-card p-5 flex flex-col items-center text-center" style={{ borderColor: "color-mix(in oklab, var(--rainbow-green) 25%, white)" }}>
              <Donut value={s.value} />
              <p className="mt-3 text-sm text-foreground text-balance">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ANTES / DEPOIS lists */}
      <section>
        <h3 className="text-center text-xl font-extrabold" style={{ color: "var(--rainbow-orange)" }}>
          A VIDA ANTES DA IMERSÃO
        </h3>
        <div className="mt-3 rounded-2xl p-3 text-center text-sm font-semibold italic text-foreground bg-accent">
          Durante a imersão você vai resolver esses pontos de uma vez por todas:
        </div>
        <div className="mt-3 space-y-2">
          {ANTES.map((a) => (
            <div key={a} className="rounded-2xl p-3 text-sm font-medium" style={{ background: "color-mix(in oklab, var(--rainbow-orange) 15%, white)" }}>
              ❌ {a}
            </div>
          ))}
        </div>

        <h3 className="mt-8 text-center text-xl font-extrabold" style={{ color: "var(--rainbow-green)" }}>
          A VIDA DEPOIS DA IMERSÃO DE FRENTE COM A HOMOSSEXUALIDADE
        </h3>
        <div className="mt-3 rounded-2xl p-3 text-center text-sm font-semibold italic text-foreground bg-accent">
          Essa será sua realidade como participante da imersão. Você vai:
        </div>
        <div className="mt-3 space-y-2">
          {DEPOIS.map((d) => (
            <div key={d} className="rounded-2xl p-3 text-sm font-medium" style={{ background: "color-mix(in oklab, var(--rainbow-green) 18%, white)" }}>
              ✅ {d}
            </div>
          ))}
        </div>
      </section>

      {/* (seção de depoimento removida) */}

      {/* CTA FINAL CARD */}
      <section>
        <h3 className="text-center text-2xl font-extrabold" style={{ color: "var(--rainbow-green)" }}>
          COM OS 2 DIAS DE IMERSÃO SERÁ CAPAZ DE TRANSFORMAR SUA VIDA E A DE QUEM VOCÊ AMA:
        </h3>
        <div className="mt-4 space-y-2">
          {[
            "Entender de onde vêm os padrões que afetam sua família",
            "Ter conversas reais com seu filho(a) sem culpa ou distância",
            "Romper ciclos emocionais que se repetem há gerações",
            "Conduzir seu lar com amor, verdade e princípios bíblicos",
            "Voltar a dormir com paz sabendo que está no caminho certo",
          ].map((d) => (
            <div key={d} className="rounded-2xl p-3 text-sm font-medium" style={{ background: "color-mix(in oklab, var(--rainbow-green) 18%, white)" }}>
              ✅ {d}
            </div>
          ))}
        </div>
      </section>

      {/* GARANTIA */}
      <section className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: "color-mix(in oklab, var(--rainbow-green) 40%, white)", background: "color-mix(in oklab, var(--rainbow-green) 10%, white)" }}>
        <div className="mx-auto w-12 h-12 rounded-full grid place-items-center text-2xl" style={{ background: "var(--rainbow-green)" }}>🛡️</div>
        <h3 className="mt-3 text-lg font-extrabold" style={{ color: "var(--rainbow-green)" }}>GARANTIA DE 7 DIAS</h3>
        <p className="mt-2 text-sm text-foreground text-balance">
          Você tem <span className="font-bold">7 dias de garantia incondicional</span>. Se não sentir que a imersão fez sentido para você, devolvemos <span className="font-bold">100% do seu investimento</span> — sem burocracia e sem perguntas.
        </p>
      </section>

      {/* FINAL */}
      <section className="text-center space-y-3">
        <h3 className="text-2xl font-extrabold text-rainbow">
          NA IMERSÃO DE FRENTE COM A HOMOSSEXUALIDADE
        </h3>
        <p className="text-sm text-foreground">
          Vai <span className="font-bold">romper os padrões emocionais</span> que estão impactando a sua história…
        </p>
        <p className="text-sm text-foreground text-balance">
          Você receberá <span className="font-bold">TUDO QUE PRECISA</span> para <span className="font-bold">REPROGRAMAR</span> sua mente e <span className="font-bold">VIVER COM VERDADE E AMOR</span> — sem desvirtuar dos princípios bíblicos.
        </p>
        <p className="text-sm text-muted-foreground">Use o botão fixo abaixo para garantir sua vaga.</p>
      </section>

      {/* spacer para o botão fixo */}
      <div aria-hidden className="h-24" />

      {/* BOTÃO FIXO ÚNICO */}
      <div className="fixed bottom-0 inset-x-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 bg-gradient-to-t from-background via-background/95 to-background/0">
        <div className="mx-auto max-w-2xl">
          <a
            href="https://pay.assiny.com.br/1d926e/node/3fZr7o"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => fbq("track", "InitiateCheckout", { value: 19.90, currency: "BRL", content_name: "De Frente com a Homossexualidade" })}
            className="block w-full py-4 rounded-full font-bold text-white text-base sm:text-lg shadow-2xl transition-transform hover:-translate-y-0.5 text-center"
            style={{ background: "var(--gradient-rainbow-no-red)" }}
          >
            QUERO MINHA VAGA POR R$ 19,90 →

          </a>
        </div>
      </div>
    </div>
  );
}

/* ============ CHECKOUT BLOCK ============ */
function Checkout({ name }: { name: string }) {
  const [secs, setSecs] = useState(10 * 60);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <section>
      <div
        className="rounded-2xl border-2 p-5 text-center"
        style={{
          borderColor: "color-mix(in oklab, var(--rainbow-yellow) 50%, white)",
          background: "color-mix(in oklab, var(--rainbow-yellow) 18%, white)",
        }}
      >
        <div className="font-bold text-foreground">Seu cupom de desconto foi aplicado!</div>
        <div className="mt-2 text-sm">
          ✅ <span className="font-semibold">{name}</span>{" "}
          <span style={{ color: "var(--rainbow-green)" }} className="font-bold">81% OFF</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          O desconto está reservado por: <span className="font-semibold" style={{ color: "var(--rainbow-green)" }}>{mm}:{ss} minutos</span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl overflow-hidden border-2" style={{ borderColor: "var(--rainbow-violet)" }}>
        <div className="py-2 text-center text-white font-bold text-sm" style={{ background: "var(--gradient-rainbow-no-red)" }}>
          81% OFF
        </div>
        <div className="p-5 flex items-center gap-4 bg-card">
          <div className="flex-1">
            <div className="font-bold text-lg">2 DIAS DE IMERSÃO AO VIVO</div>
            <div className="text-xs text-muted-foreground mt-1">
              {EVENT.name} — {EVENT.dates} • {EVENT.time}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              De <span className="line-through">R$ 197,00</span> por
            </div>
            <div className="text-2xl font-extrabold" style={{ color: "var(--rainbow-violet)" }}>R$ 19,90</div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-muted-foreground">Pagamento via Cartão, Pix ou Boleto</div>
      <div className="mt-3 flex items-center justify-center gap-2 text-sm">
        <span style={{ color: "var(--rainbow-yellow)" }}>★★★★★</span>
        <span className="text-muted-foreground">4.8 estrelas de 1912 avaliações</span>
      </div>

    </section>
  );
}

/* ============ ANTES/DEPOIS family illustration card ============ */
function FamilyCard({ flow, label, mood, caption, subLabel }: { flow: Flow; label: string; mood: "bad" | "good"; caption: string; subLabel: string }) {
  const color = mood === "bad" ? "var(--rainbow-orange)" : "var(--rainbow-green)";
  const arrow = mood === "bad" ? "↘" : "↗";
  const img =
    flow === "flow1"
      ? mood === "bad" ? familySad : familyHappy
      : mood === "bad" ? personSad : personHappy;
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm font-extrabold" style={{ color }}>{label}</div>
      <div
        className="mt-1 w-full aspect-[3/4] rounded-2xl border-2 bg-card relative overflow-hidden"
        style={{ borderColor: `color-mix(in oklab, ${color} 35%, white)`, background: `linear-gradient(180deg, color-mix(in oklab, ${color} 8%, white), white)` }}
      >
        <div className="absolute top-2 right-2 text-2xl font-black z-10" style={{ color }}>{arrow}</div>
        <img src={img} alt={subLabel} loading="lazy" width={1024} height={1024} className="absolute inset-0 w-full h-full object-contain p-2" />
        <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-semibold text-muted-foreground px-2">{subLabel}</div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground text-center px-1">{caption}</p>
    </div>
  );
}

/* ============ Progress chart ============ */
function ProgressChart() {
  const points = [
    { x: 8, y: 88, label: "Bloqueado", color: "var(--rainbow-orange)" },
    { x: 36, y: 60, label: "Clareza", color: "var(--rainbow-yellow)" },
    { x: 64, y: 28, label: "Primeiras vitórias", color: "var(--rainbow-green)" },
    { x: 92, y: 10, label: "Novo padrão mental", color: "var(--rainbow-green)" },
  ];
  return (
    <div className="mt-4 rounded-2xl border-2 bg-card p-4" style={{ borderColor: "color-mix(in oklab, var(--rainbow-green) 30%, white)" }}>
      <div className="relative h-52 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="line" x1="0" x2="1">
              <stop offset="0%" stopColor="var(--rainbow-orange)" />
              <stop offset="50%" stopColor="var(--rainbow-yellow)" />
              <stop offset="100%" stopColor="var(--rainbow-green)" />
            </linearGradient>
            <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="color-mix(in oklab, var(--rainbow-green) 30%, white)" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="color-mix(in oklab, var(--muted) 30%, white)" strokeDasharray="1 1" strokeWidth="0.3" />
          ))}
          <path d={`M ${points.map((p) => `${p.x},${p.y}`).join(" L ")} L 92,100 L 8,100 Z`} fill="url(#fill)" />
          <path d={`M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`} fill="none" stroke="url(#line)" strokeWidth="1.5" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.6" fill={p.color} />
          ))}
        </svg>
        {points.map((p, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-full rounded-md px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap"
            style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.color }}
          >
            {p.label}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>Hoje</span><span>Semana 1</span><span>Semana 2</span><span>Semana 3</span>
      </div>
    </div>
  );
}

/* ============ Donut ============ */
function Donut({ value }: { value: number }) {
  const color = "var(--rainbow-green)";
  return (
    <div
      className="w-28 h-28 rounded-full grid place-items-center"
      style={{ background: `conic-gradient(${color} ${value}%, color-mix(in oklab, ${color} 10%, white) 0)` }}
    >
      <div className="w-20 h-20 rounded-full bg-card grid place-items-center font-extrabold text-xl">
        {value}%
      </div>
    </div>
  );
}
