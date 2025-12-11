import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar health checks
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {}
    if (workflowId) where.workflowId = workflowId

    const healthChecks = await prisma.workflowHealthCheck.findMany({
      where,
      orderBy: { checkedAt: 'desc' },
      take: limit
    })

    return NextResponse.json({ healthChecks })
  } catch (error) {
    console.error('Error fetching health checks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health checks', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Executar health check de um workflow
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { workflowId, workflowName } = body

    if (!workflowId || !workflowName) {
      return NextResponse.json(
        { error: 'workflowId and workflowName are required' },
        { status: 400 }
      )
    }

    const startTime = Date.now()
    const checks: Record<string, string> = {}
    let status = 'healthy'
    let errorMessage = null

    try {
      // 1. Verificar se o workflow existe no n8n
      const n8nApiUrl = process.env.N8N_API_URL
      const n8nApiKey = process.env.N8N_API_KEY

      if (!n8nApiUrl || !n8nApiKey) {
        throw new Error('N8N credentials not configured')
      }

      const workflowResponse = await fetch(`${n8nApiUrl}/workflows/${workflowId}`, {
        headers: {
          'X-N8N-API-KEY': n8nApiKey,
          'Accept': 'application/json'
        }
      })

      if (workflowResponse.ok) {
        checks.workflow = 'ok'
      } else if (workflowResponse.status === 404) {
        checks.workflow = 'not_found'
        status = 'down'
        errorMessage = 'Workflow not found in n8n'
      } else {
        checks.workflow = 'error'
        status = 'degraded'
        errorMessage = `Failed to fetch workflow: ${workflowResponse.status}`
      }

      // 2. Verificar banco de dados (se há registros de execução recentes)
      const recentExecutions = await prisma.workflowExecution.count({
        where: {
          workflowId,
          startedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24h
          }
        }
      })

      if (recentExecutions > 0) {
        checks.database = 'ok'

        // Verificar se há muitos erros recentes
        const recentErrors = await prisma.workflowExecution.count({
          where: {
            workflowId,
            status: 'error',
            startedAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        })

        const errorRate = recentErrors / recentExecutions
        if (errorRate > 0.5) {
          status = 'degraded'
          checks.errorRate = `high (${Math.round(errorRate * 100)}%)`
        } else {
          checks.errorRate = `ok (${Math.round(errorRate * 100)}%)`
        }
      } else {
        checks.database = 'no_recent_executions'
      }

      // 3. Verificar conectividade com n8n API
      const pingResponse = await fetch(`${n8nApiUrl}/workflows?limit=1`, {
        headers: {
          'X-N8N-API-KEY': n8nApiKey,
          'Accept': 'application/json'
        }
      })

      if (pingResponse.ok) {
        checks.api = 'ok'
      } else {
        checks.api = 'error'
        status = 'degraded'
      }

    } catch (error) {
      status = 'down'
      errorMessage = error instanceof Error ? error.message : 'Unknown error'
      checks.error = errorMessage
    }

    const responseTime = Date.now() - startTime

    // Salvar resultado do health check
    const healthCheck = await prisma.workflowHealthCheck.create({
      data: {
        workflowId,
        workflowName,
        status,
        responseTime,
        checks,
        errorMessage
      }
    })

    // Se o status for degraded ou down, criar um alerta
    if (status !== 'healthy') {
      await prisma.workflowAlert.create({
        data: {
          type: status === 'down' ? 'critical' : 'warning',
          title: `Health check ${status} para ${workflowName}`,
          message: errorMessage || `Workflow está com status ${status}`,
          workflowId,
          workflowName,
          status: 'pending'
        }
      })
    }

    return NextResponse.json({ healthCheck })
  } catch (error) {
    console.error('Error running health check:', error)
    return NextResponse.json(
      { error: 'Failed to run health check', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
