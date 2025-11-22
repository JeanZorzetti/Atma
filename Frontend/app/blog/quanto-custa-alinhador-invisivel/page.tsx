import type { Metadata } from 'next';
import { Calendar, Clock, Tag, TrendingUp, Calculator, CheckCircle2, AlertCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quanto Custa Alinhador Invisível em 2025? Guia Completo de Preços',
  description: 'Descubra quanto custa alinhador invisível no Brasil: de R$ 3.990 a R$ 18.000. Compare Atma, Invisalign, ClearCorrect e outras marcas. Parcelamento, planos e calculadora inclusos.',
  keywords: 'quanto custa alinhador invisível, preço alinhador dental, custo aparelho invisível, invisalign preço, alinhador transparente valor, aparelho ortodôntico preço',
  openGraph: {
    title: 'Quanto Custa Alinhador Invisível em 2025? Guia Completo de Preços',
    description: 'Compare preços de alinhadores invisíveis: Atma (R$ 3.990-8.990), Invisalign (R$ 12.000-18.000) e mais. Calculadora de parcelas inclusa.',
    type: 'article',
    publishedTime: '2025-10-20T10:00:00Z',
    authors: ['Equipe Atma Aligner'],
    tags: ['preços', 'ortodontia', 'alinhadores invisíveis', 'custo-benefício'],
  },
  alternates: {
    canonical: 'https://atma.roilabs.com.br/blog/quanto-custa-alinhador-invisivel'
  }
};

export default function QuatoCustaAlinhadorInvisivelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/blog" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Voltar para o Blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Guia de Preços
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Quanto Custa Alinhador Invisível no Brasil? Guia Completo 2025
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>20 de outubro de 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>8 min de leitura</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Atualizado mensalmente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">

        {/* Resumo Executivo */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            Resumo Rápido: Faixas de Preço 2025
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Alinhadores nacionais premium:</strong> R$ 3.990 - R$ 8.990</li>
            <li><strong>Invisalign (importado):</strong> R$ 12.000 - R$ 18.000</li>
            <li><strong>ClearCorrect:</strong> R$ 8.000 - R$ 14.000</li>
            <li><strong>Outras marcas nacionais:</strong> R$ 5.000 - R$ 10.000</li>
            <li><strong>Parcelamento:</strong> até 12x sem juros (maioria das clínicas)</li>
          </ul>
        </div>

        {/* Introdução */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            Se você está considerando iniciar um tratamento ortodôntico com <strong>alinhadores invisíveis</strong>,
            provavelmente já se perguntou: <em>"quanto custa alinhador invisível?"</em> A resposta não é simples —
            os preços variam drasticamente dependendo da marca, complexidade do caso e região do Brasil.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Neste guia completo e atualizado para 2025, você vai descobrir <strong>exatamente quanto custa cada tipo
              de alinhador invisível</strong>, o que influencia os preços, como comparar marcas e se vale a pena
            pagar mais caro. Ao final, você terá todas as informações necessárias para tomar uma decisão informada.
          </p>
        </div>

        {/* Tabela Comparativa de Preços */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Comparação de Preços: Principais Marcas no Brasil
          </h2>

          <div className="overflow-x-auto shadow-lg rounded-lg mb-6">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="px-4 py-4 text-left font-semibold">Marca</th>
                  <th className="px-4 py-4 text-left font-semibold">Preço Mínimo</th>
                  <th className="px-4 py-4 text-left font-semibold">Preço Máximo</th>
                  <th className="px-4 py-4 text-left font-semibold">Origem</th>
                  <th className="px-4 py-4 text-left font-semibold">Custo-Benefício</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-blue-600">Atma Aligner</td>
                  <td className="px-4 py-4">R$ 3.990</td>
                  <td className="px-4 py-4">R$ 8.990</td>
                  <td className="px-4 py-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Brasil + Alemanha
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-green-600 font-semibold">★★★★★ Excelente</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-semibold">Invisalign</td>
                  <td className="px-4 py-4">R$ 12.000</td>
                  <td className="px-4 py-4">R$ 18.000</td>
                  <td className="px-4 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      EUA (importado)
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-yellow-600 font-semibold">★★★☆☆ Regular</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-semibold">ClearCorrect</td>
                  <td className="px-4 py-4">R$ 8.000</td>
                  <td className="px-4 py-4">R$ 14.000</td>
                  <td className="px-4 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      EUA (importado)
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-yellow-600 font-semibold">★★★☆☆ Regular</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-semibold">Sorriden</td>
                  <td className="px-4 py-4">R$ 5.500</td>
                  <td className="px-4 py-4">R$ 9.500</td>
                  <td className="px-4 py-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Brasil
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-green-600 font-semibold">★★★★☆ Bom</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-semibold">Clini Aligner</td>
                  <td className="px-4 py-4">R$ 6.000</td>
                  <td className="px-4 py-4">R$ 11.000</td>
                  <td className="px-4 py-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Brasil
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-green-600 font-semibold">★★★★☆ Bom</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r">
            <p className="text-sm text-gray-700">
              <AlertCircle className="w-4 h-4 inline mr-2 text-yellow-600" />
              <strong>Importante:</strong> Preços podem variar conforme região, ortodontista e complexidade do caso.
              Valores atualizados em janeiro de 2025.
            </p>
          </div>
        </section>

        {/* Fatores que Influenciam o Preço */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            O Que Determina o Preço do Alinhador Invisível?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                1. Complexidade do Caso
              </h3>
              <p className="text-gray-700 mb-3">
                Casos mais complexos exigem mais alinhadores e planejamento avançado:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Simples:</strong> R$ 3.990-5.500 (6-12 meses)</li>
                <li>• <strong>Moderado:</strong> R$ 5.500-8.000 (12-18 meses)</li>
                <li>• <strong>Complexo:</strong> R$ 8.000-18.000 (18-24 meses)</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                2. Marca e Tecnologia
              </h3>
              <p className="text-gray-700 mb-3">
                Tecnologia de ponta custa mais, mas nem sempre significa melhor resultado:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Importadas:</strong> +50-80% mais caras (impostos + logística)</li>
                <li>• <strong>Nacionais premium:</strong> tecnologia alemã/brasileira, preço justo</li>
                <li>• <strong>Genéricas:</strong> mais baratas, mas qualidade duvidosa</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                3. Região e Ortodontista
              </h3>
              <p className="text-gray-700 mb-3">
                Localização geográfica e experiência do profissional impactam o preço:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Capitais/Zona Sul:</strong> 20-40% mais caro</li>
                <li>• <strong>Interior:</strong> preços mais acessíveis</li>
                <li>• <strong>Ortodontista experiente:</strong> +10-30% no valor</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                4. Itens Inclusos
              </h3>
              <p className="text-gray-700 mb-3">
                Verifique o que está incluído no preço total:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Scanner 3D:</strong> R$ 300-800 (às vezes cobrado à parte)</li>
                <li>• <strong>Consultas de acompanhamento:</strong> verificar se estão inclusas</li>
                <li>• <strong>Contenção final:</strong> R$ 500-1.200 (nem sempre inclusa)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detalhamento Atma */}
        <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Preços Atma Aligner: Transparência Total
          </h2>

          <p className="text-gray-700 mb-6 leading-relaxed">
            A <strong>Atma Aligner</strong> trabalha com preços fixos e transparentes, sem surpresas.
            Veja exatamente quanto você vai pagar de acordo com a complexidade do seu caso:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-green-200">
              <div className="text-center mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  CASOS SIMPLES
                </span>
              </div>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-gray-900">R$ 3.990</div>
                <div className="text-sm text-gray-500 mt-1">ou 12x de R$ 332,50</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Apinhamento leve</li>
                <li>✓ Pequenos espaços</li>
                <li>✓ 6-12 meses de tratamento</li>
                <li>✓ 10-20 alinhadores</li>
                <li>✓ Scanner 3D incluso</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-blue-400">
              <div className="text-center mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  CASOS MODERADOS
                </span>
              </div>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-gray-900">R$ 5.990</div>
                <div className="text-sm text-gray-500 mt-1">ou 12x de R$ 499,17</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Apinhamento moderado</li>
                <li>✓ Correção de mordida</li>
                <li>✓ 12-18 meses de tratamento</li>
                <li>✓ 20-30 alinhadores</li>
                <li>✓ Scanner 3D + contenção</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-purple-400">
              <div className="text-center mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  CASOS COMPLEXOS
                </span>
              </div>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-gray-900">R$ 8.990</div>
                <div className="text-sm text-gray-500 mt-1">ou 12x de R$ 749,17</div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Apinhamento severo</li>
                <li>✓ Correções complexas</li>
                <li>✓ 18-24 meses de tratamento</li>
                <li>✓ 30-40+ alinhadores</li>
                <li>✓ Tudo incluso + garantia</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold mb-3 text-gray-900">O Que Está Incluso nos Preços Atma?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Scanner 3D intraoral (sem necessidade de moldes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Planejamento digital 3D completo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Todos os alinhadores necessários (set completo)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Consultas de acompanhamento a cada 6 semanas</span>
                </li>
              </ul>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Refinamentos inclusos (se necessário)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Contenção final (upper + lower)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>App de acompanhamento gratuito</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Garantia de satisfação</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Invisalign vs Atma */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Vale a Pena Pagar Mais Caro pelo Invisalign?
          </h2>

          <p className="text-gray-700 mb-6 leading-relaxed">
            O <strong>Invisalign</strong> é a marca mais conhecida no mercado mundial, mas isso não significa
            que seja sempre a melhor escolha para todos os pacientes brasileiros. Veja uma comparação honesta:
          </p>

          <div className="overflow-x-auto shadow-lg rounded-lg mb-6">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Critério</th>
                  <th className="px-4 py-3 text-center font-semibold text-blue-600">Atma Aligner</th>
                  <th className="px-4 py-3 text-center font-semibold text-purple-600">Invisalign</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Preço Médio</td>
                  <td className="px-4 py-3 text-center text-green-600 font-bold">R$ 3.990-8.990</td>
                  <td className="px-4 py-3 text-center text-red-600 font-bold">R$ 12.000-18.000</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Material</td>
                  <td className="px-4 py-3 text-center">PETG alemão premium</td>
                  <td className="px-4 py-3 text-center">SmartTrack® (EUA)</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Produção</td>
                  <td className="px-4 py-3 text-center text-green-600">Brasil (7-10 dias)</td>
                  <td className="px-4 py-3 text-center text-yellow-600">México/EUA (20-30 dias)</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Tecnologia de Escaneamento</td>
                  <td className="px-4 py-3 text-center">Scanner 3D de última geração</td>
                  <td className="px-4 py-3 text-center">iTero Scanner</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Software de Planejamento</td>
                  <td className="px-4 py-3 text-center">Software proprietário 3D</td>
                  <td className="px-4 py-3 text-center">ClinCheck®</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Refinamentos</td>
                  <td className="px-4 py-3 text-center text-green-600">Inclusos no preço</td>
                  <td className="px-4 py-3 text-center text-yellow-600">Pode ter custo adicional</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Suporte Local</td>
                  <td className="px-4 py-3 text-center text-green-600">Equipe brasileira 24/7</td>
                  <td className="px-4 py-3 text-center text-yellow-600">Suporte internacional</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Resultado Final</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">Equivalente</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">Equivalente</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Veredicto:</h3>
            <p className="text-gray-700">
              Para <strong>95% dos casos</strong>, alinhadores nacionais premium como Atma oferecem
              <strong> resultados idênticos ao Invisalign</strong> por 50-60% do preço. A diferença está
              mais no marketing e reconhecimento de marca do que na eficácia clínica real.
            </p>
          </div>
        </section>

        {/* Formas de Pagamento */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            Opções de Pagamento e Parcelamento
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Parcelamento Padrão (Sem Juros)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between items-center pb-2 border-b">
                  <span>À vista (5% desconto):</span>
                  <strong className="text-green-600">R$ 3.790</strong>
                </li>
                <li className="flex justify-between items-center pb-2 border-b">
                  <span>3x sem juros:</span>
                  <strong>R$ 1.330/mês</strong>
                </li>
                <li className="flex justify-between items-center pb-2 border-b">
                  <span>6x sem juros:</span>
                  <strong>R$ 665/mês</strong>
                </li>
                <li className="flex justify-between items-center pb-2 border-b">
                  <span>12x sem juros:</span>
                  <strong className="text-blue-600">R$ 332,50/mês</strong>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                *Exemplo para caso simples (R$ 3.990). Aceita cartão de crédito, PIX e boleto.
              </p>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4 text-purple-600">Opções Especiais de Financiamento</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Crédito dental:</strong> parcelamento em até 24x (consultar taxas)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Convênio odontológico:</strong> algumas operadoras cobrem 30-50%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Planos corporativos:</strong> empresas parceiras têm 10-15% desconto</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Indicação:</strong> R$ 200 de desconto para você e para quem indicou</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-900">Calculadora Rápida de Parcelas</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Caso Simples (R$ 3.990)</div>
                <div className="text-2xl font-bold text-blue-600">12x R$ 332,50</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Caso Moderado (R$ 5.990)</div>
                <div className="text-2xl font-bold text-blue-600">12x R$ 499,17</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Caso Complexo (R$ 8.990)</div>
                <div className="text-2xl font-bold text-blue-600">12x R$ 749,17</div>
              </div>
            </div>
          </div>
        </section>

        {/* Custos Ocultos */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Cuidado com Custos Ocultos!
          </h2>

          <p className="text-gray-700 mb-6 leading-relaxed">
            Nem sempre o preço inicial é o preço final. Algumas clínicas e marcas cobram valores adicionais
            que podem aumentar significativamente o custo total do tratamento. Fique atento:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-bold mb-3 text-red-700">❌ O Que Pode Ser Cobrado Separadamente:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Scanner 3D: <strong>R$ 300-800</strong></li>
                <li>• Consultas de acompanhamento: <strong>R$ 150-300 cada</strong></li>
                <li>• Refinamentos (ajustes): <strong>R$ 800-2.000</strong></li>
                <li>• Contenção final: <strong>R$ 500-1.200</strong></li>
                <li>• Documentação ortodôntica: <strong>R$ 200-500</strong></li>
                <li>• Attachments (bráquetes de resina): <strong>R$ 50-100 cada</strong></li>
              </ul>
              <p className="mt-4 font-semibold text-red-700">
                Total potencial de custos ocultos: <span className="text-xl">R$ 2.000-5.000+</span>
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-bold mb-3 text-green-700">✅ O Que DEVE Estar Incluído (Atma):</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Scanner 3D: <strong className="text-green-600">Incluso</strong></li>
                <li>• Todas as consultas: <strong className="text-green-600">Incluídas</strong></li>
                <li>• Refinamentos necessários: <strong className="text-green-600">Inclusos</strong></li>
                <li>• Contenção final: <strong className="text-green-600">Inclusa</strong></li>
                <li>• Documentação completa: <strong className="text-green-600">Inclusa</strong></li>
                <li>• Attachments ilimitados: <strong className="text-green-600">Inclusos</strong></li>
              </ul>
              <p className="mt-4 font-semibold text-green-700">
                Valor final = valor inicial. <span className="text-xl">Sem surpresas!</span>
              </p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r">
            <p className="text-gray-700">
              <AlertCircle className="w-5 h-5 inline mr-2 text-yellow-600" />
              <strong>Dica importante:</strong> Antes de fechar qualquer orçamento, peça uma lista detalhada
              de TUDO que está e que NÃO está incluído no preço. Peça por escrito e compare com outras clínicas.
            </p>
          </div>
        </section>

        {/* FAQ Schema */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Perguntas Frequentes sobre Preços de Alinhadores
          </h2>

          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900 flex justify-between items-center">
                Quanto custa o alinhador invisível mais barato no Brasil?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <p>
                  O <strong>alinhador invisível mais barato</strong> no Brasil custa entre <strong>R$ 2.500-3.500</strong>,
                  mas geralmente são de marcas menos conhecidas e podem não oferecer a mesma qualidade ou suporte.
                </p>
                <p className="mt-2">
                  O <strong>melhor custo-benefício</strong> fica na faixa de <strong>R$ 3.990-5.990</strong>
                  (marcas nacionais premium como Atma), que oferecem qualidade alemã com preço justo e suporte completo.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900 flex justify-between items-center">
                Por que o Invisalign é tão caro?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <p>
                  O Invisalign é caro por várias razões:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Importação:</strong> produzido no exterior (México/EUA), com impostos e logística caros</li>
                  <li><strong>Marketing massivo:</strong> investem milhões em publicidade mundial</li>
                  <li><strong>Marca consolidada:</strong> foi pioneira, então cobra premium pela reputação</li>
                  <li><strong>Rede exclusiva:</strong> ortodontistas pagam certificação cara para usar</li>
                </ul>
                <p className="mt-3">
                  <strong>Importante:</strong> preço alto ≠ resultado melhor. Estudos mostram eficácia similar
                  entre Invisalign e marcas nacionais premium para 95% dos casos.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900 flex justify-between items-center">
                Posso parcelar o tratamento em quantas vezes?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <p>
                  A maioria das clínicas oferece:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>12x sem juros</strong> no cartão de crédito (opção mais comum)</li>
                  <li><strong>Até 24x</strong> com financeiras especializadas (geralmente com juros de 1,5-3% ao mês)</li>
                  <li><strong>Entrada + parcelas:</strong> ex: 30% entrada + 10x do restante</li>
                  <li><strong>Convênios odontológicos:</strong> podem cobrir 30-50% do valor</li>
                </ul>
                <p className="mt-3">
                  <strong>Dica:</strong> se possível, opte pelo parcelamento sem juros mesmo que em menos vezes.
                  Juros compostos de 2-3% ao mês aumentam significativamente o custo total.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900 flex justify-between items-center">
                Convênio odontológico cobre alinhador invisível?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Depende do plano.</strong> A cobertura varia muito:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li><strong>Planos básicos:</strong> geralmente NÃO cobrem ortodontia estética</li>
                  <li><strong>Planos premium:</strong> podem cobrir 30-50% do tratamento ortodôntico</li>
                  <li><strong>Reembolso:</strong> alguns planos reembolsam até R$ 2.000-5.000 do valor gasto</li>
                  <li><strong>Carência:</strong> planos costumam ter 12-24 meses de carência para ortodontia</li>
                </ul>
                <p className="mt-3">
                  <strong>Recomendação:</strong> ligue para sua operadora e pergunte especificamente sobre cobertura
                  de "alinhadores ortodônticos" ou "ortodontia estética". Peça por escrito quais os limites de cobertura.
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900 flex justify-between items-center">
                Qual a diferença de preço entre alinhador e aparelho fixo?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <p className="font-semibold mb-2">Comparação de custos médios no Brasil:</p>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center pb-2 border-b">
                    <span>Aparelho fixo metálico:</span>
                    <strong>R$ 1.500-4.000</strong>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b">
                    <span>Aparelho fixo estético (porcelana):</span>
                    <strong>R$ 3.000-6.000</strong>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b">
                    <span>Aparelho autoligado:</span>
                    <strong>R$ 4.000-8.000</strong>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b">
                    <span>Alinhador invisível (nacional):</span>
                    <strong className="text-blue-600">R$ 3.990-8.990</strong>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Alinhador invisível (Invisalign):</span>
                    <strong>R$ 12.000-18.000</strong>
                  </li>
                </ul>
                <p className="mt-3 bg-blue-50 p-3 rounded">
                  <strong>Conclusão:</strong> Alinhadores nacionais premium custam similar a aparelhos estéticos/autoligados,
                  mas com muito mais conforto e estética. <Link href="/blog/alinhadores-vs-aparelho-fixo" className="text-blue-600 hover:underline">
                    Veja comparação completa →
                  </Link>
                </p>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900 flex justify-between items-center">
                O preço varia muito entre estados/cidades?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Sim, a variação regional é significativa:</strong>
                </p>
                <ul className="space-y-2 mt-3">
                  <li><strong>São Paulo/Rio de Janeiro (Zona Sul):</strong> 30-40% mais caro que a média nacional</li>
                  <li><strong>Capitais (média geral):</strong> preços 20-30% acima do interior</li>
                  <li><strong>Interior e Sul:</strong> preços 15-25% abaixo das capitais</li>
                  <li><strong>Norte/Nordeste:</strong> menor disponibilidade, preços variáveis</li>
                </ul>
                <p className="mt-3">
                  <strong>Exemplo prático:</strong>
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Atma (caso simples) em SP capital: R$ 4.500-5.000</li>
                  <li>Atma (caso simples) no interior RS: R$ 3.990-4.200</li>
                  <li>Diferença: ~R$ 500-800 (10-15%)</li>
                </ul>
              </div>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group">
              <summary className="font-semibold text-lg cursor-pointer text-gray-900 flex justify-between items-center">
                Vale a pena viajar para fazer mais barato em outra cidade?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Geralmente não vale a pena</strong> pelos seguintes motivos:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li><strong>Consultas de acompanhamento:</strong> são necessárias a cada 6-8 semanas (10-15 consultas no total)</li>
                  <li><strong>Custos de viagem:</strong> transporte + hospedagem podem anular a economia</li>
                  <li><strong>Urgências:</strong> problemas com alinhadores exigem atendimento presencial rápido</li>
                  <li><strong>Relacionamento:</strong> acompanhamento próximo com ortodontista é essencial para sucesso</li>
                </ul>
                <p className="mt-3 bg-green-50 p-3 rounded">
                  <strong>Alternativa melhor:</strong> busque marcas com preços uniformes nacionalmente (como Atma)
                  e faça o tratamento perto de casa. Conforto &gt; economia pequena.
                </p>
              </div>
            </details>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto Para Começar Seu Tratamento?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Agende uma consulta gratuita e descubra quanto vai custar seu caso específico
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pacientes"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl inline-block"
            >
              Agendar Consulta Grátis
            </Link>
            <Link
              href="/pacientes/precos"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-block"
            >
              Ver Tabela de Preços Completa
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-100">
            ✓ Sem compromisso &nbsp;•&nbsp; ✓ Avaliação gratuita &nbsp;•&nbsp; ✓ Orçamento transparente
          </p>
        </section>

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Quanto custa o alinhador invisível mais barato no Brasil?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O alinhador invisível mais barato no Brasil custa entre R$ 2.500-3.500, mas geralmente são de marcas menos conhecidas. O melhor custo-benefício fica na faixa de R$ 3.990-5.990 (marcas nacionais premium como Atma), que oferecem qualidade alemã com preço justo e suporte completo."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Por que o Invisalign é tão caro?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "O Invisalign é caro devido à importação (produzido no exterior com impostos altos), marketing massivo mundial, posicionamento de marca premium consolidada, e rede exclusiva de ortodontistas certificados. Importante: preço alto não significa necessariamente resultado melhor."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Posso parcelar o tratamento em quantas vezes?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A maioria das clínicas oferece parcelamento em até 12x sem juros no cartão de crédito. Também é possível parcelar em até 24x com financeiras especializadas (geralmente com juros de 1,5-3% ao mês). Convênios odontológicos podem cobrir 30-50% do valor."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Convênio odontológico cobre alinhador invisível?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Depende do plano. Planos básicos geralmente não cobrem ortodontia estética. Planos premium podem cobrir 30-50% do tratamento ou oferecer reembolso de R$ 2.000-5.000. Planos costumam ter carência de 12-24 meses para ortodontia."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Qual a diferença de preço entre alinhador e aparelho fixo?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Aparelho fixo metálico: R$ 1.500-4.000. Aparelho estético: R$ 3.000-6.000. Alinhador invisível nacional: R$ 3.990-8.990. Invisalign: R$ 12.000-18.000. Alinhadores nacionais premium custam similar a aparelhos estéticos/autoligados, mas com muito mais conforto."
                  }
                },
                {
                  "@type": "Question",
                  "name": "O preço varia muito entre estados e cidades?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sim. São Paulo/Rio (Zona Sul) são 30-40% mais caros que a média. Capitais são 20-30% acima do interior. Sul tem preços 15-25% abaixo das capitais. A diferença pode chegar a R$ 500-1.000 para o mesmo tratamento."
                  }
                }
              ]
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Quanto Custa Alinhador Invisível em 2025? Guia Completo de Preços",
              "description": "Guia completo sobre preços de alinhadores invisíveis no Brasil: compare Atma, Invisalign, ClearCorrect e outras marcas. Inclui calculadora de parcelas e dicas para economizar.",
              "image": "https://atma.roilabs.com.br/og-image-precos.jpg",
              "author": {
                "@type": "Organization",
                "name": "Atma Aligner"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Atma Aligner",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://atma.roilabs.com.br/logo.png"
                }
              },
              "datePublished": "2025-10-20T10:00:00Z",
              "dateModified": "2025-10-20T10:00:00Z"
            })
          }}
        />

      </article>
    </div>
  );
}
