'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Shield,
  Zap,
  FileCheck,
  Bug,
  Tag,
  AlertCircle,
  Play,
  Settings,
} from 'lucide-react'
import type {
  ValidationResult,
  ValidationIssue,
  ValidationCategory,
  WorkflowValidationConfig,
} from '@/lib/workflow-validator'

interface WorkflowValidationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId: string
  workflowName: string
}

export default function WorkflowValidationPanel({
  open,
  onOpenChange,
  workflowId,
  workflowName,
}: WorkflowValidationPanelProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState<WorkflowValidationConfig | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Load config on mount
  useEffect(() => {
    if (open) {
      loadConfig()
    }
  }, [open])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/n8n/validate?action=config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const runValidation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/n8n/validate?action=validate-from-n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      })

      if (response.ok) {
        const data = await response.json()
        setValidationResult(data.result)
        setRecommendations(data.recommendations)
        setActiveTab('overview')
      } else {
        alert('Erro ao validar workflow')
      }
    } catch (error) {
      console.error('Validation error:', error)
      alert('Erro ao validar workflow')
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (updates: Partial<WorkflowValidationConfig>) => {
    try {
      const response = await fetch('/api/n8n/validate?action=update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: updates }),
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to update config:', error)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getCategoryIcon = (category: ValidationCategory) => {
    switch (category) {
      case 'schema':
        return <FileCheck className="h-4 w-4" />
      case 'security':
        return <Shield className="h-4 w-4" />
      case 'performance':
        return <Zap className="h-4 w-4" />
      case 'bestPractices':
        return <CheckCircle2 className="h-4 w-4" />
      case 'naming':
        return <Tag className="h-4 w-4" />
      case 'errorHandling':
        return <Bug className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: ValidationCategory) => {
    switch (category) {
      case 'schema':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'security':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'performance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'bestPractices':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'naming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'errorHandling':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200'
    if (score >= 70) return 'bg-blue-50 border-blue-200'
    if (score >= 50) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getCategoryName = (category: ValidationCategory): string => {
    const names: Record<ValidationCategory, string> = {
      schema: 'Schema',
      security: 'Segurança',
      performance: 'Performance',
      bestPractices: 'Boas Práticas',
      naming: 'Nomenclatura',
      errorHandling: 'Tratamento de Erros',
    }
    return names[category]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Validação de Workflow: {workflowName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex items-center gap-3">
            <Button onClick={runValidation} disabled={loading} className="gap-2">
              <Play className="h-4 w-4" />
              {loading ? 'Validando...' : 'Executar Validação'}
            </Button>

            {validationResult && (
              <Badge
                variant="outline"
                className={`text-lg font-bold ${getScoreBgColor(validationResult.score)}`}
              >
                <span className={getScoreColor(validationResult.score)}>
                  Score: {validationResult.score}/100
                </span>
              </Badge>
            )}
          </div>

          {validationResult && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="issues">
                  Problemas ({validationResult.issues.length})
                </TabsTrigger>
                <TabsTrigger value="categories">Categorias</TabsTrigger>
                <TabsTrigger value="config">
                  <Settings className="h-4 w-4 mr-1" />
                  Configuração
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Erros
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">
                        {validationResult.summary.errors}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Avisos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-600">
                        {validationResult.summary.warnings}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        Informações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {validationResult.summary.info}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recomendações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-lg">{rec.split(' ')[0]}</span>
                            <span className="text-sm text-slate-700">
                              {rec.substring(rec.indexOf(' ') + 1)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Top Issues */}
                {validationResult.issues.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Principais Problemas</CardTitle>
                      <CardDescription>
                        Mostrando os {Math.min(5, validationResult.issues.length)} problemas mais
                        críticos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {validationResult.issues
                          .filter(issue => issue.severity === 'error')
                          .slice(0, 5)
                          .map(issue => (
                            <div
                              key={issue.id}
                              className="border-l-4 border-red-500 pl-4 py-2"
                            >
                              <div className="flex items-start gap-2">
                                {getSeverityIcon(issue.severity)}
                                <div className="flex-1">
                                  <div className="font-semibold text-sm">{issue.message}</div>
                                  {issue.nodeName && (
                                    <div className="text-xs text-slate-500">
                                      Nó: {issue.nodeName}
                                    </div>
                                  )}
                                  <div className="text-sm text-slate-600 mt-1">
                                    {issue.description}
                                  </div>
                                  {issue.fix && (
                                    <div className="text-sm text-blue-600 mt-1">
                                      💡 {issue.fix}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Issues Tab */}
              <TabsContent value="issues" className="space-y-3">
                {validationResult.issues.length === 0 ? (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-green-700">
                        Nenhum problema encontrado!
                      </div>
                      <div className="text-sm text-green-600">
                        O workflow está seguindo todas as melhores práticas.
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  validationResult.issues.map(issue => (
                    <Card
                      key={issue.id}
                      className={
                        issue.severity === 'error'
                          ? 'border-red-200'
                          : issue.severity === 'warning'
                          ? 'border-yellow-200'
                          : 'border-blue-200'
                      }
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(issue.severity)}
                            <CardTitle className="text-base">{issue.message}</CardTitle>
                          </div>
                          <Badge variant="outline" className={getCategoryColor(issue.category)}>
                            {getCategoryIcon(issue.category)}
                            <span className="ml-1">{getCategoryName(issue.category)}</span>
                          </Badge>
                        </div>
                        {issue.nodeName && (
                          <CardDescription>Nó: {issue.nodeName}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="text-slate-700">{issue.description}</div>
                          {issue.fix && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <div className="font-semibold text-blue-700 mb-1">
                                💡 Como corrigir:
                              </div>
                              <div className="text-blue-600">{issue.fix}</div>
                            </div>
                          )}
                          <div className="text-xs text-slate-500 font-mono">
                            Código: {issue.code}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(validationResult.categories) as ValidationCategory[]).map(
                    category => {
                      const cat = validationResult.categories[category]
                      return (
                        <Card key={category} className={getCategoryColor(category)}>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              {getCategoryIcon(category)}
                              {getCategoryName(category)}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Score:</span>
                                <span className={`text-2xl font-bold ${getScoreColor(cat.score)}`}>
                                  {cat.score}/100
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    cat.score >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${cat.score}%` }}
                                />
                              </div>
                              <div className="text-xs text-slate-600">
                                {cat.failed} problema(s) encontrado(s)
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    }
                  )}
                </div>
              </TabsContent>

              {/* Config Tab */}
              <TabsContent value="config" className="space-y-4">
                {config && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações de Validação</CardTitle>
                      <CardDescription>
                        Ative ou desative categorias de validação
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            key: 'enableSchemaValidation',
                            label: 'Validação de Schema',
                            description: 'Verifica estrutura básica do workflow',
                          },
                          {
                            key: 'enableBestPractices',
                            label: 'Boas Práticas',
                            description: 'Recomendações de padrões e organização',
                          },
                          {
                            key: 'enablePerformanceChecks',
                            label: 'Performance',
                            description: 'Identifica possíveis problemas de performance',
                          },
                          {
                            key: 'enableSecurityChecks',
                            label: 'Segurança',
                            description: 'Detecta vulnerabilidades de segurança',
                          },
                          {
                            key: 'enableNamingConventions',
                            label: 'Nomenclatura',
                            description: 'Verifica convenções de nomenclatura',
                          },
                          {
                            key: 'enableErrorHandling',
                            label: 'Tratamento de Erros',
                            description: 'Verifica configurações de error handling',
                          },
                          {
                            key: 'strictMode',
                            label: 'Modo Estrito',
                            description: 'Validação mais rigorosa com regras extras',
                          },
                        ].map(({ key, label, description }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between border-b pb-3"
                          >
                            <div>
                              <div className="font-medium">{label}</div>
                              <div className="text-sm text-slate-500">{description}</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={config[key as keyof WorkflowValidationConfig] as boolean}
                              onChange={e =>
                                updateConfig({ [key]: e.target.checked })
                              }
                              className="h-5 w-5 rounded border-slate-300"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}

          {!validationResult && !loading && (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center text-slate-500">
                <FileCheck className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                <div>Clique em &quot;Executar Validação&quot; para começar</div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
