import { NextRequest, NextResponse } from 'next/server'

// Webhook para receber notificações do Mercado Pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('🔔 Webhook recebido:', body)

    // Mercado Pago envia notificações em vários formatos
    // Tipos principais: payment, merchant_order

    const { type, data } = body

    if (type === 'payment') {
      // Buscar detalhes do pagamento
      const paymentId = data.id

      // TODO: Consultar API do Mercado Pago para validar pagamento
      /*
      import mercadopago from 'mercadopago'

      const payment = await mercadopago.payment.findById(paymentId)

      if (payment.body.status === 'approved') {
        // Pagamento aprovado!
        const email = payment.body.payer.email
        const externalReference = payment.body.external_reference

        // Buscar dados do cliente no banco
        const pedido = await db.pedidos.findOne({
          where: { externalReference }
        })

        if (pedido && !pedido.processado) {
          // Gerar e enviar PDF
          await gerarEEnviarRelatorio(pedido.formData)

          // Marcar como processado
          await db.pedidos.update(
            { id: pedido.id },
            { processado: true, status: 'completed' }
          )

          console.log('✅ Relatório gerado e enviado para:', email)
        }
      }
      */

      return NextResponse.json({ success: true, received: true })
    }

    return NextResponse.json({ success: true, type })

  } catch (error) {
    console.error('Erro no webhook:', error)
    // IMPORTANTE: Sempre retornar 200 para o Mercado Pago
    // Se retornar erro, eles vão retentar indefinidamente
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 200 })
  }
}

// Mercado Pago também pode enviar GET para validação
export async function GET(request: NextRequest) {
  // Validação de webhook (quando configurar no Mercado Pago)
  return NextResponse.json({ status: 'Webhook ativo' })
}

// TODO: Função auxiliar para gerar e enviar relatório
/*
async function gerarEEnviarRelatorio(formData: any) {
  try {
    // Chamar a API de gerar PDF
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/infoproduto/gerar-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error('Erro ao gerar PDF')
    }

    return true
  } catch (error) {
    console.error('Erro ao gerar/enviar relatório:', error)
    // TODO: Implementar retry mechanism ou notificação de erro
    return false
  }
}
*/
