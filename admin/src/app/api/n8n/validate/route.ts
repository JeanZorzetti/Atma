import { NextRequest, NextResponse } from 'next/server'
import {
  getWorkflowValidator,
  ValidationResult,
  WorkflowValidationConfig,
} from '@/lib/workflow-validator'
import { getEnvironmentManager } from '@/lib/workflow-environment'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    const validator = getWorkflowValidator()

    switch (action) {
      case 'config': {
        const config = validator.getConfig()
        return NextResponse.json({ config })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in validation GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const body = await request.json()

    const validator = getWorkflowValidator()

    switch (action) {
      case 'validate': {
        const { workflowData } = body

        if (!workflowData) {
          return NextResponse.json(
            { error: 'Workflow data is required' },
            { status: 400 }
          )
        }

        const result: ValidationResult = await validator.validateWorkflow(workflowData)
        const recommendations = validator.getRecommendations(result)

        return NextResponse.json({ result, recommendations })
      }

      case 'validate-from-n8n': {
        const { workflowId, environment } = body

        if (!workflowId) {
          return NextResponse.json(
            { error: 'Workflow ID is required' },
            { status: 400 }
          )
        }

        // Get workflow data from n8n
        const envManager = getEnvironmentManager()
        const envConfig = environment
          ? envManager.getAllEnvironments().find(e => e.type === environment)
          : envManager.getCurrentEnvironment()

        if (!envConfig) {
          return NextResponse.json(
            { error: 'Invalid environment' },
            { status: 400 }
          )
        }

        // Fetch workflow from n8n
        const n8nResponse = await fetch(
          `${envConfig.n8nApiUrl}/workflows/${workflowId}`,
          {
            headers: {
              'X-N8N-API-KEY': envConfig.n8nApiKey || '',
            },
          }
        )

        if (!n8nResponse.ok) {
          return NextResponse.json(
            { error: 'Failed to fetch workflow from n8n' },
            { status: n8nResponse.status }
          )
        }

        const workflowData = await n8nResponse.json()

        // Validate
        const result: ValidationResult = await validator.validateWorkflow(workflowData)
        const recommendations = validator.getRecommendations(result)

        return NextResponse.json({ result, recommendations, workflowData })
      }

      case 'update-config': {
        const { config } = body as { config: Partial<WorkflowValidationConfig> }

        if (!config) {
          return NextResponse.json(
            { error: 'Config is required' },
            { status: 400 }
          )
        }

        validator.updateConfig(config)
        const updatedConfig = validator.getConfig()

        return NextResponse.json({ config: updatedConfig })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in validation POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
