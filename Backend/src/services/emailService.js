const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { executeQuery } = require('../config/database');
const { logger, logEmailSent } = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.init();
  }

  async init() {
    try {
      // Configurar transporter
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      });

      // Verificar conexão
      await this.transporter.verify();
      logger.info('✅ Serviço de email configurado com sucesso');
      
      // Carregar templates
      await this.loadTemplates();
      
    } catch (error) {
      logger.error('❌ Erro ao configurar serviço de email:', error.message);
    }
  }

  async loadTemplates() {
    try {
      // Carregar templates do banco de dados
      const templates = await executeQuery('SELECT * FROM email_templates WHERE is_active = true');
      
      for (const template of templates) {
        // Compilar template com Handlebars
        const compiledTemplate = handlebars.compile(template.html_content);
        this.templates.set(template.name, {
          subject: template.subject,
          html: compiledTemplate,
          text: template.text_content,
          variables: JSON.parse(template.variables || '[]')
        });
      }
      
      logger.info(`📧 ${templates.length} templates de email carregados`);
      
    } catch (error) {
      logger.error('Erro ao carregar templates de email:', error.message);
    }
  }

  async sendEmail(to, templateName, data = {}, options = {}) {
    try {
      if (!this.transporter) {
        throw new Error('Serviço de email não está configurado');
      }

      const template = this.templates.get(templateName);
      if (!template) {
        throw new Error(`Template '${templateName}' não encontrado`);
      }

      // Renderizar template com dados
      const htmlContent = template.html(data);
      const subject = handlebars.compile(template.subject)(data);

      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'Atma Aligner'} <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html: htmlContent,
        text: template.text || this.htmlToText(htmlContent),
        ...options
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Log do email enviado
      await this.logEmail(to, subject, templateName, 'enviado', JSON.stringify(data), options.relatedTable, options.relatedId);
      
      logEmailSent(to, subject, templateName, 'enviado');
      
      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
      
    } catch (error) {
      logger.error('Erro ao enviar email:', {
        to,
        templateName,
        error: error.message
      });
      
      // Log do erro
      await this.logEmail(to, templateName, templateName, 'falhado', JSON.stringify(data), options.relatedTable, options.relatedId, error.message);
      
      throw error;
    }
  }

  async logEmail(to, subject, templateName, status, templateData, relatedTable = null, relatedId = null, errorMessage = null) {
    try {
      await executeQuery(
        `INSERT INTO email_logs (to_email, to_name, subject, template_name, template_data, status, provider_response, related_table, related_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Array.isArray(to) ? to[0] : to,
          null, // to_name pode ser extraído se necessário
          subject,
          templateName,
          templateData,
          status,
          errorMessage || null,
          relatedTable,
          relatedId
        ]
      );
    } catch (error) {
      logger.error('Erro ao registrar log de email:', error.message);
    }
  }

  htmlToText(html) {
    // Conversão simples de HTML para texto
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  // Método específico para confirmação de pacientes
  async sendPatientConfirmation(patientData) {
    const { nome, email, telefone, cep } = patientData;
    
    return this.sendEmail(
      email,
      'patient_lead_confirmation',
      { nome, email, telefone, cep },
      {
        relatedTable: 'patient_leads',
        relatedId: patientData.id
      }
    );
  }

  // Método específico para confirmação de ortodontistas
  async sendOrthodontistPartnershipConfirmation(orthodontistData) {
    const { nome, email, clinica, cro, interesse } = orthodontistData;
    
    return this.sendEmail(
      email,
      'orthodontist_partnership_confirmation',
      { nome, email, clinica, cro, interesse },
      {
        relatedTable: 'orthodontist_partnerships',
        relatedId: orthodontistData.id
      }
    );
  }

  // Método para notificar ortodontista sobre novo lead
  async sendNewLeadNotification(orthodontist, patientData) {
    const { nome, telefone, email, cep } = patientData;
    
    return this.sendEmail(
      orthodontist.email,
      'new_lead_notification',
      { 
        nome, 
        telefone, 
        email, 
        cep,
        ortodontista_nome: orthodontist.nome,
        clinica: orthodontist.clinica
      },
      {
        relatedTable: 'patient_orthodontist_assignments',
        relatedId: patientData.assignmentId
      }
    );
  }

  // Método para notificar equipe comercial sobre nova parceria
  async sendNewPartnershipNotification(partnershipData) {
    const commercialEmail = process.env.COMMERCIAL_EMAIL || process.env.ADMIN_EMAIL;
    
    if (!commercialEmail) {
      logger.warn('Email comercial não configurado para notificações');
      return;
    }

    const emailData = {
      ...partnershipData,
      casos_mes_texto: this.getCasosMesTexto(partnershipData.casosmes),
      interesse_texto: this.getInteresseTexto(partnershipData.interesse),
      scanner_texto: partnershipData.scanner === 'sim' ? `Sim - ${partnershipData.scannerMarca || 'Não informado'}` : 'Não'
    };

    return this.sendEmail(
      commercialEmail,
      'new_partnership_commercial_notification',
      emailData,
      {
        relatedTable: 'orthodontist_partnerships',
        relatedId: partnershipData.requestId
      }
    );
  }

  // Método para lembrete de follow-up
  async sendFollowUpReminder(type, data) {
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      logger.warn('Email de admin não configurado para lembretes');
      return;
    }

    const templateName = type === 'patient' ? 'patient_follow_up_reminder' : 'partnership_follow_up_reminder';
    
    return this.sendEmail(
      adminEmail,
      templateName,
      data,
      {
        relatedTable: type === 'patient' ? 'patient_leads' : 'orthodontist_partnerships',
        relatedId: data.id
      }
    );
  }

  // Método para envio de newsletter/marketing
  async sendMarketingEmail(recipients, templateName, data) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail(
          recipient.email,
          templateName,
          { ...data, nome: recipient.nome },
          { priority: 'low' }
        );
        results.push({ email: recipient.email, success: true, result });
      } catch (error) {
        results.push({ email: recipient.email, success: false, error: error.message });
      }
      
      // Pequeno delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Métodos auxiliares
  getCasosMesTexto(casosmes) {
    const map = {
      '1-5': '1 a 5 casos por mês',
      '6-10': '6 a 10 casos por mês',
      '11-20': '11 a 20 casos por mês',
      '21+': 'Mais de 21 casos por mês'
    };
    return map[casosmes] || casosmes;
  }

  getInteresseTexto(interesse) {
    const map = {
      'atma-aligner': 'Atma Aligner (Marca Própria)',
      'atma-labs': 'Atma Labs (White Label)',
      'ambos': 'Ambos os modelos'
    };
    return map[interesse] || interesse;
  }

  // Método para testar configuração de email
  async testEmailConfiguration() {
    try {
      const testEmail = process.env.ADMIN_EMAIL || 'test@example.com';
      
      const result = await this.sendEmail(
        testEmail,
        'test_email',
        {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development'
        }
      );
      
      logger.info('✅ Teste de email enviado com sucesso');
      return result;
      
    } catch (error) {
      logger.error('❌ Falha no teste de email:', error.message);
      throw error;
    }
  }

  // Método para recarregar templates
  async reloadTemplates() {
    this.templates.clear();
    await this.loadTemplates();
    logger.info('🔄 Templates de email recarregados');
  }
}

// Criar instância singleton
const emailService = new EmailService();

module.exports = emailService;