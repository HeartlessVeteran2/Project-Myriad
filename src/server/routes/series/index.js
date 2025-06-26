const { parseCbz } = require('../../services/parser');
const db = require('../../db');
const verifyToken = require('../auth/verify');
const path = require('path');
const fs = require('fs');

async function seriesRoutes(fastify) {
    // GET /api/series - Get all series for the logged-in user
    fastify.get('/', { preHandler: verifyToken }, async (request, reply) => {
        const userId = request.user.id;
        try {
            const result = await db.query('SELECT * FROM series WHERE user_id = $1', [userId]);
            return { series: result.rows };
        } catch (err) {
            return reply.code(500).send({ error: 'Failed to fetch series' });
        }
    });

    // POST /api/series/upload - Handle file uploads (CBZ/ZIP only)
    fastify.post('/upload', { preHandler: verifyToken }, async (request, reply) => {
        try {
            const data = await request.file();
            if (!data) return reply.code(400).send({ error: 'No file uploaded' });
            const allowedTypes = ['application/zip', 'application/x-cbz', 'application/octet-stream'];
            const allowedExts = ['.cbz', '.zip'];
            const ext = path.extname(data.filename).toLowerCase();
            if (!allowedExts.includes(ext)) {
                return reply.code(400).send({ error: 'Only .cbz or .zip files are supported' });
            }
            if (!allowedTypes.includes(data.mimetype)) {
                return reply.code(400).send({ error: 'Invalid file type. Only CBZ/ZIP files are allowed.' });
            }
            const uploadDir = path.join(__dirname, '../../../uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const filePath = path.join(uploadDir, `${Date.now()}_${data.filename}`);
            await new Promise((resolve, reject) => {
                const stream = fs.createWriteStream(filePath);
                data.file.pipe(stream);
                data.file.on('end', resolve);
                data.file.on('error', reject);
            });
            // Parse CBZ and extract metadata (placeholder)
            const parsed = await parseCbz(filePath);
            // Example: parsed = { title, coverPath }
            // Save to DB (placeholder values if parser not implemented)
            const userId = request.user.id;
            const title = (parsed && parsed.title) || data.filename.replace(ext, '');
            const coverPath = (parsed && parsed.coverPath) || null;
            const result = await db.query(
                'INSERT INTO series (title, cover_path, user_id) VALUES ($1, $2, $3) RETURNING *',
                [title, coverPath, userId]
            );
            return { message: 'File uploaded', series: result.rows[0] };
        } catch (err) {
            return reply.code(500).send({ error: 'Upload failed', details: err.message });
        }
    });

    // GET /api/series/:id/images - Get image paths for a series
    fastify.get('/:id/images', { preHandler: verifyToken }, async (request, reply) => {
        const userId = request.user.id;
        const seriesId = request.params.id;
        // Check ownership
        const result = await db.query('SELECT * FROM series WHERE id = $1 AND user_id = $2', [seriesId, userId]);
        const series = result.rows[0];
        if (!series) return reply.code(404).send({ error: 'Series not found' });
        if (!series.cover_path) return reply.send({ images: [] });
        // Images are in the same folder as cover_path
        const dir = path.dirname(series.cover_path);
        const files = fs.readdirSync(dir);
        const images = files.filter(f => /\.(jpe?g|png)$/i.test(f)).sort();
        // Serve as URLs (static route)
        const baseUrl = `/api/series/${seriesId}/static`;
        return { images: images.map(img => `${baseUrl}/${img}`) };
    });

    // Serve static images for a series
    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, '../../../uploads'),
        prefix: '/api/series/static/',
        decorateReply: false
    });

    // PATCH /api/series/:id - Edit series title
    fastify.patch('/:id', { preHandler: verifyToken }, async (request, reply) => {
        const userId = request.user.id;
        const seriesId = request.params.id;
        const { title } = request.body;
        if (!title) return reply.code(400).send({ error: 'Title required' });
        const result = await db.query('UPDATE series SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [title, seriesId, userId]);
        if (!result.rows[0]) return reply.code(404).send({ error: 'Series not found or not yours' });
        return { series: result.rows[0] };
    });

    // DELETE /api/series/:id - Delete a series
    fastify.delete('/:id', { preHandler: verifyToken }, async (request, reply) => {
        const userId = request.user.id;
        const seriesId = request.params.id;
        // Remove from DB
        const result = await db.query('DELETE FROM series WHERE id = $1 AND user_id = $2 RETURNING *', [seriesId, userId]);
        if (!result.rows[0]) return reply.code(404).send({ error: 'Series not found or not yours' });
        // Optionally: remove extracted files from disk
        return { message: 'Series deleted' };
    });
}
module.exports = seriesRoutes;
