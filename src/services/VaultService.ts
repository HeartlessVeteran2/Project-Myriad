/**
 * The Vault - Local Media Engine
 * Handles offline-first management with smart caching and metadata scraping
 */

import RNFS from 'react-native-fs';
import { zip, unzip } from 'react-native-zip-archive';
import { Manga, Anime, MangaChapter, AnimeEpisode } from '../types';
import { errorService, ErrorType, ErrorSeverity } from './ErrorService';
import { loggingService } from './LoggingService';

// File type definitions
export type MangaFormat = 'cbz' | 'cbr' | 'zip' | 'rar' | 'pdf';
export type AnimeFormat = 'mp4' | 'mkv' | 'avi' | 'webm';

// File system structure
export interface FileSystemStructure {
  rootPath: string;
  mangaPath: string;
  animePath: string;
  cachePath: string;
  metadataPath: string;
  tempPath: string;
}

export class VaultService {
  private static instance: VaultService;
  private fileSystem: FileSystemStructure;
  private readonly TAG = 'VaultService';

  private constructor() {
    const rootPath = `${RNFS.DocumentDirectoryPath}/ProjectMyriad`;
    this.fileSystem = {
      rootPath,
      mangaPath: `${rootPath}/manga`,
      animePath: `${rootPath}/anime`,
      cachePath: `${rootPath}/cache`,
      metadataPath: `${rootPath}/metadata`,
      tempPath: `${rootPath}/temp`,
    };
  }

  public static getInstance(): VaultService {
    if (!VaultService.instance) {
      VaultService.instance = new VaultService();
    }
    return VaultService.instance;
  }

  /**
   * Initialize the vault file system structure
   */
  async initializeVault(): Promise<void> {
    try {
      loggingService.info(this.TAG, 'Initializing vault file system');

      // Create root directory if it doesn't exist
      const rootExists = await RNFS.exists(this.fileSystem.rootPath);
      if (!rootExists) {
        await RNFS.mkdir(this.fileSystem.rootPath);
      }

      // Create required subdirectories
      const directories = [
        this.fileSystem.mangaPath,
        this.fileSystem.animePath,
        this.fileSystem.cachePath,
        this.fileSystem.metadataPath,
        this.fileSystem.tempPath,
        // Create subdirectories for organizing content by type
        `${this.fileSystem.mangaPath}/ongoing`,
        `${this.fileSystem.mangaPath}/completed`,
        `${this.fileSystem.mangaPath}/collections`,
        `${this.fileSystem.animePath}/series`,
        `${this.fileSystem.animePath}/movies`,
        `${this.fileSystem.animePath}/collections`,
      ];

      for (const dir of directories) {
        const exists = await RNFS.exists(dir);
        if (!exists) {
          await RNFS.mkdir(dir);
          loggingService.debug(this.TAG, `Created directory: ${dir}`);
        }
      }

      loggingService.info(this.TAG, 'Vault initialization complete');
    } catch (error) {
      const errorMessage = 'Failed to initialize Vault';
      loggingService.error(this.TAG, errorMessage, error);
      errorService.captureError(error as Error, ErrorType.STORAGE, ErrorSeverity.ERROR, {
        component: this.TAG,
        action: 'initializeVault',
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Import a manga file into the vault
   * @param filePath Path to the manga file
   * @param options Optional import options
   */
  async importManga(
    filePath: string, 
    options: { 
      extractContent?: boolean; 
      generateThumbnail?: boolean;
      collection?: string;
    } = {}
  ): Promise<Manga | null> {
    try {
      loggingService.info(this.TAG, `Importing manga: ${filePath}`);

      // Extract file information
      const fileName = filePath.split('/').pop() || '';
      const fileExt = fileName.split('.').pop()?.toLowerCase() as MangaFormat;
      const mangaId = this.generateId();

      // Determine target directory based on collection or default to 'completed'
      const targetDir = options.collection 
        ? `${this.fileSystem.mangaPath}/collections/${options.collection}`
        : `${this.fileSystem.mangaPath}/completed`;

      // Create directory for this manga if it doesn't exist
      const mangaPath = `${targetDir}/${mangaId}`;
      await RNFS.mkdir(mangaPath);

      // Create subdirectories
      await RNFS.mkdir(`${mangaPath}/content`);
      await RNFS.mkdir(`${mangaPath}/thumbnails`);

      // Copy original file
      const targetFilePath = `${mangaPath}/${fileName}`;
      await RNFS.copyFile(filePath, targetFilePath);

      // Extract content if requested
      let coverImagePath = '';
      if (options.extractContent && (fileExt === 'cbz' || fileExt === 'zip')) {
        const extractPath = `${mangaPath}/content`;
        await unzip(targetFilePath, extractPath);

        // Find image files in the extracted content
        const files = await RNFS.readDir(extractPath);
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
        ).sort((a, b) => a.name.localeCompare(b.name));

        // Use the first image as cover if available
        if (imageFiles.length > 0 && options.generateThumbnail) {
          coverImagePath = imageFiles[0].path;
          await RNFS.copyFile(coverImagePath, `${mangaPath}/thumbnails/cover.jpg`);
          coverImagePath = `${mangaPath}/thumbnails/cover.jpg`;
        }

        // Create a chapter from the extracted content
        const chapter: MangaChapter = {
          id: this.generateId(),
          title: 'Chapter 1',
          chapterNumber: 1,
          pages: imageFiles.map(file => file.path),
          readProgress: 0,
          isRead: false,
          dateAdded: new Date(),
        };

        // Create manga metadata
        const manga: Manga = {
          id: mangaId,
          title: fileName.replace(/\.(cbz|cbr|zip|rar|pdf)$/i, ''),
          author: 'Unknown',
          description: '',
          coverImage: coverImagePath,
          chapters: [chapter],
          genres: [],
          status: 'completed',
          rating: 0,
          tags: []
        };

        // Save metadata
        await this.saveMangaMetadata(manga);

        loggingService.info(this.TAG, `Successfully imported manga: ${manga.title}`);
        return manga;
      } else {
        // Create basic manga metadata without extraction
        const manga: Manga = {
          id: mangaId,
          title: fileName.replace(/\.(cbz|cbr|zip|rar|pdf)$/i, ''),
          author: 'Unknown',
          description: '',
          coverImage: '',
          chapters: [],
          genres: [],
          status: 'completed',
          rating: 0,
          tags: []
        };

        // Save metadata
        await this.saveMangaMetadata(manga);

        loggingService.info(this.TAG, `Successfully imported manga: ${manga.title} (without extraction)`);
        return manga;
      }
    } catch (error) {
      const errorMessage = `Failed to import manga: ${error}`;
      loggingService.error(this.TAG, errorMessage, error);
      errorService.captureError(error as Error, ErrorType.STORAGE, ErrorSeverity.ERROR, {
        component: this.TAG,
        action: 'importManga',
      });
      return null;
    }
  }

  /**
   * Import an anime file into the vault
   * @param filePath Path to the anime file
   * @param options Optional import options
   */
  async importAnime(
    filePath: string,
    options: {
      generateThumbnail?: boolean;
      collection?: string;
      isMovie?: boolean;
    } = {}
  ): Promise<Anime | null> {
    try {
      loggingService.info(this.TAG, `Importing anime: ${filePath}`);

      // Extract file information
      const fileName = filePath.split('/').pop() || '';
      const fileExt = fileName.split('.').pop()?.toLowerCase() as AnimeFormat;
      const animeId = this.generateId();

      // Determine target directory based on type and collection
      let targetDir: string;
      if (options.collection) {
        targetDir = `${this.fileSystem.animePath}/collections/${options.collection}`;
      } else if (options.isMovie) {
        targetDir = `${this.fileSystem.animePath}/movies`;
      } else {
        targetDir = `${this.fileSystem.animePath}/series`;
      }

      // Create directory for this anime if it doesn't exist
      const animePath = `${targetDir}/${animeId}`;
      await RNFS.mkdir(animePath);

      // Create subdirectories
      await RNFS.mkdir(`${animePath}/content`);
      await RNFS.mkdir(`${animePath}/thumbnails`);

      // Copy original file
      const targetFilePath = `${animePath}/content/${fileName}`;
      await RNFS.copyFile(filePath, targetFilePath);

      // Create an episode from the file
      const episode: AnimeEpisode = {
        id: this.generateId(),
        title: options.isMovie ? 'Movie' : 'Episode 1',
        episodeNumber: 1,
        duration: 0, // Would be extracted from the video file
        watchProgress: 0,
        isWatched: false,
        localPath: targetFilePath,
      };

      // Create anime metadata
      const anime: Anime = {
        id: animeId,
        title: fileName.replace(/\.(mp4|mkv|avi|webm)$/i, ''),
        description: '',
        coverImage: '', // Would be generated from the video file
        episodes: [episode],
        genres: [],
        status: 'completed',
        rating: 0,
        studio: 'Unknown',
        tags: []
      };

      // Save metadata
      await this.saveAnimeMetadata(anime);

      loggingService.info(this.TAG, `Successfully imported anime: ${anime.title}`);
      return anime;
    } catch (error) {
      const errorMessage = `Failed to import anime: ${error}`;
      loggingService.error(this.TAG, errorMessage, error);
      errorService.captureError(error as Error, ErrorType.STORAGE, ErrorSeverity.ERROR, {
        component: this.TAG,
        action: 'importAnime',
      });
      return null;
    }
  }

  /**
   * Imports manga or anime files into the Vault
   * Supports batch import and file integrity verification
   */
  async importFiles(files: string[], type: 'manga' | 'anime'): Promise<boolean> {
    try {
      const destPath = type === 'manga' ? this.fileSystem.mangaPath : this.fileSystem.animePath;
      await RNFS.mkdir(destPath);
      for (const file of files) {
        const fileName = file.split('/').pop();
        if (!fileName) continue;
        const destFile = `${destPath}/${fileName}`;
        await RNFS.copyFile(file, destFile);
        // TODO: Add file integrity verification
        loggingService.info(this.TAG, `Imported file: ${fileName}`);
      }
      return true;
    } catch (error) {
      errorService.handleError({
        type: ErrorType.File,
        severity: ErrorSeverity.High,
        message: 'Failed to import files',
        details: error,
      });
      return false;
    }
  }

  /**
   * Scans and returns the local library (manga/anime)
   */
  async getLibrary(type: 'manga' | 'anime'): Promise<(Manga | Anime)[]> {
    try {
      const path = type === 'manga' ? this.fileSystem.mangaPath : this.fileSystem.animePath;
      const files = await RNFS.readDir(path);
      // TODO: Add metadata extraction and organization
      return files.map((file) => ({
        id: file.name,
        title: file.name,
        path: file.path,
        // ...other metadata
      }));
    } catch (error) {
      errorService.handleError({
        type: ErrorType.File,
        severity: ErrorSeverity.Medium,
        message: 'Failed to scan library',
        details: error,
      });
      return [];
    }
  }

  /**
   * Searches the local library by title
   */
  async searchLibrary(query: string, type: 'manga' | 'anime'): Promise<(Manga | Anime)[]> {
    const library = await this.getLibrary(type);
    return library.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }

  /**
   * TODO: Add metadata scraping, batch export, file integrity verification, cleanup utilities
   */

  /**
   * Get the local library content
   */
  async getLocalLibrary(): Promise<{ manga: Manga[], anime: Anime[] }> {
    try {
      loggingService.info(this.TAG, 'Loading local library');

      const manga: Manga[] = [];
      const anime: Anime[] = [];

      // Load manga from metadata directory
      const mangaMetadataPath = `${this.fileSystem.metadataPath}/manga`;
      if (await RNFS.exists(mangaMetadataPath)) {
        const mangaFiles = await RNFS.readDir(mangaMetadataPath);
        for (const file of mangaFiles) {
          if (file.name.endsWith('.json')) {
            const content = await RNFS.readFile(file.path, 'utf8');
            const mangaData = JSON.parse(content) as Manga;
            manga.push(mangaData);
          }
        }
      }

      // Load anime from metadata directory
      const animeMetadataPath = `${this.fileSystem.metadataPath}/anime`;
      if (await RNFS.exists(animeMetadataPath)) {
        const animeFiles = await RNFS.readDir(animeMetadataPath);
        for (const file of animeFiles) {
          if (file.name.endsWith('.json')) {
            const content = await RNFS.readFile(file.path, 'utf8');
            const animeData = JSON.parse(content) as Anime;
            anime.push(animeData);
          }
        }
      }

      loggingService.info(this.TAG, `Loaded ${manga.length} manga and ${anime.length} anime from local library`);
      return { manga, anime };
    } catch (error) {
      const errorMessage = 'Failed to get local library';
      loggingService.error(this.TAG, errorMessage, error);
      errorService.captureError(error as Error, ErrorType.STORAGE, ErrorSeverity.ERROR, {
        component: this.TAG,
        action: 'getLocalLibrary',
      });
      return { manga: [], anime: [] };
    }
  }

  /**
   * Save manga metadata to the filesystem
   */
  private async saveMangaMetadata(manga: Manga): Promise<void> {
    try {
      const metadataDir = `${this.fileSystem.metadataPath}/manga`;
      if (!await RNFS.exists(metadataDir)) {
        await RNFS.mkdir(metadataDir);
      }

      const metadataPath = `${metadataDir}/${manga.id}.json`;
      await RNFS.writeFile(metadataPath, JSON.stringify(manga, null, 2), 'utf8');

      loggingService.debug(this.TAG, `Saved metadata for manga: ${manga.title}`);
    } catch (error) {
      loggingService.error(this.TAG, `Failed to save manga metadata: ${error}`);
      throw error;
    }
  }

  /**
   * Save anime metadata to the filesystem
   */
  private async saveAnimeMetadata(anime: Anime): Promise<void> {
    try {
      const metadataDir = `${this.fileSystem.metadataPath}/anime`;
      if (!await RNFS.exists(metadataDir)) {
        await RNFS.mkdir(metadataDir);
      }

      const metadataPath = `${metadataDir}/${anime.id}.json`;
      await RNFS.writeFile(metadataPath, JSON.stringify(anime, null, 2), 'utf8');

      loggingService.debug(this.TAG, `Saved metadata for anime: ${anime.title}`);
    } catch (error) {
      loggingService.error(this.TAG, `Failed to save anime metadata: ${error}`);
      throw error;
    }
  }

  /**
   * Delete manga from the vault
   */
  async deleteManga(mangaId: string): Promise<boolean> {
    try {
      // Find manga in all possible locations
      const locations = [
        `${this.fileSystem.mangaPath}/ongoing/${mangaId}`,
        `${this.fileSystem.mangaPath}/completed/${mangaId}`,
      ];

      // Also check collections
      const collectionsPath = `${this.fileSystem.mangaPath}/collections`;
      if (await RNFS.exists(collectionsPath)) {
        const collections = await RNFS.readDir(collectionsPath);
        for (const collection of collections) {
          locations.push(`${collection.path}/${mangaId}`);
        }
      }

      // Delete manga directory if found
      let deleted = false;
      for (const location of locations) {
        if (await RNFS.exists(location)) {
          await RNFS.unlink(location);
          deleted = true;
          break;
        }
      }

      // Delete metadata
      const metadataPath = `${this.fileSystem.metadataPath}/manga/${mangaId}.json`;
      if (await RNFS.exists(metadataPath)) {
        await RNFS.unlink(metadataPath);
        deleted = true;
      }

      if (deleted) {
        loggingService.info(this.TAG, `Deleted manga with ID: ${mangaId}`);
      } else {
        loggingService.warn(this.TAG, `Manga with ID ${mangaId} not found for deletion`);
      }

      return deleted;
    } catch (error) {
      loggingService.error(this.TAG, `Failed to delete manga: ${error}`);
      errorService.captureError(error as Error, ErrorType.STORAGE, ErrorSeverity.ERROR, {
        component: this.TAG,
        action: 'deleteManga',
        data: { mangaId },
      });
      return false;
    }
  }

  /**
   * Delete anime from the vault
   */
  async deleteAnime(animeId: string): Promise<boolean> {
    try {
      // Find anime in all possible locations
      const locations = [
        `${this.fileSystem.animePath}/series/${animeId}`,
        `${this.fileSystem.animePath}/movies/${animeId}`,
      ];

      // Also check collections
      const collectionsPath = `${this.fileSystem.animePath}/collections`;
      if (await RNFS.exists(collectionsPath)) {
        const collections = await RNFS.readDir(collectionsPath);
        for (const collection of collections) {
          locations.push(`${collection.path}/${animeId}`);
        }
      }

      // Delete anime directory if found
      let deleted = false;
      for (const location of locations) {
        if (await RNFS.exists(location)) {
          await RNFS.unlink(location);
          deleted = true;
          break;
        }
      }

      // Delete metadata
      const metadataPath = `${this.fileSystem.metadataPath}/anime/${animeId}.json`;
      if (await RNFS.exists(metadataPath)) {
        await RNFS.unlink(metadataPath);
        deleted = true;
      }

      if (deleted) {
        loggingService.info(this.TAG, `Deleted anime with ID: ${animeId}`);
      } else {
        loggingService.warn(this.TAG, `Anime with ID ${animeId} not found for deletion`);
      }

      return deleted;
    } catch (error) {
      loggingService.error(this.TAG, `Failed to delete anime: ${error}`);
      errorService.captureError(error as Error, ErrorType.STORAGE, ErrorSeverity.ERROR, {
        component: this.TAG,
        action: 'deleteAnime',
        data: { animeId },
      });
      return false;
    }
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
