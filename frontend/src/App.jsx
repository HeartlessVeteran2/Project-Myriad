import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Placeholder components - these will be created separately
const ErrorBoundary = ({ children }) => children;
const LoadingSpinner = () => <div>Loading...</div>;
const Header = ({ user, onMenuClick, onThemeToggle, onLogin, onLogout, theme, apiStatus }) => (
  <header style={{ 
    padding: '1rem 2rem', 
    background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <h1 style={{ margin: 0, color: theme === 'dark' ? 'white' : '#333' }}>Project Myriad</h1>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <span style={{ color: apiStatus === 'connected' ? '#4CAF50' : '#f44336' }}>
        Backend: {apiStatus}
      </span>
      <button onClick={onMenuClick} style={{ 
        background: 'none', 
        border: 'none', 
        color: theme === 'dark' ? 'white' : '#333',
        cursor: 'pointer' 
      }}>
        ☰
      </button>
      <button onClick={onThemeToggle} style={{
        background: 'none',
        border: 'none',
        color: theme === 'dark' ? 'white' : '#333',
        cursor: 'pointer'
      }}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  </header>
);

const Sidebar = ({ isOpen, onClose, theme, user }) => (
  <aside style={{
    position: 'fixed',
    left: isOpen ? '0' : '-250px',
    top: '0',
    width: '250px',
    height: '100vh',
    background: theme === 'dark' ? '#16213e' : '#f8f9fa',
    transition: 'left 0.3s ease',
    zIndex: 1000,
    padding: '2rem 1rem',
    borderRight: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`
  }}>
    <nav>
      <a href="/dashboard" style={{ display: 'block', padding: '0.5rem', color: theme === 'dark' ? 'white' : '#333' }}>Dashboard</a>
      <a href="/library" style={{ display: 'block', padding: '0.5rem', color: theme === 'dark' ? 'white' : '#333' }}>Library</a>
      <a href="/extensions" style={{ display: 'block', padding: '0.5rem', color: theme === 'dark' ? 'white' : '#333' }}>Extensions</a>
      <a href="/community" style={{ display: 'block', padding: '0.5rem', color: theme === 'dark' ? 'white' : '#333' }}>Community</a>
      <a href="/profile" style={{ display: 'block', padding: '0.5rem', color: theme === 'dark' ? 'white' : '#333' }}>Profile</a>
      <a href="/settings" style={{ display: 'block', padding: '0.5rem', color: theme === 'dark' ? 'white' : '#333' }}>Settings</a>
    </nav>
  </aside>
);

// Lazy loaded components
const Dashboard = React.lazy(() => Promise.resolve({ 
  default: ({ apiStatus, apiData, stats, theme }) => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: theme === 'dark' ? 'white' : '#333' }}>Dashboard</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        <div style={{
          background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          padding: '2rem',
          borderRadius: '15px',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: theme === 'dark' ? 'white' : '#333' }}>📖 Manga Library</h3>
          <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
            Track your manga reading progress
          </p>
          {stats && (
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFD700' }}>
              {stats.totalManga}
            </p>
          )}
        </div>
        
        <div style={{
          background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          padding: '2rem',
          borderRadius: '15px',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: theme === 'dark' ? 'white' : '#333' }}>🎬 Anime Collection</h3>
          <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
            Manage your anime watchlist
          </p>
          {stats && (
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ECDC4' }}>
              {stats.totalAnime}
            </p>
          )}
        </div>
        
        <div style={{
          background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          padding: '2rem',
          borderRadius: '15px',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: theme === 'dark' ? 'white' : '#333' }}>📝 Light Novels</h3>
          <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
            Keep track of your reading
          </p>
          {stats && (
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#45B7D1' }}>
              {stats.totalNovels}
            </p>
          )}
        </div>
      </div>
      
      {apiData && (
        <div style={{
          background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          padding: '1.5rem',
          borderRadius: '10px',
          marginTop: '2rem',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: theme === 'dark' ? 'white' : '#333' }}>🔧 System Status</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
          }}>
            <div><strong>Version:</strong> {apiData.version}</div>
            <div><strong>Status:</strong> {apiData.status}</div>
            <div><strong>Features:</strong> {apiData.features?.join(', ')}</div>
            <div><strong>Last Updated:</strong> {new Date(apiData.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}));

const Library = React.lazy(() => Promise.resolve({ 
  default: ({ theme }) => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: theme === 'dark' ? 'white' : '#333' }}>Library</h2>
      <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
        Manage your manga, anime, and light novel collections
      </p>
    </div>
  )
}));

const Extensions = React.lazy(() => Promise.resolve({ 
  default: ({ theme }) => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: theme === 'dark' ? 'white' : '#333' }}>Extensions</h2>
      <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
        Browse and manage content source extensions
      </p>
    </div>
  )
}));

const Community = React.lazy(() => Promise.resolve({ 
  default: ({ theme }) => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: theme === 'dark' ? 'white' : '#333' }}>Community</h2>
      <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
        Connect with other users and share recommendations
      </p>
    </div>
  )
}));

const Profile = React.lazy(() => Promise.resolve({ 
  default: ({ user, theme }) => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: theme === 'dark' ? 'white' : '#333' }}>Profile</h2>
      <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
        Manage your account and preferences
      </p>
      {user && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ color: theme === 'dark' ? 'white' : '#333' }}>Welcome, {user.name}!</p>
        </div>
      )}
    </div>
  )
}));

const Settings = React.lazy(() => Promise.resolve({ 
  default: ({ theme, onThemeChange }) => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: theme === 'dark' ? 'white' : '#333' }}>Settings</h2>
      <div style={{ marginTop: '2rem' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          color: theme === 'dark' ? 'white' : '#333'
        }}>
          <span>Theme:</span>
          <button 
            onClick={onThemeChange}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              border: 'none',
              background: theme === 'dark' ? '#4CAF50' : '#2196F3',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </label>
      </div>
    </div>
  )
}));

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
          fetch('/api').then(res => res.json()).catch(() => ({ 
            message: 'Project Myriad Backend',
            version: '1.0.0',
            status: 'running',
            features: ['Library Management', 'Extensions', 'Community'],
            timestamp: new Date().toISOString()
          })),
          fetch('/api/stats').then(res => res.json()).catch(() => ({
            totalManga: 42,
            totalAnime: 28,
            totalNovels: 15
          }))
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
              marginLeft: sidebarOpen ? '250px' : '0',
              transition: 'margin-left 0.3s ease',
              minHeight: 'calc(100vh - 80px)'
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
}
