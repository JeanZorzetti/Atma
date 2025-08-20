"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

export default function SejaParceiro() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Passo 1
    nome: "",
    clinica: "",
    cro: "",
    email: "",
    telefone: "",
    // Passo 2
    consultórios: "",
    scanner: "",
    scannerMarca: "",
    casosmes: "",
    // Passo 3
    interesse: "",
    // Passo 4
    mensagem: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulário enviado:", formData)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-heading font-bold mb-4">
                Obrigado pelo seu interesse, Dr. {formData.nome}!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Recebemos sua solicitação de parceria e nossa equipe comercial entrará em contato em até 24 horas para
                apresentar as melhores opções para sua clínica.
              </p>
              <div className="bg-muted rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-2">Próximos passos:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>• Análise do perfil da sua clínica</li>
                  <li>• Apresentação personalizada dos modelos de parceria</li>
                  <li>• Demonstração da tecnologia e software</li>
                  <li>• Proposta comercial customizada</li>
                  <li>• Suporte completo para implementação</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Dúvidas? Entre em contato conosco: <br />
                <strong>parceiros@atmaalign.com.br</strong> | <strong>(11) 9999-9999</strong>
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
              Seja um parceiro Atma Aligner
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Preencha o formulário abaixo e nossa equipe entrará em contato para apresentar as melhores opções de
              parceria para sua clínica
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && <div className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">Passo {currentStep} de 4</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-heading">
                {currentStep === 1 && "Informações de Contato"}
                {currentStep === 2 && "Perfil da Clínica"}
                {currentStep === 3 && "Interesse em Parceria"}
                {currentStep === 4 && "Mensagem Adicional"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Passo 1: Contato Básico */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          type="text"
                          value={formData.nome}
                          onChange={(e) => handleInputChange("nome", e.target.value)}
                          required
                          placeholder="Dr. João Silva"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clinica">Nome da Clínica *</Label>
                        <Input
                          id="clinica"
                          type="text"
                          value={formData.clinica}
                          onChange={(e) => handleInputChange("clinica", e.target.value)}
                          required
                          placeholder="Clínica Odontológica Silva"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cro">Número do CRO *</Label>
                      <Input
                        id="cro"
                        type="text"
                        value={formData.cro}
                        onChange={(e) => handleInputChange("cro", e.target.value)}
                        required
                        placeholder="CRO-SP 12345"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          placeholder="dr.joao@clinica.com.br"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone *</Label>
                        <Input
                          id="telefone"
                          type="tel"
                          value={formData.telefone}
                          onChange={(e) => handleInputChange("telefone", e.target.value)}
                          required
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Passo 2: Perfil da Clínica */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="consultórios">Número de consultórios *</Label>
                      <Select
                        value={formData.consultórios}
                        onValueChange={(value) => handleInputChange("consultórios", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 consultório</SelectItem>
                          <SelectItem value="2-3">2-3 consultórios</SelectItem>
                          <SelectItem value="4-5">4-5 consultórios</SelectItem>
                          <SelectItem value="6+">6+ consultórios</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scanner">Possui scanner intraoral? *</Label>
                      <Select value={formData.scanner} onValueChange={(value) => handleInputChange("scanner", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.scanner === "sim" && (
                      <div className="space-y-2">
                        <Label htmlFor="scannerMarca">Qual marca do scanner?</Label>
                        <Input
                          id="scannerMarca"
                          type="text"
                          value={formData.scannerMarca}
                          onChange={(e) => handleInputChange("scannerMarca", e.target.value)}
                          placeholder="Ex: 3Shape, iTero, Medit"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="casosmes">Número médio de casos ortodônticos iniciados por mês *</Label>
                      <Select value={formData.casosmes} onValueChange={(value) => handleInputChange("casosmes", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 casos</SelectItem>
                          <SelectItem value="6-10">6-10 casos</SelectItem>
                          <SelectItem value="11-20">11-20 casos</SelectItem>
                          <SelectItem value="21+">21+ casos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Passo 3: Interesse */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="interesse">Qual modelo de parceria mais lhe interessa? *</Label>
                      <Select
                        value={formData.interesse}
                        onValueChange={(value) => handleInputChange("interesse", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="atma-align">Atma Aligner - Marca Própria</SelectItem>
                          <SelectItem value="atma-labs">Atma Labs - White Label</SelectItem>
                          <SelectItem value="ambos">Gostaria de saber mais sobre ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-muted rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Resumo dos modelos:</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-primary mb-2">Atma Aligner</h4>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Marca própria completa</li>
                            <li>• Suporte de marketing</li>
                            <li>• Geração de leads</li>
                            <li>• Material promocional</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-secondary mb-2">Atma Labs</h4>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• White-label flexível</li>
                            <li>• Sua própria marca</li>
                            <li>• Controle de preços</li>
                            <li>• Máxima margem</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Passo 4: Mensagem */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem adicional (opcional)</Label>
                      <Textarea
                        id="mensagem"
                        value={formData.mensagem}
                        onChange={(e) => handleInputChange("mensagem", e.target.value)}
                        placeholder="Conte-nos mais sobre sua clínica, expectativas ou dúvidas específicas..."
                        rows={6}
                      />
                    </div>
                    <div className="bg-primary/5 rounded-lg p-6">
                      <h3 className="font-semibold mb-2">Resumo da sua solicitação:</h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Nome:</strong> {formData.nome}
                        </p>
                        <p>
                          <strong>Clínica:</strong> {formData.clinica}
                        </p>
                        <p>
                          <strong>CRO:</strong> {formData.cro}
                        </p>
                        <p>
                          <strong>Consultórios:</strong> {formData.consultórios}
                        </p>
                        <p>
                          <strong>Scanner:</strong>{" "}
                          {formData.scanner === "sim" ? `Sim - ${formData.scannerMarca}` : "Não"}
                        </p>
                        <p>
                          <strong>Casos/mês:</strong> {formData.casosmes}
                        </p>
                        <p>
                          <strong>Interesse:</strong> {formData.interesse}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>

                  {currentStep < 4 ? (
                    <Button type="button" onClick={nextStep}>
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit">Enviar solicitação</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
