import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, theme, user }) => {
  const sidebarStyle = {
    position: 'fixed',
    left: isOpen ? '0' : '-300px',
    top: '0',
    width: '300px',
    height: '100vh',
    background:
      theme === 'dark'
        ? 'linear-gradient(180deg, #16213e 0%, #1a1a2e 100%)'
        : 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
    transition: 'left 0.3s ease',
    zIndex: 1000,
    padding: '2rem 0',
    borderRight: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`,
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    overflow: 'auto',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    display: isOpen ? 'block' : 'none',
  };

  const headerStyle = {
    padding: '0 2rem 1rem',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`,
    marginBottom: '1rem',
  };

  const titleStyle = {
    margin: 0,
    color: theme === 'dark' ? 'white' : '#333',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  };

  const navStyle = {
    padding: '0 1rem',
  };

  const navItemStyle = {
    display: 'block',
    padding: '0.75rem 1rem',
    color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
    textDecoration: 'none',
    borderRadius: '8px',
    margin: '0.25rem 0',
    transition: 'all 0.2s',
    fontSize: '0.95rem',
    fontWeight: '500',
  };

  const activeNavItemStyle = {
    ...navItemStyle,
    background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,123,255,0.1)',
    color: theme === 'dark' ? 'white' : '#007bff',
    fontWeight: '600',
  };

  const sectionStyle = {
    padding: '0 2rem',
    marginTop: '2rem',
  };

  const sectionTitleStyle = {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const navigationItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/library', icon: '📚', label: 'Library' },
    { path: '/extensions', icon: '🧩', label: 'Extensions' },
    { path: '/community', icon: '👥', label: 'Community' },
  ];

  const userItems = user
    ? [
        { path: '/profile', icon: '👤', label: 'Profile' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
      ]
    : [
        { path: '/login', icon: '🔐', label: 'Login' },
        { path: '/register', icon: '📝', label: 'Register' },
      ];

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <aside style={sidebarStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Navigation</h2>
        </div>

        <nav style={navStyle}>
          <div style={sectionTitleStyle}>Main</div>
          {navigationItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => (isActive ? activeNavItemStyle : navItemStyle)}
              onClick={onClose}
            >
              <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Account</div>
          <nav>
            {userItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => (isActive ? activeNavItemStyle : navItemStyle)}
                onClick={onClose}
              >
                <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {user && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Quick Stats</div>
            <div
              style={{
                background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  marginBottom: '0.5rem',
                }}
              >
                <span>Reading:</span>
                <span>12 series</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                }}
              >
                <span>Completed:</span>
                <span>48 series</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
