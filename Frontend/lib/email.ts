import { Resend } from 'resend'

// Lazy initialization to avoid build errors
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY não está configurada. Configure no .env.local')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export async function enviarRelatorio(
  email: string,
  nome: string,
  pdfBuffer: Buffer
) {
  try {
    const resend = getResendClient()
    const primeiroNome = nome.split(' ')[0]

    const { data, error } = await resend.emails.send({
      from: 'Atma Aligner <noreply@atma.roilabs.com.br>',
      to: email,
      subject: `${primeiroNome}, Seu Relatório de Viabilidade Está Pronto! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .checklist {
              background: white;
              padding: 20px;
              border-left: 4px solid #2563eb;
              margin: 20px 0;
            }
            .checklist li {
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
            .highlight {
              background: #fef3c7;
              padding: 2px 6px;
              border-radius: 3px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">🎉 Relatório Pronto!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Seu relatório personalizado está anexo</p>
          </div>

          <div class="content">
            <h2>Olá ${primeiroNome}!</h2>

            <p>Seu <strong>Relatório de Viabilidade Ortodôntica</strong> foi gerado com sucesso e está anexo a este email.</p>

            <p>Este relatório contém:</p>
            <ul>
              <li>✅ Score de viabilidade do seu caso (0-100)</li>
              <li>💰 Estimativa de custos personalizada</li>
              <li>📊 Comparativo de mercado (Atma vs. Invisalign vs. Aparelho Fixo)</li>
              <li>📅 Timeline esperado de tratamento</li>
              <li>🎯 Plano de ação personalizado</li>
              <li>❓ Perguntas essenciais para fazer ao ortodontista</li>
            </ul>

            <div class="checklist">
              <h3>📋 Próximos Passos Recomendados:</h3>
              <ol>
                <li><strong>Baixe o PDF anexo</strong> (se não ver o anexo, verifique a pasta de spam)</li>
                <li><strong>Leia com atenção</strong> todas as seções do relatório</li>
                <li><strong>Anote as perguntas sugeridas</strong> para fazer nas consultas</li>
                <li><strong>Agende consultas</strong> com ortodontistas certificados</li>
                <li><strong>Compare os orçamentos</strong> usando nossa tabela de referência</li>
              </ol>
            </div>

            <p>💡 <span class="highlight">Dica Valiosa:</span> Não tenha pressa! Consulte pelo menos 3 ortodontistas diferentes antes de decidir. Use as informações deste relatório para fazer perguntas inteligentes e negociar melhores condições.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://atma.com.br/pacientes/encontre-doutor" class="button">
                Encontrar Ortodontista Certificado Atma
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <h3>❓ Precisa de Ajuda?</h3>
            <p>Se tiver qualquer dúvida sobre o relatório ou quiser falar com nossa equipe:</p>
            <ul>
              <li>📧 Email: <a href="mailto:contato@atma.com.br">contato@atma.com.br</a></li>
              <li>📱 WhatsApp: <a href="https://wa.me/5511999999999">(11) 99999-9999</a></li>
            </ul>

            <p style="margin-top: 30px;">
              Um abraço,<br>
              <strong>Equipe Atma Aligner</strong><br>
              <em>Transformando sorrisos com tecnologia alemã</em>
            </p>
          </div>

          <div class="footer">
            <p>🇩🇪 Tecnologia PETG Duran® Alemã | Certificado ISO 13485 + CE + ANVISA</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
              Você recebeu este email porque solicitou um Relatório de Viabilidade Ortodôntica em atma.com.br
            </p>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `relatorio-viabilidade-${nome.replace(/\s+/g, '-').toLowerCase()}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    if (error) {
      console.error('❌ Erro ao enviar email:', error)
      throw error
    }

    console.log('✅ Email enviado com sucesso para:', email)
    return { success: true, data }

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    throw error
  }
}
