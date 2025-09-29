import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Users, Smile, Clock, Shield, Star, CheckCircle } from "lucide-react"

export default function BeneficiosAlinhadorAdultos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">
      {/* Navigation */}
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog">
              Voltar ao Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <article className="container mx-auto max-w-4xl px-4">
        <header className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 text-green-600 border-green-200">
            Tratamento
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-montserrat leading-tight">
            Os Benefícios do Alinhador Invisível
            <span className="text-green-600"> para Adultos</span>
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>15 de Janeiro de 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Dr. Ana Silva</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Cada vez mais adultos estão descobrindo as vantagens dos alinhadores invisíveis.
            Conheça os principais benefícios que tornam essa escolha tão popular.
          </p>
        </header>

        {/* Featured Image Placeholder */}
        <div className="mb-12">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-16 text-center">
              <Smile className="h-24 w-24 mx-auto text-green-600 mb-4" />
              <p className="text-gray-600 font-medium">Sorrisos Adultos Transformados</p>
            </div>
          </Card>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="space-y-8">

            {/* Introduction */}
            <section>
              <p className="text-lg text-gray-700 leading-relaxed">
                A ortodontia não tem idade limite. Cada vez mais adultos estão buscando tratamentos
                ortodônticos para corrigir seus sorrisos, e os alinhadores invisíveis se tornaram
                a opção preferida por inúmeras razões práticas e estéticas.
              </p>
              <p className="text-gray-700 mt-4">
                Se você é adulto e está considerando um tratamento ortodôntico, este artigo vai
                mostrar por que os alinhadores invisíveis podem ser a melhor escolha para seu estilo de vida.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Star className="h-6 w-6 text-green-600" />
                Discrição: O Benefício Mais Valorizado
              </h2>
              <Card className="p-6 mb-6">
                <CardContent className="p-0">
                  <p className="text-gray-700 mb-4">
                    Para adultos que trabalham em ambientes corporativos ou têm vida social ativa,
                    a discrição é fundamental. Os alinhadores invisíveis oferecem:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">✨ Aparência Natural</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Praticamente imperceptíveis</li>
                        <li>• Não alteram a fala</li>
                        <li>• Confiança mantida</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">👔 Profissionalismo</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Ideal para apresentações</li>
                        <li>• Reuniões sem constrangimento</li>
                        <li>• Sorrir com naturalidade</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <p className="text-green-800 font-medium">
                  "Usei alinhadores durante todo meu MBA e ninguém nunca notou. Pude focar nos estudos
                  e networking sem me preocupar com a aparência do meu sorriso."
                </p>
                <p className="text-sm text-green-700 mt-2">
                  — Marina, 32 anos, Executiva de Marketing
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Clock className="h-6 w-6 text-green-600" />
                Flexibilidade para a Rotina Adulta
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-red-600 mb-3">🦷 Aparelhos Fixos Tradicionais</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>❌ Consultas mensais obrigatórias</li>
                    <li>❌ Emergências por brackets soltos</li>
                    <li>❌ Restrições alimentares rígidas</li>
                    <li>❌ Dificuldade na higienização</li>
                    <li>❌ Desconforto em eventos sociais</li>
                  </ul>
                </Card>

                <Card className="p-6 border-green-200 bg-green-50">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">😊 Alinhadores Invisíveis</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>✅ Consultas a cada 6-8 semanas</li>
                    <li>✅ Sem emergências ortodônticas</li>
                    <li>✅ Come o que quiser (removível)</li>
                    <li>✅ Higiene bucal normal</li>
                    <li>✅ Remove para ocasiões especiais</li>
                  </ul>
                </Card>
              </div>

              <p className="text-gray-700">
                A vida adulta é cheia de compromissos. Os alinhadores se adaptam à sua agenda,
                não o contrário. Você pode removê-los para apresentações importantes, jantares
                de negócios ou eventos especiais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-600" />
                Conforto e Saúde Bucal
              </h2>

              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Benefícios para a Saúde Bucal
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">🦷 Higienização</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Escove e use fio dental normalmente. Sem brackets ou fios para dificultar.
                    </p>

                    <h4 className="font-semibold text-green-700 mb-2">🍎 Alimentação</h4>
                    <p className="text-gray-700 text-sm">
                      Sem restrições alimentares. Remove, come e recoloca.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">💊 Menos Dor</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Movimentos graduais e suaves, sem a pressão intensa dos ajustes mensais.
                    </p>

                    <h4 className="font-semibold text-green-700 mb-2">🛡️ Proteção</h4>
                    <p className="text-gray-700 text-sm">
                      Protege os dentes contra bruxismo durante o tratamento.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Star className="h-6 w-6 text-green-600" />
                Resultados Previsíveis e Eficazes
              </h2>

              <p className="text-gray-700 mb-6">
                A tecnologia por trás dos alinhadores permite uma previsibilidade impressionante.
                Antes mesmo de começar o tratamento, você pode visualizar como será seu sorriso final.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-gray-700">Taxa de sucesso em casos adultos</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">12-18</div>
                  <div className="text-gray-700">Meses de tratamento médio</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">22h</div>
                  <div className="text-gray-700">Uso diário recomendado</div>
                </Card>
              </div>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  📊 Estudos Comprovam a Eficácia
                </h3>
                <p className="text-blue-800">
                  Pesquisas mostram que alinhadores são tão eficazes quanto aparelhos fixos para
                  casos de complexidade leve a moderada, que representam 80% dos casos adultos.
                  A diferença está no conforto e na experiência do paciente.
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Casos Ideais para Adultos
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-4">
                    ✅ Casos Ideais para Alinhadores
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Apinhamento leve a moderado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Espaçamento entre os dentes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Correção de recidiva pós-ortodontia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Mordida cruzada leve</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Sobremordida moderada</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-6 bg-amber-50 border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-800 mb-4">
                    ⚠️ Casos que Precisam Avaliação
                  </h3>
                  <ul className="space-y-2 text-amber-800">
                    <li>• Casos cirúrgicos complexos</li>
                    <li>• Rotações severas</li>
                    <li>• Intrusões/extrusões extremas</li>
                    <li>• Problemas periodontais ativos</li>
                  </ul>
                  <p className="text-sm text-amber-700 mt-4 font-medium">
                    Mesmo estes casos podem ser tratáveis com alinhadores em muitas situações.
                    Consulte um ortodontista especializado.
                  </p>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Investimento vs. Benefícios
              </h2>

              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  💰 Análise de Custo-Benefício para Adultos
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Benefícios Profissionais</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Melhora da autoestima e confiança</li>
                      <li>• Impacto positivo em apresentações</li>
                      <li>• Sorriso mais atrativo em networking</li>
                      <li>• Zero tempo perdido com emergências</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Benefícios Pessoais</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Saúde bucal melhorada</li>
                      <li>• Mais facilidade para higienização</li>
                      <li>• Conforto no dia a dia</li>
                      <li>• Vida social sem restrições</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <p className="text-green-800 font-medium">
                  "O investimento em alinhadores se paga rapidamente quando consideramos o tempo
                  economizado, a confiança ganha e os benefícios profissionais. Foi uma das
                  melhores decisões que já tomei."
                </p>
                <p className="text-sm text-green-700 mt-2">
                  — Roberto, 45 anos, Advogado
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Conclusão: É Hora de Sorrir Sem Limites
              </h2>
              <p className="text-gray-700 mb-4">
                A idade adulta não deve ser uma barreira para ter o sorriso dos seus sonhos.
                Os alinhadores invisíveis oferecem a solução perfeita para adultos que desejam
                corrigir seus dentes sem comprometer sua vida profissional ou social.
              </p>
              <p className="text-gray-700">
                Com tecnologia avançada, resultados previsíveis e a conveniência que a vida adulta
                exige, os alinhadores representam a evolução natural da ortodontia moderna.
                Nunca é tarde para investir em seu sorriso e em sua autoestima.
              </p>
            </section>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 bg-gradient-to-r from-green-600 to-blue-600 text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">
            Pronto para transformar seu sorriso?
          </h3>
          <p className="text-green-100 mb-6 text-lg">
            Descubra se você é candidato ao tratamento com alinhadores invisíveis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pacientes/encontre-doutor">
                Encontrar Ortodontista
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              <Link href="/pacientes/precos">
                Ver Preços e Financiamento
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
                Cuidados Essenciais com seu Alinhador
              </h4>
              <p className="text-gray-600 mb-4">
                Dicas importantes para manter seu alinhador limpo e garantir a eficácia
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog/3">
                  Ler artigo →
                </Link>
              </Button>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                O Futuro da Ortodontia: Como a IA está Transformando Tratamentos
              </h4>
              <p className="text-gray-600 mb-4">
                Explore como a inteligência artificial está revolucionando a ortodontia
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog/futuro-ortodontia-ia">
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
              Voltar para o Blog
            </Link>
          </Button>
        </div>
      </article>
    </div>
  )
}