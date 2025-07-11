// Feature definitions and implementations for web UI
export const features = [
  {
    id: 'unified-library',
    name: 'Unified Library',
    description: 'Centralized library for manga, anime, and light novels',
    status: 'active',
    icon: '📚',
    component: 'LibraryView',
  },
  {
    id: 'extension-system',
    name: 'Extension System',
    description: 'Dynamic content sources and custom features',
    status: 'active',
    icon: '🧩',
    component: 'ExtensionManager',
  },
  {
    id: 'manga-reader',
    name: 'Manga Reader',
    description: 'Advanced manga reading interface with customization',
    status: 'active',
    icon: '📖',
    component: 'MangaReader',
  },
  {
    id: 'anime-player',
    name: 'Anime Player',
    description: 'Video player with subtitle support and streaming',
    status: 'active',
    icon: '🎬',
    component: 'AnimePlayer',
  },
  {
    id: 'download-manager',
    name: 'Download Manager',
    description: 'Queue-based downloading with progress tracking',
    status: 'active',
    icon: '⬇️',
    component: 'DownloadManager',
  },
  {
    id: 'search-recommendations',
    name: 'Search & Recommendations',
    description: 'AI-powered search and personalized recommendations',
    status: 'active',
    icon: '🔍',
    component: 'SearchView',
  },
  {
    id: 'tracking-sync',
    name: 'Tracking & Sync',
    description: 'Cross-device synchronization and reading progress',
    status: 'active',
    icon: '🔄',
    component: 'TrackingView',
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Social features, clubs, and discussions',
    status: 'active',
    icon: '👥',
    component: 'CommunityView',
  },
  {
    id: 'web3-integration',
    name: 'Web3 Integration',
    description: 'Blockchain features and NFT support',
    status: 'beta',
    icon: '⛓️',
    component: 'Web3View',
  },
];

// Feature utilities
export const getFeature = id => {
  return features.find(feature => feature.id === id);
};

export const getActiveFeatures = () => {
  return features.filter(feature => feature.status === 'active');
};

export const getBetaFeatures = () => {
  return features.filter(feature => feature.status === 'beta');
};

export const getFeaturesByCategory = category => {
  const categories = {
    content: ['unified-library', 'manga-reader', 'anime-player'],
    discovery: ['search-recommendations', 'extension-system'],
    management: ['download-manager', 'tracking-sync'],
    social: ['community'],
    advanced: ['web3-integration'],
  };

  const featureIds = categories[category] || [];
  return features.filter(feature => featureIds.includes(feature.id));
};

// Feature permissions and access control
export const checkFeatureAccess = (featureId, userRole = 'user') => {
  const rolePermissions = {
    admin: ['*'], // Admin has access to all features
    premium: [
      'unified-library',
      'extension-system',
      'manga-reader',
      'anime-player',
      'download-manager',
      'search-recommendations',
      'tracking-sync',
      'community',
      'web3-integration',
    ],
    user: [
      'unified-library',
      'manga-reader',
      'anime-player',
      'search-recommendations',
      'tracking-sync',
      'community',
    ],
    guest: ['unified-library', 'manga-reader', 'search-recommendations'],
  };

  const permissions = rolePermissions[userRole] || rolePermissions.guest;
  return permissions.includes('*') || permissions.includes(featureId);
};

// Feature configuration
export const getFeatureConfig = featureId => {
  const configs = {
    'unified-library': {
      itemsPerPage: 20,
      sortOptions: ['title', 'rating', 'updated', 'added'],
      filterOptions: ['all', 'reading', 'completed', 'plan-to-read', 'dropped'],
      viewModes: ['grid', 'list', 'compact'],
    },
    'manga-reader': {
      readingModes: ['single-page', 'double-page', 'webtoon', 'continuous'],
      navigationModes: ['click', 'keyboard', 'gesture'],
      themes: ['light', 'dark', 'sepia', 'black'],
      zoomLevels: [50, 75, 100, 125, 150, 200, 300],
    },
    'anime-player': {
      qualityOptions: ['360p', '480p', '720p', '1080p'],
      subtitleLanguages: ['en', 'jp', 'fr', 'es', 'de'],
      playbackSpeeds: [0.5, 0.75, 1, 1.25, 1.5, 2],
      skipIntroLength: 90,
    },
    'download-manager': {
      maxConcurrentDownloads: 3,
      downloadQualities: ['source', 'high', 'medium', 'low'],
      autoRetryAttempts: 3,
      downloadFormats: ['cbz', 'pdf', 'images'],
    },
    'search-recommendations': {
      resultsPerPage: 25,
      searchFilters: ['type', 'genre', 'status', 'rating', 'year'],
      recommendationTypes: ['similar', 'trending', 'personalized', 'popular'],
      maxRecommendations: 50,
    },
  };

  return configs[featureId] || {};
};

// Feature analytics and usage tracking
export const trackFeatureUsage = (featureId, action, metadata = {}) => {
  const event = {
    featureId,
    action,
    timestamp: new Date(),
    metadata,
    sessionId: getSessionId(),
    userId: getCurrentUserId(),
  };

  // In a real implementation, send to analytics service
  console.log('Feature usage tracked:', event);

  // Store locally for now
  const usage = JSON.parse(localStorage.getItem('featureUsage') || '[]');
  usage.push(event);

  // Keep only last 1000 events
  if (usage.length > 1000) {
    usage.splice(0, usage.length - 1000);
  }

  localStorage.setItem('featureUsage', JSON.stringify(usage));
};

// Helper functions
const getSessionId = () => {
  return sessionStorage.getItem('sessionId') || 'anonymous';
};

const getCurrentUserId = () => {
  return localStorage.getItem('userId') || 'guest';
};

// Feature state management
export const featureStates = {
  enabled: new Set(),
  disabled: new Set(),
  settings: new Map(),
};

export const enableFeature = featureId => {
  featureStates.enabled.add(featureId);
  featureStates.disabled.delete(featureId);
  localStorage.setItem('enabledFeatures', JSON.stringify([...featureStates.enabled]));
};

export const disableFeature = featureId => {
  featureStates.disabled.add(featureId);
  featureStates.enabled.delete(featureId);
  localStorage.setItem('disabledFeatures', JSON.stringify([...featureStates.disabled]));
};

export const isFeatureEnabled = featureId => {
  return featureStates.enabled.has(featureId) && !featureStates.disabled.has(featureId);
};

export const setFeatureSetting = (featureId, key, value) => {
  if (!featureStates.settings.has(featureId)) {
    featureStates.settings.set(featureId, new Map());
  }
  featureStates.settings.get(featureId).set(key, value);

  // Persist to localStorage
  const allSettings = {};
  for (const [fId, settings] of featureStates.settings) {
    allSettings[fId] = Object.fromEntries(settings);
  }
  localStorage.setItem('featureSettings', JSON.stringify(allSettings));
};

export const getFeatureSetting = (featureId, key, defaultValue = null) => {
  const featureSettings = featureStates.settings.get(featureId);
  return featureSettings ? featureSettings.get(key) || defaultValue : defaultValue;
};

// Initialize feature states from localStorage
export const initializeFeatureStates = () => {
  try {
    const enabled = JSON.parse(localStorage.getItem('enabledFeatures') || '[]');
    const disabled = JSON.parse(localStorage.getItem('disabledFeatures') || '[]');
    const settings = JSON.parse(localStorage.getItem('featureSettings') || '{}');

    featureStates.enabled = new Set(enabled);
    featureStates.disabled = new Set(disabled);

    for (const [featureId, featureSettings] of Object.entries(settings)) {
      featureStates.settings.set(featureId, new Map(Object.entries(featureSettings)));
    }
  } catch (error) {
    console.error('Failed to initialize feature states:', error);
  }
};

// Auto-initialize on module load
initializeFeatureStates();
