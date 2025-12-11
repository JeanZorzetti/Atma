"use client"

import { useState, useEffect, useCallback } from 'react'
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
  Pause,
  StepForward,
  Square,
  Bug,
  Circle,
  PlayCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Plus,
  Trash2,
  ChevronRight,
  Code,
  Terminal
} from 'lucide-react'

interface DebugSession {
  id: string
  workflowId: string
  workflowName: string
  mode: 'step' | 'breakpoint' | 'continuous'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
  currentNodeId?: string
  inputData: unknown
  startTime: string
  endTime?: string
  steps: DebugStep[]
  breakpoints: string[]
  variables: Record<string, unknown>
}

interface DebugStep {
  id: string
  nodeId: string
  nodeName: string
  nodeType: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
  startTime: string
  endTime?: string
  duration?: number
  inputData: unknown
  outputData?: unknown
  error?: {
    type: string
    message: string
    stack?: string
  }
  variables?: Record<string, unknown>
  executionContext?: {
    previousNode?: string
    nextNodes?: string[]
    loopIteration?: number
    retryCount?: number
  }
}

interface Breakpoint {
  id: string
  nodeId: string
  nodeName: string
  condition?: string
  hitCount: number
  enabled: boolean
}

interface WatchVariable {
  id: string
  expression: string
  value?: unknown
  lastUpdated?: string
}

interface WorkflowDebugPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflowId: string
  workflowName: string
}

export function WorkflowDebugPanel({
  open,
  onOpenChange,
  workflowId,
  workflowName
}: WorkflowDebugPanelProps) {
  const { toast } = useToast()
  const [session, setSession] = useState<DebugSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [debugMode, setDebugMode] = useState<'step' | 'breakpoint' | 'continuous'>('continuous')
  const [inputData, setInputData] = useState('{}')
  const [selectedStep, setSelectedStep] = useState<DebugStep | null>(null)
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([])
  const [watchVariables, setWatchVariables] = useState<WatchVariable[]>([])
  const [newWatchExpression, setNewWatchExpression] = useState('')

  useEffect(() => {
    if (open && workflowId) {
      loadDebugData()
    }
  }, [open, workflowId])

  const loadDebugData = async () => {
    try {
      // Carregar breakpoints
      const bpResponse = await fetch(`/api/n8n/debug?action=breakpoints&workflowId=${workflowId}`)
      if (bpResponse.ok) {
        const data = await bpResponse.json()
        setBreakpoints(data.breakpoints || [])
      }

      // Carregar watch variables
      const watchResponse = await fetch(`/api/n8n/debug?action=watch-variables&workflowId=${workflowId}`)
      if (watchResponse.ok) {
        const data = await watchResponse.json()
        setWatchVariables(data.watchVariables || [])
      }
    } catch (error) {
      console.error('Error loading debug data:', error)
    }
  }

  const handleStart = async () => {
    setLoading(true)
    try {
      let parsedInput: unknown
      try {
        parsedInput = JSON.parse(inputData)
      } catch {
        throw new Error('Input data must be valid JSON')
      }

      const response = await fetch('/api/n8n/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          workflowId,
          workflowName,
          inputData: parsedInput,
          mode: debugMode
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start debug session')
      }

      const data = await response.json()
      setSession(data.session)

      toast({
        title: 'Debug iniciado',
        description: `Sessão de debug iniciada em modo ${debugMode}`
      })

      // Poll para atualizar estado da sessão
      startPolling(data.session.id)
    } catch (error) {
      toast({
        title: 'Erro ao iniciar debug',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const startPolling = useCallback((sessionId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/n8n/debug?action=session&sessionId=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setSession(data.session)

          // Parar polling se completou ou falhou
          if (data.session.status === 'completed' || data.session.status === 'failed') {
            clearInterval(interval)
          }
        }
      } catch (error) {
        console.error('Error polling session:', error)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleContinue = async () => {
    if (!session) return

    try {
      const response = await fetch('/api/n8n/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'continue',
          sessionId: session.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to continue execution')
      }

      const data = await response.json()
      setSession(data.session)

      toast({
        title: 'Execução retomada',
        description: 'Debug está continuando'
      })
    } catch (error) {
      toast({
        title: 'Erro ao continuar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    }
  }

  const handleStepNext = async () => {
    if (!session) return

    try {
      const response = await fetch('/api/n8n/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'step-next',
          sessionId: session.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to step next')
      }

      toast({
        title: 'Próximo step',
        description: 'Executando próximo nó'
      })
    } catch (error) {
      toast({
        title: 'Erro ao executar step',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    }
  }

  const handleStop = async () => {
    if (!session) return

    try {
      const response = await fetch('/api/n8n/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop',
          sessionId: session.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to stop execution')
      }

      toast({
        title: 'Execução parada',
        description: 'Debug foi interrompido'
      })

      setSession(null)
    } catch (error) {
      toast({
        title: 'Erro ao parar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    }
  }

  const handleAddWatch = async () => {
    if (!newWatchExpression.trim()) return

    try {
      const response = await fetch('/api/n8n/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-watch',
          workflowId,
          expression: newWatchExpression
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add watch variable')
      }

      const data = await response.json()
      setWatchVariables([...watchVariables, data.watchVariable])
      setNewWatchExpression('')

      toast({
        title: 'Watch adicionado',
        description: `Monitorando: ${newWatchExpression}`
      })
    } catch (error) {
      toast({
        title: 'Erro ao adicionar watch',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    }
  }

  const handleRemoveWatch = async (watchId: string) => {
    try {
      const response = await fetch('/api/n8n/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove-watch',
          workflowId,
          watchId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to remove watch variable')
      }

      setWatchVariables(watchVariables.filter(w => w.id !== watchId))

      toast({
        title: 'Watch removido',
        description: 'Variável removida do monitoramento'
      })
    } catch (error) {
      toast({
        title: 'Erro ao remover watch',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    }
  }

  const getStatusIcon = (status: DebugStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: DebugStep['status']) => {
    const variants: Record<DebugStep['status'], string> = {
      completed: 'bg-green-600',
      failed: 'bg-red-600',
      running: 'bg-blue-600',
      paused: 'bg-yellow-600',
      pending: 'bg-gray-400'
    }

    return (
      <Badge variant="default" className={variants[status]}>
        {status}
      </Badge>
    )
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return '-'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-orange-600" />
            Debug Mode: {workflowName}
          </DialogTitle>
          <DialogDescription>
            Execute e depure seu workflow passo a passo
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Controles de Debug */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                {!session ? (
                  <>
                    <Select value={debugMode} onValueChange={(v) => setDebugMode(v as typeof debugMode)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continuous">Contínuo</SelectItem>
                        <SelectItem value="step">Step-by-Step</SelectItem>
                        <SelectItem value="breakpoint">Breakpoints</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex-1">
                      <Input
                        placeholder='{"email": "test@example.com"}'
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleStart}
                      disabled={loading}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <PlayCircle className="h-4 w-4 mr-2" />
                      )}
                      Iniciar Debug
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(session.status)}
                      <span className="text-sm text-muted-foreground">
                        {session.steps.length} steps executados
                      </span>
                    </div>
                    <div className="flex-1" />
                    {session.status === 'paused' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleStepNext}
                        >
                          <StepForward className="h-4 w-4 mr-2" />
                          Próximo Step
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleContinue}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continuar
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleStop}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Parar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Debug */}
          <Tabs defaultValue="steps" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="steps">Steps ({session?.steps.length || 0})</TabsTrigger>
              <TabsTrigger value="variables">Variáveis</TabsTrigger>
              <TabsTrigger value="watch">Watch</TabsTrigger>
            </TabsList>

            <TabsContent value="steps" className="flex-1 overflow-y-auto space-y-2">
              {!session ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Terminal className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600">Inicie uma sessão de debug para ver os steps</p>
                  </CardContent>
                </Card>
              ) : (
                session.steps.map((step, index) => (
                  <Card
                    key={step.id}
                    className={`cursor-pointer transition-colors ${
                      selectedStep?.id === step.id ? 'border-orange-600 bg-orange-50' : 'hover:border-orange-300'
                    }`}
                    onClick={() => setSelectedStep(step)}
                  >
                    <CardContent className="py-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          {getStatusIcon(step.status)}
                          <span className="text-sm font-mono text-muted-foreground">
                            Step {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{step.nodeName}</p>
                            <Badge variant="outline" className="text-xs">
                              {step.nodeType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(step.duration)}
                            </span>
                            {step.error && (
                              <span className="text-red-600">
                                Error: {step.error.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>

                      {selectedStep?.id === step.id && (
                        <div className="mt-4 space-y-3 border-t pt-3">
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Input Data</h4>
                            <pre className="text-xs bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
                              {JSON.stringify(step.inputData, null, 2)}
                            </pre>
                          </div>
                          {step.outputData ? (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Output Data</h4>
                              <pre className="text-xs bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
                                {JSON.stringify(step.outputData, null, 2)}
                              </pre>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="variables" className="flex-1 overflow-y-auto">
              {selectedStep ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Variáveis - {selectedStep.nodeName}
                    </CardTitle>
                    <CardDescription>
                      Estado das variáveis neste step
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto">
                      {JSON.stringify(selectedStep.variables || {}, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Code className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600">Selecione um step para ver as variáveis</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="watch" className="flex-1 overflow-y-auto space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Adicionar Watch</CardTitle>
                  <CardDescription>
                    Monitore expressões JavaScript durante a execução
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="input.email"
                      value={newWatchExpression}
                      onChange={(e) => setNewWatchExpression(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddWatch()
                        }
                      }}
                    />
                    <Button onClick={handleAddWatch}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {watchVariables.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Eye className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600">Nenhuma variável sendo monitorada</p>
                  </CardContent>
                </Card>
              ) : (
                watchVariables.map(watch => (
                  <Card key={watch.id}>
                    <CardContent className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-mono text-sm mb-2">{watch.expression}</p>
                          {watch.value !== undefined && (
                            <pre className="text-xs bg-slate-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(watch.value, null, 2)}
                            </pre>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveWatch(watch.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 mt-4 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
