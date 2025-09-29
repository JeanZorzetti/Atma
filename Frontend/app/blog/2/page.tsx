import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Users, ChevronLeft, Printer, Zap, Layers, Settings, Gauge, Target } from "lucide-react"

export default function Tecnologia3DOrtodontia() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white">
      {/* Navigation */}
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <article className="container mx-auto max-w-4xl px-4">
        <header className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 text-purple-600 border-purple-200">
            Tecnologia
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-montserrat leading-tight">
            Como Funciona a Tecnologia 3D
            <span className="text-purple-600"> na Ortodontia</span>
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>10 de Janeiro de 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Dr. Carlos Santos</span>
            </div>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            A impressão 3D revolucionou completamente os tratamentos ortodônticos.
            Entenda como esta tecnologia tornou os alinhadores mais precisos e acessíveis.
          </p>
        </header>

        {/* Featured Image Placeholder */}
        <div className="mb-12">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-16 text-center">
              <Printer className="h-24 w-24 mx-auto text-purple-600 mb-4" />
              <p className="text-gray-600 font-medium">Tecnologia 3D na Ortodontia</p>
            </div>
          </Card>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="space-y-8">

            {/* Introduction */}
            <section>
              <p className="text-lg text-gray-700 leading-relaxed">
                A tecnologia 3D transformou radicalmente o campo da ortodontia. O que antes era
                um processo artesanal, dependente de moldes de gesso e ajustes manuais, agora
                é um procedimento de alta precisão, guiado por algoritmos computacionais e
                materiais de última geração.
              </p>
              <p className="text-gray-700 mt-4">
                Neste artigo, vamos explorar como funciona cada etapa do processo de criação
                dos alinhadores invisíveis, desde o escaneamento digital até a entrega do
                produto final ao paciente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="h-6 w-6 text-purple-600" />
                Do Tradicional ao Digital: Uma Revolução Silenciosa
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">🦷 Método Tradicional</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>❌ Moldes de alginato desconfortáveis</li>
                    <li>❌ 15-20 minutos com moldeira na boca</li>
                    <li>❌ Risco de distorções no transporte</li>
                    <li>❌ Processo manual sujeito a erros</li>
                    <li>❌ 2-3 semanas para confecção</li>
                    <li>❌ Ajustes limitados</li>
                  </ul>
                </Card>

                <Card className="p-6 border-purple-200 bg-purple-50">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4">🖥️ Tecnologia 3D</h3>
                  <ul className="space-y-2 text-purple-700">
                    <li>✅ Escaneamento digital confortável</li>
                    <li>✅ 2-3 minutos de captura</li>
                    <li>✅ Dados digitais permanentes</li>
                    <li>✅ Precisão de 20 micrometros</li>
                    <li>✅ 3-5 dias para produção</li>
                    <li>✅ Ajustes digitais ilimitados</li>
                  </ul>
                </Card>
              </div>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <p className="text-blue-800 font-medium">
                  "A transição para o digital não foi apenas uma melhoria incremental - foi uma
                  mudança paradigmática que elevou a ortodontia a um novo patamar de precisão e eficiência."
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  — Dr. Carlos Santos, Ortodontista Digital há 12 anos
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Layers className="h-6 w-6 text-purple-600" />
                O Processo Completo: Da Boca ao Alinhador
              </h2>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Escaneamento Intraoral
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Tudo começa com um escaneamento intraoral de alta precisão. O scanner 3D captura
                    a geometria completa dos dentes e gengivas em resolução micrométrica.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🔬 Especificações Técnicas:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Precisão: ±20 micrometros</li>
                        <li>• Tempo de escaneamento: 2-3 minutos</li>
                        <li>• Captura em tempo real</li>
                        <li>• Correção automática de movimento</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">✨ Vantagens para o Paciente:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Sem desconforto ou náusea</li>
                        <li>• Visualização instantânea</li>
                        <li>• Possibilidade de refazer facilmente</li>
                        <li>• Experiência moderna e tecnológica</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Processamento Digital e Planejamento
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Os dados do escaneamento são processados por softwares especializados que criam
                    um modelo 3D virtual detalhado. Algoritmos avançados calculam a movimentação
                    dental otimizada.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🧠 Inteligência Artificial no Planejamento:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Análise automática de má oclusão</li>
                      <li>• Cálculo de forças biomecânicas ideais</li>
                      <li>• Predição de movimentos dentários</li>
                      <li>• Otimização do número de alinhadores</li>
                      <li>• Simulação do resultado final</li>
                    </ul>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Impressão 3D dos Modelos
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Para cada etapa do tratamento, são criados modelos 3D físicos usando impressoras
                    de resina de alta resolução. Estes modelos servem como base para a confecção
                    dos alinhadores.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">0.05mm</div>
                      <div className="text-xs text-gray-600">Precisão da impressão</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">2-3h</div>
                      <div className="text-xs text-gray-600">Tempo de impressão</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">UV</div>
                      <div className="text-xs text-gray-600">Cura por luz ultravioleta</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Termoformação dos Alinhadores
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Os alinhadores são confeccionados através do processo de termoformação, onde
                    folhas de material termoplástico são aquecidas e moldadas sobre os modelos 3D.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🔥 Processo de Termoformação:</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>1. Aquecimento do material a 180°C</li>
                        <li>2. Aplicação de pressão e vácuo</li>
                        <li>3. Resfriamento controlado</li>
                        <li>4. Corte de precisão por laser</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">🧪 Materiais Utilizados:</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Poliuretano termoplástico médico</li>
                        <li>• Livre de BPA e ftalatos</li>
                        <li>• Resistente a manchas e odores</li>
                        <li>• Transparência óptica superior</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Settings className="h-6 w-6 text-purple-600" />
                Tecnologias Auxiliares Revolucionárias
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 Automação Industrial</h3>
                  <p className="text-gray-700 mb-3">
                    Robôs de precisão executam tarefas repetitivas com perfeição, garantindo
                    qualidade constante e reduzindo o tempo de produção.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Corte laser automatizado</li>
                    <li>• Polimento robótico</li>
                    <li>• Controle de qualidade por visão computacional</li>
                    <li>• Embalagem estéril automatizada</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">☁️ Computação em Nuvem</h3>
                  <p className="text-gray-700 mb-3">
                    O poder da nuvem permite processamento massivo de dados e acesso global
                    aos planejamentos de tratamento.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Processamento paralelo de milhares de casos</li>
                    <li>• Acesso em tempo real aos projetos</li>
                    <li>• Backup automático e seguro</li>
                    <li>• Colaboração global entre especialistas</li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Gauge className="h-6 w-6 text-purple-600" />
                Números que Impressionam
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.5%</div>
                  <div className="text-gray-700">Precisão dimensional</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">80%</div>
                  <div className="text-gray-700">Redução no tempo de produção</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-gray-700">Satisfação dos pacientes</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-700">Produção contínua</div>
                </Card>
              </div>

              <Card className="p-6 bg-purple-50 border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  📊 Comparativo: Antes vs Depois da Tecnologia 3D
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Tempo de Produção:</h4>
                    <p className="text-purple-700">2-3 semanas → 3-5 dias</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Precisão:</h4>
                    <p className="text-purple-700">±200µm → ±20µm</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Retrabalho:</h4>
                    <p className="text-purple-700">15-20% → &lt;3%</p>
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Target className="h-6 w-6 text-purple-600" />
                O Futuro da Tecnologia 3D na Ortodontia
              </h2>

              <p className="text-gray-700 mb-6">
                A tecnologia continua evoluindo rapidamente. As próximas inovações prometem
                tornar os tratamentos ainda mais precisos, rápidos e personalizados.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-3">🔮 Tendências Emergentes</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Impressão 4D:</strong> Materiais que mudam com o tempo</li>
                    <li>• <strong>Bio-impressão:</strong> Tecidos gengivais artificiais</li>
                    <li>• <strong>Nano-materiais:</strong> Propriedades antimicrobianas</li>
                    <li>• <strong>IA Generativa:</strong> Criação automática de designs</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-green-600 mb-3">🌱 Sustentabilidade</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Materiais recicláveis:</strong> Economia circular</li>
                    <li>• <strong>Produção local:</strong> Redução de transporte</li>
                    <li>• <strong>Energia renovável:</strong> Impressoras solares</li>
                    <li>• <strong>Waste-to-product:</strong> Reuso de materiais</li>
                  </ul>
                </Card>
              </div>

              <Card className="p-6 bg-green-50 border-green-200">
                <p className="text-green-800 font-medium">
                  "Estamos no limiar de uma nova era onde a personalização extrema se encontra
                  com a produção em massa. Cada alinhador será único como uma impressão digital,
                  mas produzido com a eficiência de uma linha de montagem."
                </p>
                <p className="text-sm text-green-700 mt-2">
                  — Dra. Marina Tech, Pesquisadora em Biomateriais
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Conclusão: A Democratização da Precisão
              </h2>
              <p className="text-gray-700 mb-4">
                A tecnologia 3D transformou fundamentalmente a ortodontia, tornando tratamentos
                de alta qualidade mais acessíveis e eficientes. O que antes era privilégio de
                poucos centros especializados, hoje é realidade em clínicas ao redor do mundo.
              </p>
              <p className="text-gray-700 mb-4">
                Para os pacientes, isso significa tratamentos mais confortáveis, previsíveis e
                rápidos. Para os ortodontistas, representa uma ferramenta poderosa que eleva
                a qualidade dos resultados e a satisfação profissional.
              </p>
              <p className="text-gray-700">
                A revolução 3D na ortodontia não é apenas sobre tecnologia - é sobre humanizar
                o tratamento, tornando-o mais centrado no paciente e adaptado às necessidades
                individuais de cada sorriso.
              </p>
            </section>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">
            Experimente a Tecnologia 3D em seu Tratamento
          </h3>
          <p className="text-purple-100 mb-6 text-lg">
            Descubra como a Atma Aligner utiliza o que há de mais avançado em tecnologia 3D
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pacientes/tratamento">
                Ver Nosso Processo 3D
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
              <Link href="/ortodontistas/tecnologia">
                Para Ortodontistas
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
                O Futuro da Ortodontia: Como a IA está Transformando Tratamentos
              </h4>
              <p className="text-gray-600 mb-4">
                Explore como a inteligência artificial potencializa a tecnologia 3D
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog/futuro-ortodontia-ia">
                  Ler artigo →
                </Link>
              </Button>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Cuidados Essenciais com seu Alinhador
              </h4>
              <p className="text-gray-600 mb-4">
                Como manter seus alinhadores 3D em perfeito estado
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog/3">
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
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar para o Blog
            </Link>
          </Button>
        </div>
      </article>
    </div>
  )
}