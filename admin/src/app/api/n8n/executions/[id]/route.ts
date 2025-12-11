import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// GET - Buscar execução específica
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const execution = await prisma.workflowExecution.findUnique({
      where: { id },
      include: {
        logs: {
          orderBy: { timestamp: 'desc' }
        },
        alerts: true
      }
    })

    if (!execution) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ execution })
  } catch (error) {
    console.error('Error fetching execution:', error)
    return NextResponse.json(
      { error: 'Failed to fetch execution', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar execução
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const {
      status,
      finishedAt,
      duration,
      nodesExecuted,
      nodesSuccess,
      nodesError,
      outputData,
      errorMessage,
      errorStack
    } = body

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (finishedAt) updateData.finishedAt = new Date(finishedAt)
    if (duration !== undefined) updateData.duration = duration
    if (nodesExecuted !== undefined) updateData.nodesExecuted = nodesExecuted
    if (nodesSuccess !== undefined) updateData.nodesSuccess = nodesSuccess
    if (nodesError !== undefined) updateData.nodesError = nodesError
    if (outputData) updateData.outputData = outputData
    if (errorMessage) updateData.errorMessage = errorMessage
    if (errorStack) updateData.errorStack = errorStack

    const execution = await prisma.workflowExecution.update({
      where: { id },
      data: updateData,
      include: {
        logs: true,
        alerts: true
      }
    })

    // Se a execução falhou, criar um alerta
    if (status === 'error' && errorMessage) {
      await prisma.workflowAlert.create({
        data: {
          executionId: id,
          type: 'error',
          title: `Erro no workflow ${execution.workflowName}`,
          message: errorMessage,
          workflowId: execution.workflowId,
          workflowName: execution.workflowName,
          status: 'pending'
        }
      })
    }

    return NextResponse.json({ execution })
  } catch (error) {
    console.error('Error updating execution:', error)
    return NextResponse.json(
      { error: 'Failed to update execution', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar execução
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    await prisma.workflowExecution.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting execution:', error)
    return NextResponse.json(
      { error: 'Failed to delete execution', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
