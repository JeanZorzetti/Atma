import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const n8nApiUrl = process.env.N8N_API_URL
    const n8nApiKey = process.env.N8N_API_KEY

    if (!n8nApiUrl || !n8nApiKey) {
      return NextResponse.json(
        { error: 'N8N API credentials not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(`${n8nApiUrl}/workflows`, {
      headers: {
        'X-N8N-API-KEY': n8nApiKey,
        'Accept': 'application/json'
      },
      cache: 'no-store' // Não cachear para sempre ter dados atualizados
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('N8N API Error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Failed to fetch workflows from n8n', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Retornar os workflows
    return NextResponse.json({
      workflows: data.data || data,
      total: data.data?.length || 0
    })
  } catch (error) {
    console.error('Error fetching n8n workflows:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
