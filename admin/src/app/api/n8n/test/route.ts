import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWorkflowTestRunner } from '@/lib/workflow-test'
import { getEnvironmentManager } from '@/lib/workflow-environment'
import type { TestScenario, TestSuite } from '@/lib/workflow-test'

// GET - Obter scenarios, suites ou resultados de testes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const workflowId = searchParams.get('workflowId')

    switch (action) {
      case 'scenarios': {
        if (!workflowId) {
          return NextResponse.json(
            { error: 'workflowId is required' },
            { status: 400 }
          )
        }

        const scenarios = await prisma.workflowTestScenario.findMany({
          where: { workflowId },
          orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ scenarios })
      }

      case 'suites': {
        if (!workflowId) {
          return NextResponse.json(
            { error: 'workflowId is required' },
            { status: 400 }
          )
        }

        const suites = await prisma.workflowTestSuite.findMany({
          where: { workflowId },
          include: {
            scenarios: true
          },
          orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ suites })
      }

      case 'results': {
        const scenarioId = searchParams.get('scenarioId')
        const suiteId = searchParams.get('suiteId')
        const limit = parseInt(searchParams.get('limit') || '20')

        const where: { scenarioId?: string; suiteId?: string } = {}
        if (scenarioId) where.scenarioId = scenarioId
        if (suiteId) where.suiteId = suiteId

        const results = await prisma.workflowTestResult.findMany({
          where,
          orderBy: { startTime: 'desc' },
          take: limit
        })

        return NextResponse.json({ results })
      }

      case 'runs': {
        const workflowId = searchParams.get('workflowId')
        const limit = parseInt(searchParams.get('limit') || '20')

        const where = workflowId ? { workflowId } : {}

        const runs = await prisma.workflowTestRun.findMany({
          where,
          include: {
            results: true
          },
          orderBy: { startTime: 'desc' },
          take: limit
        })

        return NextResponse.json({ runs })
      }

      case 'active': {
        const runner = getWorkflowTestRunner()
        const activeRuns = runner.getActiveTestRuns()

        return NextResponse.json({ activeRuns })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Valid actions: scenarios, suites, results, runs, active' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in Test API GET:', error)
    return NextResponse.json(
      {
        error: 'Failed to get test data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - Criar scenario, suite ou executar testes
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'create-scenario': {
        const {
          workflowId,
          name,
          description,
          type,
          inputData,
          expectedOutput,
          timeout,
          retries,
          tags,
          assertions
        } = body

        if (!workflowId || !name || !type) {
          return NextResponse.json(
            { error: 'workflowId, name, and type are required' },
            { status: 400 }
          )
        }

        const scenario = await prisma.workflowTestScenario.create({
          data: {
            workflowId,
            name,
            description,
            type,
            enabled: true,
            inputData: inputData as object,
            expectedOutput: expectedOutput as object,
            timeout,
            retries,
            tags: tags || [],
            assertions: assertions as object
          }
        })

        return NextResponse.json({ scenario })
      }

      case 'create-suite': {
        const { workflowId, name, description, scenarioIds } = body

        if (!workflowId || !name) {
          return NextResponse.json(
            { error: 'workflowId and name are required' },
            { status: 400 }
          )
        }

        const suite = await prisma.workflowTestSuite.create({
          data: {
            workflowId,
            name,
            description
          }
        })

        // Associar scenarios à suite
        if (scenarioIds && Array.isArray(scenarioIds)) {
          await prisma.workflowTestScenario.updateMany({
            where: {
              id: { in: scenarioIds }
            },
            data: {
              suiteId: suite.id
            }
          })
        }

        return NextResponse.json({ suite })
      }

      case 'run-scenario': {
        const { scenarioId, environment } = body

        if (!scenarioId) {
          return NextResponse.json(
            { error: 'scenarioId is required' },
            { status: 400 }
          )
        }

        const scenario = await prisma.workflowTestScenario.findUnique({
          where: { id: scenarioId }
        })

        if (!scenario) {
          return NextResponse.json(
            { error: 'Scenario not found' },
            { status: 404 }
          )
        }

        // Obter configuração do ambiente
        const envManager = getEnvironmentManager()
        const env = environment || envManager.getCurrentEnvironment().type
        const envConfig = envManager.getAllEnvironments().find(e => e.type === env)

        if (!envConfig) {
          return NextResponse.json(
            { error: 'Invalid environment' },
            { status: 400 }
          )
        }

        // Executar teste
        const runner = getWorkflowTestRunner()
        const testScenario: TestScenario = {
          id: scenario.id,
          name: scenario.name,
          description: scenario.description || undefined,
          type: scenario.type as 'unit' | 'integration' | 'e2e',
          workflowId: scenario.workflowId,
          enabled: scenario.enabled,
          inputData: scenario.inputData,
          expectedOutput: scenario.expectedOutput || undefined,
          timeout: scenario.timeout || undefined,
          retries: scenario.retries || undefined,
          tags: (scenario.tags as string[]) || undefined,
          assertions: scenario.assertions as never,
          createdAt: scenario.createdAt,
          updatedAt: scenario.updatedAt
        }

        const result = await runner.runScenario(
          testScenario,
          envConfig.n8nApiUrl,
          envConfig.n8nApiKey
        )

        // Salvar resultado no banco
        const savedResult = await prisma.workflowTestResult.create({
          data: {
            scenarioId: result.scenarioId,
            status: result.status,
            startTime: result.startTime,
            endTime: result.endTime,
            duration: result.duration,
            executionLog: result.executionLog as object,
            errors: result.errors as object,
            assertions: result.assertions as object,
            coverage: result.coverage as object
          }
        })

        return NextResponse.json({ result: savedResult })
      }

      case 'run-suite': {
        const { suiteId, environment } = body

        if (!suiteId) {
          return NextResponse.json(
            { error: 'suiteId is required' },
            { status: 400 }
          )
        }

        const suite = await prisma.workflowTestSuite.findUnique({
          where: { id: suiteId },
          include: {
            scenarios: true
          }
        })

        if (!suite) {
          return NextResponse.json(
            { error: 'Suite not found' },
            { status: 404 }
          )
        }

        // Obter configuração do ambiente
        const envManager = getEnvironmentManager()
        const env = environment || envManager.getCurrentEnvironment().type
        const envConfig = envManager.getAllEnvironments().find(e => e.type === env)

        if (!envConfig) {
          return NextResponse.json(
            { error: 'Invalid environment' },
            { status: 400 }
          )
        }

        // Converter scenarios do banco para o formato esperado
        const testSuite: TestSuite = {
          id: suite.id,
          name: suite.name,
          description: suite.description || undefined,
          workflowId: suite.workflowId,
          scenarios: suite.scenarios.map((s): TestScenario => ({
            id: s.id,
            name: s.name,
            description: s.description || undefined,
            type: s.type as 'unit' | 'integration' | 'e2e',
            workflowId: s.workflowId,
            enabled: s.enabled,
            inputData: s.inputData,
            expectedOutput: s.expectedOutput || undefined,
            timeout: s.timeout || undefined,
            retries: s.retries || undefined,
            tags: (s.tags as string[]) || undefined,
            assertions: s.assertions as never,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt
          })),
          createdAt: suite.createdAt,
          updatedAt: suite.updatedAt
        }

        // Executar suite
        const runner = getWorkflowTestRunner()
        const testRun = await runner.runSuite(
          testSuite,
          env as 'development' | 'staging' | 'production',
          envConfig.n8nApiUrl,
          envConfig.n8nApiKey
        )

        // Salvar run no banco
        const savedRun = await prisma.workflowTestRun.create({
          data: {
            suiteId: testRun.suiteId,
            workflowId: testRun.workflowId,
            environment: testRun.environment,
            status: testRun.status,
            startTime: testRun.startTime,
            endTime: testRun.endTime,
            totalScenarios: testRun.totalScenarios,
            passed: testRun.passed,
            failed: testRun.failed,
            skipped: testRun.skipped
          }
        })

        // Salvar resultados individuais
        for (const result of testRun.results) {
          await prisma.workflowTestResult.create({
            data: {
              runId: savedRun.id,
              scenarioId: result.scenarioId,
              status: result.status,
              startTime: result.startTime,
              endTime: result.endTime,
              duration: result.duration,
              executionLog: result.executionLog as object,
              errors: result.errors as object,
              assertions: result.assertions as object,
              coverage: result.coverage as object
            }
          })
        }

        return NextResponse.json({ run: savedRun })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Valid actions: create-scenario, create-suite, run-scenario, run-suite' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in Test API POST:', error)
    return NextResponse.json(
      {
        error: 'Failed to execute test operation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar scenario ou suite
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { type, id, ...data } = body

    if (!type || !id) {
      return NextResponse.json(
        { error: 'type and id are required' },
        { status: 400 }
      )
    }

    if (type === 'scenario') {
      const scenario = await prisma.workflowTestScenario.update({
        where: { id },
        data: {
          ...data,
          inputData: data.inputData ? (data.inputData as object) : undefined,
          expectedOutput: data.expectedOutput ? (data.expectedOutput as object) : undefined,
          assertions: data.assertions ? (data.assertions as object) : undefined
        }
      })

      return NextResponse.json({ scenario })
    } else if (type === 'suite') {
      const suite = await prisma.workflowTestSuite.update({
        where: { id },
        data
      })

      return NextResponse.json({ suite })
    }

    return NextResponse.json(
      { error: 'Invalid type. Must be scenario or suite' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in Test API PATCH:', error)
    return NextResponse.json(
      {
        error: 'Failed to update',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Deletar scenario ou suite
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        { error: 'type and id are required' },
        { status: 400 }
      )
    }

    if (type === 'scenario') {
      await prisma.workflowTestScenario.delete({
        where: { id }
      })
    } else if (type === 'suite') {
      await prisma.workflowTestSuite.delete({
        where: { id }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be scenario or suite' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in Test API DELETE:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
