const Header = ({ user, onMenuClick, onThemeToggle, onLogin, onLogout, theme, apiStatus }) => {
  const headerStyle = {
    padding: '1rem 2rem',
    background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const logoStyle = {
    margin: 0,
    color: theme === 'dark' ? 'white' : '#333',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const navStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: theme === 'dark' ? 'white' : '#333',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    fontSize: '1rem',
  };

  const statusStyle = {
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    background: apiStatus === 'connected' ? '#d4edda' : '#f8d7da',
    color: apiStatus === 'connected' ? '#155724' : '#721c24',
    border: `1px solid ${apiStatus === 'connected' ? '#c3e6cb' : '#f5c6cb'}`,
  };

  return (
    <header style={headerStyle}>
      <h1 style={logoStyle}>📚 Project Myriad</h1>

      <nav style={navStyle}>
        <div style={statusStyle}>
          {apiStatus === 'connected' ? '🟢' : '🔴'} Backend: {apiStatus}
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: theme === 'dark' ? 'white' : '#333' }}>
              Welcome, {user.name || user.username}
            </span>
            <button
              onClick={onLogout}
              style={{
                ...buttonStyle,
                background: '#dc3545',
                color: 'white',
                padding: '0.25rem 0.75rem',
                fontSize: '0.9rem',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            style={{
              ...buttonStyle,
              background: '#007bff',
              color: 'white',
              padding: '0.25rem 0.75rem',
              fontSize: '0.9rem',
            }}
          >
            Login
          </button>
        )}

        <button
          onClick={onThemeToggle}
          style={buttonStyle}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <button onClick={onMenuClick} style={buttonStyle} title='Toggle navigation menu'>
          ☰
        </button>
      </nav>
    </header>
  );
};

export default Header;
