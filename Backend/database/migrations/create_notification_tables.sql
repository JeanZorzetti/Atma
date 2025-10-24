-- Migration: Create notification system tables
-- Created: 2025-10-24
-- Description: Creates all necessary tables for the notification system

-- =====================================================
-- TABLE 1: email_templates
-- Stores Handlebars email templates
-- =====================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_template_name (template_name),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 2: notification_log
-- Logs all notifications sent (email/SMS)
-- =====================================================
CREATE TABLE IF NOT EXISTS notification_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_type VARCHAR(50) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_sent BOOLEAN DEFAULT FALSE,
  sms_sent BOOLEAN DEFAULT FALSE,
  status ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
  error_message TEXT,
  metadata JSON,

  INDEX idx_notification_type (notification_type),
  INDEX idx_recipient (recipient),
  INDEX idx_sent_at (sent_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 3: system_settings (if not exists)
-- Stores system-wide configuration
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  description VARCHAR(500),
  category VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_setting_key (setting_key),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Insert default notification settings
-- =====================================================
INSERT INTO system_settings (setting_key, setting_value, description, category) VALUES
  ('notification_email', 'true', 'Enable email notifications', 'notifications'),
  ('notification_sms', 'false', 'Enable SMS notifications', 'notifications'),
  ('notification_type_new_patients', 'true', 'Notify when new patients register', 'notifications'),
  ('notification_type_appointments', 'true', 'Notify for appointment events', 'notifications'),
  ('notification_type_payments', 'true', 'Notify when payments are confirmed', 'notifications'),
  ('notification_type_weekly_reports', 'true', 'Send weekly reports to admin', 'notifications'),
  ('notification_type_system_alerts', 'true', 'Send system alerts to admin', 'notifications'),
  ('admin_email', 'admin@atma.com.br', 'Admin email for notifications', 'notifications')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  description = VALUES(description),
  updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- Verify tables were created
-- =====================================================
SHOW TABLES LIKE '%email_templates%';
SHOW TABLES LIKE '%notification_log%';
SHOW TABLES LIKE '%system_settings%';

-- Show structure
DESCRIBE email_templates;
DESCRIBE notification_log;
DESCRIBE system_settings;
