import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Award, Zap, Heart, Clock, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Qualidade Alemã | Placas PETG Premium | Atma Aligner",
  description: "Descubra por que usamos placas alemãs PETG de grau médico. Certificações ISO 13485, CE e ANVISA. Precisão de ±0.2mm e durabilidade 40% superior.",
  keywords: ["PETG alemão", "qualidade alemã", "placas premium", "certificação ISO", "material ortodôntico"],
  openGraph: {
    title: "Qualidade Alemã | Placas PETG Premium | Atma Aligner",
    description: "Material PETG alemão de grau médico. Certificações internacionais e durabilidade superior.",
    type: "website",
    url: "https://atma.roilabs.com.br/pacientes/qualidade-alemao",
    images: [
      {
        url: "https://atma.roilabs.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Qualidade Alemã - Placas PETG Premium Atma Aligner"
      }
    ]
  }
}

export default function QualidadeAlemaoPacientesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20">
              Qualidade Certificada
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Por que usamos <span className="text-primary">placas alemãs</span> nos nossos alinhadores?
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A escolha do material faz toda a diferença no seu tratamento. Descubra por que investimos em materiais premium da Alemanha.
            </p>
          </div>
        </div>
      </section>

      {/* Comparativo Visual */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">O que torna as placas alemãs superiores?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Entenda as diferenças fundamentais entre materiais premium e convencionais
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Placas Alemãs */}
              <Card className="border-2 border-primary bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Award className="h-6 w-6" />
                    PETG Alemão (Scheu-Dental)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Biocompatibilidade Certificada</p>
                        <p className="text-sm text-muted-foreground">Testado segundo ISO 10993 - seguro para uso prolongado em contato com a boca</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Transparência Duradoura</p>
                        <p className="text-sm text-muted-foreground">Mantém clareza visual por todo o tratamento - praticamente invisível</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Resistência Superior</p>
                        <p className="text-sm text-muted-foreground">Alta resistência mecânica - não quebra ou racha facilmente</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Baixa Absorção de Umidade</p>
                        <p className="text-sm text-muted-foreground">Não retém líquidos - previne odores e manchas</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Conforto Aprimorado</p>
                        <p className="text-sm text-muted-foreground">Material de alta elasticidade - mais confortável no uso diário</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Placas Convencionais */}
              <Card className="border-2 border-muted">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-6 w-6" />
                    Materiais Convencionais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      <div>
                        <p className="font-semibold">Certificações Limitadas</p>
                        <p className="text-sm">Podem não ter certificação completa de biocompatibilidade</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      <div>
                        <p className="font-semibold">Amarelamento Precoce</p>
                        <p className="text-sm">Perde transparência ao longo do tempo, ficando visível</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      <div>
                        <p className="font-semibold">Fragilidade Maior</p>
                        <p className="text-sm">Mais propenso a quebras e necessidade de substituição</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      <div>
                        <p className="font-semibold">Absorção de Líquidos</p>
                        <p className="text-sm">Pode reter líquidos causando manchas e odores desagradáveis</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      <div>
                        <p className="font-semibold">Rigidez Excessiva</p>
                        <p className="text-sm">Pode causar desconforto e dificuldade de adaptação</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios para o Paciente */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">O que isso significa para você?</h2>
              <p className="text-muted-foreground">Benefícios práticos no seu dia a dia</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-2">Mais Conforto</h3>
                  <p className="text-muted-foreground text-sm">
                    Material flexível de alta qualidade que se adapta perfeitamente aos seus dentes, sem causar desconforto ou irritação
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-2">Mais Segurança</h3>
                  <p className="text-muted-foreground text-sm">
                    Material 100% biocompatível testado e certificado - não causa alergias ou reações adversas na sua boca
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-2">Mais Discreto</h3>
                  <p className="text-muted-foreground text-sm">
                    Permanece transparente durante todo o tratamento - ninguém vai perceber que você está usando
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-2">Maior Durabilidade</h3>
                  <p className="text-muted-foreground text-sm">
                    Resiste melhor ao desgaste do dia a dia - menos trocas emergenciais e interrupções no tratamento
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-2">Higiene Facilitada</h3>
                  <p className="text-muted-foreground text-sm">
                    Não absorve líquidos ou odores - fácil de limpar e mantém frescor por mais tempo
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-2">Resultados Previsíveis</h3>
                  <p className="text-muted-foreground text-sm">
                    Material de alta precisão que mantém a força ortodôntica necessária para mover seus dentes corretamente
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tecnologia Alemã */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">A tradição alemã de qualidade</h2>
            </div>

            <Card className="border-2 border-primary">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-6 w-6 text-primary" />
                      Scheu-Dental: 90+ anos de excelência
                    </h3>
                    <p className="text-muted-foreground">
                      Utilizamos placas PETG Duran® da Scheu-Dental, uma empresa alemã com mais de 90 anos de tradição
                      em materiais odontológicos. Reconhecida mundialmente pela qualidade e inovação.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      Certificações Internacionais
                    </h3>
                    <p className="text-muted-foreground">
                      Todos os materiais são testados segundo a norma DIN EN ISO 10993, o mais rigoroso padrão internacional
                      para biocompatibilidade de dispositivos médicos.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-6 w-6 text-primary" />
                      Controle de Qualidade Rigoroso
                    </h3>
                    <p className="text-muted-foreground">
                      Cada lote é testado para garantir propriedades mecânicas consistentes, transparência ótima e
                      biocompatibilidade. Zero comprometimento com a qualidade.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Perguntas Frequentes</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Os alinhadores com placas alemãs são mais caros?</h3>
                  <p className="text-muted-foreground text-sm">
                    Embora o material seja premium, nosso modelo de negócio permite oferecer preços acessíveis sem
                    comprometer a qualidade. O investimento extra em materiais superiores resulta em menos problemas
                    e melhor resultado final.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Posso notar diferença em relação a outros alinhadores?</h3>
                  <p className="text-muted-foreground text-sm">
                    Sim! Pacientes relatam maior conforto, melhor transparência e durabilidade superior. O material
                    não amarela e não retém odores como materiais de qualidade inferior.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">É seguro usar material importado?</h3>
                  <p className="text-muted-foreground text-sm">
                    Absolutamente! Os materiais Scheu-Dental são certificados pela ANVISA para uso no Brasil e
                    atendem aos mais rigorosos padrões internacionais de segurança (ISO 10993).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Quanto tempo duram os alinhadores com este material?</h3>
                  <p className="text-muted-foreground text-sm">
                    Cada alinhador é projetado para uso de 15-22 dias, mas a alta qualidade do material garante que
                    ele mantenha suas propriedades mecânicas e estéticas durante todo este período, sem deformações ou perda de transparência.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Invista no melhor para o seu sorriso
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Descubra como nossos alinhadores com placas alemãs premium podem transformar seu sorriso com
            segurança, conforto e resultados superiores
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/pacientes/encontre-doutor">
              Encontrar um Ortodontista Parceiro
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
