    setFilters: (state, action: PayloadAction<Partial<LibraryState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
export interface LibraryState {
    clearSearchResults: (state) => {
      state.searchResults = [];
    status: string[];
    updateMangaProgress: (state, action: PayloadAction<{ mangaId: string; chapterId: string; progress: number }>) => {
      const manga = state.manga.find(m => m.id === action.payload.mangaId);
      if (manga) {
        const chapter = manga.chapters.find(c => c.id === action.payload.chapterId);
        if (chapter) {
          chapter.readProgress = action.payload.progress;
          if (action.payload.progress >= 100) {
            chapter.isRead = true;
          }
        }
  },
  importTasks: [],
    updateAnimeProgress: (state, action: PayloadAction<{ animeId: string; episodeId: string; progress: number }>) => {
      const anime = state.anime.find(a => a.id === action.payload.animeId);
      if (anime) {
        const episode = anime.episodes.find(e => e.id === action.payload.episodeId);
        if (episode) {
          episode.watchProgress = action.payload.progress;
          if (action.payload.progress >= 100) {
            episode.isWatched = true;
          }
        }
};

    addImportTask: (state, action: PayloadAction<ImportTask>) => {
      state.importTasks.push(action.payload);
    },
    updateImportTask: (state, action: PayloadAction<{ id: string; updates: Partial<ImportTask> }>) => {
      const task = state.importTasks.find(t => t.id === action.payload.id);
      if (task) {
        Object.assign(task, action.payload.updates);
);
    },
    removeImportTask: (state, action: PayloadAction<string>) => {
      state.importTasks = state.importTasks.filter(t => t.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;

export const importManga = createAsyncThunk(
  'library/importManga',
    // Load Library
  async (
      .addCase(loadLibrary.pending, (state) => {
        state.isLoading = true;
  ) => {
    try {
      .addCase(loadLibrary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.manga = action.payload.manga;
        state.anime = action.payload.anime;
        state.stats = {
          totalManga: action.payload.manga.length,
          totalAnime: action.payload.anime.length,
          totalSize: 0, // Would be calculated
          lastUpdated: new Date(),
          recentlyAdded: [...action.payload.manga, ...action.payload.anime]
            .sort((a, b) => new Date(b.chapters?.[0]?.dateAdded || b.episodes?.[0]?.dateAdded || 0).getTime() -
                          new Date(a.chapters?.[0]?.dateAdded || a.episodes?.[0]?.dateAdded || 0).getTime())
            .slice(0, 10),
        };
    } catch (error: any) {
      .addCase(loadLibrary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Import Manga
    builder
      .addCase(importManga.pending, (state) => {
        state.isImporting = true;
        state.error = null;
      })
      .addCase(importManga.fulfilled, (state, action) => {
        state.isImporting = false;
        if (action.payload) {
          state.manga.push(action.payload);
          state.stats.totalManga += 1;
          state.stats.recentlyAdded.unshift(action.payload);
          state.stats.recentlyAdded = state.stats.recentlyAdded.slice(0, 10);
        }
      })
      .addCase(importManga.rejected, (state, action) => {
        state.isImporting = false;
        state.error = action.payload as string;
      });

    // Import Anime
    builder
      .addCase(importAnime.pending, (state) => {
        state.isImporting = true;
        state.error = null;
      })
      .addCase(importAnime.fulfilled, (state, action) => {
        state.isImporting = false;
        if (action.payload) {
          state.anime.push(action.payload);
          state.stats.totalAnime += 1;
          state.stats.recentlyAdded.unshift(action.payload);
          state.stats.recentlyAdded = state.stats.recentlyAdded.slice(0, 10);
        }
      })
      .addCase(importAnime.rejected, (state, action) => {
        state.isImporting = false;
        state.error = action.payload as string;
      });

    // Delete Manga
    builder
      .addCase(deleteManga.fulfilled, (state, action) => {
        state.manga = state.manga.filter(m => m.id !== action.payload);
        state.stats.totalManga -= 1;
        state.stats.recentlyAdded = state.stats.recentlyAdded.filter(item => item.id !== action.payload);
      })
      .addCase(deleteManga.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete Anime
    builder
      .addCase(deleteAnime.fulfilled, (state, action) => {
        state.anime = state.anime.filter(a => a.id !== action.payload);
        state.stats.totalAnime -= 1;
        state.stats.recentlyAdded = state.stats.recentlyAdded.filter(item => item.id !== action.payload);
      })
      .addCase(deleteAnime.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Generate Recommendations
    builder
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Search Library
    builder
      .addCase(searchLibrary.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(searchLibrary.rejected, (state, action) => {
  }
);

export const importAnime = createAsyncThunk(
  'library/importAnime',
    { filePath, options }: { filePath: string; options?: any },
  setFilters,
  clearSearchResults,
  updateMangaProgress,
  updateAnimeProgress,
  addImportTask,
  updateImportTask,
  removeImportTask,
  clearError,
    }
  }
    }
  }
);

export const deleteAnime = createAsyncThunk(
  'library/deleteAnime',
  async (animeId: string, { rejectWithValue }) => {
    try {
      const vaultService = VaultService.getInstance();
      const success = await vaultService.deleteAnime(animeId);
      if (success) {
        return animeId;
      } else {
        throw new Error('Failed to delete anime');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateRecommendations = createAsyncThunk(
  'library/generateRecommendations',
  async (
    { userHistory, preferences }: { userHistory: (Manga | Anime)[]; preferences: string[] },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { library: LibraryState };
      const aiService = AIService.getInstance();
      const library = [...state.library.manga, ...state.library.anime];
      const recommendations = await aiService.generateRecommendations(
        userHistory,
        preferences,
        library
      );
      return recommendations;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchLibrary = createAsyncThunk(
  'library/searchLibrary',
  async (query: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { library: LibraryState };
      const aiService = AIService.getInstance();
      const library = [...state.library.manga, ...state.library.anime];

      // Use natural language search if query is complex
      if (query.split(' ').length > 2) {
        const nlResult = await aiService.naturalLanguageSearch(query, library);
        return nlResult.results;
      } else {
        // Simple text search
        const results = library.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
        );
        return results;
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
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