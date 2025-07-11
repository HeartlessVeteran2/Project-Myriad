import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3333;

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
    features: ['manga', 'anime', 'light-novels', 'user-tracking']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Manga endpoints
app.get('/api/manga', (req, res) => {
  res.json({
    manga: [
      { id: 1, title: 'One Piece', chapters: 1090, status: 'ongoing', rating: 9.5 },
      { id: 2, title: 'Attack on Titan', chapters: 139, status: 'completed', rating: 9.0 },
      { id: 3, title: 'Demon Slayer', chapters: 205, status: 'completed', rating: 8.8 }
    ]
  });
});

// Anime endpoints  
app.get('/api/anime', (req, res) => {
  res.json({
    anime: [
      { id: 1, title: 'Demon Slayer', episodes: 44, status: 'ongoing', rating: 8.7 },
      { id: 2, title: 'Attack on Titan', episodes: 87, status: 'completed', rating: 9.0 },
      { id: 3, title: 'Jujutsu Kaisen', episodes: 24, status: 'ongoing', rating: 8.9 }
    ]
  });
});

// Light Novel endpoints
app.get('/api/novels', (req, res) => {
  res.json({
    novels: [
      { id: 1, title: 'Overlord', volumes: 16, status: 'ongoing', rating: 8.6 },
      { id: 2, title: 'Re:Zero', volumes: 32, status: 'ongoing', rating: 8.8 },
      { id: 3, title: 'Konosuba', volumes: 17, status: 'completed', rating: 8.4 }
    ]
  });
});

// Statistics endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    totalManga: 3,
    totalAnime: 3, 
    totalNovels: 3,
    lastUpdated: new Date().toISOString(),
    userActivity: 'active'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});
