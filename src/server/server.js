const fastify = require('fastify')({ logger: true });
const registerRoutes = require('./routes');
const cors = require('@fastify/cors');
const multipart = require('@fastify/multipart');

// Register plugins
fastify.register(cors, { origin: true });
fastify.register(multipart);

// Register API routes
fastify.register(registerRoutes);

fastify.get('/', async () => {
  return { hello: 'Project Myriad Backend' };
});

// Health check endpoint
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  };
});

const start = async () => {
  try {
    // Note: It's good practice to use environment variables for port
    await fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
