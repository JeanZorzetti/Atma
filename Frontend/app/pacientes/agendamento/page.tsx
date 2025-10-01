"use client"

/**
 * Página de Agendamento Cognitivamente Otimizada
 * FASE 2.3 - Exemplo completo de UX Cognitivo Avançado
 */

import { ProgressiveDisclosure, TreatmentInfoDisclosure } from '@/components/cognitive/progressive-disclosure'
import { ContextHelp, InlineHelp } from '@/components/cognitive/context-help'
import { MedicalTerm, GlossaryButton } from '@/components/cognitive/medical-glossary'
import { SmartForm } from '@/components/cognitive/smart-form'
import { useClarityTest } from '@/hooks/use-ab-test'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, User } from 'lucide-react'

export default function AgendamentoPage() {
  const { getTerm, trackConversion, trackComprehension } = useClarityTest()

  const formFields = [
    {
      name: 'nome',
      label: 'Nome completo',
      type: 'text' as const,
      required: true,
      placeholder: 'João Silva',
      help: 'Informe seu nome completo como consta no documento',
      example: 'Maria da Silva Santos'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      placeholder: 'seu@email.com',
      help: 'Usaremos este email para enviar confirmação',
      validation: 'email@exemplo.com'
    },
    {
      name: 'telefone',
      label: 'Telefone/WhatsApp',
      type: 'tel' as const,
      required: true,
      placeholder: '(11) 99999-9999',
      help: 'Entraremos em contato para confirmar',
      validation: '(11) 99999-9999'
    },
    {
      name: 'cidade',
      label: 'Cidade',
      type: 'select' as const,
      required: true,
      help: 'Selecione a cidade mais próxima',
      options: [
        { value: 'passo-fundo', label: 'Passo Fundo - RS' },
        { value: 'porto-alegre', label: 'Porto Alegre - RS' },
        { value: 'caxias', label: 'Caxias do Sul - RS' },
        { value: 'santa-maria', label: 'Santa Maria - RS' }
      ]
    },
    {
      name: 'preferencia',
      label: 'Preferência de horário',
      type: 'select' as const,
      dependsOn: 'cidade',
      help: 'Quando você prefere ser atendido?',
      options: [
        { value: 'manha', label: 'Manhã (8h - 12h)' },
        { value: 'tarde', label: 'Tarde (13h - 18h)' },
        { value: 'noite', label: 'Noite (18h - 20h)' }
      ]
    },
    {
      name: 'motivo',
      label: 'Qual o motivo da consulta?',
      type: 'select' as const,
      dependsOn: 'preferencia',
      help: 'Isso nos ajuda a preparar melhor o atendimento',
      options: [
        { value: 'avaliacao', label: 'Avaliação inicial para alinhadores' },
        { value: 'duvidas', label: 'Tirar dúvidas sobre tratamento' },
        { value: 'orcamento', label: 'Solicitar orçamento' },
        { value: 'outro', label: 'Outro motivo' }
      ]
    },
    {
      name: 'observacoes',
      label: 'Observações (opcional)',
      type: 'textarea' as const,
      dependsOn: 'motivo',
      placeholder: 'Alguma informação adicional que gostaria de compartilhar?',
      help: 'Campo opcional para informações extras'
    }
  ]

  const handleSubmit = async (data: Record<string, string>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Form submitted:', data)
    trackConversion()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header com Glossário */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Agende sua Consulta
            </h1>
            <p className="text-lg text-slate-600">
              Comece sua jornada para um sorriso perfeito
            </p>
          </div>
          <GlossaryButton />
        </div>

        {/* Information Section com Progressive Disclosure */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* O que esperar */}
          <ProgressiveDisclosure
            title="O que esperar na primeira consulta"
            basicContent={
              <div className="space-y-3">
                <p>Na primeira consulta, você conhecerá nosso ortodontista e receberá uma avaliação completa.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Duração: aproximadamente 1 hora</span>
                  </li>
                  <li className="flex items-start">
                    <User className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Sem compromisso de iniciar tratamento</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Resultado imediato: saberá se é candidato</span>
                  </li>
                </ul>
              </div>
            }
            detailedContent={
              <div className="space-y-4">
                <h4 className="font-semibold">Etapas da consulta:</h4>
                <ol className="space-y-3 list-decimal list-inside">
                  <li>
                    <strong>Anamnese (10 min)</strong> - Conversa inicial sobre histórico dental
                    <ContextHelp
                      context="anamnese-info"
                      title="O que é Anamnese?"
                      content="É uma conversa onde o dentista conhece seu histórico de saúde bucal, tratamentos anteriores e suas expectativas."
                      type="info"
                      position="right"
                      triggerMode="hover"
                      className="ml-2"
                    />
                  </li>
                  <li>
                    <strong>Exame Clínico (20 min)</strong> - Avaliação detalhada da sua{' '}
                    <MedicalTerm term="má oclusão" />
                  </li>
                  <li>
                    <strong>Documentação (20 min)</strong> - Fotos e escaneamento digital 3D
                  </li>
                  <li>
                    <strong>Plano de Tratamento (10 min)</strong> - Apresentação de opções e valores
                  </li>
                </ol>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-sm text-green-900">
                    <strong>Dica:</strong> Traga suas dúvidas anotadas para não esquecer nada!
                  </p>
                </div>
              </div>
            }
          />

          {/* Informação sobre Tratamento */}
          <TreatmentInfoDisclosure
            treatmentName={getTerm('Alinhadores Ortodônticos', 'Aparelho Transparente')}
          />
        </div>

        {/* Smart Form com Cognitive Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <SmartForm
            formId="agendamento-consulta"
            title="Preencha seus dados"
            description="As informações são confidenciais e usadas apenas para agendamento"
            fields={formFields}
            onSubmit={handleSubmit}
            submitLabel="Confirmar Agendamento"
          />
        </motion.div>

        {/* FAQ Rápido */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Onde ficamos?
            </h3>
            <p className="text-sm text-blue-800">
              Temos unidades em várias cidades do RS.{' '}
              <InlineHelp
                term="Ver mapa"
                definition="Após agendar, enviaremos o endereço exato da unidade escolhida"
              />
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Preciso levar algo?
            </h3>
            <p className="text-sm text-green-800">
              Apenas documento com foto. Radiografias antigas ajudam mas não são obrigatórias.
            </p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Posso remarcar?
            </h3>
            <p className="text-sm text-purple-800">
              Sim! Entre em contato com até 24h de antecedência.{' '}
              <InlineHelp
                term="Como remarcar?"
                definition="Basta responder o email de confirmação ou ligar para o número fornecido"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
