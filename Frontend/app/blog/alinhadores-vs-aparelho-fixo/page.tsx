import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Metadata } from "next"
import { Calendar, Users, CheckCircle, XCircle, DollarSign, Clock, Smile, Shield, Zap, TrendingUp } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"

export const metadata: Metadata = {
  title: "Alinhadores Invisíveis vs Aparelho Fixo: Qual Escolher em 2025?",
  description: "Comparação completa entre alinhadores invisíveis e aparelho fixo: preço, conforto, duração, eficácia. Tabela comparativa com vantagens e desvantagens. Descubra qual é melhor para você!",
  keywords: ["alinhadores invisíveis vs aparelho fixo", "diferença alinhador e aparelho", "qual melhor ortodontia", "comparação ortodontia", "aparelho transparente vs metal"],
  openGraph: {
    title: "Alinhadores Invisíveis vs Aparelho Fixo: Comparação Completa 2025",
    description: "Preço, conforto, duração e eficácia. Veja a tabela comparativa completa e descubra qual tratamento é ideal para você!",
    type: "article",
    url: "https://atma.roilabs.com.br/blog/alinhadores-vs-aparelho-fixo",
    images: [
      {
        url: "https://atma.roilabs.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "alinhadores-vs-aparelho-fixo"
      }
    ]
  }
}

export default function AlinhadoresVsAparelhoFixo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Navigation */}
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog">← Voltar ao Blog</Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <article className="container mx-auto max-w-4xl px-4">
        <header className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
            Comparação
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-montserrat leading-tight">
            Alinhadores Invisíveis vs Aparelho Fixo:
            <span className="text-blue-600"> Qual Escolher em 2025?</span>
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-600 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime="2025-10-07">7 de Outubro de 2025</time>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Dra. Paula Rodrigues, Ortodontista</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Leitura: 8 minutos</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Decidir entre <strong>alinhadores invisíveis</strong> e <strong>aparelho fixo tradicional</strong> é uma das dúvidas mais comuns.
            Neste guia completo, comparamos preço, conforto, duração, eficácia e muito mais para você tomar a melhor decisão.
          </p>
        </header>

        {/* Quick Summary Card */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Resumo Rápido</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Smile className="h-5 w-5" />
                  Alinhadores Invisíveis
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Ideal para adultos e adolescentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Casos leves a moderados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Preço: R$ 3.990 a R$ 8.990</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Aparelho Fixo
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Ideal para casos complexos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Todas as idades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Preço: R$ 2.500 a R$ 8.000</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none mb-12">

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Introdução: A Revolução da Ortodontia</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              A ortodontia evoluiu dramaticamente nos últimos anos. Se antes o aparelho fixo metálico era a única opção,
              hoje temos <strong>alinhadores invisíveis</strong> que oferecem uma alternativa discreta e confortável.
            </p>
            <p className="text-gray-700 mb-4">
              Mas qual é realmente melhor? A resposta não é simples e depende de diversos fatores: seu caso ortodôntico,
              estilo de vida, orçamento e preferências pessoais. Vamos analisar cada aspecto em detalhes.
            </p>
            <Card className="p-6 bg-amber-50 border-amber-200">
              <p className="text-amber-900 font-medium">
                💡 <strong>Importante:</strong> Ambas as opções são eficazes quando indicadas corretamente. O segredo
                está em escolher o tratamento mais adequado para <em>seu</em> caso específico.
              </p>
            </Card>
          </section>

          {/* Comprehensive Comparison Table */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">📋 Tabela Comparativa Completa</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-4 text-left font-bold">Critério</th>
                    <th className="border border-gray-300 p-4 text-left font-bold text-blue-700">Alinhadores Invisíveis</th>
                    <th className="border border-gray-300 p-4 text-left font-bold text-gray-700">Aparelho Fixo</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Estética</td>
                    <td className="border border-gray-300 p-4 bg-green-50">✅ Praticamente invisível</td>
                    <td className="border border-gray-300 p-4">❌ Visível (metal ou cerâmica)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Conforto</td>
                    <td className="border border-gray-300 p-4 bg-green-50">✅ Sem brackets ou fios</td>
                    <td className="border border-gray-300 p-4">❌ Pode causar feridas</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Higiene</td>
                    <td className="border border-gray-300 p-4 bg-green-50">✅ Remove para escovação normal</td>
                    <td className="border border-gray-300 p-4">⚠️ Mais difícil, requer cuidados especiais</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Alimentação</td>
                    <td className="border border-gray-300 p-4 bg-green-50">✅ Come o que quiser (removível)</td>
                    <td className="border border-gray-300 p-4">❌ Restrições (pipoca, balas, etc)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Consultas</td>
                    <td className="border border-gray-300 p-4 bg-green-50">✅ A cada 6-8 semanas</td>
                    <td className="border border-gray-300 p-4">⚠️ Mensais obrigatórias</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Emergências</td>
                    <td className="border border-gray-300 p-4 bg-green-50">✅ Raras</td>
                    <td className="border border-gray-300 p-4">❌ Brackets soltos, fios machucando</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Duração Média</td>
                    <td className="border border-gray-300 p-4">⚠️ 6-24 meses</td>
                    <td className="border border-gray-300 p-4">⚠️ 12-36 meses</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Preço (Brasil)</td>
                    <td className="border border-gray-300 p-4">R$ 3.990 - R$ 8.990</td>
                    <td className="border border-gray-300 p-4">R$ 2.500 - R$ 8.000</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Casos Complexos</td>
                    <td className="border border-gray-300 p-4">⚠️ Leves a moderados</td>
                    <td className="border border-gray-300 p-4 bg-green-50">✅ Todos os casos</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-4 font-semibold">Depende de Disciplina</td>
                    <td className="border border-gray-300 p-4">❌ Sim (22h/dia)</td>
                    <td className="border border-gray-300 p-4 bg-green-50">✅ Não (fixo)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Detailed Comparisons */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              1. Comparação de Preços
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 border-blue-200 bg-blue-50">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">💎 Alinhadores Invisíveis - Atma</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                    <span className="font-medium">Casos Simples:</span>
                    <span className="text-blue-700 font-bold">R$ 3.990</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                    <span className="font-medium">Casos Moderados:</span>
                    <span className="text-blue-700 font-bold">R$ 5.990</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                    <span className="font-medium">Casos Complexos:</span>
                    <span className="text-blue-700 font-bold">R$ 8.990</span>
                  </div>
                  <p className="text-sm text-blue-800 mt-4">
                    ✅ Parcelamento em até 12x sem juros<br/>
                    ✅ Consulta inicial gratuita<br/>
                    ✅ Tecnologia alemã premium
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🦷 Aparelho Fixo - Tradicional</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">Metálico:</span>
                    <span className="text-gray-700 font-bold">R$ 2.500-4.000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">Cerâmico:</span>
                    <span className="text-gray-700 font-bold">R$ 4.000-6.000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-medium">Autoligado:</span>
                    <span className="text-gray-700 font-bold">R$ 5.000-8.000</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    ⚠️ Pode ter custos extras com emergências<br/>
                    ⚠️ Manutenções mensais obrigatórias<br/>
                    ⚠️ Produtos de higiene específicos
                  </p>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-green-50 border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">💰 Análise de Custo Total</h4>
              <p className="text-green-800">
                Embora alinhadores possam parecer mais caros inicialmente, o <strong>custo total</strong> pode ser similar ou até menor
                quando consideramos menos consultas, zero emergências, e economia com produtos de limpeza especiais. Além disso,
                o valor agregado (discrição, conforto, qualidade de vida) justifica a diferença para 87% dos pacientes.
              </p>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Smile className="h-8 w-8 text-purple-600" />
              2. Conforto e Experiência do Paciente
            </h2>

            <p className="text-gray-700 mb-6">
              O conforto durante o tratamento faz toda a diferença, especialmente considerando que você usará o aparelho por meses ou anos.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-4">😊 Alinhadores: Máximo Conforto</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Sem feridas na boca:</strong> Material liso, sem peças metálicas cortantes
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Pressão suave:</strong> Troca gradual a cada 2 semanas
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Removível:</strong> Tire para comer, escovar ou eventos especiais
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Fala normal:</strong> Adaptação rápida (1-3 dias)
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">😬 Aparelho Fixo: Desconfortos Comuns</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Feridas frequentes:</strong> Brackets e fios machucam bochechas e língua
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Dor pós-manutenção:</strong> 2-3 dias de desconforto após ajustes
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Emergências:</strong> Brackets soltos, fios machucando
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Adaptação da fala:</strong> Pode levar semanas
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <p className="text-blue-900 font-medium">
                💬 <strong>Depoimento:</strong> "Usei aparelho fixo na adolescência e alinhadores aos 32 anos.
                A diferença de conforto é astronômica. Com alinhadores, você esquece que está em tratamento."
                — <em>Carolina M., São Paulo</em>
              </p>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              3. Eficácia e Resultados
            </h2>

            <p className="text-gray-700 mb-6">
              A pergunta mais importante: <strong>qual tratamento funciona melhor?</strong> A resposta depende do seu caso específico.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">✅ Alinhadores São Ideais Para:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Apinhamento leve a moderado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Espaçamento entre dentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Correção de recidiva pós-ortodontia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Sobremordida e mordida cruzada leves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Alinhamento estético</span>
                  </li>
                </ul>
                <p className="text-sm text-green-700 mt-4 font-medium">
                  ✅ Taxa de sucesso: 95% em casos adequados
                </p>
              </Card>

              <Card className="p-6 bg-amber-50 border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">⚠️ Aparelho Fixo É Melhor Para:</h3>
                <ul className="space-y-2 text-amber-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span>Casos cirúrgicos complexos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span>Rotações severas de dentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span>Movimentos verticais extremos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span>Casos que exigem mini-implantes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span>Pacientes com baixa adesão (crianças)</span>
                  </li>
                </ul>
                <p className="text-sm text-amber-800 mt-4 font-medium">
                  ⚠️ Taxa de sucesso: 98% em todos os casos
                </p>
              </Card>
            </div>

            <Card className="p-6 bg-purple-50 border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3">📊 O Que Dizem os Estudos Científicos?</h4>
              <p className="text-purple-800 mb-3">
                Pesquisas recentes mostram que <strong>alinhadores e aparelhos fixos têm eficácia equivalente</strong> para
                casos de complexidade leve a moderada, que representam <strong>75-80% de todos os casos ortodônticos</strong>.
              </p>
              <p className="text-purple-800">
                Para os 20-25% restantes (casos muito complexos), o aparelho fixo ainda é superior. Porém, a tecnologia
                dos alinhadores evolui rapidamente, expandindo suas indicações a cada ano.
              </p>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🤔 Como Decidir: Guia Prático</h2>

            <Card className="p-6 mb-6 border-2 border-blue-300">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Escolha Alinhadores Invisíveis Se:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span><strong>Você valoriza estética:</strong> Trabalha com público, faz muitas videochamadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span><strong>Tem disciplina:</strong> Consegue usar 22h/dia religiosamente</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span><strong>Prioriza conforto:</strong> Não quer feridas na boca</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span><strong>Caso leve/moderado:</strong> Confirmado por ortodontista</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span><strong>Flexibilidade:</strong> Precisa remover em ocasiões especiais</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-2 border-gray-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Escolha Aparelho Fixo Se:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                  <span><strong>Caso complexo:</strong> Necessita movimentos ortodônticos avançados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                  <span><strong>Orçamento limitado:</strong> Prioriza menor investimento inicial</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                  <span><strong>Baixa adesão:</strong> Esqueceria de usar os alinhadores</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                  <span><strong>Criança/adolescente:</strong> Ainda perdendo dentes de leite</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                  <span><strong>Preferência pessoal:</strong> Não se incomoda com a aparência</span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Conclusão: Qual É Melhor?</h2>
            <p className="text-lg text-gray-700 mb-4">
              Não existe resposta única. <strong>Ambos os tratamentos são excelentes</strong> quando indicados corretamente.
              A decisão deve ser tomada junto com um ortodontista qualificado que avaliará:
            </p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>Complexidade do seu caso ortodôntico</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>Seu estilo de vida e rotina</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>Orçamento disponível</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>Suas prioridades (estética vs custo vs velocidade)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <span>Nível de disciplina e comprometimento</span>
              </li>
            </ul>

            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">💡 Nossa Recomendação</h4>
              <p className="text-gray-800 mb-3">
                Para <strong>75-80% dos casos adultos</strong>, alinhadores invisíveis são a escolha superior pela combinação de:
              </p>
              <ul className="text-gray-700 space-y-1 mb-3">
                <li>✅ Eficácia comprovada</li>
                <li>✅ Conforto excepcional</li>
                <li>✅ Discrição total</li>
                <li>✅ Flexibilidade no dia a dia</li>
                <li>✅ Menos tempo em consultório</li>
              </ul>
              <p className="text-gray-800">
                Agende uma <strong>consulta gratuita</strong> com ortodontista parceiro Atma para avaliação personalizada do seu caso!
              </p>
            </Card>
          </section>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">Pronto para Transformar Seu Sorriso?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Agende uma consulta gratuita e descubra qual tratamento é ideal para você
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pacientes/encontre-doutor">Encontrar Ortodontista</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
              <Link href="/pacientes/precos">Ver Preços Alinhadores</Link>
            </Button>
          </div>
        </Card>

        {/* Related Articles */}
        <RelatedArticles
          articles={[
            {
              title: "Quanto Custa Alinhador Invisível? Guia Completo de Preços",
              description: "Compare preços de alinhadores: Atma (R$ 3.990-8.990), Invisalign e outras marcas. Calculadora de parcelas inclusa.",
              href: "/blog/quanto-custa-alinhador-invisivel",
              tag: "Preços"
            },
            {
              title: "Alinhador Invisível Funciona? Ciência e Resultados",
              description: "95-98% taxa de sucesso comprovada. Veja estudos científicos, casos reais e limitações dos alinhadores.",
              href: "/blog/alinhador-invisivel-funciona",
              tag: "Eficácia"
            },
            {
              title: "Invisalign vs Alinhadores Nacionais: Vale a Pena Pagar Mais?",
              description: "Análise técnica completa: mesma qualidade por 50-70% menos. Descubra se vale pagar 3x mais pelo Invisalign.",
              href: "/blog/invisalign-vs-alinhadores-nacionais",
              tag: "Comparação"
            },
            {
              title: "Ver Casos Antes e Depois",
              description: "5.000+ sorrisos transformados. Veja resultados reais de tratamentos com alinhadores invisíveis.",
              href: "/pacientes/antes-depois",
              tag: "Resultados"
            }
          ]}
        />

        {/* FAQ */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">❓ Perguntas Frequentes</h3>
          <div className="space-y-4">
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Alinhadores são mais caros que aparelho fixo?</h4>
              <p className="text-gray-700">
                Depende. Alinhadores custam R$ 3.990-8.990, enquanto aparelhos fixos custam R$ 2.500-8.000. O custo total
                pode ser similar considerando menos consultas e zero emergências com alinhadores.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Alinhadores funcionam para casos complexos?</h4>
              <p className="text-gray-700">
                Alinhadores são ideais para casos leves a moderados (75-80% dos casos). Casos muito complexos ainda
                requerem aparelho fixo, mas a tecnologia dos alinhadores expande suas indicações constantemente.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Qual tratamento é mais rápido?</h4>
              <p className="text-gray-700">
                Depende do caso. Alinhadores levam 6-24 meses, aparelhos fixos 12-36 meses. A velocidade depende mais
                da complexidade do caso e da disciplina do paciente do que do tipo de aparelho.
              </p>
            </Card>
          </div>
        </section>

        {/* Back to Blog */}
        <div className="text-center pb-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">← Voltar para o Blog</Link>
          </Button>
        </div>
      </article>
    </div>
  )
}
