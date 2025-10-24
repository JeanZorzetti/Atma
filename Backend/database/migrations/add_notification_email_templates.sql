-- Migration: Add email templates for notification system
-- Created: 2025-10-24
-- Description: Creates email templates for all notification types (newPatients, appointments, payments, systemAlerts, weeklyReports)

-- =====================================================
-- TEMPLATE 1: New Patient Notification (to admin)
-- =====================================================
INSERT INTO email_templates (
  template_name,
  name,
  subject,
  html_content,
  text_content,
  variables,
  is_active,
  created_at,
  updated_at
) VALUES (
  'new_patient',
  'new_patient',
  'Novo Paciente Cadastrado: {{patientName}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Novo Paciente Cadastrado!</h1>
    </div>
    <div class="content">
      <p>Olá Admin,</p>
      <p>Um novo paciente acabou de se cadastrar no sistema Atma Aligner!</p>

      <div class="info-box">
        <h3>Informações do Paciente:</h3>
        <p><strong>Nome:</strong> {{patientName}}</p>
        <p><strong>Email:</strong> {{patientEmail}}</p>
        <p><strong>Telefone:</strong> {{patientPhone}}</p>
        <p><strong>Cadastrado em:</strong> {{registeredAt}}</p>
      </div>

      <p>Acesse o painel administrativo para ver mais detalhes e iniciar o contato:</p>

      <a href="{{dashboardLink}}" class="button">Ver Paciente no Admin</a>

      <div class="footer">
        <p>Atma Aligner - Sistema de Gestão de Ortodontia</p>
        <p>Este é um email automático, não responda.</p>
      </div>
    </div>
  </div>
</body>
</html>',
  'Novo Paciente Cadastrado: {{patientName}}

Nome: {{patientName}}
Email: {{patientEmail}}
Telefone: {{patientPhone}}
Cadastrado em: {{registeredAt}}

Acesse o painel: {{dashboardLink}}

---
Atma Aligner - Sistema de Gestão de Ortodontia',
  '["patientName", "patientEmail", "patientPhone", "registeredAt", "dashboardLink"]',
  true,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  subject = VALUES(subject),
  html_content = VALUES(html_content),
  text_content = VALUES(text_content),
  variables = VALUES(variables),
  updated_at = NOW();

-- =====================================================
-- TEMPLATE 2: Appointment Scheduled (to patient)
-- =====================================================
INSERT INTO email_templates (
  template_name,
  name,
  subject,
  html_content,
  text_content,
  variables,
  is_active,
  created_at,
  updated_at
) VALUES (
  'appointment_scheduled',
  'appointment_scheduled',
  'Consulta Agendada - {{appointmentDate}} às {{appointmentTime}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .appointment-box { background: white; border: 2px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .date-time { font-size: 24px; font-weight: bold; color: #667eea; margin: 10px 0; }
    .info { background: #f0f0f0; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Consulta Agendada com Sucesso!</h1>
    </div>
    <div class="content">
      <p>Olá {{patientName}},</p>
      <p>Sua consulta foi agendada com sucesso!</p>

      <div class="appointment-box">
        <h3>Detalhes da Consulta</h3>
        <div class="date-time">
          📅 {{appointmentDate}}<br>
          🕐 {{appointmentTime}}
        </div>
        <p><strong>Ortodontista:</strong> {{orthodontistName}}</p>
        <p><strong>Local:</strong> {{location}}</p>
      </div>

      {{#if notes}}
      <div class="info">
        <strong>Observações:</strong><br>
        {{notes}}
      </div>
      {{/if}}

      <div class="info">
        <p><strong>⏰ Importante:</strong> Chegue 10 minutos antes do horário agendado.</p>
        <p><strong>📱 Precisa remarcar?</strong> Entre em contato conosco com antecedência.</p>
      </div>

      <div class="footer">
        <p>Atma Aligner - Tecnologia Alemã em Ortodontia</p>
        <p>Em caso de dúvidas, entre em contato conosco.</p>
      </div>
    </div>
  </div>
</body>
</html>',
  'Consulta Agendada com Sucesso!

Olá {{patientName}},

Sua consulta foi agendada:

Data: {{appointmentDate}}
Horário: {{appointmentTime}}
Ortodontista: {{orthodontistName}}
Local: {{location}}

{{#if notes}}Observações: {{notes}}{{/if}}

IMPORTANTE: Chegue 10 minutos antes do horário agendado.

---
Atma Aligner - Tecnologia Alemã em Ortodontia',
  '["patientName", "appointmentDate", "appointmentTime", "orthodontistName", "location", "notes"]',
  true,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  subject = VALUES(subject),
  html_content = VALUES(html_content),
  text_content = VALUES(text_content),
  variables = VALUES(variables),
  updated_at = NOW();

-- =====================================================
-- TEMPLATE 3: Appointment Cancelled
-- =====================================================
INSERT INTO email_templates (
  template_name,
  name,
  subject,
  html_content,
  text_content,
  variables,
  is_active,
  created_at,
  updated_at
) VALUES (
  'appointment_cancelled',
  'appointment_cancelled',
  'Consulta Cancelada - {{appointmentDate}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #e74c3c; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #e74c3c; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Consulta Cancelada</h1>
    </div>
    <div class="content">
      <p>Olá {{patientName}},</p>
      <p>Sua consulta foi cancelada conforme solicitado.</p>

      <div class="info-box">
        <p><strong>Data:</strong> {{appointmentDate}}</p>
        <p><strong>Horário:</strong> {{appointmentTime}}</p>
        <p><strong>Ortodontista:</strong> {{orthodontistName}}</p>
      </div>

      <p>Se desejar agendar uma nova consulta, entre em contato conosco.</p>

      <div class="footer">
        <p>Atma Aligner - Tecnologia Alemã em Ortodontia</p>
      </div>
    </div>
  </div>
</body>
</html>',
  'Consulta Cancelada

Olá {{patientName}},

Sua consulta foi cancelada:

Data: {{appointmentDate}}
Horário: {{appointmentTime}}
Ortodontista: {{orthodontistName}}

Para agendar uma nova consulta, entre em contato conosco.

---
Atma Aligner',
  '["patientName", "appointmentDate", "appointmentTime", "orthodontistName"]',
  true,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  subject = VALUES(subject),
  html_content = VALUES(html_content),
  text_content = VALUES(text_content),
  variables = VALUES(variables),
  updated_at = NOW();

-- =====================================================
-- TEMPLATE 4: Appointment Reminder (24h before)
-- =====================================================
INSERT INTO email_templates (
  template_name,
  name,
  subject,
  html_content,
  text_content,
  variables,
  is_active,
  created_at,
  updated_at
) VALUES (
  'appointment_reminder',
  'appointment_reminder',
  'Lembrete: Consulta Amanhã às {{appointmentTime}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .reminder-box { background: #fff3cd; border: 2px solid #f39c12; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .time { font-size: 28px; font-weight: bold; color: #e67e22; margin: 15px 0; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Lembrete de Consulta</h1>
    </div>
    <div class="content">
      <p>Olá {{patientName}},</p>
      <p>Sua consulta é <strong>AMANHÃ</strong>!</p>

      <div class="reminder-box">
        <h3>📅 Amanhã - {{appointmentDate}}</h3>
        <div class="time">🕐 {{appointmentTime}}</div>
        <p><strong>Ortodontista:</strong> {{orthodontistName}}</p>
        <p><strong>Local:</strong> {{location}}</p>
      </div>

      <p><strong>⏰ Lembre-se:</strong> Chegue 10 minutos antes do horário agendado.</p>

      <div class="footer">
        <p>Atma Aligner - Tecnologia Alemã em Ortodontia</p>
        <p>Nos vemos em breve!</p>
      </div>
    </div>
  </div>
</body>
</html>',
  'Lembrete: Consulta Amanhã!

Olá {{patientName}},

Sua consulta é AMANHÃ:

Data: {{appointmentDate}}
Horário: {{appointmentTime}}
Ortodontista: {{orthodontistName}}
Local: {{location}}

Lembre-se: Chegue 10 minutos antes.

Nos vemos em breve!
---
Atma Aligner',
  '["patientName", "appointmentDate", "appointmentTime", "orthodontistName", "location"]',
  true,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  subject = VALUES(subject),
  html_content = VALUES(html_content),
  text_content = VALUES(text_content),
  variables = VALUES(variables),
  updated_at = NOW();

-- =====================================================
-- TEMPLATE 5: Payment Confirmation (to patient)
-- =====================================================
INSERT INTO email_templates (
  template_name,
  name,
  subject,
  html_content,
  text_content,
  variables,
  is_active,
  created_at,
  updated_at
) VALUES (
  'payment_confirmation',
  'payment_confirmation',
  'Pagamento Confirmado - {{amount}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .payment-box { background: white; border: 2px solid #27ae60; padding: 25px; margin: 20px 0; border-radius: 8px; }
    .amount { font-size: 32px; font-weight: bold; color: #27ae60; text-align: center; margin: 20px 0; }
    .details { background: #f0f0f0; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Pagamento Confirmado!</h1>
    </div>
    <div class="content">
      <p>Olá {{patientName}},</p>
      <p>Confirmamos o recebimento do seu pagamento. Obrigado!</p>

      <div class="payment-box">
        <div class="amount">{{amount}}</div>

        <div class="details">
          <p><strong>Data do Pagamento:</strong> {{paymentDate}}</p>
          <p><strong>Método:</strong> {{paymentMethod}}</p>
          <p><strong>ID da Transação:</strong> {{transactionId}}</p>
        </div>
      </div>

      <p>Guarde este email como comprovante. Em caso de dúvidas, entre em contato conosco informando o ID da transação.</p>

      <div class="footer">
        <p>Atma Aligner - Tecnologia Alemã em Ortodontia</p>
        <p>Obrigado pela sua confiança!</p>
      </div>
    </div>
  </div>
</body>
</html>',
  'Pagamento Confirmado!

Olá {{patientName}},

Confirmamos o recebimento do seu pagamento:

Valor: {{amount}}
Data: {{paymentDate}}
Método: {{paymentMethod}}
ID da Transação: {{transactionId}}

Guarde este email como comprovante.

Obrigado!
---
Atma Aligner',
  '["patientName", "amount", "paymentDate", "paymentMethod", "transactionId"]',
  true,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  subject = VALUES(subject),
  html_content = VALUES(html_content),
  text_content = VALUES(text_content),
  variables = VALUES(variables),
  updated_at = NOW();

-- =====================================================
-- TEMPLATE 6: Weekly Report (to admin)
-- =====================================================
INSERT INTO email_templates (
  template_name,
  name,
  subject,
  html_content,
  text_content,
  variables,
  is_active,
  created_at,
  updated_at
) VALUES (
  'weekly_report',
  'weekly_report',
  'Relatório Semanal Atma Admin - {{period}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
    .stat-number { font-size: 36px; font-weight: bold; color: #667eea; margin: 10px 0; }
    .stat-label { font-size: 14px; color: #666; text-transform: uppercase; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Relatório Semanal</h1>
      <p>{{period}}</p>
      <p style="font-size: 14px; opacity: 0.9;">{{startDate}} - {{endDate}}</p>
    </div>
    <div class="content">
      <h2>Resumo da Semana</h2>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Novos Pacientes</div>
          <div class="stat-number">{{newPatients}}</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Novos Agendamentos</div>
          <div class="stat-number">{{newAppointments}}</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Receita</div>
          <div class="stat-number">{{revenue}}</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Taxa de Conversão</div>
          <div class="stat-number">{{leadConversionRate}}</div>
        </div>
      </div>

      <p style="margin-top: 30px;">Este é o resumo automático da semana. Acesse o painel administrativo para visualizar dados detalhados.</p>

      <div class="footer">
        <p>Atma Aligner - Sistema de Gestão de Ortodontia</p>
        <p>Relatório gerado automaticamente</p>
      </div>
    </div>
  </div>
</body>
</html>',
  'Relatório Semanal Atma Admin

Período: {{period}}
{{startDate}} - {{endDate}}

=== RESUMO DA SEMANA ===

Novos Pacientes: {{newPatients}}
Novos Agendamentos: {{newAppointments}}
Receita: {{revenue}}
Taxa de Conversão de Leads: {{leadConversionRate}}

---
Atma Aligner - Sistema de Gestão de Ortodontia
Relatório gerado automaticamente',
  '["period", "startDate", "endDate", "newPatients", "newAppointments", "revenue", "leadConversionRate"]',
  true,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  subject = VALUES(subject),
  html_content = VALUES(html_content),
  text_content = VALUES(text_content),
  variables = VALUES(variables),
  updated_at = NOW();

-- =====================================================
-- TEMPLATE 7: Generic Template (fallback)
-- =====================================================
INSERT INTO email_templates (
  template_name,
  name,
  subject,
  html_content,
  text_content,
  variables,
  is_active,
  created_at,
  updated_at
) VALUES (
  'generic',
  'generic',
  '{{subject}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; white-space: pre-wrap; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Atma Aligner</h1>
    </div>
    <div class="content">
      {{message}}

      <div class="footer">
        <p>Atma Aligner - Tecnologia Alemã em Ortodontia</p>
      </div>
    </div>
  </div>
</body>
</html>',
  '{{message}}

---
Atma Aligner - Tecnologia Alemã em Ortodontia',
  '["subject", "message"]',
  true,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  subject = VALUES(subject),
  html_content = VALUES(html_content),
  text_content = VALUES(text_content),
  variables = VALUES(variables),
  updated_at = NOW();

-- =====================================================
-- Verify templates were created
-- =====================================================
SELECT
  template_name,
  name,
  subject,
  is_active,
  created_at
FROM email_templates
WHERE template_name IN (
  'new_patient',
  'appointment_scheduled',
  'appointment_cancelled',
  'appointment_reminder',
  'payment_confirmation',
  'weekly_report',
  'generic'
)
ORDER BY template_name;
