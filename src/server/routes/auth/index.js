const db = require('../../db');
const { hashPassword, comparePassword, generateToken } = require('./utils');

async function authRoutes(fastify, options) {
    // POST /api/auth/register
    fastify.post('/register', async (request, reply) => {
        const { username, password } = request.body || request.body || request.payload || {};
        if (!username || !password) {
            return reply.code(400).send({ error: 'Username and password required' });
        }
        try {
            const password_hash = await hashPassword(password);
            const result = await db.query(
                'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
                [username, password_hash]
            );
            return { user: result.rows[0] };
        } catch (err) {
            if (err.code === '23505') {
                return reply.code(409).send({ error: 'Username already exists' });
            }
            return reply.code(500).send({ error: 'Registration failed' });
        }
    });

    // POST /api/auth/login
    fastify.post('/login', async (request, reply) => {
        const { username, password } = request.body || request.body || request.payload || {};
        if (!username || !password) {
            return reply.code(400).send({ error: 'Username and password required' });
        }
        try {
            const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            const user = result.rows[0];
            if (!user) return reply.code(401).send({ error: 'Invalid credentials' });
            const valid = await comparePassword(password, user.password_hash);
            if (!valid) return reply.code(401).send({ error: 'Invalid credentials' });
            const token = generateToken({ id: user.id, username: user.username });
            return { token };
        } catch (err) {
            return reply.code(500).send({ error: 'Login failed' });
        }
    });
}
module.exports = authRoutes;
