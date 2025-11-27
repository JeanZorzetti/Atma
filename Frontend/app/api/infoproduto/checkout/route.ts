import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      nome,
      email,
      telefone,
      produto,
      valor
    } = body

    // Validação básica
    if (!nome || !email || !produto || !valor) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    console.log('📝 Criando preferência Mercado Pago:', { nome, email, valor })

    // Configurar Mercado Pago (nova API)
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
      options: { timeout: 5000 }
    })

    const preference = new Preference(client)

    // Criar preferência de pagamento (Checkout Pro)
    // Seguindo padrão oficial do SDK Mercado Pago
    const preferenceData = {
      items: [
        {
          title: 'Relatório de Viabilidade Ortodôntica - Atma',
          description: 'Análise personalizada completa do seu caso ortodôntico',
          unit_price: valor,
          quantity: 1,
          currency_id: 'BRL'
        }
      ],
      payer: {
        name: nome,
        email: email
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/infoproduto/relatorio-viabilidade/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_URL}/infoproduto/relatorio-viabilidade/checkout`,
        pending: `${process.env.NEXT_PUBLIC_URL}/infoproduto/relatorio-viabilidade/checkout`
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/infoproduto/webhook`,
      statement_descriptor: 'ATMA ALIGNER',
      external_reference: `relatorio-${Date.now()}-${email}`
    }

    const response = await preference.create({ body: preferenceData })

    console.log('✅ Preferência criada:', response.id)

    return NextResponse.json({
      success: true,
      checkoutUrl: response.init_point,
      preferenceId: response.id
    })

  } catch (error: any) {
    console.error('❌ Erro no checkout:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar pagamento',
        details: error.message || String(error)
      },
      { status: 500 }
    )
  }
}
