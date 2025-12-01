import { Resend } from 'resend'

// Inicializar Resend com API key
// Para configurar: adicionar RESEND_API_KEY no arquivo .env.local
export const resend = new Resend(process.env.RESEND_API_KEY || '')

// Configurações de email
export const EMAIL_CONFIG = {
  from: 'Atma Aligner <noreply@atma.roilabs.com.br>',
  replyTo: 'contato@atma.roilabs.com.br',
}

// Tipos de email
export type EmailType = 'cadastro' | 'lembrete-3dias' | 'lembrete-7dias' | 'agendamento'

// Interface para dados de email
export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

// Função auxiliar para enviar email
export async function enviarEmail(data: EmailData) {
  try {
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text,
      replyTo: EMAIL_CONFIG.replyTo,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}
