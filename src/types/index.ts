// Core type definitions for Project Myriad

export interface MangaChapter {
  id: string;
  title: string;
  chapterNumber: number;
  pages: string[];
  readProgress: number;
  isRead: boolean;
  dateAdded: Date;
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
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  library: UserLibrary;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  aiFeatures: {
    ocrTranslation: boolean;
    recommendations: boolean;
    artStyleMatching: boolean;
  };
  readingDirection: 'ltr' | 'rtl' | 'vertical';
  autoSync: boolean;
}

export interface UserLibrary {
  manga: Manga[];
  anime: Anime[];
  favorites: string[];
  watchLater: string[];
  readLater: string[];
  collections: Collection[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  items: string[];
  isPublic: boolean;
  createdAt: Date;
}

export interface AITranslation {
  originalText: string;
  translatedText: string;
  confidence: number;
  language: string;
}

export interface Source {
  id: string;
  name: string;
  baseUrl: string;
  type: 'manga' | 'anime';
  isEnabled: boolean;
}
