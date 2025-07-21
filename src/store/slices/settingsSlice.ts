import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Define types
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
}

export interface PerformanceSettings {
  enableHighQualityImages: boolean;
  prefetchContent: boolean;
  maxCacheSize: number; // in MB
  backgroundSyncEnabled: boolean;
}

export interface BehaviorSettings {
  autoUpdateContent: boolean;
  showNotifications: boolean;
  keepScreenOn: boolean;
  defaultContentView: 'grid' | 'list' | 'details';
}

export interface PrivacySettings {
  collectAnalytics: boolean;
  shareUsageData: boolean;
  enableCrashReporting: boolean;
}

export interface SettingsState {
  appearance: AppearanceSettings;
  performance: PerformanceSettings;
  behavior: BehaviorSettings;
  privacy: PrivacySettings;
  lastUpdated: number | null;
}

// Define initial state
const initialState: SettingsState = {
  appearance: {
    theme: 'system',
    accentColor: '#6200ee',
    fontFamily: 'System',
    fontSize: 'medium',
  },
  performance: {
    enableHighQualityImages: true,
    prefetchContent: true,
    maxCacheSize: 1024, // 1GB
    backgroundSyncEnabled: true,
  },
  behavior: {
    autoUpdateContent: true,
    showNotifications: true,
    keepScreenOn: false,
    defaultContentView: 'grid',
  },
  privacy: {
    collectAnalytics: true,
    shareUsageData: false,
    enableCrashReporting: true,
  },
  lastUpdated: null,
};

// Create the slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateAppearance: (state, action: PayloadAction<Partial<AppearanceSettings>>) => {
      state.appearance = { ...state.appearance, ...action.payload };
      state.lastUpdated = Date.now();
    },
    updatePerformance: (state, action: PayloadAction<Partial<PerformanceSettings>>) => {
      state.performance = { ...state.performance, ...action.payload };
      state.lastUpdated = Date.now();
    },
    updateBehavior: (state, action: PayloadAction<Partial<BehaviorSettings>>) => {
      state.behavior = { ...state.behavior, ...action.payload };
      state.lastUpdated = Date.now();
    },
    updatePrivacy: (state, action: PayloadAction<Partial<PrivacySettings>>) => {
      state.privacy = { ...state.privacy, ...action.payload };
      state.lastUpdated = Date.now();
    },
    resetSettings: (state) => {
      return { ...initialState, lastUpdated: Date.now() };
    },
    resetAppearance: (state) => {
      state.appearance = initialState.appearance;
      state.lastUpdated = Date.now();
    },
    resetPerformance: (state) => {
      state.performance = initialState.performance;
      state.lastUpdated = Date.now();
    },
    resetBehavior: (state) => {
      state.behavior = initialState.behavior;
      state.lastUpdated = Date.now();
    },
    resetPrivacy: (state) => {
      state.privacy = initialState.privacy;
      state.lastUpdated = Date.now();
    },
  },
});

// Export actions
export const {
  updateAppearance,
  updatePerformance,
  updateBehavior,
  updatePrivacy,
  resetSettings,
  resetAppearance,
  resetPerformance,
  resetBehavior,
  resetPrivacy,
} = settingsSlice.actions;

// Export selectors
export const selectSettings = (state: RootState) => state.settings;
export const selectAppearance = (state: RootState) => state.settings.appearance;
export const selectPerformance = (state: RootState) => state.settings.performance;
export const selectBehavior = (state: RootState) => state.settings.behavior;
export const selectPrivacy = (state: RootState) => state.settings.privacy;
export const selectTheme = (state: RootState) => state.settings.appearance.theme;

// Export reducer
export default settingsSlice.reducer;