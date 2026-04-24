import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Users, Star, CheckCircle } from "lucide-react"

export default function FuturoOrtodontiaIA() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Navigation */}
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog">
              <Star className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <article className="container mx-auto max-w-4xl px-4">
        <header className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
            Destaque
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-montserrat leading-tight">
            O Futuro da Ortodontia: Como a IA está
            <span className="text-blue-600"> Transformando Tratamentos</span>
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>15 de Janeiro de 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Dr. Rafael Martins</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            A inteligência artificial está revolucionando a ortodontia moderna. Descubra como essa
            tecnologia está tornando os tratamentos mais precisos, previsíveis e eficientes.
          </p>
        </header>

        {/* Featured Image Placeholder */}
        <div className="mb-12">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-16 text-center">
              <CheckCircle className="h-24 w-24 mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600 font-medium">Inteligência Artificial na Ortodontia</p>
            </div>
          </Card>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="space-y-8">

            {/* Introduction */}
            <section>
              <p className="text-lg text-gray-700 leading-relaxed">
                A ortodontia está passando por uma transformação revolucionária. Com o avanço da
                inteligência artificial (IA), tratamentos que antes dependiam exclusivamente da
                experiência clínica agora contam com o poder do machine learning e algoritmos
                avançados para otimizar resultados e reduzir o tempo de tratamento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Star className="h-6 w-6 text-blue-600" />
                Como a IA está Revolucionando os Diagnósticos
              </h2>
              <Card className="p-6 mb-6">
                <CardContent className="p-0">
                  <p className="text-gray-700 mb-4">
                    Os sistemas de IA modernos são capazes de analisar radiografias, fotografias intraorais
                    e modelos 3D com uma precisão que supera a análise humana tradicional. Através do
                    deep learning, esses sistemas podem:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Identificar padrões de má oclusão com precisão de 95%+</li>
                    <li>Detectar problemas periodontais precocemente</li>
                    <li>Prever o crescimento facial em pacientes jovens</li>
                    <li>Calcular automaticamente espaços necessários para alinhamento</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                Planejamento de Tratamento Inteligente
              </h2>
              <p className="text-gray-700 mb-4">
                O planejamento ortodôntico assistido por IA representa um salto qualitativo na precisão
                dos tratamentos. Os algoritmos conseguem simular milhares de cenários de movimentação
                dentária em segundos, identificando o caminho mais eficiente para o resultado desejado.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Planejamento Tradicional</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>⏱️ 2-4 horas de análise</li>
                    <li>📏 Medições manuais</li>
                    <li>🎯 Baseado em experiência</li>
                    <li>🔄 Ajustes durante tratamento</li>
                  </ul>
                </Card>
                <Card className="p-6 border-blue-200 bg-blue-50">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Planejamento com IA</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>⚡ 15-30 minutos de análise</li>
                    <li>📊 Medições automáticas precisas</li>
                    <li>🧠 Baseado em milhões de casos</li>
                    <li>🎯 Previsibilidade de 90%+</li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Star className="h-6 w-6 text-blue-600" />
                Casos de Sucesso e Resultados
              </h2>
              <p className="text-gray-700 mb-6">
                Estudos recentes mostram que tratamentos ortodônticos assistidos por IA apresentam
                resultados superiores em diversos aspectos:
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">25%</div>
                  <div className="text-gray-700">Redução no tempo de tratamento</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">40%</div>
                  <div className="text-gray-700">Menos consultas de ajuste</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">90%</div>
                  <div className="text-gray-700">Precisão na previsão de resultados</div>
                </Card>
              </div>

              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  💡 Caso de Estudo: Tratamento Complexo de Má Oclusão
                </h3>
                <p className="text-green-800">
                  "Paciente com má oclusão Classe II severa teve seu tratamento planejado por IA
                  em 20 minutos, com previsão precisa de 18 meses de duração. O resultado final
                  foi alcançado em 17 meses, com satisfação completa do paciente e ortodontista."
                </p>
                <p className="text-sm text-green-700 mt-2 font-medium">
                  — Dr. Ana Carolina, Ortodontista há 15 anos
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                O Futuro já é Presente na Atma Aligner
              </h2>
              <p className="text-gray-700 mb-4">
                Na Atma Aligner, já utilizamos inteligência artificial de ponta em nosso processo
                de planejamento. Nossos algoritmos proprietários analisam cada caso individualmente,
                considerando:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                <li>Anatomia facial única de cada paciente</li>
                <li>Histórico de casos similares bem-sucedidos</li>
                <li>Biomecânica otimizada de movimentação</li>
                <li>Previsão de compliance do paciente</li>
              </ul>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <p className="text-blue-800 font-medium">
                  "A IA não substitui a experiência clínica, mas a potencializa exponencialmente.
                  É como ter um segundo cérebro que processou milhões de casos para te auxiliar
                  na tomada de decisão."
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  — Dr. Rafael Martins, CTO da Atma Aligner
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Conclusão: Uma Nova Era Começou
              </h2>
              <p className="text-gray-700 mb-4">
                A integração da inteligência artificial na ortodontia não é mais uma promessa futura
                — é realidade presente. Os ortodontistas que abraçam essa tecnologia oferecem a seus
                pacientes tratamentos mais precisos, rápidos e confortáveis.
              </p>
              <p className="text-gray-700">
                Como profissionais da saúde bucal, temos a responsabilidade de utilizar as melhores
                ferramentas disponíveis. A IA representa exatamente isso: uma ferramenta poderosa
                para elevar a qualidade dos tratamentos ortodônticos a um patamar nunca antes visto.
              </p>
            </section>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">
            Quer conhecer a ortodontia do futuro?
          </h3>
          <p className="text-blue-100 mb-6 text-lg">
            Descubra como a Atma Aligner utiliza IA para criar o seu sorriso perfeito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pacientes/tratamento">
                Conheça Nosso Tratamento
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              <Link href="/pacientes/encontre-doutor">
                Encontre um Ortodontista
              </Link>
            </Button>
          </div>
        </Card>

        {/* Related Articles */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Artigos Relacionados</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Como Funciona a Tecnologia 3D na Ortodontia
              </h4>
              <p className="text-gray-600 mb-4">
                Entenda como a impressão 3D revolucionou os tratamentos ortodônticos
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog/2">
                  Ler artigo →
                </Link>
              </Button>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Os Benefícios do Alinhador Invisível para Adultos
              </h4>
              <p className="text-gray-600 mb-4">
                Descubra por que adultos estão escolhendo alinhadores invisíveis
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog/1">
                  Ler artigo →
                </Link>
              </Button>
            </Card>
          </div>
        </section>

        {/* Back to Blog */}
        <div className="text-center pb-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              <Star className="h-4 w-4 mr-2" />
              Voltar para o Blog
            </Link>
          </Button>
        </div>
      </article>
    </div>
  )
}