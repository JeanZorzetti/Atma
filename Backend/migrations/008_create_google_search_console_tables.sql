-- Migration 008: Google Search Console Integration
-- Created: 2025-11-05
-- Description: Tables for storing Google OAuth tokens, SEO metrics history, and alerts

-- =============================================================================
-- 1. Google Auth Tokens Table
-- =============================================================================
-- Stores OAuth 2.0 tokens for Google Search Console API access
CREATE TABLE IF NOT EXISTS google_auth_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER, -- admin user who authorized (optional, for future multi-user support)
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  expires_at TIMESTAMP NOT NULL,
  scope TEXT, -- OAuth scopes granted (e.g., 'https://www.googleapis.com/auth/webmasters.readonly')
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for token expiration queries
CREATE INDEX IF NOT EXISTS idx_google_tokens_expires ON google_auth_tokens(expires_at);

-- Comment
COMMENT ON TABLE google_auth_tokens IS 'Stores Google OAuth 2.0 tokens for Search Console API access';
COMMENT ON COLUMN google_auth_tokens.access_token IS 'Short-lived access token (expires in ~1 hour)';
COMMENT ON COLUMN google_auth_tokens.refresh_token IS 'Long-lived refresh token (used to get new access tokens)';
COMMENT ON COLUMN google_auth_tokens.expires_at IS 'Access token expiration timestamp (São Paulo GMT-3)';

-- =============================================================================
-- 2. SEO Metrics History Table
-- =============================================================================
-- Stores daily aggregated metrics from Google Search Console
CREATE TABLE IF NOT EXISTS seo_metrics_history (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE, -- Date of the metrics (YYYY-MM-DD)
  impressions INTEGER NOT NULL DEFAULT 0, -- Total impressions for the day
  clicks INTEGER NOT NULL DEFAULT 0, -- Total clicks for the day
  ctr NUMERIC(5,2) NOT NULL DEFAULT 0, -- Average CTR (click-through rate) as percentage
  position NUMERIC(5,2) NOT NULL DEFAULT 0, -- Average position in search results
  top_keywords JSONB, -- Array of top performing keywords: [{query, impressions, clicks, ctr, position}, ...]
  top_pages JSONB, -- Array of top performing pages: [{page, impressions, clicks, ctr, position}, ...]
  synced_at TIMESTAMP DEFAULT NOW(), -- When this data was last synced from GSC
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for date-based queries (most recent first)
CREATE INDEX IF NOT EXISTS idx_seo_metrics_date ON seo_metrics_history(date DESC);

-- Index for searching keywords in JSONB
CREATE INDEX IF NOT EXISTS idx_seo_keywords_gin ON seo_metrics_history USING GIN (top_keywords);

-- Index for searching pages in JSONB
CREATE INDEX IF NOT EXISTS idx_seo_pages_gin ON seo_metrics_history USING GIN (top_pages);

-- Comments
COMMENT ON TABLE seo_metrics_history IS 'Daily aggregated SEO metrics from Google Search Console';
COMMENT ON COLUMN seo_metrics_history.date IS 'Date of metrics (UTC, converted to São Paulo GMT-3 on display)';
COMMENT ON COLUMN seo_metrics_history.impressions IS 'Total number of times site appeared in search results';
COMMENT ON COLUMN seo_metrics_history.clicks IS 'Total number of clicks from search results';
COMMENT ON COLUMN seo_metrics_history.ctr IS 'Average click-through rate (clicks/impressions * 100)';
COMMENT ON COLUMN seo_metrics_history.position IS 'Average position in search results (weighted by impressions)';
COMMENT ON COLUMN seo_metrics_history.top_keywords IS 'Top 20 keywords: [{query, impressions, clicks, ctr, position}]';
COMMENT ON COLUMN seo_metrics_history.top_pages IS 'Top 20 pages: [{page, impressions, clicks, ctr, position}]';

-- =============================================================================
-- 3. SEO Alerts Table
-- =============================================================================
-- Stores automated alerts for significant SEO changes
CREATE TABLE IF NOT EXISTS seo_alerts (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- Alert type: 'impressions_drop', 'clicks_drop', 'position_worse', 'new_top_keyword', 'page_deindexed'
  severity VARCHAR(20) NOT NULL, -- 'critical' (>50% drop), 'warning' (20-50% drop), 'info' (<20% or positive)
  message TEXT NOT NULL, -- Human-readable alert message
  metric_name VARCHAR(50), -- Metric that triggered alert (e.g., 'impressions', 'clicks', 'position')
  metric_value NUMERIC, -- Current value of the metric
  previous_value NUMERIC, -- Previous value for comparison
  change_percentage NUMERIC, -- Percentage change (positive or negative)
  url TEXT, -- Specific URL if alert is page-specific
  keyword TEXT, -- Specific keyword if alert is keyword-specific
  date DATE NOT NULL, -- Date when the alert was triggered
  resolved BOOLEAN DEFAULT FALSE, -- Whether alert has been acknowledged/resolved
  resolved_at TIMESTAMP, -- When the alert was resolved
  resolved_by INTEGER, -- User ID who resolved (optional, for future)
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for unresolved alerts (most recent first)
CREATE INDEX IF NOT EXISTS idx_seo_alerts_unresolved ON seo_alerts(resolved, created_at DESC) WHERE resolved = FALSE;

-- Index for alert type queries
CREATE INDEX IF NOT EXISTS idx_seo_alerts_type ON seo_alerts(type, date DESC);

-- Index for severity queries
CREATE INDEX IF NOT EXISTS idx_seo_alerts_severity ON seo_alerts(severity, date DESC);

-- Comments
COMMENT ON TABLE seo_alerts IS 'Automated alerts for significant SEO metric changes';
COMMENT ON COLUMN seo_alerts.type IS 'Type of alert (impressions_drop, clicks_drop, position_worse, etc.)';
COMMENT ON COLUMN seo_alerts.severity IS 'Alert severity: critical (>50%), warning (20-50%), info (<20%)';
COMMENT ON COLUMN seo_alerts.change_percentage IS 'Percentage change: negative for drops, positive for improvements';

-- =============================================================================
-- 4. Sample Data (for development/testing)
-- =============================================================================
-- NOTE: Remove this section in production or after initial testing

-- Example: Insert sample SEO metrics for last 7 days
-- DO $$
-- DECLARE
--   i INTEGER;
--   sample_date DATE;
-- BEGIN
--   FOR i IN 0..6 LOOP
--     sample_date := CURRENT_DATE - i;
--
--     INSERT INTO seo_metrics_history (date, impressions, clicks, ctr, position)
--     VALUES (
--       sample_date,
--       300 + (RANDOM() * 100)::INTEGER, -- Random impressions 300-400
--       25 + (RANDOM() * 10)::INTEGER,   -- Random clicks 25-35
--       8.5 + (RANDOM() * 2),            -- Random CTR 8.5-10.5%
--       5.0 + (RANDOM() * 2)             -- Random position 5.0-7.0
--     )
--     ON CONFLICT (date) DO NOTHING;
--   END LOOP;
-- END $$;

-- =============================================================================
-- 5. Verification Queries
-- =============================================================================
-- Run these queries to verify tables were created successfully:

-- SELECT COUNT(*) FROM google_auth_tokens;
-- SELECT COUNT(*) FROM seo_metrics_history;
-- SELECT COUNT(*) FROM seo_alerts;

-- =============================================================================
-- Migration Complete
-- =============================================================================
