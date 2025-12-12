/**
 * Sistema de Analytics e Análise Preditiva para Workflows
 *
 * Analisa padrões de execução, detecta anomalias e fornece insights
 * para otimização de workflows.
 */

// Tipos de análise
export enum AnalysisType {
  PERFORMANCE = 'performance',
  RELIABILITY = 'reliability',
  COST = 'cost',
  USAGE = 'usage',
}

// Severidade de recomendação
export enum RecommendationSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Estatísticas de performance
export interface PerformanceStats {
  avgExecutionTime: number
  p50ExecutionTime: number
  p95ExecutionTime: number
  p99ExecutionTime: number
  minExecutionTime: number
  maxExecutionTime: number
  successRate: number
  failureRate: number
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  errorPatterns: ErrorPattern[]
  bottlenecks: Bottleneck[]
  trendDirection: 'improving' | 'stable' | 'degrading'
  comparisonToPreviousPeriod: {
    executionTimeDelta: number
    successRateDelta: number
    executionCountDelta: number
  }
}

// Padrão de erro
export interface ErrorPattern {
  errorType: string
  message: string
  occurrences: number
  percentage: number
  affectedNodes: string[]
  firstSeen: Date
  lastSeen: Date
  trend: 'increasing' | 'stable' | 'decreasing'
}

// Gargalo identificado
export interface Bottleneck {
  nodeId: string
  nodeName: string
  avgDuration: number
  percentageOfTotal: number
  occurrences: number
  impactLevel: 'low' | 'medium' | 'high' | 'critical'
  suggestions: string[]
}

// Recomendação de otimização
export interface Recommendation {
  id: string
  type: AnalysisType
  severity: RecommendationSeverity
  title: string
  description: string
  impact: string
  estimatedTimeSaved?: number
  estimatedCostSaved?: number
  actions: RecommendationAction[]
  priority: number
  implementationComplexity: 'low' | 'medium' | 'high'
  affectedWorkflows: string[]
}

// Ação de recomendação
export interface RecommendationAction {
  id: string
  description: string
  automated: boolean
  command?: string
  parameters?: Record<string, unknown>
}

// Análise de workflow
export interface WorkflowAnalysis {
  workflowId: string
  workflowName: string
  analyzedAt: Date
  period: {
    start: Date
    end: Date
  }
  performanceStats: PerformanceStats
  recommendations: Recommendation[]
  healthScore: number // 0-100
  costAnalysis: {
    totalExecutions: number
    avgCostPerExecution: number
    totalCost: number
    projectedMonthlyCost: number
  }
  usagePatterns: {
    peakHours: number[]
    peakDays: string[]
    avgExecutionsPerDay: number
    trendin: 'up' | 'stable' | 'down'
  }
}

/**
 * Classe singleton para análise de workflows
 */
export class WorkflowAnalytics {
  private static instance: WorkflowAnalytics
  private analysisCache: Map<string, WorkflowAnalysis> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutos

  private constructor() {}

  /**
   * Obtém instância singleton
   */
  public static getInstance(): WorkflowAnalytics {
    if (!WorkflowAnalytics.instance) {
      WorkflowAnalytics.instance = new WorkflowAnalytics()
    }
    return WorkflowAnalytics.instance
  }

  /**
   * Analisa performance de um workflow
   */
  public async analyzePerformance(
    workflowId: string,
    executions: Array<{
      id: string
      status: string
      startedAt: Date
      finishedAt: Date | null
      duration: number | null
      errorMessage: string | null
      nodesExecuted: number
    }>
  ): Promise<PerformanceStats> {
    if (executions.length === 0) {
      return this.getEmptyPerformanceStats()
    }

    // Calcular métricas básicas
    const successfulExecutions = executions.filter(e => e.status === 'success')
    const failedExecutions = executions.filter(e => e.status === 'error' || e.status === 'failed')

    const durations = executions
      .filter(e => e.duration !== null)
      .map(e => e.duration as number)
      .sort((a, b) => a - b)

    const avgExecutionTime = durations.reduce((sum, d) => sum + d, 0) / durations.length || 0
    const successRate = (successfulExecutions.length / executions.length) * 100
    const failureRate = 100 - successRate

    // Calcular percentis
    const p50 = this.calculatePercentile(durations, 50)
    const p95 = this.calculatePercentile(durations, 95)
    const p99 = this.calculatePercentile(durations, 99)

    // Detectar padrões de erro
    const errorPatterns = this.detectErrorPatterns(failedExecutions)

    // Identificar gargalos
    const bottlenecks = this.identifyBottlenecks(executions)

    // Análise de tendência
    const trendDirection = this.analyzeTrend(executions)

    // Comparação com período anterior
    const comparison = this.compareWithPreviousPeriod(executions)

    return {
      avgExecutionTime: Math.round(avgExecutionTime),
      p50ExecutionTime: Math.round(p50),
      p95ExecutionTime: Math.round(p95),
      p99ExecutionTime: Math.round(p99),
      minExecutionTime: Math.min(...durations) || 0,
      maxExecutionTime: Math.max(...durations) || 0,
      successRate: Math.round(successRate * 100) / 100,
      failureRate: Math.round(failureRate * 100) / 100,
      totalExecutions: executions.length,
      successfulExecutions: successfulExecutions.length,
      failedExecutions: failedExecutions.length,
      errorPatterns,
      bottlenecks,
      trendDirection,
      comparisonToPreviousPeriod: comparison,
    }
  }

  /**
   * Gera recomendações baseadas em análise
   */
  public generateRecommendations(
    workflowId: string,
    workflowName: string,
    stats: PerformanceStats,
    workflowData?: unknown
  ): Recommendation[] {
    const recommendations: Recommendation[] = []
    let recommendationId = 1

    // Recomendação: Taxa de sucesso baixa
    if (stats.successRate < 95) {
      recommendations.push({
        id: `rec-${recommendationId++}`,
        type: AnalysisType.RELIABILITY,
        severity: stats.successRate < 80 ? RecommendationSeverity.CRITICAL : RecommendationSeverity.HIGH,
        title: 'Taxa de Sucesso Abaixo do Esperado',
        description: `O workflow tem uma taxa de sucesso de ${stats.successRate.toFixed(1)}%, abaixo dos 95% recomendados.`,
        impact: `${stats.failedExecutions} execuções falharam nos últimos registros.`,
        actions: [
          {
            id: 'action-1',
            description: 'Adicionar retry logic nos nós críticos',
            automated: false,
          },
          {
            id: 'action-2',
            description: 'Implementar error handling robusto',
            automated: false,
          },
          {
            id: 'action-3',
            description: 'Revisar padrões de erro identificados',
            automated: false,
          },
        ],
        priority: stats.successRate < 80 ? 1 : 2,
        implementationComplexity: 'medium',
        affectedWorkflows: [workflowId],
      })
    }

    // Recomendação: Performance degradada
    if (stats.trendDirection === 'degrading') {
      recommendations.push({
        id: `rec-${recommendationId++}`,
        type: AnalysisType.PERFORMANCE,
        severity: RecommendationSeverity.MEDIUM,
        title: 'Performance em Degradação',
        description: 'O tempo de execução está aumentando ao longo do tempo.',
        impact: `Tempo médio aumentou ${Math.abs(stats.comparisonToPreviousPeriod.executionTimeDelta)}ms em relação ao período anterior.`,
        estimatedTimeSaved: Math.abs(stats.comparisonToPreviousPeriod.executionTimeDelta) * stats.totalExecutions,
        actions: [
          {
            id: 'action-1',
            description: 'Analisar gargalos identificados',
            automated: false,
          },
          {
            id: 'action-2',
            description: 'Otimizar queries de banco de dados',
            automated: false,
          },
          {
            id: 'action-3',
            description: 'Implementar cache quando apropriado',
            automated: false,
          },
        ],
        priority: 3,
        implementationComplexity: 'medium',
        affectedWorkflows: [workflowId],
      })
    }

    // Recomendação: Gargalos críticos
    const criticalBottlenecks = stats.bottlenecks.filter(b => b.impactLevel === 'critical' || b.impactLevel === 'high')
    if (criticalBottlenecks.length > 0) {
      const bottleneck = criticalBottlenecks[0]
      recommendations.push({
        id: `rec-${recommendationId++}`,
        type: AnalysisType.PERFORMANCE,
        severity: RecommendationSeverity.HIGH,
        title: `Gargalo Identificado: ${bottleneck.nodeName}`,
        description: `O nó "${bottleneck.nodeName}" está consumindo ${bottleneck.percentageOfTotal.toFixed(1)}% do tempo total de execução.`,
        impact: `Otimizar este nó pode reduzir o tempo total em até ${bottleneck.percentageOfTotal.toFixed(0)}%.`,
        estimatedTimeSaved: (stats.avgExecutionTime * bottleneck.percentageOfTotal) / 100,
        actions: bottleneck.suggestions.map((suggestion, idx) => ({
          id: `action-${idx + 1}`,
          description: suggestion,
          automated: false,
        })),
        priority: 2,
        implementationComplexity: 'medium',
        affectedWorkflows: [workflowId],
      })
    }

    // Recomendação: Tempo de execução alto
    if (stats.avgExecutionTime > 10000) { // > 10 segundos
      recommendations.push({
        id: `rec-${recommendationId++}`,
        type: AnalysisType.PERFORMANCE,
        severity: RecommendationSeverity.MEDIUM,
        title: 'Tempo de Execução Elevado',
        description: `O tempo médio de execução é ${(stats.avgExecutionTime / 1000).toFixed(1)}s, acima do recomendado (5s).`,
        impact: 'Execuções lentas podem afetar a experiência do usuário e aumentar custos.',
        estimatedTimeSaved: stats.avgExecutionTime - 5000,
        actions: [
          {
            id: 'action-1',
            description: 'Implementar processamento paralelo onde possível',
            automated: false,
          },
          {
            id: 'action-2',
            description: 'Reduzir número de chamadas HTTP',
            automated: false,
          },
          {
            id: 'action-3',
            description: 'Otimizar transformações de dados',
            automated: false,
          },
        ],
        priority: 4,
        implementationComplexity: 'medium',
        affectedWorkflows: [workflowId],
      })
    }

    // Recomendação: Padrões de erro recorrentes
    const frequentErrors = stats.errorPatterns.filter(e => e.occurrences > 5 && e.trend === 'increasing')
    if (frequentErrors.length > 0) {
      const error = frequentErrors[0]
      recommendations.push({
        id: `rec-${recommendationId++}`,
        type: AnalysisType.RELIABILITY,
        severity: RecommendationSeverity.HIGH,
        title: `Erro Recorrente: ${error.errorType}`,
        description: `O erro "${error.errorType}" ocorreu ${error.occurrences} vezes (${error.percentage.toFixed(1)}% das falhas) e está em tendência de aumento.`,
        impact: `${error.occurrences} execuções falharam devido a este erro.`,
        actions: [
          {
            id: 'action-1',
            description: `Revisar e corrigir nós afetados: ${error.affectedNodes.join(', ')}`,
            automated: false,
          },
          {
            id: 'action-2',
            description: 'Adicionar tratamento específico para este erro',
            automated: false,
          },
        ],
        priority: 2,
        implementationComplexity: 'low',
        affectedWorkflows: [workflowId],
      })
    }

    // Ordenar por prioridade
    return recommendations.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Calcula health score do workflow (0-100)
   */
  public calculateHealthScore(stats: PerformanceStats): number {
    let score = 100

    // Penalizar por baixa taxa de sucesso
    if (stats.successRate < 95) {
      score -= (95 - stats.successRate) * 2
    }

    // Penalizar por performance degradada
    if (stats.trendDirection === 'degrading') {
      score -= 10
    }

    // Penalizar por gargalos críticos
    const criticalBottlenecks = stats.bottlenecks.filter(
      b => b.impactLevel === 'critical' || b.impactLevel === 'high'
    )
    score -= criticalBottlenecks.length * 5

    // Penalizar por erros recorrentes
    const frequentErrors = stats.errorPatterns.filter(e => e.occurrences > 5)
    score -= frequentErrors.length * 3

    // Garantir que está entre 0 e 100
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Calcula percentil
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) return 0
    const index = Math.ceil((percentile / 100) * sortedValues.length) - 1
    return sortedValues[Math.max(0, index)] || 0
  }

  /**
   * Detecta padrões de erro
   */
  private detectErrorPatterns(
    failedExecutions: Array<{
      errorMessage: string | null
      startedAt: Date
    }>
  ): ErrorPattern[] {
    if (failedExecutions.length === 0) return []

    const errorMap = new Map<string, ErrorPattern>()

    failedExecutions.forEach(exec => {
      if (!exec.errorMessage) return

      // Extrair tipo de erro (primeira linha geralmente)
      const errorType = exec.errorMessage.split('\n')[0].substring(0, 100)

      if (!errorMap.has(errorType)) {
        errorMap.set(errorType, {
          errorType,
          message: exec.errorMessage,
          occurrences: 0,
          percentage: 0,
          affectedNodes: [],
          firstSeen: exec.startedAt,
          lastSeen: exec.startedAt,
          trend: 'stable',
        })
      }

      const pattern = errorMap.get(errorType)!
      pattern.occurrences++
      if (exec.startedAt < pattern.firstSeen) {
        pattern.firstSeen = exec.startedAt
      }
      if (exec.startedAt > pattern.lastSeen) {
        pattern.lastSeen = exec.startedAt
      }
    })

    // Calcular percentagens
    errorMap.forEach(pattern => {
      pattern.percentage = (pattern.occurrences / failedExecutions.length) * 100
    })

    return Array.from(errorMap.values())
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 10) // Top 10 erros
  }

  /**
   * Identifica gargalos
   */
  private identifyBottlenecks(
    executions: Array<{
      duration: number | null
      nodesExecuted: number
    }>
  ): Bottleneck[] {
    // Simulação simplificada - em produção, precisaria de dados detalhados por nó
    const bottlenecks: Bottleneck[] = []

    const avgDuration = executions.reduce((sum, e) => sum + (e.duration || 0), 0) / executions.length

    // Se tempo médio > 5s, considerar como possível gargalo
    if (avgDuration > 5000) {
      bottlenecks.push({
        nodeId: 'unknown',
        nodeName: 'Nó não identificado',
        avgDuration: avgDuration,
        percentageOfTotal: 100,
        occurrences: executions.length,
        impactLevel: avgDuration > 15000 ? 'critical' : avgDuration > 10000 ? 'high' : 'medium',
        suggestions: [
          'Analisar logs detalhados para identificar nó específico',
          'Implementar cache para reduzir chamadas repetidas',
          'Otimizar transformações de dados',
        ],
      })
    }

    return bottlenecks
  }

  /**
   * Analisa tendência de performance
   */
  private analyzeTrend(
    executions: Array<{
      duration: number | null
      startedAt: Date
    }>
  ): 'improving' | 'stable' | 'degrading' {
    if (executions.length < 10) return 'stable'

    const sortedByDate = [...executions].sort(
      (a, b) => a.startedAt.getTime() - b.startedAt.getTime()
    )

    const firstHalf = sortedByDate.slice(0, Math.floor(sortedByDate.length / 2))
    const secondHalf = sortedByDate.slice(Math.floor(sortedByDate.length / 2))

    const avgFirst = firstHalf.reduce((sum, e) => sum + (e.duration || 0), 0) / firstHalf.length
    const avgSecond = secondHalf.reduce((sum, e) => sum + (e.duration || 0), 0) / secondHalf.length

    const percentageChange = ((avgSecond - avgFirst) / avgFirst) * 100

    if (percentageChange > 10) return 'degrading'
    if (percentageChange < -10) return 'improving'
    return 'stable'
  }

  /**
   * Compara com período anterior
   */
  private compareWithPreviousPeriod(
    executions: Array<{
      duration: number | null
      status: string
      startedAt: Date
    }>
  ): {
    executionTimeDelta: number
    successRateDelta: number
    executionCountDelta: number
  } {
    // Simulação simplificada
    return {
      executionTimeDelta: 0,
      successRateDelta: 0,
      executionCountDelta: 0,
    }
  }

  /**
   * Retorna estatísticas vazias
   */
  private getEmptyPerformanceStats(): PerformanceStats {
    return {
      avgExecutionTime: 0,
      p50ExecutionTime: 0,
      p95ExecutionTime: 0,
      p99ExecutionTime: 0,
      minExecutionTime: 0,
      maxExecutionTime: 0,
      successRate: 0,
      failureRate: 0,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      errorPatterns: [],
      bottlenecks: [],
      trendDirection: 'stable',
      comparisonToPreviousPeriod: {
        executionTimeDelta: 0,
        successRateDelta: 0,
        executionCountDelta: 0,
      },
    }
  }

  /**
   * Limpa cache antigo
   */
  public clearExpiredCache(): void {
    const now = Date.now()
    this.analysisCache.forEach((analysis, key) => {
      if (now - analysis.analyzedAt.getTime() > this.CACHE_TTL) {
        this.analysisCache.delete(key)
      }
    })
  }
}

// Export singleton
export const workflowAnalytics = WorkflowAnalytics.getInstance()
