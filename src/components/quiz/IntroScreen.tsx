type Props = { onStart: () => void };

export function IntroScreen({ onStart }: Props) {
  return (
    <div className="w-full text-center">
      <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-6">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--gradient-rainbow)" }} />
        Diagnóstico gratuito
      </div>
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance leading-tight">
        Mapa da{" "}
        <span
          style={{
            backgroundImage: "var(--gradient-rainbow)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Identidade Homossexual
        </span>
      </h1>
      <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto text-balance">
        Descubra o que pode estar por trás dos conflitos de identidade, da homossexualidade e dos afastamentos familiares.
      </p>

      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
        {[
          { c: "var(--rainbow-orange)", t: "Para pais e responsáveis" },
          { c: "var(--rainbow-blue)", t: "Para quem vive a questão" },
          { c: "var(--rainbow-violet)", t: "Resultado personalizado" },
        ].map((item) => (
          <li
            key={item.t}
            className="rounded-2xl border-2 p-4 bg-card flex items-center gap-3"
            style={{ borderColor: `color-mix(in oklab, ${item.c} 30%, white)` }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.c }}
            />
            <span className="text-sm font-medium">{item.t}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onStart}
        className="mt-10 inline-block w-full sm:w-auto px-10 py-4 rounded-full font-semibold text-white text-base sm:text-lg shadow-xl transition-transform hover:-translate-y-0.5"
        style={{ background: "var(--gradient-rainbow)" }}
      >
        Começar diagnóstico
      </button>
      <p className="mt-4 text-xs text-muted-foreground">Leva menos de 3 minutos.</p>
    </div>
  );
}
