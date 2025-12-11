import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar configuração de alertas de um workflow
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      )
    }

    const config = await prisma.alertConfiguration.findUnique({
      where: { workflowId }
    })

    return NextResponse.json({ config })
  } catch (error) {
    console.error('Error fetching alert config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alert config', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Criar ou atualizar configuração de alertas
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      workflowId,
      workflowName,
      enabled,
      slackEnabled,
      slackWebhook,
      slackChannel,
      emailEnabled,
      emailRecipients,
      alertOnError,
      alertOnWarning,
      alertOnSlowExecution,
      slowExecutionThreshold
    } = body

    if (!workflowId || !workflowName) {
      return NextResponse.json(
        { error: 'workflowId and workflowName are required' },
        { status: 400 }
      )
    }

    const config = await prisma.alertConfiguration.upsert({
      where: { workflowId },
      update: {
        workflowName,
        enabled: enabled ?? true,
        slackEnabled: slackEnabled ?? false,
        slackWebhook,
        slackChannel,
        emailEnabled: emailEnabled ?? false,
        emailRecipients,
        alertOnError: alertOnError ?? true,
        alertOnWarning: alertOnWarning ?? false,
        alertOnSlowExecution: alertOnSlowExecution ?? false,
        slowExecutionThreshold
      },
      create: {
        workflowId,
        workflowName,
        enabled: enabled ?? true,
        slackEnabled: slackEnabled ?? false,
        slackWebhook,
        slackChannel,
        emailEnabled: emailEnabled ?? false,
        emailRecipients,
        alertOnError: alertOnError ?? true,
        alertOnWarning: alertOnWarning ?? false,
        alertOnSlowExecution: alertOnSlowExecution ?? false,
        slowExecutionThreshold
      }
    })

    return NextResponse.json({ config })
  } catch (error) {
    console.error('Error saving alert config:', error)
    return NextResponse.json(
      { error: 'Failed to save alert config', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar configuração de alertas
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      )
    }

    await prisma.alertConfiguration.delete({
      where: { workflowId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting alert config:', error)
    return NextResponse.json(
      { error: 'Failed to delete alert config', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
