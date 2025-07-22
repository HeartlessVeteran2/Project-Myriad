        state.isProcessing = false;
        state.error = action.payload as string;
      });

    // Extract Metadata
    builder
      .addCase(extractMetadata.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(extractMetadata.fulfilled, (state, action) => {
        state.isProcessing = false;
        // Metadata extraction result would be used elsewhere
      })
      .addCase(extractMetadata.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });

    // Natural Language Search
    builder
      .addCase(performNaturalLanguageSearch.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(performNaturalLanguageSearch.fulfilled, (state, action) => {
        state.isProcessing = false;
        // Search results would be handled by library slice
      })
      .addCase(performNaturalLanguageSearch.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateSettings,
  setOfflineMode,
  addTranslation,
  clearTranslations,
  setCurrentTranslation,
  clearArtStyleMatches,
  clearRecommendations,
  clearError,
} = aiSlice.actions;

export default aiSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AITranslation, ArtStyleMatch, AIRecommendation, AISettings } from '../../types';
import { AIService } from '../../services/AIService';

export interface AIState {
  translations: AITranslation[];
  artStyleMatches: ArtStyleMatch[];
  recommendations: AIRecommendation[];
  settings: AISettings;
  isProcessing: boolean;
  isInitialized: boolean;
  isOfflineMode: boolean;
  error: string | null;
  currentTranslation: AITranslation | null;
}

const initialState: AIState = {
  translations: [],
  artStyleMatches: [],
  recommendations: [],
  settings: {
    enableOCR: true,
    defaultSourceLanguage: 'jpn',
    defaultTargetLanguage: 'en',
    enableRecommendations: true,
    enableArtStyleMatching: true,
    offlineMode: false,
  },
  isProcessing: false,
  isInitialized: false,
  isOfflineMode: false,
  error: null,
  currentTranslation: null,
};

// Async thunks for AI operations
export const initializeAI = createAsyncThunk(
  'ai/initializeAI',
  async (_, { rejectWithValue }) => {
    try {
      const aiService = AIService.getInstance();
      await aiService.initialize();
      return aiService.isOffline();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const translateText = createAsyncThunk(
  'ai/translateText',
  async (
    { imageBase64, options }: {
      imageBase64: string;
      options?: { language: string; targetLanguage: string; confidence?: number }
    },
    { rejectWithValue }
  ) => {
    try {
      const aiService = AIService.getInstance();
      const translation = await aiService.translateTextOCR(imageBase64, options);
      return translation;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const analyzeArtStyle = createAsyncThunk(
  'ai/analyzeArtStyle',
  async (
    { imageBase64, library }: {
      imageBase64: string;
      library: any[]
    },
    { rejectWithValue }
  ) => {
    try {
      const aiService = AIService.getInstance();
      const matches = await aiService.findSimilarByArtStyle(imageBase64, library);
      return matches;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const extractMetadata = createAsyncThunk(
  'ai/extractMetadata',
  async (imageBase64: string, { rejectWithValue }) => {
    try {
      const aiService = AIService.getInstance();
      const metadata = await aiService.extractMetadataFromCover(imageBase64);
      return metadata;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const performNaturalLanguageSearch = createAsyncThunk(
  'ai/performNaturalLanguageSearch',
  async (
    { query, library }: { query: string; library: any[] },
    { rejectWithValue }
  ) => {
    try {
      const aiService = AIService.getInstance();
      const result = await aiService.naturalLanguageSearch(query, library);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<AISettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOfflineMode = action.payload;
      state.settings.offlineMode = action.payload;
      // Update AI service offline mode
      const aiService = AIService.getInstance();
      aiService.setOfflineMode(action.payload);
    },
    addTranslation: (state, action: PayloadAction<AITranslation>) => {
      state.translations.unshift(action.payload);
      // Keep only last 50 translations
      state.translations = state.translations.slice(0, 50);
    },
    clearTranslations: (state) => {
      state.translations = [];
    },
    setCurrentTranslation: (state, action: PayloadAction<AITranslation | null>) => {
      state.currentTranslation = action.payload;
    },
    clearArtStyleMatches: (state) => {
      state.artStyleMatches = [];
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Initialize AI
    builder
      .addCase(initializeAI.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(initializeAI.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.isInitialized = true;
        state.isOfflineMode = action.payload;
      })
      .addCase(initializeAI.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });

    // Translate Text
    builder
      .addCase(translateText.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(translateText.fulfilled, (state, action) => {
        state.isProcessing = false;
        if (action.payload) {
          state.translations.unshift(action.payload);
          state.translations = state.translations.slice(0, 50);
          state.currentTranslation = action.payload;
        }
      })
      .addCase(translateText.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });

    // Analyze Art Style
    builder
      .addCase(analyzeArtStyle.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(analyzeArtStyle.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.artStyleMatches = action.payload;
      })
      .addCase(analyzeArtStyle.rejected, (state, action) => {
