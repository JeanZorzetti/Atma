/**
 * Sistema de Debug Avançado para Workflows
 * Fase 3.2 - Modo Debug
 */

export type DebugMode = 'step' | 'breakpoint' | 'continuous'
export type DebugStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused'

export interface DebugSession {
  id: string
  workflowId: string
  workflowName: string
  mode: DebugMode
  status: DebugStepStatus
  currentNodeId?: string
  inputData: unknown
  startTime: Date
  endTime?: Date
  steps: DebugStep[]
  breakpoints: string[] // Node IDs
  variables: Record<string, unknown>
}

export interface DebugStep {
  id: string
  nodeId: string
  nodeName: string
  nodeType: string
  status: DebugStepStatus
  startTime: Date
  endTime?: Date
  duration?: number
  inputData: unknown
  outputData?: unknown
  error?: DebugError
  variables?: Record<string, unknown>
  executionContext?: {
    previousNode?: string
    nextNodes?: string[]
    loopIteration?: number
    retryCount?: number
  }
}

export interface DebugError {
  type: string
  message: string
  stack?: string
  nodeId: string
  nodeName: string
  timestamp: Date
}

export interface Breakpoint {
  id: string
  nodeId: string
  nodeName: string
  condition?: string // Expressão JavaScript para conditional breakpoint
  hitCount: number
  enabled: boolean
}

export interface WatchVariable {
  id: string
  expression: string
  value?: unknown
  lastUpdated?: Date
}

class WorkflowDebugger {
  private static instance: WorkflowDebugger
  private activeSessions: Map<string, DebugSession> = new Map()
  private breakpoints: Map<string, Breakpoint[]> = new Map()
  private watchVariables: Map<string, WatchVariable[]> = new Map()

  private constructor() {}

  static getInstance(): WorkflowDebugger {
    if (!WorkflowDebugger.instance) {
      WorkflowDebugger.instance = new WorkflowDebugger()
    }
    return WorkflowDebugger.instance
  }

  /**
   * Inicia uma sessão de debug
   */
  async startDebugSession(
    workflowId: string,
    workflowName: string,
    inputData: unknown,
    mode: DebugMode = 'continuous',
    n8nApiUrl: string,
    n8nApiKey?: string
  ): Promise<DebugSession> {
    const session: DebugSession = {
      id: `debug-${Date.now()}`,
      workflowId,
      workflowName,
      mode,
      status: 'running',
      inputData,
      startTime: new Date(),
      steps: [],
      breakpoints: this.getBreakpoints(workflowId).map(bp => bp.nodeId),
      variables: {}
    }

    this.activeSessions.set(session.id, session)

    // Executar workflow com instrumentação
    await this.executeWithInstrumentation(session, n8nApiUrl, n8nApiKey)

    return session
  }

  /**
   * Executa workflow com instrumentação para debug
   */
  private async executeWithInstrumentation(
    session: DebugSession,
    n8nApiUrl: string,
    n8nApiKey?: string
  ): Promise<void> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      if (n8nApiKey) {
        headers['X-N8N-API-KEY'] = n8nApiKey
      }

      // Executar workflow
      const response = await fetch(`${n8nApiUrl}/workflows/${session.workflowId}/execute`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: session.inputData })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      // Processar resultado e criar steps
      await this.processExecutionResult(session, result)

      session.status = 'completed'
      session.endTime = new Date()
    } catch (error) {
      session.status = 'failed'
      session.endTime = new Date()

      // Adicionar erro ao último step
      if (session.steps.length > 0) {
        const lastStep = session.steps[session.steps.length - 1]
        lastStep.error = {
          type: 'ExecutionError',
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          nodeId: lastStep.nodeId,
          nodeName: lastStep.nodeName,
          timestamp: new Date()
        }
      }
    }
  }

  /**
   * Processa resultado da execução e cria steps de debug
   */
  private async processExecutionResult(session: DebugSession, _result: unknown): Promise<void> {
    // Mock implementation - na prática, isso dependeria da estrutura de resposta do n8n
    const mockNodes = [
      { id: 'start', name: 'Start', type: 'trigger' },
      { id: 'process', name: 'Process Data', type: 'function' },
      { id: 'condition', name: 'If Condition', type: 'if' },
      { id: 'end', name: 'End', type: 'webhook' }
    ]

    for (let i = 0; i < mockNodes.length; i++) {
      const node = mockNodes[i]
      const startTime = new Date(session.startTime.getTime() + i * 500)
      const endTime = new Date(startTime.getTime() + 200)

      const step: DebugStep = {
        id: `step-${i}`,
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        status: 'completed',
        startTime,
        endTime,
        duration: 200,
        inputData: i === 0 ? session.inputData : session.steps[i - 1]?.outputData,
        outputData: { processed: true, data: `Output from ${node.name}` },
        variables: { ...session.variables },
        executionContext: {
          previousNode: i > 0 ? mockNodes[i - 1].id : undefined,
          nextNodes: i < mockNodes.length - 1 ? [mockNodes[i + 1].id] : undefined
        }
      }

      // Verificar se há breakpoint neste nó
      if (session.breakpoints.includes(node.id)) {
        step.status = 'paused'
        session.status = 'paused'
        session.currentNodeId = node.id
      }

      session.steps.push(step)

      // Atualizar variáveis watched
      await this.updateWatchVariables(session, step)

      // Se em modo step, pausar após cada nó
      if (session.mode === 'step' && i < mockNodes.length - 1) {
        step.status = 'paused'
        session.status = 'paused'
        session.currentNodeId = node.id
        break
      }

      // Se em modo breakpoint e atingiu um, pausar
      if (session.mode === 'breakpoint' && step.status === 'paused') {
        break
      }
    }
  }

  /**
   * Atualiza variáveis watched
   */
  private async updateWatchVariables(session: DebugSession, step: DebugStep): Promise<void> {
    const watchVars = this.watchVariables.get(session.workflowId) || []

    for (const watchVar of watchVars) {
      try {
        // Avaliar expressão no contexto do step
        const value = this.evaluateExpression(watchVar.expression, {
          input: step.inputData,
          output: step.outputData,
          variables: step.variables,
          node: {
            id: step.nodeId,
            name: step.nodeName,
            type: step.nodeType
          }
        })

        watchVar.value = value
        watchVar.lastUpdated = new Date()
      } catch (error) {
        watchVar.value = { error: error instanceof Error ? error.message : 'Evaluation failed' }
      }
    }
  }

  /**
   * Avalia uma expressão JavaScript
   */
  private evaluateExpression(expression: string, context: Record<string, unknown>): unknown {
    try {
      // Criar função que avalia a expressão no contexto fornecido
      const func = new Function(...Object.keys(context), `return ${expression}`)
      return func(...Object.values(context))
    } catch {
      throw new Error(`Failed to evaluate expression: ${expression}`)
    }
  }

  /**
   * Continua execução após pausa
   */
  async continueExecution(sessionId: string): Promise<DebugSession> {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    if (session.status !== 'paused') {
      throw new Error('Session is not paused')
    }

    session.status = 'running'

    // Continuar a partir do último step
    // Na implementação real, isso reativaria a execução do workflow

    return session
  }

  /**
   * Executa próximo step (step-by-step)
   */
  async stepNext(sessionId: string): Promise<DebugStep | null> {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    // Na implementação real, isso executaria o próximo nó
    return null
  }

  /**
   * Para execução
   */
  stopExecution(sessionId: string): void {
    const session = this.activeSessions.get(sessionId)
    if (session) {
      session.status = 'failed'
      session.endTime = new Date()
    }
  }

  /**
   * Gerenciamento de Breakpoints
   */
  addBreakpoint(workflowId: string, nodeId: string, nodeName: string, condition?: string): Breakpoint {
    const breakpoints = this.breakpoints.get(workflowId) || []

    const breakpoint: Breakpoint = {
      id: `bp-${Date.now()}`,
      nodeId,
      nodeName,
      condition,
      hitCount: 0,
      enabled: true
    }

    breakpoints.push(breakpoint)
    this.breakpoints.set(workflowId, breakpoints)

    return breakpoint
  }

  removeBreakpoint(workflowId: string, breakpointId: string): void {
    const breakpoints = this.breakpoints.get(workflowId) || []
    const filtered = breakpoints.filter(bp => bp.id !== breakpointId)
    this.breakpoints.set(workflowId, filtered)
  }

  toggleBreakpoint(workflowId: string, breakpointId: string): void {
    const breakpoints = this.breakpoints.get(workflowId) || []
    const breakpoint = breakpoints.find(bp => bp.id === breakpointId)
    if (breakpoint) {
      breakpoint.enabled = !breakpoint.enabled
    }
  }

  getBreakpoints(workflowId: string): Breakpoint[] {
    return this.breakpoints.get(workflowId) || []
  }

  /**
   * Gerenciamento de Watch Variables
   */
  addWatchVariable(workflowId: string, expression: string): WatchVariable {
    const watchVars = this.watchVariables.get(workflowId) || []

    const watchVar: WatchVariable = {
      id: `watch-${Date.now()}`,
      expression
    }

    watchVars.push(watchVar)
    this.watchVariables.set(workflowId, watchVars)

    return watchVar
  }

  removeWatchVariable(workflowId: string, watchId: string): void {
    const watchVars = this.watchVariables.get(workflowId) || []
    const filtered = watchVars.filter(w => w.id !== watchId)
    this.watchVariables.set(workflowId, filtered)
  }

  getWatchVariables(workflowId: string): WatchVariable[] {
    return this.watchVariables.get(workflowId) || []
  }

  /**
   * Obtém sessão ativa
   */
  getSession(sessionId: string): DebugSession | undefined {
    return this.activeSessions.get(sessionId)
  }

  /**
   * Lista todas as sessões ativas
   */
  getActiveSessions(): DebugSession[] {
    return Array.from(this.activeSessions.values())
  }

  /**
   * Obtém step específico
   */
  getStep(sessionId: string, stepId: string): DebugStep | undefined {
    const session = this.activeSessions.get(sessionId)
    if (!session) return undefined

    return session.steps.find(s => s.id === stepId)
  }

  /**
   * Inspeciona variáveis em um step específico
   */
  inspectVariables(sessionId: string, stepId: string): Record<string, unknown> | undefined {
    const step = this.getStep(sessionId, stepId)
    return step?.variables
  }

  /**
   * Obtém contexto de execução
   */
  getExecutionContext(sessionId: string, stepId: string) {
    const step = this.getStep(sessionId, stepId)
    return step?.executionContext
  }
}

// Singleton instance
export const getWorkflowDebugger = () => WorkflowDebugger.getInstance()
