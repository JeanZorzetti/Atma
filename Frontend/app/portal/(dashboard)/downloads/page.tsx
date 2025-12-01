'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Download,
  FileText,
  Share2,
  QrCode,
  Mail,
  Link as LinkIcon,
  CheckCircle2,
  Loader2,
  FileCheck,
  Image,
  Package,
  Copy,
  ExternalLink,
} from 'lucide-react'

// Materiais disponíveis para download
interface Material {
  id: string
  titulo: string
  descricao: string
  tipo: 'pdf' | 'png' | 'jpg'
  tamanho: string
  icone: any
  cor: string
}

const materiais: Material[] = [
  {
    id: 'relatorio-completo',
    titulo: 'Relatório Completo de Viabilidade',
    descricao: 'PDF com análise detalhada do seu caso, score, custos e timeline',
    tipo: 'pdf',
    tamanho: '2.3 MB',
    icone: FileText,
    cor: 'blue',
  },
  {
    id: 'guia-cuidados',
    titulo: 'Guia de Cuidados com Alinhadores',
    descricao: 'Manual completo de limpeza, manutenção e boas práticas',
    tipo: 'pdf',
    tamanho: '1.1 MB',
    icone: FileCheck,
    cor: 'green',
  },
  {
    id: 'checklist',
    titulo: 'Checklist de Preparação',
    descricao: 'Lista de ações antes, durante e depois do tratamento',
    tipo: 'pdf',
    tamanho: '0.8 MB',
    icone: CheckCircle2,
    cor: 'purple',
  },
  {
    id: 'cartao-perguntas',
    titulo: 'Cartão de Perguntas',
    descricao: 'Imagem com perguntas essenciais para o ortodontista',
    tipo: 'png',
    tamanho: '0.5 MB',
    icone: Image,
    cor: 'cyan',
  },
]

export default function DownloadsPage() {
  const [gerando, setGerando] = useState(false)
  const [progresso, setProgresso] = useState(0)
  const [linkGerado, setLinkGerado] = useState<string | null>(null)
  const [qrCodeVisivel, setQrCodeVisivel] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState(false)

  // Simular geração de PDF
  const gerarPDF = async () => {
    setGerando(true)
    setProgresso(0)

    // Simular progresso
    const interval = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setGerando(false)
          // Aqui você implementaria a geração real do PDF
          // window.open('/api/gerar-pdf?relatorio_id=123', '_blank')
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Gerar link de compartilhamento
  const gerarLinkCompartilhamento = () => {
    // Em produção, esse link seria gerado pelo backend com token único
    const link = `https://atma.roilabs.com.br/relatorio/compartilhado/${Math.random().toString(36).substring(7)}`
    setLinkGerado(link)
  }

  // Copiar link
  const copiarLink = async () => {
    if (linkGerado) {
      await navigator.clipboard.writeText(linkGerado)
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 2000)
    }
  }

  // Enviar por email
  const enviarPorEmail = () => {
    const assunto = encodeURIComponent('Meu Relatório de Viabilidade Atma Aligner')
    const corpo = encodeURIComponent(
      `Olá!\n\nCompartilho com você meu relatório de viabilidade para tratamento ortodôntico com Atma Aligner.\n\nAcesse: ${linkGerado}\n\nAtenciosamente`
    )
    window.location.href = `mailto:?subject=${assunto}&body=${corpo}`
  }

  // Baixar material
  const baixarMaterial = (materialId: string) => {
    // Em produção, isso faria download real do arquivo
    console.log(`Baixando material: ${materialId}`)
    // window.open(`/api/download/${materialId}`, '_blank')
  }

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Downloads e Compartilhamento</h1>
        <p className="text-gray-600 mt-2">
          Baixe seu relatório e materiais complementares
        </p>
      </div>

      {/* Gerador de PDF Principal */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Relatório Completo em PDF
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Gere e baixe a versão completa do seu relatório de viabilidade
          </p>
        </CardHeader>
        <CardContent>
          {gerando ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="text-sm text-gray-700">Gerando seu PDF...</span>
              </div>
              <Progress value={progresso} className="w-full" />
              <p className="text-xs text-gray-500">{progresso}% concluído</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">O que está incluído:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Score de viabilidade e análise detalhada
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Gráficos e visualizações interativas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Plano financeiro e opções de pagamento
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Timeline estimada do tratamento
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Informações sobre a tecnologia Atma
                  </li>
                </ul>
              </div>

              <Button
                size="lg"
                onClick={gerarPDF}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-5 w-5 mr-2" />
                Gerar e Baixar PDF Completo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Materiais Extras */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Materiais Complementares</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {materiais.map((material) => {
            const Icone = material.icone
            return (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-${material.cor}-100 rounded-lg flex items-center justify-center`}>
                      <Icone className={`h-6 w-6 text-${material.cor}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {material.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{material.descricao}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {material.tipo.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">{material.tamanho}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => baixarMaterial(material.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Compartilhamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-purple-600" />
            Compartilhar Relatório
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Compartilhe seu relatório com dentista, ortodontista ou familiares
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!linkGerado ? (
            <div className="text-center py-6">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">
                Gere um Link de Compartilhamento
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Crie um link único e seguro para compartilhar seu relatório
              </p>
              <Button onClick={gerarLinkCompartilhamento}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Gerar Link de Compartilhamento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Link Gerado */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Link Gerado com Sucesso!</h4>
                    <p className="text-sm text-gray-600">
                      Válido por 30 dias • Visualizações ilimitadas
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 font-mono break-all">
                    {linkGerado}
                  </div>
                  <Button
                    variant="outline"
                    onClick={copiarLink}
                    className="flex-shrink-0"
                  >
                    {linkCopiado ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Opções de Compartilhamento */}
              <div className="grid md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={enviarPorEmail}
                  className="flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Enviar por Email
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setQrCodeVisivel(!qrCodeVisivel)}
                  className="flex items-center justify-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  {qrCodeVisivel ? 'Ocultar' : 'Mostrar'} QR Code
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.open(linkGerado, '_blank')}
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir Link
                </Button>
              </div>

              {/* QR Code */}
              {qrCodeVisivel && (
                <div className="p-6 bg-white border-2 border-gray-200 rounded-lg text-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-400" />
                    {/* Aqui você integraria uma biblioteca de QR Code real */}
                    <div className="absolute text-xs text-gray-500">QR Code Preview</div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Escaneie com a câmera do celular para acessar o relatório
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            💡 Dicas para Compartilhar
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Para Ortodontistas
                </h4>
                <p className="text-sm text-gray-600">
                  Compartilhe antes da consulta para que o profissional possa analisar
                  previamente seu caso
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Para Segunda Opinião
                </h4>
                <p className="text-sm text-gray-600">
                  Envie para outros profissionais para comparar avaliações e abordagens
                  de tratamento
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Para Familiares
                </h4>
                <p className="text-sm text-gray-600">
                  Mostre o plano de tratamento e investimento para decisões em família
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Segurança
                </h4>
                <p className="text-sm text-gray-600">
                  O link é único e pode ser desativado a qualquer momento através do
                  portal
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
