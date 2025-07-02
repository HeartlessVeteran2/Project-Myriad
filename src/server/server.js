const fastify = require('fastify')({ 
  logger: process.env.NODE_ENV !== 'test'
});
const registerRoutes = require('./routes');
const cors = require('@fastify/cors');
const multipart = require('@fastify/multipart');
const { errorHandler } = require('../lib/errors');
const { logger } = require('../lib/logger');

// Register error handler
fastify.setErrorHandler(errorHandler);

// Register request logging middleware
fastify.addHook('onRequest', logger.requestMiddleware());

// Register plugins
fastify.register(cors, { 
  origin: process.env.NODE_ENV === 'development' || true,
  credentials: true
});

fastify.register(multipart, {
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 1
  }
});

// Register API routes
fastify.register(registerRoutes);

fastify.get('/', async () => {
  logger.info('Health check accessed');
  return { 
    message: 'Project Myriad Backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
});

// Health check endpoint
fastify.get('/health', async () => {
  logger.debug('Health check endpoint accessed');
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  try {
    await fastify.close();
    logger.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    logger.info(`Server started on ${host}:${port}`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Only start if this file is run directly (not imported)
if (require.main === module) {
  start();
}

module.exports = { fastify, start };
