-- Migration 008: Google Search Console Integration (MySQL)
-- Created: 2025-11-05
-- Description: Tables for storing Google OAuth tokens, SEO metrics history, and alerts

-- =============================================================================
-- 1. Google Auth Tokens Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS google_auth_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL COMMENT 'Admin user who authorized',
  access_token TEXT NOT NULL COMMENT 'Short-lived access token (expires in ~1 hour)',
  refresh_token TEXT NOT NULL COMMENT 'Long-lived refresh token',
  token_type VARCHAR(50) DEFAULT 'Bearer',
  expires_at DATETIME NOT NULL COMMENT 'Access token expiration timestamp',
  scope TEXT NULL COMMENT 'OAuth scopes granted',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_google_tokens_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores Google OAuth 2.0 tokens for Search Console API access';

-- =============================================================================
-- 2. SEO Metrics History Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS seo_metrics_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE COMMENT 'Date of the metrics (YYYY-MM-DD)',
  impressions INT NOT NULL DEFAULT 0 COMMENT 'Total impressions for the day',
  clicks INT NOT NULL DEFAULT 0 COMMENT 'Total clicks for the day',
  ctr DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Average CTR as percentage',
  position DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Average position in search results',
  top_keywords JSON NULL COMMENT 'Top 20 keywords: [{query, impressions, clicks, ctr, position}]',
  top_pages JSON NULL COMMENT 'Top 20 pages: [{page, impressions, clicks, ctr, position}]',
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'When synced from GSC',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_seo_metrics_date (date DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Daily aggregated SEO metrics from Google Search Console';

-- =============================================================================
-- 3. SEO Alerts Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS seo_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL COMMENT 'Alert type: impressions_drop, clicks_drop, etc.',
  severity VARCHAR(20) NOT NULL COMMENT 'critical (>50%), warning (20-50%), info (<20%)',
  message TEXT NOT NULL COMMENT 'Human-readable alert message',
  metric_name VARCHAR(50) NULL COMMENT 'Metric that triggered alert',
  metric_value DECIMAL(10,2) NULL COMMENT 'Current value',
  previous_value DECIMAL(10,2) NULL COMMENT 'Previous value',
  change_percentage DECIMAL(10,2) NULL COMMENT 'Percentage change',
  url TEXT NULL COMMENT 'Specific URL if page-specific',
  keyword VARCHAR(255) NULL COMMENT 'Specific keyword if keyword-specific',
  date DATE NOT NULL COMMENT 'Date when alert triggered',
  resolved BOOLEAN DEFAULT FALSE COMMENT 'Whether acknowledged/resolved',
  resolved_at DATETIME NULL COMMENT 'When resolved',
  resolved_by INT NULL COMMENT 'User ID who resolved',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_seo_alerts_unresolved (resolved, created_at DESC),
  INDEX idx_seo_alerts_type (type, date DESC),
  INDEX idx_seo_alerts_severity (severity, date DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Automated alerts for significant SEO metric changes';

-- =============================================================================
-- 4. Verification Queries
-- =============================================================================
-- Run these to verify:
-- SELECT COUNT(*) as google_auth_tokens_count FROM google_auth_tokens;
-- SELECT COUNT(*) as seo_metrics_count FROM seo_metrics_history;
-- SELECT COUNT(*) as seo_alerts_count FROM seo_alerts;
-- SHOW TABLES LIKE '%seo%';
-- SHOW TABLES LIKE '%google%';
