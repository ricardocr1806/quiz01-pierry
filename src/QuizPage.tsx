import { useEffect, useMemo, useRef, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Option = { label: string; icon?: string; score?: number; img?: string }
type AnswerStyle = 'list' | 'emoji-grid' | 'yes-no' | 'photo-grid'

type Step =
  | { id: string; type: 'intro-gender' }
  | { id: string; type: 'single'; key: string; question: string; subtitle?: string; options: Option[]; style?: AnswerStyle }
  | { id: string; type: 'content'; title: string; body: string; highlight?: string; emoji?: string; emojiColor?: string }
  | { id: string; type: 'loading'; title: string; lines: string[]; durationMs?: number }
  | { id: string; type: 'dynamic-result' }
  | { id: string; type: 'capture'; title: string; subtitle: string }

// ─── Photo URLs ──────────────────────────────────────────────────────────────
const PHOTOS = {
  man:   'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&auto=format',
  woman: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&auto=format',
  ageM: [
    { label: '19–29', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=370&fit=crop&auto=format' },
    { label: '30–39', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=370&fit=crop&auto=format' },
    { label: '40–49', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=370&fit=crop&auto=format' },
    { label: '50+',   img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=370&fit=crop&auto=format' },
  ],
  ageF: [
    { label: '19–29', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=370&fit=crop&auto=format' },
    { label: '30–39', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=370&fit=crop&auto=format' },
    { label: '40–49', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=370&fit=crop&auto=format' },
    { label: '50+',   img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=370&fit=crop&auto=format' },
  ],
}

// ─── Shared option sets ───────────────────────────────────────────────────────
const FREQ: Option[] = [
  { label: 'Quase sempre',   icon: '🔁', score: 3 },
  { label: 'Frequentemente', icon: '😣', score: 2 },
  { label: 'Às vezes',       icon: '😐', score: 1 },
  { label: 'Nunca',          icon: '😊', score: 0 },
]
const FREQ_INV: Option[] = [
  { label: 'Nunca',          icon: '😟', score: 3 },
  { label: 'Às vezes',       icon: '😐', score: 2 },
  { label: 'Frequentemente', icon: '😊', score: 1 },
  { label: 'Quase sempre',   icon: '✅', score: 0 },
]

// ─── Base steps (comuns a todos) ──────────────────────────────────────────────
const baseSteps: Step[] = [
  { id: 'intro-gender', type: 'intro-gender' },
  {
    id: 's1', type: 'single', key: 'idade', style: 'photo-grid',
    question: 'Qual a sua idade?',
    options: [
      { label: '19–29' }, { label: '30–39' }, { label: '40–49' }, { label: '50+' },
    ],
  },
  {
    id: 's3', type: 'single', key: 'crista', style: 'yes-no',
    question: 'Você é cristão? ✝️',
    options: [
      { label: 'Sim', icon: '✅' },
      { label: 'Não', icon: '❌' },
    ],
  },
  {
    id: 's6', type: 'single', key: 'motivo',
    question: 'O que mais te trouxe aqui hoje?',
    options: [
      { label: 'Estou preocupado com meu filho',                     icon: '😟' },
      { label: 'Estou tentando entender minha própria identidade',    icon: '🔍' },
      { label: 'Tenho dúvidas sobre sentimentos que estou vivendo',   icon: '💭' },
      { label: 'Quero saber como lidar com alguém da minha família',  icon: '👨‍👩‍👧' },
      { label: 'Sinto algo emocionalmente mal resolvido',             icon: '💔' },
      { label: 'Esse assunto me chamou atenção',                      icon: '✨' },
    ],
  },
  {
    id: 's7', type: 'single', key: 'relacao',
    question: 'Qual é a sua relação com a homossexualidade? 🏳️‍🌈',
    options: [
      { label: 'Sou pai',                                                          icon: '👨' },
      { label: 'Sou mãe',                                                          icon: '👩' },
      { label: 'Sou familiar ou responsável por alguém que vive essa questão',     icon: '👨‍👩‍👧' },
      { label: 'Sou homossexual',                                                  icon: '🏳️‍🌈' },
      { label: 'Estou em dúvida sobre minha sexualidade',                          icon: '🤔' },
    ],
  },
]

// ─── Fluxo 1 — Pais ──────────────────────────────────────────────────────────
const parentsSteps: Step[] = [
  {
    id: 'pi', type: 'content', emoji: '👨‍👩‍👦', emojiColor: 'from-blue-100 to-indigo-100',
    title: 'Agora vamos olhar para a relação entre você e seu filho',
    body: 'Talvez você já tenha percebido sinais. Talvez ainda esteja em dúvida.<br/><br/>As próximas perguntas vão ajudar você a identificar sinais de desconexão emocional, fragilidade de identidade e dificuldade de comunicação dentro da família.<br/><br/>Não se trata de procurar culpados. Trata-se de compreender o que pode estar acontecendo por trás do comportamento, da distância ou do silêncio.',
  },
  {
    id: 'p8', type: 'single', key: 'p_mudancas', style: 'emoji-grid',
    question: 'Seu filho tem demonstrado mudanças de comportamento nos últimos tempos? 🔄',
    options: FREQ,
  },
  {
    id: 'p9', type: 'single', key: 'p_distante',
    question: 'Você percebe que seu filho está mais fechado, distante ou difícil de acessar emocionalmente? 💔',
    options: FREQ,
  },
  {
    id: 'p10', type: 'single', key: 'p_sentimentos', style: 'emoji-grid',
    question: 'Você sente que conhece o comportamento do seu filho, mas não sabe o que ele sente por dentro? 🤔',
    options: FREQ,
  },
  {
    id: 'p11', type: 'single', key: 'p_evita',
    question: 'Seu filho evita conversar sobre sentimentos, identidade, sexualidade ou relacionamentos? 🤐',
    options: FREQ,
  },
  {
    id: 'p12', type: 'single', key: 'p_fecha', style: 'emoji-grid',
    question: 'Quando você tenta conversar, ele se fecha, se irrita ou muda de assunto? 😤',
    options: FREQ,
  },
  {
    id: 'p13', type: 'single', key: 'p_medo_falar', style: 'yes-no',
    question: 'Você sente medo de falar algo errado e afastar ainda mais seu filho? 😰',
    options: [
      { label: 'Sim, quase sempre',    icon: '😰', score: 3 },
      { label: 'Às vezes sinto isso',  icon: '😐', score: 2 },
      { label: 'Raramente',            icon: '😊', score: 1 },
    ],
  },
  {
    id: 'p14', type: 'single', key: 'p_aceitacao_fora',
    question: 'Seu filho parece buscar mais aceitação fora de casa do que dentro da família? 🌍',
    options: FREQ,
  },
  {
    id: 'p15', type: 'single', key: 'p_redes', style: 'emoji-grid',
    question: 'Amizades, grupos ou redes sociais influenciam muito a forma como ele se enxerga? 📱',
    options: FREQ,
  },
  {
    id: 'pc1', type: 'content', emoji: '💙', emojiColor: 'from-blue-100 to-cyan-100',
    title: 'Um filho pode morar dentro de casa e, ainda assim, sentir-se distante emocionalmente.',
    body: 'Muitos pais tentam corrigir o que aparece. Mas nem sempre conseguem compreender o que está por trás.<br/><br/>Antes de um filho falar sobre comportamento ou sexualidade, muitas vezes ele já está carregando perguntas silenciosas.',
    highlight: '"Eu sou visto? Eu sou amado? Eu pertenço? Posso contar a verdade sem perder minha família?"',
  },
  {
    id: 'p16', type: 'single', key: 'p_incompreendido',
    question: 'Seu filho já demonstrou sentir que não é compreendido dentro de casa? 😔',
    options: FREQ,
  },
  {
    id: 'p17', type: 'single', key: 'p_conversa', style: 'emoji-grid',
    question: 'Na sua casa, conversas difíceis costumam terminar em discussão, silêncio ou afastamento? 😶',
    options: FREQ,
  },
  {
    id: 'p18', type: 'single', key: 'p_corrigir',
    question: 'Você costuma corrigir primeiro e tentar compreender depois? ⚡',
    options: FREQ,
  },
  {
    id: 'p19', type: 'single', key: 'p_vergonha', style: 'emoji-grid',
    question: 'Quando o assunto é homossexualidade, você sente medo, vergonha, culpa ou sensação de fracasso? 😟',
    options: FREQ,
  },
  {
    id: 'p20', type: 'single', key: 'p_palavras_duras',
    question: 'Você já reagiu com palavras duras ou comparações e percebeu que isso aumentou a distância? 💬',
    options: FREQ,
  },
  {
    id: 'p21', type: 'single', key: 'p_controle', style: 'emoji-grid',
    question: 'Você sente que, às vezes, tenta controlar seu filho porque tem medo de perdê-lo? 😰',
    options: FREQ,
  },
  {
    id: 'p22', type: 'single', key: 'p_coracao', style: 'yes-no',
    question: 'Seu filho sente que pode abrir o coração com você sem medo de ser rejeitado? ❤️',
    options: [
      { label: 'Nunca', icon: '😢', score: 3 },
      { label: 'Às vezes', icon: '😐', score: 2 },
      { label: 'Frequentemente', icon: '😊', score: 1 },
      { label: 'Quase sempre', icon: '✅', score: 0 },
    ],
  },
  {
    id: 'p23', type: 'single', key: 'p_amor',
    question: 'Você consegue demonstrar amor sem sentir que está aprovando tudo? 🤝',
    options: FREQ_INV,
  },
  {
    id: 'p24', type: 'single', key: 'p_guerra', style: 'emoji-grid',
    question: 'Você consegue manter suas convicções sem transformar a relação em uma guerra? ⚖️',
    options: FREQ_INV,
  },
  {
    id: 'p25', type: 'single', key: 'p_clareza',
    question: 'Você sente que sabe como conduzir essa situação com amor, verdade e sabedoria? 🧭',
    options: [
      { label: 'Não sei por onde começar',             icon: '😰', score: 3 },
      { label: 'Tenho muitas dúvidas',                 icon: '😟', score: 2 },
      { label: 'Tenho alguma clareza, mas tenho medo', icon: '😐', score: 1 },
      { label: 'Sim, tenho clareza',                   icon: '✅', score: 0 },
    ],
  },
  {
    id: 'p26', type: 'single', key: 'p_desejo',
    question: 'O que você mais deseja em relação ao seu filho? 💝',
    options: [
      { label: 'Restaurar a conexão',                        icon: '❤️' },
      { label: 'Entender o que está acontecendo',            icon: '🔍' },
      { label: 'Saber como conversar sem afastar',           icon: '💬' },
      { label: 'Ajudá-lo sem agredir ou condenar',           icon: '🤝' },
      { label: 'Manter convicções sem perder meu filho',     icon: '⚖️' },
      { label: 'Tudo isso ao mesmo tempo',                   icon: '✨' },
    ],
  },
  {
    id: 'pl', type: 'loading',
    title: 'Estamos analisando suas respostas…',
    lines: [
      'Avaliando conexão emocional...',
      'Mapeando padrões de comunicação familiar...',
      'Identificando sinais de pertencimento...',
      'Construindo seu diagnóstico personalizado...',
    ],
    durationMs: 4000,
  },
  { id: 'pr', type: 'dynamic-result' },
  {
    id: 'pc', type: 'capture',
    title: 'Última etapa antes do seu <hl>diagnóstico completo</hl>',
    subtitle: 'Informe seu nome e WhatsApp para receber o diagnóstico e as informações sobre a Imersão:',
  },
]

// ─── Fluxo 2 — Pessoa ────────────────────────────────────────────────────────
const personSteps: Step[] = [
  {
    id: 'bpi', type: 'content', emoji: '🌈', emojiColor: 'from-purple-100 to-pink-100',
    title: 'Agora vamos olhar para a sua história',
    body: 'Este caminho não foi criado para te acusar. Também não foi criado para te reduzir à sua sexualidade.<br/><br/>Você é maior do que aquilo que sente, viveu, escondeu ou aprendeu a mostrar para ser aceito.<br/><br/>As próximas perguntas vão ajudar você a perceber se existem áreas da sua identidade que ainda estão escondidas ou sem um lugar seguro para serem compreendidas.',
  },
  {
    id: 'b8', type: 'single', key: 'b_fase',
    question: 'Em que fase você começou a perceber conflitos relacionados à sua identidade? 📅',
    options: [
      { label: 'Na infância',              icon: '🧒' },
      { label: 'Na adolescência',          icon: '🧑' },
      { label: 'Na juventude',             icon: '👦' },
      { label: 'Na fase adulta',           icon: '🧑‍💼' },
      { label: 'Ainda estou entendendo',   icon: '🤔' },
    ],
  },
  {
    id: 'b9', type: 'single', key: 'b_esconder', style: 'emoji-grid',
    question: 'Você sente que precisou esconder partes de si para não ser rejeitado? 🤐',
    options: FREQ,
  },
  {
    id: 'b10', type: 'single', key: 'b_diferenca', style: 'yes-no',
    question: 'Existe diferença entre quem você mostra ser e o que realmente sente por dentro? 🎭',
    options: [
      { label: 'Sim, quase sempre',    icon: '😶', score: 3 },
      { label: 'Às vezes sinto isso',  icon: '😐', score: 2 },
      { label: 'Raramente',            icon: '😊', score: 1 },
      { label: 'Não, sou autêntico',   icon: '✅', score: 0 },
    ],
  },
  {
    id: 'b11', type: 'single', key: 'b_versao',
    question: 'Você já sentiu que precisava criar uma versão de si mesmo para ser aceito? 🎭',
    options: FREQ,
  },
  {
    id: 'b12', type: 'single', key: 'b_medo_conhecer', style: 'emoji-grid',
    question: 'Você sente medo de que, se as pessoas conhecerem sua história, deixarão de amar você? 😨',
    options: FREQ,
  },
  {
    id: 'b13', type: 'single', key: 'b_rotulo',
    question: 'Você sente que sua sexualidade se tornou a principal forma como as pessoas te enxergam? 👁️',
    options: FREQ,
  },
  {
    id: 'b14', type: 'single', key: 'b_alem', style: 'yes-no',
    question: 'Você gostaria de ser visto para além da sua orientação sexual? 💙',
    options: [
      { label: 'Sim, profundamente', icon: '💙', score: 3 },
      { label: 'Sim',                icon: '✅', score: 2 },
      { label: 'Às vezes',           icon: '😐', score: 1 },
      { label: 'Nunca pensei nisso', icon: '🤔', score: 0 },
    ],
  },
  {
    id: 'b15', type: 'single', key: 'b_pertencimento', style: 'emoji-grid',
    question: 'Você sente que busca pertencimento em pessoas, grupos ou relacionamentos? 🫂',
    options: FREQ,
  },
  {
    id: 'bc1', type: 'content', emoji: '🫂', emojiColor: 'from-purple-100 to-blue-100',
    title: 'Às vezes, a pessoa não está apenas buscando prazer.',
    body: 'Ela está buscando pertencimento, aceitação, afeto, segurança e um lugar onde não precise se esconder.<br/><br/>Isso não significa reduzir sua história a uma única causa. Significa olhar com coragem para tudo o que formou sua maneira de se enxergar.',
    highlight: 'Você não é apenas o que sente. Você não é apenas o que viveu. Existe uma história por trás da identidade.',
  },
  {
    id: 'b16', type: 'single', key: 'b_visto_familia',
    question: 'Você se sentiu emocionalmente visto, amado e validado na sua família? 👨‍👩‍👦',
    options: FREQ_INV,
  },
  {
    id: 'b17', type: 'single', key: 'b_rejeicao', style: 'emoji-grid',
    question: 'Você já carregou sentimentos de rejeição, abandono ou solidão dentro da própria casa? 😢',
    options: FREQ,
  },
  {
    id: 'b18', type: 'single', key: 'b_conversar_pais',
    question: 'Você teve dificuldade de conversar com seus pais ou familiares sobre o que sentia? 🤐',
    options: FREQ,
  },
  {
    id: 'b19', type: 'single', key: 'b_esconder_dor', style: 'emoji-grid',
    question: 'Você sentiu que precisava esconder sua dor para não decepcionar sua família? 😔',
    options: FREQ,
  },
  {
    id: 'b20', type: 'single', key: 'b_dores_inf',
    question: 'Dores da infância ou adolescência ainda influenciam suas escolhas hoje? 🌱',
    options: FREQ,
  },
  {
    id: 'b21', type: 'single', key: 'b_busca_passado', style: 'emoji-grid',
    question: 'Você busca em relacionamentos aquilo que gostaria de ter recebido emocionalmente no passado? 💞',
    options: FREQ,
  },
  {
    id: 'b22', type: 'single', key: 'b_vazio',
    question: 'Mesmo quando recebe atenção ou carinho, ainda sente vazio ou medo de ser abandonado? 😞',
    options: FREQ,
  },
  {
    id: 'b23', type: 'single', key: 'b_sentimentos', style: 'emoji-grid',
    question: 'Sentimentos intensos acabam definindo rapidamente quem você acredita ser? ⚡',
    options: FREQ,
  },
  {
    id: 'bc2', type: 'content', emoji: '🌱', emojiColor: 'from-green-100 to-emerald-100',
    title: 'Nem todo sentimento precisa se tornar identidade final.',
    body: 'Nem toda dor precisa continuar governando sua história.<br/><br/>Existe diferença entre sentir algo, viver algo, sofrer algo e construir toda a identidade a partir disso.',
    highlight: 'A pergunta mais profunda: "O que aconteceu comigo?" e "Quem eu sou além daquilo que tento provar?"',
  },
  {
    id: 'b24', type: 'single', key: 'b_conflito_fe',
    question: 'Existe conflito entre aquilo que você sente, acredita e a forma como vive hoje? ⚖️',
    options: FREQ,
  },
  {
    id: 'b25', type: 'single', key: 'b_culpa_fe', style: 'emoji-grid',
    question: 'Você sente culpa, vergonha ou confusão quando pensa sobre identidade e fé? 🙏',
    options: FREQ,
  },
  {
    id: 'b26', type: 'single', key: 'b_alem_rotulo',
    question: 'Você já se perguntou quem você seria além dos desejos, relacionamentos e rótulos que recebeu? 🪞',
    options: FREQ,
  },
  {
    id: 'b27', type: 'single', key: 'b_oculta', style: 'emoji-grid',
    question: 'Existe uma parte da sua identidade que permanece oculta, mesmo para pessoas próximas? 🫙',
    options: FREQ,
  },
  {
    id: 'b28', type: 'single', key: 'b_medo_historia',
    question: 'Você tem medo de olhar para sua própria história com profundidade? 👁️',
    options: FREQ,
  },
  {
    id: 'b29', type: 'single', key: 'b_compreender', style: 'yes-no',
    question: 'Você gostaria de compreender melhor suas dores, vínculos e conflitos sem ser condenado? 💜',
    options: [
      { label: 'Sim, profundamente',    icon: '💜', score: 3 },
      { label: 'Sim',                   icon: '✅', score: 2 },
      { label: 'Talvez',                icon: '🤔', score: 1 },
      { label: 'Não sinto necessidade', icon: '😐', score: 0 },
    ],
  },
  {
    id: 'b30', type: 'single', key: 'b_desejo',
    question: 'Hoje, o que você mais deseja? ✨',
    options: [
      { label: 'Me entender melhor',                               icon: '🔍' },
      { label: 'Parar de viver escondido',                         icon: '🔓' },
      { label: 'Ser visto além da minha sexualidade',              icon: '👁️' },
      { label: 'Compreender minha história',                       icon: '📖' },
      { label: 'Resolver conflitos entre fé, identidade e sentimentos', icon: '⚖️' },
      { label: 'Encontrar um caminho de clareza',                  icon: '🌟' },
    ],
  },
  {
    id: 'bl', type: 'loading',
    title: 'Estamos analisando suas respostas…',
    lines: [
      'Mapeando sua história de identidade...',
      'Avaliando vínculos emocionais...',
      'Identificando padrões de pertencimento...',
      'Construindo seu diagnóstico personalizado...',
    ],
    durationMs: 4000,
  },
  { id: 'br', type: 'dynamic-result' },
  {
    id: 'bc', type: 'capture',
    title: 'Última etapa antes do seu <hl>diagnóstico completo</hl>',
    subtitle: 'Informe seu nome e WhatsApp para receber o diagnóstico e as informações sobre a Imersão:',
  },
]

// ─── Result data ─────────────────────────────────────────────────────────────
const PARENTS_RESULTS = [
  {
    min: 0, max: 18, label: 'INICIAL', color: 'text-yellow-600',
    title: 'Sinais iniciais de atenção',
    headline: 'Existe uma base de conexão, mas algumas áreas precisam ser fortalecidas.',
    diagnosis: 'Suas respostas mostram que ainda existe uma base de relacionamento entre você e seu filho. Mas também existem sinais de que algumas conversas, sentimentos ou assuntos delicados podem estar sendo evitados.',
    indicators: ['Ainda existe abertura emocional.', 'Algumas conversas podem estar sendo evitadas.', 'Seu filho pode não compartilhar tudo o que sente.', 'Você precisa fortalecer a escuta e a presença.', 'Pequenas mudanças agora podem evitar grandes distâncias depois.'],
    message: 'A conexão não deve ser reconstruída apenas quando se perde. Ela precisa ser cultivada antes da crise.',
  },
  {
    min: 19, max: 36, label: 'MODERADO', color: 'text-orange-600',
    title: 'Fragilidades emocionais presentes',
    headline: 'Seu filho pode estar enfrentando fragilidades de pertencimento e segurança emocional.',
    diagnosis: 'Existem sinais de que seu filho pode não estar encontrando respostas suficientemente claras para perguntas profundas como: "Eu sou amado? Eu pertenço? Posso falar sem ser rejeitado?"',
    indicators: ['Seu filho pode estar emocionalmente distante.', 'Existe busca de validação fora da família.', 'Algumas conversas podem gerar defesa.', 'Você pode estar tentando corrigir antes de compreender.', 'Falta uma conexão mais segura e verdadeira.'],
    message: 'Seu filho talvez não esteja precisando apenas de respostas. Ele pode estar precisando reencontrar uma conexão verdadeira com você.',
  },
  {
    min: 37, max: 54, label: 'ALTO', color: 'text-red-500',
    title: 'Conflitos ativos de identidade e conexão',
    headline: 'A distância emocional já pode estar interferindo na relação familiar.',
    diagnosis: 'Suas respostas apontam para desconexão, medo, insegurança ou perda de confiança. Quanto mais tenta controlar o comportamento, mais sente que seu filho se fecha.',
    indicators: ['Seu filho pode sentir mais pressão do que compreensão.', 'Existe medo de rejeição ou perda de pertencimento.', 'As conversas podem estar se transformando em disputas.', 'Suas próprias feridas podem estar influenciando suas reações.', 'A confiança precisa ser reconstruída.'],
    message: 'A correção sem conexão pode gerar resistência. A conexão prepara o coração para ouvir direção.',
  },
  {
    min: 55, max: 999, label: 'URGENTE', color: 'text-red-700',
    title: 'Necessidade urgente de clareza e restauração',
    headline: 'Sua família precisa de uma nova estratégia antes que a distância vire ruptura.',
    diagnosis: 'Suas respostas mostram sinais fortes de perda de confiança, conflitos repetitivos ou afastamento. Neste momento, repetir as mesmas estratégias tende a gerar os mesmos resultados.',
    indicators: ['A relação precisa de reconstrução intencional.', 'Seu filho pode ter deixado de enxergar a família como espaço seguro.', 'Você pode estar corrigindo a partir do medo.', 'Falta um caminho para unir amor, verdade e posicionamento.', 'A conexão precisa vir antes da correção.'],
    message: 'Seu filho não precisa apenas de pais preocupados. Ele precisa de pais presentes, restaurados e posicionados.',
  },
]

const PERSON_RESULTS = [
  {
    min: 0, max: 18, label: 'INICIAL', color: 'text-yellow-600',
    title: 'Sinais iniciais de conflito interno',
    headline: 'Existem áreas da sua história que ainda precisam ser compreendidas.',
    diagnosis: 'Suas respostas mostram que você possui alguma percepção sobre sua história e conflitos. Mas também indicam que existem assuntos que talvez ainda estejam sendo evitados.',
    indicators: ['Existem perguntas internas ainda não respondidas.', 'Algumas emoções podem estar sendo guardadas.', 'Sua história precisa ser compreendida com mais profundidade.', 'Talvez você ainda não tenha encontrado um espaço seguro para falar.'],
    message: 'Você não precisa esperar uma crise para começar a compreender sua história.',
  },
  {
    min: 19, max: 36, label: 'MODERADO', color: 'text-orange-600',
    title: 'Identidade construída em busca de aceitação',
    headline: 'Partes da sua identidade podem estar sustentadas pela necessidade de pertencimento.',
    diagnosis: 'A necessidade de aceitação pode ocupar um espaço importante na sua vida. Talvez você tenha aprendido a esconder sentimentos, adaptar sua personalidade e buscar validação em relacionamentos.',
    indicators: ['Você pode ter aprendido a esconder partes de si.', 'Existe medo de rejeição.', 'A opinião das pessoas pode influenciar sua percepção de valor.', 'Relacionamentos podem estar sendo usados como fonte de identidade.'],
    message: 'Quando pertencimento vira sobrevivência, a pessoa pode começar a se moldar para não ser abandonada.',
  },
  {
    min: 37, max: 54, label: 'INTENSO', color: 'text-red-500',
    title: 'Identidade oculta e conflito interno ativo',
    headline: 'Você pode estar vivendo dividido entre sentimentos, convicções e medo da rejeição.',
    diagnosis: 'Existe uma parte de você que deseja ser aceita. Outra parte deseja compreender com profundidade quem você é. Com o tempo, essa divisão pode produzir cansaço, ansiedade, vergonha e isolamento.',
    indicators: ['Você pode estar escondendo conflitos importantes.', 'Existe distância entre sua vida externa e seu mundo interior.', 'O medo de perder pessoas pode estar limitando sua honestidade.', 'Dores antigas ainda podem influenciar sua percepção de valor.'],
    message: 'Você é maior do que aquilo que sente, viveu ou aprendeu a mostrar para ser aceito.',
  },
  {
    min: 55, max: 999, label: 'CRÍTICO', color: 'text-red-700',
    title: 'Fragmentação emocional e necessidade de reconstrução',
    headline: 'Sua identidade pode estar organizada ao redor de dores que ainda não foram tratadas.',
    diagnosis: 'Suas respostas indicam um nível elevado de conflito emocional e dependência da validação externa. Neste momento, você não precisa de condenação. Você precisa de um caminho seguro para compreender sua história com verdade e dignidade.',
    indicators: ['Existe medo intenso de rejeição ou abandono.', 'A aceitação externa pode estar governando suas escolhas.', 'Algumas dores ainda permanecem ocultas.', 'Você precisa reconstruir sua identidade a partir de uma base mais ampla.'],
    message: 'Uma identidade fortalecida não nasce da negação da história, mas da coragem de compreendê-la por inteiro.',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function HL({ text }: { text: string }) {
  const parts = text.split(/(<hl>.*?<\/hl>|<br\s*\/?>)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p === '<br/>' || p === '<br>') return <br key={i} />
        const m = p.match(/^<hl>(.*?)<\/hl>$/)
        if (m) return <span key={i} className="text-primary">{m[1]}</span>
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

function PrimaryButton({ children, className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`w-full bg-primary text-white font-bold py-4 rounded-2xl text-sm shadow-lg hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

// Dashed divider (like the examples)
function Divider() {
  return <div className="border-t-2 border-dashed border-blue-200 my-4" />
}

// Photo choice card (for gender/age 2x2 grid)
function PhotoCard({ img, label, onClick }: { img: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden border-2 border-border bg-white shadow-sm hover:border-primary hover:shadow-md active:scale-[0.97] transition-all"
    >
      <img
        src={img}
        alt={label}
        className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="py-2 px-1 text-center text-sm font-semibold text-foreground bg-white border-t">
        {label}
      </div>
    </button>
  )
}

// Standard list choice card
function ListCard({ option, selected, onClick }: { option: Option; selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl border-2 bg-white transition-all active:scale-[0.98] hover:border-primary hover:shadow-sm text-sm font-medium ${
        selected ? 'border-primary bg-primary-soft' : 'border-border'
      }`}
    >
      {option.icon && <span className="text-xl shrink-0">{option.icon}</span>}
      <span className="flex-1 leading-snug">{option.label}</span>
      <span className={`size-4 rounded-full border-2 shrink-0 transition-colors ${selected ? 'border-primary bg-primary' : 'border-border'}`} />
    </button>
  )
}

// Emoji reaction grid (2x2)
function EmojiGrid({ options, onSelect }: { options: Option[]; onSelect: (o: Option) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      {options.map((o, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(o)}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-border bg-white hover:border-primary hover:bg-primary-soft active:scale-95 transition-all"
        >
          <span className="text-4xl">{o.icon}</span>
          <span className="text-xs font-semibold text-center leading-tight text-foreground">{o.label}</span>
        </button>
      ))}
    </div>
  )
}

// Big yes/no style (tall cards)
function YesNoCards({ options, onSelect }: { options: Option[]; onSelect: (o: Option) => void }) {
  return (
    <div className="space-y-3 mt-3">
      {options.map((o, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(o)}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-border bg-white hover:border-primary hover:bg-primary-soft active:scale-[0.98] transition-all"
        >
          <span className="text-3xl">{o.icon}</span>
          <span className="text-base font-semibold text-foreground">{o.label}</span>
        </button>
      ))}
    </div>
  )
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="fixed top-1 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-lg mx-auto px-4 py-2 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="rainbow-progress h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground tabular-nums w-8 text-right">{Math.round(pct)}%</span>
      </div>
    </div>
  )
}

function LoadingStep({ step, onDone }: { step: Extract<Step, { type: 'loading' }>; onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)
  const startRef = useRef(Date.now())
  const dur = step.durationMs ?? 3500

  useEffect(() => {
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - startRef.current) / dur) * 100)
      setPct(p)
      setLineIdx(Math.min(step.lines.length - 1, Math.floor((p / 100) * step.lines.length)))
      if (p >= 100) { clearInterval(id); setTimeout(onDone, 400) }
    }, 80)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="py-12 text-center space-y-6">
      <div className="text-5xl animate-pulse-soft">🔍</div>
      <h1 className="text-lg font-bold">{step.title}</h1>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="loading-bar h-full rounded-full transition-all duration-200" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm text-primary font-semibold animate-pulse-soft min-h-5">{step.lines[lineIdx]}</p>
      <div className="text-xs tabular-nums text-muted-foreground">{Math.round(pct)}%</div>
    </section>
  )
}

function DynamicResultStep({ answers, score, onNext }: { answers: Record<string, unknown>; score: number; onNext: () => void }) {
  const relacao = answers['relacao'] as string ?? ''
  const PARENT_OPTIONS = ['Sou pai', 'Sou mãe', 'Sou familiar ou responsável por alguém que vive essa questão']
  const isParents = PARENT_OPTIONS.includes(relacao)
  const results = isParents ? PARENTS_RESULTS : PERSON_RESULTS
  const result = results.find(r => score >= r.min && score <= r.max) ?? results[results.length - 1]

  return (
    <section className="space-y-5">
      <div className="text-center space-y-1">
        <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Seu diagnóstico</div>
        <h1 className="text-xl font-extrabold leading-tight">{result.title}</h1>
        <div className={`text-sm font-bold ${result.color}`}>Nível: {result.label}</div>
      </div>
      <div className="bg-white border rounded-2xl p-4">
        <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
          <span className="text-yellow-600">Inicial</span><span className="text-orange-500">Moderado</span>
          <span className="text-red-500">Intenso</span><span className="text-red-700">Crítico</span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{
            width: `${Math.min(100, (score / (isParents ? 54 : 63)) * 100)}%`,
            background: 'linear-gradient(to right, #EAB308, #F97316, #EF4444, #DC2626)',
          }} />
        </div>
      </div>
      <div className="bg-white border rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-bold">{result.headline}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.diagnosis}</p>
      </div>
      <div className="space-y-2">
        {result.indicators.map((ind, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-primary mt-0.5 shrink-0">•</span><span>{ind}</span>
          </div>
        ))}
      </div>
      <div className="border-l-4 border-primary bg-primary-soft p-4 rounded-r-xl">
        <p className="text-sm font-semibold leading-relaxed">{result.message}</p>
      </div>
      <PrimaryButton onClick={onNext}>Ver meu plano de restauração →</PrimaryButton>
    </section>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const PARENT_OPTIONS = ['Sou pai', 'Sou mãe', 'Sou familiar ou responsável por alguém que vive essa questão']

export default function QuizPage({ onComplete }: { onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [score, setScore] = useState(0)
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '' })
  // Progress only goes forward
  const [displayPct, setDisplayPct] = useState(0)

  const activeSteps = useMemo<Step[]>(() => {
    const relacao = answers['relacao'] as string | undefined
    if (!relacao) return baseSteps
    return PARENT_OPTIONS.includes(relacao)
      ? [...baseSteps, ...parentsSteps]
      : [...baseSteps, ...personSteps]
  }, [answers])

  const step = activeSteps[stepIdx]
  const rawPct = stepIdx === 0 ? 0 : (stepIdx / (activeSteps.length - 1)) * 100

  // Never let the bar go backward
  useEffect(() => {
    setDisplayPct(p => Math.max(p, rawPct))
  }, [rawPct])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stepIdx])

  const next = () => setStepIdx(i => Math.min(i + 1, activeSteps.length - 1))
  const prev = () => setStepIdx(i => Math.max(i - 1, 0))

  const handleSingle = (opt: Option) => {
    const key = (step as { key?: string }).key ?? step.id
    setAnswers(a => ({ ...a, [key]: opt.label }))
    if (opt.score !== undefined) setScore(s => s + opt.score!)
    setTimeout(next, 200)
  }

  const handleCapture = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.whatsapp) return
    const relacao = answers['relacao'] as string ?? ''
    const payload = {
      ...answers, ...form,
      flow: PARENT_OPTIONS.includes(relacao) ? 'parents' : 'person',
      score, completedAt: new Date().toISOString(),
    }
    try { localStorage.setItem('quiz_lead', JSON.stringify(payload)) } catch {}
    onComplete()
  }

  // Age options with conditional photos based on gender
  const agePhotos = answers['genero'] === 'Feminino' ? PHOTOS.ageF
    : answers['genero'] === 'Masculino' ? PHOTOS.ageM
    : null

  return (
    <main className="min-h-screen bg-background">
      <div className="rainbow-bar h-1 fixed top-0 left-0 right-0 z-[100]" />
      {step.type !== 'intro-gender' && <ProgressBar pct={displayPct} />}

      {stepIdx > 0 && step.type !== 'loading' && step.type !== 'dynamic-result' && (
        <button onClick={prev} className="fixed top-11 left-3 p-2 text-muted-foreground hover:text-foreground z-50" aria-label="Voltar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className="max-w-lg mx-auto px-4 pt-14 pb-16">
        <div key={step.id} className="animate-fade-up">
          {renderStep()}
        </div>
      </div>

      <div className="text-center text-[10px] text-muted-foreground px-6 pb-8 leading-relaxed max-w-lg mx-auto">
        Este diagnóstico possui finalidade educacional e reflexiva. Não substitui acompanhamento profissional.
      </div>
    </main>
  )

  function renderStep() {
    if (!step) return null

    // ── intro-gender ──────────────────────────────────────────────────────────
    if (step.type === 'intro-gender') {
      return (
        <section className="pt-2 space-y-4">
          {/* Badge */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground border rounded-full px-3 py-1">
              🏳️‍🌈 Diagnóstico Gratuito
            </span>
          </div>

          {/* Headline */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-extrabold leading-tight text-foreground">
              Descubra o que pode estar por trás dos{' '}
              <mark className="bg-yellow-300 text-foreground px-1 rounded">conflitos de identidade</mark>{' '}
              e dos afastamentos familiares
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Diagnóstico criado para pais, familiares e pessoas que vivem conflitos relacionados à homossexualidade — para identificar sinais emocionais e familiares que influenciam a identidade.
            </p>
          </div>

          <Divider />

          {/* Gender question */}
          <h2 className="text-lg font-extrabold text-center">Você é homem ou mulher?</h2>

          <div className="grid grid-cols-2 gap-3">
            <PhotoCard img={PHOTOS.man}   label="Homem"  onClick={() => handleSingle({ label: 'Masculino' })} />
            <PhotoCard img={PHOTOS.woman} label="Mulher" onClick={() => handleSingle({ label: 'Feminino' })} />
          </div>

          <button
            onClick={() => handleSingle({ label: 'Não sei' })}
            className="w-full text-xs text-muted-foreground underline underline-offset-2 pt-1"
          >
            Prefiro não informar / Não sei
          </button>

          <p className="text-[11px] text-center text-muted-foreground pt-1">
            🔒 Gratuito · Confidencial · 5 minutos
          </p>
        </section>
      )
    }

    // ── single ────────────────────────────────────────────────────────────────
    if (step.type === 'single') {
      // Age with photos
      if (step.id === 's1' && agePhotos) {
        return (
          <section className="space-y-4">
            <h1 className="text-xl font-extrabold text-center">{step.question}</h1>
            <Divider />
            <div className="grid grid-cols-2 gap-3">
              {agePhotos.map((item, i) => (
                <PhotoCard key={i} img={item.img} label={item.label} onClick={() => handleSingle({ label: item.label })} />
              ))}
            </div>
          </section>
        )
      }
      // Age without photos (gender = Não sei)
      if (step.id === 's1') {
        return (
          <section className="space-y-4">
            <h1 className="text-[17px] font-bold text-center">{step.question}</h1>
            <Divider />
            <div className="space-y-2">
              {step.options.map((o, i) => (
                <ListCard key={i} option={o} onClick={() => handleSingle(o)} />
              ))}
            </div>
          </section>
        )
      }

      // Emoji grid
      if (step.style === 'emoji-grid') {
        return (
          <section className="space-y-3">
            <h1 className="text-[17px] sm:text-lg font-bold leading-snug text-center">{step.question}</h1>
            {step.subtitle && <p className="text-xs text-muted-foreground text-center">{step.subtitle}</p>}
            <Divider />
            <EmojiGrid options={step.options} onSelect={handleSingle} />
          </section>
        )
      }

      // Yes-no big cards
      if (step.style === 'yes-no') {
        return (
          <section className="space-y-3">
            <h1 className="text-[17px] sm:text-lg font-bold leading-snug text-center">{step.question}</h1>
            <Divider />
            <YesNoCards options={step.options} onSelect={handleSingle} />
          </section>
        )
      }

      // Default: standard list
      return (
        <section className="space-y-3">
          <h1 className="text-[17px] sm:text-lg font-bold leading-snug text-center">{step.question}</h1>
          {step.subtitle && <p className="text-xs text-muted-foreground text-center">{step.subtitle}</p>}
          <Divider />
          <div className="space-y-2">
            {step.options.map((o, i) => (
              <ListCard key={i} option={o} onClick={() => handleSingle(o)} />
            ))}
          </div>
        </section>
      )
    }

    // ── content ───────────────────────────────────────────────────────────────
    if (step.type === 'content') {
      const bodyParts = step.body.split('<br/><br/>')
      return (
        <section className="space-y-4">
          {/* Emoji icon as image */}
          {step.emoji && (
            <div className="flex justify-center">
              <div className={`size-20 rounded-full bg-gradient-to-br ${step.emojiColor ?? 'from-primary-soft to-blue-100'} flex items-center justify-center text-4xl shadow-inner`}>
                {step.emoji}
              </div>
            </div>
          )}
          <h1 className="text-lg sm:text-xl font-bold leading-tight text-center"><HL text={step.title} /></h1>
          <div className="text-sm text-foreground/80 leading-relaxed space-y-3 text-center">
            {bodyParts.map((part, i) => <p key={i}><HL text={part} /></p>)}
          </div>
          {step.highlight && (
            <div className="border-l-4 border-primary bg-primary-soft p-4 rounded-r-xl">
              <p className="text-sm font-semibold leading-relaxed">{step.highlight}</p>
            </div>
          )}
          <PrimaryButton onClick={next}>Continuar →</PrimaryButton>
        </section>
      )
    }

    // ── loading ───────────────────────────────────────────────────────────────
    if (step.type === 'loading') return <LoadingStep step={step} onDone={next} />

    // ── dynamic-result ────────────────────────────────────────────────────────
    if (step.type === 'dynamic-result') return <DynamicResultStep answers={answers} score={score} onNext={next} />

    // ── capture ───────────────────────────────────────────────────────────────
    if (step.type === 'capture') {
      return (
        <section className="space-y-5">
          <h1 className="text-lg sm:text-xl font-bold text-center leading-tight"><HL text={step.title} /></h1>
          <p className="text-sm text-muted-foreground text-center">{step.subtitle}</p>
          <form onSubmit={handleCapture} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Primeiro nome</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Seu nome"
                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none text-sm bg-white" />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">WhatsApp</label>
              <input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} required inputMode="tel" placeholder="(00) 00000-0000"
                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none text-sm bg-white" />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">E-mail (opcional)</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" placeholder="seuemail@exemplo.com"
                className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none text-sm bg-white" />
            </div>
            <button type="submit"
              className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl text-sm shadow-lg hover:bg-green-700 active:scale-[0.98] transition">
              Receber meu diagnóstico completo →
            </button>
            <p className="text-[11px] text-center text-muted-foreground">🔒 Seus dados são usados apenas para te enviar seu plano.</p>
          </form>
        </section>
      )
    }

    return null
  }
}
