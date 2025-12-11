import { NextResponse } from 'next/server'
import { getWorkflowDebugger } from '@/lib/workflow-debug'
import { getEnvironmentManager } from '@/lib/workflow-environment'

// GET - Obter sessões, steps, breakpoints ou watch variables
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    const workflowDebugger = getWorkflowDebugger()

    switch (action) {
      case 'sessions': {
        const sessions = workflowDebugger.getActiveSessions()
        return NextResponse.json({ sessions })
      }

      case 'session': {
        const sessionId = searchParams.get('sessionId')
        if (!sessionId) {
          return NextResponse.json(
            { error: 'sessionId is required' },
            { status: 400 }
          )
        }

        const session = workflowDebugger.getSession(sessionId)
        if (!session) {
          return NextResponse.json(
            { error: 'Session not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ session })
      }

      case 'steps': {
        const sessionId = searchParams.get('sessionId')
        if (!sessionId) {
          return NextResponse.json(
            { error: 'sessionId is required' },
            { status: 400 }
          )
        }

        const session = workflowDebugger.getSession(sessionId)
        if (!session) {
          return NextResponse.json(
            { error: 'Session not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ steps: session.steps })
      }

      case 'step': {
        const sessionId = searchParams.get('sessionId')
        const stepId = searchParams.get('stepId')

        if (!sessionId || !stepId) {
          return NextResponse.json(
            { error: 'sessionId and stepId are required' },
            { status: 400 }
          )
        }

        const step = workflowDebugger.getStep(sessionId, stepId)
        if (!step) {
          return NextResponse.json(
            { error: 'Step not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ step })
      }

      case 'breakpoints': {
        const workflowId = searchParams.get('workflowId')
        if (!workflowId) {
          return NextResponse.json(
            { error: 'workflowId is required' },
            { status: 400 }
          )
        }

        const breakpoints = workflowDebugger.getBreakpoints(workflowId)
        return NextResponse.json({ breakpoints })
      }

      case 'watch-variables': {
        const workflowId = searchParams.get('workflowId')
        if (!workflowId) {
          return NextResponse.json(
            { error: 'workflowId is required' },
            { status: 400 }
          )
        }

        const watchVariables = workflowDebugger.getWatchVariables(workflowId)
        return NextResponse.json({ watchVariables })
      }

      case 'variables': {
        const sessionId = searchParams.get('sessionId')
        const stepId = searchParams.get('stepId')

        if (!sessionId || !stepId) {
          return NextResponse.json(
            { error: 'sessionId and stepId are required' },
            { status: 400 }
          )
        }

        const variables = workflowDebugger.inspectVariables(sessionId, stepId)
        if (!variables) {
          return NextResponse.json(
            { error: 'Variables not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ variables })
      }

      case 'context': {
        const sessionId = searchParams.get('sessionId')
        const stepId = searchParams.get('stepId')

        if (!sessionId || !stepId) {
          return NextResponse.json(
            { error: 'sessionId and stepId are required' },
            { status: 400 }
          )
        }

        const context = workflowDebugger.getExecutionContext(sessionId, stepId)
        if (!context) {
          return NextResponse.json(
            { error: 'Context not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ context })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Valid actions: sessions, session, steps, step, breakpoints, watch-variables, variables, context' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in Debug API GET:', error)
    return NextResponse.json(
      {
        error: 'Failed to get debug data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - Iniciar sessão, controlar execução, gerenciar breakpoints
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    const workflowDebugger = getWorkflowDebugger()

    switch (action) {
      case 'start': {
        const { workflowId, workflowName, inputData, mode, environment } = body

        if (!workflowId || !workflowName) {
          return NextResponse.json(
            { error: 'workflowId and workflowName are required' },
            { status: 400 }
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

        const session = await workflowDebugger.startDebugSession(
          workflowId,
          workflowName,
          inputData || {},
          mode || 'continuous',
          envConfig.n8nApiUrl,
          envConfig.n8nApiKey
        )

        return NextResponse.json({ session })
      }

      case 'continue': {
        const { sessionId } = body

        if (!sessionId) {
          return NextResponse.json(
            { error: 'sessionId is required' },
            { status: 400 }
          )
        }

        const session = await workflowDebugger.continueExecution(sessionId)

        return NextResponse.json({ session })
      }

      case 'step-next': {
        const { sessionId } = body

        if (!sessionId) {
          return NextResponse.json(
            { error: 'sessionId is required' },
            { status: 400 }
          )
        }

        const step = await workflowDebugger.stepNext(sessionId)

        return NextResponse.json({ step })
      }

      case 'stop': {
        const { sessionId } = body

        if (!sessionId) {
          return NextResponse.json(
            { error: 'sessionId is required' },
            { status: 400 }
          )
        }

        workflowDebugger.stopExecution(sessionId)

        return NextResponse.json({ success: true })
      }

      case 'add-breakpoint': {
        const { workflowId, nodeId, nodeName, condition } = body

        if (!workflowId || !nodeId || !nodeName) {
          return NextResponse.json(
            { error: 'workflowId, nodeId, and nodeName are required' },
            { status: 400 }
          )
        }

        const breakpoint = workflowDebugger.addBreakpoint(workflowId, nodeId, nodeName, condition)

        return NextResponse.json({ breakpoint })
      }

      case 'remove-breakpoint': {
        const { workflowId, breakpointId } = body

        if (!workflowId || !breakpointId) {
          return NextResponse.json(
            { error: 'workflowId and breakpointId are required' },
            { status: 400 }
          )
        }

        workflowDebugger.removeBreakpoint(workflowId, breakpointId)

        return NextResponse.json({ success: true })
      }

      case 'toggle-breakpoint': {
        const { workflowId, breakpointId } = body

        if (!workflowId || !breakpointId) {
          return NextResponse.json(
            { error: 'workflowId and breakpointId are required' },
            { status: 400 }
          )
        }

        workflowDebugger.toggleBreakpoint(workflowId, breakpointId)

        return NextResponse.json({ success: true })
      }

      case 'add-watch': {
        const { workflowId, expression } = body

        if (!workflowId || !expression) {
          return NextResponse.json(
            { error: 'workflowId and expression are required' },
            { status: 400 }
          )
        }

        const watchVariable = workflowDebugger.addWatchVariable(workflowId, expression)

        return NextResponse.json({ watchVariable })
      }

      case 'remove-watch': {
        const { workflowId, watchId } = body

        if (!workflowId || !watchId) {
          return NextResponse.json(
            { error: 'workflowId and watchId are required' },
            { status: 400 }
          )
        }

        workflowDebugger.removeWatchVariable(workflowId, watchId)

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Valid actions: start, continue, step-next, stop, add-breakpoint, remove-breakpoint, toggle-breakpoint, add-watch, remove-watch' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in Debug API POST:', error)
    return NextResponse.json(
      {
        error: 'Failed to execute debug operation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
