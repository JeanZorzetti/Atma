const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');

// Rate limiter geral - usando o mesmo arquivo atualizado
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas tentativas realizadas. Tente novamente mais tarde.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  handler: (req, res, next, options) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    
    res.status(options.statusCode).json(options.message);
  }
});

// Rate limiter mais restritivo para formulários de contato
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 3 submissões de formulário por IP
  message: {
    error: 'Muitas submissões de formulário. Aguarde 15 minutos antes de tentar novamente.',
    retryAfter: 900 // 15 minutos em segundos
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn('Contact form rate limit exceeded', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      formData: req.body,
      timestamp: new Date().toISOString()
    });
    
    res.status(options.statusCode).json(options.message);
  }
});

// Rate limiter para login/autenticação (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  skipSuccessfulRequests: true, // não conta requests bem-sucedidos
  message: {
    error: 'Muitas tentativas de login. Aguarde 15 minutos.',
    retryAfter: 900
  },
  handler: (req, res, next, options) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      url: req.originalUrl,
      attemptedEmail: req.body.email,
      timestamp: new Date().toISOString()
    });

    res.status(options.statusCode).json(options.message);
  }
});

// Rate limiter para admin/BI endpoints (mais generoso para uso interno)
const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 60, // máximo 60 requests por minuto por IP
  message: {
    error: 'Rate limited. Server is busy. Please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn('Admin rate limit exceeded', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    res.status(options.statusCode).json(options.message);
  }
});

module.exports = {
  generalLimiter,
  contactLimiter,
  authLimiter,
  adminLimiter
};