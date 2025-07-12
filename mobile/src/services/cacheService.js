import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Advanced caching service with multiple strategies
 */
class CacheService {
  constructor(config = {}) {
    this.config = {
      defaultTtl: config.defaultTtl || 3600000, // 1 hour
      maxCacheSize: config.maxCacheSize || 100, // Max number of cached items
      enableCompression: config.enableCompression || false,
      enableEncryption: config.enableEncryption || false,
      storageKey: config.storageKey || 'app_cache',
      ...config
    };

    this.memoryCache = new Map();
    this.cacheStats = {
      hits: 0,
      misses: 0,
      writes: 0,
      deletes: 0
    };

    this.initializeCache();
  }

  async initializeCache() {
    try {
      // Load cache metadata from persistent storage
      const metadata = await AsyncStorage.getItem(`${this.config.storageKey}_metadata`);
      if (metadata) {
        this.cacheMetadata = JSON.parse(metadata);
      } else {
        this.cacheMetadata = {};
      }
    } catch (error) {
      console.error('Failed to initialize cache:', error);
      this.cacheMetadata = {};
    }
  }

  generateKey(key) {
    return `${this.config.storageKey}_${key}`;
  }

  async get(key, options = {}) {
    const {
      strategy = 'memory-first',
      refresh = false
    } = options;

    try {
      // Check memory cache first (if strategy allows)
      if (strategy === 'memory-first' || strategy === 'memory-only') {
        const memoryData = this.memoryCache.get(key);
        if (memoryData && !this.isExpired(memoryData) && !refresh) {
          this.cacheStats.hits++;
          return memoryData.data;
        }
      }

      // Skip persistent storage for memory-only strategy
      if (strategy === 'memory-only') {
        this.cacheStats.misses++;
        return null;
      }

      // Check persistent storage
      const storageKey = this.generateKey(key);
      const storedData = await AsyncStorage.getItem(storageKey);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        if (!this.isExpired(parsedData) && !refresh) {
          // Update memory cache
          this.memoryCache.set(key, parsedData);
          this.cacheStats.hits++;
          return parsedData.data;
        } else {
          // Data expired, remove it
          await this.delete(key);
        }
      }

      this.cacheStats.misses++;
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      this.cacheStats.misses++;
      return null;
    }
  }

  async set(key, data, options = {}) {
    const {
      ttl = this.config.defaultTtl,
      strategy = 'both',
      priority = 'normal',
      tags = []
    } = options;

    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl,
      priority,
      tags,
      accessCount: 0,
      lastAccessed: Date.now()
    };

    try {
      // Update memory cache
      if (strategy === 'memory-first' || strategy === 'memory-only' || strategy === 'both') {
        this.memoryCache.set(key, cacheEntry);
        this.enforceMemoryCacheSize();
      }

      // Update persistent storage
      if (strategy === 'persistent-only' || strategy === 'both') {
        const storageKey = this.generateKey(key);
        await AsyncStorage.setItem(storageKey, JSON.stringify(cacheEntry));
        
        // Update metadata
        this.cacheMetadata[key] = {
          timestamp: cacheEntry.timestamp,
          ttl: cacheEntry.ttl,
          size: JSON.stringify(data).length,
          tags: cacheEntry.tags
        };
        
        await this.saveCacheMetadata();
      }

      this.cacheStats.writes++;
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key, options = {}) {
    const { strategy = 'both' } = options;

    try {
      // Remove from memory cache
      if (strategy === 'memory-first' || strategy === 'memory-only' || strategy === 'both') {
        this.memoryCache.delete(key);
      }

      // Remove from persistent storage
      if (strategy === 'persistent-only' || strategy === 'both') {
        const storageKey = this.generateKey(key);
        await AsyncStorage.removeItem(storageKey);
        
        // Update metadata
        delete this.cacheMetadata[key];
        await this.saveCacheMetadata();
      }

      this.cacheStats.deletes++;
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async clear(options = {}) {
    const { tags = [], olderThan = null } = options;

    try {
      const keysToDelete = [];

      // Filter by tags and age if specified
      if (tags.length > 0 || olderThan) {
        for (const [key, metadata] of Object.entries(this.cacheMetadata)) {
          let shouldDelete = false;

          // Check tags
          if (tags.length > 0 && metadata.tags) {
            shouldDelete = tags.some(tag => metadata.tags.includes(tag));
          }

          // Check age
          if (olderThan && metadata.timestamp < olderThan) {
            shouldDelete = true;
          }

          if (shouldDelete) {
            keysToDelete.push(key);
          }
        }
      } else {
        // Clear everything
        keysToDelete.push(...Object.keys(this.cacheMetadata));
      }

      // Delete selected keys
      await Promise.all(keysToDelete.map(key => this.delete(key)));

      // If clearing everything, also clear memory cache
      if (tags.length === 0 && !olderThan) {
        this.memoryCache.clear();
      }

      return keysToDelete.length;
    } catch (error) {
      console.error('Cache clear error:', error);
      return 0;
    }
  }

  async has(key) {
    const data = await this.get(key);
    return data !== null;
  }

  async keys() {
    return Object.keys(this.cacheMetadata);
  }

  async size() {
    return Object.keys(this.cacheMetadata).length;
  }

  async getStats() {
    const hitRate = this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) || 0;
    const totalSize = Object.values(this.cacheMetadata).reduce((sum, meta) => sum + (meta.size || 0), 0);

    return {
      ...this.cacheStats,
      hitRate: Math.round(hitRate * 100),
      totalEntries: await this.size(),
      memoryEntries: this.memoryCache.size,
      totalSizeBytes: totalSize,
      averageSizeBytes: Math.round(totalSize / Object.keys(this.cacheMetadata).length) || 0
    };
  }

  async cleanupExpired() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, metadata] of Object.entries(this.cacheMetadata)) {
      if (now - metadata.timestamp > metadata.ttl) {
        expiredKeys.push(key);
      }
    }

    await Promise.all(expiredKeys.map(key => this.delete(key)));
    
    // Also cleanup memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }

    return expiredKeys.length;
  }

  // Cache with function result
  async memoize(key, fn, options = {}) {
    const cached = await this.get(key, options);
    if (cached !== null) {
      return cached;
    }

    try {
      const result = await fn();
      await this.set(key, result, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Batch operations
  async getMultiple(keys, options = {}) {
    const results = {};
    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.get(key, options);
      })
    );
    return results;
  }

  async setMultiple(entries, options = {}) {
    const results = {};
    await Promise.all(
      Object.entries(entries).map(async ([key, value]) => {
        results[key] = await this.set(key, value, options);
      })
    );
    return results;
  }

  async deleteMultiple(keys, options = {}) {
    const results = {};
    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.delete(key, options);
      })
    );
    return results;
  }

  // Private methods
  isExpired(entry) {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  enforceMemoryCacheSize() {
    if (this.memoryCache.size <= this.config.maxCacheSize) {
      return;
    }

    // Sort by priority and last accessed time
    const entries = Array.from(this.memoryCache.entries()).sort((a, b) => {
      const priorityA = a[1].priority === 'high' ? 3 : a[1].priority === 'normal' ? 2 : 1;
      const priorityB = b[1].priority === 'high' ? 3 : b[1].priority === 'normal' ? 2 : 1;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Lower priority first
      }
      
      return a[1].lastAccessed - b[1].lastAccessed; // Older first
    });

    // Remove oldest, lowest priority entries
    const entriesToRemove = entries.slice(0, this.memoryCache.size - this.config.maxCacheSize);
    entriesToRemove.forEach(([key]) => {
      this.memoryCache.delete(key);
    });
  }

  async saveCacheMetadata() {
    try {
      await AsyncStorage.setItem(
        `${this.config.storageKey}_metadata`,
        JSON.stringify(this.cacheMetadata)
      );
    } catch (error) {
      console.error('Failed to save cache metadata:', error);
    }
  }
}

// Singleton instance
let cacheServiceInstance = null;

export const initializeCacheService = (config) => {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new CacheService(config);
  }
  return cacheServiceInstance;
};

export const getCacheService = () => {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new CacheService();
  }
  return cacheServiceInstance;
};

// Convenience functions
export const cache = {
  get: (key, options) => getCacheService().get(key, options),
  set: (key, data, options) => getCacheService().set(key, data, options),
  delete: (key, options) => getCacheService().delete(key, options),
  clear: (options) => getCacheService().clear(options),
  has: (key) => getCacheService().has(key),
  memoize: (key, fn, options) => getCacheService().memoize(key, fn, options),
  getStats: () => getCacheService().getStats(),
  cleanupExpired: () => getCacheService().cleanupExpired()
};

export default CacheService;
