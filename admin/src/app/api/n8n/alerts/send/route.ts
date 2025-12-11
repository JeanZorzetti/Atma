import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Enviar alerta via Slack
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { alertId } = body

    if (!alertId) {
      return NextResponse.json(
        { error: 'alertId is required' },
        { status: 400 }
      )
    }

    // Buscar o alerta
    const alert = await prisma.workflowAlert.findUnique({
      where: { id: alertId }
    })

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    // Buscar configuração de alertas para o workflow
    const config = await prisma.alertConfiguration.findUnique({
      where: { workflowId: alert.workflowId }
    })

    const results = {
      slack: false,
      email: false,
      errors: [] as string[]
    }

    // Enviar via Slack se configurado
    if (config?.slackEnabled && config.slackWebhook) {
      try {
        const slackPayload = {
          text: `🚨 *${alert.title}*`,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: alert.title
              }
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Workflow:*\n${alert.workflowName}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Tipo:*\n${alert.type}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Hora:*\n${new Date(alert.createdAt).toLocaleString('pt-BR')}`
                }
              ]
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Mensagem:*\n${alert.message}`
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `Sistema de Automações Atma • ${new Date().toLocaleString('pt-BR')}`
                }
              ]
            }
          ]
        }

        const slackResponse = await fetch(config.slackWebhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(slackPayload)
        })

        if (slackResponse.ok) {
          results.slack = true

          // Atualizar o alerta como enviado
          await prisma.workflowAlert.update({
            where: { id: alertId },
            data: {
              status: 'sent',
              sentAt: new Date()
            }
          })
        } else {
          const errorText = await slackResponse.text()
          results.errors.push(`Slack: ${errorText}`)
        }
      } catch (error) {
        results.errors.push(`Slack error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // TODO: Implementar envio de email se configurado
    if (config?.emailEnabled && config.emailRecipients) {
      // Implementar integração com serviço de email (SendGrid, etc)
      results.email = false
      results.errors.push('Email notifications not implemented yet')
    }

    // Se nenhum canal foi enviado com sucesso, marcar como falha
    if (!results.slack && !results.email && config) {
      await prisma.workflowAlert.update({
        where: { id: alertId },
        data: {
          status: 'failed'
        }
      })
    }

    return NextResponse.json({
      success: results.slack || results.email,
      results
    })
  } catch (error) {
    console.error('Error sending alert:', error)
    return NextResponse.json(
      { error: 'Failed to send alert', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
