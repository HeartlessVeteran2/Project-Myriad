const NotificationBadge = ({ count, theme, size = 'small', variant = 'primary' }) => {
  if (!count || count === 0) return null;

  const sizeStyles = {
    small: {
      minWidth: '18px',
      height: '18px',
      fontSize: '0.7rem',
      padding: '0 4px',
    },
    medium: {
      minWidth: '22px',
      height: '22px',
      fontSize: '0.75rem',
      padding: '0 6px',
    },
    large: {
      minWidth: '26px',
      height: '26px',
      fontSize: '0.8rem',
      padding: '0 8px',
    },
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #007bff, #0056b3)',
      color: 'white',
    },
    success: {
      background: 'linear-gradient(135deg, #28a745, #1e7e34)',
      color: 'white',
    },
    warning: {
      background: 'linear-gradient(135deg, #ffc107, #e0a800)',
      color: '#212529',
    },
    danger: {
      background: 'linear-gradient(135deg, #dc3545, #c82333)',
      color: 'white',
    },
    info: {
      background: 'linear-gradient(135deg, #17a2b8, #138496)',
      color: 'white',
    },
  };

  const badgeStyle = {
    ...sizeStyles[size],
    ...variantStyles[variant],
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    border: `2px solid ${theme === 'dark' ? '#1a1a1a' : 'white'}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    zIndex: 10,
    animation: count > 99 ? 'pulse 2s infinite' : 'none',
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <>
      <span style={badgeStyle}>{displayCount}</span>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </>
  );
};

const NotificationCenter = ({
  notifications = [],
  theme,
  onNotificationClick,
  onMarkAsRead,
  onClearAll,
}) => {
  const containerStyle = {
    position: 'relative',
    maxWidth: '400px',
    background: theme === 'dark' ? '#2a2a2a' : 'white',
    border: `1px solid ${theme === 'dark' ? '#333' : '#e0e6ed'}`,
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '1rem 1.5rem',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e0e6ed'}`,
    background: theme === 'dark' ? '#333' : '#f8f9fa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: theme === 'dark' ? 'white' : '#333',
  };

  const clearButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  };

  const listStyle = {
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const notificationStyle = isRead => ({
    padding: '1rem 1.5rem',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#f0f0f0'}`,
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: isRead
      ? 'transparent'
      : theme === 'dark'
        ? 'rgba(0,123,255,0.1)'
        : 'rgba(0,123,255,0.05)',
    position: 'relative',
  });

  const notificationHoverStyle = {
    background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
  };

  const emptyStyle = {
    padding: '3rem 1.5rem',
    textAlign: 'center',
    color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
  };

  const getNotificationIcon = type => {
    const icons = {
      update: '🔄',
      message: '💬',
      achievement: '🏆',
      system: '⚙️',
      recommendation: '🌟',
      community: '👥',
      download: '⬇️',
      error: '❌',
      success: '✅',
    };
    return icons[type] || '📢';
  };

  const getTimeAgo = timestamp => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Notifications</h3>
        {notifications.length > 0 && (
          <button
            style={clearButtonStyle}
            onClick={onClearAll}
            onMouseEnter={e => {
              e.target.style.background =
                theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,123,255,0.1)';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div style={listStyle}>
        {notifications.length === 0 ? (
          <div style={emptyStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔔</div>
            <div>No notifications</div>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              style={notificationStyle(notification.read)}
              onClick={() => onNotificationClick(notification)}
              onMouseEnter={e => {
                Object.assign(e.target.style, notificationHoverStyle);
              }}
              onMouseLeave={e => {
                e.target.style.background = notification.read
                  ? 'transparent'
                  : theme === 'dark'
                    ? 'rgba(0,123,255,0.1)'
                    : 'rgba(0,123,255,0.05)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                  {getNotificationIcon(notification.type)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: notification.read ? 'normal' : 'bold',
                      color: theme === 'dark' ? 'white' : '#333',
                      marginBottom: '0.25rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    {notification.title}
                  </div>
                  <div
                    style={{
                      color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {notification.message}
                  </div>
                  <div
                    style={{
                      color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {getTimeAgo(notification.timestamp)}
                  </div>
                </div>
                {!notification.read && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#007bff',
                      flexShrink: 0,
                      marginTop: '0.5rem',
                    }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { NotificationBadge, NotificationCenter };
