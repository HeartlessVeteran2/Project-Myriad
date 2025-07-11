import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

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

// Middleware
app.use(cors());
app.use(morgan('dev'));
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
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/manga',
      'GET /api/anime',
      'GET /api/novels',
      'GET /api/stats',
      'GET /api/tracking/:userId/history',
      'GET /api/downloads/queue',
      'GET /api/ai/recommendations/:userId',
      'GET /api/community/clubs',
      'GET /api/extensions',
      'GET /api/accessibility/:userId/settings',
      'GET /api/sync/:userId/devices',
      'GET /api/web3/:userId/nfts',
      'GET /api/web3/proposals',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`📖 Documentation: http://localhost:${PORT}/`);
  console.log(
    `🎯 Features: Tracking, Downloads, AI, Community, Extensions, Accessibility, Parental Controls, Sync, Web3`
  );
});
