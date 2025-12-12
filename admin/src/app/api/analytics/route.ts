import { NextRequest, NextResponse } from 'next/server'
import { workflowAnalytics } from '@/lib/workflow-analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'analyze-performance': {
        const workflowId = searchParams.get('workflowId')
        if (!workflowId) {
          return NextResponse.json({ error: 'workflowId is required' }, { status: 400 })
        }

        // Buscar execuções do workflow (simulado - em produção viria do banco)
        const executionsResponse = await fetch(
          `${request.nextUrl.origin}/api/n8n/executions?workflowId=${workflowId}&limit=100`
        )
        const executionsData = await executionsResponse.json()
        const executions = executionsData.executions || []

        // Mapear para formato esperado
        const mappedExecutions = executions.map((exec: {
          id: string
          status: string
          startedAt: string
          finishedAt: string | null
          duration: number | null
          errorMessage: string | null
          nodesExecuted: number
        }) => ({
          ...exec,
          startedAt: new Date(exec.startedAt),
          finishedAt: exec.finishedAt ? new Date(exec.finishedAt) : null,
        }))

        const stats = await workflowAnalytics.analyzePerformance(workflowId, mappedExecutions)

        return NextResponse.json({ stats })
      }

      case 'generate-recommendations': {
        const workflowId = searchParams.get('workflowId')
        const workflowName = searchParams.get('workflowName') || 'Workflow'

        if (!workflowId) {
          return NextResponse.json({ error: 'workflowId is required' }, { status: 400 })
        }

        // Buscar execuções
        const executionsResponse = await fetch(
          `${request.nextUrl.origin}/api/n8n/executions?workflowId=${workflowId}&limit=100`
        )
        const executionsData = await executionsResponse.json()
        const executions = executionsData.executions || []

        const mappedExecutions = executions.map((exec: {
          id: string
          status: string
          startedAt: string
          finishedAt: string | null
          duration: number | null
          errorMessage: string | null
          nodesExecuted: number
        }) => ({
          ...exec,
          startedAt: new Date(exec.startedAt),
          finishedAt: exec.finishedAt ? new Date(exec.finishedAt) : null,
        }))

        const stats = await workflowAnalytics.analyzePerformance(workflowId, mappedExecutions)
        const recommendations = workflowAnalytics.generateRecommendations(
          workflowId,
          workflowName,
          stats
        )

        return NextResponse.json({ recommendations, stats })
      }

      case 'calculate-health-score': {
        const workflowId = searchParams.get('workflowId')
        if (!workflowId) {
          return NextResponse.json({ error: 'workflowId is required' }, { status: 400 })
        }

        // Buscar execuções
        const executionsResponse = await fetch(
          `${request.nextUrl.origin}/api/n8n/executions?workflowId=${workflowId}&limit=100`
        )
        const executionsData = await executionsResponse.json()
        const executions = executionsData.executions || []

        const mappedExecutions = executions.map((exec: {
          id: string
          status: string
          startedAt: string
          finishedAt: string | null
          duration: number | null
          errorMessage: string | null
          nodesExecuted: number
        }) => ({
          ...exec,
          startedAt: new Date(exec.startedAt),
          finishedAt: exec.finishedAt ? new Date(exec.finishedAt) : null,
        }))

        const stats = await workflowAnalytics.analyzePerformance(workflowId, mappedExecutions)
        const healthScore = workflowAnalytics.calculateHealthScore(stats)

        return NextResponse.json({ healthScore, stats })
      }

      case 'clear-cache': {
        workflowAnalytics.clearExpiredCache()
        return NextResponse.json({ success: true, message: 'Cache cleared' })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in Analytics GET:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
