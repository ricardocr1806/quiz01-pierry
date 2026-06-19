import { useEffect, useState } from 'react'

const CHECKOUT_URL = 'https://pay.hotmart.com/...'
const PRICE = 'R$ 37,00'
const ORIGINAL_PRICE = 'R$ 97,00'

type Lead = {
  name?: string
  flow?: 'parents' | 'person'
  score?: number
}

export default function ResultPage({ onRestart }: { onRestart: () => void }) {
  const [lead, setLead] = useState<Lead>({})
  const [timeLeft, setTimeLeft] = useState(14 * 60)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('quiz_lead')
      if (raw) setLead(JSON.parse(raw))
    } catch {}
    const timer = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const name = lead.name?.split(' ')[0] ?? ''
  const isParents = lead.flow === 'parents'

  const faqs = isParents
    ? [
        { q: 'Preciso que meu filho saiba que estou participando?', a: 'Não. Esta imersão é para você. Você aprenderá a compreender e a se posicionar da forma certa — com ou sem a presença do seu filho.' },
        { q: 'Vou aprender a mudar meu filho?', a: 'Não. Você vai aprender a mudar sua abordagem para que a conexão com ele seja restaurada. A transformação do outro começa quando você se transforma na relação.' },
        { q: 'Posso participar se meu filho já saiu de casa?', a: 'Sim. A restauração de vínculos pode acontecer em qualquer fase da relação.' },
        { q: 'O evento é online?', a: 'Sim. 100% online e ao vivo, via Zoom. Você participará de casa.' },
      ]
    : [
        { q: 'Vou ser julgado ou condenado no evento?', a: 'Não. Este ambiente foi criado para compreensão, reflexão e clareza. Não para condenação ou humilhação.' },
        { q: 'Preciso ser cristão para participar?', a: 'Não. A imersão acolhe pessoas de diferentes backgrounds. O foco é na história emocional e identitária, não em convicções religiosas específicas.' },
        { q: 'E se eu me arrepender depois de comprar?', a: 'Você tem 7 dias de garantia. Se não gostar, devolvemos seu investimento integralmente.' },
        { q: 'O evento é online?', a: 'Sim. 100% online e ao vivo, via Zoom. Você participará de casa.' },
      ]

  return (
    <main className="min-h-screen bg-background pb-32">
      {/* Rainbow top */}
      <div className="rainbow-bar h-1 fixed top-0 left-0 right-0 z-[100]" />

      {/* Timer */}
      <div className="fixed top-1 left-0 right-0 z-[60] bg-red-600 text-white py-2 px-4 text-center text-[11px] font-bold uppercase tracking-widest">
        🚨 Oferta expira em: <span className="tabular-nums font-black">{formatTime(timeLeft)}</span>
      </div>

      {/* Header */}
      <header className="pt-14 pb-4 flex flex-col items-center gap-2 px-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Mapa da Identidade</div>
        <span className="rainbow-underline" />
      </header>

      {/* Hero */}
      <section className="max-w-lg mx-auto px-4 pt-2 pb-10 text-center">
        <div className="inline-block bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
          ✅ Diagnóstico Personalizado Pronto
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
          {name ? `${name}, sua` : 'Sua'} jornada de clareza começa aqui
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isParents
            ? 'Identificamos padrões na relação entre você e seu filho. Agora é hora de aprender o caminho certo para restaurar essa conexão.'
            : 'Identificamos áreas da sua história que talvez ainda precisem ser compreendidas. Agora é hora de olhar para elas com coragem e clareza.'}
        </p>
      </section>

      {/* Sales block */}
      <section className="max-w-lg mx-auto px-4 pb-10">
        <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 rainbow-bar" />
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-2">A Solução</div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight mb-3">
              Imersão<br />
              <span className="text-white">De Frente com a Homossexualidade</span>
            </h2>
            <p className="text-sm opacity-90 leading-relaxed mb-5">
              {isParents
                ? 'Dois dias para aprender como se aproximar do seu filho sem abrir mão da verdade — com amor, posicionamento e sabedoria.'
                : 'Dois dias para compreender o que está por trás dos conflitos de identidade, das dores emocionais e da busca por aceitação.'}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="font-bold text-white text-sm mb-1">Dia 1</div>
                <p className="text-[11px] opacity-70">
                  {isParents ? 'Compreender o que está por trás do comportamento e do afastamento.' : 'Identificar as raízes emocionais e os padrões de identidade.'}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <div className="font-bold text-white text-sm mb-1">Dia 2</div>
                <p className="text-[11px] opacity-70">
                  {isParents ? 'Aprender a comunicar amor, verdade e posicionamento de forma que alcance o coração.' : 'Encontrar um caminho de clareza, restauração e reconstrução da identidade.'}
                </p>
              </div>
            </div>

            <ul className="space-y-2 text-sm mb-6">
              {[
                '✨ 100% Online e Ao Vivo (via Zoom)',
                '📅 04 e 05 de Julho',
                '⏰ Das 13h às 19h',
                '📝 Material de apoio completo em PDF',
              ].map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-white/90">
                  <span className="text-white shrink-0">✓</span> {b}
                </li>
              ))}
            </ul>

            <a
              href={CHECKOUT_URL}
              className="block w-full bg-green-500 text-white font-bold py-4 rounded-2xl text-sm text-center shadow-lg hover:bg-green-400 active:scale-[0.98] transition animate-pulse"
            >
              QUERO GARANTIR MINHA VAGA →
            </a>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="max-w-lg mx-auto px-4 pb-10">
        <h2 className="text-base font-bold text-center mb-5 uppercase tracking-wider">Na imersão, você vai entender:</h2>
        <div className="space-y-3">
          {(isParents
            ? [
                { n: '1', t: 'O que pode estar por trás dos conflitos de identidade', d: 'Como pertencimento, validação, rejeição e ausência emocional influenciam a forma como uma pessoa se enxerga.' },
                { n: '2', t: 'Por que muitos filhos se afastam emocionalmente', d: 'Muitas vezes o afastamento começa quando o filho deixa de se sentir seguro para ser verdadeiro.' },
                { n: '3', t: 'Como conversar sem afastar ainda mais', d: 'Uma forma de comunicação que não começa pela acusação, mas pela conexão.' },
                { n: '4', t: 'Como unir amor e verdade', d: 'Amar não é concordar com tudo. Falar a verdade não é ferir. A restauração acontece quando amor e verdade caminham juntos.' },
                { n: '5', t: 'Como reconstruir a ponte familiar', d: 'Porque muitos filhos não precisam de mais rejeição. Precisam de pais presentes, restaurados e posicionados.' },
              ]
            : [
                { n: '1', t: 'Como a identidade é formada', d: 'Como pertencimento, validação, rejeição e vínculos influenciam a forma como uma pessoa se enxerga.' },
                { n: '2', t: 'Por que algumas dores ficam escondidas', d: 'Existem dores que não desaparecem com o tempo. Elas apenas mudam de linguagem.' },
                { n: '3', t: 'Como reconhecer padrões emocionais', d: 'Carência, medo de abandono, vergonha e necessidade de aprovação podem influenciar escolhas e relacionamentos.' },
                { n: '4', t: 'Como separar sentimento, experiência e identidade', d: 'Você não precisa negar o que sente. Mas também não precisa construir toda a identidade apenas a partir da dor ou do desejo.' },
                { n: '5', t: 'Como encontrar um caminho de clareza', d: 'Um ambiente para compreender, refletir e enxergar possibilidades de restauração.' },
              ]
          ).map((item, i) => (
            <div key={i} className="flex gap-3 bg-white border rounded-xl p-4 shadow-sm">
              <div className="size-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">{item.n}</div>
              <div>
                <div className="text-sm font-bold mb-0.5">{item.t}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Offer card */}
      <section className="max-w-lg mx-auto px-4 pb-10" id="checkout">
        <div className="bg-white border-4 border-slate-900 rounded-3xl p-7 text-center shadow-2xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
            Vagas Limitadas
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Inscrição para a Imersão</div>
          <div className="text-sm text-muted-foreground line-through decoration-red-400/60 font-semibold">{ORIGINAL_PRICE}</div>
          <div className="text-5xl font-black text-slate-900 my-2">{PRICE}</div>
          <div className="text-xs text-muted-foreground mb-6">Pagamento único · Acesso aos 2 dias ao vivo</div>

          <a
            href={CHECKOUT_URL}
            className="block w-full bg-green-600 text-white font-bold py-5 rounded-2xl text-base shadow-lg shadow-green-600/30 hover:bg-green-700 active:scale-[0.98] transition animate-pulse"
          >
            QUERO GARANTIR MINHA VAGA →
          </a>

          <div className="mt-5 flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            <span>🔒 Pagamento Seguro</span>
            <span>🛡️ 7 dias de garantia</span>
            <span>🚀 Acesso Imediato</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-lg mx-auto px-4 pb-10">
        <h2 className="text-base font-bold text-center mb-5 uppercase tracking-wider">Perguntas frequentes</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{faq.q}</span>
                <span className={`text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed border-t">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-[10px] text-muted-foreground py-8 px-4 space-y-1 uppercase tracking-widest">
        <p>© 2025 DE FRENTE COM A HOMOSSEXUALIDADE</p>
        <p>Todos os direitos reservados</p>
        <button onClick={onRestart} className="mt-3 text-primary underline capitalize">Refazer o diagnóstico</button>
      </footer>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-40 shadow-[0_-8px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="shrink-0">
            <div className="text-[9px] text-muted-foreground font-bold uppercase">Imersão</div>
            <div className="font-black text-slate-900 text-lg leading-none">
              <span className="text-[9px] text-muted-foreground line-through mr-1">{ORIGINAL_PRICE}</span>
              {PRICE}
            </div>
          </div>
          <a
            href={CHECKOUT_URL}
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl text-xs text-center shadow-lg active:scale-95 transition"
          >
            GARANTIR MINHA VAGA →
          </a>
        </div>
      </div>
    </main>
  )
}
