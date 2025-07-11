// Feature definitions and implementations for mobile UI
let Platform;
try {
  Platform = require('react-native').Platform;
} catch (error) {
  // Fallback for non-React Native environments
  Platform = { OS: 'web', Version: '1.0' };
}

export const features = [
  {
    id: 'unified-library',
    name: 'Unified Library',
    description: 'Centralized library for manga, anime, and light novels',
    status: 'active',
    icon: '📚',
    component: 'LibraryScreen',
    platforms: ['ios', 'android'],
  },
  {
    id: 'extension-system',
    name: 'Extension System',
    description: 'Dynamic content sources and custom features',
    status: 'active',
    icon: '🧩',
    component: 'ExtensionScreen',
    platforms: ['ios', 'android'],
  },
  {
    id: 'manga-reader',
    name: 'Manga Reader',
    description: 'Touch-optimized manga reading with gestures',
    status: 'active',
    icon: '📖',
    component: 'MangaReaderScreen',
    platforms: ['ios', 'android'],
  },
  {
    id: 'anime-player',
    name: 'Anime Player',
    description: 'Native video player with streaming support',
    status: 'active',
    icon: '🎬',
    component: 'AnimePlayerScreen',
    platforms: ['ios', 'android'],
  },
  {
    id: 'download-manager',
    name: 'Download Manager',
    description: 'Offline content with background downloads',
    status: 'active',
    icon: '⬇️',
    component: 'DownloadScreen',
    platforms: ['ios', 'android'],
  },
  {
    id: 'search-recommendations',
    name: 'Search & Recommendations',
    description: 'AI-powered search with voice input',
    status: 'active',
    icon: '🔍',
    component: 'SearchScreen',
    platforms: ['ios', 'android'],
  },
  {
    id: 'tracking-sync',
    name: 'Tracking & Sync',
    description: 'Cloud sync and offline tracking',
    status: 'active',
    icon: '🔄',
    component: 'TrackingScreen',
    platforms: ['ios', 'android'],
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Social features optimized for mobile',
    status: 'active',
    icon: '👥',
    component: 'CommunityScreen',
    platforms: ['ios', 'android'],
  },
  {
    id: 'notifications',
    name: 'Push Notifications',
    description: 'Real-time updates and reminders',
    status: 'active',
    icon: '🔔',
    component: 'NotificationSettings',
    platforms: ['ios', 'android'],
  },
  {
    id: 'biometric-auth',
    name: 'Biometric Authentication',
    description: 'Fingerprint and face unlock',
    status: 'active',
    icon: '🔐',
    component: 'BiometricAuth',
    platforms: ['ios', 'android'],
  },
  {
    id: 'web3-integration',
    name: 'Web3 Integration',
    description: 'Mobile wallet and NFT support',
    status: 'beta',
    icon: '⛓️',
    component: 'Web3Screen',
    platforms: ['ios', 'android'],
  },
];

// Mobile-specific feature utilities
export const getMobileFeatures = () => {
  const currentPlatform = Platform.OS;
  return features.filter(
    feature => feature.platforms.includes(currentPlatform) || feature.platforms.includes('all')
  );
};

export const getFeature = id => {
  return features.find(feature => feature.id === id);
};

export const getActiveFeatures = () => {
  return getMobileFeatures().filter(feature => feature.status === 'active');
};

export const getBetaFeatures = () => {
  return getMobileFeatures().filter(feature => feature.status === 'beta');
};

// Mobile-specific feature categories
export const getFeaturesByCategory = category => {
  const categories = {
    content: ['unified-library', 'manga-reader', 'anime-player'],
    discovery: ['search-recommendations', 'extension-system'],
    management: ['download-manager', 'tracking-sync'],
    social: ['community', 'notifications'],
    security: ['biometric-auth'],
    advanced: ['web3-integration'],
  };

  const featureIds = categories[category] || [];
  return getMobileFeatures().filter(feature => featureIds.includes(feature.id));
};

// Platform-specific permissions
export const getRequiredPermissions = featureId => {
  const permissions = {
    'download-manager': {
      ios: ['WRITE_EXTERNAL_STORAGE'],
      android: ['WRITE_EXTERNAL_STORAGE', 'READ_EXTERNAL_STORAGE'],
    },
    notifications: {
      ios: ['RECEIVE_NOTIFICATIONS'],
      android: ['RECEIVE_BOOT_COMPLETED', 'VIBRATE'],
    },
    'biometric-auth': {
      ios: ['FACE_ID', 'TOUCH_ID'],
      android: ['USE_FINGERPRINT', 'USE_BIOMETRIC'],
    },
    'search-recommendations': {
      ios: ['MICROPHONE'],
      android: ['RECORD_AUDIO'],
    },
    'anime-player': {
      ios: ['BACKGROUND_MODES'],
      android: ['WAKE_LOCK'],
    },
  };

  const featurePermissions = permissions[featureId];
  if (!featurePermissions) return [];

  return featurePermissions[Platform.OS] || [];
};

// Mobile-specific feature configuration
export const getMobileFeatureConfig = featureId => {
  const configs = {
    'unified-library': {
      itemsPerRow: Platform.OS === 'tablet' ? 4 : 2,
      loadMoreThreshold: 0.7,
      refreshThreshold: 100,
      cacheSize: 50,
      offlineMode: true,
    },
    'manga-reader': {
      gestureZones: {
        left: 0.3, // 30% of screen width for previous page
        right: 0.3, // 30% of screen width for next page
        center: 0.4, // 40% for menu toggle
      },
      readingModes: ['single-page', 'double-page', 'webtoon', 'continuous'],
      orientationLock: true,
      immersiveMode: true,
      hapticFeedback: true,
      brightness: {
        auto: true,
        level: 0.8,
      },
    },
    'anime-player': {
      pictureInPicture: Platform.OS === 'ios',
      backgroundPlayback: true,
      airPlay: Platform.OS === 'ios',
      chromecast: Platform.OS === 'android',
      gestureControls: {
        doubleTapToSeek: 10,
        swipeToSeek: true,
        pinchToZoom: true,
        volumeSwipe: true,
        brightnessSwipe: true,
      },
    },
    'download-manager': {
      maxConcurrentDownloads: 2, // Lower for mobile
      wifiOnlyDefault: true,
      batteryOptimization: true,
      storageLocation: 'internal', // or 'external'
      compressionLevel: 'medium',
    },
    notifications: {
      categories: ['updates', 'downloads', 'social', 'reminders'],
      badgeUpdates: true,
      soundEnabled: true,
      vibrationEnabled: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
    },
    'biometric-auth': {
      fallbackToPin: true,
      maxAttempts: 3,
      timeout: 30000,
      prompt: {
        title: 'Authenticate',
        subtitle: 'Use your biometric to unlock',
        description: 'Place your finger on the sensor or look at the camera',
      },
    },
  };

  return configs[featureId] || {};
};

// Native module integration
export const nativeModules = {};

// Mock native modules for non-React Native environments
try {
  nativeModules.DownloadManager = require('./native/DownloadManager');
  nativeModules.BiometricAuth = require('./native/BiometricAuth');
  nativeModules.NotificationManager = require('./native/NotificationManager');
  nativeModules.VideoPlayer = require('./native/VideoPlayer');
  nativeModules.FileManager = require('./native/FileManager');
} catch (error) {
  // Mock modules for web/testing environments
  nativeModules.DownloadManager = null;
  nativeModules.BiometricAuth = null;
  nativeModules.NotificationManager = null;
  nativeModules.VideoPlayer = null;
  nativeModules.FileManager = null;
}

// Check if native module is available
export const isNativeModuleAvailable = moduleName => {
  try {
    return nativeModules[moduleName] !== undefined;
  } catch (error) {
    return false;
  }
};

// Feature capability detection
export const getDeviceCapabilities = () => {
  return {
    biometrics: isNativeModuleAvailable('BiometricAuth'),
    backgroundDownloads: isNativeModuleAvailable('DownloadManager'),
    pushNotifications: isNativeModuleAvailable('NotificationManager'),
    nativeVideoPlayer: isNativeModuleAvailable('VideoPlayer'),
    fileSystem: isNativeModuleAvailable('FileManager'),
    pictureInPicture: Platform.OS === 'ios',
    splitScreen: Platform.OS === 'android' && Platform.Version >= 24,
    haptics: true, // Most modern devices support haptics
    camera: true,
    microphone: true,
    accelerometer: true,
    gyroscope: true,
  };
};

// Performance optimization
export const getPerformanceSettings = () => {
  const capabilities = getDeviceCapabilities();

  return {
    imageQuality: capabilities.highEnd ? 'high' : 'medium',
    animationDuration: capabilities.lowEnd ? 150 : 300,
    cacheStrategy: capabilities.storage > 32 ? 'aggressive' : 'conservative',
    preloadPages: capabilities.ram > 4 ? 3 : 1,
    renderAhead: capabilities.ram > 6 ? 5 : 2,
  };
};

// Offline support
export const offlineFeatures = [
  'unified-library',
  'manga-reader',
  'download-manager',
  'tracking-sync',
];

export const isOfflineSupported = featureId => {
  return offlineFeatures.includes(featureId);
};

// Feature state management for mobile
export const mobileFeatureStates = {
  enabled: new Set(),
  disabled: new Set(),
  settings: new Map(),
  permissions: new Map(),
};

export const requestFeaturePermissions = async featureId => {
  const requiredPermissions = getRequiredPermissions(featureId);
  const grantedPermissions = {};

  for (const permission of requiredPermissions) {
    try {
      // In a real implementation, use react-native-permissions
      const result = await requestPermission(permission);
      grantedPermissions[permission] = result === 'granted';
    } catch (error) {
      grantedPermissions[permission] = false;
    }
  }

  mobileFeatureStates.permissions.set(featureId, grantedPermissions);
  return grantedPermissions;
};

// Mock permission request function
const requestPermission = async _permission => {
  // Mock implementation - in real app, use react-native-permissions
  return 'granted';
};

// Initialize mobile feature states
export const initializeMobileFeatureStates = async () => {
  try {
    // Load saved states from AsyncStorage (React Native only)
    let AsyncStorage;
    try {
      AsyncStorage = require('@react-native-async-storage/async-storage').default;
    } catch (error) {
      // Mock AsyncStorage for non-React Native environments
      AsyncStorage = {
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(),
        removeItem: () => Promise.resolve(),
      };
    }

    const enabledFeatures = await AsyncStorage.getItem('enabledFeatures');
    const disabledFeatures = await AsyncStorage.getItem('disabledFeatures');
    const featureSettings = await AsyncStorage.getItem('featureSettings');

    if (enabledFeatures) {
      mobileFeatureStates.enabled = new Set(JSON.parse(enabledFeatures));
    }

    if (disabledFeatures) {
      mobileFeatureStates.disabled = new Set(JSON.parse(disabledFeatures));
    }

    if (featureSettings) {
      const settings = JSON.parse(featureSettings);
      for (const [featureId, featureSettings] of Object.entries(settings)) {
        mobileFeatureStates.settings.set(featureId, new Map(Object.entries(featureSettings)));
      }
    }

    // Check permissions for all features
    for (const feature of getMobileFeatures()) {
      await requestFeaturePermissions(feature.id);
    }
  } catch (error) {
    console.error('Failed to initialize mobile feature states:', error);
  }
};

// Export platform info
export const platformInfo = (() => {
  try {
    const { Dimensions } = require('react-native');
    return {
      os: Platform.OS,
      version: Platform.Version,
      isTablet:
        Platform.isPad || (Platform.OS === 'android' && Platform.constants?.uiMode === 'tablet'),
      screenSize: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
    };
  } catch (error) {
    // Fallback for non-React Native environments
    return {
      os: 'web',
      version: '1.0',
      isTablet: false,
      screenSize: {
        width: 1920,
        height: 1080,
      },
    };
  }
})();

// Auto-initialize on module load
initializeMobileFeatureStates();
