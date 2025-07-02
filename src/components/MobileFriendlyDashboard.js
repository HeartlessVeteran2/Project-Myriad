'use client';

import { useState, useEffect } from 'react';

export default function MobileFriendlyDashboard() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/series');
      if (!response.ok) {
        throw new Error('Failed to fetch series');
      }
      const data = await response.json();
      setSeries(data.series || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSeries = series
    .filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'updated_at':
          return new Date(b.updated_at) - new Date(a.updated_at);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: '1rem' }}>Loading your library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h3>Error Loading Library</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchSeries}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card">
        <div className="card-body">
          <h1 className="series-title">Your Library</h1>
          <p className="series-meta">{series.length} series in your collection</p>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="card">
        <div className="card-body">
          <div className="space-y-4">
            {/* Search */}
            <div className="form-group">
              <label htmlFor="search" className="form-label">Search Series</label>
              <input
                id="search"
                type="text"
                className="form-input"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between">
              <div className="form-group" style={{ minWidth: '120px' }}>
                <label htmlFor="sort" className="form-label">Sort by</label>
                <select
                  id="sort"
                  className="form-input"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="updated_at">Recently Updated</option>
                  <option value="title">Title A-Z</option>
                  <option value="created_at">Recently Added</option>
                </select>
              </div>

              <div className="flex" style={{ gap: '0.5rem' }}>
                <button
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  ⊞
                </button>
                <button
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Series Grid/List */}
      {filteredSeries.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="upload-icon">📚</div>
            <h3>No Series Found</h3>
            <p style={{ color: 'var(--color-gray-600)' }}>
              {searchTerm ? 'No series match your search.' : 'Your library is empty.'}
            </p>
            {!searchTerm && (
              <a href="/upload" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Upload Your First Series
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'series-grid' : 'space-y-4'}>
          {filteredSeries.map((s) => (
            <SeriesCard key={s.id} series={s} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}

function SeriesCard({ series, viewMode }) {
  const progress = series.current_page && series.page_count 
    ? (series.current_page / series.page_count) * 100 
    : 0;

  if (viewMode === 'list') {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center" style={{ gap: '1rem' }}>
            <img
              src={series.cover_path || '/placeholder-cover.jpg'}
              alt={`${series.title} cover`}
              className="series-cover"
              style={{ width: '80px', height: '120px', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 className="series-title" style={{ marginBottom: '0.5rem' }}>
                {series.title}
              </h3>
              <p className="series-meta">
                {series.page_count} pages
                {series.current_page && ` • Page ${series.current_page}`}
              </p>
              {progress > 0 && (
                <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
              <div className="flex" style={{ gap: '0.5rem', marginTop: '1rem' }}>
                <a 
                  href={`/reader/${series.id}`} 
                  className="btn btn-primary btn-sm"
                >
                  {series.current_page ? 'Continue Reading' : 'Start Reading'}
                </a>
                <button className="btn btn-secondary btn-sm">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="series-card">
      <img
        src={series.cover_path || '/placeholder-cover.jpg'}
        alt={`${series.title} cover`}
        className="series-cover"
      />
      <div className="series-info">
        <h3 className="series-title">{series.title}</h3>
        <p className="series-meta">
          {series.page_count} pages
          {series.current_page && ` • Page ${series.current_page}`}
        </p>
        {progress > 0 && (
          <div className="progress-bar" style={{ marginBottom: '1rem' }}>
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <div className="space-y-4">
          <a 
            href={`/reader/${series.id}`} 
            className="btn btn-primary btn-sm"
          >
            {series.current_page ? 'Continue' : 'Start'}
          </a>
        </div>
      </div>
    </div>
  );
}
