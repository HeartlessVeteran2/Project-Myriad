import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const SearchBar = ({ onSearch, theme, placeholder = 'Search manga, anime, light novels...' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchBarStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: `2px solid ${theme === 'dark' ? '#333' : '#e0e6ed'}`,
    borderRadius: '25px',
    background: theme === 'dark' ? '#2a2a2a' : 'white',
    color: theme === 'dark' ? 'white' : '#333',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#007bff',
    boxShadow: '0 4px 20px rgba(0,123,255,0.2)',
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const suggestionsStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: theme === 'dark' ? '#2a2a2a' : 'white',
    border: `1px solid ${theme === 'dark' ? '#333' : '#e0e6ed'}`,
    borderRadius: '12px',
    marginTop: '0.5rem',
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    display: showSuggestions && suggestions.length > 0 ? 'block' : 'none',
  };

  const suggestionItemStyle = {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#f0f0f0'}`,
    color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : '#333',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const suggestionHoverStyle = {
    background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,123,255,0.1)',
  };

  const loadingStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  };

  // Mock suggestions for demonstration
  const mockSuggestions = [
    { id: 1, title: 'Attack on Titan', type: 'Manga', category: '📖' },
    { id: 2, title: 'Your Name', type: 'Anime', category: '🎬' },
    { id: 3, title: 'Sword Art Online', type: 'Light Novel', category: '📚' },
    { id: 4, title: 'Demon Slayer', type: 'Manga', category: '📖' },
    { id: 5, title: 'Spirited Away', type: 'Anime', category: '🎬' },
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          const filtered = mockSuggestions.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
          setIsLoading(false);
          setShowSuggestions(true);
        }, 300);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = e => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = suggestion => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    onSearch(suggestion.title);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <form onSubmit={handleSubmit} style={searchBarStyle}>
      <div style={{ position: 'relative' }}>
        <Search size={20} style={iconStyle} />
        <input
          type='text'
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          style={showSuggestions ? inputFocusStyle : inputStyle}
        />
        {isLoading && (
          <div style={loadingStyle}>
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        )}
      </div>

      <div style={suggestionsStyle}>
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.id}
            style={suggestionItemStyle}
            onClick={() => handleSuggestionClick(suggestion)}
            onMouseEnter={e => {
              e.target.style.background = suggestionHoverStyle.background;
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
            }}
          >
            <span>{suggestion.category}</span>
            <div>
              <div style={{ fontWeight: '600' }}>{suggestion.title}</div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                }}
              >
                {suggestion.type}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: translateY(-50%) rotate(0deg); }
            100% { transform: translateY(-50%) rotate(360deg); }
          }
        `}
      </style>
    </form>
  );
};

export default SearchBar;
