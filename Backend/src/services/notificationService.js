const { executeQuery } = require('../config/database');
const { logger } = require('../utils/logger');
const emailService = require('./emailService');

class NotificationService {
  constructor() {
    this.settings = {};
    this.notificationQueue = [];
    this.processing = false;
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const settings = await executeQuery('SELECT * FROM system_settings WHERE setting_key LIKE "notification%"');

      this.settings = {
        emailEnabled: false,
        smsEnabled: false,
        types: {
          newPatients: false,
          appointments: false,
          payments: false,
          weeklyReports: false,
          systemAlerts: false
        }
      };

      settings.forEach(setting => {
        if (setting.setting_key === 'notification_email') {
          this.settings.emailEnabled = setting.setting_value === 'true';
        } else if (setting.setting_key === 'notification_sms') {
          this.settings.smsEnabled = setting.setting_value === 'true';
        } else if (setting.setting_key.startsWith('notification_type_')) {
          const type = setting.setting_key.replace('notification_type_', '').replace(/_/g, '');
          // Converter snake_case para camelCase
          const camelCaseType = type.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          if (this.settings.types.hasOwnProperty(camelCaseType)) {
            this.settings.types[camelCaseType] = setting.setting_value === 'true';
          }
        }
      });

      logger.info('✅ Configurações de notificação carregadas', this.settings);

    } catch (error) {
      logger.error('Erro ao carregar configurações de notificação:', error);
    }
  }

  /**
   * Envia notificação (email e/ou SMS)
   * @param {Object} notification
   * @param {string} notification.type - Tipo: newPatients, appointments, payments, weeklyReports, systemAlerts
   * @param {string} notification.to - Email ou telefone do destinatário
   * @param {string} notification.subject - Assunto da notificação
   * @param {string} notification.message - Mensagem (texto simples ou HTML)
   * @param {Object} notification.data - Dados adicionais para template
   * @param {string} notification.templateName - Nome do template (opcional)
   * @param {boolean} notification.priority - Alta prioridade (envia imediatamente)
   */
  async sendNotification(notification) {
    try {
      // Verificar se o tipo de notificação está habilitado
      if (!this.settings.types[notification.type]) {
        logger.debug(`Notificação do tipo '${notification.type}' está desabilitada - ignorando`);
        return { success: false, reason: 'disabled' };
      }

      const results = { email: null, sms: null };

      // Enviar por email se habilitado
      if (this.settings.emailEnabled && notification.to && notification.to.includes('@')) {
        results.email = await this.sendEmailNotification(notification);
      }

      // Enviar por SMS se habilitado e tem telefone
      if (this.settings.smsEnabled && notification.to && !notification.to.includes('@')) {
        results.sms = await this.sendSMSNotification(notification);
      }

      // Registrar notificação no banco
      await this.logNotification(notification, results);

      return { success: true, results };

    } catch (error) {
      logger.error('Erro ao enviar notificação:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEmailNotification(notification) {
    try {
      const { to, subject, message, data, templateName } = notification;

      // Se tem templateName, usa o sistema de templates
      if (templateName) {
        await emailService.sendEmail(to, templateName, data || {});
      } else {
        // Envia email simples
        await emailService.sendEmail(to, 'generic', {
          subject,
          message,
          ...data
        });
      }

      logger.info(`📧 Email enviado para ${to}: ${subject}`);
      return { success: true, sentAt: new Date() };

    } catch (error) {
      logger.error(`Erro ao enviar email para ${notification.to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async sendSMSNotification(notification) {
    try {
      // TODO: Implementar integração com serviço de SMS (Twilio, etc)
      logger.warn(`SMS não implementado ainda. Mensagem para ${notification.to}: ${notification.message}`);

      // Por enquanto, apenas simula o envio
      return { success: false, reason: 'not_implemented' };

    } catch (error) {
      logger.error(`Erro ao enviar SMS para ${notification.to}:`, error);
      return { success: false, error: error.message };
    }
  }

  async logNotification(notification, results) {
    try {
      await executeQuery(
        `INSERT INTO notification_log
        (notification_type, recipient, subject, sent_at, email_sent, sms_sent, status)
        VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
        [
          notification.type,
          notification.to,
          notification.subject,
          results.email?.success ? 1 : 0,
          results.sms?.success ? 1 : 0,
          results.email?.success || results.sms?.success ? 'sent' : 'failed'
        ]
      );
    } catch (error) {
      logger.error('Erro ao registrar notificação:', error);
    }
  }

  /**
   * Notificações Específicas por Evento
   */

  async notifyNewPatient(patient) {
    try {
      // Buscar email do admin
      const adminSettings = await executeQuery(
        'SELECT setting_value FROM system_settings WHERE setting_key = "admin_email" LIMIT 1'
      );

      if (!adminSettings || adminSettings.length === 0) {
        logger.warn('Email do administrador não configurado');
        return;
      }

      const adminEmail = adminSettings[0].setting_value;

      await this.sendNotification({
        type: 'newPatients',
        to: adminEmail,
        subject: `Novo Paciente Cadastrado: ${patient.name}`,
        templateName: 'new_patient',
        data: {
          patientName: patient.name,
          patientEmail: patient.email,
          patientPhone: patient.phone,
          registeredAt: new Date().toLocaleString('pt-BR'),
          dashboardLink: `${process.env.ADMIN_URL}/admin/pacientes/${patient.id}`
        }
      });

      logger.info(`Notificação de novo paciente enviada: ${patient.name}`);

    } catch (error) {
      logger.error('Erro ao notificar novo paciente:', error);
    }
  }

  async notifyAppointment(appointment, action = 'scheduled') {
    try {
      // action pode ser: 'scheduled', 'cancelled', 'rescheduled', 'reminder'

      // Buscar dados completos do agendamento
      const appointmentData = await executeQuery(
        `SELECT
          a.*,
          p.name as patient_name,
          p.email as patient_email,
          o.name as orthodontist_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN orthodontists o ON a.orthodontist_id = o.id
        WHERE a.id = ?`,
        [appointment.id]
      );

      if (!appointmentData || appointmentData.length === 0) {
        logger.warn(`Agendamento ${appointment.id} não encontrado`);
        return;
      }

      const appt = appointmentData[0];

      // Definir assunto baseado na ação
      const subjects = {
        scheduled: 'Consulta Agendada com Sucesso',
        cancelled: 'Consulta Cancelada',
        rescheduled: 'Consulta Reagendada',
        reminder: 'Lembrete: Consulta Amanhã'
      };

      // Notificar paciente
      if (appt.patient_email) {
        await this.sendNotification({
          type: 'appointments',
          to: appt.patient_email,
          subject: subjects[action],
          templateName: `appointment_${action}`,
          data: {
            patientName: appt.patient_name,
            orthodontistName: appt.orthodontist_name,
            appointmentDate: new Date(appt.appointment_date).toLocaleDateString('pt-BR'),
            appointmentTime: appt.appointment_time,
            location: appt.location || 'Clínica',
            notes: appt.notes
          }
        });
      }

      // Notificar admin
      const adminEmail = await this.getAdminEmail();
      if (adminEmail) {
        await this.sendNotification({
          type: 'appointments',
          to: adminEmail,
          subject: `Agendamento ${action}: ${appt.patient_name}`,
          message: `
            Paciente: ${appt.patient_name}
            Ortodontista: ${appt.orthodontist_name}
            Data: ${new Date(appt.appointment_date).toLocaleDateString('pt-BR')}
            Horário: ${appt.appointment_time}
            Status: ${action}
          `
        });
      }

      logger.info(`Notificação de agendamento enviada (${action}): ${appt.patient_name}`);

    } catch (error) {
      logger.error('Erro ao notificar agendamento:', error);
    }
  }

  async notifyPayment(payment) {
    try {
      // Buscar dados do pagamento
      const paymentData = await executeQuery(
        `SELECT
          pay.*,
          p.name as patient_name,
          p.email as patient_email
        FROM payments pay
        JOIN patients p ON pay.patient_id = p.id
        WHERE pay.id = ?`,
        [payment.id]
      );

      if (!paymentData || paymentData.length === 0) {
        logger.warn(`Pagamento ${payment.id} não encontrado`);
        return;
      }

      const pmt = paymentData[0];

      // Notificar paciente
      if (pmt.patient_email) {
        await this.sendNotification({
          type: 'payments',
          to: pmt.patient_email,
          subject: 'Pagamento Confirmado - Atma Aligner',
          templateName: 'payment_confirmation',
          data: {
            patientName: pmt.patient_name,
            amount: parseFloat(pmt.amount).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }),
            paymentDate: new Date(pmt.payment_date).toLocaleDateString('pt-BR'),
            paymentMethod: pmt.payment_method,
            transactionId: pmt.transaction_id
          }
        });
      }

      // Notificar admin
      const adminEmail = await this.getAdminEmail();
      if (adminEmail) {
        await this.sendNotification({
          type: 'payments',
          to: adminEmail,
          subject: `Pagamento Recebido: R$ ${pmt.amount}`,
          message: `
            Paciente: ${pmt.patient_name}
            Valor: ${parseFloat(pmt.amount).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
            Método: ${pmt.payment_method}
            Data: ${new Date(pmt.payment_date).toLocaleDateString('pt-BR')}
          `
        });
      }

      logger.info(`Notificação de pagamento enviada: R$ ${pmt.amount}`);

    } catch (error) {
      logger.error('Erro ao notificar pagamento:', error);
    }
  }

  async notifySystemAlert(alert) {
    try {
      const adminEmail = await this.getAdminEmail();

      if (!adminEmail) {
        logger.warn('Email do admin não configurado para alerta de sistema');
        return;
      }

      await this.sendNotification({
        type: 'systemAlerts',
        to: adminEmail,
        subject: `[ALERTA] ${alert.title}`,
        message: alert.message,
        priority: true
      });

      logger.info(`Alerta de sistema enviado: ${alert.title}`);

    } catch (error) {
      logger.error('Erro ao enviar alerta de sistema:', error);
    }
  }

  async sendWeeklyReport() {
    try {
      const adminEmail = await this.getAdminEmail();

      if (!adminEmail) {
        logger.warn('Email do admin não configurado para relatório semanal');
        return;
      }

      // Buscar estatísticas da semana
      const stats = await this.getWeeklyStats();

      await this.sendNotification({
        type: 'weeklyReports',
        to: adminEmail,
        subject: 'Relatório Semanal - Atma Admin',
        templateName: 'weekly_report',
        data: stats
      });

      logger.info('Relatório semanal enviado');

    } catch (error) {
      logger.error('Erro ao enviar relatório semanal:', error);
    }
  }

  async getWeeklyStats() {
    try {
      // Estatísticas dos últimos 7 dias
      const [newPatients] = await executeQuery(
        'SELECT COUNT(*) as count FROM patients WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
      );

      const [newAppointments] = await executeQuery(
        'SELECT COUNT(*) as count FROM appointments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
      );

      const [paymentsSum] = await executeQuery(
        'SELECT SUM(amount) as total FROM payments WHERE payment_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
      );

      const [leadConversionRate] = await executeQuery(
        `SELECT
          COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
          COUNT(*) as total
        FROM crm_leads
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
      );

      return {
        period: 'Últimos 7 dias',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        endDate: new Date().toLocaleDateString('pt-BR'),
        newPatients: newPatients.count || 0,
        newAppointments: newAppointments.count || 0,
        revenue: parseFloat(paymentsSum.total || 0).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        leadConversionRate: leadConversionRate.total > 0
          ? ((leadConversionRate.converted / leadConversionRate.total) * 100).toFixed(1) + '%'
          : '0%'
      };

    } catch (error) {
      logger.error('Erro ao buscar estatísticas semanais:', error);
      return {};
    }
  }

  async getAdminEmail() {
    try {
      const result = await executeQuery(
        'SELECT setting_value FROM system_settings WHERE setting_key = "admin_email" LIMIT 1'
      );
      return result && result.length > 0 ? result[0].setting_value : null;
    } catch (error) {
      logger.error('Erro ao buscar email do admin:', error);
      return null;
    }
  }

  /**
   * Testar envio de notificação (para debug)
   */
  async sendTestNotification(to, type = 'systemAlerts') {
    return await this.sendNotification({
      type,
      to,
      subject: 'Teste de Notificação - Atma Admin',
      message: `Esta é uma notificação de teste enviada em ${new Date().toLocaleString('pt-BR')}.

      Se você recebeu este email, o sistema de notificações está funcionando corretamente! ✅`,
      data: {
        testDate: new Date().toLocaleString('pt-BR'),
        systemVersion: '1.0.0'
      }
    });
  }
}

// Criar instância singleton
const notificationService = new NotificationService();

// Recarregar configurações quando necessário
notificationService.reloadSettings = () => notificationService.loadSettings();

module.exports = notificationService;
