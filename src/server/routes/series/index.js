const { parseCbz } = require('../../services/parser');
const db = require('../../db');
const verifyToken = require('../auth/verify');

async function seriesRoutes(fastify, options) {
    // GET /api/series - Get all series for the logged-in user
    fastify.get('/', { preHandler: verifyToken }, async (request, reply) => {
        const userId = request.user.id;
        const result = await db.query('SELECT * FROM series WHERE user_id = $1', [userId]);
        return { series: result.rows };
    });

    // POST /api/series/upload - Handle file uploads
    fastify.post('/upload', { preHandler: verifyToken }, async (request, reply) => {
        // TODO: Configure and use @fastify/multipart
        // TODO: Save the file, then call the parser service
        // const data = await request.file();
        // await parseCbz(data.filepath);
        return { message: 'File upload endpoint placeholder' };
    });
}
module.exports = seriesRoutes;
