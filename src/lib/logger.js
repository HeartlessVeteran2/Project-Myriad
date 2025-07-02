// Comprehensive logging system for Project Myriad

const fs = require('fs');
const path = require('path');

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_LEVEL_NAMES = ['ERROR', 'WARN', 'INFO', 'DEBUG'];

class Logger {
  constructor(options = {}) {
    this.level = LOG_LEVELS[options.level || process.env.LOG_LEVEL || 'INFO'];
    this.enableConsole = options.enableConsole !== false;
    this.enableFile = options.enableFile !== false;
    this.logDir = options.logDir || path.join(process.cwd(), 'logs');
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB
    this.maxFiles = options.maxFiles || 5;
    
    // Create logs directory if it doesn't exist
    if (this.enableFile && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const levelName = LOG_LEVEL_NAMES[level];
    
    const logEntry = {
      timestamp,
      level: levelName,
      message,
      ...meta
    };

    return JSON.stringify(logEntry);
  }

  shouldLog(level) {
    return level <= this.level;
  }

  writeToFile(logEntry) {
    if (!this.enableFile) return;

    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `app-${today}.log`);
    
    try {
      // Check file size and rotate if necessary
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        if (stats.size > this.maxFileSize) {
          this.rotateLogFile(logFile);
        }
      }
      
      fs.appendFileSync(logFile, logEntry + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  rotateLogFile(logFile) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rotatedFile = logFile.replace('.log', `-${timestamp}.log`);
    
    try {
      fs.renameSync(logFile, rotatedFile);
      this.cleanupOldLogs();
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  cleanupOldLogs() {
    try {
      const files = fs.readdirSync(this.logDir)
        .filter(file => file.startsWith('app-') && file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.logDir, file),
          mtime: fs.statSync(path.join(this.logDir, file)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);

      // Keep only the most recent files
      if (files.length > this.maxFiles) {
        files.slice(this.maxFiles).forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
    } catch (error) {
      console.error('Failed to cleanup old logs:', error);
    }
  }

  log(level, message, meta = {}) {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(level, message, meta);
    
    if (this.enableConsole) {
      const levelName = LOG_LEVEL_NAMES[level];
      const timestamp = new Date().toISOString();
      
      // Use appropriate console method based on level
      switch (level) {
        case LOG_LEVELS.ERROR:
          console.error(`[${timestamp}] ${levelName}: ${message}`, meta);
          break;
        case LOG_LEVELS.WARN:
          console.warn(`[${timestamp}] ${levelName}: ${message}`, meta);
          break;
        case LOG_LEVELS.INFO:
          console.info(`[${timestamp}] ${levelName}: ${message}`, meta);
          break;
        case LOG_LEVELS.DEBUG:
          console.debug(`[${timestamp}] ${levelName}: ${message}`, meta);
          break;
      }
    }
    
    this.writeToFile(logEntry);
  }

  error(message, meta = {}) {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }

  warn(message, meta = {}) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  info(message, meta = {}) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  debug(message, meta = {}) {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }

  // Request logging middleware for Fastify
  requestMiddleware() {
    return (request, reply, done) => {
      const startTime = Date.now();
      
      // Log incoming request
      this.info('Incoming request', {
        method: request.method,
        url: request.url,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        requestId: request.id
      });

      // Log response when done
      reply.addHook('onSend', (request, reply, payload, done) => {
        const duration = Date.now() - startTime;
        
        this.info('Request completed', {
          method: request.method,
          url: request.url,
          statusCode: reply.statusCode,
          duration: `${duration}ms`,
          requestId: request.id
        });
        
        done();
      });

      done();
    };
  }

  // Database operation logging
  logDatabaseOperation(operation, table, meta = {}) {
    this.debug(`Database ${operation}`, {
      table,
      ...meta
    });
  }

  // Authentication logging
  logAuthEvent(event, userId, meta = {}) {
    this.info(`Auth event: ${event}`, {
      userId,
      ...meta
    });
  }

  // File operation logging
  logFileOperation(operation, filePath, meta = {}) {
    this.info(`File ${operation}`, {
      filePath,
      ...meta
    });
  }

  // Error logging with stack trace
  logError(error, context = {}) {
    this.error(error.message, {
      stack: error.stack,
      name: error.name,
      code: error.code,
      ...context
    });
  }

  // Performance logging
  logPerformance(operation, duration, meta = {}) {
    const level = duration > 1000 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
    this.log(level, `Performance: ${operation} took ${duration}ms`, meta);
  }
}

// Create default logger instance
const logger = new Logger({
  level: process.env.LOG_LEVEL || 'INFO',
  enableConsole: process.env.NODE_ENV !== 'test',
  enableFile: process.env.NODE_ENV === 'production'
});

// Performance monitoring decorator
function withPerformanceLogging(fn, operationName) {
  return async function(...args) {
    const startTime = Date.now();
    try {
      const result = await fn.apply(this, args);
      const duration = Date.now() - startTime;
      logger.logPerformance(operationName, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logPerformance(`${operationName} (failed)`, duration);
      throw error;
    }
  };
}

// Audit logging for sensitive operations
function auditLog(operation, userId, details = {}) {
  logger.info(`AUDIT: ${operation}`, {
    userId,
    timestamp: new Date().toISOString(),
    ...details,
    audit: true
  });
}

module.exports = {
  Logger,
  logger,
  LOG_LEVELS,
  withPerformanceLogging,
  auditLog
};
