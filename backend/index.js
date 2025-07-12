import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import winston from 'winston';

// Load environment variables
dotenv.config();

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
});

// Import modules
import { Accessibility } from './accessibility/index.js';
import { AI } from './ai/index.js';
import { Community } from './community/index.js';
import { DownloadManager } from './downloadManager.js';
import { extensionManager } from './extensions/index.js';
import { ParentalControls } from './parental/index.js';
import { Sync } from './sync/index.js';
import { Tracking } from './tracking.js';
import { Web3Module } from './web3/index.js';

const app = express();
const PORT = process.env.PORT || 3333;

// Initialize modules
const tracking = new Tracking();
const downloadManager = new DownloadManager();
const ai = new AI();
const community = new Community();
const accessibility = new Accessibility();
const parentalControls = new ParentalControls();
const sync = new Sync();
const web3 = new Web3Module();

// Initialize extensions
extensionManager.loadExtensions().then(() => {
  console.log('📦 Extensions loaded');
});

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Middleware
app.use(compression());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'Project Myriad Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    features: [
      'manga',
      'anime',
      'light-novels',
      'user-tracking',
      'downloads',
      'ai-recommendations',
      'community',
      'extensions',
      'accessibility',
      'parental-controls',
      'sync',
      'web3-integration',
    ],
    modules: {
      tracking: 'active',
      downloadManager: 'active',
      ai: 'active',
      community: 'active',
      extensions: 'active',
      accessibility: 'active',
      parentalControls: 'active',
      sync: 'active',
      web3: 'active',
    },
  });
});

app.get('/api/health', (req, res) => {
  const moduleStats = {
    tracking: tracking.getStats('demo_user'),
    downloads: downloadManager.getStats(),
    community: community.getStats(),
    extensions: extensionManager.getSystemStats(),
    web3: web3.getWeb3Stats(),
  };

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    modules: moduleStats,
  });
});

// Content endpoints
app.get('/api/manga', (req, res) => {
  res.json({
    manga: [
      {
        id: 1,
        title: 'One Piece',
        chapters: 1090,
        status: 'ongoing',
        rating: 9.5,
        genres: ['Adventure', 'Comedy', 'Shounen'],
      },
      {
        id: 2,
        title: 'Attack on Titan',
        chapters: 139,
        status: 'completed',
        rating: 9.0,
        genres: ['Action', 'Drama', 'Fantasy'],
      },
      {
        id: 3,
        title: 'Demon Slayer',
        chapters: 205,
        status: 'completed',
        rating: 8.8,
        genres: ['Action', 'Supernatural', 'Historical'],
      },
    ],
  });
});

app.get('/api/anime', (req, res) => {
  res.json({
    anime: [
      {
        id: 1,
        title: 'Demon Slayer',
        episodes: 44,
        status: 'ongoing',
        rating: 8.7,
        genres: ['Action', 'Supernatural', 'Historical'],
      },
      {
        id: 2,
        title: 'Attack on Titan',
        episodes: 87,
        status: 'completed',
        rating: 9.0,
        genres: ['Action', 'Drama', 'Fantasy'],
      },
      {
        id: 3,
        title: 'Jujutsu Kaisen',
        episodes: 24,
        status: 'ongoing',
        rating: 8.9,
        genres: ['Action', 'Supernatural', 'School'],
      },
    ],
  });
});

app.get('/api/novels', (req, res) => {
  res.json({
    novels: [
      {
        id: 1,
        title: 'Overlord',
        volumes: 16,
        status: 'ongoing',
        rating: 8.6,
        genres: ['Fantasy', 'Adventure', 'Comedy'],
      },
      {
        id: 2,
        title: 'Re:Zero',
        volumes: 32,
        status: 'ongoing',
        rating: 8.8,
        genres: ['Fantasy', 'Psychological', 'Drama'],
      },
      {
        id: 3,
        title: 'Konosuba',
        volumes: 17,
        status: 'completed',
        rating: 8.4,
        genres: ['Comedy', 'Fantasy', 'Adventure'],
      },
    ],
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalManga: 3,
    totalAnime: 3,
    totalNovels: 3,
    lastUpdated: new Date().toISOString(),
    userActivity: 'active',
    downloads: downloadManager.getStats(),
    community: community.getStats(),
    extensions: extensionManager.getSystemStats(),
  });
});

// Module-specific routes

// Tracking routes
app.get('/api/tracking/:userId/history', (req, res) => {
  const history = tracking.getHistory(req.params.userId);
  res.json({ history });
});

app.post('/api/tracking/:userId/progress', (req, res) => {
  tracking.updateProgress(req.params.userId, req.body.contentId, req.body.progress);
  res.json({ success: true, message: 'Progress updated' });
});

// Download routes
app.get('/api/downloads/queue', (req, res) => {
  const queue = downloadManager.getQueue();
  res.json({ queue });
});

app.post('/api/downloads/add', (req, res) => {
  const downloadId = downloadManager.addDownload(req.body);
  res.json({ success: true, downloadId });
});

// AI routes
app.get('/api/ai/recommendations/:userId', (req, res) => {
  const recommendations = ai.recommend(req.params.userId, req.query);
  res.json({ recommendations });
});

app.post('/api/ai/visual-search', (req, res) => {
  const results = ai.visualSearch(req.body.imageData);
  res.json({ results });
});

// Community routes
app.get('/api/community/clubs', (req, res) => {
  const clubs = community.getClubs(req.query);
  res.json({ clubs });
});

app.post('/api/community/clubs', (req, res) => {
  const club = community.createClub(req.body, req.body.creatorId);
  res.json({ success: true, club });
});

// Extension routes
app.get('/api/extensions', (req, res) => {
  const extensions = extensionManager.getExtensions();
  res.json({ extensions });
});

app.get('/api/extensions/sources', (req, res) => {
  const sources = extensionManager.getSources(req.query);
  res.json({ sources });
});

// Accessibility routes
app.get('/api/accessibility/:userId/settings', (req, res) => {
  const settings = accessibility.getUserSettings(req.params.userId);
  res.json({ settings });
});

app.post('/api/accessibility/:userId/settings', (req, res) => {
  const updated = accessibility.updateUserSettings(req.params.userId, req.body);
  res.json({ success: true, settings: updated });
});

// Parental controls routes
app.post('/api/parental/:userId/init', (req, res) => {
  const result = parentalControls.initializeParentalControls(
    req.params.userId,
    req.body.parentEmail,
    req.body.settings
  );
  res.json(result);
});

app.post('/api/parental/:userId/check-content', (req, res) => {
  const result = parentalControls.isContentAllowed(req.params.userId, req.body.content);
  res.json(result);
});

// Sync routes
app.post('/api/sync/:userId/library', (req, res) => {
  sync
    .syncLibrary(req.params.userId, req.body.deviceId, req.body.syncData)
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ success: false, error: error.message }));
});

app.get('/api/sync/:userId/devices', (req, res) => {
  const devices = sync.getUserDevices(req.params.userId);
  res.json({ devices });
});

// Web3 routes
app.post('/api/web3/:userId/connect-wallet', (req, res) => {
  web3
    .connectWallet(req.params.userId, req.body.walletInfo)
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ success: false, error: error.message }));
});

app.get('/api/web3/:userId/nfts', (req, res) => {
  const nfts = web3.getUserNFTs(req.params.userId);
  res.json(nfts);
});

app.get('/api/web3/proposals', (req, res) => {
  const proposals = web3.getActiveProposals();
  res.json({ proposals });
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
      timestamp: new Date().toISOString(),
    },
  });
};

// Health check endpoints
app.get('/api/health', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      tracking: 'operational',
      downloads: 'operational',
      ai: 'operational',
      community: 'operational',
      extensions: 'operational',
      accessibility: 'operational',
      parental: 'operational',
      sync: 'operational',
      web3: 'operational',
    },
  };

  res.json(healthData);
});

app.get('/api/health/detailed', (req, res) => {
  const detailedHealth = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    node_version: process.version,
    platform: process.platform,
    arch: process.arch,
    services: {
      tracking: { status: 'operational', lastCheck: new Date().toISOString() },
      downloads: { status: 'operational', lastCheck: new Date().toISOString() },
      ai: { status: 'operational', lastCheck: new Date().toISOString() },
      community: { status: 'operational', lastCheck: new Date().toISOString() },
      extensions: { status: 'operational', lastCheck: new Date().toISOString() },
      accessibility: { status: 'operational', lastCheck: new Date().toISOString() },
      parental: { status: 'operational', lastCheck: new Date().toISOString() },
      sync: { status: 'operational', lastCheck: new Date().toISOString() },
      web3: { status: 'operational', lastCheck: new Date().toISOString() },
    },
    endpoints: {
      '/api/health': 'Health check endpoint',
      '/api/stats': 'System statistics',
      '/api/tracking': 'Reading progress tracking',
      '/api/downloads': 'Download management',
      '/api/ai': 'AI recommendations',
      '/api/community': 'Community features',
      '/api/extensions': 'Extension management',
      '/api/accessibility': 'Accessibility features',
      '/api/parental': 'Parental controls',
      '/api/sync': 'Cross-platform sync',
      '/api/web3': 'Blockchain integration',
    },
  };

  res.json(detailedHealth);
});

// Use the error handling middleware
app.use(errorHandler);

// Use the 404 handler
app.use(notFoundHandler);

const server = app.listen(PORT, () => {
  logger.info(`🚀 Backend server running on port ${PORT}`);
  logger.info(`📡 API available at http://localhost:${PORT}`);
  logger.info(`❤️  Health check: http://localhost:${PORT}/api/health`);
  logger.info(`📖 Documentation: http://localhost:${PORT}/`);
  logger.info(
    `🎯 Features: Tracking, Downloads, AI, Community, Extensions, Accessibility, Parental Controls, Sync, Web3`
  );
});

// Move the graceful shutdown and error handlers after server declaration
// Graceful shutdown handler
const gracefulShutdownHandler = signal => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(err => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }

    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdownHandler('SIGTERM'));
process.on('SIGINT', () => gracefulShutdownHandler('SIGINT'));

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Export for testing
export default app;
