// Extension system for dynamic content sources and features
import fs from 'fs/promises';
import path from 'path';
import { EventEmitter } from 'events';

export class ExtensionManager extends EventEmitter {
  constructor() {
    super();
    this.extensions = new Map(); // extensionId -> extension instance
    this.sources = new Map(); // sourceId -> source info
    this.extensionsPath = './extensions';
    this.loadedExtensions = new Set();
  }

  // Load all extensions from the extensions directory
  async loadExtensions() {
    try {
      await fs.mkdir(this.extensionsPath, { recursive: true });
      const extensionDirs = await fs.readdir(this.extensionsPath);
      
      for (const dir of extensionDirs) {
        const extensionPath = path.join(this.extensionsPath, dir);
        const stat = await fs.stat(extensionPath);
        
        if (stat.isDirectory()) {
          await this.loadExtension(dir);
        }
      }
      
      this.emit('extensionsLoaded', this.extensions.size);
      return Array.from(this.extensions.values());
    } catch (error) {
      console.error('Failed to load extensions:', error);
      return [];
    }
  }

  // Load a specific extension
  async loadExtension(extensionId) {
    try {
      const extensionPath = path.join(this.extensionsPath, extensionId);
      const manifestPath = path.join(extensionPath, 'manifest.json');
      
      // Check if manifest exists
      const manifestData = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestData);
      
      // Validate manifest
      if (!this.validateManifest(manifest)) {
        throw new Error('Invalid extension manifest');
      }
      
      // Create extension instance
      const extension = {
        id: extensionId,
        manifest: manifest,
        path: extensionPath,
        loadedAt: new Date(),
        active: true,
        sources: manifest.sources || [],
        features: manifest.features || [],
        api: this.createExtensionAPI(extensionId)
      };
      
      this.extensions.set(extensionId, extension);
      this.loadedExtensions.add(extensionId);
      
      // Register sources
      if (manifest.sources) {
        for (const source of manifest.sources) {
          this.registerSource(extensionId, source);
        }
      }
      
      this.emit('extensionLoaded', extension);
      return extension;
    } catch (error) {
      console.error(`Failed to load extension ${extensionId}:`, error);
      return null;
    }
  }

  // Validate extension manifest
  validateManifest(manifest) {
    const required = ['name', 'version', 'author'];
    return required.every(field => manifest[field]);
  }

  // Register a content source
  registerSource(extensionId, source) {
    const sourceId = `${extensionId}_${source.id}`;
    
    const sourceInfo = {
      id: sourceId,
      extensionId: extensionId,
      name: source.name,
      type: source.type, // 'manga', 'anime', 'novel'
      baseUrl: source.baseUrl,
      language: source.language || 'en',
      nsfw: source.nsfw || false,
      capabilities: source.capabilities || [],
      rateLimits: source.rateLimits || { requestsPerMinute: 60 },
      headers: source.headers || {},
      searchEndpoints: source.searchEndpoints || {},
      detailsEndpoints: source.detailsEndpoints || {},
      active: true,
      stats: {
        requests: 0,
        successRate: 100,
        avgResponseTime: 0,
        lastUsed: null
      }
    };
    
    this.sources.set(sourceId, sourceInfo);
    this.emit('sourceRegistered', sourceInfo);
  }

  // Get all available sources
  getSources(filter = {}) {
    let sources = Array.from(this.sources.values());
    
    if (filter.type) {
      sources = sources.filter(source => source.type === filter.type);
    }
    
    if (filter.language) {
      sources = sources.filter(source => source.language === filter.language);
    }
    
    if (filter.nsfw !== undefined) {
      sources = sources.filter(source => source.nsfw === filter.nsfw);
    }
    
    if (filter.active !== undefined) {
      sources = sources.filter(source => source.active === filter.active);
    }
    
    return sources.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Search content across sources
  async searchContent(query, options = {}) {
    const sources = this.getSources({
      type: options.type,
      active: true
    });
    
    const results = [];
    const searchPromises = sources.map(async (source) => {
      try {
        const sourceResults = await this.searchInSource(source, query, options);
        return sourceResults.map(result => ({
          ...result,
          source: source.name,
          sourceId: source.id
        }));
      } catch (error) {
        console.error(`Search failed for source ${source.name}:`, error);
        return [];
      }
    });
    
    const allResults = await Promise.all(searchPromises);
    return allResults.flat().slice(0, options.limit || 50);
  }

  // Search in a specific source (mock implementation)
  async searchInSource(source, query, options = {}) {
    // Update stats
    source.stats.requests++;
    source.stats.lastUsed = new Date();
    
    // Mock search results based on source type
    const mockResults = this.generateMockResults(source, query, options);
    
    return mockResults;
  }

  // Generate mock search results
  generateMockResults(source, query, options) {
    const baseResults = {
      manga: [
        { id: '1', title: `${query} Manga 1`, chapters: 245, status: 'ongoing', rating: 8.5 },
        { id: '2', title: `${query} Chronicles`, chapters: 156, status: 'completed', rating: 9.1 },
        { id: '3', title: `Ultimate ${query}`, chapters: 89, status: 'ongoing', rating: 7.8 }
      ],
      anime: [
        { id: '1', title: `${query} Animation`, episodes: 24, status: 'completed', rating: 8.7 },
        { id: '2', title: `${query} Series`, episodes: 12, status: 'ongoing', rating: 9.0 },
        { id: '3', title: `${query} Adventure`, episodes: 52, status: 'completed', rating: 8.3 }
      ],
      novel: [
        { id: '1', title: `${query} Light Novel`, volumes: 15, status: 'ongoing', rating: 8.9 },
        { id: '2', title: `The ${query} Chronicles`, volumes: 8, status: 'completed', rating: 9.2 },
        { id: '3', title: `${query} Academy`, volumes: 12, status: 'ongoing', rating: 8.1 }
      ]
    };
    
    return baseResults[source.type] || [];
  }

  // Get content details from source
  async getContentDetails(sourceId, contentId) {
    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error('Source not found');
    }
    
    // Update stats
    source.stats.requests++;
    source.stats.lastUsed = new Date();
    
    // Mock content details
    return {
      id: contentId,
      source: source.name,
      title: `Content ${contentId}`,
      description: 'Detailed description of the content...',
      genres: ['Action', 'Adventure', 'Fantasy'],
      author: 'Sample Author',
      artist: 'Sample Artist',
      status: 'ongoing',
      rating: 8.5,
      coverImage: '/api/placeholder/cover.jpg',
      chapters: source.type === 'manga' ? 150 : undefined,
      episodes: source.type === 'anime' ? 24 : undefined,
      volumes: source.type === 'novel' ? 10 : undefined,
      lastUpdated: new Date(),
      tags: ['popular', 'trending'],
      alternativeTitles: [`Alt Title for ${contentId}`]
    };
  }

  // Create extension API for extensions to use
  createExtensionAPI(extensionId) {
    return {
      // Storage API
      storage: {
        get: (key) => this.getExtensionData(extensionId, key),
        set: (key, value) => this.setExtensionData(extensionId, key, value),
        remove: (key) => this.removeExtensionData(extensionId, key)
      },
      
      // HTTP client with rate limiting
      http: {
        get: (url, options) => this.makeRequest(extensionId, 'GET', url, options),
        post: (url, data, options) => this.makeRequest(extensionId, 'POST', url, { ...options, data })
      },
      
      // Logging
      log: {
        info: (message) => console.log(`[${extensionId}] ${message}`),
        warn: (message) => console.warn(`[${extensionId}] ${message}`),
        error: (message) => console.error(`[${extensionId}] ${message}`)
      },
      
      // Events
      events: {
        emit: (event, data) => this.emit(`extension:${extensionId}:${event}`, data),
        on: (event, handler) => this.on(`extension:${extensionId}:${event}`, handler)
      }
    };
  }

  // Extension data storage
  extensionData = new Map();

  getExtensionData(extensionId, key) {
    const extensionStorage = this.extensionData.get(extensionId) || new Map();
    return extensionStorage.get(key);
  }

  setExtensionData(extensionId, key, value) {
    if (!this.extensionData.has(extensionId)) {
      this.extensionData.set(extensionId, new Map());
    }
    this.extensionData.get(extensionId).set(key, value);
  }

  removeExtensionData(extensionId, key) {
    const extensionStorage = this.extensionData.get(extensionId);
    if (extensionStorage) {
      extensionStorage.delete(key);
    }
  }

  // HTTP request with rate limiting
  async makeRequest(extensionId, method, url, options = {}) {
    // Mock HTTP request
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    
    return {
      status: 200,
      data: `Mock response for ${method} ${url}`,
      headers: {}
    };
  }

  // Enable/disable extension
  toggleExtension(extensionId, active) {
    const extension = this.extensions.get(extensionId);
    if (extension) {
      extension.active = active;
      
      // Update source statuses
      extension.sources.forEach(source => {
        const sourceId = `${extensionId}_${source.id}`;
        const sourceInfo = this.sources.get(sourceId);
        if (sourceInfo) {
          sourceInfo.active = active;
        }
      });
      
      this.emit('extensionToggled', { extensionId, active });
      return true;
    }
    return false;
  }

  // Unload extension
  unloadExtension(extensionId) {
    const extension = this.extensions.get(extensionId);
    if (extension) {
      // Remove sources
      extension.sources.forEach(source => {
        const sourceId = `${extensionId}_${source.id}`;
        this.sources.delete(sourceId);
      });
      
      // Clean up extension data
      this.extensionData.delete(extensionId);
      this.extensions.delete(extensionId);
      this.loadedExtensions.delete(extensionId);
      
      this.emit('extensionUnloaded', extension);
      return true;
    }
    return false;
  }

  // Get extension statistics
  getExtensionStats(extensionId) {
    const extension = this.extensions.get(extensionId);
    if (!extension) return null;
    
    const sources = extension.sources.map(source => {
      const sourceId = `${extensionId}_${source.id}`;
      return this.sources.get(sourceId);
    }).filter(Boolean);
    
    return {
      extension: extension.manifest,
      active: extension.active,
      loadedAt: extension.loadedAt,
      sourcesCount: sources.length,
      totalRequests: sources.reduce((sum, s) => sum + s.stats.requests, 0),
      avgSuccessRate: sources.length > 0 
        ? sources.reduce((sum, s) => sum + s.stats.successRate, 0) / sources.length 
        : 0
    };
  }

  // Get all extensions
  getExtensions() {
    return Array.from(this.extensions.values());
  }

  // Get system statistics
  getSystemStats() {
    return {
      totalExtensions: this.extensions.size,
      activeExtensions: Array.from(this.extensions.values()).filter(e => e.active).length,
      totalSources: this.sources.size,
      activeSources: Array.from(this.sources.values()).filter(s => s.active).length,
      totalRequests: Array.from(this.sources.values()).reduce((sum, s) => sum + s.stats.requests, 0)
    };
  }
}

// Export default instance
export const extensionManager = new ExtensionManager();

// Legacy export for compatibility
export function loadExtensions() {
  return extensionManager.loadExtensions();
}
