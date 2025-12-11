'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  FileText,
  
  TestTube,
} from 'lucide-react'

interface CompliancePanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface AnonymizationConfig {
  level: 'none' | 'partial' | 'full' | 'hash'
  fieldsToAnonymize: string[]
  preserveFormat: boolean
  hashSalt?: string
}

interface AnonymizationStats {
  level: string
  fieldsConfigured: number
  preserveFormat: boolean
}

interface TestResult {
  original: unknown
  anonymized: unknown
  fieldsAnonymized: string[]
  level: string
}

export default function CompliancePanel({ open, onOpenChange }: CompliancePanelProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [config, setConfig] = useState<AnonymizationConfig | null>(null)
  const [stats, setStats] = useState<AnonymizationStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Test form
  const [testData, setTestData] = useState('')
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  // Config form
  const [selectedLevel, setSelectedLevel] = useState<'none' | 'partial' | 'full' | 'hash'>('partial')
  const [preserveFormat, setPreserveFormat] = useState(true)

  useEffect(() => {
    if (open) {
      loadConfig()
      loadStats()
    }
  }, [open])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/compliance?action=config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.config)
        setSelectedLevel(data.config.level)
        setPreserveFormat(data.config.preserveFormat)
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/compliance?action=stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const updateConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/compliance?action=update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: selectedLevel,
          preserveFormat,
        }),
      })

      if (response.ok) {
        await loadConfig()
        await loadStats()
        alert('Configuração atualizada com sucesso!')
      }
    } catch (error) {
      console.error('Failed to update config:', error)
      alert('Erro ao atualizar configuração')
    } finally {
      setLoading(false)
    }
  }

  const testAnonymization = async () => {
    if (!testData) {
      alert('Digite dados para testar')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/compliance?action=anonymize-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: JSON.parse(testData),
          level: selectedLevel,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTestResult(data.result)
      }
    } catch (error) {
      console.error('Failed to test anonymization:', error)
      alert('Erro ao testar anonimização. Verifique o JSON.')
    } finally {
      setLoading(false)
    }
  }

  const getLevelBadge = (level: string) => {
    const colors = {
      none: 'bg-red-100 text-red-800 border-red-200',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      full: 'bg-green-100 text-green-800 border-green-200',
      hash: 'bg-blue-100 text-blue-800 border-blue-200',
    }

    const labels = {
      none: 'Sem Proteção',
      partial: 'Parcial',
      full: 'Completa',
      hash: 'Hash',
    }

    return (
      <Badge variant="outline" className={colors[level as keyof typeof colors]}>
        {labels[level as keyof typeof labels]}
      </Badge>
    )
  }

  const getLevelDescription = (level: string) => {
    const descriptions = {
      none: 'Sem anonimização. Dados são armazenados em texto puro.',
      partial: 'Anonimização parcial. Mantém alguns caracteres visíveis para referência.',
      full: 'Anonimização completa. Todos os dados sensíveis são completamente mascarados.',
      hash: 'Hash irreversível. Dados são convertidos em hash SHA-256.',
    }

    return descriptions[level as keyof typeof descriptions]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[95vh] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance e LGPD
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  Nível de Proteção
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats && getLevelBadge(stats.level)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  Campos Protegidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.fieldsConfigured || 0}</div>
                <div className="text-xs text-slate-600">tipos de dados sensíveis</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  Formato
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.preserveFormat ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Preservado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Não Preservado
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="config">Configuração</TabsTrigger>
              <TabsTrigger value="test">Testar</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre LGPD e Anonimização</CardTitle>
                  <CardDescription>
                    Lei Geral de Proteção de Dados Pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">O que é LGPD?</h3>
                    <p className="text-sm text-slate-600">
                      A LGPD (Lei 13.709/2018) regula o tratamento de dados pessoais no Brasil,
                      garantindo direitos fundamentais de liberdade e privacidade. Empresas devem
                      proteger dados sensíveis e implementar medidas de segurança adequadas.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Como funciona a anonimização?</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Este sistema detecta automaticamente e anonimiza os seguintes tipos de dados:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'E-mails',
                        'Telefones',
                        'CPF',
                        'CNPJ',
                        'Cartões de Crédito',
                        'Endereços',
                        'Nomes',
                        'Senhas',
                        'API Keys',
                        'Tokens',
                        'IP Addresses',
                      ].map(type => (
                        <div key={type} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Níveis de Anonimização</h3>
                    <div className="space-y-3">
                      {['none', 'partial', 'full', 'hash'].map(level => (
                        <div key={level} className="flex items-start gap-3">
                          {getLevelBadge(level)}
                          <div>
                            <p className="text-sm font-medium capitalize">{level === 'none' ? 'Nenhum' : level}</p>
                            <p className="text-xs text-slate-600">{getLevelDescription(level)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-1">Importante</h4>
                        <p className="text-sm text-yellow-800">
                          A anonimização é aplicada automaticamente em logs e execuções.
                          Senhas e API Keys nunca são armazenadas em texto puro, mesmo no nível &quot;none&quot;.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Config Tab */}
            <TabsContent value="config" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração de Anonimização</CardTitle>
                  <CardDescription>
                    Ajuste o nível de proteção de dados sensíveis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nível de Anonimização</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value as 'none' | 'partial' | 'full' | 'hash')}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="none">Sem Proteção (não recomendado)</option>
                      <option value="partial">Parcial (recomendado)</option>
                      <option value="full">Completa</option>
                      <option value="hash">Hash Irreversível</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      {getLevelDescription(selectedLevel)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="preserveFormat"
                      checked={preserveFormat}
                      onChange={(e) => setPreserveFormat(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <div>
                      <label htmlFor="preserveFormat" className="text-sm font-medium cursor-pointer">
                        Preservar Formato
                      </label>
                      <p className="text-xs text-slate-500">
                        Mantém a estrutura visual dos dados (ex: XXX.XXX.XXX-XX para CPF)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={updateConfig} disabled={loading} className="flex-1">
                      {loading ? 'Salvando...' : 'Salvar Configuração'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Test Tab */}
            <TabsContent value="test" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Testar Anonimização
                  </CardTitle>
                  <CardDescription>
                    Teste como seus dados serão anonimizados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Dados de Teste (JSON)
                    </label>
                    <textarea
                      value={testData}
                      onChange={(e) => setTestData(e.target.value)}
                      className="w-full px-3 py-2 border rounded font-mono text-sm"
                      rows={8}
                      placeholder={`{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "123.456.789-00",
  "phone": "(11) 98765-4321",
  "card": "1234 5678 9012 3456"
}`}
                    />
                  </div>

                  <Button onClick={testAnonymization} disabled={loading || !testData}>
                    <TestTube className="h-4 w-4 mr-2" />
                    {loading ? 'Testando...' : 'Testar Anonimização'}
                  </Button>

                  {testResult && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Dados Originais
                        </h3>
                        <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(testResult.original, null, 2)}
                        </pre>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <EyeOff className="h-4 w-4" />
                          Dados Anonimizados
                        </h3>
                        <pre className="bg-green-50 border border-green-200 p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(testResult.anonymized, null, 2)}
                        </pre>
                      </div>

                      {testResult.fieldsAnonymized.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Campos Anonimizados</h3>
                          <div className="flex flex-wrap gap-2">
                            {testResult.fieldsAnonymized.map(field => (
                              <Badge key={field} variant="outline" className="bg-blue-50 text-blue-700">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
