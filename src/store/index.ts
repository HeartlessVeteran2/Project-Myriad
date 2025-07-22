import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import reducers
import userReducer from './slices/userSlice';
import libraryReducer from './slices/librarySlice';
import settingsReducer from './slices/settingsSlice';
import aiReducer from './slices/aiSlice';

// Configure persistence
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'library', 'settings', 'ai'], // Persist all major slices
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  library: libraryReducer,
  settings: settingsReducer,
  ai: aiReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp', 'payload.dateAdded'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates', 'library.stats.lastUpdated', 'ai.translations.timestamp'],
      },
    }),
  devTools: __DEV__,
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;