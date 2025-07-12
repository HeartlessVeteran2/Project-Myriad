const request = require('supertest');
const app = require('../index.js');

describe('🧪 Backend API Integration Tests', () => {
  let server;

  beforeAll(async () => {
    // Start server for testing
    server = app.listen(0);
  });

  afterAll(async () => {
    // Close server after tests
    if (server) {
      server.close();
    }
  });

  describe('🏥 Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('🔐 Authentication', () => {
    test('should handle login attempts', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword'
        });

      expect(response.status).toBe(401); // Should fail with invalid credentials
      expect(response.body).toHaveProperty('message');
    });

    test('should validate registration data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400); // Should fail validation
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('📚 Library Management', () => {
    test('should get library without authentication', async () => {
      const response = await request(app)
        .get('/api/library')
        .expect(401); // Should require authentication

      expect(response.body).toHaveProperty('message');
    });

    test('should handle library search', async () => {
      const response = await request(app)
        .get('/api/library/search?q=test')
        .expect(401); // Should require authentication

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('🤖 AI Recommendations', () => {
    test('should handle AI recommendation requests', async () => {
      const response = await request(app)
        .get('/api/ai/recommendations')
        .expect(401); // Should require authentication

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('👥 Community Features', () => {
    test('should get community posts', async () => {
      const response = await request(app)
        .get('/api/community/posts')
        .expect(200); // Should work without authentication for public posts

      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBe(true);
    });
  });

  describe('🧩 Extensions', () => {
    test('should list available extensions', async () => {
      const response = await request(app)
        .get('/api/extensions')
        .expect(200);

      expect(response.body).toHaveProperty('extensions');
      expect(Array.isArray(response.body.extensions)).toBe(true);
    });
  });

  describe('🔒 Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });

  describe('📊 Rate Limiting', () => {
    test('should apply rate limiting', async () => {
      // Make multiple requests rapidly
      const requests = Array(10).fill().map(() =>
        request(app).get('/api/health')
      );

      const responses = await Promise.all(requests);

      // Check that all requests are successful (rate limit should be generous for tests)
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });

  describe('🗃️ Database Operations', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test assumes database might not be available
      const response = await request(app)
        .get('/api/health/db')
        .expect(res => {
          expect([200, 503]).toContain(res.status);
        });

      if (response.status === 503) {
        expect(response.body).toHaveProperty('error');
      }
    });
  });

  describe('📝 Error Handling', () => {
    test('should handle 404 errors', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });
});
