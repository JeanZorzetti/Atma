/**
 * SEO AI Assistant with Web Browsing - Chat API Route
 * POST /api/chat/seo
 */

import { NextRequest } from 'next/server'
import { streamText, tool, stepCountIs, convertToModelMessages, type UIMessage } from 'ai'
import { groq } from '@ai-sdk/groq'
import { z } from 'zod'
import { tavily } from '@tavily/core'

export const runtime = 'nodejs'
export const maxDuration = 60

interface SeoContext {
    history?: Array<{ date: string; clicks: number; impressions: number }>
    keywords?: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }>
    forecast?: {
        trends: { clicks: string; impressions: string }
        velocity: { clicks: number; impressions: number }
        predictedTotal: { clicks: number; impressions: number; clicksFromEfficiency: number }
        confidence: { clicks: number; impressions: number }
        efficiency: { currentRatio: number; trend: string; forecastNext30d: number }
    }
    totals?: { clicks: number; impressions: number; ctr: number }
    dateRange?: { startDate: string; endDate: string }
}

interface ChatRequest {
    messages: UIMessage[]
    context?: SeoContext
}

export async function POST(req: NextRequest) {
    try {
        const body: ChatRequest = await req.json()
        const { messages, context } = body

        if (!messages || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'Mensagens não podem estar vazias' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const seoSystemPrompt = `Você é o Head de SEO da Atma Saúde. Sua missão é analisar dados brutos do Google Search Console e dar conselhos táticos para aumentar tráfego orgânico de clínicas odontológicas, orthodontistas e serviços de saúde bucal.

${context ? `
CONTEXTO ATUAL (Google Search Console):
- Período: ${context.dateRange?.startDate} até ${context.dateRange?.endDate}
- Total de Cliques: ${context.totals?.clicks?.toLocaleString('pt-BR')}
- Total de Impressões: ${context.totals?.impressions?.toLocaleString('pt-BR')}
- CTR Médio: ${context.totals?.ctr?.toFixed(2)}%

ANÁLISE DE EFICIÊNCIA:
- Custo de Visibilidade Atual: ${context.forecast?.efficiency.currentRatio} impressões por clique
- Tendência: ${context.forecast?.efficiency.trend}
- Previsão 30 dias: ${context.forecast?.efficiency.forecastNext30d} impressões/clique

PREVISÃO ML (Próximos 30 dias):
- Tendência de Cliques: ${context.forecast?.trends.clicks} (velocidade: ${context.forecast?.velocity.clicks}/dia)
- Tendência de Impressões: ${context.forecast?.trends.impressions} (velocidade: ${context.forecast?.velocity.impressions}/dia)
- Previsão ML Direta: ${context.forecast?.predictedTotal.clicks?.toLocaleString('pt-BR')} cliques
- Previsão via Eficiência: ${context.forecast?.predictedTotal.clicksFromEfficiency?.toLocaleString('pt-BR')} cliques
- Confiança do Modelo: Cliques ${context.forecast?.confidence.clicks}%, Impressões ${context.forecast?.confidence.impressions}%

TOP KEYWORDS:
${context.keywords?.slice(0, 10).map((k, i) =>
            `${i + 1}. "${k.query}" - ${k.clicks} cliques, ${k.impressions} imp, CTR ${k.ctr?.toFixed(2)}%, Pos ${k.position?.toFixed(1)}`
        ).join('\n')}
` : 'Nenhum dado disponível'}

DIRETRIZES:
1. Analise a métrica de "Efficiency Ratio" (Impressões/Clique):
   - Se estiver subindo: Alerte sobre CTR baixo ou keywords irrelevantes
   - Se estiver caindo: Parabenize pela melhoria na qualidade

2. Foque no nicho odontológico: aparelhos, clareamento, implantes, ortodontia, braces, alinhadores invisíveis.

3. Seja direto e técnico. Use formatação Markdown:
   - Tabelas para comparações
   - **Negrito** para métricas importantes
   - Bullets para ações

4. Sempre sugira 2-3 ações específicas e mensuráveis.

5. **IMPORTANTE - Web Search**: Você tem acesso a uma ferramenta 'searchWeb'. Use quando:
   - Usuário perguntar sobre concorrentes específicos
   - Precisar verificar posições na SERP em tempo real
   - Quiser analisar snippets/titles dos top 3 resultados

IMPORTANTE: Você tem acesso aos dados REAIS do GSC acima. Use-os nas suas respostas.`

        const tv = tavily({ apiKey: process.env.TAVILY_API_KEY || '' })

        const result = streamText({
            model: groq('llama-3.3-70b-versatile'),
            system: seoSystemPrompt,
            messages: await convertToModelMessages(messages),
            tools: {
                searchWeb: tool({
                    description: 'Pesquisa o Google para analisar concorrentes, verificar posições na SERP ou buscar volumes de busca atuais.',
                    inputSchema: z.object({
                        query: z.string().describe('A query de busca para encontrar a informação necessária'),
                    }),
                    execute: async ({ query }) => {
                        try {
                            const searchResult = await tv.search(query, {
                                search_depth: 'advanced',
                                max_results: 5,
                                include_answer: true,
                                include_raw_content: false,
                            })

                            return {
                                answer: searchResult.answer,
                                results: searchResult.results.map((r: any) => ({
                                    title: r.title,
                                    url: r.url,
                                    snippet: r.content?.substring(0, 300) || '',
                                    score: r.score,
                                })),
                            }
                        } catch (error) {
                            return {
                                error: 'Não foi possível realizar a pesquisa web',
                                details: error instanceof Error ? error.message : 'Unknown error',
                            }
                        }
                    },
                }),
            },
            stopWhen: stepCountIs(5),
            temperature: 0.7,
        })

        return result.toUIMessageStreamResponse()
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: 'Erro ao processar mensagem',
                details: error instanceof Error ? error.message : 'Erro desconhecido',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}
