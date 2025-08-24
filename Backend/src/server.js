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

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const orthodontistRoutes = require('./routes/orthodontistRoutes');
const emailRoutes = require('./routes/emailRoutes');
const systemRoutes = require('./routes/systemRoutes');

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

// Log das origins permitidas
logger.info('🔗 CORS Origins permitidas:', { 
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  parsed: process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : 
    ['http://localhost:3000', 'https://atmaadmin.roilabs.com.br', 'https://roilabs.com.br']
});

// CORS configuration - ANTES de outros middlewares
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : 
  ['http://localhost:3000', 'https://atmaadmin.roilabs.com.br', 'https://roilabs.com.br'];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sem origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    // Verificar origins exatas primeiro
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Verificar patterns com wildcard (especificamente *.vercel.app)
    const isVercelApp = origin && origin.endsWith('.vercel.app') && 
                       allowedOrigins.some(allowed => allowed === 'https://*.vercel.app');
    
    if (isVercelApp) {
      logger.info(`CORS permitido para Vercel app: ${origin}`);
      return callback(null, true);
    }
    
    logger.warn(`CORS blocked origin: ${origin}`, { allowedOrigins, isVercelApp });
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Debug middleware para CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  logger.info(`📡 Request recebido:`, {
    method: req.method,
    url: req.url,
    origin: origin,
    userAgent: req.headers['user-agent']
  });
  next();
});

// Security middleware - APÓS CORS
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));
app.use(compression());

// Rate limiting
app.use(generalLimiter);

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const { performHealthCheck } = require('./utils/databaseHealth');
    const dbHealth = await performHealthCheck();
    const overallStatus = dbHealth.status === 'ERROR' ? 'ERROR' : 'OK';
    
    res.status(overallStatus === 'ERROR' ? 503 : 200).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth,
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Erro no health check:', error);
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Atma Aligner Backend API',
    version: '1.0.0',
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

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  logger.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;