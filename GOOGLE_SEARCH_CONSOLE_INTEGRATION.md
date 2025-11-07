# Google Search Console Integration - Implementation Complete

## Overview

Complete integration of Google Search Console API into the Atma admin panel, enabling SEO metrics tracking, automated alerts, and performance monitoring.

---

## ✅ Implementation Summary

### Phase 1: Database & Authentication (COMPLETE)

#### Database Tables Created
- **google_auth_tokens** - OAuth 2.0 token storage
- **seo_metrics_history** - Daily SEO metrics (impressions, clicks, CTR, position)
- **seo_alerts** - Automated performance alerts

#### Files Created/Modified:
- `Backend/migrations/008_create_google_search_console_tables_mysql.sql`
- `Backend/scripts/run-migration-008.js`
- `Backend/.env` (added Google OAuth credentials)

**Migration Status**: ✅ Executed successfully (3 tables created)

---

### Phase 2: Backend API (COMPLETE)

#### Service Layer
- **GoogleSearchConsoleService** (`Backend/src/services/googleSearchConsoleService.js`)
  - OAuth token management (get, refresh, store)
  - Fetch metrics from Google Search Console API
  - Sync daily/date range metrics to database
  - Automated alert detection (>20% drops in impressions, clicks, position)
  - Metrics summary generation

#### Controller & Routes
- **searchConsoleController.js** - API endpoint handlers
- **searchConsoleRoutes.js** - Route definitions
- **server.js** - Routes registered at `/api/search-console`

#### API Endpoints Created:

**Authentication:**
- `GET /api/search-console/auth/url` - Generate OAuth authorization URL
- `GET /api/search-console/auth/callback` - Handle OAuth callback
- `GET /api/search-console/auth/status` - Check authentication status
- `DELETE /api/search-console/auth/revoke` - Revoke OAuth tokens

**Metrics:**
- `GET /api/search-console/metrics` - Get metrics summary (default: 30 days)
- `GET /api/search-console/metrics/history` - Get historical metrics with filters
- `POST /api/search-console/metrics/sync` - Manually trigger sync from GSC

**Keywords & Pages:**
- `GET /api/search-console/keywords` - Get top keywords (default: top 20)
- `GET /api/search-console/pages` - Get top pages (default: top 20)

**Alerts:**
- `GET /api/search-console/alerts` - Get all alerts (with pagination)
- `GET /api/search-console/alerts/unresolved` - Get unresolved alerts only
- `PUT /api/search-console/alerts/:id/resolve` - Mark alert as resolved

---

### Phase 3: Frontend (COMPLETE)

#### Custom Hooks (`admin/src/hooks/useSearchConsole.ts`)
- **useSearchConsoleAuth** - Authentication status and actions
- **useSearchConsoleMetrics** - Metrics data and summary
- **useSearchConsoleKeywords** - Top keywords
- **useSearchConsolePages** - Top pages
- **useSearchConsoleAlerts** - Alerts management

#### API Service (`admin/src/lib/api.ts`)
- Added `searchConsole` object with all API methods
- Full TypeScript support with types

#### SEO Dashboard (`admin/src/app/admin/seo/page.tsx`)
**Features:**
- OAuth authorization flow with Google
- 4 summary cards (Impressions, Clicks, CTR, Position)
- 3 tabs:
  1. **Keywords** - Top 10 keywords with metrics
  2. **Pages** - Top 10 pages with external links
  3. **Alerts** - Active alerts with resolve action
- Manual sync button
- Disconnect button
- Loading states
- Error handling
- Toast notifications

**URL**: https://atmaadmin.roilabs.com.br/admin/seo

---

## 🔧 Setup Instructions

### 1. Configure Google Cloud Project

Follow the guide: `Backend/GOOGLE_OAUTH_SETUP.md`

**Quick steps:**
1. Create project in Google Cloud Console
2. Enable Google Search Console API
3. Create OAuth 2.0 credentials
4. Add redirect URIs:
   - Dev: `http://localhost:3001/api/search-console/auth/callback`
   - Prod: `https://atmaapi.roilabs.com.br/api/search-console/auth/callback`

### 2. Update .env Variables

**Development (`Backend/.env`):**
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/search-console/auth/callback
ADMIN_URL=http://localhost:3000/admin
SEARCH_CONSOLE_SITE_URL=https://atma.roilabs.com.br
```

**Production:**
Update Railway/Vercel environment variables with production values.

### 3. Verify Search Console Property

Ensure `https://atma.roilabs.com.br` is verified in Google Search Console:
- URL: https://search.google.com/search-console
- The account used for OAuth must have **Owner** or **Full User** permissions

### 4. Test Authentication

```bash
# 1. Start Backend
cd Backend
npm start

# 2. Get authorization URL
curl http://localhost:3001/api/search-console/auth/url

# 3. Open authUrl in browser and authorize

# 4. Check auth status
curl http://localhost:3001/api/search-console/auth/status
```

### 5. Initial Data Sync

After authentication, sync the last 7 days of data:

```bash
curl -X POST http://localhost:3001/api/search-console/metrics/sync \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-10-31",
    "endDate": "2025-11-06"
  }'
```

---

## 📊 Features

### Automated Metrics Sync
- Daily sync via cron job (optional - Phase 4)
- Manual sync via dashboard button
- Stores: impressions, clicks, CTR, position
- Top 20 keywords per day (JSON)
- Top 20 pages per day (JSON)

### Alert System
Automatic alerts for significant changes (>20%):
- **Critical** (>50% drop): Red alert
- **Warning** (20-50% drop): Yellow alert

**Alert Types:**
- `impressions_drop` - Significant drop in impressions
- `clicks_drop` - Significant drop in clicks
- `position_drop` - Significant drop in position

### Dashboard Metrics
- **Summary Cards**: Total impressions, clicks, avg CTR, avg position
- **Top Keywords**: Performance metrics per keyword
- **Top Pages**: Performance metrics per page with external links
- **Active Alerts**: Unresolved alerts with one-click resolution

---

## 🔒 Security

- OAuth 2.0 with refresh token support
- Tokens stored encrypted in database
- Automatic token refresh when expired
- Scope: `https://www.googleapis.com/auth/webmasters.readonly` (read-only)
- `.env` file in `.gitignore`
- Easy revocation via dashboard

---

## 📈 Data Flow

```
Google Search Console API
          ↓
GoogleSearchConsoleService.fetchMetrics()
          ↓
Database (seo_metrics_history)
          ↓
Backend API Endpoints
          ↓
Frontend Hooks (useSearchConsole*)
          ↓
SEO Dashboard Components
```

---

## 🚀 Next Steps (Optional - Phase 4-6)

### Phase 4: Automated Sync (Optional)
- [ ] Create cron job for daily sync
- [ ] Schedule: Every day at 2:00 AM (after GSC data updates)
- [ ] Auto-sync yesterday's data
- [ ] Email notifications for critical alerts

### Phase 5: Advanced Features (Optional)
- [ ] Historical charts (Line charts with Recharts)
- [ ] Compare date ranges (Week vs week, month vs month)
- [ ] Export data to CSV/Excel
- [ ] Keyword ranking tracker
- [ ] Competitor analysis

### Phase 6: Optimization (Optional)
- [ ] Cache frequently accessed metrics
- [ ] Paginate keywords/pages tables
- [ ] Filter keywords by impressions/clicks
- [ ] Search within keywords/pages
- [ ] Custom date range selector

---

## 📝 API Usage Examples

### Get Metrics Summary
```bash
curl http://localhost:3001/api/search-console/metrics?days=30
```

### Get Top Keywords
```bash
curl http://localhost:3001/api/search-console/keywords?limit=20
```

### Sync Specific Date
```bash
curl -X POST http://localhost:3001/api/search-console/metrics/sync \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-11-06"}'
```

### Get Unresolved Alerts
```bash
curl http://localhost:3001/api/search-console/alerts/unresolved
```

### Resolve Alert
```bash
curl -X PUT http://localhost:3001/api/search-console/alerts/1/resolve \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 📦 Dependencies Installed

```json
{
  "googleapis": "^129.0.0",
  "@google-cloud/local-auth": "^3.0.1"
}
```

---

## 🎯 Expected Results (After Full Setup)

### Immediate (Day 1):
- OAuth authorization complete
- Access to last 16 months of GSC data
- Dashboard shows metrics summary
- Top keywords and pages visible

### Short-term (Week 1):
- Daily metrics automatically tracked
- Historical data accumulating
- Alerts trigger on significant changes
- Team can monitor SEO health

### Long-term (Month 1+):
- 30+ days of historical trend data
- Pattern recognition in alerts
- Data-driven SEO decisions
- Performance tracking over time

---

## 🐛 Troubleshooting

### "Not authenticated" error
**Solution**: Click "Conectar ao Google Search Console" and authorize

### "redirect_uri_mismatch" error
**Solution**: Ensure redirect URI in Google Cloud Console matches `.env` exactly

### "invalid_client" error
**Solution**: Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

### No data showing in dashboard
**Solution**:
1. Check auth status: `GET /api/search-console/auth/status`
2. Manually sync data: Click "Sincronizar" button
3. Verify Search Console property is correct domain

### Alerts not triggering
**Solution**: Needs at least 2 days of data to compare changes

---

## 📚 Documentation References

- **Google Cloud Console**: https://console.cloud.google.com/
- **Search Console API**: https://developers.google.com/webmaster-tools/v1/api_reference_index
- **OAuth 2.0**: https://developers.google.com/identity/protocols/oauth2
- **Search Console**: https://search.google.com/search-console

---

## ✅ Status

**Implementation**: 100% Complete (Phases 1-3)

**Files Created**: 7
- 1 migration SQL
- 1 migration runner script
- 1 service layer
- 1 controller
- 1 routes file
- 1 frontend hooks file
- 1 dashboard page

**Files Modified**: 3
- server.js (routes registration)
- .env (OAuth credentials)
- api.ts (Search Console methods)

**Total Lines of Code**: ~2,500 lines

**Ready for Production**: ✅ Yes (after OAuth setup)
