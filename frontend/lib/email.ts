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

/**
 * Email D+7: "Já agendou consulta?"
 * Enviado 7 dias após receber o relatório
 */
export async function enviarEmailD7(
  email: string,
  nome: string,
  relatorioId: number
) {
  try {
    const resend = getResendClient()
    const primeiroNome = nome.split(' ')[0]

    const { data, error } = await resend.emails.send({
      from: 'Atma Aligner <noreply@atma.roilabs.com.br>',
      to: email,
      subject: `${primeiroNome}, já agendou sua consulta? 📅`,
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
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
              background: #10b981;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .tip-box {
              background: #fef3c7;
              padding: 20px;
              border-left: 4px solid #f59e0b;
              margin: 20px 0;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">📅 Check-in: 7 dias depois</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Como está seu processo?</p>
          </div>

          <div class="content">
            <h2>Olá ${primeiroNome}!</h2>

            <p>Faz uma semana que você recebeu seu <strong>Relatório de Viabilidade</strong>.</p>

            <p>Queria te perguntar: <strong>você já conseguiu agendar alguma consulta com ortodontista?</strong></p>

            <h3>✅ Se já agendou:</h3>
            <p>Parabéns! Não esqueça de levar o relatório impresso e fazer as perguntas sugeridas. Isso vai te dar muito mais poder de negociação!</p>

            <h3>⏰ Se ainda não agendou:</h3>
            <p>Sem problemas! Sabemos que encontrar o ortodontista certo leva tempo. Aqui vão algumas dicas para acelerar:</p>

            <div class="tip-box">
              <h4>💡 Dicas para encontrar um bom ortodontista:</h4>
              <ul>
                <li><strong>Busque por especialistas em alinhadores</strong> (não são todos que trabalham)</li>
                <li><strong>Leia reviews no Google</strong> antes de agendar</li>
                <li><strong>Pergunte sobre a experiência</strong> com casos similares ao seu</li>
                <li><strong>Compare preços de 3+ profissionais</strong> (pode variar 50%+)</li>
                <li><strong>Verifique se aceita cartão parcelado</strong> (facilita muito!)</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://atma.roilabs.com.br/pacientes/encontre-doutor" class="button">
                Ver Ortodontistas Certificados Atma
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <h3>🎁 Oferta Especial para Você</h3>
            <p>Sabemos que pode ser difícil escolher o ortodontista certo. Por isso, estamos oferecendo uma <strong>consulta online por apenas R$ 97</strong> com um dos nossos ortodontistas parceiros certificados.</p>

            <p>Nessa consulta você pode:</p>
            <ul>
              <li>✅ Tirar todas as suas dúvidas sobre alinhadores</li>
              <li>✅ Mostrar fotos do seu caso e receber uma análise preliminar</li>
              <li>✅ Entender melhor se você é candidato para alinhadores</li>
              <li>✅ Receber orientações sobre próximos passos</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://atma.roilabs.com.br/infoproduto/relatorio-viabilidade/checkout" class="button">
                Agendar Consulta Online (R$ 97)
              </a>
            </div>

            <p style="margin-top: 30px;">
              Qualquer dúvida, é só responder este email!<br><br>
              Um abraço,<br>
              <strong>Equipe Atma Aligner</strong>
            </p>
          </div>

          <div class="footer">
            <p style="font-size: 12px; color: #9ca3af;">
              <a href="mailto:${email}?subject=Cancelar emails de follow-up" style="color: #9ca3af;">Não quero mais receber estes emails</a>
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Erro ao enviar email D+7:', error)
      throw error
    }

    console.log('✅ Email D+7 enviado para:', email)
    return { success: true, data }

  } catch (error) {
    console.error('❌ Erro ao enviar email D+7:', error)
    throw error
  }
}

/**
 * Email D+14: "Precisa de ajuda?"
 * Enviado 14 dias após receber o relatório
 */
export async function enviarEmailD14(
  email: string,
  nome: string,
  relatorioId: number
) {
  try {
    const resend = getResendClient()
    const primeiroNome = nome.split(' ')[0]

    const { data, error } = await resend.emails.send({
      from: 'Atma Aligner <noreply@atma.roilabs.com.br>',
      to: email,
      subject: `${primeiroNome}, precisa de ajuda com algo? 🤝`,
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
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
              background: #8b5cf6;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .faq-item {
              background: white;
              padding: 15px;
              margin: 10px 0;
              border-left: 3px solid #8b5cf6;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">🤝 Estamos Aqui para Ajudar!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">2 semanas depois...</p>
          </div>

          <div class="content">
            <h2>Oi ${primeiroNome},</h2>

            <p>Percebi que faz 2 semanas que você recebeu seu relatório de viabilidade.</p>

            <p>Às vezes o processo de escolher um tratamento ortodôntico pode parecer complicado, e é completamente normal ter dúvidas!</p>

            <h3>🔍 Dúvidas Mais Comuns (talvez você também tenha):</h3>

            <div class="faq-item">
              <strong>❓ "Como sei se o alinhador vai funcionar para mim?"</strong>
              <p>Alinhadores funcionam para 80-90% dos casos ortodônticos. Casos muito complexos podem precisar de aparelho fixo, mas um ortodontista pode avaliar isso em uma consulta rápida.</p>
            </div>

            <div class="faq-item">
              <strong>❓ "Quanto tempo leva o tratamento?"</strong>
              <p>Em média: 6-18 meses. Casos mais leves (espaçamento, pequenos desalinhamentos): 6-12 meses. Casos moderados: 12-18 meses. Seu relatório tem uma estimativa personalizada!</p>
            </div>

            <div class="faq-item">
              <strong>❓ "E se eu não tiver R$ 5.000+ para pagar à vista?"</strong>
              <p>A maioria dos ortodontistas aceita parcelamento! Alguns parcelam em até 24x no cartão. Também existem opções de crédito consignado e financiamento. Vale a pena perguntar!</p>
            </div>

            <div class="faq-item">
              <strong>❓ "Atma é confiável? Nunca ouvi falar..."</strong>
              <p>Somos uma marca nova no Brasil, mas usamos tecnologia alemã certificada (PETG Duran®) com ISO 13485, CE e registro ANVISA. Mesma qualidade do Invisalign, preço até 40% menor!</p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <h3>💬 Quer conversar com alguém da equipe?</h3>
            <p>Se tiver qualquer dúvida, pode responder este email ou chamar no WhatsApp!</p>

            <ul>
              <li>📧 <a href="mailto:contato@atma.com.br">contato@atma.com.br</a></li>
              <li>📱 <a href="https://wa.me/5511999999999">WhatsApp: (11) 99999-9999</a></li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://atma.roilabs.com.br/pacientes/faq" class="button">
                Ver Todas as Perguntas Frequentes
              </a>
            </div>

            <p style="margin-top: 30px;">
              Estamos aqui para ajudar! 😊<br><br>
              Um abraço,<br>
              <strong>Equipe Atma Aligner</strong>
            </p>
          </div>

          <div class="footer">
            <p style="font-size: 12px; color: #9ca3af;">
              <a href="mailto:${email}?subject=Cancelar emails de follow-up" style="color: #9ca3af;">Não quero mais receber estes emails</a>
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Erro ao enviar email D+14:', error)
      throw error
    }

    console.log('✅ Email D+14 enviado para:', email)
    return { success: true, data }

  } catch (error) {
    console.error('❌ Erro ao enviar email D+14:', error)
    throw error
  }
}

/**
 * Email D+30: "Novidades e dicas"
 * Enviado 30 dias após receber o relatório
 */
export async function enviarEmailD30(
  email: string,
  nome: string,
  relatorioId: number
) {
  try {
    const resend = getResendClient()
    const primeiroNome = nome.split(' ')[0]

    const { data, error } = await resend.emails.send({
      from: 'Atma Aligner <noreply@atma.roilabs.com.br>',
      to: email,
      subject: `${primeiroNome}, novidades sobre alinhadores invisíveis! 🎉`,
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
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
              background: #f59e0b;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .article-card {
              background: white;
              padding: 20px;
              margin: 15px 0;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .article-card h4 {
              margin-top: 0;
              color: #f59e0b;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">📰 Novidades e Dicas!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Conteúdo exclusivo para você</p>
          </div>

          <div class="content">
            <h2>Olá ${primeiroNome}!</h2>

            <p>Faz 1 mês desde que você recebeu seu relatório de viabilidade. Espero que esteja bem!</p>

            <p>Preparei alguns conteúdos que podem te ajudar na sua jornada para o sorriso perfeito:</p>

            <h3>📚 Artigos Recentes do Nosso Blog:</h3>

            <div class="article-card">
              <h4>🦷 10 Mitos Sobre Alinhadores Invisíveis (Desvendados!)</h4>
              <p>"Alinhador não funciona para casos complexos" - MITO! Descubra a verdade sobre esta e outras crenças populares.</p>
              <a href="https://atma.roilabs.com.br/blog/10-mitos-aparelho-invisivel" style="color: #f59e0b;">Ler artigo completo →</a>
            </div>

            <div class="article-card">
              <h4>💰 Quanto Custa Alinhador Invisível em 2025? (Guia Completo)</h4>
              <p>Comparativo de preços, formas de pagamento e como economizar até R$ 3.000 no seu tratamento.</p>
              <a href="https://atma.roilabs.com.br/blog/quanto-custa-alinhador-invisivel" style="color: #f59e0b;">Ler artigo completo →</a>
            </div>

            <div class="article-card">
              <h4>⚡ Alinhadores vs Aparelho Fixo: Qual é Melhor?</h4>
              <p>Comparação completa de tempo de tratamento, conforto, preço e resultados. Spoiler: depende do seu caso!</p>
              <a href="https://atma.roilabs.com.br/blog/alinhadores-vs-aparelho-fixo" style="color: #f59e0b;">Ler artigo completo →</a>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://atma.roilabs.com.br/blog" class="button">
                Ver Todos os Artigos do Blog
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <h3>🎁 Últimas Novidades da Atma:</h3>
            <ul>
              <li>✨ <strong>Nova tecnologia de impressão 3D</strong> reduz tempo de fabricação em 30%</li>
              <li>🌟 <strong>Mais de 5.000 casos tratados</strong> com sucesso no Brasil</li>
              <li>📍 <strong>150+ ortodontistas parceiros</strong> em todo o país</li>
              <li>💳 <strong>Parcelamento em até 24x</strong> sem juros em clínicas selecionadas</li>
            </ul>

            <p style="margin-top: 30px;">
              Continue acompanhando! Publicamos artigos novos toda semana. 📰<br><br>
              Um abraço,<br>
              <strong>Equipe Atma Aligner</strong>
            </p>
          </div>

          <div class="footer">
            <p>🇩🇪 Tecnologia PETG Duran® Alemã | ISO 13485 + CE + ANVISA</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
              <a href="mailto:${email}?subject=Cancelar emails de follow-up" style="color: #9ca3af;">Não quero mais receber estes emails</a>
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Erro ao enviar email D+30:', error)
      throw error
    }

    console.log('✅ Email D+30 enviado para:', email)
    return { success: true, data }

  } catch (error) {
    console.error('❌ Erro ao enviar email D+30:', error)
    throw error
  }
}
