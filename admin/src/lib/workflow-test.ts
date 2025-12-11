/**
 * Sistema de Testes Automatizados para Workflows
 * Fase 3.1 - Parte 2
 */

export type TestScenarioType = 'unit' | 'integration' | 'e2e'
export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped'

export interface TestScenario {
  id: string
  name: string
  description?: string
  type: TestScenarioType
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

export interface TestAssertion {
  id: string
  type: 'equals' | 'contains' | 'matches' | 'exists' | 'notExists' | 'greaterThan' | 'lessThan'
  path: string // JSONPath para acessar valor no resultado
  expectedValue?: unknown
  message?: string
}

export interface TestResult {
  id: string
  scenarioId: string
  status: TestStatus
  startTime: Date
  endTime?: Date
  duration?: number
  executionLog: TestExecutionLog[]
  errors?: TestError[]
  assertions?: AssertionResult[]
  coverage?: TestCoverage
}

export interface TestExecutionLog {
  timestamp: Date
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  data?: unknown
}

export interface TestError {
  type: string
  message: string
  stack?: string
  nodeId?: string
  nodeName?: string
}

export interface AssertionResult {
  assertionId: string
  passed: boolean
  message: string
  expected?: unknown
  actual?: unknown
}

export interface TestCoverage {
  totalNodes: number
  executedNodes: number
  percentage: number
  nodes: {
    id: string
    name: string
    executed: boolean
  }[]
}

export interface TestSuite {
  id: string
  name: string
  description?: string
  workflowId: string
  scenarios: TestScenario[]
  createdAt: Date
  updatedAt: Date
}

export interface TestRun {
  id: string
  suiteId: string
  workflowId: string
  environment: 'development' | 'staging' | 'production'
  status: 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  totalScenarios: number
  passed: number
  failed: number
  skipped: number
  results: TestResult[]
}

class WorkflowTestRunner {
  private static instance: WorkflowTestRunner
  private activeRuns: Map<string, TestRun> = new Map()

  private constructor() {}

  static getInstance(): WorkflowTestRunner {
    if (!WorkflowTestRunner.instance) {
      WorkflowTestRunner.instance = new WorkflowTestRunner()
    }
    return WorkflowTestRunner.instance
  }

  /**
   * Executa um cenário de teste
   */
  async runScenario(
    scenario: TestScenario,
    n8nApiUrl: string,
    n8nApiKey?: string
  ): Promise<TestResult> {
    const result: TestResult = {
      id: `result-${Date.now()}`,
      scenarioId: scenario.id,
      status: 'running',
      startTime: new Date(),
      executionLog: [],
      errors: [],
      assertions: []
    }

    try {
      this.log(result, 'info', `Starting test scenario: ${scenario.name}`)

      // Executar workflow com dados de entrada
      const executionResult = await this.executeWorkflow(
        scenario.workflowId,
        scenario.inputData,
        n8nApiUrl,
        n8nApiKey,
        scenario.timeout
      )

      this.log(result, 'info', 'Workflow executed successfully')

      // Verificar assertions
      if (scenario.assertions && scenario.assertions.length > 0) {
        result.assertions = await this.validateAssertions(
          scenario.assertions,
          executionResult
        )
      }

      // Verificar output esperado
      if (scenario.expectedOutput) {
        const outputMatches = this.compareOutput(
          executionResult,
          scenario.expectedOutput
        )

        if (!outputMatches) {
          result.errors?.push({
            type: 'OutputMismatch',
            message: 'Output does not match expected value'
          })
        }
      }

      // Calcular cobertura
      result.coverage = this.calculateCoverage(executionResult)

      // Determinar status final
      const hasErrors = (result.errors?.length ?? 0) > 0
      const hasFailedAssertions = result.assertions?.some(a => !a.passed) ?? false

      result.status = (hasErrors || hasFailedAssertions) ? 'failed' : 'passed'

      this.log(result, 'info', `Test ${result.status}`)
    } catch (error) {
      result.status = 'failed'
      result.errors?.push({
        type: 'ExecutionError',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })

      this.log(result, 'error', `Test failed: ${error}`)
    } finally {
      result.endTime = new Date()
      result.duration = result.endTime.getTime() - result.startTime.getTime()
    }

    return result
  }

  /**
   * Executa uma suite completa de testes
   */
  async runSuite(
    suite: TestSuite,
    environment: 'development' | 'staging' | 'production',
    n8nApiUrl: string,
    n8nApiKey?: string
  ): Promise<TestRun> {
    const testRun: TestRun = {
      id: `run-${Date.now()}`,
      suiteId: suite.id,
      workflowId: suite.workflowId,
      environment,
      status: 'running',
      startTime: new Date(),
      totalScenarios: suite.scenarios.filter(s => s.enabled).length,
      passed: 0,
      failed: 0,
      skipped: 0,
      results: []
    }

    this.activeRuns.set(testRun.id, testRun)

    try {
      const enabledScenarios = suite.scenarios.filter(s => s.enabled)

      for (const scenario of enabledScenarios) {
        const result = await this.runScenario(scenario, n8nApiUrl, n8nApiKey)
        testRun.results.push(result)

        if (result.status === 'passed') {
          testRun.passed++
        } else if (result.status === 'failed') {
          testRun.failed++
        } else if (result.status === 'skipped') {
          testRun.skipped++
        }
      }

      testRun.status = testRun.failed > 0 ? 'failed' : 'completed'
    } catch (error) {
      testRun.status = 'failed'
    } finally {
      testRun.endTime = new Date()
    }

    return testRun
  }

  /**
   * Executa um workflow via n8n API
   */
  private async executeWorkflow(
    workflowId: string,
    inputData: unknown,
    n8nApiUrl: string,
    n8nApiKey?: string,
    timeout: number = 30000
  ): Promise<unknown> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      if (n8nApiKey) {
        headers['X-N8N-API-KEY'] = n8nApiKey
      }

      const response = await fetch(`${n8nApiUrl}/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: inputData }),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Valida assertions
   */
  private async validateAssertions(
    assertions: TestAssertion[],
    executionResult: unknown
  ): Promise<AssertionResult[]> {
    const results: AssertionResult[] = []

    for (const assertion of assertions) {
      const actualValue = this.getValueByPath(executionResult, assertion.path)
      let passed = false
      let message = assertion.message || `Assertion ${assertion.type} failed`

      switch (assertion.type) {
        case 'equals':
          passed = JSON.stringify(actualValue) === JSON.stringify(assertion.expectedValue)
          message = passed
            ? `Value equals expected`
            : `Expected ${JSON.stringify(assertion.expectedValue)}, got ${JSON.stringify(actualValue)}`
          break

        case 'contains':
          passed = JSON.stringify(actualValue).includes(String(assertion.expectedValue))
          message = passed
            ? `Value contains expected substring`
            : `Value does not contain ${assertion.expectedValue}`
          break

        case 'exists':
          passed = actualValue !== undefined && actualValue !== null
          message = passed
            ? `Value exists`
            : `Value does not exist at path ${assertion.path}`
          break

        case 'notExists':
          passed = actualValue === undefined || actualValue === null
          message = passed
            ? `Value does not exist (as expected)`
            : `Value exists at path ${assertion.path} but should not`
          break

        case 'greaterThan':
          passed = Number(actualValue) > Number(assertion.expectedValue)
          message = passed
            ? `${actualValue} > ${assertion.expectedValue}`
            : `${actualValue} is not greater than ${assertion.expectedValue}`
          break

        case 'lessThan':
          passed = Number(actualValue) < Number(assertion.expectedValue)
          message = passed
            ? `${actualValue} < ${assertion.expectedValue}`
            : `${actualValue} is not less than ${assertion.expectedValue}`
          break

        case 'matches':
          const regex = new RegExp(String(assertion.expectedValue))
          passed = regex.test(String(actualValue))
          message = passed
            ? `Value matches pattern`
            : `Value does not match pattern ${assertion.expectedValue}`
          break
      }

      results.push({
        assertionId: assertion.id,
        passed,
        message,
        expected: assertion.expectedValue,
        actual: actualValue
      })
    }

    return results
  }

  /**
   * Obtém valor de um objeto usando JSONPath simplificado
   */
  private getValueByPath(obj: unknown, path: string): unknown {
    if (!path || !obj) return undefined

    const parts = path.split('.')
    let current: unknown = obj

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined
      }

      if (typeof current === 'object' && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }

    return current
  }

  /**
   * Compara output com valor esperado
   */
  private compareOutput(actual: unknown, expected: unknown): boolean {
    return JSON.stringify(actual) === JSON.stringify(expected)
  }

  /**
   * Calcula cobertura de nós do workflow
   */
  private calculateCoverage(executionResult: unknown): TestCoverage {
    // Implementação simplificada - deve ser expandida conforme estrutura do n8n
    const mockNodes = [
      { id: 'node1', name: 'Start', executed: true },
      { id: 'node2', name: 'Process', executed: true },
      { id: 'node3', name: 'End', executed: true }
    ]

    const executedNodes = mockNodes.filter(n => n.executed).length

    return {
      totalNodes: mockNodes.length,
      executedNodes,
      percentage: (executedNodes / mockNodes.length) * 100,
      nodes: mockNodes
    }
  }

  /**
   * Adiciona log ao resultado do teste
   */
  private log(
    result: TestResult,
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    data?: unknown
  ): void {
    result.executionLog.push({
      timestamp: new Date(),
      level,
      message,
      data
    })
  }

  /**
   * Obtém status de um test run ativo
   */
  getTestRun(runId: string): TestRun | undefined {
    return this.activeRuns.get(runId)
  }

  /**
   * Lista todos os test runs ativos
   */
  getActiveTestRuns(): TestRun[] {
    return Array.from(this.activeRuns.values())
  }
}

// Singleton instance
export const getWorkflowTestRunner = () => WorkflowTestRunner.getInstance()
