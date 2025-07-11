import React, { useState, useEffect } from 'react';

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking...');
  const [apiData, setApiData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Check backend connection and fetch data
    Promise.all([
      fetch('http://localhost:3333').then(res => res.json()),
      fetch('http://localhost:3333/api/stats').then(res => res.json())
    ])
    .then(([mainData, statsData]) => {
      setApiStatus('connected');
      setApiData(mainData);
      setStats(statsData);
    })
    .catch(() => setApiStatus('disconnected'));
  }, []);

  const cardStyle = {
    background: 'rgba(255,255,255,0.1)',
    padding: '2rem',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  };

  const buttonStyle = {
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    width: '100%'
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          📚 Project Myriad
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          opacity: 0.9,
          margin: '1rem 0'
        }}>
          Unified Manga, Anime & Light Novel Management Platform
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: '25px',
            background: apiStatus === 'connected' ? '#4CAF50' : '#f44336',
            fontSize: '0.9rem'
          }}>
            Backend: {apiStatus}
          </div>
          
          {stats && (
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              background: 'rgba(255,255,255,0.2)',
              fontSize: '0.9rem'
            }}>
              Total Items: {stats.totalManga + stats.totalAnime + stats.totalNovels}
            </div>
          )}
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>📖 Manga Library</h3>
          <p style={{ margin: '0 0 1.5rem 0', opacity: 0.8 }}>
            Track your manga reading progress
          </p>
          {stats && (
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#FFD700' }}>
              {stats.totalManga}
            </p>
          )}
          <button style={{
            ...buttonStyle,
            background: 'linear-gradient(45deg, #FF6B6B, #FF5252)'
          }}>
            Browse Manga
          </button>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>🎬 Anime Collection</h3>
          <p style={{ margin: '0 0 1.5rem 0', opacity: 0.8 }}>
            Manage your anime watchlist
          </p>
          {stats && (
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#4ECDC4' }}>
              {stats.totalAnime}
            </p>
          )}
          <button style={{
            ...buttonStyle,
            background: 'linear-gradient(45deg, #4ECDC4, #26C6DA)'
          }}>
            View Anime
          </button>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>📝 Light Novels</h3>
          <p style={{ margin: '0 0 1.5rem 0', opacity: 0.8 }}>
            Keep track of your reading
          </p>
          {stats && (
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#45B7D1' }}>
              {stats.totalNovels}
            </p>
          )}
          <button style={{
            ...buttonStyle,
            background: 'linear-gradient(45deg, #45B7D1, #42A5F5)'
          }}>
            Explore Novels
          </button>
        </div>
      </div>

      {apiData && (
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '1.5rem',
          borderRadius: '10px',
          marginTop: '2rem',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>🔧 Development Info</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <strong>Version:</strong> {apiData.version}
            </div>
            <div>
              <strong>Status:</strong> {apiData.status}
            </div>
            <div>
              <strong>Features:</strong> {apiData.features?.join(', ')}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date(apiData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      <footer style={{ 
        textAlign: 'center', 
        marginTop: '3rem',
        opacity: 0.7,
        padding: '2rem 0'
      }}>
        <p>🚀 Development Environment Active</p>
        <p style={{ fontSize: '0.9rem' }}>
          Frontend: localhost:5175 • Backend: localhost:3333
        </p>
      </footer>
    </div>
  );
}
