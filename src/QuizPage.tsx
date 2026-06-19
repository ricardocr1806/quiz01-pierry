import { useEffect, useMemo, useRef, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Option = { label: string; icon?: string; score?: number }

type Step =
  | { id: string; type: 'intro' }
  | { id: string; type: 'single'; key: string; question: string; subtitle?: string; options: Option[] }
  | { id: string; type: 'content'; title: string; body: string; highlight?: string }
  | { id: string; type: 'loading'; title: string; lines: string[]; durationMs?: number }
  | { id: string; type: 'dynamic-result' }
  | { id: string; type: 'capture'; title: string; subtitle: string }

// ─── Option sets ─────────────────────────────────────────────────────────────
const FREQ: Option[] = [
  { label: 'Quase sempre',   score: 3 },
  { label: 'Frequentemente', score: 2 },
  { label: 'Às vezes',       score: 1 },
  { label: 'Nunca',          score: 0 },
]
const FREQ_INV: Option[] = [
  { label: 'Nunca',          score: 3 },
  { label: 'Às vezes',       score: 2 },
  { label: 'Frequentemente', score: 1 },
  { label: 'Quase sempre',   score: 0 },
]

// ─── Steps base (intro + comuns 1-7) ─────────────────────────────────────────
const baseSteps: Step[] = [
  { id: 'intro', type: 'intro' },
  {
    id: 's1', type: 'single', key: 'idade',
    question: 'Qual é a sua idade?',
    options: [
      { label: '55 anos ou mais' }, { label: '45 a 54 anos' }, { label: '35 a 44 anos' },
      { label: '25 a 34 anos' }, { label: '18 a 24 anos' }, { label: 'Menos de 18 anos' },
    ],
  },
  {
    id: 's2', type: 'single', key: 'genero',
    question: 'Qual é o seu gênero?',
    options: [
      { label: 'Feminino', icon: '👩' }, { label: 'Masculino', icon: '👨' },
      { label: 'Prefiro não informar', icon: '🤐' },
    ],
  },
  {
    id: 's3', type: 'single', key: 'crista',
    question: 'Você se considera cristão?',
    options: [
      { label: 'Sim, sou cristão praticante', icon: '✝️' },
      { label: 'Sim, mas estou afastado', icon: '🙏' },
      { label: 'Acredito em Deus, mas não frequento igreja', icon: '⛪' },
      { label: 'Tenho dúvidas sobre fé', icon: '🤔' },
      { label: 'Não me considero cristão', icon: '❓' },
    ],
  },
  {
    id: 's4', type: 'single', key: 'moradia',
    question: 'Hoje, você mora com sua família?',
    options: [
      { label: 'Sim, moro com meus pais', icon: '👨‍👩‍👦' },
      { label: 'Sim, moro com meu cônjuge ou família', icon: '💑' },
      { label: 'Sim, moro com meus filhos', icon: '👶' },
      { label: 'Não, moro sozinho', icon: '🏠' },
      { label: 'Não, moro com outras pessoas', icon: '🏘️' },
    ],
  },
  {
    id: 's5', type: 'single', key: 'filhos',
    question: 'Você tem filhos?',
    options: [
      { label: 'Sim, tenho filhos pequenos', icon: '🧒' },
      { label: 'Sim, tenho filhos adolescentes', icon: '🧑' },
      { label: 'Sim, tenho filhos adultos', icon: '👦' },
      { label: 'Não tenho filhos', icon: '❌' },
      { label: 'Estou respondendo por causa de alguém da minha família', icon: '👨‍👩‍👧' },
    ],
  },
  {
    id: 's6', type: 'single', key: 'motivo',
    question: 'O que mais fez você iniciar este diagnóstico hoje?',
    options: [
      { label: 'Estou preocupado com meu filho', icon: '😟' },
      { label: 'Estou tentando entender minha própria identidade', icon: '🔍' },
      { label: 'Tenho dúvidas sobre sentimentos que estou vivendo', icon: '💭' },
      { label: 'Quero saber como lidar com alguém da minha família', icon: '👨‍👩‍👧' },
      { label: 'Sinto que existe algo emocionalmente mal resolvido', icon: '💔' },
      { label: 'Não sei exatamente, mas esse assunto me chamou atenção', icon: '✨' },
    ],
  },
  {
    id: 's7', type: 'single', key: 'relacao',
    question: 'Qual é a sua relação com a homossexualidade?',
    options: [
      { label: 'Sou pai', icon: '👨' },
      { label: 'Sou mãe', icon: '👩' },
      { label: 'Sou familiar ou responsável por alguém que vive essa questão', icon: '👨‍👩‍👧' },
      { label: 'Sou homossexual', icon: '🏳️‍🌈' },
      { label: 'Estou em dúvida sobre minha sexualidade', icon: '🤔' },
    ],
  },
]

// ─── Fluxo 1 — Pais ──────────────────────────────────────────────────────────
const parentsSteps: Step[] = [
  {
    id: 'pi', type: 'content',
    title: 'Agora vamos olhar para a relação entre você e seu filho',
    body: 'Talvez você já tenha percebido sinais. Talvez ainda esteja em dúvida. Talvez tenha medo de estar exagerando.<br/><br/>As próximas perguntas vão ajudar você a identificar sinais de desconexão emocional, fragilidade de identidade, ausência de pertencimento e dificuldade de comunicação dentro da família.<br/><br/>Não se trata de procurar culpados. Trata-se de compreender o que pode estar acontecendo por trás do comportamento, da distância, do silêncio ou da mudança que você tem percebido.',
  },
  { id: 'p8',  type: 'single', key: 'p_mudancas',       question: 'Seu filho tem demonstrado mudanças de comportamento nos últimos tempos?',                                                               options: FREQ },
  { id: 'p9',  type: 'single', key: 'p_distante',        question: 'Você percebe que seu filho está mais fechado, distante ou difícil de acessar emocionalmente?',                                         options: FREQ },
  { id: 'p10', type: 'single', key: 'p_sentimentos',     question: 'Você sente que conhece o comportamento do seu filho, mas não sabe exatamente o que ele sente por dentro?',                              options: FREQ },
  { id: 'p11', type: 'single', key: 'p_evita',           question: 'Seu filho evita conversar sobre sentimentos, identidade, sexualidade ou relacionamentos?',                                              options: FREQ },
  { id: 'p12', type: 'single', key: 'p_fecha',           question: 'Quando você tenta conversar, ele se fecha, se irrita ou muda de assunto?',                                                              options: FREQ },
  { id: 'p13', type: 'single', key: 'p_medo_falar',      question: 'Você sente medo de falar algo errado e acabar afastando ainda mais seu filho?',                                                         options: FREQ },
  { id: 'p14', type: 'single', key: 'p_aceitacao_fora',  question: 'Seu filho parece buscar mais aceitação fora de casa do que dentro da família?',                                                          options: FREQ },
  { id: 'p15', type: 'single', key: 'p_redes',           question: 'Você percebe que amizades, grupos ou redes sociais influenciam muito a forma como ele se enxerga?',                                     options: FREQ },
  {
    id: 'pc1', type: 'content',
    title: 'Um filho pode morar dentro de casa e, ainda assim, sentir-se distante emocionalmente.',
    body: 'Muitos pais tentam corrigir o que aparece. Mas nem sempre conseguem compreender o que está por trás.<br/><br/>Antes de um filho falar sobre comportamento, escolhas ou sexualidade, muitas vezes ele já está carregando perguntas silenciosas.',
    highlight: '"Eu sou visto? Eu sou amado? Eu pertenço? Posso contar a verdade sem perder minha família?"',
  },
  { id: 'p16', type: 'single', key: 'p_incompreendido',  question: 'Seu filho já demonstrou sentir que não é compreendido dentro de casa?',                                                                  options: FREQ },
  { id: 'p17', type: 'single', key: 'p_conversa',        question: 'Na sua casa, conversas difíceis costumam terminar em discussão, silêncio ou afastamento?',                                              options: FREQ },
  { id: 'p18', type: 'single', key: 'p_corrigir',        question: 'Você costuma corrigir primeiro e tentar compreender depois?',                                                                            options: FREQ },
  { id: 'p19', type: 'single', key: 'p_vergonha',        question: 'Quando o assunto é homossexualidade, você sente medo, vergonha, culpa ou sensação de fracasso?',                                        options: FREQ },
  { id: 'p20', type: 'single', key: 'p_palavras_duras',  question: 'Você já reagiu com palavras duras, ameaças ou comparações e depois percebeu que isso aumentou a distância?',                            options: FREQ },
  { id: 'p21', type: 'single', key: 'p_controle',        question: 'Você sente que, às vezes, tenta controlar seu filho porque tem medo de perdê-lo?',                                                      options: FREQ },
  { id: 'p22', type: 'single', key: 'p_coracao',         question: 'Seu filho sente que pode abrir o coração sem medo de ser rejeitado por você?',                                                           options: FREQ_INV },
  { id: 'p23', type: 'single', key: 'p_amor',            question: 'Você consegue demonstrar amor sem sentir que está aprovando tudo?',                                                                       options: FREQ_INV },
  { id: 'p24', type: 'single', key: 'p_guerra',          question: 'Você consegue manter suas convicções sem transformar a relação em uma guerra?',                                                           options: FREQ_INV },
  {
    id: 'p25', type: 'single', key: 'p_clareza',
    question: 'Você sente que sabe como conduzir essa situação com amor, verdade e sabedoria?',
    options: [
      { label: 'Não sei por onde começar',              score: 3 },
      { label: 'Tenho muitas dúvidas',                  score: 2 },
      { label: 'Tenho alguma clareza, mas ainda tenho medo', score: 1 },
      { label: 'Sim, tenho clareza',                    score: 0 },
    ],
  },
  {
    id: 'p26', type: 'single', key: 'p_desejo',
    question: 'Hoje, o que você mais deseja em relação ao seu filho?',
    options: [
      { label: 'Restaurar a conexão', icon: '❤️' },
      { label: 'Entender o que está acontecendo', icon: '🔍' },
      { label: 'Saber como conversar sem afastar', icon: '💬' },
      { label: 'Ajudá-lo sem agredir ou condenar', icon: '🤝' },
      { label: 'Manter minhas convicções sem perder meu filho', icon: '⚖️' },
      { label: 'Todas as opções acima', icon: '✨' },
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
    title: 'Última etapa antes do seu diagnóstico completo',
    subtitle: 'Informe seu nome e WhatsApp para receber o diagnóstico e as informações sobre a Imersão:',
  },
]

// ─── Fluxo 2 — Pessoa ────────────────────────────────────────────────────────
const personSteps: Step[] = [
  {
    id: 'bpi', type: 'content',
    title: 'Agora vamos olhar para a sua história',
    body: 'Este caminho não foi criado para te acusar. Também não foi criado para te reduzir à sua sexualidade.<br/><br/>Você é maior do que aquilo que sente, viveu, escondeu ou aprendeu a mostrar para ser aceito.<br/><br/>As próximas perguntas vão ajudar você a perceber se existem áreas da sua identidade, da sua história e das suas emoções que ainda estão escondidas, confusas ou sem um lugar seguro para serem compreendidas.',
  },
  {
    id: 'b8', type: 'single', key: 'b_fase',
    question: 'Em que fase você começou a perceber conflitos relacionados à sua sexualidade ou identidade?',
    options: [
      { label: 'Na infância', icon: '🧒' },
      { label: 'Na adolescência', icon: '🧑' },
      { label: 'Na juventude', icon: '👦' },
      { label: 'Na fase adulta', icon: '🧑‍💼' },
      { label: 'Ainda estou tentando entender', icon: '🤔' },
    ],
  },
  { id: 'b9',  type: 'single', key: 'b_esconder',      question: 'Você sente que precisou esconder partes de si para não ser rejeitado?',                                                           options: FREQ },
  { id: 'b10', type: 'single', key: 'b_diferenca',     question: 'Você sente que existe uma diferença entre quem você mostra ser e o que realmente sente por dentro?',                              options: FREQ },
  { id: 'b11', type: 'single', key: 'b_versao',        question: 'Você já sentiu que precisava criar uma versão de si mesmo para ser aceito?',                                                      options: FREQ },
  { id: 'b12', type: 'single', key: 'b_medo_conhecer', question: 'Você sente medo de que, se as pessoas conhecerem toda a sua história, deixarão de amar você?',                                    options: FREQ },
  { id: 'b13', type: 'single', key: 'b_rotulo',        question: 'Você sente que sua sexualidade se tornou a principal forma como as pessoas te enxergam?',                                          options: FREQ },
  {
    id: 'b14', type: 'single', key: 'b_alem',
    question: 'Você gostaria de ser visto para além da sua orientação sexual?',
    options: [
      { label: 'Sim, profundamente', score: 3 },
      { label: 'Sim',                score: 2 },
      { label: 'Às vezes',           score: 1 },
      { label: 'Nunca pensei nisso', score: 0 },
    ],
  },
  { id: 'b15', type: 'single', key: 'b_pertencimento', question: 'Você sente que busca pertencimento em pessoas, grupos ou relacionamentos?',                                                         options: FREQ },
  {
    id: 'bc1', type: 'content',
    title: 'Às vezes, a pessoa não está apenas buscando prazer.',
    body: 'Ela está buscando pertencimento, aceitação, afeto, segurança e um lugar onde não precise se esconder.<br/><br/>Isso não significa reduzir sua história a uma única causa. Significa olhar com coragem para tudo o que formou sua maneira de se enxergar.',
    highlight: 'Você não é apenas o que sente. Você não é apenas o que viveu. Existe uma história por trás da identidade.',
  },
  { id: 'b16', type: 'single', key: 'b_visto_familia',  question: 'Você se sentiu emocionalmente visto, amado e validado na sua família?',                                                            options: FREQ_INV },
  { id: 'b17', type: 'single', key: 'b_rejeicao',       question: 'Você já carregou sentimentos de rejeição, abandono ou solidão dentro da própria casa?',                                           options: FREQ },
  { id: 'b18', type: 'single', key: 'b_conversar_pais', question: 'Você teve dificuldade de conversar com seus pais ou familiares sobre o que sentia?',                                               options: FREQ },
  { id: 'b19', type: 'single', key: 'b_esconder_dor',   question: 'Você sentiu que precisava esconder sua dor para não decepcionar sua família?',                                                     options: FREQ },
  { id: 'b20', type: 'single', key: 'b_dores_inf',      question: 'Você sente que algumas dores da infância ou adolescência ainda influenciam suas escolhas hoje?',                                   options: FREQ },
  { id: 'b21', type: 'single', key: 'b_busca_passado',  question: 'Você busca em relacionamentos aquilo que gostaria de ter recebido emocionalmente no passado?',                                     options: FREQ },
  { id: 'b22', type: 'single', key: 'b_vazio',          question: 'Mesmo quando recebe atenção ou carinho, você ainda sente vazio, insegurança ou medo de ser abandonado?',                          options: FREQ },
  { id: 'b23', type: 'single', key: 'b_sentimentos',    question: 'Você sente que sentimentos intensos acabam definindo rapidamente quem você acredita ser?',                                         options: FREQ },
  {
    id: 'bc2', type: 'content',
    title: 'Nem todo sentimento precisa se tornar identidade final.',
    body: 'Nem toda dor precisa continuar governando sua história.<br/><br/>Existe diferença entre sentir algo, viver algo, sofrer algo e construir toda a identidade a partir disso.',
    highlight: 'A pergunta mais profunda: "O que aconteceu comigo?" e "Quem eu sou além daquilo que tento provar?"',
  },
  { id: 'b24', type: 'single', key: 'b_conflito_fe',    question: 'Existe conflito entre aquilo que você sente, aquilo em que acredita e a forma como vive hoje?',                                    options: FREQ },
  { id: 'b25', type: 'single', key: 'b_culpa_fe',       question: 'Você sente culpa, vergonha ou confusão quando pensa sobre sua identidade e sua fé?',                                              options: FREQ },
  { id: 'b26', type: 'single', key: 'b_alem_rotulo',    question: 'Você já se perguntou quem você seria para além dos desejos, relacionamentos e rótulos que recebeu?',                              options: FREQ },
  { id: 'b27', type: 'single', key: 'b_oculta',         question: 'Você sente que existe uma parte da sua identidade que permanece oculta, mesmo para pessoas próximas?',                             options: FREQ },
  { id: 'b28', type: 'single', key: 'b_medo_historia',  question: 'Você tem medo de olhar para sua própria história com profundidade?',                                                               options: FREQ },
  {
    id: 'b29', type: 'single', key: 'b_compreender',
    question: 'Você gostaria de compreender melhor suas dores, vínculos, desejos e conflitos sem ser condenado?',
    options: [
      { label: 'Sim, profundamente', score: 3 },
      { label: 'Sim',                score: 2 },
      { label: 'Talvez',             score: 1 },
      { label: 'Não sinto necessidade', score: 0 },
    ],
  },
  {
    id: 'b30', type: 'single', key: 'b_desejo',
    question: 'Hoje, o que você mais deseja?',
    options: [
      { label: 'Me entender melhor', icon: '🔍' },
      { label: 'Parar de viver escondido', icon: '🔓' },
      { label: 'Ser visto além da minha sexualidade', icon: '👁️' },
      { label: 'Compreender minha história', icon: '📖' },
      { label: 'Resolver conflitos entre fé, identidade e sentimentos', icon: '⚖️' },
      { label: 'Encontrar um caminho de clareza', icon: '✨' },
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
    title: 'Última etapa antes do seu diagnóstico completo',
    subtitle: 'Informe seu nome e WhatsApp para receber o diagnóstico e as informações sobre a Imersão:',
  },
]

// ─── Result data ─────────────────────────────────────────────────────────────
const PARENTS_RESULTS = [
  {
    min: 0, max: 18,
    label: 'BAIXO', color: 'text-yellow-600',
    title: 'Sinais iniciais de atenção',
    headline: 'Existe uma base de conexão, mas algumas áreas precisam ser fortalecidas.',
    diagnosis: 'Suas respostas mostram que ainda existe uma base de relacionamento entre você e seu filho. Mas também existem sinais de que algumas conversas, sentimentos ou assuntos delicados podem estar sendo evitados.',
    indicators: [
      'Ainda existe abertura emocional.',
      'Algumas conversas podem estar sendo evitadas.',
      'Seu filho pode não compartilhar tudo o que sente.',
      'Você precisa fortalecer a escuta e a presença.',
      'Pequenas mudanças agora podem evitar grandes distâncias depois.',
    ],
    message: 'A conexão não deve ser reconstruída apenas quando se perde. Ela precisa ser cultivada antes da crise.',
  },
  {
    min: 19, max: 36,
    label: 'MODERADO', color: 'text-orange-600',
    title: 'Fragilidades emocionais presentes',
    headline: 'Seu filho pode estar enfrentando fragilidades de pertencimento, validação e segurança emocional.',
    diagnosis: 'Com base nas suas respostas, existem sinais de que seu filho pode não estar encontrando respostas suficientemente claras para perguntas profundas como: "Eu sou amado? Eu pertenço? Posso falar sem ser rejeitado?"',
    indicators: [
      'Seu filho pode estar emocionalmente distante.',
      'Existe busca de validação fora da família.',
      'Algumas conversas podem gerar defesa.',
      'Você pode estar tentando corrigir antes de compreender.',
      'Falta uma conexão mais segura e verdadeira.',
    ],
    message: 'Seu filho talvez não esteja precisando apenas de respostas. Ele pode estar precisando reencontrar uma conexão verdadeira com você.',
  },
  {
    min: 37, max: 54,
    label: 'ALTO', color: 'text-red-600',
    title: 'Conflitos ativos de identidade e conexão',
    headline: 'A distância emocional já pode estar interferindo na relação familiar.',
    diagnosis: 'Suas respostas apontam para um nível significativo de desconexão, medo, insegurança ou perda de confiança. Talvez você já tenha tentado corrigir, argumentar, pressionar ou confrontar. Mas, quanto mais tenta controlar, mais sente que seu filho se fecha.',
    indicators: [
      'Seu filho pode sentir mais pressão do que compreensão.',
      'Existe medo de rejeição ou perda de pertencimento.',
      'As conversas podem estar se transformando em disputas.',
      'Suas próprias feridas podem estar influenciando suas reações.',
      'A confiança precisa ser reconstruída antes que a distância aumente.',
    ],
    message: 'A correção sem conexão pode gerar resistência. A conexão prepara o coração para ouvir direção.',
  },
  {
    min: 55, max: 999,
    label: 'CRÍTICO', color: 'text-red-700',
    title: 'Necessidade urgente de clareza e restauração',
    headline: 'Sua família precisa de uma nova estratégia antes que a distância se transforme em ruptura.',
    diagnosis: 'Suas respostas mostram sinais fortes de perda de confiança, insegurança emocional, conflitos repetitivos ou afastamento. Neste momento, repetir as mesmas estratégias tende a gerar os mesmos resultados.',
    indicators: [
      'A relação precisa de reconstrução intencional.',
      'Seu filho pode ter deixado de enxergar a família como espaço seguro.',
      'Você pode estar corrigindo a partir do medo.',
      'Falta um caminho para unir amor, verdade e posicionamento.',
      'A conexão precisa vir antes da correção.',
    ],
    message: 'Seu filho não precisa apenas de pais preocupados. Ele precisa de pais presentes, restaurados e posicionados.',
  },
]

const PERSON_RESULTS = [
  {
    min: 0, max: 18,
    label: 'INICIAL', color: 'text-yellow-600',
    title: 'Sinais iniciais de conflito interno',
    headline: 'Existem áreas da sua história que talvez ainda precisem ser compreendidas.',
    diagnosis: 'Suas respostas mostram que você possui alguma percepção sobre sua história, seus sentimentos e seus conflitos. Mas também indicam que existem assuntos que talvez ainda estejam sendo evitados.',
    indicators: [
      'Existem perguntas internas ainda não respondidas.',
      'Algumas emoções podem estar sendo guardadas.',
      'Sua história precisa ser compreendida com mais profundidade.',
      'Talvez você ainda não tenha encontrado um espaço seguro para falar.',
      'Este pode ser um momento importante para buscar clareza.',
    ],
    message: 'Você não precisa esperar uma crise para começar a compreender sua história.',
  },
  {
    min: 19, max: 36,
    label: 'MODERADO', color: 'text-orange-600',
    title: 'Identidade construída em busca de aceitação',
    headline: 'Partes da sua identidade podem estar sendo sustentadas pela necessidade de pertencimento.',
    diagnosis: 'Com base nas suas respostas, percebemos que a necessidade de aceitação pode ocupar um espaço importante na sua vida. Talvez você tenha aprendido a esconder sentimentos, adaptar sua personalidade e buscar validação em relacionamentos.',
    indicators: [
      'Você pode ter aprendido a esconder partes de si.',
      'Existe medo de rejeição.',
      'A opinião das pessoas pode influenciar sua percepção de valor.',
      'Relacionamentos podem estar sendo usados como fonte de identidade.',
      'Você precisa compreender quem é para além da necessidade de aceitação.',
    ],
    message: 'Quando pertencimento vira sobrevivência, a pessoa pode começar a se moldar para não ser abandonada.',
  },
  {
    min: 37, max: 54,
    label: 'INTENSO', color: 'text-red-600',
    title: 'Identidade oculta e conflito interno ativo',
    headline: 'Você pode estar vivendo dividido entre sentimentos, convicções e medo da rejeição.',
    diagnosis: 'Suas respostas revelam um conflito importante. Existe uma parte de você que deseja ser aceita. Outra parte deseja compreender com profundidade quem você é. Com o tempo, essa divisão pode produzir cansaço, ansiedade, vergonha e isolamento.',
    indicators: [
      'Você pode estar escondendo conflitos importantes.',
      'Existe distância entre sua vida externa e seu mundo interior.',
      'O medo de perder pessoas pode estar limitando sua honestidade.',
      'Dores antigas ainda podem influenciar sua percepção de valor.',
      'Você deseja compreensão, mas pode temer olhar para algumas áreas.',
    ],
    message: 'Você é maior do que aquilo que sente, viveu ou aprendeu a mostrar para ser aceito.',
  },
  {
    min: 55, max: 999,
    label: 'CRÍTICO', color: 'text-red-700',
    title: 'Fragmentação emocional e necessidade de reconstrução',
    headline: 'Sua identidade pode estar organizada ao redor de dores e conflitos que ainda não foram tratados.',
    diagnosis: 'Suas respostas indicam um nível elevado de conflito emocional, insegurança e dependência da validação externa. Neste momento, você não precisa de condenação. Você precisa de um caminho seguro para compreender sua história com verdade e dignidade.',
    indicators: [
      'Existe medo intenso de rejeição ou abandono.',
      'A aceitação externa pode estar governando suas escolhas.',
      'Algumas dores ainda permanecem ocultas.',
      'Sua sexualidade pode ter se tornado o centro da sua definição pessoal.',
      'Você precisa reconstruir sua identidade a partir de uma base mais ampla e segura.',
    ],
    message: 'Uma identidade fortalecida não nasce da negação da história, mas da coragem de compreendê-la por inteiro.',
  },
]

// ─── Helper components ────────────────────────────────────────────────────────
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

function PrimaryButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="w-full bg-primary text-white font-bold py-4 rounded-2xl text-sm shadow-lg hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none"
    >
      {children}
    </button>
  )
}

function ChoiceCard({ option, selected, onClick }: { option: Option; selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border-2 bg-white transition-all active:scale-[0.98] hover:border-primary hover:shadow-sm text-sm font-medium ${
        selected ? 'border-primary bg-primary-soft shadow-sm' : 'border-border'
      }`}
    >
      {option.icon && <span className="text-xl shrink-0">{option.icon}</span>}
      <span className="flex-1 leading-snug">{option.label}</span>
      <span className={`size-4 rounded-full border-2 shrink-0 ${selected ? 'border-primary bg-primary' : 'border-border'}`} />
    </button>
  )
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="fixed top-1 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="rainbow-progress h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
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
  const duration = step.durationMs ?? 3500

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const p = Math.min(100, (elapsed / duration) * 100)
      setPct(p)
      setLineIdx(Math.min(step.lines.length - 1, Math.floor((p / 100) * step.lines.length)))
      if (p >= 100) { clearInterval(id); setTimeout(onDone, 400) }
    }, 80)
    return () => clearInterval(id)
  }, [duration, step.lines.length, onDone])

  return (
    <section className="py-12 text-center space-y-6">
      <div className="text-4xl animate-pulse-soft">🔍</div>
      <h1 className="text-lg font-bold">{step.title}</h1>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="loading-bar h-full rounded-full transition-all duration-200" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm text-primary font-semibold animate-pulse-soft min-h-[1.25rem]">{step.lines[lineIdx]}</p>
      <div className="text-xs tabular-nums text-muted-foreground">{Math.round(pct)}%</div>
    </section>
  )
}

function DynamicResultStep({
  answers, score, onNext,
}: {
  answers: Record<string, unknown>
  score: number
  onNext: () => void
}) {
  const relacao = answers['relacao'] as string ?? ''
  const isParents = ['Sou pai', 'Sou mãe', 'Sou familiar ou responsável por alguém que vive essa questão'].includes(relacao)
  const results = isParents ? PARENTS_RESULTS : PERSON_RESULTS
  const result = results.find(r => score >= r.min && score <= r.max) ?? results[results.length - 1]

  return (
    <section className="space-y-5">
      <div className="text-center space-y-1">
        <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Diagnóstico personalizado</div>
        <h1 className="text-xl font-extrabold leading-tight">{result.title}</h1>
        <div className={`text-sm font-bold ${result.color}`}>Nível: {result.label}</div>
      </div>

      {/* Score gauge */}
      <div className="bg-white border rounded-2xl p-4">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide mb-1.5">
          <span className="text-yellow-600">Leve</span>
          <span className="text-orange-500">Moderado</span>
          <span className="text-red-600">Intenso</span>
          <span className="text-red-700">Crítico</span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (score / (isParents ? 54 : 63)) * 100)}%`,
              background: 'linear-gradient(to right, #EAB308, #F97316, #EF4444, #DC2626)',
            }}
          />
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-bold text-foreground">{result.headline}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.diagnosis}</p>
      </div>

      <div className="space-y-2">
        {result.indicators.map((ind, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-primary mt-0.5 shrink-0">•</span>
            <span>{ind}</span>
          </div>
        ))}
      </div>

      <div className="border-l-4 border-primary bg-primary-soft p-4 rounded-r-xl">
        <p className="text-sm font-semibold text-foreground leading-relaxed">{result.message}</p>
      </div>

      <PrimaryButton onClick={onNext}>Ver meu plano de restauração →</PrimaryButton>
    </section>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function QuizPage({ onComplete }: { onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [score, setScore] = useState(0)
  const [multiSel, setMultiSel] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '' })

  const PARENT_OPTIONS = ['Sou pai', 'Sou mãe', 'Sou familiar ou responsável por alguém que vive essa questão']

  const activeSteps = useMemo<Step[]>(() => {
    const relacao = answers['relacao'] as string | undefined
    if (!relacao) return baseSteps
    return PARENT_OPTIONS.includes(relacao)
      ? [...baseSteps, ...parentsSteps]
      : [...baseSteps, ...personSteps]
  }, [answers])

  const step = activeSteps[stepIdx]
  const pct = ((stepIdx) / (activeSteps.length - 1)) * 100

  useEffect(() => {
    setMultiSel([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stepIdx])

  const next = () => setStepIdx(i => Math.min(i + 1, activeSteps.length - 1))
  const prev = () => setStepIdx(i => Math.max(i - 1, 0))

  const handleSingle = (opt: Option) => {
    const key = (step as { key?: string }).key ?? step.id
    setAnswers(a => ({ ...a, [key]: opt.label }))
    if (opt.score !== undefined) setScore(s => s + opt.score!)
    setTimeout(next, 180)
  }

  const handleCapture = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.whatsapp) return
    const relacao = answers['relacao'] as string ?? ''
    const isParents = PARENT_OPTIONS.includes(relacao)
    const payload = {
      ...answers,
      ...form,
      flow: isParents ? 'parents' : 'person',
      score,
      completedAt: new Date().toISOString(),
    }
    try { localStorage.setItem('quiz_lead', JSON.stringify(payload)) } catch {}
    onComplete()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Rainbow stripe top */}
      <div className="rainbow-bar h-1 fixed top-0 left-0 right-0 z-[100]" />

      {step.type !== 'intro' && <ProgressBar pct={pct} />}

      {stepIdx > 0 && step.type !== 'loading' && step.type !== 'dynamic-result' && (
        <button
          onClick={prev}
          className="fixed top-12 left-3 p-2 text-muted-foreground hover:text-foreground z-50"
          aria-label="Voltar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className="max-w-lg mx-auto px-4 pt-16 pb-16">
        <div key={step.id} className="animate-fade-up">
          {renderStep()}
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="text-center text-[10px] text-muted-foreground px-6 pb-8 leading-relaxed max-w-lg mx-auto">
        Este diagnóstico possui finalidade educacional e reflexiva. Não substitui acompanhamento psicológico ou profissional.
      </div>
    </main>
  )

  function renderStep() {
    if (!step) return null

    switch (step.type) {
      case 'intro':
        return (
          <section className="space-y-5 pt-4">
            {/* Logo area */}
            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground border rounded-full px-3 py-1">
                <span>🏳️‍🌈</span> Diagnóstico Gratuito
              </div>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold leading-tight text-foreground">
                Descubra o que pode estar por trás dos conflitos de identidade e dos afastamentos familiares
              </h1>
              <span className="rainbow-underline" />
            </div>

            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Este diagnóstico foi criado para ajudar pais, mães, familiares e pessoas que vivem conflitos relacionados à homossexualidade a identificar sinais emocionais e familiares que influenciam a construção da identidade.
            </p>

            <div className="bg-muted/50 border rounded-xl p-4 space-y-2 text-sm text-foreground/80 leading-relaxed">
              <p>Muitas vezes, o que aparece por fora não começou por fora.</p>
              <p>Por trás de um comportamento pode existir uma história.</p>
              <p>Por trás de uma escolha pode existir uma dor.</p>
              <p className="font-medium text-foreground">Este quiz não foi criado para acusar. Ele foi criado para trazer clareza, consciência e direção.</p>
            </div>

            <PrimaryButton onClick={next}>
              COMEÇAR MEU DIAGNÓSTICO GRATUITO →
            </PrimaryButton>

            <p className="text-[11px] text-center text-muted-foreground">
              🔒 Gratuito · Confidencial · Leva cerca de 5 minutos
            </p>
          </section>
        )

      case 'single': {
        return (
          <section className="space-y-4">
            <h1 className="text-[17px] sm:text-lg font-bold leading-snug text-center">{step.question}</h1>
            {step.subtitle && <p className="text-xs text-muted-foreground text-center">{step.subtitle}</p>}
            <div className="space-y-2 mt-3">
              {step.options.map((o, i) => (
                <ChoiceCard key={i} option={o} onClick={() => handleSingle(o)} />
              ))}
            </div>
          </section>
        )
      }

      case 'content': {
        const bodyParts = step.body.split('<br/><br/>')
        return (
          <section className="space-y-4">
            <h1 className="text-lg sm:text-xl font-bold leading-tight text-center"><HL text={step.title} /></h1>
            <div className="text-sm text-foreground/80 leading-relaxed space-y-3 text-center">
              {bodyParts.map((part, i) => (
                <p key={i}><HL text={part} /></p>
              ))}
            </div>
            {step.highlight && (
              <div className="border-l-4 border-primary bg-primary-soft p-4 rounded-r-xl">
                <p className="text-sm font-semibold text-foreground leading-relaxed">{step.highlight}</p>
              </div>
            )}
            <PrimaryButton onClick={next}>Continuar →</PrimaryButton>
          </section>
        )
      }

      case 'loading':
        return <LoadingStep step={step} onDone={next} />

      case 'dynamic-result':
        return <DynamicResultStep answers={answers} score={score} onNext={next} />

      case 'capture':
        return (
          <section className="space-y-5">
            <h1 className="text-lg sm:text-xl font-bold text-center leading-tight"><HL text={step.title} /></h1>
            <p className="text-sm text-muted-foreground text-center">{step.subtitle}</p>
            <form onSubmit={handleCapture} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Primeiro nome</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Seu nome"
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">WhatsApp</label>
                <input
                  value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  required
                  inputMode="tel"
                  placeholder="(00) 00000-0000"
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">E-mail (opcional)</label>
                <input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none text-sm bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-green-600/20 hover:bg-green-700 active:scale-[0.98] transition"
              >
                Receber meu diagnóstico completo →
              </button>
              <p className="text-[11px] text-center text-muted-foreground">🔒 Seus dados são usados apenas para te enviar seu plano. Nada de spam.</p>
            </form>
          </section>
        )
    }
  }
}
