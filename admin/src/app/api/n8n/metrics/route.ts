import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar métricas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')

    if (workflowId) {
      // Buscar métricas de um workflow específico
      const metrics = await prisma.workflowMetrics.findUnique({
        where: { workflowId }
      })

      return NextResponse.json({ metrics })
    }

    // Buscar todas as métricas
    const allMetrics = await prisma.workflowMetrics.findMany({
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ metrics: allMetrics })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Calcular e atualizar métricas de um workflow
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { workflowId, workflowName } = body

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      )
    }

    // Buscar todas as execuções do workflow
    const executions = await prisma.workflowExecution.findMany({
      where: { workflowId },
      orderBy: { startedAt: 'desc' }
    })

    if (executions.length === 0) {
      return NextResponse.json({
        message: 'No executions found for this workflow'
      })
    }

    // Calcular métricas
    const totalExecutions = executions.length
    const successfulRuns = executions.filter(e => e.status === 'success').length
    const failedRuns = executions.filter(e => e.status === 'error').length

    const durations = executions
      .filter(e => e.duration !== null)
      .map(e => e.duration as number)
      .sort((a, b) => a - b)

    const averageDuration = durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : null

    const p50Duration = durations.length > 0
      ? durations[Math.floor(durations.length * 0.5)]
      : null

    const p95Duration = durations.length > 0
      ? durations[Math.floor(durations.length * 0.95)]
      : null

    const p99Duration = durations.length > 0
      ? durations[Math.floor(durations.length * 0.99)]
      : null

    const uptime = totalExecutions > 0
      ? (successfulRuns / totalExecutions) * 100
      : null

    const lastSuccess = executions.find(e => e.status === 'success')
    const lastFailure = executions.find(e => e.status === 'error')

    const periodStart = executions[executions.length - 1].startedAt
    const periodEnd = executions[0].startedAt

    // Atualizar ou criar métricas
    const metrics = await prisma.workflowMetrics.upsert({
      where: { workflowId },
      update: {
        workflowName: workflowName || executions[0].workflowName,
        totalExecutions,
        successfulRuns,
        failedRuns,
        averageDuration,
        uptime,
        lastSuccessAt: lastSuccess?.finishedAt || null,
        lastFailureAt: lastFailure?.finishedAt || null,
        p50Duration,
        p95Duration,
        p99Duration,
        periodStart,
        periodEnd
      },
      create: {
        workflowId,
        workflowName: workflowName || executions[0].workflowName,
        totalExecutions,
        successfulRuns,
        failedRuns,
        averageDuration,
        uptime,
        lastSuccessAt: lastSuccess?.finishedAt || null,
        lastFailureAt: lastFailure?.finishedAt || null,
        p50Duration,
        p95Duration,
        p99Duration,
        periodStart,
        periodEnd
      }
    })

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Error calculating metrics:', error)
    return NextResponse.json(
      { error: 'Failed to calculate metrics', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
