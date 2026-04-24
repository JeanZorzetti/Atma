-- Migration: Criar tabela de logs de emails
-- Descrição: Armazena histórico de emails enviados aos usuários
-- Data: 2024-12-01

-- Criar tabela portal_email_logs
CREATE TABLE IF NOT EXISTS portal_email_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo_email VARCHAR(50) NOT NULL COMMENT 'cadastro, lembrete-3dias, lembrete-7dias, agendamento',
  status VARCHAR(20) NOT NULL DEFAULT 'enviado' COMMENT 'enviado, erro, bounce',
  metadata JSON COMMENT 'Dados adicionais do email (subject, message_id, etc)',
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Índices
  INDEX idx_user_id (user_id),
  INDEX idx_tipo_email (tipo_email),
  INDEX idx_sent_at (sent_at),
  INDEX idx_user_tipo (user_id, tipo_email),

  -- Foreign key
  FOREIGN KEY (user_id) REFERENCES portal_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentário da tabela
ALTER TABLE portal_email_logs COMMENT = 'Log de emails enviados aos usuários do portal';
