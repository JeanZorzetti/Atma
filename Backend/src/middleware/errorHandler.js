const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  logger.error('Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Erro de validação do express-validator
  if (err.name === 'ValidationError') {
    const message = 'Dados de entrada inválidos';
    error = { message, statusCode: 400 };
  }

  // Erro de banco de dados MySQL
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        error = { message: 'Registro duplicado', statusCode: 409 };
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        error = { message: 'Referência inválida', statusCode: 400 };
        break;
      case 'ER_BAD_FIELD_ERROR':
        error = { message: 'Campo inválido', statusCode: 400 };
        break;
      case 'ER_PARSE_ERROR':
        error = { message: 'Erro de sintaxe na consulta', statusCode: 500 };
        break;
      case 'ECONNREFUSED':
        error = { message: 'Falha na conexão com banco de dados', statusCode: 503 };
        break;
      default:
        error = { message: 'Erro interno do servidor', statusCode: 500 };
    }
  }

  // Erro de JSON malformado
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = { message: 'JSON malformado', statusCode: 400 };
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Token inválido', statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expirado', statusCode: 401 };
  }

  // Rate limit error
  if (err.status === 429) {
    error = { message: 'Muitas tentativas. Tente novamente mais tarde.', statusCode: 429 };
  }

  // Set default
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;