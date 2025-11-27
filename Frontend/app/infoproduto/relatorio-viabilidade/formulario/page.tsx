"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, ChevronLeft, FileText, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type FormData = {
  // Dados pessoais
  nome: string
  email: string
  telefone: string
  idade: string
  cidade: string
  estado: string

  // Questões ortodônticas
  objetivoPrincipal: string
  problemasAtuais: string[]
  jaUsouAparelho: string
  tempoDisponivel: string
  orcamentoRecebido: string
  preocupacaoEstetica: string
  problemasSaude: string[]

  // Expectativas e urgência
  expectativaResultado: string
  urgenciaTratamento: string
  disposicaoInvestimento: string
}

const initialFormData: FormData = {
  nome: "",
  email: "",
  telefone: "",
  idade: "",
  cidade: "",
  estado: "",
  objetivoPrincipal: "",
  problemasAtuais: [],
  jaUsouAparelho: "",
  tempoDisponivel: "",
  orcamentoRecebido: "",
  preocupacaoEstetica: "",
  problemasSaude: [],
  expectativaResultado: "",
  urgenciaTratamento: "",
  disposicaoInvestimento: ""
}

export default function FormularioPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const totalSteps = 4

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayField = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFormData(field, newArray)
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Salvar dados no localStorage (você pode trocar por API depois)
      localStorage.setItem('relatorio_form_data', JSON.stringify(formData))

      // Redirecionar para checkout
      router.push('/infoproduto/relatorio-viabilidade/checkout')
    } catch (error) {
      console.error('Erro ao processar:', error)
      alert('Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch(step) {
      case 1:
        return formData.nome && formData.email && formData.telefone && formData.idade && formData.cidade && formData.estado
      case 2:
        return formData.objetivoPrincipal && formData.problemasAtuais.length > 0 && formData.jaUsouAparelho
      case 3:
        return formData.tempoDisponivel && formData.orcamentoRecebido && formData.preocupacaoEstetica
      case 4:
        return formData.expectativaResultado && formData.urgenciaTratamento && formData.disposicaoInvestimento
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-blue-600 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Relatório de Viabilidade Personalizado
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Preencha Suas Informações
          </h1>
          <p className="text-gray-600">
            Quanto mais detalhes você fornecer, mais preciso será seu relatório
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Etapa {step} de {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Informações Básicas"}
              {step === 2 && "Sua Situação Ortodôntica"}
              {step === 3 && "Expectativas e Orçamento"}
              {step === 4 && "Finalização"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* STEP 1: Dados Pessoais */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="João da Silva"
                    value={formData.nome}
                    onChange={(e) => updateFormData('nome', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => updateFormData('telefone', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade *</Label>
                    <Input
                      id="idade"
                      type="number"
                      placeholder="32"
                      value={formData.idade}
                      onChange={(e) => updateFormData('idade', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Input
                      id="estado"
                      placeholder="SP"
                      maxLength={2}
                      value={formData.estado}
                      onChange={(e) => updateFormData('estado', e.target.value.toUpperCase())}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    placeholder="São Paulo"
                    value={formData.cidade}
                    onChange={(e) => updateFormData('cidade', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* STEP 2: Situação Ortodôntica */}
            {step === 2 && (
              <>
                <div className="space-y-3">
                  <Label>Qual seu objetivo principal? *</Label>
                  <RadioGroup value={formData.objetivoPrincipal} onValueChange={(value) => updateFormData('objetivoPrincipal', value)}>
                    {[
                      "Melhorar estética do sorriso",
                      "Corrigir mordida/mastigação",
                      "Alinhar dentes tortos",
                      "Fechar espaços entre dentes",
                      "Outro motivo"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Que problemas você percebe nos seus dentes? (marque todos) *</Label>
                  {[
                    "Dentes apinhados/amontoados",
                    "Dentes separados/espaçados",
                    "Dentes tortos",
                    "Mordida cruzada",
                    "Sobremordida (dentes superiores cobrem muito os inferiores)",
                    "Prognatismo (queixo para frente)",
                    "Nenhum problema visível"
                  ].map((problem) => (
                    <div key={problem} className="flex items-center space-x-2">
                      <Checkbox
                        id={problem}
                        checked={formData.problemasAtuais.includes(problem)}
                        onCheckedChange={() => toggleArrayField('problemasAtuais', problem)}
                      />
                      <Label htmlFor={problem} className="font-normal cursor-pointer">{problem}</Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label>Você já usou aparelho ortodôntico antes? *</Label>
                  <RadioGroup value={formData.jaUsouAparelho} onValueChange={(value) => updateFormData('jaUsouAparelho', value)}>
                    {[
                      "Não, nunca usei",
                      "Sim, aparelho fixo (com brackets)",
                      "Sim, alinhador invisível",
                      "Sim, mas não completei o tratamento"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Tem algum problema de saúde bucal ou geral? (marque todos)</Label>
                  {[
                    "Bruxismo (ranger dentes)",
                    "DTM/ATM (problemas na articulação)",
                    "Doença periodontal/gengival",
                    "Falta de dentes (extração anterior)",
                    "Implantes dentários",
                    "Nenhum problema de saúde"
                  ].map((problem) => (
                    <div key={problem} className="flex items-center space-x-2">
                      <Checkbox
                        id={problem}
                        checked={formData.problemasSaude.includes(problem)}
                        onCheckedChange={() => toggleArrayField('problemasSaude', problem)}
                      />
                      <Label htmlFor={problem} className="font-normal cursor-pointer">{problem}</Label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* STEP 3: Expectativas e Orçamento */}
            {step === 3 && (
              <>
                <div className="space-y-3">
                  <Label>Quanto tempo você espera para ver resultados? *</Label>
                  <RadioGroup value={formData.tempoDisponivel} onValueChange={(value) => updateFormData('tempoDisponivel', value)}>
                    {[
                      "Tenho pressa (3-6 meses)",
                      "Tempo normal (6-12 meses)",
                      "Não tenho pressa (12-18 meses)",
                      "Quanto tempo for necessário"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Você já recebeu algum orçamento? Se sim, qual valor? *</Label>
                  <RadioGroup value={formData.orcamentoRecebido} onValueChange={(value) => updateFormData('orcamentoRecebido', value)}>
                    {[
                      "Não recebi nenhum orçamento ainda",
                      "Até R$ 5.000",
                      "R$ 5.000 - R$ 10.000",
                      "R$ 10.000 - R$ 15.000",
                      "Acima de R$ 15.000"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Quão importante é a discrição/estética do aparelho? *</Label>
                  <RadioGroup value={formData.preocupacaoEstetica} onValueChange={(value) => updateFormData('preocupacaoEstetica', value)}>
                    {[
                      "Muito importante - Precisa ser invisível",
                      "Importante - Prefiro discreto",
                      "Pouco importante - Aceito aparelho visível",
                      "Não me importo com estética"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            {/* STEP 4: Finalização */}
            {step === 4 && (
              <>
                <div className="space-y-3">
                  <Label>Qual sua expectativa de resultado final? *</Label>
                  <RadioGroup value={formData.expectativaResultado} onValueChange={(value) => updateFormData('expectativaResultado', value)}>
                    {[
                      "Sorriso perfeito - Hollywood smile",
                      "Melhora significativa - 80-90% do ideal",
                      "Melhora moderada - Apenas o necessário",
                      "Qualquer melhora já está bom"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Qual a urgência do tratamento? *</Label>
                  <RadioGroup value={formData.urgenciaTratamento} onValueChange={(value) => updateFormData('urgenciaTratamento', value)}>
                    {[
                      "Urgente - Quero começar esta semana",
                      "Alta - Quero começar este mês",
                      "Moderada - Nos próximos 3 meses",
                      "Baixa - Apenas pesquisando por enquanto"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Quanto você está disposto a investir? *</Label>
                  <RadioGroup value={formData.disposicaoInvestimento} onValueChange={(value) => updateFormData('disposicaoInvestimento', value)}>
                    {[
                      "Até R$ 3.000",
                      "R$ 3.000 - R$ 6.000",
                      "R$ 6.000 - R$ 10.000",
                      "R$ 10.000 - R$ 15.000",
                      "Acima de R$ 15.000",
                      "Depende do resultado que vou ter"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Último passo!</strong> Após clicar em "Ir para Pagamento", você será redirecionado
                    para finalizar a compra do seu relatório personalizado por apenas <strong>R$ 47</strong>.
                  </p>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              )}

              {step < totalSteps ? (
                <Button
                  className="ml-auto"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed() || loading}
                >
                  Próximo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="ml-auto bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Ir para Pagamento
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Garantia */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <span className="text-2xl">🛡️</span>
            <span className="font-semibold">Garantia de 7 dias - 100% do dinheiro de volta</span>
          </div>
        </div>
      </div>
    </div>
  )
}
