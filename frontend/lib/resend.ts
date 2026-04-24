import { Resend } from 'resend'

export const EMAIL_CONFIG = {
  from: 'Atma Aligner <noreply@atma.roilabs.com.br>',
  replyTo: 'contato@atma.roilabs.com.br',
}

export type EmailType = 'cadastro' | 'lembrete-3dias' | 'lembrete-7dias' | 'agendamento'

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

// Lazy init — avoids top-level instantiation at build time when env var is absent
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not set')
  return new Resend(key)
}

export async function enviarEmail(data: EmailData) {
  try {
    const resend = getResend()
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
