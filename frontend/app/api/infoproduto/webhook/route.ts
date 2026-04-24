import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import crypto from 'crypto'

// Validar assinatura do webhook (segurança)
function validateWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string | null
): boolean {
  if (!xSignature || !xRequestId || !dataId) {
    console.warn('⚠️ Faltam headers de validação')
    return false
  }

  try {
    // Extrair ts e v1 do x-signature
    const parts = xSignature.split(',')
    let ts: string | null = null
    let hash: string | null = null

    parts.forEach(part => {
      const [key, value] = part.split('=')
      if (key.trim() === 'ts') ts = value.trim()
      if (key.trim() === 'v1') hash = value.trim()
    })

    if (!ts || !hash) {
      console.warn('⚠️ x-signature inválido')
      return false
    }

    // Chave secreta (configurada em Suas integrações > Webhooks)
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET

    if (!secret) {
      console.warn('⚠️ MERCADOPAGO_WEBHOOK_SECRET não configurada - pulando validação')
      return true // Em desenvolvimento, aceita sem validação
    }

    // Gerar manifest
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

    // Calcular HMAC SHA256
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(manifest)
    const calculatedHash = hmac.digest('hex')

    // Comparar hashes
    const isValid = calculatedHash === hash

    if (!isValid) {
      console.error('❌ Assinatura inválida!')
      console.log('Expected:', calculatedHash)
      console.log('Received:', hash)
    }

    return isValid

  } catch (error) {
    console.error('Erro ao validar assinatura:', error)
    return false
  }
}

// Webhook para receber notificações do Mercado Pago
export async function POST(request: NextRequest) {
  try {
    // 1. Extrair headers e query params
    const xSignature = request.headers.get('x-signature')
    const xRequestId = request.headers.get('x-request-id')
    const url = new URL(request.url)
    const dataId = url.searchParams.get('data.id')
    const type = url.searchParams.get('type')

    const body = await request.json()

    console.log('🔔 Webhook recebido:', {
      type,
      dataId,
      xRequestId,
      hasSignature: !!xSignature,
      body
    })

    // 2. Validar assinatura
    const isValid = validateWebhookSignature(xSignature, xRequestId, dataId)

    if (!isValid && process.env.NODE_ENV === 'production') {
      console.error('❌ Webhook rejeitado: assinatura inválida')
      return NextResponse.json({ success: false }, { status: 200 })
    }

    // 3. Processar notificação de pagamento
    if (type === 'payment' && dataId) {
      const paymentId = parseInt(dataId)

      console.log('💳 Consultando pagamento:', paymentId)

      // Configurar Mercado Pago
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
        options: { timeout: 5000 }
      })

      const payment = new Payment(client)

      // Buscar detalhes do pagamento
      const paymentData = await payment.get({ id: paymentId })

      console.log('📊 Status do pagamento:', {
        id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        email: paymentData.payer?.email,
        external_reference: paymentData.external_reference
      })

      // 4. Se pagamento aprovado, gerar e enviar PDF
      if (paymentData.status === 'approved') {
        const email = paymentData.payer?.email
        const externalReference = paymentData.external_reference

        console.log('✅ Pagamento aprovado! Gerando PDF para:', email)

        // Extrair IDs do external_reference
        // Formato: relatorio-{relatorioId}-{clienteId}
        if (email && externalReference) {
          const parts = externalReference.split('-')
          if (parts.length === 3 && parts[0] === 'relatorio') {
            const relatorioId = parseInt(parts[1])
            const clienteId = parseInt(parts[2])

            console.log('📝 Gerando PDF para:', { relatorioId, clienteId, email })

            try {
              // Chamar API interna para gerar PDF
              const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
              const response = await fetch(`${baseUrl}/api/infoproduto/gerar-pdf-webhook`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Internal-Request': 'true' // Header de segurança
                },
                body: JSON.stringify({
                  relatorioId,
                  clienteId,
                  paymentId: paymentData.id
                })
              })

              const result = await response.json()

              if (result.success) {
                console.log('✅ PDF gerado e enviado com sucesso!')
              } else {
                console.error('❌ Erro ao gerar PDF:', result.error)
              }

            } catch (error) {
              console.error('❌ Erro ao chamar API de geração de PDF:', error)
            }
          } else {
            console.warn('⚠️ Formato de external_reference inválido:', externalReference)
          }
        }
      }

      return NextResponse.json({ success: true, received: true })
    }

    return NextResponse.json({ success: true, type })

  } catch (error: any) {
    console.error('❌ Erro no webhook:', error)
    // IMPORTANTE: Sempre retornar 200 para o Mercado Pago
    // Se retornar erro, eles vão retentar indefinidamente
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 200 }
    )
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
