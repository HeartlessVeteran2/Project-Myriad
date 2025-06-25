const authRoutes = require('./auth');
const seriesRoutes = require('./series');

async function registerRoutes(fastify, options) {
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(seriesRoutes, { prefix: '/api/series' });
}

module.exports = registerRoutes;
