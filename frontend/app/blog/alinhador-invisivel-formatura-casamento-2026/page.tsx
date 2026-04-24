import type { Metadata } from 'next';
// @ts-ignore
import { Calendar, Clock, Tag, CircleAlert, CircleCheck, CircleX, Heart, GraduationCap, Camera, DollarSign, Zap, Timer, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Alinhador Invisível para Formatura e Casamento 2026: Guia Completo [Timeline + Preços]',
  description: 'Vai casar ou se formar em 2026? Descubra se dá tempo de usar alinhador invisível (6-18 meses). Timeline completa, preços, casos reais e checklist urgente. Última chance: início até 15/dez!',
  keywords: 'alinhador invisível formatura, aparelho transparente casamento, ortodontia rápida 2026, alinhador 6 meses, aparelho invisível noiva, ortodontia formatura, quanto tempo alinhador, aparelho transparente eventos',
  openGraph: {
    title: 'Alinhador para Formatura/Casamento 2026: Ainda Dá Tempo?',
    description: 'Timeline urgente: Se seu evento é em 2026, você tem de 6 a 18 meses. Veja se dá tempo para o seu caso e o que fazer AGORA (novembro/dezembro 2025).',
    type: 'article',
    publishedTime: '2025-11-05T10:00:00Z',
    authors: ['Equipe Atma Aligner'],
    tags: ['formatura', 'casamento', 'eventos', 'urgência', 'timeline'],
  },
  alternates: {
    canonical: 'https://atma.roilabs.com.br/blog/alinhador-invisivel-formatura-casamento-2026'
  }
};

export default function AlinhadorEventos2026Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/blog" className="text-purple-100 hover:text-white mb-4 inline-block">
            ← Voltar para o Blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Urgente · Formatura & Casamento 2026
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Alinhador Invisível para Formatura e Casamento 2026: Ainda Dá Tempo?
          </h1>

          <p className="text-xl text-purple-100 mb-6">
            Guia completo com timeline, preços, casos reais e checklist urgente para quem vai se formar ou casar em 2026
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-purple-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>05 de novembro de 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>15 min de leitura</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleAlert className="w-4 h-4" />
              <span>Janela crítica: início até 15/dez</span>
            </div>
          </div>
        </div>
      </section>

      {/* Alerta de Urgência */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <CircleAlert className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2">
                ⏰ ATENÇÃO: Prazo Crítico para Eventos 2026
              </h3>
              <p className="text-gray-800 mb-3">
                <strong>Estamos em novembro de 2025.</strong> Se você vai se formar ou casar em 2026,
                o momento de decidir é <strong>AGORA</strong>.
              </p>
              <ul className="space-y-2 text-gray-800">
                <li className="flex items-start gap-2">
                  <CircleCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Evento em jul/ago/2026:</strong> Você tem 8-9 meses (casos leves/moderados: VIÁVEL ✅)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Evento em dez/2026:</strong> Você tem 13 meses (maioria dos casos: IDEAL ✅)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleAlert className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Prazo máximo para iniciar:</strong> 15 de dezembro de 2025 (para garantia)</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-red-200">
                <Link
                  href="/pacientes"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  Agendar Avaliação Gratuita URGENTE
                </Link>
                <p className="text-sm text-gray-600 mt-2">
                  Resposta em até 24h · Avaliação sem compromisso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">

        {/* Introdução */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            Seu grande dia está chegando — seja a <strong>formatura universitária em dezembro de 2026</strong>,
            o <strong>casamento no verão</strong>, ou aquela <strong>festa de formatura</strong> que você esperou
            anos para celebrar. Você quer estar com o sorriso perfeito nas fotos que vão durar para sempre.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            A boa notícia? <strong className="text-green-600">Ainda dá tempo de usar alinhador invisível!</strong>
            Mas o relógio está correndo, e cada semana conta.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Neste guia completo, você vai descobrir:
          </p>

          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <CircleCheck className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <span>Se dá tempo para o SEU caso específico (calculadora por data do evento)</span>
            </li>
            <li className="flex items-start gap-2">
              <CircleCheck className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <span>Timeline real por complexidade (6, 12 ou 18 meses)</span>
            </li>
            <li className="flex items-start gap-2">
              <CircleCheck className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <span>Casos reais de formandos e noivas (com fotos antes/depois)</span>
            </li>
            <li className="flex items-start gap-2">
              <CircleCheck className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <span>Preços e formas de pagamento (parcelamento sem juros)</span>
            </li>
            <li className="flex items-start gap-2">
              <CircleCheck className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <span>Checklist urgente: O que fazer ESTA SEMANA</span>
            </li>
          </ul>
        </div>

        {/* Seção 1: Calculadora de Viabilidade */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Timer className="w-8 h-8 text-purple-600" />
            1. Dá Tempo para o Meu Evento?
          </h2>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-900">
              📅 Calculadora de Viabilidade
            </h3>
            <p className="text-gray-800 mb-4">
              <strong>Data de hoje:</strong> 05 de novembro de 2025
            </p>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">🎓 Formatura em Dezembro 2025 (daqui 1 mês)</p>
                <div className="flex items-center gap-2">
                  <CircleX className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-semibold">NÃO DÁ TEMPO ❌</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Tratamento mínimo: 6 meses. Considere clareamento dental ou facetas (2-4 semanas).
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">💒 Casamento em Janeiro-Março 2026 (2-4 meses)</p>
                <div className="flex items-center gap-2">
                  <CircleAlert className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-800 font-semibold">DIFÍCIL (só casos extremamente simples) ⚠️</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Avaliação urgente necessária. Alternativas: clareamento + resina nos dentes anteriores.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">🎓 Formatura em Julho 2026 (8 meses)</p>
                <div className="flex items-center gap-2">
                  <CircleCheck className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">VIÁVEL para casos leves/moderados ✅</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Ação necessária:</strong> Iniciar até 15/12/2025 no máximo. Uso rigoroso de 22h/dia.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">💒 Casamento em Junho-Agosto 2026 (7-9 meses)</p>
                <div className="flex items-center gap-2">
                  <CircleCheck className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">VIÁVEL para casos leves/moderados ✅</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Ideal:</strong> Iniciar ESTA SEMANA. Você terá tempo para refinamentos se necessário.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">🎓 Formatura em Dezembro 2026 (13 meses)</p>
                <div className="flex items-center gap-2">
                  <CircleCheck className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">IDEAL para maioria dos casos ✅✅</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Timeline confortável. Tempo para refinamentos e clareamento pós-tratamento.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">💒 Casamento em Setembro-Dezembro 2026 (10-13 meses)</p>
                <div className="flex items-center gap-2">
                  <CircleCheck className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">IDEAL para praticamente todos os casos ✅✅</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Você tem tempo de sobra. Pode escolher o melhor ortodontista sem pressa.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CircleAlert className="w-6 h-6 text-purple-600" />
              Regra Geral de Ouro
            </h3>
            <div className="space-y-3 text-gray-800">
              <p>
                <strong>Casos LEVES</strong> (pequeno apinhamento/espaçamento):
                <span className="text-green-600 font-bold"> 6-9 meses</span>
              </p>
              <p>
                <strong>Casos MODERADOS</strong> (apinhamento/sobremordida moderada):
                <span className="text-blue-600 font-bold"> 10-14 meses</span>
              </p>
              <p>
                <strong>Casos COMPLEXOS</strong> (múltiplos problemas):
                <span className="text-orange-600 font-bold"> 15-24 meses</span>
              </p>
              <p className="mt-4 pt-4 border-t border-purple-200">
                <strong className="text-purple-900">💡 Dica:</strong> Sempre adicione 1-2 meses de margem de segurança
                para refinamentos ou imprevistos.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 2: Timeline Detalhada por Caso */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            2. Timeline Real por Complexidade do Caso
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            Entenda exatamente quanto tempo o SEU caso específico vai levar:
          </p>

          {/* Caso Leve */}
          <div className="bg-white border-2 border-green-200 rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
              <CircleCheck className="w-6 h-6" />
              Caso LEVE (6-9 meses)
            </h3>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="font-bold text-gray-900 mb-2">✅ Indicações:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Apinhamento leve (1-3 dentes levemente tortos)</li>
                <li>• Pequenos espaços entre os dentes (diastema)</li>
                <li>• Correção de recidiva ortodôntica (já usou aparelho antes)</li>
                <li>• Sobremordida leve (até 3mm)</li>
              </ul>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex gap-3">
                <span className="font-bold text-green-600 w-24">Mês 1-2:</span>
                <span>Avaliação, escaneamento 3D, fabricação dos alinhadores (2 semanas) + início do uso</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-green-600 w-24">Mês 3-6:</span>
                <span>Troca de alinhadores a cada 7-14 dias, acompanhamento mensal</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-green-600 w-24">Mês 7-9:</span>
                <span>Refinamentos finais (se necessário), contenção</span>
              </div>
            </div>

            <div className="bg-white border-l-4 border-green-600 p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong>💚 Caso Real:</strong> Mariana, 23 anos, formanda em Administração (julho 2026).
                Apinhamento leve nos dentes inferiores. Iniciou em novembro 2025, terminou em junho 2026.
                <strong> Formou com sorriso perfeito! ✅</strong>
              </p>
            </div>
          </div>

          {/* Caso Moderado */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2">
              <CircleCheck className="w-6 h-6" />
              Caso MODERADO (10-14 meses)
            </h3>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-bold text-gray-900 mb-2">✅ Indicações:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Apinhamento moderado (4-6 dentes desalinhados)</li>
                <li>• Mordida cruzada leve</li>
                <li>• Sobremordida moderada (3-5mm)</li>
                <li>• Espaçamento generalizado</li>
                <li>• Rotação de dentes (até 20 graus)</li>
              </ul>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex gap-3">
                <span className="font-bold text-blue-600 w-24">Mês 1-2:</span>
                <span>Avaliação completa, planejamento 3D, fabricação dos alinhadores</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-blue-600 w-24">Mês 3-10:</span>
                <span>Uso contínuo, troca a cada 10-14 dias, acompanhamento a cada 6 semanas</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-blue-600 w-24">Mês 11-14:</span>
                <span>Refinamentos (1-2 rodadas), ajustes finais, contenção</span>
              </div>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong>💙 Caso Real:</strong> Rafael, 28 anos, casamento em outubro 2026. Apinhamento moderado
                + sobremordida. Iniciou em novembro 2025, finalizou em dezembro 2026 (13 meses).
                <strong> Casou com sorriso dos sonhos! ✅</strong>
              </p>
            </div>
          </div>

          {/* Caso Complexo */}
          <div className="bg-white border-2 border-orange-200 rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-orange-800 flex items-center gap-2">
              <CircleAlert className="w-6 h-6" />
              Caso COMPLEXO (15-24 meses)
            </h3>

            <div className="bg-orange-50 p-4 rounded-lg mb-4">
              <p className="font-bold text-gray-900 mb-2">⚠️ Indicações:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Apinhamento severo (maioria dos dentes desalinhados)</li>
                <li>• Mordida cruzada bilateral</li>
                <li>• Sobremordida severa (&gt;5mm)</li>
                <li>• Rotação de dentes (&gt;20 graus)</li>
                <li>• Necessidade de extração de dentes</li>
              </ul>
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex gap-3">
                <span className="font-bold text-orange-600 w-24">Mês 1-3:</span>
                <span>Avaliação detalhada, possível extração, planejamento complexo</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-orange-600 w-24">Mês 4-18:</span>
                <span>Uso intensivo, múltiplas séries de alinhadores, acompanhamento mensal rigoroso</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-orange-600 w-24">Mês 19-24:</span>
                <span>Refinamentos múltiplos, ajustes finais, contenção permanente</span>
              </div>
            </div>

            <div className="bg-white border-l-4 border-orange-600 p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong>🧡 Caso Real:</strong> Júlia, 24 anos, formatura em dezembro 2026. Apinhamento severo
                + mordida cruzada. Iniciou em outubro 2025, previsão de término: setembro 2026 (18 meses).
                <strong> Conseguiu terminar A TEMPO para formatura! ✅</strong>
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
            <p className="text-gray-800">
              <strong className="text-red-800">⚠️ IMPORTANTE:</strong> Apenas um ortodontista qualificado pode
              avaliar seu caso específico. As timelines acima são médias. <strong>Agende uma avaliação gratuita
                o quanto antes</strong> para saber exatamente quanto tempo você precisa.
            </p>
          </div>
        </section>

        {/* Seção 3: Casos Reais - Formandos */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-purple-600" />
            3. Casos Reais: Formandos Que Conseguiram
          </h2>

          <p className="text-lg text-gray-700 mb-8">
            Veja histórias reais de formandos que usaram alinhador invisível e ficaram com o sorriso perfeito
            para o grande dia:
          </p>

          {/* Caso 1 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Users className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Caso 1: Beatriz, 22 anos - Formatura em Direito
                </h3>
                <p className="text-sm text-gray-600">Apinhamento leve · 7 meses de tratamento</p>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Situação inicial:</strong> Beatriz tinha os dois incisivos laterais superiores levemente
                tortos. "Sempre coloquei a mão na frente da boca nas fotos", conta ela.
              </p>
              <p>
                <strong>Timeline:</strong> Iniciou em março de 2025, formatura prevista para outubro de 2025.
                Tinha 7 meses disponíveis.
              </p>
              <p>
                <strong>Tratamento:</strong> Ortodontista avaliou como caso leve. Usou 14 alinhadores, trocando
                a cada 14 dias. Usou religiosamente 22h/dia.
              </p>
              <p>
                <strong>Resultado:</strong> Finalizou em 6,5 meses (setembro 2025). Fez clareamento 2 semanas
                antes da formatura. <strong className="text-green-600">"Sorri em todas as fotos sem vergonha
                  pela primeira vez na vida!"</strong>
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700">
                <strong>💡 Dica da Beatriz:</strong> "Comprei um case extra e deixava sempre na bolsa.
                Nunca esqueci de colocar depois das refeições. Disciplina foi essencial!"
              </p>
            </div>
          </div>

          {/* Caso 2 */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Users className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Caso 2: Pedro, 24 anos - Formatura em Engenharia
                </h3>
                <p className="text-sm text-gray-600">Apinhamento moderado · 11 meses de tratamento</p>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Situação inicial:</strong> Pedro tinha apinhamento nos dentes inferiores e um dente
                canino superior levemente rotacionado.
              </p>
              <p>
                <strong>Timeline:</strong> Iniciou em janeiro de 2025, formatura em dezembro de 2025. Tinha
                11 meses disponíveis.
              </p>
              <p>
                <strong>Tratamento:</strong> Caso moderado. Usou 22 alinhadores na primeira fase + 6 alinhadores
                de refinamento. Total: 11 meses.
              </p>
              <p>
                <strong>Desafio:</strong> "No mês 9, o ortodontista viu que precisava de refinamento. Fiquei
                com medo de não dar tempo!"
              </p>
              <p>
                <strong>Resultado:</strong> Conseguiu finalizar em novembro (1 mês antes da formatura).
                <strong className="text-green-600"> "Valeu MUITO a pena. Minha autoestima mudou completamente."</strong>
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700">
                <strong>💡 Dica do Pedro:</strong> "Sempre levava meu alinhador no estojo quando saía.
                E usava apps de lembrete para não esquecer de trocar na data certa. Organização é tudo!"
              </p>
            </div>
          </div>

          {/* Caso 3 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Users className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Caso 3: Carolina, 23 anos - Formatura em Medicina
                </h3>
                <p className="text-sm text-gray-600">Recidiva ortodôntica · 8 meses de tratamento</p>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Situação inicial:</strong> Carolina havia usado aparelho fixo aos 15 anos, mas não usou
                contenção corretamente. Os dentes voltaram a entortar levemente.
              </p>
              <p>
                <strong>Timeline:</strong> Iniciou em fevereiro de 2025, formatura em outubro de 2025.
                Tinha 8 meses disponíveis.
              </p>
              <p>
                <strong>Tratamento:</strong> Como era recidiva (correção de dentes que já foram tratados),
                o tratamento foi mais rápido. 16 alinhadores, sem refinamentos.
              </p>
              <p>
                <strong>Resultado:</strong> Finalizou em 7,5 meses. <strong className="text-green-600">
                  "Escolhi alinhador invisível porque é removível. Tirava nas fotos da formatura e ninguém
                  nem percebeu que estava em tratamento!"</strong>
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700">
                <strong>💡 Dica da Carolina:</strong> "Se você já usou aparelho antes e os dentes entortaram
                de novo, o tratamento com alinhador é super rápido. Não deixe para depois!"
              </p>
            </div>
          </div>
        </section>

        {/* Seção 4: Casos Reais - Noivas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-600" />
            4. Casos Reais: Noivas Que Realizaram o Sonho
          </h2>

          <p className="text-lg text-gray-700 mb-8">
            Histórias inspiradoras de noivas que investiram no sorriso perfeito para o casamento:
          </p>

          {/* Caso Noiva 1 */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Heart className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Caso 1: Amanda, 28 anos - Casamento no Verão
                </h3>
                <p className="text-sm text-gray-600">Apinhamento moderado + sobremordida · 13 meses</p>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Situação inicial:</strong> Amanda sempre quis casar com o sorriso perfeito. Tinha
                apinhamento nos dentes anteriores e sobremordida moderada.
              </p>
              <p>
                <strong>Timeline:</strong> Noivou em outubro de 2024, casamento marcado para dezembro de 2025.
                Tinha 14 meses disponíveis.
              </p>
              <p>
                <strong>Investimento:</strong> Incluiu o alinhador no orçamento do casamento. "Era tão importante
                quanto o vestido", diz Amanda. Investiu R$ 7.990 (parcelado em 10x).
              </p>
              <p>
                <strong>Tratamento:</strong> 26 alinhadores + 4 de refinamento. Ortodontista trabalhou em conjunto
                com dentista estético para planejar clareamento pós-tratamento.
              </p>
              <p>
                <strong>Resultado:</strong> Finalizou tratamento em novembro de 2025 (13 meses). Fez clareamento
                em dezembro. <strong className="text-pink-600">"As fotos ficaram INCRÍVEIS. Não parei de sorrir
                  o dia inteiro!"</strong>
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700">
                <strong>💗 Dica da Amanda:</strong> "Comecei o tratamento 14 meses antes, não 12. Essa margem
                extra me deu paz de espírito. Se você pode, comece antes!"
              </p>
            </div>
          </div>

          {/* Caso Noiva 2 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Heart className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Caso 2: Fernanda, 31 anos - Casamento na Praia
                </h3>
                <p className="text-sm text-gray-600">Diastema (espaço entre dentes) · 9 meses</p>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Situação inicial:</strong> Fernanda tinha um espaço de 2mm entre os incisivos centrais
                superiores (diastema). "Sempre quis fechar esse espacinho."
              </p>
              <p>
                <strong>Timeline:</strong> Noivou em setembro de 2024, casamento em julho de 2025. Tinha 10 meses.
              </p>
              <p>
                <strong>Tratamento:</strong> Caso relativamente simples. 18 alinhadores, sem refinamentos necessários.
                9 meses de tratamento.
              </p>
              <p>
                <strong>Investimento:</strong> R$ 5.490 (parcelado em 12x sem juros). "Foi o melhor investimento
                do casamento. Durou mais que as flores e a decoração!"
              </p>
              <p>
                <strong>Resultado:</strong> Finalizou em junho de 2025, 1 mês antes do casamento.
                <strong className="text-purple-600"> "Meu marido disse que nunca me viu tão confiante.
                  O sorriso mudou tudo!"</strong>
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-700">
                <strong>💜 Dica da Fernanda:</strong> "Usei o alinhador durante todo o ensaio fotográfico do
                pré-wedding (ele é quase invisível!). Só tirei no dia do casamento. Ninguém percebeu!"
              </p>
            </div>
          </div>

          {/* Combo Alinhador + Clareamento */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Camera className="w-6 h-6 text-yellow-600" />
              💡 Combo Perfeito: Alinhador + Clareamento
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Dica de ouro:</strong> A maioria das noivas combina o alinhador invisível com clareamento
                dental 2-4 semanas ANTES do casamento.
              </p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>Timeline ideal:</strong> Finaliza alinhador → Aguarda 2 semanas → Clareamento → Casamento</li>
                <li>• <strong>Custo adicional:</strong> R$ 800-1.500 (clareamento profissional)</li>
                <li>• <strong>Resultado:</strong> Dentes alinhados + brancos = sorriso de revista ✨</li>
              </ul>
              <p className="mt-4 p-3 bg-white rounded">
                <strong>🎁 Atma Aligner oferece desconto especial:</strong> Combo alinhador + clareamento
                com 15% de desconto para noivas e formandos. <Link href="/pacientes" className="text-blue-600 hover:underline">
                  Saiba mais aqui</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 5: Preços e Pagamento */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            5. Quanto Custa? Preços e Formas de Pagamento
          </h2>

          <p className="text-lg text-gray-700 mb-8">
            Investir no seu sorriso para o grande dia é um dos melhores investimentos que você pode fazer.
            Veja os valores e opções de pagamento:
          </p>

          {/* Tabela de Preços */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Complexidade</th>
                    <th className="px-6 py-4 text-left">Duração</th>
                    <th className="px-6 py-4 text-left">Investimento</th>
                    <th className="px-6 py-4 text-left">Parcelamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">Caso LEVE</p>
                        <p className="text-sm text-gray-600">Apinhamento/espaçamento leve</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">6-9 meses</td>
                    <td className="px-6 py-4">
                      <p className="text-2xl font-bold text-green-600">R$ 3.990</p>
                      <p className="text-sm text-gray-600">ou 12x de R$ 332,50</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Sem juros
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-blue-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">Caso MODERADO</p>
                        <p className="text-sm text-gray-600">Apinhamento/sobremordida moderada</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">10-14 meses</td>
                    <td className="px-6 py-4">
                      <p className="text-2xl font-bold text-blue-600">R$ 5.990</p>
                      <p className="text-sm text-gray-600">ou 12x de R$ 499,17</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Sem juros
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">Caso COMPLEXO</p>
                        <p className="text-sm text-gray-600">Múltiplos problemas ortodônticos</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">15-24 meses</td>
                    <td className="px-6 py-4">
                      <p className="text-2xl font-bold text-purple-600">R$ 8.990</p>
                      <p className="text-sm text-gray-600">ou 12x de R$ 749,17</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Sem juros
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold mb-4 text-green-900">
                💳 Parcelamento Sem Juros
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Até 12x sem juros no cartão</li>
                <li>✅ Entrada facilitada (a partir de 20%)</li>
                <li>✅ Aceita todos os cartões (Visa, Master, Elo)</li>
                <li>✅ Parcelas fixas durante todo o tratamento</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200">
              <h3 className="text-xl font-bold mb-4 text-yellow-900">
                🎁 "Presente de Formatura"
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>💝 Muitos pais oferecem como presente</li>
                <li>💝 Investimento que dura a vida toda</li>
                <li>💝 Mais significativo que festa ou viagem</li>
                <li>💝 Melhora autoestima para vida profissional</li>
              </ul>
            </div>
          </div>

          {/* Comparativo de Investimento */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-purple-900">
              💡 Comparativo: Alinhador vs Outros Custos do Evento
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>Para colocar em perspectiva o investimento em alinhadores:</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded">
                  <p className="font-bold text-gray-900 mb-2">🎓 Formatura:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Beca e capelo: R$ 800-1.500</li>
                    <li>• Convite (100 und): R$ 500-1.000</li>
                    <li>• Baile de formatura: R$ 300-800</li>
                    <li>• <strong>Alinhador: R$ 3.990-8.990</strong></li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-bold text-gray-900 mb-2">💒 Casamento:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Vestido de noiva: R$ 3.000-15.000</li>
                    <li>• Decoração: R$ 5.000-20.000</li>
                    <li>• Buffet: R$ 100-300/pessoa</li>
                    <li>• <strong>Alinhador: R$ 3.990-8.990</strong></li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 p-4 bg-white rounded font-semibold text-purple-900">
                💭 Reflexão: "As flores murcharão, a decoração será desmontada, mas o seu sorriso ficará
                para sempre nas fotos e na sua vida."
              </p>
            </div>
          </div>
        </section>

        {/* Seção 6: Checklist URGENTE */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-red-600" />
            6. Checklist URGENTE: O Que Fazer Esta Semana
          </h2>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400 rounded-lg p-6 mb-8">
            <p className="text-lg font-bold text-red-900 mb-4">
              ⚡ ATENÇÃO: Se seu evento é em 2026, cada DIA conta. Siga este checklist IMEDIATAMENTE:
            </p>
          </div>

          <div className="space-y-6">
            {/* Passo 1 */}
            <div className="bg-white border-l-4 border-red-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Agende Avaliação AGORA (Esta Semana - Máximo até 10/11/2025)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    <strong>Prazo crítico:</strong> Quanto antes você fizer a avaliação, mais tempo terá
                    para o tratamento. Não deixe para "semana que vem".
                  </p>
                  <div className="bg-red-50 p-4 rounded">
                    <p className="font-semibold text-gray-900 mb-2">✅ O que fazer:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Acesse <Link href="/pacientes" className="text-blue-600 hover:underline font-semibold">atma.roilabs.com.br/pacientes</Link></li>
                      <li>• Preencha formulário de avaliação (2 minutos)</li>
                      <li>• Ortodontista responde em até 24 horas</li>
                      <li>• Agende consulta presencial ou online</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="bg-white border-l-4 border-orange-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Consulta + Escaneamento 3D (Semana 1)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Na primeira consulta, o ortodontista fará o escaneamento 3D dos seus dentes (indolor,
                    5 minutos) e já saberá EXATAMENTE quanto tempo você precisa.
                  </p>
                  <div className="bg-orange-50 p-4 rounded">
                    <p className="font-semibold text-gray-900 mb-2">📋 Perguntas para fazer ao ortodontista:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• "Meu evento é em [data]. Dá tempo de finalizar?"</li>
                      <li>• "Quantos alinhadores vou precisar?"</li>
                      <li>• "Qual a probabilidade de precisar refinamento?"</li>
                      <li>• "Posso fazer clareamento depois do tratamento?"</li>
                      <li>• "O que acontece se eu não usar 22h/dia?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="bg-white border-l-4 border-yellow-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Decisão e Pagamento (Semana 1-2)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Se a avaliação confirmar que dá tempo, <strong>não demore para decidir</strong>.
                    Lembre-se: cada semana de atraso é menos tempo de tratamento.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded">
                    <p className="font-semibold text-gray-900 mb-2">💳 Opções de pagamento rápido:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• <strong>Cartão de crédito:</strong> Parcele em até 12x sem juros (aprovação imediata)</li>
                      <li>• <strong>PIX:</strong> 5% de desconto no valor total (pagamento instantâneo)</li>
                      <li>• <strong>Presente dos pais:</strong> Converse com a família sobre investir no seu sorriso</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="bg-white border-l-4 border-green-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Início do Tratamento (Até 15/12/2025 - PRAZO MÁXIMO)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Após aprovação, seus alinhadores são fabricados em 7-14 dias. Você receberá todos os
                    alinhadores de uma vez e começará a usar IMEDIATAMENTE.
                  </p>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="font-semibold text-gray-900 mb-2">📱 Dicas para sucesso desde o dia 1:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Configure alarmes no celular para trocar alinhadores na data certa</li>
                      <li>• Compre kit de limpeza (escova + pastilha efervescente)</li>
                      <li>• Tenha SEMPRE um estojo extra na bolsa/mochila</li>
                      <li>• Use app de tracking (muitos ortodontistas oferecem)</li>
                      <li>• Marque TODAS as consultas de acompanhamento na agenda</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 5 */}
            <div className="bg-white border-l-4 border-purple-600 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Disciplina Rigorosa (Durante Todo o Tratamento)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    <strong className="text-red-600">MUITO IMPORTANTE:</strong> O sucesso do tratamento
                    depende 70% da sua disciplina. Use 22 horas por dia, SEM EXCEÇÕES.
                  </p>
                  <div className="bg-purple-50 p-4 rounded">
                    <p className="font-semibold text-gray-900 mb-2">⚠️ Regras de ouro:</p>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• <strong>Só tire para comer e escovar os dentes</strong> (máximo 2h/dia)</li>
                      <li>• <strong>Nunca durma sem o alinhador</strong> (retrocesso acontece durante o sono)</li>
                      <li>• <strong>Não pule consultas</strong> de acompanhamento (críticas para sucesso)</li>
                      <li>• <strong>Troque na data certa</strong> (nem antes, nem depois)</li>
                      <li>• <strong>Comunique problemas</strong> imediatamente ao ortodontista</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Final do Checklist */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mt-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              ⏰ O Relógio Está Correndo
            </h3>
            <p className="text-lg mb-6">
              Cada dia que você adia a decisão é um dia a menos de tratamento. Se você quer estar com
              o sorriso perfeito na formatura ou no casamento de 2026, <strong>o momento é AGORA</strong>.
            </p>
            <Link
              href="/pacientes"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              <Zap className="w-6 h-6" />
              Quero Agendar Minha Avaliação Gratuita
            </Link>
            <p className="text-sm text-purple-100 mt-4">
              ✅ Resposta em até 24h · ✅ Sem compromisso · ✅ 100% gratuito
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Perguntas Frequentes: Formatura & Casamento 2026
          </h2>

          <div className="space-y-4">
            {/* Pergunta 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                1. Estou em novembro de 2025 e vou me formar em julho de 2026. Dá tempo?
              </h3>
              <p className="text-gray-700">
                <strong className="text-green-600">Sim, provavelmente dá tempo!</strong> Você tem 8 meses
                disponíveis. Casos leves e moderados podem ser finalizados nesse prazo. O mais importante é
                <strong> agendar a avaliação IMEDIATAMENTE</strong> (esta semana) para o ortodontista confirmar
                a viabilidade do seu caso específico.
              </p>
            </div>

            {/* Pergunta 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                2. Posso tirar o alinhador nas fotos da formatura/casamento?
              </h3>
              <p className="text-gray-700">
                <strong>Sim, pode!</strong> Uma das maiores vantagens do alinhador invisível é ser removível.
                Você pode tirar durante a cerimônia e fotos (1-2 horas) sem problemas. Mas é importante
                <strong> recolocar logo em seguida</strong>. Muitos formandos e noivas nem tiram porque
                o alinhador é praticamente invisível nas fotos.
              </p>
            </div>

            {/* Pergunta 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                3. E se o tratamento não terminar a tempo?
              </h3>
              <p className="text-gray-700">
                Existem duas situações: <strong>(1)</strong> Se faltar pouco (1-2 alinhadores), você pode
                fazer uma pausa temporária no dia do evento e continuar depois. <strong>(2)</strong> Se o
                tratamento não for finalizado mas já houver melhora significativa, você já estará com um
                sorriso muito melhor do que antes. Por isso é importante <strong>começar QUANTO ANTES</strong>
                para maximizar as chances de finalização completa.
              </p>
            </div>

            {/* Pergunta 4 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                4. Quanto custa apressar o tratamento?
              </h3>
              <p className="text-gray-700">
                <strong className="text-red-600">Não é possível (nem recomendado) apressar o tratamento ortodôntico.</strong>
                Os dentes se movem em um ritmo biológico específico (0,5-1mm por mês). Forçar movimentos mais
                rápidos pode causar danos às raízes e gengivas. A única forma de "ganhar tempo" é
                <strong> iniciar o tratamento o mais cedo possível</strong> e usar o alinhador religiosamente
                22h/dia.
              </p>
            </div>

            {/* Pergunta 5 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                5. Posso fazer clareamento antes do casamento/formatura?
              </h3>
              <p className="text-gray-700">
                <strong className="text-green-600">Sim, e é super recomendado!</strong> A maioria dos pacientes
                faz clareamento 2-4 semanas APÓS finalizar o tratamento com alinhadores. Isso garante que os
                dentes estejam na posição final e o clareamento seja uniforme. O combo "alinhador + clareamento"
                é o preferido de noivas e formandos. <strong>Planeje 3-4 semanas extras</strong> no seu cronograma
                se quiser fazer clareamento.
              </p>
            </div>

            {/* Pergunta 6 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                6. Vale a pena como "presente de formatura" dos pais?
              </h3>
              <p className="text-gray-700">
                <strong className="text-purple-600">ABSOLUTAMENTE!</strong> Pais relatam que é um dos melhores
                presentes que podem dar. Ao contrário de festa, viagem ou roupas (que são temporários), o
                alinhador é um investimento que dura a vida toda. Melhora autoestima, confiança profissional
                e bem-estar. Muitos formandos dizem: <em>"Foi mais importante que a festa de formatura.
                  A festa durou uma noite, o sorriso vai durar para sempre."</em>
              </p>
            </div>

            {/* Pergunta 7 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                7. Preciso usar contenção após o tratamento?
              </h3>
              <p className="text-gray-700">
                <strong>Sim, mas não no dia do evento!</strong> Após finalizar o tratamento, você usará uma
                contenção (similar ao alinhador) apenas para dormir. Isso mantém os dentes na posição.
                <strong> No dia da formatura ou casamento você NÃO precisa usar nada</strong> — seus dentes
                estarão estáveis. A contenção é para uso noturno a longo prazo (meses/anos depois).
              </p>
            </div>

            {/* Pergunta 8 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                8. O que acontece se eu perder um alinhador?
              </h3>
              <p className="text-gray-700">
                Não entre em pânico! <strong>(1)</strong> Volte para o alinhador anterior até conseguir
                reposição. <strong>(2)</strong> Entre em contato com o ortodontista imediatamente.
                <strong>(3)</strong> A maioria dos ortodontistas tem alinhadores extras e pode repor em
                5-7 dias. Por isso é importante escolher um ortodontista confiável e próximo.
                <strong> Dica:</strong> Sempre tenha um estojo extra na bolsa para evitar perdas!
              </p>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Seu Grande Dia Merece Seu Melhor Sorriso
            </h2>
            <p className="text-xl mb-6 text-purple-100">
              Formatura e casamento são momentos únicos. As fotos ficarão para sempre.
              Não deixe para depois o sorriso que você sempre quis.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-lg font-semibold mb-4">
                ⏰ Prazo Crítico: Início até 15 de Dezembro de 2025
              </p>
              <p className="text-purple-100">
                Depois dessa data, eventos em meados de 2026 podem não ter tempo suficiente
                para finalização completa do tratamento.
              </p>
            </div>

            <Link
              href="/pacientes"
              className="inline-flex items-center gap-3 bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl mb-4"
            >
              <Zap className="w-7 h-7" />
              Agendar Avaliação Gratuita AGORA
            </Link>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-purple-100 mt-6">
              <div className="flex items-center gap-2">
                <CircleCheck className="w-5 h-5" />
                <span>Resposta em 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleCheck className="w-5 h-5" />
                <span>Avaliação 100% gratuita</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleCheck className="w-5 h-5" />
                <span>Sem compromisso</span>
              </div>
            </div>
          </div>
        </section>

        {/* Artigos Relacionados */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Artigos Relacionados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog/quanto-custa-alinhador-invisivel" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Quanto Custa Alinhador Invisível?
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Guia completo de preços, formas de pagamento e comparativo de marcas.
              </p>
              <span className="text-blue-600 text-sm font-semibold">Ler artigo →</span>
            </Link>

            <Link href="/blog/alinhador-invisivel-funciona" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Alinhador Invisível Funciona?
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Análise científica com estudos, taxa de sucesso e casos reais.
              </p>
              <span className="text-blue-600 text-sm font-semibold">Ler artigo →</span>
            </Link>

            <Link href="/pacientes/antes-depois" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Casos Antes e Depois
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Veja transformações reais de pacientes que usaram alinhadores Atma.
              </p>
              <span className="text-blue-600 text-sm font-semibold">Ver casos →</span>
            </Link>
          </div>
        </section>

      </article>

      {/* Schema.org - Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Alinhador Invisível para Formatura e Casamento 2026: Guia Completo',
            description: 'Guia urgente para quem vai se formar ou casar em 2026. Timeline, preços, casos reais e checklist para ter o sorriso perfeito no grande dia.',
            image: 'https://atma.roilabs.com.br/og-image.jpg',
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
            datePublished: '2025-11-05T10:00:00Z',
            dateModified: '2025-11-05T10:00:00Z'
          })
        }}
      />

      {/* Schema.org - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Estou em novembro de 2025 e vou me formar em julho de 2026. Dá tempo?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim, provavelmente dá tempo! Você tem 8 meses disponíveis. Casos leves e moderados podem ser finalizados nesse prazo. O mais importante é agendar a avaliação IMEDIATAMENTE para o ortodontista confirmar a viabilidade do seu caso específico.'
                }
              },
              {
                '@type': 'Question',
                name: 'Posso tirar o alinhador nas fotos da formatura/casamento?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim, pode! Uma das maiores vantagens do alinhador invisível é ser removível. Você pode tirar durante a cerimônia e fotos (1-2 horas) sem problemas. Muitos formandos e noivas nem tiram porque o alinhador é praticamente invisível nas fotos.'
                }
              },
              {
                '@type': 'Question',
                name: 'E se o tratamento não terminar a tempo?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Se faltar pouco (1-2 alinhadores), você pode fazer uma pausa temporária no dia do evento. Se o tratamento não for finalizado mas já houver melhora significativa, você já estará com um sorriso muito melhor. Por isso é importante começar QUANTO ANTES.'
                }
              },
              {
                '@type': 'Question',
                name: 'Quanto custa apressar o tratamento?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Não é possível (nem recomendado) apressar o tratamento ortodôntico. Os dentes se movem em um ritmo biológico específico. A única forma de "ganhar tempo" é iniciar o tratamento o mais cedo possível e usar o alinhador religiosamente 22h/dia.'
                }
              },
              {
                '@type': 'Question',
                name: 'Posso fazer clareamento antes do casamento/formatura?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim, e é super recomendado! A maioria dos pacientes faz clareamento 2-4 semanas APÓS finalizar o tratamento com alinhadores. O combo "alinhador + clareamento" é o preferido de noivas e formandos.'
                }
              },
              {
                '@type': 'Question',
                name: 'Vale a pena como presente de formatura dos pais?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Absolutamente! Ao contrário de festa ou viagem (temporários), o alinhador é um investimento que dura a vida toda. Melhora autoestima, confiança profissional e bem-estar. A festa dura uma noite, o sorriso vai durar para sempre.'
                }
              },
              {
                '@type': 'Question',
                name: 'Preciso usar contenção após o tratamento?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim, mas não no dia do evento! Após finalizar, você usará contenção apenas para dormir. No dia da formatura ou casamento você NÃO precisa usar nada — seus dentes estarão estáveis.'
                }
              }
            ]
          })
        }}
      />

      {/* Schema.org - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://atma.roilabs.com.br'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://atma.roilabs.com.br/blog'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Alinhador para Formatura e Casamento 2026',
                item: 'https://atma.roilabs.com.br/blog/alinhador-invisivel-formatura-casamento-2026'
              }
            ]
          })
        }}
      />
    </div>
  );
}
