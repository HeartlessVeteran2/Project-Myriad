// Core type definitions for Project Myriad

export interface MangaChapter {
  id: string;
  title: string;
  chapterNumber: number;
  pages: string[];
  readProgress: number;
  isRead: boolean;
  /**
   * ISO 8601 date string representing when the chapter was added.
   * Example: "2024-06-10T12:34:56.789Z"
   */
}

export interface Manga {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  chapters: MangaChapter[];
  genres: string[];
  status: 'ongoing' | 'completed' | 'hiatus';
  rating: number;
  tags: string[];
}

export interface AnimeEpisode {
  id: string;
  title: string;
  episodeNumber: number;
  duration: number;
  watchProgress: number;
  isWatched: boolean;
  videoUrl?: string;
  localPath?: string;
  /**
   * ISO 8601 date string representing when the episode was added.
   * Example: "2024-06-10T12:34:56.789Z"
   */
}

export interface Anime {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  episodes: AnimeEpisode[];
  genres: string[];
  status: 'ongoing' | 'completed' | 'upcoming';
  rating: number;
  studio: string;
  tags: string[];
}

export interface User {
  id: string;
  username: string;
  preferences: UserPreferences;
  history: UserHistory;
}

export interface UserPreferences {
  language: string;
  themes: string[];
  autoTranslate: boolean;
  offlineMode: boolean;
  genres: string[];
}

export interface UserHistory {
  mangaRead: string[];
  animeWatched: string[];
  searchHistory: string[];
  recommendations: string[];
}

// AI Core Types
export interface AITranslation {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  boundingBoxes: BoundingBox[];
  /**
   * ISO 8601 date string representing when the translation was created.
   * Example: "2024-06-10T12:34:56.789Z"
   */
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface ArtStyleMatch {
  item: Manga | Anime;
  similarity: number;
  artStyle: string;
  matchingCharacteristics: string[];
}

export interface AIRecommendation {
  item: Manga | Anime;
  score: number;
  reason: string;
  confidence: number;
}

// Browser/Source Types
export interface Source {
  id: string;
  name: string;
  baseUrl: string;
  type: 'manga' | 'anime' | 'both';
  isEnabled: boolean;
  config: SourceConfig;
}

export interface SourceConfig {
  apiKey?: string;
  rateLimit: number;
  searchEndpoint: string;
  streamEndpoint?: string;
  headers: Record<string, string>;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  source: string;
  type: 'manga' | 'anime';
  genres: string[];
  status: string;
  rating?: number;
}

// File System Types
export interface ImportTask {
  id: string;
  files: string[];
  type: 'manga' | 'anime';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  errors: string[];
  /**
   * ISO 8601 date string representing when the task was created.
   * Example: "2024-06-10T12:34:56.789Z"
   */
  createdAt: string;
  /**
   * ISO 8601 date string representing when the task was completed.
   * Example: "2024-06-10T12:34:56.789Z"
}

export interface LibraryStats {
  totalManga: number;
  totalAnime: number;
  totalSize: number;
  /**
   * ISO 8601 date string representing when the library was last updated.
   * Example: "2024-06-10T12:34:56.789Z"
   */
  recentlyAdded: (Manga | Anime)[];
}

// Error Types
export interface AppError {
  id: string;
  type: 'network' | 'storage' | 'ai' | 'ui' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
  timestamp: Date;
  resolved: boolean;
}

// Settings Types
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoTranslate: boolean;
  offlineMode: boolean;
  aiSettings: AISettings;
  storageSettings: StorageSettings;
  sourceSettings: SourceSettings;
}

export interface AISettings {
  enableOCR: boolean;
  defaultSourceLanguage: string;
  defaultTargetLanguage: string;
  enableRecommendations: boolean;
  enableArtStyleMatching: boolean;
  offlineMode: boolean;
}

export interface StorageSettings {
  maxCacheSize: number;
  autoCleanup: boolean;
  compressionLevel: number;
  backupEnabled: boolean;
}

export interface SourceSettings {
  enabledSources: string[];
  defaultSource: string;
  rateLimit: number;
  autoRefresh: boolean;
}
