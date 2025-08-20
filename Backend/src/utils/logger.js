const winston = require('winston');
const path = require('path');

// Define o formato dos logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define o formato para console
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// Cria o logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'atma-aligner-backend' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat
    }),
    
    // File transport para logs gerais
    new winston.transports.File({
      filename: path.join('logs', 'app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport para erros
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'exceptions.log')
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'rejections.log')
    })
  ]
});

// Função auxiliar para log de requisições HTTP
const logHTTPRequest = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    timestamp: new Date().toISOString()
  };
  
  if (res.statusCode >= 400) {
    logger.warn('HTTP Request Error', logData);
  } else {
    logger.info('HTTP Request', logData);
  }
};

// Função auxiliar para log de operações de banco de dados
const logDBOperation = (operation, table, result, executionTime) => {
  logger.info('Database Operation', {
    operation,
    table,
    affectedRows: result.affectedRows || result.length || 0,
    executionTime: `${executionTime}ms`,
    timestamp: new Date().toISOString()
  });
};

// Função auxiliar para log de emails
const logEmailSent = (to, subject, template, status) => {
  logger.info('Email Sent', {
    to,
    subject,
    template,
    status,
    timestamp: new Date().toISOString()
  });
};

// Função auxiliar para log de erros de validação
const logValidationError = (errors, endpoint) => {
  logger.warn('Validation Error', {
    endpoint,
    errors,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  logHTTPRequest,
  logDBOperation,
  logEmailSent,
  logValidationError
};