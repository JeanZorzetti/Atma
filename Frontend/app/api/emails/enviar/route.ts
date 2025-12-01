import { NextRequest, NextResponse } from 'next/server'
import { enviarEmail } from '@/lib/resend'
import {
  EmailCadastro,
  EmailLembrete3Dias,
  EmailLembrete7Dias,
  EmailAgendamento,
} from '@/lib/email-templates'
import { renderToStaticMarkup } from 'react-dom/server'

// Interface para o corpo da requisição
interface EnviarEmailRequest {
  tipo: 'cadastro' | 'lembrete-3dias' | 'lembrete-7dias' | 'agendamento'
  usuario: {
    nome: string
    email: string
  }
  relatorio?: {
    score: number
    custoEstimado: number
    duracaoMeses: number
    complexidade: string
  }
  agendamento?: {
    data: string
    horario: string
    unidade: string
    endereco: string
    tipoConsulta: string
  }
}

// Função auxiliar para renderizar template React para HTML
function renderTemplate(component: React.ReactElement): string {
  return renderToStaticMarkup(component)
}

// Mapa de assuntos por tipo de email
const ASSUNTOS: Record<string, string> = {
  cadastro: '🎉 Bem-vindo ao Portal Atma Aligner!',
  'lembrete-3dias': '🔍 Você já explorou seu relatório?',
  'lembrete-7dias': '📅 Pronto para agendar sua consulta?',
  agendamento: '✅ Consulta Confirmada - Atma Aligner',
}

// POST /api/emails/enviar - Enviar email
export async function POST(request: NextRequest) {
  try {
    const body: EnviarEmailRequest = await request.json()

    // Validação básica
    if (!body.tipo || !body.usuario?.nome || !body.usuario?.email) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    let htmlContent: string

    // Renderizar o template apropriado baseado no tipo
    switch (body.tipo) {
      case 'cadastro':
        if (!body.relatorio) {
          return NextResponse.json(
            { error: 'Dados do relatório são obrigatórios para email de cadastro' },
            { status: 400 }
          )
        }
        htmlContent = renderTemplate(
          <EmailCadastro usuario={body.usuario} relatorio={body.relatorio} />
        )
        break

      case 'lembrete-3dias':
        htmlContent = renderTemplate(<EmailLembrete3Dias usuario={body.usuario} />)
        break

      case 'lembrete-7dias':
        htmlContent = renderTemplate(<EmailLembrete7Dias usuario={body.usuario} />)
        break

      case 'agendamento':
        if (!body.agendamento) {
          return NextResponse.json(
            { error: 'Dados do agendamento são obrigatórios para email de agendamento' },
            { status: 400 }
          )
        }
        htmlContent = renderTemplate(
          <EmailAgendamento usuario={body.usuario} agendamento={body.agendamento} />
        )
        break

      default:
        return NextResponse.json(
          { error: 'Tipo de email inválido' },
          { status: 400 }
        )
    }

    // Enviar email
    const resultado = await enviarEmail({
      to: body.usuario.email,
      subject: ASSUNTOS[body.tipo],
      html: htmlContent,
    })

    if (!resultado.success) {
      console.error('Erro ao enviar email:', resultado.error)
      return NextResponse.json(
        { error: 'Erro ao enviar email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: resultado.data,
    })
  } catch (error) {
    console.error('Erro na API de envio de email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
