import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Award, Shield, Zap, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tecnologia PETG Duran® Alemã - Certificações ISO 13485, CE e ANVISA | Atma",
  description: "Conheça a tecnologia alemã por trás dos alinhadores Atma. Material PETG Duran® certificado, escaneamento 3D e IA para resultados precisos.",
}

export default function TecnologiaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white px-4 py-2">
            🇩🇪 Made in Germany
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Tecnologia PETG Duran® Alemã
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            O mesmo padrão de excelência das marcas premium internacionais,
            com preços brasileiros acessíveis
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/pacientes/agendar">
              Agendar Avaliação Gratuita
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Certificações */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Certificações Internacionais
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Award className="h-12 w-12 text-blue-600" />,
                title: "ISO 13485",
                description: "Certificação internacional para dispositivos médicos de grau hospitalar"
              },
              {
                icon: <Shield className="h-12 w-12 text-blue-600" />,
                title: "CE Mark",
                description: "Aprovação europeia para comercialização em toda União Europeia"
              },
              {
                icon: <Check className="h-12 w-12 text-blue-600" />,
                title: "ANVISA",
                description: "Regulamentado e aprovado pela Agência Nacional de Vigilância Sanitária"
              }
            ].map((cert, i) => (
              <Card key={i} className="text-center border-2 hover:border-blue-600 transition-colors">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    {cert.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{cert.title}</h3>
                  <p className="text-gray-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Material PETG */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <Image
                src="/assets/images/patients/alinhadores-transparentes-1000x667.jpg_0.webp"
                alt="Material PETG Duran alemão"
                width={600}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
                  PETG Duran® Medical Grade
                </h2>
                <p className="text-xl text-gray-600">
                  Material de grau médico fabricado na Alemanha, o mesmo usado pelas
                  marcas premium mundiais
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Biocompatível",
                    desc: "Seguro para contato prolongado com tecidos bucais, livre de BPA"
                  },
                  {
                    title: "Transparente",
                    desc: "Invisível a poucos centímetros, praticamente imperceptível"
                  },
                  {
                    title: "Resistente",
                    desc: "Não quebra facilmente, mantém forma e pressão constante"
                  },
                  {
                    title: "Higiênico",
                    desc: "Não absorve odores ou bactérias, fácil higienização"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processo de Fabricação */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Processo de Fabricação de Alta Precisão
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Escaneamento 3D",
                desc: "Scanner intraoral digital captura sua arcada com precisão milimétrica"
              },
              {
                step: "2",
                title: "Planejamento com IA",
                desc: "Inteligência artificial calcula movimento ideal dos dentes"
              },
              {
                step: "3",
                title: "Impressão 3D",
                desc: "Moldes personalizados criados com impressoras de alta resolução"
              },
              {
                step: "4",
                title: "Termoformação",
                desc: "PETG Duran® moldado sob temperatura e pressão controladas"
              }
            ].map((item, i) => (
              <Card key={i} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Tecnologia Mundial, Preço Brasileiro
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Experimente a qualidade alemã sem pagar preços internacionais
          </p>

          <Button size="lg" variant="secondary" className="text-xl px-12 py-8" asChild>
            <Link href="/pacientes/agendar">
              Agendar Consulta Gratuita
              <ChevronRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
