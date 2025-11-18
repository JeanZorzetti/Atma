const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const { logger } = require('./utils/logger');
const { connectDB } = require('./config/database');
const { performHealthCheck } = require('./utils/databaseHealth');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const serviceMonitor = require('./utils/serviceMonitor');

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const orthodontistRoutes = require('./routes/orthodontistRoutes');
const emailRoutes = require('./routes/emailRoutes');
const systemRoutes = require('./routes/systemRoutes');
const crmRoutes = require('./routes/crm');
const marketingRoutes = require('./routes/marketingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const diagnosticRoutes = require('./routes/diagnosticRoutes');
const searchConsoleRoutes = require('./routes/searchConsoleRoutes');
const conversionFunnelRoutes = require('./routes/conversionFunnelRoutes');
const marketBenchmarksRoutes = require('./routes/marketBenchmarks');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database and perform health check
const initializeDatabase = async () => {
  try {
    await connectDB();
    const healthCheck = await performHealthCheck();
    logger.info('🏥 Status do banco de dados:', healthCheck);
    
    if (healthCheck.status === 'ERROR') {
      logger.warn('⚠️ Sistema iniciando com problemas no banco de dados');
    }
  } catch (error) {
    logger.error('❌ Erro durante inicialização do banco:', error.message);
  }
};

initializeDatabase();

// CORS configuration - ANTES de outros middlewares
const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://atma.roilabs.com.br',
  'https://www.atma.roilabs.com.br',
  'https://atmaadmin.roilabs.com.br',
  'https://atmaapi.roilabs.com.br',
  'https://roilabs.com.br',
  'https://www.roilabs.com.br'
];
const allowedOrigins = process.env.ALLOWED_ORIGINS ?
  [...defaultOrigins, ...process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())] :
  defaultOrigins;

// Log das origins permitidas - DETALHADO (APÓS declarar as variáveis)
logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
logger.info('🔗 CORS CONFIGURATION AT STARTUP');
logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
logger.info('📋 ENV ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || 'NOT SET');
logger.info('📋 Default Origins:', defaultOrigins);
logger.info('📋 Final Merged allowedOrigins:', allowedOrigins);
logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const corsOptions = {
  origin: function (origin, callback) {
    logger.info('🔐 CORS middleware origin check:', origin || 'NO ORIGIN');

    // Permitir requests sem origin (mobile apps, postman, etc.)
    if (!origin) {
      logger.info('✅ CORS: No origin header - allowing (Postman/mobile)');
      return callback(null, true);
    }

    // Verificar origins exatas primeiro
    const isExactMatch = allowedOrigins.indexOf(origin) !== -1;
    if (isExactMatch) {
      logger.info(`✅ CORS: Exact match found for ${origin}`);
      return callback(null, true);
    }

    // Verificar patterns com wildcard (especificamente *.vercel.app)
    const hasVercelWildcard = allowedOrigins.some(allowed =>
      allowed === 'https://*.vercel.app' || allowed === 'http://*.vercel.app'
    );
    const isVercelApp = origin && (
      origin.endsWith('.vercel.app') ||
      origin.includes('.vercel.app/')
    ) && hasVercelWildcard;

    if (isVercelApp) {
      logger.info(`✅ CORS: Vercel app allowed: ${origin}`);
      return callback(null, true);
    }

    logger.error('❌ CORS BLOCKED:', {
      origin,
      allowedOrigins,
      isExactMatch,
      hasVercelWildcard,
      isVercelApp
    });
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Request tracking middleware
app.use((req, res, next) => {
  serviceMonitor.recordRequest();
  
  // Track response to record errors
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400) {
      serviceMonitor.recordError();
    }
    originalSend.call(this, data);
  };
  
  next();
});

// Debug middleware para CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  logger.info(`📡 Request recebido:`, {
    method: req.method,
    url: req.url,
    origin: origin,
    userAgent: req.headers['user-agent']
  });
  
  // Add explicit CORS headers and Vary header to fix cache issues
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,X-Requested-With,Accept');
    res.header('Vary', 'Origin'); // Critical for caching with CORS
    logger.info(`✅ CORS headers adicionados para origin: ${origin}`);
  } else if (origin && origin.endsWith('.vercel.app') && allowedOrigins.includes('https://*.vercel.app')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,X-Requested-With,Accept');
    res.header('Vary', 'Origin'); // Critical for caching with CORS
    logger.info(`✅ CORS headers adicionados para Vercel app: ${origin}`);
  } else if (origin) {
    logger.warn(`❌ CORS rejeitado para origin: ${origin}`, { allowedOrigins });
  }
  
  // Always add Vary: Origin for proper CORS caching
  if (!res.getHeader('Vary')) {
    res.header('Vary', 'Origin');
  }
  
  next();
});

// Handle preflight requests explicitly - ANTES de tudo
app.options('*', (req, res) => {
  const origin = req.headers.origin;

  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('🔍 OPTIONS PREFLIGHT REQUEST RECEIVED');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('📍 URL:', req.url);
  logger.info('🌐 Origin:', origin || 'NO ORIGIN HEADER');
  logger.info('📋 All Headers:', JSON.stringify(req.headers, null, 2));
  logger.info('🔐 Allowed Origins:', allowedOrigins);

  const isInList = origin && allowedOrigins.includes(origin);
  const isVercelApp = origin && origin.endsWith('.vercel.app') && allowedOrigins.includes('https://*.vercel.app');

  logger.info('✓ Origin in allowedOrigins?', isInList);
  logger.info('✓ Is Vercel app?', isVercelApp);
  logger.info('✓ Will allow?', isInList || isVercelApp);

  if (origin && (isInList || isVercelApp)) {
    const headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,Origin,X-Requested-With,Accept',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    Object.entries(headers).forEach(([key, value]) => {
      res.header(key, value);
    });

    logger.info('✅ RESPONSE: 200 OK with headers:', headers);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return res.status(200).end();
  } else {
    res.header('Vary', 'Origin');
    logger.warn('❌ RESPONSE: 403 FORBIDDEN');
    logger.warn('Reason: Origin not in allowedOrigins list');
    logger.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return res.status(403).end();
  }
});

// Security middleware - APÓS CORS
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));
app.use(compression());

// Rate limiting - APÓS OPTIONS handler
app.use(generalLimiter);

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint with service monitoring
app.get('/health', async (req, res) => {
  try {
    const { performHealthCheck } = require('./utils/databaseHealth');
    const dbHealth = await performHealthCheck();
    const serviceHealth = serviceMonitor.getHealthStatus();
    
    const overallStatus = dbHealth.status === 'ERROR' || !serviceHealth.isHealthy ? 'ERROR' : 'OK';
    
    res.status(overallStatus === 'ERROR' ? 503 : 200).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth,
      service: {
        uptime: Math.floor(serviceHealth.uptime / 1000), // in seconds
        requestCount: serviceHealth.requestCount,
        errorCount: serviceHealth.errorCount,
        errorRate: serviceHealth.errorRate + '%',
        consecutiveFailures: serviceHealth.consecutiveFailures,
        memory: serviceHealth.memory,
        lastHealthCheck: serviceHealth.lastHealthCheck ? new Date(serviceHealth.lastHealthCheck).toISOString() : null
      },
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Erro no health check:', error);
    serviceMonitor.recordError();
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Falha no health check',
      message: error.message
    });
  }
});

// API routes
app.use('/api/patients', patientRoutes);
app.use('/api/orthodontists', orthodontistRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/diagnostic', diagnosticRoutes);
app.use('/api/search-console', searchConsoleRoutes);
app.use('/api/conversion-funnel', conversionFunnelRoutes);
app.use('/api/market-benchmarks', marketBenchmarksRoutes);

// Root endpoint
app.get('/', (req, res) => {
  const packageJson = require('../package.json');
  res.json({
    message: 'Atma Aligner Backend API',
    version: packageJson.version,
    lastUpdate: '2025-09-15 16:52 - Google Analytics Fix',
    documentation: '/api/docs',
    health: '/health'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    message: `A rota ${req.method} ${req.originalUrl} não existe`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (deve ser o último)
app.use(errorHandler);

// Global error handlers to prevent crashes
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception - Server will restart:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  // Give the logger time to flush
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : null,
    promise: promise.toString(),
    timestamp: new Date().toISOString()
  });
  
  // Don't exit for unhandled promise rejections, just log them
  // The application can continue running
});

// Handle warnings
process.on('warning', (warning) => {
  logger.warn('Process Warning:', {
    name: warning.name,
    message: warning.message,
    stack: warning.stack,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown with cleanup
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  
  try {
    // Stop service monitoring
    serviceMonitor.stop();
    
    // Close database connections
    const { closeDB } = require('./config/database');
    await closeDB();
    
    // Give time for ongoing requests to complete
    setTimeout(() => {
      logger.info('Shutdown complete');
      process.exit(0);
    }, 5000);
  } catch (error) {
    logger.error('Error during shutdown:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  logger.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
