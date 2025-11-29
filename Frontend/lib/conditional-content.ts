/**
 * Conteúdo condicional personalizado por tipo de problema ortodôntico
 * Fase 3: Personalização Avançada
 */

export interface CaseSpecificContent {
  tipo: string
  titulo: string
  descricao: string
  causas: string[]
  comoAlinhadoresAjudam: string
  tempoEstimado: string
  complexidade: 'Simples' | 'Moderado' | 'Complexo'
  dicasEspeciais: string[]
  cuidadosExtras: string[]
}

/**
 * Identifica o tipo principal de problema ortodôntico
 */
export function identifyMainProblem(problemasAtuais: string[]): string {
  const problemMap: { [key: string]: string } = {
    'Apinhamento (dentes montados)': 'apinhamento',
    'Dentes separados/espaçados': 'diastema',
    'Sobremordida (dentes superiores cobrem muito os inferiores)': 'sobremordida',
    'Prognatismo (queixo para frente)': 'prognatismo',
    'Mordida cruzada': 'mordida-cruzada',
    'Dentes tortos': 'tortos',
    'Dentes da frente para frente': 'protrusao'
  }

  // Priorizar problemas mais complexos
  const priority = ['prognatismo', 'mordida-cruzada', 'sobremordida', 'apinhamento', 'protrusao', 'diastema', 'tortos']

  for (const prior of priority) {
    for (const problema of problemasAtuais) {
      if (problemMap[problema] === prior) {
        return prior
      }
    }
  }

  return 'geral'
}

/**
 * Retorna conteúdo específico para Apinhamento
 */
export function getApinhamentoContent(): CaseSpecificContent {
  return {
    tipo: 'apinhamento',
    titulo: 'Seu Caso: Apinhamento Dentário',
    descricao: 'Apinhamento ocorre quando não há espaço suficiente na arcada para todos os dentes se posicionarem corretamente, resultando em dentes sobrepostos ou "montados" uns sobre os outros.',
    causas: [
      'Arcada dentária pequena para o tamanho dos dentes',
      'Perda precoce de dentes de leite (criando espaço insuficiente)',
      'Fatores genéticos (herdado dos pais)',
      'Respiração bucal crônica durante desenvolvimento',
      'Hábitos como chupar dedo ou chupeta por tempo prolongado'
    ],
    comoAlinhadoresAjudam: 'Alinhadores invisíveis são EXCELENTES para casos de apinhamento! Eles aplicam força gradual e constante para criar espaço e movimentar os dentes para posições corretas. Em casos leves a moderados, alinhadores são tão eficazes quanto aparelhos fixos, com a vantagem de serem removíveis e mais confortáveis. Pode ser necessário fazer "stripping" (desgaste interproximal controlado) para criar espaço adicional entre os dentes.',
    tempoEstimado: '6-18 meses (dependendo da severidade)',
    complexidade: 'Moderado',
    dicasEspeciais: [
      'Use "chewies" (mastigadores) para garantir que os alinhadores se encaixem perfeitamente nos dentes sobrepostos',
      'Seja paciente: dentes apinhados podem causar mais desconforto inicial ao movimentar',
      'Stripping (se necessário) é indolor e cria espaço de forma controlada',
      'Check-ups frequentes são importantes para monitorar o progresso em casos moderados a severos'
    ],
    cuidadosExtras: [
      'Fio dental é ESSENCIAL: dentes apinhados acumulam mais placa',
      'Use escovas interdentais para áreas de difícil acesso',
      'Pode haver sensibilidade temporária ao criar espaços entre dentes',
      'Limpe os alinhadores 2-3x ao dia (mais acúmulo de saliva em casos de apinhamento)'
    ]
  }
}

/**
 * Retorna conteúdo específico para Diastema
 */
export function getDiastemaContent(): CaseSpecificContent {
  return {
    tipo: 'diastema',
    titulo: 'Seu Caso: Diastema (Dentes Espaçados)',
    descricao: 'Diastema é caracterizado por espaços visíveis entre os dentes, sendo mais comum entre os incisivos centrais superiores (dentes da frente). Pode ocorrer entre vários dentes ou apenas em um ponto específico.',
    causas: [
      'Desproporção entre tamanho dos dentes e tamanho da arcada',
      'Freio labial muito espesso ou baixo (tecido que liga lábio à gengiva)',
      'Hábitos como empurrar língua contra dentes (deglutição atípica)',
      'Perda de dentes sem reposição adequada',
      'Fatores genéticos (comum em algumas famílias)'
    ],
    comoAlinhadoresAjudam: 'Alinhadores são IDEAIS para fechar diastemas! Este é um dos casos mais simples e com resultados rápidos. Os alinhadores aplicam pressão gradual para aproximar os dentes, fechando os espaços de forma controlada e estética. Não há necessidade de desgaste dentário. Em muitos casos, o diastema pode ser completamente fechado em 3-8 meses, dependendo do tamanho do espaço.',
    tempoEstimado: '3-10 meses (casos simples: 3-6 meses)',
    complexidade: 'Simples',
    dicasEspeciais: [
      'Resultado rápido e visível: muitos pacientes veem mudanças nas primeiras semanas',
      'Contenção é CRUCIAL: diastemas têm alta taxa de recidiva (reabertura)',
      'Se o freio labial for a causa, pode ser necessário frenectomia (procedimento simples)',
      'Evite hábitos de pressionar língua contra dentes durante e após tratamento',
      'Use contenção PERMANENTEMENTE para manter resultado (especialmente à noite)'
    ],
    cuidadosExtras: [
      'À medida que dentes se aproximam, higiene fica mais importante',
      'Use fio dental religiosamente para evitar cáries entre dentes que estão se fechando',
      'Contenções devem ser usadas indefinidamente (pelo menos noturno)',
      'Se sentir pressão excessiva, pode ser necessário ajustar velocidade de troca de alinhadores'
    ]
  }
}

/**
 * Retorna conteúdo específico para Sobremordida
 */
export function getSobremordidaContent(): CaseSpecificContent {
  return {
    tipo: 'sobremordida',
    titulo: 'Seu Caso: Sobremordida Profunda',
    descricao: 'Sobremordida (ou "overbite") ocorre quando os dentes superiores cobrem excessivamente os dentes inferiores ao fechar a boca. Em casos normais, há uma sobreposição de 10-20%, mas em sobremordida profunda, essa sobreposição ultrapassa 30-50%.',
    causas: [
      'Desenvolvimento desproporcional entre maxila e mandíbula',
      'Perda de dentes posteriores (molares) sem reposição',
      'Hábitos de roer unhas ou chupar dedo na infância',
      'Bruxismo (ranger de dentes) causando desgaste posterior',
      'Fatores genéticos (mandíbula pequena ou retrognatia)'
    ],
    comoAlinhadoresAjudam: 'Alinhadores podem corrigir sobremordidas moderadas com sucesso! O tratamento envolve "intrusão" (empurrar dentes anteriores para dentro do osso) e/ou "extrusão" dos posteriores. Muitas vezes são usados "attachments" (pequenos botões nos dentes) e elásticos intermaxilares para ajudar na correção. Casos severos podem requerer combinação com outros tratamentos.',
    tempoEstimado: '12-24 meses (casos moderados: 12-18 meses)',
    complexidade: 'Moderado',
    dicasEspeciais: [
      'Elásticos intermaxilares: use EXATAMENTE conforme orientado (22h/dia)',
      'Attachments serão necessários: são pequenos, discretos e removidos ao final',
      'Progresso é gradual: não espere mudanças drásticas nos primeiros meses',
      'Check-ups a cada 4-6 semanas são essenciais para monitorar oclusão',
      'Pode haver desconforto ao morder nos primeiros meses (normal)'
    ],
    cuidadosExtras: [
      'Evite alimentos muito duros que possam soltar attachments',
      'Troque elásticos conforme orientado (geralmente 2x ao dia)',
      'Se tiver bruxismo, informe o ortodontista (pode precisar placa noturna)',
      'Atenção à higiene ao redor dos attachments (acúmulo de placa)',
      'Após tratamento, contenção é vital para evitar recidiva'
    ]
  }
}

/**
 * Retorna conteúdo específico para Prognatismo
 */
export function getPrognatismoContent(): CaseSpecificContent {
  return {
    tipo: 'prognatismo',
    titulo: 'Seu Caso: Prognatismo Mandibular',
    descricao: 'Prognatismo ocorre quando a mandíbula (maxilar inferior) está projetada para frente em relação ao maxilar superior, criando uma "mordida classe III". Visualmente, o queixo pode parecer proeminente e os dentes inferiores ficam à frente dos superiores.',
    causas: [
      'Crescimento excessivo da mandíbula (genético)',
      'Subdesenvolvimento do maxilar superior',
      'Fatores hereditários (comum em famílias)',
      'Respiração bucal crônica durante desenvolvimento',
      'Em raros casos, condições médicas (acromegalia)'
    ],
    comoAlinhadoresAjudam: 'Prognatismo é um dos casos MAIS COMPLEXOS para alinhadores. Alinhadores podem ajudar em casos LEVES onde o problema é principalmente dentário (posição dos dentes) e não esquelético (ossos da face). Se o prognatismo for severo e esquelético, pode ser necessário cirurgia ortognática combinada. Um ortodontista experiente avaliará se alinhadores são suficientes ou se outras intervenções são necessárias. IMPORTANTE: Consulta presencial é ESSENCIAL para este tipo de caso.',
    tempoEstimado: '18-30 meses (casos leves: 18-24 meses)',
    complexidade: 'Complexo',
    dicasEspeciais: [
      '⚠️ AVALIAÇÃO PRESENCIAL É OBRIGATÓRIA: Raio-X cefalométrico necessário',
      'Elásticos Classe III serão essenciais (use religiosamente)',
      'Attachments em múltiplos dentes serão necessários',
      'Pode ser necessário expandir palato superior (expansor antes de alinhadores)',
      'Em casos esqueléticos severos, alinhadores preparam para cirurgia ortognática',
      'Escolha ortodontista EXPERIENTE em casos complexos'
    ],
    cuidadosExtras: [
      'Comprometimento TOTAL é necessário: uso 22h/dia + elásticos',
      'Check-ups mais frequentes (a cada 3-4 semanas inicialmente)',
      'Monitore qualquer dor ou desconforto na ATM (articulação)',
      'Prepare-se para tratamento mais longo que casos simples',
      'Resultado pode não ser 100% perfeito (limitações biológicas)',
      'Contenção permanente é absolutamente necessária'
    ]
  }
}

/**
 * Retorna conteúdo específico para Mordida Cruzada
 */
export function getMordidaCruzadaContent(): CaseSpecificContent {
  return {
    tipo: 'mordida-cruzada',
    titulo: 'Seu Caso: Mordida Cruzada',
    descricao: 'Mordida cruzada ocorre quando um ou mais dentes superiores mordem por dentro dos dentes inferiores, invertendo a relação normal. Pode ser anterior (dentes da frente), posterior (laterais) ou unilateral (apenas um lado).',
    causas: [
      'Palato (céu da boca) estreito',
      'Atraso na queda de dentes de leite',
      'Respiração bucal crônica (nariz entupido)',
      'Hábitos como chupar dedo ou língua',
      'Assimetria no crescimento dos maxilares',
      'Fatores genéticos'
    ],
    comoAlinhadoresAjudam: 'Alinhadores podem corrigir mordidas cruzadas anteriores e casos leves de mordida cruzada posterior. Para mordidas cruzadas posteriores severas (palato muito estreito), pode ser necessário usar um EXPANSOR palatino ANTES dos alinhadores para alargar o céu da boca. Após expansão, alinhadores finalizam o alinhamento dentário. Casos unilaterais respondem bem a alinhadores com elásticos direcionais.',
    tempoEstimado: '12-24 meses (sem expansor) / 18-30 meses (com expansor)',
    complexidade: 'Complexo',
    dicasEspeciais: [
      'Se expansor for necessário, ele vem ANTES dos alinhadores (3-6 meses)',
      'Elásticos cruzados serão essenciais para corrigir a relação',
      'Attachments estratégicos ajudam na movimentação lateral',
      'Progresso pode ser assimétrico (um lado melhora antes)',
      'Acompanhamento ortodôntico frequente é crucial',
      '⚠️ Tratamento é tempo-dependente: não pule alinhadores'
    ],
    cuidadosExtras: [
      'Se usar expansor: higiene impecável (acúmulo de comida é comum)',
      'Elásticos devem ser trocados 2-3x ao dia conforme indicado',
      'Atenção a assimetrias faciais (podem melhorar com tratamento)',
      'Mastigação pode ser desconfortável inicialmente',
      'Após correção, contenção é VITAL (alta taxa de recidiva)',
      'Exercícios de mastigação bilateral podem ser recomendados'
    ]
  }
}

/**
 * Retorna conteúdo específico para Dentes Tortos (geral)
 */
export function getDentesTortosContent(): CaseSpecificContent {
  return {
    tipo: 'tortos',
    titulo: 'Seu Caso: Dentes Tortos/Rotacionados',
    descricao: 'Dentes tortos ou rotacionados apresentam angulação ou rotação incorreta em relação à arcada dentária. Podem estar virados, inclinados ou fora de alinhamento, mas sem necessariamente estarem sobrepostos (apinhamento) ou separados (diastema).',
    causas: [
      'Espaço insuficiente durante erupção',
      'Perda prematura de dentes de leite',
      'Trauma dentário (pancadas)',
      'Pressão da língua ou lábios',
      'Hábitos orais (roer unhas, chupar dedo)',
      'Fatores genéticos'
    ],
    comoAlinhadoresAjudam: 'Alinhadores são EXCELENTES para rotacionar e alinhar dentes tortos! Este é um dos casos mais comuns e com ótimos resultados. Attachments pequenos ajudam a criar "pegada" nos dentes rotacionados. O tratamento é gradual, com cada alinhador rotacionando dentes em pequenos incrementos (0.25-0.50mm por alinhador). Resultados são visíveis nas primeiras semanas.',
    tempoEstimado: '6-15 meses (depende do número de dentes afetados)',
    complexidade: 'Simples',
    dicasEspeciais: [
      'Attachments serão colocados nos dentes rotacionados (pequenos e discretos)',
      'Use "chewies" para garantir encaixe perfeito (especialmente em rotações)',
      'Progresso é gradual mas constante',
      'Fotos mensais ajudam a ver o progresso (às vezes difícil perceber no dia a dia)',
      'Rotações respondem muito bem a alinhadores'
    ],
    cuidadosExtras: [
      'Higiene ao redor de attachments (use escova macia)',
      'Dentes rotacionados podem ter pequenos espaços temporários durante correção',
      'Fio dental é essencial (novos contatos entre dentes se formam)',
      'Pode haver sensibilidade nos dentes rotacionados nos primeiros dias de cada alinhador',
      'Contenção após tratamento previne recidiva (rotações tendem a voltar)'
    ]
  }
}

/**
 * Retorna conteúdo específico para Protrusão
 */
export function getProtrusaoContent(): CaseSpecificContent {
  return {
    tipo: 'protrusao',
    titulo: 'Seu Caso: Protrusão Dentária (Dentes para Frente)',
    descricao: 'Protrusão dentária ocorre quando os dentes anteriores superiores (e às vezes inferiores) estão inclinados para frente, criando um perfil facial convexo. Os lábios podem não se fecharem totalmente em repouso.',
    causas: [
      'Hábitos de chupar dedo ou chupeta prolongados',
      'Deglutição atípica (empurrar língua contra dentes)',
      'Respiração bucal crônica',
      'Tamanho desproporcional entre dentes e arcada',
      'Fatores genéticos (biprotrusão familial)'
    ],
    comoAlinhadoresAjudam: 'Alinhadores são eficazes para protrusões leves a moderadas! O tratamento envolve "retrair" (puxar para trás) os dentes anteriores. Em alguns casos, pode ser necessário extrair pré-molares para criar espaço. IPR (stripping) também pode ser usado. Elásticos Classe II podem ser necessários. O perfil facial melhora significativamente à medida que dentes recuam.',
    tempoEstimado: '12-20 meses (com extração: 18-24 meses)',
    complexidade: 'Moderado',
    dicasEspeciais: [
      'Se extração de pré-molares for necessária, será feita ANTES dos alinhadores',
      'Elásticos Classe II são essenciais (use 22h/dia)',
      'Mudanças no perfil facial são graduais (meses)',
      'Lábios podem ficar ressecados inicialmente (adapte hidratação)',
      'Fotos de perfil ajudam a documentar melhoria estética',
      'Corrija hábito de língua (fonoaudiólogo pode ajudar)'
    ],
    cuidadosExtras: [
      'Se extrações forem feitas, higiene nos espaços é crucial',
      'Evite empurrar língua contra dentes (conscientemente)',
      'Troque elásticos conforme orientado',
      'Massagem labial pode ajudar na adaptação',
      'Contenção permanente previne recidiva (dentes tendem a voltar)',
      'Monitore hábitos de respiração (respire pelo nariz)'
    ]
  }
}

/**
 * Retorna conteúdo genérico para casos não específicos
 */
export function getGeralContent(): CaseSpecificContent {
  return {
    tipo: 'geral',
    titulo: 'Seu Caso: Desalinhamento Dentário',
    descricao: 'Seu caso apresenta características gerais de desalinhamento dentário que podem ser efetivamente tratadas com alinhadores invisíveis. Cada caso é único e requer avaliação profissional para planejamento personalizado.',
    causas: [
      'Fatores genéticos (herdados dos pais)',
      'Perda prematura de dentes de leite',
      'Hábitos orais (chupar dedo, roer unhas)',
      'Respiração bucal crônica',
      'Trauma dentário',
      'Desenvolvimento natural da arcada dentária'
    ],
    comoAlinhadoresAjudam: 'Alinhadores invisíveis aplicam força controlada e gradual para movimentar seus dentes para posições ideais. Cada alinhador é projetado para fazer micro-movimentos precisos. O sistema é eficaz, confortável e discreto, permitindo que você mantenha sua rotina normal durante o tratamento.',
    tempoEstimado: '6-18 meses (varia conforme complexidade)',
    complexidade: 'Moderado',
    dicasEspeciais: [
      'Use alinhadores 22 horas por dia para resultados ótimos',
      'Troque alinhadores conforme cronograma do ortodontista',
      'Compareça a todos os check-ups agendados',
      'Tire fotos mensais para acompanhar progresso',
      'Comunique qualquer desconforto incomum ao ortodontista'
    ],
    cuidadosExtras: [
      'Higiene bucal impecável: escove após cada refeição',
      'Limpe alinhadores 2-3x ao dia',
      'Use fio dental diariamente',
      'Evite alimentos e bebidas com alinhadores (exceto água)',
      'Guarde alinhadores anteriores como backup'
    ]
  }
}

/**
 * Obtém conteúdo específico baseado no tipo de problema
 */
export function getCaseSpecificContent(problemasAtuais: string[]): CaseSpecificContent {
  const mainProblem = identifyMainProblem(problemasAtuais)

  const contentMap: { [key: string]: () => CaseSpecificContent } = {
    'apinhamento': getApinhamentoContent,
    'diastema': getDiastemaContent,
    'sobremordida': getSobremordidaContent,
    'prognatismo': getPrognatismoContent,
    'mordida-cruzada': getMordidaCruzadaContent,
    'tortos': getDentesTortosContent,
    'protrusao': getProtrusaoContent,
    'geral': getGeralContent
  }

  const contentFn = contentMap[mainProblem] || getGeralContent
  return contentFn()
}
