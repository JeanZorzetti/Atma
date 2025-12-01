'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Microscope,
  Play,
  ChevronRight,
  Info,
  Zap,
  Clock,
  DollarSign,
  Shield,
} from 'lucide-react'

// Comparação Atma vs Tradicional
const comparacoes = [
  {
    categoria: 'Estética',
    atma: { texto: 'Praticamente invisível', nota: 10, icone: CheckCircle2, cor: 'text-green-600' },
    tradicional: { texto: 'Aparelho metálico visível', nota: 3, icone: XCircle, cor: 'text-red-600' },
  },
  {
    categoria: 'Conforto',
    atma: { texto: 'Sem fios ou brackets', nota: 9, icone: CheckCircle2, cor: 'text-green-600' },
    tradicional: { texto: 'Pode causar feridas', nota: 4, icone: XCircle, cor: 'text-red-600' },
  },
  {
    categoria: 'Higiene',
    atma: { texto: 'Remove para escovar', nota: 10, icone: CheckCircle2, cor: 'text-green-600' },
    tradicional: { texto: 'Dificulta escovação', nota: 5, icone: XCircle, cor: 'text-red-600' },
  },
  {
    categoria: 'Alimentação',
    atma: { texto: 'Come tudo normalmente', nota: 10, icone: CheckCircle2, cor: 'text-green-600' },
    tradicional: { texto: 'Restrições alimentares', nota: 4, icone: XCircle, cor: 'text-red-600' },
  },
  {
    categoria: 'Previsibilidade',
    atma: { texto: 'Planejamento digital 3D', nota: 9, icone: CheckCircle2, cor: 'text-green-600' },
    tradicional: { texto: 'Resultado menos previsível', nota: 6, icone: XCircle, cor: 'text-amber-600' },
  },
  {
    categoria: 'Emergências',
    atma: { texto: 'Sem quebras ou urgências', nota: 10, icone: CheckCircle2, cor: 'text-green-600' },
    tradicional: { texto: 'Possíveis quebras de bracket', nota: 5, icone: XCircle, cor: 'text-red-600' },
  },
]

// Vantagens do Atma Aligner
const vantagens = [
  {
    icone: Sparkles,
    titulo: 'Tecnologia 3D Avançada',
    descricao: 'Escaneamento digital 3D de alta precisão elimina moldes tradicionais desconfortáveis.',
    cor: 'blue',
  },
  {
    icone: Zap,
    titulo: 'Tratamento Personalizado',
    descricao: 'Cada alinhador é fabricado exclusivamente para você usando impressão 3D de última geração.',
    cor: 'purple',
  },
  {
    icone: Clock,
    titulo: 'Menos Consultas',
    descricao: 'Troque os alinhadores em casa a cada 2 semanas, com check-ups apenas a cada 6-8 semanas.',
    cor: 'cyan',
  },
  {
    icone: DollarSign,
    titulo: 'Melhor Custo-Benefício',
    descricao: 'Preço até 60% menor que alinhadores importados, com a mesma qualidade e tecnologia.',
    cor: 'green',
  },
  {
    icone: Shield,
    titulo: 'Seguro e Aprovado',
    descricao: 'Tecnologia aprovada pela ANVISA e validada por milhares de casos de sucesso no Brasil.',
    cor: 'amber',
  },
  {
    icone: TrendingUp,
    titulo: 'Resultados Previsíveis',
    descricao: 'Visualize o resultado final antes mesmo de começar através de simulação 3D do tratamento.',
    cor: 'pink',
  },
]

// Processo do tratamento (infográfico)
const etapasProcesso = [
  {
    numero: 1,
    titulo: 'Escaneamento 3D',
    descricao: 'Captura digital precisa dos seus dentes sem moldes desconfortáveis',
    icone: '🦷',
  },
  {
    numero: 2,
    titulo: 'Planejamento Virtual',
    descricao: 'Ortodontista cria plano de tratamento personalizado com simulação 3D',
    icone: '💻',
  },
  {
    numero: 3,
    titulo: 'Fabricação Customizada',
    descricao: 'Alinhadores impressos em 3D especificamente para seu caso',
    icone: '🏭',
  },
  {
    numero: 4,
    titulo: 'Tratamento em Casa',
    descricao: 'Troca de alinhadores a cada 2 semanas conforme o planejamento',
    icone: '🏠',
  },
  {
    numero: 5,
    titulo: 'Acompanhamento Remoto',
    descricao: 'Monitoramento online com fotos e check-ups presenciais trimestrais',
    icone: '📱',
  },
  {
    numero: 6,
    titulo: 'Sorriso Perfeito',
    descricao: 'Resultado final alcançado com contenções para manutenção',
    icone: '✨',
  },
]

// FAQs científicas
const faqsCiencia = [
  {
    pergunta: 'Como os alinhadores movem os dentes?',
    resposta:
      'Os alinhadores transparentes aplicam forças leves e controladas sobre os dentes. Cada alinhador é projetado para mover os dentes cerca de 0,25mm por vez. A pressão contínua estimula a remodelação óssea, permitindo que os dentes se movam gradualmente para a posição desejada através de um processo biológico natural chamado reabsorção e aposição óssea.',
  },
  {
    pergunta: 'Qual é a base científica dos alinhadores ortodônticos?',
    resposta:
      'A tecnologia de alinhadores é baseada nos mesmos princípios biomecânicos dos aparelhos tradicionais, mas com maior precisão. Estudos publicados em revistas científicas como o American Journal of Orthodontics and Dentofacial Orthopedics demonstram eficácia comparável aos aparelhos fixos para a maioria dos casos ortodônticos, com vantagens em conforto e estética.',
  },
  {
    pergunta: 'O material dos alinhadores é seguro?',
    resposta:
      'Sim. Os alinhadores Atma são fabricados com polímero termoplástico de grau médico (poliuretano ou SmartTrack), livre de BPA, BPS, látex e glúten. O material é biocompatível, aprovado pela ANVISA e FDA, e testado extensivamente para uso intraoral prolongado.',
  },
  {
    pergunta: 'Por quanto tempo devo usar os alinhadores por dia?',
    resposta:
      'Para resultados ótimos, os alinhadores devem ser usados 22 horas por dia (removendo apenas para comer e higienizar). Estudos clínicos mostram que o uso inferior a 20 horas/dia pode comprometer significativamente o resultado e prolongar o tratamento.',
  },
  {
    pergunta: 'Quais casos podem ser tratados com alinhadores?',
    resposta:
      'A tecnologia atual permite tratar a maioria dos casos ortodônticos: apinhamento leve a moderado, diastemas, mordida cruzada, sobremordida, mordida aberta e casos de recidiva pós-tratamento. Casos muito complexos podem requerer aparelhos híbridos ou tratamento tradicional, conforme avaliação do ortodontista.',
  },
]

// Certificações e aprovações
const certificacoes = [
  { nome: 'ANVISA', descricao: 'Aprovado pela Agência Nacional de Vigilância Sanitária' },
  { nome: 'ISO 13485', descricao: 'Certificação internacional de qualidade médica' },
  { nome: 'CFO', descricao: 'Reconhecido pelo Conselho Federal de Odontologia' },
  { nome: 'Inmetro', descricao: 'Produtos certificados e testados' },
]

// Vídeos educativos (YouTube embeds)
const videos = [
  {
    id: 'dQw4w9WgXcQ', // Substituir pelos IDs reais dos vídeos
    titulo: 'Como Funcionam os Alinhadores Atma',
    duracao: '3:45',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  },
  {
    id: 'dQw4w9WgXcQ',
    titulo: 'Ciência por Trás do Movimento Dentário',
    duracao: '5:20',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  },
  {
    id: 'dQw4w9WgXcQ',
    titulo: 'Processo de Fabricação 3D',
    duracao: '4:15',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  },
]

export default function TecnologiaPage() {
  const [videoSelecionado, setVideoSelecionado] = useState<string | null>(null)

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tecnologia Atma Aligner</h1>
        <p className="text-gray-600 mt-2">
          Conheça a ciência e inovação por trás do seu tratamento ortodôntico
        </p>
      </div>

      {/* Hero Card - Sobre o Atma */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Cpu className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                O que é o Atma Aligner?
              </h2>
              <p className="text-gray-700 mb-4">
                O Atma Aligner é um sistema brasileiro de alinhadores ortodônticos invisíveis
                que utiliza tecnologia 3D de ponta para oferecer tratamento ortodôntico de
                alta qualidade, acessível e confortável. Desenvolvido por especialistas
                brasileiros, combina o melhor da engenharia, odontologia digital e ciência
                dos materiais.
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>100% Nacional</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Tecnologia 3D</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Aprovado ANVISA</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Infográfico: Processo do Tratamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Como Funciona o Processo
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Do escaneamento até o sorriso perfeito: entenda cada etapa
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {etapasProcesso.map((etapa, index) => (
              <div key={etapa.numero} className="relative">
                {/* Seta conectora (apenas desktop) */}
                {index < etapasProcesso.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-3 z-0">
                    <ChevronRight className="h-6 w-6 text-blue-300" />
                  </div>
                )}

                <div className="relative bg-white border-2 border-blue-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                  {/* Número da etapa */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {etapa.numero}
                  </div>

                  {/* Ícone emoji */}
                  <div className="text-4xl mb-3 text-center">{etapa.icone}</div>

                  {/* Conteúdo */}
                  <h3 className="font-semibold text-gray-900 text-center mb-2">
                    {etapa.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">{etapa.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vantagens do Atma */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Por Que Escolher Atma?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vantagens.map((vantagem, index) => {
            const Icon = vantagem.icone
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 bg-${vantagem.cor}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 text-${vantagem.cor}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {vantagem.titulo}
                      </h3>
                      <p className="text-sm text-gray-600">{vantagem.descricao}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Comparação: Atma vs Tradicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Atma Aligner vs Aparelho Tradicional
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Veja as vantagens dos alinhadores invisíveis sobre métodos convencionais
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparacoes.map((comp, index) => {
              const IconAtma = comp.atma.icone
              const IconTrad = comp.tradicional.icone

              return (
                <div
                  key={index}
                  className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  {/* Categoria */}
                  <div className="flex items-center">
                    <h4 className="font-semibold text-gray-900">{comp.categoria}</h4>
                  </div>

                  {/* Atma */}
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <IconAtma className={`h-5 w-5 ${comp.atma.cor} flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Atma Aligner
                      </div>
                      <div className="text-xs text-gray-600">{comp.atma.texto}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {comp.atma.nota}/10
                    </Badge>
                  </div>

                  {/* Tradicional */}
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-300">
                    <IconTrad className={`h-5 w-5 ${comp.tradicional.cor} flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Tradicional
                      </div>
                      <div className="text-xs text-gray-600">{comp.tradicional.texto}</div>
                    </div>
                    <Badge variant="outline">
                      {comp.tradicional.nota}/10
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong>Importante:</strong> A escolha do método ortodôntico deve ser feita
                em conjunto com seu ortodontista, considerando a complexidade do caso e suas
                preferências pessoais.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vídeos Explicativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-600" />
            Vídeos Explicativos
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Entenda melhor a tecnologia através de conteúdo visual
          </p>
        </CardHeader>
        <CardContent>
          {videoSelecionado ? (
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoSelecionado}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <button
                onClick={() => setVideoSelecionado(null)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ← Voltar para lista de vídeos
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => setVideoSelecionado(video.id)}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                    <img
                      src={video.thumbnail}
                      alt={video.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duracao}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {video.titulo}
                  </h4>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ciência por Trás */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-5 w-5 text-blue-600" />
            A Ciência por Trás dos Alinhadores
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Perguntas frequentes com base científica
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqsCiencia.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.pergunta}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">{faq.resposta}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Certificações */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Certificações e Aprovações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {certificacoes.map((cert, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{cert.nome}</h4>
                <p className="text-xs text-gray-600">{cert.descricao}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong>Garantia de Qualidade:</strong> Todos os alinhadores Atma passam por
                rigoroso controle de qualidade e seguem protocolos internacionais de
                fabricação de dispositivos médicos.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
