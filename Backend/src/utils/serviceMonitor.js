const { logger } = require('./logger');
const { connectDB, getDB } = require('../config/database');

class ServiceMonitor {
  constructor() {
    this.isHealthy = false;
    this.lastHealthCheck = null;
    this.consecutiveFailures = 0;
    this.maxConsecutiveFailures = 3;
    this.healthCheckInterval = null;
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    
    this.startMonitoring();
  }

  startMonitoring() {
    logger.info('Iniciando monitoramento de saúde do serviço');
    
    // Health check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000);

    // Initial health check
    setTimeout(async () => {
      await this.performHealthCheck();
    }, 5000);
  }

  async performHealthCheck() {
    const checkStart = Date.now();
    const healthData = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount * 100).toFixed(2) : 0,
      memory: this.getMemoryUsage(),
      database: { status: 'unknown' },
      consecutiveFailures: this.consecutiveFailures
    };

    try {
      // Check database connectivity
      const db = getDB();
      if (db) {
        const connection = await db.getConnection();
        await connection.ping();
        connection.release();
        healthData.database = { 
          status: 'connected',
          responseTime: Date.now() - checkStart
        };
      } else {
        healthData.database = { 
          status: 'disconnected',
          message: 'No database pool available'
        };
        throw new Error('Database not available');
      }

      // Health check passed
      if (this.consecutiveFailures > 0) {
        logger.info('Service recovered after failures', {
          previousFailures: this.consecutiveFailures,
          downtime: Date.now() - (this.lastHealthCheck || checkStart)
        });
      }

      this.consecutiveFailures = 0;
      this.isHealthy = true;
      this.lastHealthCheck = Date.now();

      // Log health status periodically (every 5 minutes)
      if (Math.floor(Date.now() / 300000) !== Math.floor((this.lastHealthCheck - 30000) / 300000)) {
        logger.info('Service health check passed', {
          uptime: Math.floor(healthData.uptime / 1000) + 's',
          requestCount: healthData.requestCount,
          errorRate: healthData.errorRate + '%',
          memoryUsage: healthData.memory.heapUsed + 'MB'
        });
      }

    } catch (error) {
      this.consecutiveFailures++;
      this.isHealthy = false;

      healthData.error = {
        message: error.message,
        code: error.code,
        consecutiveFailures: this.consecutiveFailures
      };

      logger.error('Service health check failed', healthData);

      // If we have too many consecutive failures, try recovery actions
      if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
        logger.warn(`Service unhealthy for ${this.consecutiveFailures} consecutive checks - attempting recovery`);
        await this.attemptRecovery();
      }
    }

    return healthData;
  }

  async attemptRecovery() {
    logger.info('Attempting service recovery...');

    try {
      // Try to reconnect to database
      await connectDB(true);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        logger.info('Forced garbage collection during recovery');
      }

      logger.info('Service recovery attempt completed');
      
    } catch (error) {
      logger.error('Service recovery failed:', {
        error: error.message,
        code: error.code,
        consecutiveFailures: this.consecutiveFailures
      });

      // If recovery keeps failing, we might need to restart
      if (this.consecutiveFailures > this.maxConsecutiveFailures * 2) {
        logger.fatal('Service recovery failed multiple times - manual intervention may be required');
        
        // In production, this could trigger a restart mechanism
        // For now, we'll just log and continue trying
      }
    }
  }

  getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      external: Math.round(usage.external / 1024 / 1024)
    };
  }

  recordRequest() {
    this.requestCount++;
  }

  recordError() {
    this.errorCount++;
  }

  getHealthStatus() {
    return {
      isHealthy: this.isHealthy,
      consecutiveFailures: this.consecutiveFailures,
      uptime: Date.now() - this.startTime,
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount * 100).toFixed(2) : 0,
      memory: this.getMemoryUsage(),
      lastHealthCheck: this.lastHealthCheck
    };
  }

  stop() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    logger.info('Service monitoring stopped');
  }
}

// Singleton instance
const serviceMonitor = new ServiceMonitor();

module.exports = serviceMonitor;