import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Library = React.lazy(() => import('./pages/Library'));
const Extensions = React.lazy(() => import('./pages/Extensions'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Community = React.lazy(() => import('./pages/Community'));

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking...');
  const [apiData, setApiData] = useState(null);
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize app and check backend connection
    const initializeApp = async () => {
      try {
        const [mainResponse, statsResponse] = await Promise.all([
          fetch('/api').then(res => res.json()),
          fetch('/api/stats').then(res => res.json())
        ]);
        
        setApiStatus('connected');
        setApiData(mainResponse);
        setStats(statsResponse);

        // Load user preferences from localStorage
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        
        // Check for saved user session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setApiStatus('disconnected');
      }
    };

    initializeApp();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

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
    <ErrorBoundary>
      <Router>
        <div className={`app ${theme}`} style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minHeight: '100vh',
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          color: theme === 'dark' ? 'white' : '#333',
          transition: 'all 0.3s ease'
        }}>
          <Header 
            user={user}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            onThemeToggle={toggleTheme}
            onLogin={handleLogin}
            onLogout={handleLogout}
            theme={theme}
            apiStatus={apiStatus}
          />
          
          <div className="app-layout" style={{ display: 'flex' }}>
            <Sidebar 
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              theme={theme}
              user={user}
            />
            
            <main className="main-content" style={{
              flex: 1,
              padding: '2rem',
              marginLeft: sidebarOpen ? '250px' : '0',
              transition: 'margin-left 0.3s ease',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={
                    <Dashboard 
                      apiStatus={apiStatus}
                      apiData={apiData}
                      stats={stats}
                      theme={theme}
                    />
                  } />
                  <Route path="/library" element={<Library theme={theme} />} />
                  <Route path="/extensions" element={<Extensions theme={theme} />} />
                  <Route path="/community" element={<Community theme={theme} />} />
                  <Route path="/profile" element={<Profile user={user} theme={theme} />} />
                  <Route path="/settings" element={<Settings theme={theme} onThemeChange={toggleTheme} />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
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
