import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar documentação de um workflow
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

    const documentation = await prisma.workflowDocumentation.findUnique({
      where: { workflowId },
      include: {
        metadata: true
      }
    })

    if (!documentation) {
      return NextResponse.json(
        { error: 'Documentation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ documentation })
  } catch (error) {
    console.error('Error fetching documentation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documentation', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Criar ou atualizar documentação de um workflow
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      workflowId,
      overview,
      setupInstructions,
      usageExamples,
      troubleshooting,
      notes,
      flowDiagram,
      architectureDiagram,
      configExamples,
      environmentVars,
      inputSchema,
      outputSchema,
      webhookUrl,
      faqItems,
      knownIssues,
      externalDocs,
      relatedWorkflows,
      lastEditedBy
    } = body

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      )
    }

    // Verificar se os metadados existem
    const metadata = await prisma.workflowMetadata.findUnique({
      where: { workflowId }
    })

    if (!metadata) {
      return NextResponse.json(
        { error: 'Workflow metadata not found. Create metadata first.' },
        { status: 404 }
      )
    }

    const documentation = await prisma.workflowDocumentation.upsert({
      where: { workflowId },
      update: {
        overview,
        setupInstructions,
        usageExamples,
        troubleshooting,
        notes,
        flowDiagram,
        architectureDiagram,
        configExamples,
        environmentVars,
        inputSchema,
        outputSchema,
        webhookUrl,
        faqItems,
        knownIssues,
        externalDocs,
        relatedWorkflows,
        lastEditedBy,
        lastEditedAt: new Date()
      },
      create: {
        workflowId,
        overview,
        setupInstructions,
        usageExamples,
        troubleshooting,
        notes,
        flowDiagram,
        architectureDiagram,
        configExamples,
        environmentVars,
        inputSchema,
        outputSchema,
        webhookUrl,
        faqItems,
        knownIssues,
        externalDocs,
        relatedWorkflows,
        lastEditedBy,
        lastEditedAt: new Date()
      },
      include: {
        metadata: true
      }
    })

    return NextResponse.json({ documentation })
  } catch (error) {
    console.error('Error saving documentation:', error)
    return NextResponse.json(
      { error: 'Failed to save documentation', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar documentação de um workflow
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

    await prisma.workflowDocumentation.delete({
      where: { workflowId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting documentation:', error)
    return NextResponse.json(
      { error: 'Failed to delete documentation', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
