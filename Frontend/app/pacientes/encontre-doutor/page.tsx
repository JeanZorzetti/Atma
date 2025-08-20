"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react"

export default function EncontreDoutor() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    consentimento: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria implementada a lógica de envio do formulário
    console.log("Formulário enviado:", formData)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-heading font-bold mb-4">Obrigado pelo seu interesse!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Recebemos sua solicitação e em breve um ortodontista parceiro da Atma Aligner entrará em contato para
                agendar sua avaliação.
              </p>
              <div className="bg-muted rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-2">Próximos passos:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• Você receberá um contato em até 24 horas</li>
                  <li>• Agendamento da consulta de avaliação</li>
                  <li>• Análise do seu caso específico</li>
                  <li>• Apresentação do plano de tratamento personalizado</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Dúvidas? Entre em contato conosco: <br />
                <strong>contato@atmaalign.com.br</strong> | <strong>(11) 9999-9999</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Encontre um doutor perto de você
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Preencha o formulário abaixo e conecte-se com um ortodontista parceiro da Atma Aligner na sua região
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Solicite sua avaliação gratuita</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      required
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", e.target.value)}
                      required
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP ou Cidade/Estado *</Label>
                    <Input
                      id="cep"
                      type="text"
                      value={formData.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      required
                      placeholder="01234-567 ou São Paulo, SP"
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consentimento"
                      checked={formData.consentimento}
                      onCheckedChange={(checked) => handleInputChange("consentimento", checked as boolean)}
                      required
                    />
                    <Label htmlFor="consentimento" className="text-sm leading-relaxed">
                      Li e concordo com a Política de Privacidade e autorizo o compartilhamento dos meus dados com um
                      ortodontista parceiro da Atma Aligner. *
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={!formData.consentimento}>
                    Encontrar ortodontista
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4">Como funciona?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Preencha o formulário</p>
                        <p className="text-sm text-muted-foreground">Informe seus dados e localização</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Receba o contato</p>
                        <p className="text-sm text-muted-foreground">Um ortodontista parceiro entrará em contato</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Agende sua consulta</p>
                        <p className="text-sm text-muted-foreground">Avaliação gratuita e plano personalizado</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4">Por que escolher um parceiro Atma Aligner?</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Ortodontistas certificados e experientes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Tecnologia de ponta em diagnóstico</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Acompanhamento personalizado</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>Melhores condições de financiamento</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4">Precisa de ajuda?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span className="text-sm">(11) 9999-9999</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="text-sm">contato@atmaalign.com.br</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-sm">Atendemos todo o Brasil</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
