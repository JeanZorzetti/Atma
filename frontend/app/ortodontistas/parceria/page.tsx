"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, TrendingUp, Users, Zap, ChevronRight, Phone, Mail, MapPin } from "lucide-react"

export default function ParceriaPage() {
  const [formData, setFormData] = useState({
    nome: "",
    cro: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
    clinica: "",
    pacientesMes: "",
    experiencia: "",
    mensagem: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar envio do formulário
    console.log("Formulário enviado:", formData)
    alert("Obrigado pelo interesse! Entraremos em contato em breve.")
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white px-4 py-2">
              Para Ortodontistas
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Seja um Parceiro Atma
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Junte-se a <strong>500+ ortodontistas</strong> que já aumentaram sua receita
              em até <strong>60%</strong> com tecnologia premium e margens atrativas
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { value: "500+", label: "Parceiros" },
                { value: "15.000+", label: "Pacientes Atendidos" },
                { value: "60%", label: "Aumento Médio de Receita" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-6">
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            Por Que Ser Parceiro Atma?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <TrendingUp className="h-12 w-12 text-emerald-600" />,
                title: "Margens Atrativas",
                description: "Lucre mais que com laboratórios tradicionais. Preço competitivo mantendo qualidade premium."
              },
              {
                icon: <Zap className="h-12 w-12 text-emerald-600" />,
                title: "Estoque Zero",
                description: "Produção sob demanda. Sem investimento inicial em equipamentos ou estoque."
              },
              {
                icon: <Users className="h-12 w-12 text-emerald-600" />,
                title: "Suporte Completo",
                description: "Treinamento técnico, material de marketing e atendimento dedicado."
              }
            ].map((benefit, i) => (
              <Card key={i} className="text-center hover:shadow-xl transition-shadow border-2 hover:border-emerald-600">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* O Que Oferecemos */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-12 text-center">
            O Que Você Recebe Como Parceiro
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Acesso à plataforma de planejamento 3D com IA",
              "Material de marketing personalizado (redes sociais, banners, folders)",
              "Treinamento completo em ortodontia com alinhadores",
              "Suporte técnico dedicado via WhatsApp",
              "Scanner intraoral (locação ou compra facilitada)",
              "Certificado digital de parceiro Atma",
              "Leads qualificados de pacientes na sua região",
              "Webinars mensais com cases de sucesso",
              "Grupo exclusivo com outros ortodontistas parceiros",
              "Desconto progressivo conforme volume de casos"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Candidate-se Para Ser Parceiro
            </h2>
            <p className="text-xl text-gray-600">
              Preencha o formulário e nossa equipe entrará em contato em até 24h
            </p>
          </div>

          <Card className="border-2 shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cro">CRO *</Label>
                    <Input
                      id="cro"
                      required
                      placeholder="Ex: CRO-SP 12345"
                      value={formData.cro}
                      onChange={(e) => setFormData({...formData, cro: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail Profissional *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      required
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      required
                      value={formData.cidade}
                      onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((uf) => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinica">Nome da Clínica</Label>
                  <Input
                    id="clinica"
                    value={formData.clinica}
                    onChange={(e) => setFormData({...formData, clinica: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pacientesMes">Quantos pacientes você atende por mês? *</Label>
                  <Select value={formData.pacientesMes} onValueChange={(value) => setFormData({...formData, pacientesMes: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-20">0-20 pacientes</SelectItem>
                      <SelectItem value="21-50">21-50 pacientes</SelectItem>
                      <SelectItem value="51-100">51-100 pacientes</SelectItem>
                      <SelectItem value="100+">Mais de 100 pacientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experiencia">Você já trabalha com alinhadores invisíveis? *</Label>
                  <Select value={formData.experiencia} onValueChange={(value) => setFormData({...formData, experiencia: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao">Não, mas tenho interesse</SelectItem>
                      <SelectItem value="iniciante">Sim, iniciante (1-10 casos)</SelectItem>
                      <SelectItem value="intermediario">Sim, intermediário (11-50 casos)</SelectItem>
                      <SelectItem value="avancado">Sim, avançado (50+ casos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem (opcional)</Label>
                  <Textarea
                    id="mensagem"
                    rows={4}
                    placeholder="Conte mais sobre seu interesse em ser parceiro Atma..."
                    value={formData.mensagem}
                    onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg py-6 bg-emerald-600 hover:bg-emerald-700">
                  Enviar Candidatura
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contato Direto */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-6">Prefere Falar Diretamente?</h3>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6" />
              <span className="text-lg">(47) 9200-0924</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6" />
              <span className="text-lg">parceiros@atma.com.br</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
