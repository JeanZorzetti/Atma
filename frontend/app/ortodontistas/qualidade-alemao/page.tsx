import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Award, TrendingUp, Microscope, Shield, BarChart3, ArrowRight, FileText } from "lucide-react"
import Link from "next/link"

export default function QualidadeAlemaoOrtodontistasPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20">
              Diferencial Técnico
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              PETG Alemão: <span className="text-primary">Qualidade Científica Comprovada</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Entenda por que a escolha do material PETG Duran® da Scheu-Dental faz toda a diferença nos
              resultados clínicos e na satisfação dos seus pacientes.
            </p>
          </div>
        </div>
      </section>

      {/* Especificações Técnicas */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Especificações Técnicas do PETG Duran®</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dados científicos e propriedades do material premium alemão
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardContent className="p-6">
                  <Microscope className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Composição</h3>
                  <p className="text-sm text-muted-foreground mb-2">Polyethylene Terephthalate Glycol (PETG)</p>
                  <p className="text-xs text-muted-foreground">Copolímero amorfo não-cristalizante</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Temperatura de Transição Vítrea</h3>
                  <p className="text-sm text-muted-foreground mb-2">Tg: 73.3°C</p>
                  <p className="text-xs text-muted-foreground">Estabilidade térmica superior</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Biocompatibilidade</h3>
                  <p className="text-sm text-muted-foreground mb-2">Certificação ISO 10993</p>
                  <p className="text-xs text-muted-foreground">Testado segundo DIN EN ISO 10993</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <CheckCircle className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Higroscopia</h3>
                  <p className="text-sm text-muted-foreground mb-2">Baixíssima absorção de umidade</p>
                  <p className="text-xs text-muted-foreground">Não requer pré-secagem</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <BarChart3 className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Resistência Mecânica</h3>
                  <p className="text-sm text-muted-foreground mb-2">Alta resistência à flexão e impacto</p>
                  <p className="text-xs text-muted-foreground">Resistência à fadiga comprovada</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Award className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Transparência</h3>
                  <p className="text-sm text-muted-foreground mb-2">Clareza óptica excepcional</p>
                  <p className="text-xs text-muted-foreground">Mantém transparência ao longo do tempo</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary">
              <CardContent className="p-8">
                <h3 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Espessuras Disponíveis
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-primary">0.5mm</p>
                    <p className="text-xs text-muted-foreground">Soft</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-primary">0.625mm</p>
                    <p className="text-xs text-muted-foreground">Medium</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-primary">0.75mm</p>
                    <p className="text-xs text-muted-foreground">Hard</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-primary">1.0mm</p>
                    <p className="text-xs text-muted-foreground">Extra Hard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparativo Científico */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Comparativo Técnico: PETG Alemão vs. Materiais Convencionais</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Análise baseada em estudos científicos e testes de laboratório
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-background rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="p-4 text-left">Propriedade</th>
                    <th className="p-4 text-center">PETG Alemão (Duran®)</th>
                    <th className="p-4 text-center">PETG Convencional</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">Certificação ISO 10993</td>
                    <td className="p-4 text-center">
                      <Badge variant="default" className="bg-green-500">Completa</Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="secondary">Parcial/Ausente</Badge>
                    </td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="p-4 font-semibold">Absorção de Umidade</td>
                    <td className="p-4 text-center text-green-600 font-semibold">Mínima (&lt;0.1%)</td>
                    <td className="p-4 text-center text-muted-foreground">Moderada (0.3-0.5%)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">Transparência ao longo do tempo</td>
                    <td className="p-4 text-center text-green-600 font-semibold">Estável</td>
                    <td className="p-4 text-center text-muted-foreground">Reduz (amarelamento)</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="p-4 font-semibold">Resistência à Fadiga</td>
                    <td className="p-4 text-center text-green-600 font-semibold">Superior</td>
                    <td className="p-4 text-center text-muted-foreground">Moderada</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-semibold">Consistência entre lotes</td>
                    <td className="p-4 text-center text-green-600 font-semibold">Alta (QC rigoroso)</td>
                    <td className="p-4 text-center text-muted-foreground">Variável</td>
                  </tr>
                  <tr className="border-b bg-muted/50">
                    <td className="p-4 font-semibold">Força ortodôntica mantida</td>
                    <td className="p-4 text-center text-green-600 font-semibold">15-22 dias</td>
                    <td className="p-4 text-center text-muted-foreground">10-14 dias</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Termoformação</td>
                    <td className="p-4 text-center text-green-600 font-semibold">Sem pré-secagem</td>
                    <td className="p-4 text-center text-muted-foreground">Requer pré-secagem</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens Clínicas */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Vantagens Clínicas Comprovadas</h2>
              <p className="text-muted-foreground">Impacto direto na sua prática e satisfação do paciente</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    Para Sua Clínica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Previsibilidade de Resultados</p>
                      <p className="text-sm text-muted-foreground">
                        Propriedades mecânicas consistentes garantem movimentos ortodônticos precisos e planejados
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Redução de Emergências</p>
                      <p className="text-sm text-muted-foreground">
                        Material resistente minimiza quebras e necessidade de reposições urgentes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Produção Facilitada</p>
                      <p className="text-sm text-muted-foreground">
                        Não requer pré-secagem, otimizando o processo de termoformação no laboratório
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Reputação Profissional</p>
                      <p className="text-sm text-muted-foreground">
                        Associação com marca premium alemã eleva a percepção de qualidade da sua clínica
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-secondary" />
                    Para Seus Pacientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Conforto Superior</p>
                      <p className="text-sm text-muted-foreground">
                        Alta elasticidade proporciona ajuste confortável e melhor adaptação inicial
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Estética Mantida</p>
                      <p className="text-sm text-muted-foreground">
                        Transparência duradoura durante todo o período de uso - não amarela ou opacifica
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Higiene Facilitada</p>
                      <p className="text-sm text-muted-foreground">
                        Baixa absorção de líquidos previne odores e manchas, facilitando a manutenção
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Segurança Garantida</p>
                      <p className="text-sm text-muted-foreground">
                        Certificação completa de biocompatibilidade - zero risco de reações adversas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Evidência Científica */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Respaldo Científico</h2>
              <p className="text-muted-foreground">Base em pesquisas publicadas e estudos clínicos</p>
            </div>

            <Card>
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Estudos Publicados sobre PETG
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    <li>• "Advances in orthodontic clear aligner materials" - PMC (2022)</li>
                    <li>• "Clinical Performances and Biological Features of Clear Aligners Materials" - Frontiers (2022)</li>
                    <li>• "Comparative mechanical testing for different orthodontic aligner materials" - PMC (2022)</li>
                    <li>• "Color Stability of PETG-Based Orthodontic Aligners" - MDPI Polymers (2022)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-primary" />
                    Principais Conclusões
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    <li>• PETG demonstra excelentes características estéticas e formabilidade</li>
                    <li>• Alta resistência mecânica, flexibilidade e resistência ao impacto</li>
                    <li>• Não há diferença estatística significativa na força produzida entre fabricantes premium de PETG</li>
                    <li>• Biocompatibilidade e estabilidade de cor comprovadas em estudos longitudinais</li>
                  </ul>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm italic">
                    "O PETG é um copolímero amorfo não cristalizante de PET amplamente utilizado na fabricação de
                    alinhadores ortodônticos, oferecendo excelentes características estéticas, formabilidade,
                    alta resistência mecânica e flexibilidade." - Advances in Orthodontic Clear Aligner Materials (2022)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scheu-Dental */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Por que Scheu-Dental?</h2>
              <p className="text-muted-foreground">90+ anos liderando a inovação em materiais dentais</p>
            </div>

            <Card className="border-2 border-primary">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3">Tradição e Inovação</h3>
                    <p className="text-muted-foreground">
                      O Grupo SCHEU foi fundado na Alemanha há mais de 90 anos e é desenvolvedor, fabricante líder
                      de mercado e proprietário de inovadoras tecnologias nas áreas de termoformagem por pressão,
                      medicina do sono, impressão 3D e alinhadores ortodônticos.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3">Controle de Qualidade</h3>
                    <p className="text-muted-foreground">
                      Cada lote de material passa por rigorosos testes de controle de qualidade, garantindo
                      consistência nas propriedades mecânicas, ópticas e biológicas. Documentação completa de
                      biocompatibilidade conforme ISO 10993.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3">Certificações e Regulamentações</h3>
                    <p className="text-muted-foreground">
                      Material certificado pela ANVISA para uso no Brasil, atende aos mais rigorosos padrões
                      internacionais (DIN EN ISO 10993) e possui documentação técnica completa para rastreabilidade.
                    </p>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-lg">
                    <p className="font-semibold text-center mb-2">Especificações de Armazenamento</p>
                    <p className="text-sm text-muted-foreground text-center">
                      Temperatura: 5°C a 35°C | Proteger da luz solar | Manter seco
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ofereça o melhor aos seus pacientes
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se aos ortodontistas que escolhem qualidade alemã certificada para tratamentos
            ortodônticos com alinhadores de excelência
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/ortodontistas/seja-parceiro">
              Tornar-se Parceiro Atma
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
