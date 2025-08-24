const { logger } = require('../utils/logger');

/**
 * Middleware to handle database errors gracefully and provide fallback responses
 * This prevents 500 errors from reaching the client when the database is unavailable
 */
const handleDbError = (controllerName, fallbackData = null) => {
  return (error, req, res, next) => {
    const isDbError = error.code === 'DB_CONNECTION_ERROR' ||
                     error.message.includes('Database não disponível') ||
                     error.message.includes('Pool is closed') ||
                     error.code === 'ECONNREFUSED' ||
                     error.code === 'ENOTFOUND' ||
                     error.code === 'ETIMEDOUT' ||
                     error.code === 'ER_ACCESS_DENIED_ERROR';

    if (isDbError) {
      logger.warn(`Database error in ${controllerName} - providing fallback response`, {
        controller: controllerName,
        error: error.message,
        code: error.code,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      });

      // Provide appropriate fallback based on the endpoint
      const endpoint = req.route?.path || req.originalUrl;
      
      // For listing endpoints, return empty arrays
      if (endpoint.includes('/leads') || endpoint.includes('/stats') || endpoint.includes('/search')) {
        return res.status(200).json({
          success: true,
          data: fallbackData || {
            leads: [],
            total: 0,
            pagination: {
              currentPage: 1,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
              itemsPerPage: parseInt(req.query.limit) || 10
            }
          },
          warning: 'Serviço temporariamente com conectividade limitada - dados podem estar desatualizados',
          timestamp: new Date().toISOString()
        });
      }
      
      // For stats endpoints, return zero stats
      if (endpoint.includes('/stats') || endpoint.includes('/system')) {
        return res.status(200).json({
          success: true,
          data: fallbackData || {
            totalPatients: 0,
            totalOrthodontists: 0,
            todayAppointments: 0,
            patientsGrowth: '0%',
            orthodontistsGrowth: '0 ativos',
            appointmentsConfirmed: '0 confirmadas',
            recentActivities: []
          },
          warning: 'Estatísticas temporariamente indisponíveis devido a problemas de conectividade',
          timestamp: new Date().toISOString()
        });
      }
      
      // For individual record endpoints, return not found
      if (req.method === 'GET' && endpoint.includes('/:id')) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Registro temporariamente indisponível',
            suggestion: 'Tente novamente em alguns minutos'
          },
          timestamp: new Date().toISOString()
        });
      }
      
      // For create/update operations, return service unavailable
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        return res.status(503).json({
          success: false,
          error: {
            message: 'Serviço temporariamente indisponível',
            suggestion: 'Por favor, tente novamente em alguns minutos. Seus dados não foram processados.',
            code: 'SERVICE_TEMPORARILY_UNAVAILABLE'
          },
          timestamp: new Date().toISOString()
        });
      }
      
      // Default fallback
      return res.status(503).json({
        success: false,
        error: {
          message: 'Serviço temporariamente indisponível - problemas de conectividade',
          suggestion: 'Tente novamente em alguns minutos'
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // If not a database error, pass to next error handler
    next(error);
  };
};

/**
 * Wraps async controller functions to catch and handle database errors
 */
const withDbErrorHandling = (controllerName, fallbackData = null) => {
  return (asyncFn) => {
    return async (req, res, next) => {
      try {
        await asyncFn(req, res, next);
      } catch (error) {
        handleDbError(controllerName, fallbackData)(error, req, res, next);
      }
    };
  };
};

module.exports = {
  handleDbError,
  withDbErrorHandling
};