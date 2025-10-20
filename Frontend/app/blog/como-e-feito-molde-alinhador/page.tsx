import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Zap, Camera, Cpu, Printer, Package } from 'lucide-react'
import { RelatedArticles } from '@/components/blog/related-articles'

export const metadata: Metadata = {
  title: 'Como é Feito o Molde para Alinhador Invisível? Processo Completo 2025',
  description: 'Descubra o passo a passo completo de como é feito o molde digital para alinhadores invisíveis: escaneamento 3D, planejamento com IA, impressão e fabricação.',
  keywords: [
    'como é feito alinhador invisível',
    'molde alinhador',
    'escaneamento 3D dental',
    'processo alinhador transparente',
    'fabricação alinhador',
    'tecnologia ortodôntica'
  ],
  openGraph: {
    title: 'Como é Feito o Molde para Alinhador Invisível? Processo Completo',
    description: 'Do escaneamento 3D à entrega: veja todas as etapas da fabricação de alinhadores invisíveis',
    type: 'article',
  },
  alternates: {
    canonical: 'https://atma.roilabs.com.br/blog/como-e-feito-molde-alinhador'
  }
}

export default function MoldeAlinhadorPage() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o blog
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Tecnologia</span>
            <span>•</span>
            <time dateTime="2025-01-20">20 de janeiro de 2025</time>
            <span>•</span>
            <span>6 min de leitura</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Passo a Passo: Como é Feito o Molde para Alinhador Invisível
          </h1>

          <p className="text-xl text-gray-700 leading-relaxed">
            Do escaneamento 3D digital até a entrega na sua casa: descubra todas as etapas tecnológicas que
            transformam um simples scan em alinhadores personalizados que vão transformar seu sorriso.
          </p>
        </header>

        {/* Introdução */}
        <section className="prose prose-lg max-w-none mb-12">
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg mb-8">
            <p className="text-gray-800 font-medium mb-2">
              💡 <strong>Resumo Rápido:</strong>
            </p>
            <p className="text-gray-700 mb-0">
              O processo completo leva 7-10 dias e envolve 8 etapas principais: escaneamento 3D digital (sem
              molde tradicional), planejamento com inteligência artificial, impressão 3D de modelos,
              termoformagem do PETG alemão, corte a laser, polimento, controle de qualidade e entrega.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            A Revolução: Adeus aos Moldes de Massa Tradicionais
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Se você já fez tratamento ortodôntico no passado, provavelmente lembra da experiência desagradável
            de morder uma massa gelada que provocava ânsia de vômito. <strong>Essa era acabou!</strong>
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Com a tecnologia atual, o "molde" para alinhadores invisíveis é 100% digital. Nada de massa na boca,
            nada de desconforto. Em apenas 5-8 minutos, um scanner intraoral captura sua arcada dentária
            completa com precisão de 20 microns (0.02mm).
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                ❌ Molde Tradicional (Antigo)
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Massa gelada e desagradável</li>
                <li>• Risco de ânsia de vômito</li>
                <li>• Tempo: 15-20 minutos</li>
                <li>• Precisão: ±0.5mm</li>
                <li>• Distorções ao endurecer</li>
                <li>• Dificulta respiração</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                ✅ Escaneamento Digital (Moderno)
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Confortável e rápido</li>
                <li>• Sem desconforto algum</li>
                <li>• Tempo: 5-8 minutos</li>
                <li>• Precisão: ±0.02mm (25x melhor)</li>
                <li>• Perfeito digital 3D</li>
                <li>• Respiração normal</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            As 8 Etapas da Fabricação: Do Scan ao Alinhador
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Vamos destrinchar cada etapa do processo para você entender exatamente como seus alinhadores são
            criados:
          </p>

          {/* Etapa 1 */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Escaneamento Intraoral 3D</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>5-8 minutos</span>
                  <span>•</span>
                  <Camera className="w-4 h-4" />
                  <span>Scanner Medit i700</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              O ortodontista usa um scanner intraoral (parece uma "varinha mágica") que captura imagens digitais
              da sua boca. É como tirar fotos 3D dos seus dentes.
            </p>

            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Como funciona tecnicamente:</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Luz estruturada LED azul:</strong> Projeta padrões de luz nos dentes
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Câmera de alta resolução:</strong> Captura 3.000 fotos por segundo
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Software de processamento:</strong> Une as fotos criando modelo 3D com 2 milhões de pontos
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Precisão final:</strong> ±20 microns (espessura de 1/5 de um fio de cabelo)
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm italic">
              💡 <strong>Dica:</strong> O escaneamento é totalmente indolor. Você só sente a ponta do scanner
              tocando levemente seus dentes. Não há pressão, não há desconforto.
            </p>
          </div>

          {/* Etapa 2 */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Planejamento Digital com IA</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>2-3 dias</span>
                  <span>•</span>
                  <Cpu className="w-4 h-4" />
                  <span>Software 3Shape + IA Atma</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Aqui é onde a mágica acontece! O modelo 3D da sua boca é enviado para nossa equipe de planejamento
              digital, onde ortodontistas e inteligência artificial trabalham juntos.
            </p>

            <h4 className="font-bold text-gray-900 mb-3">O que acontece nesta etapa:</h4>

            <div className="space-y-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-bold text-gray-900 mb-2">A. Análise Ortodôntica Completa</h5>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Classificação do caso (simples/moderado/complexo)</li>
                  <li>• Medição de apinhamento, espaçamento, sobremordida</li>
                  <li>• Identificação de dentes problemáticos</li>
                  <li>• Avaliação de raízes e suporte ósseo</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-bold text-gray-900 mb-2">B. Criação do Plano de Tratamento</h5>
                <p className="text-gray-700 text-sm mb-2">
                  A IA analisa 50.000+ casos anteriores e sugere:
                </p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Sequência ideal de movimentos</li>
                  <li>• Quantidade de alinhadores necessários</li>
                  <li>• Tempo estimado de tratamento</li>
                  <li>• Pontos de atenção e riscos</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-bold text-gray-900 mb-2">C. Validação pelo Ortodontista</h5>
                <p className="text-gray-700 text-sm">
                  Um ortodontista revisa e ajusta o plano da IA manualmente, garantindo que cada movimento seja
                  seguro, eficaz e siga as melhores práticas da ortodontia.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-bold text-gray-900 mb-2">D. Simulação 3D (ClinCheck)</h5>
                <p className="text-gray-700 text-sm">
                  Você recebe um vídeo mostrando como seus dentes vão se mover a cada alinhador, do início ao
                  resultado final. É como ver o futuro do seu sorriso!
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm italic">
              💡 <strong>Importante:</strong> Você pode solicitar ajustes no planejamento antes de aprovar.
              Quer um sorriso mais ou menos largo? Mais ou menos alinhado? O ortodontista pode ajustar!
            </p>
          </div>

          {/* Etapa 3 */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Impressão 3D dos Modelos</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>12-18 horas</span>
                  <span>•</span>
                  <Printer className="w-4 h-4" />
                  <span>Formlabs Form 3B+</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Após aprovação do planejamento, impressoras 3D de resina dental criam modelos físicos precisos
              de cada estágio do seu tratamento.
            </p>

            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Especificações técnicas:</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Resolução de camada:</strong> 25 microns (0.025mm) - 20x melhor que impressoras comuns
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Material:</strong> Resina dental Classe I biocompatível
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Pós-processamento:</strong> Lavagem em álcool isopropílico + cura UV por 30 minutos
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Resultado:</strong> Modelos tão precisos que parecem seus dentes reais
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm">
              <strong>Curiosidade:</strong> Para um caso médio de 20 alinhadores, são impressos 20 modelos
              diferentes - um para cada estágio. Todo esse processo acontece durante a noite, enquanto você
              dorme!
            </p>
          </div>

          {/* Etapa 4 */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-yellow-200 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-yellow-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Termoformagem do PETG Alemão</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>2-3 minutos por alinhador</span>
                  <span>•</span>
                  <Zap className="w-4 h-4" />
                  <span>Erkoform 3D Motion</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Esta é a etapa onde o PETG alemão (material premium dos alinhadores) é moldado sobre os modelos
              impressos em 3D. É um processo de alta precisão que exige controle rigoroso de temperatura e
              pressão.
            </p>

            <h4 className="font-bold text-gray-900 mb-3">Passo a passo da termoformagem:</h4>

            <ol className="space-y-3 mb-4">
              <li className="flex items-start">
                <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  1
                </span>
                <span className="text-gray-700">
                  <strong>Aquecimento:</strong> Folha de PETG de 0.5mm é aquecida a exatos 140°C (±2°C)
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  2
                </span>
                <span className="text-gray-700">
                  <strong>Amolecimento:</strong> Material fica flexível mas não derrete (ponto crítico)
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  3
                </span>
                <span className="text-gray-700">
                  <strong>Aplicação de vácuo:</strong> 6 bar de pressão negativa suga o PETG sobre o modelo
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  4
                </span>
                <span className="text-gray-700">
                  <strong>Resfriamento controlado:</strong> Material solidifica em 30 segundos mantendo forma
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  5
                </span>
                <span className="text-gray-700">
                  <strong>Remoção:</strong> Alinhador bruto é retirado do modelo (ainda com excesso de material)
                </span>
              </li>
            </ol>

            <p className="text-gray-700 leading-relaxed text-sm italic">
              ⚡ <strong>Precisão crítica:</strong> Se a temperatura variar mais que 3°C, o material pode
              ficar muito duro (desconfortável) ou muito mole (ineficaz). Por isso usamos máquinas alemãs de
              precisão!
            </p>
          </div>

          {/* Etapas 5-8 resumidas */}
          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border-l-4 border-red-600 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  5
                </div>
                <h3 className="text-xl font-bold text-gray-900">Corte a Laser de Precisão</h3>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Tempo:</strong> 1-2 minutos por alinhador
              </p>
              <p className="text-gray-700 text-sm">
                Laser CO2 de alta precisão corta o excesso de material ao redor dos dentes com tolerância de
                ±0.1mm. As bordas ficam perfeitamente lisas e arredondadas, sem pontas que possam machucar a
                gengiva.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border-l-4 border-indigo-600 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  6
                </div>
                <h3 className="text-xl font-bold text-gray-900">Polimento e Acabamento</h3>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Tempo:</strong> 3-5 minutos por alinhador
              </p>
              <p className="text-gray-700 text-sm">
                Polimento químico suave + banho ultrassônico removem micro-rebarbas e deixam a superfície com
                rugosidade &lt;0.5 microns. Resultado: alinhadores lisos como vidro, confortáveis e 92%
                transparentes.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border-l-4 border-pink-600 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  7
                </div>
                <h3 className="text-xl font-bold text-gray-900">Controle de Qualidade (QC)</h3>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Tempo:</strong> 5-8 minutos por alinhador
              </p>
              <p className="text-gray-700 text-sm">
                <strong>100% dos alinhadores</strong> passam por 3 inspeções: (1) Visual com lupa 10x, (2)
                Dimensional com calibre digital ±0.01mm, (3) Teste de ajuste no modelo físico. Taxa de
                aprovação: 98.7% na primeira inspeção.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border-l-4 border-teal-600 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  8
                </div>
                <h3 className="text-xl font-bold text-gray-900">Esterilização e Entrega</h3>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Tempo:</strong> 2-3 dias (logística)
              </p>
              <p className="text-gray-700 text-sm">
                Esterilização com UV-C + ozônio em sala limpa ISO Classe 7. Embalagem selada a vácuo com QR
                code de rastreabilidade. Entrega via Correios/transportadora para seu ortodontista ou
                diretamente na sua casa (plano home).
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Linha do Tempo Completa: Do Escaneamento à Entrega
          </h2>

          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 text-white rounded-lg px-4 py-2 font-bold min-w-[100px] text-center">
                  Dia 0
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">Consulta + Escaneamento 3D</p>
                  <p className="text-gray-700 text-sm">5-8 minutos na clínica</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold min-w-[100px] text-center">
                  Dias 1-3
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">Planejamento Digital + Aprovação</p>
                  <p className="text-gray-700 text-sm">Você recebe simulação 3D para aprovar</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-green-600 text-white rounded-lg px-4 py-2 font-bold min-w-[100px] text-center">
                  Dias 4-5
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">Impressão 3D + Termoformagem</p>
                  <p className="text-gray-700 text-sm">Fabricação dos alinhadores</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-yellow-600 text-white rounded-lg px-4 py-2 font-bold min-w-[100px] text-center">
                  Dia 6
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">Corte, Polimento e Controle de Qualidade</p>
                  <p className="text-gray-700 text-sm">Acabamento e inspeção</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-red-600 text-white rounded-lg px-4 py-2 font-bold min-w-[100px] text-center">
                  Dia 7
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">Esterilização + Embalagem + Envio</p>
                  <p className="text-gray-700 text-sm">Preparação para entrega</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-teal-600 text-white rounded-lg px-4 py-2 font-bold min-w-[100px] text-center">
                  Dias 8-10
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">Entrega</p>
                  <p className="text-gray-700 text-sm">Alinhadores chegam ao ortodontista ou sua casa</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Diferenciais da Tecnologia Atma
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Precisão Máxima</h3>
              <p className="text-gray-700 text-sm">
                Escaneamento de ±0.02mm + impressão 3D de 25 microns = alinhadores que se ajustam perfeitamente
                aos seus dentes. Sem folgas, sem aperto excessivo.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🤖 IA + Ortodontista</h3>
              <p className="text-gray-700 text-sm">
                Inteligência artificial analisa 50.000+ casos, mas o ortodontista humano sempre tem a palavra
                final. O melhor dos dois mundos!
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🇩🇪 PETG Alemão Premium</h3>
              <p className="text-gray-700 text-sm">
                Material de grau médico importado, certificado ISO 13485 e CE. 40% mais resistente que PETG
                padrão, 92% de transparência.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">✅ Controle de Qualidade Total</h3>
              <p className="text-gray-700 text-sm">
                100% dos alinhadores inspecionados em 3 etapas. Taxa de defeito: &lt;1.3%. Rastreabilidade
                total do lote até o paciente.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Perguntas Frequentes Sobre o Processo
          </h2>

          <div className="space-y-4 mb-8">
            <details className="bg-white rounded-lg border-2 border-gray-200 p-5 cursor-pointer hover:border-purple-400 transition-colors">
              <summary className="font-bold text-gray-900 cursor-pointer">
                O escaneamento 3D dói ou é desconfortável?
              </summary>
              <p className="text-gray-700 text-sm mt-3">
                Não! O scanner apenas toca levemente seus dentes, como uma escova de dentes elétrica. Não há
                pressão, não há dor. Leva apenas 5-8 minutos e você pode respirar normalmente o tempo todo.
              </p>
            </details>

            <details className="bg-white rounded-lg border-2 border-gray-200 p-5 cursor-pointer hover:border-purple-400 transition-colors">
              <summary className="font-bold text-gray-900 cursor-pointer">
                Posso ver como meus dentes vão ficar antes de começar?
              </summary>
              <p className="text-gray-700 text-sm mt-3">
                Sim! Você recebe um vídeo 3D (ClinCheck) mostrando exatamente como seus dentes vão se mover a
                cada alinhador, do início ao resultado final. É como ver o futuro do seu sorriso.
              </p>
            </details>

            <details className="bg-white rounded-lg border-2 border-gray-200 p-5 cursor-pointer hover:border-purple-400 transition-colors">
              <summary className="font-bold text-gray-900 cursor-pointer">
                Quanto tempo leva para receber meus alinhadores?
              </summary>
              <p className="text-gray-700 text-sm mt-3">
                Após aprovação do planejamento: 7-10 dias corridos. Isso inclui fabricação, controle de
                qualidade e envio. Casos urgentes podem ser priorizados (consulte seu ortodontista).
              </p>
            </details>

            <details className="bg-white rounded-lg border-2 border-gray-200 p-5 cursor-pointer hover:border-purple-400 transition-colors">
              <summary className="font-bold text-gray-900 cursor-pointer">
                Os alinhadores são todos fabricados de uma vez?
              </summary>
              <p className="text-gray-700 text-sm mt-3">
                Sim! Todos os alinhadores do seu tratamento (geralmente 15-35) são fabricados no mesmo lote e
                entregues de uma vez. Isso garante uniformidade e você não precisa esperar por novas remessas.
              </p>
            </details>

            <details className="bg-white rounded-lg border-2 border-gray-200 p-5 cursor-pointer hover:border-purple-400 transition-colors">
              <summary className="font-bold text-gray-900 cursor-pointer">
                E se um alinhador quebrar ou eu perder?
              </summary>
              <p className="text-gray-700 text-sm mt-3">
                Podemos refabricar alinhadores individuais em 3-5 dias úteis. O custo varia conforme o plano
                contratado (alguns planos incluem reposições gratuitas). Guardamos seu modelo digital por 5 anos.
              </p>
            </details>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Conclusão: Tecnologia de Ponta, Processo Humanizado
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Como você viu, a fabricação de alinhadores invisíveis é um processo altamente tecnológico que
            combina escaneamento 3D, inteligência artificial, impressão 3D de precisão e materiais premium
            alemães.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Mas por trás de toda essa tecnologia, há uma equipe de ortodontistas experientes que revisa e
            aprova cada plano de tratamento, garantindo que seus dentes se movam de forma segura e eficaz.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>O resultado?</strong> Alinhadores perfeitamente ajustados, fabricados com precisão de
            ±0.2mm, que transformam seu sorriso de forma previsível e confortável. Tudo isso em 7-10 dias,
            do escaneamento à entrega.
          </p>

          <div className="bg-purple-600 text-white rounded-2xl p-8 text-center">
            <p className="text-xl font-semibold mb-2">
              Quer ver como seus dentes vão ficar?
            </p>
            <p className="opacity-90 mb-0">
              Agende uma consulta gratuita e receba sua simulação 3D personalizada!
            </p>
          </div>
        </section>

        {/* Related Articles */}
        <RelatedArticles
          articles={[
            {
              title: 'Alinhadores com Tecnologia Alemã: A Diferença na Qualidade',
              description: 'Descubra por que o PETG alemão é superior e suas certificações',
              href: '/blog/alinhadores-tecnologia-alema',
              tag: 'Tecnologia'
            },
            {
              title: 'Alinhador Invisível Funciona? Ciência e Resultados',
              description: 'Estudos científicos comprovam 96.4% de eficácia',
              href: '/blog/alinhador-invisivel-funciona',
              tag: 'Eficácia'
            },
            {
              title: 'Quanto Custa Alinhador Invisível no Brasil?',
              description: 'Preços atualizados e formas de pagamento',
              href: '/blog/quanto-custa-alinhador-invisivel',
              tag: 'Custos'
            },
            {
              title: 'Alinhadores vs Aparelho Fixo: Comparação Completa',
              description: 'Veja todas as diferenças e qual é melhor para você',
              href: '/blog/alinhadores-vs-aparelho-fixo',
              tag: 'Comparação'
            }
          ]}
        />

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto Para Começar Seu Tratamento?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Agende sua consulta gratuita e receba seu escaneamento 3D + simulação do resultado final
          </p>
          <Link
            href="/pacientes/encontre-doutor"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Package className="mr-2 h-5 w-5" />
            Agendar Consulta Gratuita
          </Link>
        </div>
      </div>

      {/* Schema.org Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Passo a Passo: Como é Feito o Molde para Alinhador Invisível',
            description: 'Do escaneamento 3D à entrega: descubra todas as etapas da fabricação de alinhadores invisíveis',
            author: {
              '@type': 'Organization',
              name: 'Atma Aligner'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Atma Aligner',
              logo: {
                '@type': 'ImageObject',
                url: 'https://atma.roilabs.com.br/logo.png'
              }
            },
            datePublished: '2025-01-20',
            dateModified: '2025-01-20'
          })
        }}
      />
    </article>
  )
}
