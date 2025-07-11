// Download Manager with queue and progress tracking
import { EventEmitter } from 'events';
import fs from 'fs/promises';

export class DownloadManager extends EventEmitter {
  constructor() {
    super();
    this.queue = new Map(); // downloadId -> download info
    this.activeDownloads = new Map(); // downloadId -> download process
    this.maxConcurrent = 3;
    this.downloadPath = './downloads';
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.downloadPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create download directory:', error);
    }
  }

  // Add item to download queue
  addDownload(item) {
    const downloadId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const downloadInfo = {
      id: downloadId,
      title: item.title,
      type: item.type, // 'manga', 'anime', 'novel'
      url: item.url,
      chapters: item.chapters || [],
      episodes: item.episodes || [],
      status: 'queued',
      progress: 0,
      downloadedSize: 0,
      totalSize: item.totalSize || 0,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      error: null
    };

    this.queue.set(downloadId, downloadInfo);
    this.emit('downloadAdded', downloadInfo);
    this.processQueue();
    
    return downloadId;
  }

  // Process download queue
  async processQueue() {
    if (this.activeDownloads.size >= this.maxConcurrent) {
      return;
    }

    const queuedDownloads = Array.from(this.queue.values())
      .filter(d => d.status === 'queued')
      .sort((a, b) => a.createdAt - b.createdAt);

    for (const download of queuedDownloads) {
      if (this.activeDownloads.size >= this.maxConcurrent) {
        break;
      }
      
      await this.startDownload(download.id);
    }
  }

  // Start individual download
  async startDownload(downloadId) {
    const download = this.queue.get(downloadId);
    if (!download || download.status !== 'queued') {
      return;
    }

    download.status = 'downloading';
    download.startedAt = new Date();
    this.activeDownloads.set(downloadId, download);
    
    this.emit('downloadStarted', download);

    try {
      // Simulate download process
      await this.simulateDownload(download);
      
      download.status = 'completed';
      download.completedAt = new Date();
      download.progress = 100;
      
      this.emit('downloadCompleted', download);
    } catch (error) {
      download.status = 'failed';
      download.error = error.message;
      this.emit('downloadFailed', download);
    } finally {
      this.activeDownloads.delete(downloadId);
      this.processQueue(); // Process next in queue
    }
  }

  // Simulate download with progress updates
  async simulateDownload(download) {
    const steps = 20;
    const stepDelay = 100; // 100ms per step = 2s total
    
    for (let i = 0; i <= steps; i++) {
      download.progress = Math.round((i / steps) * 100);
      download.downloadedSize = Math.round((download.totalSize || 100000) * (i / steps));
      
      this.emit('downloadProgress', download);
      
      if (i < steps) {
        await new Promise(resolve => setTimeout(resolve, stepDelay));
      }
    }
  }

  // Pause download
  pauseDownload(downloadId) {
    const download = this.queue.get(downloadId);
    if (download && download.status === 'downloading') {
      download.status = 'paused';
      this.activeDownloads.delete(downloadId);
      this.emit('downloadPaused', download);
    }
  }

  // Resume download
  resumeDownload(downloadId) {
    const download = this.queue.get(downloadId);
    if (download && download.status === 'paused') {
      download.status = 'queued';
      this.emit('downloadResumed', download);
      this.processQueue();
    }
  }

  // Cancel download
  cancelDownload(downloadId) {
    const download = this.queue.get(downloadId);
    if (download) {
      download.status = 'cancelled';
      this.activeDownloads.delete(downloadId);
      this.emit('downloadCancelled', download);
    }
  }

  // Remove download from queue
  removeDownload(downloadId) {
    const download = this.queue.get(downloadId);
    if (download) {
      if (download.status === 'downloading') {
        this.cancelDownload(downloadId);
      }
      this.queue.delete(downloadId);
      this.emit('downloadRemoved', download);
    }
  }

  // Get download queue
  getQueue() {
    return Array.from(this.queue.values());
  }

  // Get active downloads
  getActiveDownloads() {
    return Array.from(this.activeDownloads.values());
  }

  // Get download by ID
  getDownload(downloadId) {
    return this.queue.get(downloadId);
  }

  // Get download statistics
  getStats() {
    const downloads = this.getQueue();
    return {
      total: downloads.length,
      queued: downloads.filter(d => d.status === 'queued').length,
      downloading: downloads.filter(d => d.status === 'downloading').length,
      completed: downloads.filter(d => d.status === 'completed').length,
      failed: downloads.filter(d => d.status === 'failed').length,
      paused: downloads.filter(d => d.status === 'paused').length,
      cancelled: downloads.filter(d => d.status === 'cancelled').length,
      totalSize: downloads.reduce((sum, d) => sum + (d.totalSize || 0), 0),
      downloadedSize: downloads.reduce((sum, d) => sum + (d.downloadedSize || 0), 0)
    };
  }
}
