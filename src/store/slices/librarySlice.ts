import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Define types
export type ContentType = 'manga' | 'anime';
export type ContentStatus = 'reading' | 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read' | 'plan_to_watch';

export interface ContentItem {
  id: string;
  title: string;
  alternativeTitles?: string[];
  type: ContentType;
  path: string;
  coverImage?: string;
  description?: string;
  genres?: string[];
  authors?: string[];
  status: ContentStatus;
  progress: number; // Chapter/episode number
  totalChapters?: number; // Total chapters/episodes if known
  rating?: number; // User rating (1-5)
  lastOpenedAt: number; // Timestamp
  addedAt: number; // Timestamp
  updatedAt: number; // Timestamp
  metadata?: Record<string, any>; // Additional metadata
}

export interface LibraryState {
  items: Record<string, ContentItem>; // Map of id to ContentItem
  collections: Record<string, string[]>; // Map of collection name to array of content ids
  recentlyViewed: string[]; // Array of content ids
  loading: boolean;
  error: string | null;
}

// Define initial state
const initialState: LibraryState = {
  items: {},
  collections: {
    favorites: [],
  },
  recentlyViewed: [],
  loading: false,
  error: null,
};

// Define async thunks
export const importContent = createAsyncThunk(
  'library/importContent',
  async (contentPath: string, { rejectWithValue }) => {
    try {
      // This would be replaced with actual file import logic
      // Simulating content import
      const id = `content_${Date.now()}`;
      return {
        id,
        title: `Imported Content ${id}`,
        type: 'manga' as ContentType,
        path: contentPath,
        status: 'plan_to_read' as ContentStatus,
        progress: 0,
        lastOpenedAt: Date.now(),
        addedAt: Date.now(),
        updatedAt: Date.now(),
      };
    } catch (error) {
      return rejectWithValue('Failed to import content. Please try again.');
    }
  }
);

// Create the slice
const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addContent: (state, action: PayloadAction<ContentItem>) => {
      state.items[action.payload.id] = action.payload;
    },
    updateContent: (state, action: PayloadAction<Partial<ContentItem> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      if (state.items[id]) {
        state.items[id] = { ...state.items[id], ...updates, updatedAt: Date.now() };
      }
    },
    removeContent: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.items[id];
      
      // Remove from collections
      Object.keys(state.collections).forEach(collection => {
        state.collections[collection] = state.collections[collection].filter(itemId => itemId !== id);
      });
      
      // Remove from recently viewed
      state.recentlyViewed = state.recentlyViewed.filter(itemId => itemId !== id);
    },
    addToCollection: (state, action: PayloadAction<{ collectionName: string; contentId: string }>) => {
      const { collectionName, contentId } = action.payload;
      if (!state.collections[collectionName]) {
        state.collections[collectionName] = [];
      }
      if (!state.collections[collectionName].includes(contentId)) {
        state.collections[collectionName].push(contentId);
      }
    },
    removeFromCollection: (state, action: PayloadAction<{ collectionName: string; contentId: string }>) => {
      const { collectionName, contentId } = action.payload;
      if (state.collections[collectionName]) {
        state.collections[collectionName] = state.collections[collectionName].filter(id => id !== contentId);
      }
    },
    createCollection: (state, action: PayloadAction<string>) => {
      const collectionName = action.payload;
      if (!state.collections[collectionName]) {
        state.collections[collectionName] = [];
      }
    },
    deleteCollection: (state, action: PayloadAction<string>) => {
      const collectionName = action.payload;
      if (collectionName !== 'favorites') { // Prevent deletion of default collections
        delete state.collections[collectionName];
      }
    },
    updateRecentlyViewed: (state, action: PayloadAction<string>) => {
      const contentId = action.payload;
      // Remove if exists
      state.recentlyViewed = state.recentlyViewed.filter(id => id !== contentId);
      // Add to front
      state.recentlyViewed.unshift(contentId);
      // Limit to 20 items
      state.recentlyViewed = state.recentlyViewed.slice(0, 20);
      
      // Update last opened timestamp
      if (state.items[contentId]) {
        state.items[contentId].lastOpenedAt = Date.now();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(importContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importContent.fulfilled, (state, action) => {
        state.items[action.payload.id] = action.payload;
        state.loading = false;
      })
      .addCase(importContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  addContent,
  updateContent,
  removeContent,
  addToCollection,
  removeFromCollection,
  createCollection,
  deleteCollection,
  updateRecentlyViewed,
} = librarySlice.actions;

// Export selectors
export const selectLibrary = (state: RootState) => state.library;
export const selectAllContent = (state: RootState) => Object.values(state.library.items);
export const selectContentById = (id: string) => (state: RootState) => state.library.items[id];
export const selectContentByType = (type: ContentType) => (state: RootState) => 
  Object.values(state.library.items).filter(item => item.type === type);
export const selectCollection = (collectionName: string) => (state: RootState) => {
  const collection = state.library.collections[collectionName] || [];
  return collection.map(id => state.library.items[id]).filter(Boolean);
};
export const selectRecentlyViewed = (state: RootState) => {
  return state.library.recentlyViewed.map(id => state.library.items[id]).filter(Boolean);
};

// Export reducer
export default librarySlice.reducer;