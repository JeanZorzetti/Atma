"use client"

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Play,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Loader2,
  FileText,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react'

interface TestScenario {
  id: string
  name: string
  description?: string
  type: 'unit' | 'integration' | 'e2e'
  workflowId: string
  enabled: boolean
  inputData: unknown
  expectedOutput?: unknown
  timeout?: number
  retries?: number
  tags?: string[]
  assertions?: TestAssertion[]
  createdAt: Date
  updatedAt: Date
}

interface TestAssertion {
  id: string
  type: 'equals' | 'contains' | 'matches' | 'exists' | 'notExists' | 'greaterThan' | 'lessThan'
  path: string
  expectedValue?: unknown
  message?: string
}

interface TestResult {
  id: string
  scenarioId: string
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped'
  startTime: string
  endTime?: string
  duration?: number
  executionLog?: unknown[]
  errors?: unknown[]
  assertions?: AssertionResult[]
  coverage?: TestCoverage
}

interface AssertionResult {
  assertionId: string
  passed: boolean
  message: string
  expected?: unknown
  actual?: unknown
}

interface TestCoverage {
  totalNodes: number
  executedNodes: number
  percentage: number
  nodes: {
    id: string
    name: string
    executed: boolean
  }[]
}

interface WorkflowTestPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId: string
  workflowName: string
}

export function WorkflowTestPanel({
  open,
  onOpenChange,
  workflowId,
  workflowName
}: WorkflowTestPanelProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [scenarios, setScenarios] = useState<TestScenario[]>([])
  const [results, setResults] = useState<TestResult[]>([])
  const [running, setRunning] = useState<Set<string>>(new Set())
  const [showCreateScenario, setShowCreateScenario] = useState(false)
  const [editingScenario, setEditingScenario] = useState<TestScenario | null>(null)

  useEffect(() => {
    if (open && workflowId) {
      loadTestData()
    }
  }, [open, workflowId])

  const loadTestData = async () => {
    setLoading(true)
    try {
      // Carregar scenarios
      const scenariosResponse = await fetch(`/api/n8n/test?action=scenarios&workflowId=${workflowId}`)
      if (scenariosResponse.ok) {
        const data = await scenariosResponse.json()
        setScenarios(data.scenarios || [])
      }

      // Carregar resultados recentes
      const resultsResponse = await fetch(`/api/n8n/test?action=results&workflowId=${workflowId}&limit=10`)
      if (resultsResponse.ok) {
        const data = await resultsResponse.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error('Error loading test data:', error)
      toast({
        title: 'Erro ao carregar testes',
        description: 'Não foi possível carregar os cenários de teste',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRunScenario = async (scenarioId: string) => {
    setRunning(prev => new Set(prev).add(scenarioId))

    try {
      const response = await fetch('/api/n8n/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run-scenario',
          scenarioId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to run test')
      }

      const data = await response.json()

      toast({
        title: data.result.status === 'passed' ? 'Teste passou!' : 'Teste falhou',
        description: data.result.status === 'passed'
          ? `Teste executado com sucesso em ${data.result.duration}ms`
          : 'O teste encontrou erros. Veja os detalhes.',
        variant: data.result.status === 'passed' ? 'default' : 'destructive'
      })

      // Recarregar resultados
      await loadTestData()
    } catch (error) {
      toast({
        title: 'Erro ao executar teste',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    } finally {
      setRunning(prev => {
        const next = new Set(prev)
        next.delete(scenarioId)
        return next
      })
    }
  }

  const handleRunAll = async () => {
    const enabledScenarios = scenarios.filter(s => s.enabled)

    for (const scenario of enabledScenarios) {
      await handleRunScenario(scenario.id)
    }
  }

  const handleDeleteScenario = async (scenarioId: string) => {
    if (!confirm('Tem certeza que deseja deletar este cenário de teste?')) {
      return
    }

    try {
      const response = await fetch(`/api/n8n/test?type=scenario&id=${scenarioId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete scenario')
      }

      toast({
        title: 'Cenário deletado',
        description: 'O cenário de teste foi removido com sucesso'
      })

      await loadTestData()
    } catch (error) {
      toast({
        title: 'Erro ao deletar cenário',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case 'skipped':
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    const variants: Record<TestResult['status'], string> = {
      passed: 'bg-green-600',
      failed: 'bg-red-600',
      running: 'bg-blue-600',
      skipped: 'bg-gray-400',
      pending: 'bg-gray-400'
    }

    return (
      <Badge variant="default" className={variants[status]}>
        {status}
      </Badge>
    )
  }

  const getTypeIcon = (type: TestScenario['type']) => {
    switch (type) {
      case 'unit':
        return '🧪'
      case 'integration':
        return '🔗'
      case 'e2e':
        return '🌐'
    }
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return '-'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Testes Automatizados: {workflowName}
          </DialogTitle>
          <DialogDescription>
            Configure e execute testes automatizados para validar seu workflow
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <Tabs defaultValue="scenarios" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scenarios">
                Cenários ({scenarios.length})
              </TabsTrigger>
              <TabsTrigger value="results">
                Resultados ({results.length})
              </TabsTrigger>
              <TabsTrigger value="coverage">
                Cobertura
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scenarios" className="flex-1 overflow-y-auto space-y-4">
              {/* Header com ações */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    onClick={handleRunAll}
                    disabled={scenarios.length === 0}
                    size="sm"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Executar Todos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateScenario(true)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cenário
                  </Button>
                </div>
              </div>

              {/* Lista de cenários */}
              {scenarios.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Target className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-2">Nenhum cenário de teste criado</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Crie cenários para testar automaticamente seu workflow
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateScenario(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Cenário
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {scenarios.map(scenario => {
                    const isRunning = running.has(scenario.id)
                    const latestResult = results.find(r => r.scenarioId === scenario.id)

                    return (
                      <Card key={scenario.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getTypeIcon(scenario.type)}</span>
                              <div>
                                <CardTitle className="text-base">{scenario.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  {scenario.description || `Teste ${scenario.type}`}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {latestResult && getStatusBadge(latestResult.status)}
                              <Badge variant="outline" className="text-xs">
                                {scenario.type}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {latestResult && (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(latestResult.duration)}
                                  </span>
                                  {latestResult.coverage && (
                                    <span className="flex items-center gap-1">
                                      <Target className="h-3 w-3" />
                                      {latestResult.coverage.percentage.toFixed(0)}% cobertura
                                    </span>
                                  )}
                                </>
                              )}
                              {scenario.tags && scenario.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {scenario.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingScenario(scenario)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteScenario(scenario.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleRunScenario(scenario.id)}
                                disabled={isRunning || !scenario.enabled}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                {isRunning ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <Play className="h-3 w-3 mr-1" />
                                )}
                                Executar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="flex-1 overflow-y-auto space-y-3">
              {results.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600">Nenhum resultado de teste ainda</p>
                    <p className="text-sm text-gray-500">
                      Execute testes para ver os resultados aqui
                    </p>
                  </CardContent>
                </Card>
              ) : (
                results.map(result => (
                  <Card key={result.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <span className="font-medium">
                              {scenarios.find(s => s.id === result.scenarioId)?.name}
                            </span>
                          </div>
                          {getStatusBadge(result.status)}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Duração</p>
                            <p className="font-medium">{formatDuration(result.duration)}</p>
                          </div>
                          {result.coverage && (
                            <div>
                              <p className="text-muted-foreground">Cobertura</p>
                              <p className="font-medium">{result.coverage.percentage.toFixed(0)}%</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground">Data</p>
                            <p className="font-medium">
                              {new Date(result.startTime).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        {result.assertions && result.assertions.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Assertions</p>
                            <div className="space-y-1">
                              {result.assertions.map((assertion, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-2 text-sm p-2 rounded ${
                                    assertion.passed ? 'bg-green-50' : 'bg-red-50'
                                  }`}
                                >
                                  {assertion.passed ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-600" />
                                  )}
                                  <span className={assertion.passed ? 'text-green-800' : 'text-red-800'}>
                                    {assertion.message}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="coverage" className="flex-1 overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Cobertura de Testes
                  </CardTitle>
                  <CardDescription>
                    Análise de cobertura dos nós do workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Execute testes para ver a cobertura de nós do workflow
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end gap-2 mt-4 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>

      {/* Modal para criar/editar cenário */}
      <TestScenarioCreator
        open={showCreateScenario || !!editingScenario}
        onOpenChange={(open) => {
          setShowCreateScenario(open)
          if (!open) setEditingScenario(null)
        }}
        workflowId={workflowId}
        scenario={editingScenario}
        onSaved={async () => {
          setShowCreateScenario(false)
          setEditingScenario(null)
          await loadTestData()
        }}
      />
    </Dialog>
  )
}

// Sub-componente para criar/editar cenários
interface TestScenarioCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId: string
  scenario: TestScenario | null
  onSaved: () => void
}

function TestScenarioCreator({
  open,
  onOpenChange,
  workflowId,
  scenario,
  onSaved
}: TestScenarioCreatorProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'unit' | 'integration' | 'e2e'>('unit')
  const [inputData, setInputData] = useState('')
  const [expectedOutput, setExpectedOutput] = useState('')
  const [timeout, setTimeout] = useState('30000')

  useEffect(() => {
    if (scenario) {
      setName(scenario.name)
      setDescription(scenario.description || '')
      setType(scenario.type)
      setInputData(JSON.stringify(scenario.inputData, null, 2))
      setExpectedOutput(scenario.expectedOutput ? JSON.stringify(scenario.expectedOutput, null, 2) : '')
      setTimeout(String(scenario.timeout || 30000))
    } else {
      setName('')
      setDescription('')
      setType('unit')
      setInputData('{}')
      setExpectedOutput('')
      setTimeout('30000')
    }
  }, [scenario, open])

  const handleSave = async () => {
    if (!name || !inputData) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e dados de entrada são obrigatórios',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    try {
      let parsedInput: unknown
      let parsedOutput: unknown

      try {
        parsedInput = JSON.parse(inputData)
      } catch {
        throw new Error('Dados de entrada devem ser JSON válido')
      }

      if (expectedOutput) {
        try {
          parsedOutput = JSON.parse(expectedOutput)
        } catch {
          throw new Error('Saída esperada deve ser JSON válido')
        }
      }

      const action = scenario ? 'update' : 'create-scenario'
      const body = {
        action,
        ...(scenario && { id: scenario.id, type: 'scenario' }),
        workflowId,
        name,
        description,
        type,
        inputData: parsedInput,
        expectedOutput: parsedOutput,
        timeout: parseInt(timeout)
      }

      const response = await fetch('/api/n8n/test', {
        method: scenario ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error('Failed to save scenario')
      }

      toast({
        title: scenario ? 'Cenário atualizado' : 'Cenário criado',
        description: `Cenário de teste ${scenario ? 'atualizado' : 'criado'} com sucesso`
      })

      onSaved()
    } catch (error) {
      toast({
        title: 'Erro ao salvar cenário',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {scenario ? 'Editar Cenário' : 'Novo Cenário de Teste'}
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros do cenário de teste
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Validar processamento de leads"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que este teste valida"
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tipo de Teste *</label>
            <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unit">🧪 Unit - Testa componente isolado</SelectItem>
                <SelectItem value="integration">🔗 Integration - Testa integração entre componentes</SelectItem>
                <SelectItem value="e2e">🌐 E2E - Testa fluxo completo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Dados de Entrada (JSON) *</label>
            <Textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder='{"email": "test@example.com", "name": "Test User"}'
              rows={5}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Saída Esperada (JSON)</label>
            <Textarea
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              placeholder='{"success": true, "message": "Processado"}'
              rows={5}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Timeout (ms)</label>
            <Input
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              placeholder="30000"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {scenario ? 'Atualizar' : 'Criar'} Cenário
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
