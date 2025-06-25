const fastify = require('fastify')({ logger: true });
const registerRoutes = require('./routes');
const cors = require('@fastify/cors');
const multipart = require('@fastify/multipart');

// Register plugins
fastify.register(cors, { origin: true });
fastify.register(cors, { 
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : true,
  credentials: true 
});
fastify.register(multipart);

// Register API routes
fastify.register(registerRoutes);

fastify.get('/', async (request, reply) => {
  return { hello: 'Project Myriad Backend' };
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
