// Cross-platform synchronization system
import { EventEmitter } from 'events';

export class Sync extends EventEmitter {
  constructor() {
    super();
    this.userSyncData = new Map(); // userId -> sync data
    this.deviceRegistry = new Map(); // userId -> devices array
    this.syncQueue = new Map(); // userId -> pending sync operations
    this.conflictResolution = new Map(); // userId -> conflict resolution settings
    this.lastSyncTimes = new Map(); // userId -> last sync timestamp
  }

  // Register a device for a user
  registerDevice(userId, deviceInfo) {
    if (!this.deviceRegistry.has(userId)) {
      this.deviceRegistry.set(userId, []);
    }

    const device = {
      id: deviceInfo.id || this.generateDeviceId(),
      name: deviceInfo.name,
      type: deviceInfo.type, // 'mobile', 'desktop', 'tablet', 'web'
      platform: deviceInfo.platform, // 'ios', 'android', 'windows', 'macos', 'linux', 'web'
      version: deviceInfo.version,
      lastSeen: new Date(),
      syncEnabled: true,
      registered: new Date(),
    };

    const devices = this.deviceRegistry.get(userId);
    const existingIndex = devices.findIndex(d => d.id === device.id);

    if (existingIndex > -1) {
      devices[existingIndex] = { ...devices[existingIndex], ...device };
    } else {
      devices.push(device);
    }

    this.emit('deviceRegistered', { userId, device });
    return device;
  }

  // Sync library and progress data
  async syncLibrary(userId, deviceId, syncData) {
    try {
      const currentData = this.userSyncData.get(userId) || this.getEmptySyncData();
      const lastSync = this.lastSyncTimes.get(userId) || new Date(0);

      // Detect conflicts
      const conflicts = this.detectConflicts(currentData, syncData, lastSync);

      if (conflicts.length > 0) {
        return await this.handleConflicts(userId, deviceId, conflicts, syncData);
      }

      // Merge data
      const mergedData = this.mergeData(currentData, syncData);

      // Store merged data
      this.userSyncData.set(userId, mergedData);
      this.lastSyncTimes.set(userId, new Date());

      // Update device last seen
      this.updateDeviceLastSeen(userId, deviceId);

      // Emit sync completion event
      this.emit('syncCompleted', {
        userId,
        deviceId,
        timestamp: new Date(),
        dataSize: this.calculateDataSize(mergedData),
      });

      return {
        success: true,
        message: 'Library synced successfully',
        data: mergedData,
        conflicts: [],
        lastSync: new Date(),
      };
    } catch (error) {
      this.emit('syncError', { userId, deviceId, error: error.message });
      return {
        success: false,
        message: `Sync failed: ${error.message}`,
        error: error.message,
      };
    }
  }

  // Get empty sync data structure
  getEmptySyncData() {
    return {
      library: {
        manga: [],
        anime: [],
        novels: [],
      },
      readingProgress: {},
      bookmarks: [],
      preferences: {},
      history: [],
      downloads: [],
      customLists: [],
      ratings: {},
      reviews: [],
      lastModified: new Date(),
    };
  }

  // Detect conflicts between local and server data
  detectConflicts(serverData, localData, lastSync) {
    const conflicts = [];

    // Check for reading progress conflicts
    for (const [contentId, localProgress] of Object.entries(localData.readingProgress || {})) {
      const serverProgress = serverData.readingProgress[contentId];

      if (
        serverProgress &&
        new Date(localProgress.lastUpdated) > lastSync &&
        new Date(serverProgress.lastUpdated) > lastSync &&
        !this.isProgressEqual(localProgress, serverProgress)
      ) {
        conflicts.push({
          type: 'reading_progress',
          contentId,
          local: localProgress,
          server: serverProgress,
          field: 'progress',
        });
      }
    }

    // Check for library conflicts (added/removed items)
    ['manga', 'anime', 'novels'].forEach(type => {
      const localItems = new Set((localData.library[type] || []).map(item => item.id));
      const serverItems = new Set((serverData.library[type] || []).map(item => item.id));

      // Find items that exist in both but were modified after last sync
      const commonItems = [...localItems].filter(id => serverItems.has(id));

      commonItems.forEach(itemId => {
        const localItem = localData.library[type].find(item => item.id === itemId);
        const serverItem = serverData.library[type].find(item => item.id === itemId);

        if (
          localItem &&
          serverItem &&
          new Date(localItem.lastModified) > lastSync &&
          new Date(serverItem.lastModified) > lastSync &&
          !this.isItemEqual(localItem, serverItem)
        ) {
          conflicts.push({
            type: 'library_item',
            contentType: type,
            itemId,
            local: localItem,
            server: serverItem,
            field: 'metadata',
          });
        }
      });
    });

    // Check for bookmark conflicts
    const localBookmarkIds = new Set(localData.bookmarks.map(b => b.id));
    const serverBookmarkIds = new Set(serverData.bookmarks.map(b => b.id));

    const commonBookmarks = [...localBookmarkIds].filter(id => serverBookmarkIds.has(id));

    commonBookmarks.forEach(bookmarkId => {
      const localBookmark = localData.bookmarks.find(b => b.id === bookmarkId);
      const serverBookmark = serverData.bookmarks.find(b => b.id === bookmarkId);

      if (
        localBookmark &&
        serverBookmark &&
        new Date(localBookmark.lastModified) > lastSync &&
        new Date(serverBookmark.lastModified) > lastSync &&
        !this.isBookmarkEqual(localBookmark, serverBookmark)
      ) {
        conflicts.push({
          type: 'bookmark',
          bookmarkId,
          local: localBookmark,
          server: serverBookmark,
          field: 'content',
        });
      }
    });

    return conflicts;
  }

  // Handle sync conflicts
  async handleConflicts(userId, deviceId, conflicts, localData) {
    const resolutionSettings = this.conflictResolution.get(userId) || {
      strategy: 'prompt', // 'prompt', 'local_wins', 'server_wins', 'merge'
      autoResolve: false,
    };

    if (resolutionSettings.autoResolve) {
      return this.autoResolveConflicts(userId, conflicts, localData, resolutionSettings.strategy);
    }

    // Return conflicts for user resolution
    return {
      success: false,
      message: 'Sync conflicts detected',
      conflicts,
      requiresResolution: true,
      resolutionToken: this.generateResolutionToken(userId, conflicts),
    };
  }

  // Auto-resolve conflicts based on strategy
  async autoResolveConflicts(userId, conflicts, localData, strategy) {
    const serverData = this.userSyncData.get(userId) || this.getEmptySyncData();
    const resolvedData = { ...serverData };

    conflicts.forEach(conflict => {
      switch (strategy) {
        case 'local_wins':
          this.applyLocalResolution(resolvedData, conflict, localData);
          break;
        case 'server_wins':
          // Keep server data (no action needed)
          break;
        case 'merge':
          this.applyMergeResolution(resolvedData, conflict, localData);
          break;
      }
    });

    // Store resolved data
    this.userSyncData.set(userId, resolvedData);
    this.lastSyncTimes.set(userId, new Date());

    return {
      success: true,
      message: `Conflicts auto-resolved using ${strategy} strategy`,
      data: resolvedData,
      resolvedConflicts: conflicts.length,
    };
  }

  // Apply local resolution to conflict
  applyLocalResolution(resolvedData, conflict, _localData) {
    switch (conflict.type) {
      case 'reading_progress': {
        resolvedData.readingProgress[conflict.contentId] = conflict.local;
        break;
      }
      case 'library_item': {
        const typeArray = resolvedData.library[conflict.contentType];
        const index = typeArray.findIndex(item => item.id === conflict.itemId);
        if (index > -1) {
          typeArray[index] = conflict.local;
        }
        break;
      }
      case 'bookmark': {
        const bookmarkIndex = resolvedData.bookmarks.findIndex(b => b.id === conflict.bookmarkId);
        if (bookmarkIndex > -1) {
          resolvedData.bookmarks[bookmarkIndex] = conflict.local;
        }
        break;
      }
    }
  }

  // Apply merge resolution to conflict
  applyMergeResolution(resolvedData, conflict, _localData) {
    switch (conflict.type) {
      case 'reading_progress': {
        // Use most recent progress
        const localTime = new Date(conflict.local.lastUpdated);
        const serverTime = new Date(conflict.server.lastUpdated);
        resolvedData.readingProgress[conflict.contentId] =
          localTime > serverTime ? conflict.local : conflict.server;
        break;
      }
      case 'library_item': {
        // Merge metadata, preferring most recent
        const mergedItem = { ...conflict.server, ...conflict.local };
        const typeArray = resolvedData.library[conflict.contentType];
        const index = typeArray.findIndex(item => item.id === conflict.itemId);
        if (index > -1) {
          typeArray[index] = mergedItem;
        }
        break;
      }
      case 'bookmark': {
        // Use most recent bookmark
        const localBookmarkTime = new Date(conflict.local.lastModified);
        const serverBookmarkTime = new Date(conflict.server.lastModified);
        const bookmarkIndex = resolvedData.bookmarks.findIndex(b => b.id === conflict.bookmarkId);
        if (bookmarkIndex > -1) {
          resolvedData.bookmarks[bookmarkIndex] =
            localBookmarkTime > serverBookmarkTime ? conflict.local : conflict.server;
        }
        break;
      }
    }
  }

  // Merge non-conflicting data
  mergeData(serverData, localData) {
    const merged = { ...serverData };

    // Merge library items
    ['manga', 'anime', 'novels'].forEach(type => {
      const serverItems = new Map(merged.library[type].map(item => [item.id, item]));
      const localItems = localData.library[type] || [];

      localItems.forEach(localItem => {
        const serverItem = serverItems.get(localItem.id);

        if (!serverItem) {
          // New item from local
          merged.library[type].push(localItem);
        } else if (new Date(localItem.lastModified) > new Date(serverItem.lastModified)) {
          // Local item is newer
          const index = merged.library[type].findIndex(item => item.id === localItem.id);
          merged.library[type][index] = localItem;
        }
      });
    });

    // Merge reading progress
    Object.entries(localData.readingProgress || {}).forEach(([contentId, localProgress]) => {
      const serverProgress = merged.readingProgress[contentId];

      if (
        !serverProgress ||
        new Date(localProgress.lastUpdated) > new Date(serverProgress.lastUpdated)
      ) {
        merged.readingProgress[contentId] = localProgress;
      }
    });

    // Merge bookmarks
    const serverBookmarkIds = new Set(merged.bookmarks.map(b => b.id));
    (localData.bookmarks || []).forEach(localBookmark => {
      if (!serverBookmarkIds.has(localBookmark.id)) {
        merged.bookmarks.push(localBookmark);
      }
    });

    // Merge other data
    merged.preferences = { ...merged.preferences, ...localData.preferences };
    merged.lastModified = new Date();

    return merged;
  }

  // Get user's sync data
  getUserSyncData(userId) {
    return this.userSyncData.get(userId) || this.getEmptySyncData();
  }

  // Get user's devices
  getUserDevices(userId) {
    return this.deviceRegistry.get(userId) || [];
  }

  // Update device last seen timestamp
  updateDeviceLastSeen(userId, deviceId) {
    const devices = this.deviceRegistry.get(userId) || [];
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      device.lastSeen = new Date();
    }
  }

  // Set conflict resolution strategy
  setConflictResolution(userId, strategy, autoResolve = false) {
    this.conflictResolution.set(userId, {
      strategy,
      autoResolve,
    });
  }

  // Utility functions
  generateDeviceId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generateResolutionToken(userId, conflicts) {
    return `${userId}_${Date.now()}_${conflicts.length}`;
  }

  isProgressEqual(progress1, progress2) {
    return (
      progress1.currentChapter === progress2.currentChapter &&
      progress1.currentPage === progress2.currentPage &&
      progress1.status === progress2.status
    );
  }

  isItemEqual(item1, item2) {
    return JSON.stringify(item1) === JSON.stringify(item2);
  }

  isBookmarkEqual(bookmark1, bookmark2) {
    return (
      bookmark1.chapter === bookmark2.chapter &&
      bookmark1.page === bookmark2.page &&
      bookmark1.note === bookmark2.note
    );
  }

  calculateDataSize(data) {
    return JSON.stringify(data).length;
  }

  // Get sync statistics
  getSyncStats(userId) {
    const devices = this.getUserDevices(userId);
    const syncData = this.getUserSyncData(userId);
    const lastSync = this.lastSyncTimes.get(userId);

    return {
      devicesCount: devices.length,
      activeDevices: devices.filter(
        d => Date.now() - new Date(d.lastSeen).getTime() < 7 * 24 * 60 * 60 * 1000
      ).length,
      lastSyncTime: lastSync,
      dataSize: this.calculateDataSize(syncData),
      libraryItems: Object.values(syncData.library).flat().length,
      readingProgressItems: Object.keys(syncData.readingProgress).length,
      bookmarksCount: syncData.bookmarks.length,
    };
  }
}
