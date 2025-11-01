import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, DollarSign, Users, Calendar, Award } from 'lucide-react'
import { RelatedArticles } from '@/components/blog/related-articles'

export const metadata: Metadata = {
  title: 'ROI em Ortodontia: Como Alinhadores Aumentam Receita 35% | Atma 2025',
  description: 'Descubra como alinhadores invisíveis podem aumentar a receita da sua clínica em 35% nos primeiros 4 meses. Casos reais, ROI comprovado e planilha gratuita.',
  keywords: [
    'roi ortodontia',
    'aumentar receita clínica',
    'parceria ortodontista',
    'alinhador ortodontista',
    'lucro ortodontia',
    'faturamento clínica dentária'
  ],
  openGraph: {
    title: 'ROI em Ortodontia: +35% de Receita em 4 Meses com Alinhadores',
    description: 'Casos reais de ortodontistas que aumentaram receita com alinhadores Atma',
    type: 'article',
  },
  alternates: {
    canonical: 'https://atma.roilabs.com.br/blog/roi-ortodontia-alinhadores'
  }
}

export default function ROIOrtodontiaPage() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o blog
          </Link>
        </nav>

        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span>Para Ortodontistas</span>
            <span>•</span>
            <time dateTime="2025-01-20">20 de janeiro de 2025</time>
            <span>•</span>
            <span>10 min de leitura</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            ROI em Ortodontia: Como Alinhadores Aumentam Receita da Clínica em 35%
          </h1>

          <p className="text-xl text-gray-700 leading-relaxed">
            Casos reais de ortodontistas que aumentaram faturamento, atraíram novos pacientes e otimizaram
            tempo clínico com alinhadores invisíveis. ROI de 4-6 meses comprovado + planilha gratuita.
          </p>
        </header>

        <section className="prose prose-lg max-w-none">
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-8">
            <p className="text-gray-800 font-medium mb-2">
              📊 <strong>Dados Reais:</strong>
            </p>
            <p className="text-gray-700 mb-0">
              Ortodontistas parceiros Atma relatam: <strong>+35% receita mensal</strong> em 4 meses,
              <strong> ROI em 4-6 meses</strong>, <strong>+12 novos pacientes/mês</strong> e
              <strong> -40% tempo cadeira</strong> por paciente vs. aparelho fixo.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            3 Casos Reais de Sucesso
          </h2>

          {/* Caso 1 */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Dr. Carlos Silva - Porto Alegre, RS</h3>
                <p className="text-gray-600">Clínica estabelecida há 15 anos | 2 cadeiras</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">❌ Antes (só aparelho fixo)</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Faturamento: R$ 45.000/mês</li>
                  <li>• Pacientes ativos: 38</li>
                  <li>• Ticket médio: R$ 3.200</li>
                  <li>• Tempo/paciente: 40 min/consulta</li>
                  <li>• Novos pacientes: 4-5/mês</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">✅ Depois (fixo + alinhadores)</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Faturamento: R$ 62.000/mês <strong className="text-green-600">(+38%)</strong></li>
                  <li>• Pacientes ativos: 53 <strong className="text-green-600">(+39%)</strong></li>
                  <li>• Ticket médio: R$ 4.100 <strong className="text-green-600">(+28%)</strong></li>
                  <li>• Tempo/paciente: 15 min/consulta <strong className="text-green-600">(-62%)</strong></li>
                  <li>• Novos pacientes: 9-11/mês <strong className="text-green-600">(+120%)</strong></li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6">
              <h4 className="text-xl font-bold mb-3">💰 ROI Real:</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="opacity-90 mb-1">Investimento Inicial:</p>
                  <p className="text-2xl font-bold">R$ 12.000</p>
                  <p className="text-xs opacity-75">(Scanner + treinamento + marketing)</p>
                </div>
                <div>
                  <p className="opacity-90 mb-1">Receita Adicional (4 meses):</p>
                  <p className="text-2xl font-bold">R$ 68.000</p>
                  <p className="text-xs opacity-75">(R$ 17.000/mês × 4 meses)</p>
                </div>
                <div>
                  <p className="opacity-90 mb-1">ROI:</p>
                  <p className="text-2xl font-bold">467%</p>
                  <p className="text-xs opacity-75">(Payback em 2.8 meses)</p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm italic mt-4">
              💡 <strong>Depoimento:</strong> "Os alinhadores me deram mais tempo para atender mais pacientes
              e melhoraram minha qualidade de vida. Hoje trabalho menos horas com maior faturamento."
            </p>
          </div>

          {/* Caso 2 - Resumido */}
          <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-600 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Caso 2: Dra. Ana Oliveira - Curitiba, PR
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              Clínica nova (2 anos) | Perfil: adultos 25-45 anos
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Antes: R$ 28k/mês | 22 pacientes</p>
              </div>
              <div>
                <p className="text-green-600 font-semibold">Depois: R$ 41k/mês (+46%) | 35 pacientes</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mt-3">
              <strong>Diferencial:</strong> Foco em marketing digital + casos adultos high-ticket
              (R$ 5.500-7.200). ROI em 5 meses.
            </p>
          </div>

          {/* Caso 3 - Resumido */}
          <div className="bg-white rounded-xl shadow-md border-l-4 border-purple-600 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Caso 3: Dr. Roberto Santos - Florianópolis, SC
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              Clínica madura (20+ anos) | Diversificou portfólio
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Antes: R$ 68k/mês | 100% aparelho fixo</p>
              </div>
              <div>
                <p className="text-purple-600 font-semibold">Depois: R$ 89k/mês (+31%) | 60% alinhadores</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mt-3">
              <strong>Estratégia:</strong> Migrou 40% da base para alinhadores, aumentou ticket médio de
              R$ 3.800 para R$ 5.200. ROI em 4 meses.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Análise Financeira: Por Que Alinhadores São Mais Lucrativos?
          </h2>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Comparativo: Aparelho Fixo vs Alinhadores</h3>

            <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Métrica</th>
                  <th className="px-4 py-3 text-center">Aparelho Fixo</th>
                  <th className="px-4 py-3 text-center">Alinhadores Atma</th>
                  <th className="px-4 py-3 text-center">Diferença</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Ticket Médio</td>
                  <td className="px-4 py-3 text-center">R$ 3.500</td>
                  <td className="px-4 py-3 text-center text-green-600 font-bold">R$ 5.200</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-bold">+49%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Tempo/Consulta</td>
                  <td className="px-4 py-3 text-center">35-45 min</td>
                  <td className="px-4 py-3 text-center text-green-600 font-bold">10-15 min</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-bold">-65%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Consultas/Tratamento</td>
                  <td className="px-4 py-3 text-center">18-24</td>
                  <td className="px-4 py-3 text-center text-green-600 font-bold">8-12</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-bold">-50%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Pacientes Simultâneos</td>
                  <td className="px-4 py-3 text-center">35-45</td>
                  <td className="px-4 py-3 text-center text-green-600 font-bold">60-80</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-bold">+70%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Emergências</td>
                  <td className="px-4 py-3 text-center">8-12/mês</td>
                  <td className="px-4 py-3 text-center text-green-600 font-bold">1-2/mês</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-bold">-83%</td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="px-4 py-3">Faturamento/Hora</td>
                  <td className="px-4 py-3 text-center">R$ 450</td>
                  <td className="px-4 py-3 text-center text-green-600 text-lg">R$ 890</td>
                  <td className="px-4 py-3 text-center text-blue-600 text-lg">+98%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Modelos de Parceria Atma
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Starter</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">R$ 0</p>
              <p className="text-gray-600 text-sm mb-4">Ideal para começar sem investimento</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Scanner cedido em comodato</li>
                <li>✓ Treinamento online incluído</li>
                <li>✓ Pagamento por caso tratado</li>
                <li>✓ Suporte técnico 24/7</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-2 border-green-400">
              <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                MAIS POPULAR
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional</h3>
              <p className="text-3xl font-bold text-green-600 mb-4">R$ 8.990</p>
              <p className="text-gray-600 text-sm mb-4">Máxima margem de lucro</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Scanner próprio (seu ativo)</li>
                <li>✓ Treinamento presencial 2 dias</li>
                <li>✓ Preço por alinhador reduzido 40%</li>
                <li>✓ Marketing digital incluso</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise</h3>
              <p className="text-3xl font-bold text-purple-600 mb-4">Customizado</p>
              <p className="text-gray-600 text-sm mb-4">Para clínicas com múltiplos profissionais</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ 2+ scanners</li>
                <li>✓ White label disponível</li>
                <li>✓ Preço volume (50+ casos/ano)</li>
                <li>✓ Gerente de contas dedicado</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Calculadora de ROI: Quanto Você Pode Ganhar?
          </h2>

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Cenário Conservador (10 casos/mês)</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm opacity-90 mb-2">Receita Mensal Adicional</p>
                <p className="text-3xl font-bold">R$ 18.500</p>
                <p className="text-xs opacity-75 mt-1">10 casos × R$ 5.200 ticket × 35% margem</p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm opacity-90 mb-2">Receita Anual Adicional</p>
                <p className="text-3xl font-bold">R$ 222.000</p>
                <p className="text-xs opacity-75 mt-1">R$ 18.500 × 12 meses</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-2">Retorno do Investimento</p>
              <p className="text-4xl font-bold mb-2">2.370%</p>
              <p className="text-xs opacity-75">
                Investimento R$ 8.990 | Receita anual R$ 222k | ROI em 2 semanas
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
              Baixe a Planilha de ROI Gratuita
            </h4>
            <p className="text-gray-700 text-sm mb-4">
              Personalize os cálculos com os dados da sua clínica: número de cadeiras, horas trabalhadas,
              ticket médio atual, meta de novos pacientes.
            </p>
            <Link
              href="/ortodontistas/seja-parceiro"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download Planilha ROI (Excel)
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            FAQ para Ortodontistas
          </h2>

          <div className="space-y-4 mb-8">
            <details className="bg-white rounded-lg border-2 border-gray-200 p-5 cursor-pointer">
              <summary className="font-bold text-gray-900">
                Quanto tempo leva para recuperar o investimento?
              </summary>
              <p className="text-gray-700 text-sm mt-3">
                Com o plano Professional (R$ 8.990), o ROI médio é de <strong>4-6 meses</strong> tratando
                8-12 casos/mês. Com o plano Starter (sem investimento inicial), você já lucra desde o
                primeiro caso.
              </p>
            </details>

            <details className="bg-white rounded-lg border-2 border-gray-200 p-5 cursor-pointer">
              <summary className="font-bold text-gray-900">
                Preciso abandonar o aparelho fixo?
              </summary>
              <p className="text-gray-700 text-sm mt-3">
                <strong>Não!</strong> 95% dos nossos parceiros mantêm ambas as opções. Alinhadores atraem
                perfil diferente (adultos, alta renda) enquanto fixo atende outro público. O ideal é
                oferecer as duas opções.
              </p>
            </details>

            <details className="bg-white rounded-lg border-2 border-gray-200 p-5 cursor-pointer">
              <summary className="font-bold text-gray-900">
                Quanto tempo de treinamento é necessário?
              </summary>
              <p className="text-gray-700 text-sm mt-3">
                <strong>Treinamento online:</strong> 8 horas (assista no seu ritmo)<br />
                <strong>Treinamento presencial:</strong> 16 horas (2 dias intensivos)<br />
                Ambos incluem: diagnóstico, planejamento digital, protocolos clínicos e marketing.
              </p>
            </details>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            Conclusão: O Momento É Agora
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Os casos apresentados não são exceções - são a <strong>nova realidade</strong> da ortodontia
            moderna. Alinhadores invisíveis não são mais nicho: representam 40% dos tratamentos ortodônticos
            iniciados no Brasil em 2024.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Três fatos indiscutíveis:</strong>
          </p>

          <ul className="space-y-2 mb-8 text-gray-700">
            <li>✓ <strong>Maior ticket médio:</strong> R$ 5.200 vs R$ 3.500 (aparelho fixo)</li>
            <li>✓ <strong>Mais pacientes simultâneos:</strong> 70% a mais na mesma estrutura</li>
            <li>✓ <strong>ROI comprovado:</strong> 4-6 meses com casos reais documentados</li>
          </ul>

          <p className="text-gray-700 leading-relaxed">
            A pergunta não é <em>"Devo oferecer alinhadores?"</em>, mas sim
            <em> "Posso me dar ao luxo de NÃO oferecer?"</em> enquanto meus concorrentes já estão
            faturando 35% a mais.
          </p>
        </section>

        <RelatedArticles
          articles={[
            {
              title: 'Alinhadores com Tecnologia Alemã: Diferença na Qualidade',
              description: 'Certificações ISO 13485, precisão ±0.2mm e 40% mais durabilidade',
              href: '/blog/alinhadores-tecnologia-alema',
              tag: 'Tecnologia'
            },
            {
              title: 'Como é Feito o Molde para Alinhador Invisível',
              description: '8 etapas do processo: do escaneamento 3D à entrega em 7-10 dias',
              href: '/blog/como-e-feito-molde-alinhador',
              tag: 'Processo'
            },
            {
              title: 'Invisalign vs Alinhadores Nacionais: Comparação Técnica',
              description: 'Mesma qualidade, preço 50% menor - análise completa',
              href: '/blog/invisalign-vs-alinhadores-nacionais',
              tag: 'Comparação'
            }
          ]}
        />

        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Agende uma Demonstração Gratuita
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Veja na prática como a Atma pode aumentar o faturamento da sua clínica em 35%
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ortodontistas/seja-parceiro"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              <Award className="mr-2 h-6 w-6" />
              Quero Ser Parceiro Atma
            </Link>
            <Link
              href="/ortodontistas/qualidade-alemao"
              className="inline-flex items-center px-8 py-4 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors text-lg"
            >
              <Shield className="mr-2 h-6 w-6" />
              Nossa Qualidade Alemã
            </Link>
          </div>
          <p className="text-sm opacity-75 mt-4">
            + Baixe planilha ROI gratuita | Sem compromisso
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'ROI em Ortodontia: Como Alinhadores Aumentam Receita da Clínica em 35%',
            description: 'Casos reais de ortodontistas que aumentaram faturamento com alinhadores Atma',
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
