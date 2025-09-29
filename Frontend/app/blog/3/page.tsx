import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Users, Star, CheckCircle } from "lucide-react"

export default function CuidadosAlinhador() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white">
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
          <Badge variant="outline" className="mb-4 text-teal-600 border-teal-200">
            Cuidados
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-montserrat leading-tight">
            Cuidados Essenciais com
            <span className="text-teal-600"> seu Alinhador</span>
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>05 de Janeiro de 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Dra. Maria Oliveira</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Dicas importantes para manter seu alinhador limpo, seguro e eficaz durante todo
            o tratamento. Cuidados simples que fazem toda a diferença no resultado final.
          </p>
        </header>

        {/* Featured Image Placeholder */}
        <div className="mb-12">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-16 text-center">
              <Star className="h-24 w-24 mx-auto text-teal-600 mb-4" />
              <p className="text-gray-600 font-medium">Cuidados com Alinhadores</p>
            </div>
          </Card>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="space-y-8">

            {/* Introduction */}
            <section>
              <p className="text-lg text-gray-700 leading-relaxed">
                O sucesso do seu tratamento com alinhadores invisíveis depende não apenas da
                qualidade do produto, mas também dos cuidados que você tem com eles no dia a dia.
                Alinhadores bem cuidados são mais eficazes, duráveis e higiênicos.
              </p>
              <p className="text-gray-700 mt-4">
                Neste guia completo, você aprenderá tudo sobre como cuidar adequadamente dos
                seus alinhadores, desde a higienização diária até o armazenamento correto,
                garantindo o melhor resultado para o seu sorriso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Star className="h-6 w-6 text-teal-600" />
                Higienização Diária: O Fundamento do Cuidado
              </h2>

              <Card className="p-6 mb-6 bg-teal-50 border-teal-200">
                <h3 className="text-lg font-semibold text-teal-900 mb-4">
                  🪥 Rotina de Limpeza Recomendada
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-teal-800 mb-2">Pela Manhã:</h4>
                    <ul className="text-teal-700 space-y-1 text-sm">
                      <li>• Remove e enxágua com água morna</li>
                      <li>• Escova suavemente com escova macia</li>
                      <li>• Usa sabão neutro (sem fragrância)</li>
                      <li>• Enxágua abundantemente</li>
                      <li>• Seca com toalha limpa</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-800 mb-2">À Noite:</h4>
                    <ul className="text-teal-700 space-y-1 text-sm">
                      <li>• Escova os dentes normalmente</li>
                      <li>• Limpa o alinhador com escova</li>
                      <li>• Pode usar tablets de limpeza</li>
                      <li>• Enxágua bem antes de recolocar</li>
                      <li>• Deixa o estojo secar ao ar</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-4">✅ Produtos Recomendados</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Escova de dentes macia ou específica para alinhadores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Sabão neutro sem fragrância forte</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Tablets de limpeza específicos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Água morna (não quente)</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-6 border-red-200 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-700 mb-4">❌ Nunca Use</h3>
                  <ul className="space-y-2 text-red-700">
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Água quente (deforma o material)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Pasta de dente abrasiva</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Enxaguantes com álcool</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Produtos químicos agressivos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Escovas duras ou abrasivas</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-teal-600" />
                Armazenamento e Proteção
              </h2>

              <p className="text-gray-700 mb-6">
                O armazenamento adequado dos alinhadores é crucial para manter sua integridade,
                higiene e eficácia. Pequenos cuidados fazem uma grande diferença.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-teal-700 mb-4">🏠 Em Casa</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li>
                      <strong>Estojo ventilado:</strong> Sempre use o estojo oficial que permite
                      circulação de ar e evita proliferação de bactérias.
                    </li>
                    <li>
                      <strong>Local seco:</strong> Evite banheiros úmidos. Prefira um local
                      arejado e à temperatura ambiente.
                    </li>
                    <li>
                      <strong>Longe de pets:</strong> Cachorros adoram mastigar alinhadores!
                      Mantenha sempre em local seguro.
                    </li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-teal-700 mb-4">🌍 Fora de Casa</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li>
                      <strong>Estojo sempre:</strong> Nunca enrole em guardanapo ou deixe
                      exposto. Use sempre o estojo.
                    </li>
                    <li>
                      <strong>Evite calor:</strong> Não deixe no carro, perto de aquecedores
                      ou sob sol direto.
                    </li>
                    <li>
                      <strong>Kit de emergência:</strong> Tenha um kit com escova, sabão
                      e estojo extra.
                    </li>
                  </ul>
                </Card>
              </div>

              <Card className="p-6 bg-amber-50 border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">
                  ⚠️ Situações de Emergência
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-amber-700 mb-2">Se perder o alinhador:</h4>
                    <p className="text-amber-700 mb-2">
                      Entre em contato imediatamente com seu ortodontista. Pode ser necessário
                      voltar ao alinhador anterior ou acelerar para o próximo.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-700 mb-2">Se rachar ou quebrar:</h4>
                    <p className="text-amber-700">
                      Pare de usar imediatamente. Fraturas podem machucar a gengiva e
                      comprometer o tratamento. Contate seu ortodontista.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Calendar className="h-6 w-6 text-teal-600" />
                Tempo de Uso e Cronograma
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">22h</div>
                  <div className="text-gray-700 mb-2">Uso diário mínimo</div>
                  <div className="text-sm text-gray-500">Para resultados eficazes</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2h</div>
                  <div className="text-gray-700 mb-2">Tempo máximo fora</div>
                  <div className="text-sm text-gray-500">Para refeições e higiene</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">7-14</div>
                  <div className="text-gray-700 mb-2">Dias por alinhador</div>
                  <div className="text-sm text-gray-500">Conforme orientação</div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📅 Cronograma Ideal de Uso
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-gray-600">06:00</div>
                    <div className="flex-1 bg-teal-100 text-teal-800 px-3 py-1 rounded text-sm">
                      Colocar após café da manhã
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-gray-600">12:00</div>
                    <div className="flex-1 bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
                      Remover para almoço (máx. 30 min)
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-gray-600">12:30</div>
                    <div className="flex-1 bg-teal-100 text-teal-800 px-3 py-1 rounded text-sm">
                      Recolocar após higiene
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-gray-600">19:00</div>
                    <div className="flex-1 bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
                      Remover para jantar (máx. 45 min)
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-gray-600">19:45</div>
                    <div className="flex-1 bg-teal-100 text-teal-800 px-3 py-1 rounded text-sm">
                      Recolocar após higiene completa
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-gray-600">22:00</div>
                    <div className="flex-1 bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                      Limpeza noturna do alinhador
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Star className="h-6 w-6 text-teal-600" />
                Cuidados Especiais por Situação
              </h2>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">🍽️ Durante as Refeições</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Antes de Comer:</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Lave as mãos antes de remover</li>
                        <li>• Remova cuidadosamente pela parte posterior</li>
                        <li>• Guarde imediatamente no estojo</li>
                        <li>• Não deixe em guardanapo ou mesa</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Após Comer:</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Escove os dentes normalmente</li>
                        <li>• Use fio dental se necessário</li>
                        <li>• Enxágue a boca com água</li>
                        <li>• Recoloque o alinhador limpo</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-4">🏃‍♂️ Durante Exercícios</h3>
                  <p className="text-gray-700 mb-4">
                    Os alinhadores podem ser mantidos durante a maioria dos exercícios, mas
                    alguns cuidados são importantes:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">✅ Pode manter:</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Caminhada e corrida leve</li>
                        <li>• Musculação sem contato</li>
                        <li>• Yoga e pilates</li>
                        <li>• Natação (com cuidado extra)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">⚠️ Considere remover:</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Esportes de contato</li>
                        <li>• Atividades com risco de impacto</li>
                        <li>• Se causam desconforto excessivo</li>
                        <li>• Exercícios de alta intensidade</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4">🌙 Cuidados Noturnos</h3>
                  <p className="text-gray-700 mb-4">
                    A noite é quando você mais usa os alinhadores, então é importante criar
                    uma rotina adequada:
                  </p>
                  <ul className="text-gray-700 space-y-2">
                    <li>
                      <strong>Higiene completa:</strong> Escove dentes, use fio dental e
                      limpe bem o alinhador antes de dormir.
                    </li>
                    <li>
                      <strong>Boca seca:</strong> Se acordar com boca seca, beba água mas
                      evite remover o alinhador desnecessariamente.
                    </li>
                    <li>
                      <strong>Bruxismo:</strong> Os alinhadores podem proteger contra o
                      ranger de dentes. Informe seu ortodontista se notar desgaste.
                    </li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Sinais de Alerta: Quando Procurar Ajuda
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6 border-red-200 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-700 mb-4">🚨 Problemas Urgentes</h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Dor intensa ou persistente</li>
                    <li>• Sangramento das gengivas</li>
                    <li>• Alinhador rachado ou quebrado</li>
                    <li>• Reação alérgica (coceira, inchaço)</li>
                    <li>• Impossibilidade de encaixar</li>
                  </ul>
                  <p className="text-sm text-red-600 mt-4 font-medium">
                    Contate seu ortodontista imediatamente!
                  </p>
                </Card>

                <Card className="p-6 border-amber-200 bg-amber-50">
                  <h3 className="text-lg font-semibold text-amber-700 mb-4">⚠️ Atenção Necessária</h3>
                  <ul className="space-y-2 text-amber-700">
                    <li>• Mudança de cor do alinhador</li>
                    <li>• Odor persistente</li>
                    <li>• Desconforto prolongado</li>
                    <li>• Dificuldade para falar</li>
                    <li>• Irritação nas gengivas</li>
                  </ul>
                  <p className="text-sm text-amber-600 mt-4 font-medium">
                    Agende uma consulta de acompanhamento
                  </p>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dicas Extras para o Sucesso do Tratamento
              </h2>

              <Card className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-teal-800 mb-3">💡 Dicas de Ouro:</h3>
                    <ul className="text-teal-700 space-y-2 text-sm">
                      <li>• Tenha sempre um kit de limpeza portátil</li>
                      <li>• Use aplicativos para monitorar o tempo de uso</li>
                      <li>• Fotografe seu progresso mensalmente</li>
                      <li>• Mantenha estojos extras em casa e trabalho</li>
                      <li>• Beba bastante água durante o dia</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-800 mb-3">📱 Recursos Úteis:</h3>
                    <ul className="text-teal-700 space-y-2 text-sm">
                      <li>• Timer para lembrar de recolocar</li>
                      <li>• Lista de contatos do ortodontista</li>
                      <li>• Calendário de troca de alinhadores</li>
                      <li>• Fotos do progresso no celular</li>
                      <li>• Lembretes de consultas</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Conclusão: Cuidado é Investimento no seu Sorriso
              </h2>
              <p className="text-gray-700 mb-4">
                Cuidar adequadamente dos seus alinhadores não é apenas sobre higiene - é sobre
                maximizar os resultados do seu investimento e garantir que seu tratamento seja
                eficaz, confortável e bem-sucedido.
              </p>
              <p className="text-gray-700 mb-4">
                Lembre-se: pequenos cuidados diários fazem uma grande diferença no resultado
                final. A disciplina com a higienização, o tempo de uso correto e o armazenamento
                adequado são os pilares de um tratamento ortodôntico de sucesso.
              </p>
              <p className="text-gray-700">
                Seu sorriso perfeito está a alguns meses de distância. Com os cuidados certos,
                você chegará lá com segurança e tranquilidade!
              </p>
            </section>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 bg-gradient-to-r from-teal-600 to-green-600 text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">
            Precisa de Orientação Personalizada?
          </h3>
          <p className="text-teal-100 mb-6 text-lg">
            Fale com seu ortodontista sobre os cuidados específicos para seu caso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pacientes/encontre-doutor">
                Encontrar Ortodontista
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-teal-600">
              <Link href="/pacientes/faq">
                Perguntas Frequentes
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
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Como Funciona a Tecnologia 3D na Ortodontia
              </h4>
              <p className="text-gray-600 mb-4">
                Entenda a tecnologia por trás dos seus alinhadores
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog/2">
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