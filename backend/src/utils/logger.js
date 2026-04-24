const winston = require('winston');
const path = require('path');
const fs = require('fs');

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

// Criar pasta de logs se não existir e tiver permissão
const logsDir = path.join(process.cwd(), 'logs');
let useFileLogging = true;

try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.warn('Warning: Cannot create logs directory, file logging disabled:', error.message);
  useFileLogging = false;
}

// Transports básicos (sempre inclui console)
const transports = [
  new winston.transports.Console({
    format: consoleFormat
  })
];

// Adicionar file transports apenas se tiver permissão
if (useFileLogging) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Configurar exception handlers
const exceptionHandlers = [
  new winston.transports.Console({
    format: consoleFormat
  })
];

const rejectionHandlers = [
  new winston.transports.Console({
    format: consoleFormat
  })
];

if (useFileLogging) {
  exceptionHandlers.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  );
  
  rejectionHandlers.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  );
}

// Cria o logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'atma-aligner-backend' },
  transports,
  exceptionHandlers,
  rejectionHandlers
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