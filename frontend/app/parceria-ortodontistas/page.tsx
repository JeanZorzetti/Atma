import type { Metadata } from "next"
import Image from "next/image"
import { CheckCircle2, Clock, FileText, Package, DollarSign, Handshake } from "lucide-react"

export const metadata: Metadata = {
  title: "Parceria para Ortodontistas | Atma Aligner",
  description: "Seja parceiro Atma Aligner e ofereça alinhadores invisíveis premium aos seus pacientes com tecnologia alemã e preço 50% menor.",
  robots: {
    index: false, // Página não indexável
    follow: false,
  }
}

export default function ParceriaOrtodontistasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/assets/logos/atma/Atma.png"
              alt="Atma Aligner"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <div className="h-8 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">
              Parceria para Ortodontistas
            </h1>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Como Funciona a Parceria
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Processo simples, rápido e sem burocracias. Comece a oferecer alinhadores invisíveis premium aos seus pacientes hoje mesmo.
          </p>
        </div>

        {/* Fluxo em Cards */}
        <div className="grid gap-6 mb-12">
          {/* Passo 1 */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Indicação de Pacientes</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Imediato
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Recebemos cadastros de pacientes interessados pelo nosso site</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Localizamos o ortodontista parceiro mais próximo da região do paciente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Enviamos os dados do paciente direto para você (nome, WhatsApp, email)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Avaliação Inicial</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    No seu consultório
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Você agenda e avalia o paciente presencialmente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Solicita os mesmos exames de um aparelho fixo + escaneamento 3D</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Caso não tenha scanner intraoral, encaminhe para clínica de exames de imagem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Arquivo necessário: STL (escaneamento digital)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Planejamento Digital</h3>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    24 horas
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Você envia os exames e arquivo STL para a Atma</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Nossa equipe técnica faz a modelagem 3D completa do caso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Elaboramos o planejamento ortodôntico com setup virtual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>Geramos o orçamento da nossa parte e enviamos para você</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Passo 4 */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  4
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Aprovação e Precificação</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Você decide
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Você recebe e aprova o planejamento digital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Definimos o valor da nossa parte (exemplo: R$ 2.500 para 25 placas)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="font-bold">Você aplica 100% de markup (valor final: R$ 5.000 para o paciente)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Você apresenta o plano de tratamento e orçamento ao paciente</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Passo 5 */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  5
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Produção e Entrega</h3>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    5 dias úteis
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Paciente aprova e paga para você (PIX ou cartão de crédito parcelado)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Você repassa nossa parte (PIX ou cartão de crédito parcelado)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Fabricamos os alinhadores com tecnologia alemã premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Enviamos o kit completo direto para o seu consultório</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Passo 6 */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  6
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Acompanhamento</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full flex items-center gap-1">
                    <Handshake className="w-4 h-4" />
                    Contínuo
                  </span>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Você conduz o tratamento do paciente do início ao fim</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="font-bold">Todo tratamento inclui 2 refinamentos de placas sem custo adicional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Suporte técnico Atma disponível sempre que precisar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Você mantém 100% do relacionamento e fidelização do paciente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Após o primeiro caso faturado, formalizamos a parceria</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white mb-12">
          <h3 className="text-3xl font-bold text-center mb-8">Por que ser parceiro Atma?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg mb-2">Zero Investimento Inicial</h4>
              <p className="text-purple-100">Sem taxa de setup, sem mensalidade, sem burocracia</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg mb-2">Tecnologia Premium</h4>
              <p className="text-purple-100">Alinhadores com padrão alemão de qualidade</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg mb-4">Suporte Completo</h4>
              <p className="text-purple-100">Equipe técnica à disposição em todas as etapas</p>
            </div>
          </div>
        </div>

        {/* Timeline resumido */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Linha do Tempo Resumida</h3>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-32 font-semibold text-gray-700">Indicação</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-purple-500 to-purple-400 rounded"></div>
                <span className="flex-shrink-0 w-24 text-sm text-gray-600 text-right">Imediato</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-32 font-semibold text-gray-700">Avaliação</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded"></div>
                <span className="flex-shrink-0 w-24 text-sm text-gray-600 text-right">1-7 dias</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-32 font-semibold text-gray-700">Planejamento</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded"></div>
                <span className="flex-shrink-0 w-24 text-sm text-gray-600 text-right">24 horas</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-32 font-semibold text-gray-700">Aprovação</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded"></div>
                <span className="flex-shrink-0 w-24 text-sm text-gray-600 text-right">1-3 dias</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-32 font-semibold text-gray-700">Produção</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-amber-500 to-amber-400 rounded"></div>
                <span className="flex-shrink-0 w-24 text-sm text-gray-600 text-right">5 dias úteis</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-32 font-semibold text-gray-700">Tratamento</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-purple-500 to-purple-400 rounded"></div>
                <span className="flex-shrink-0 w-24 text-sm text-gray-600 text-right">6-18 meses</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              * Timeline média considerando aprovações e agendamentos normais
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-600">
          <p className="mb-2">
            <strong className="text-gray-900">Atma Aligner</strong> - Alinhadores Invisíveis com Tecnologia Alemã
          </p>
          <p className="text-sm">
            Parceria simples, transparente e rentável para ortodontistas
          </p>
        </div>
      </div>
    </div>
  )
}
