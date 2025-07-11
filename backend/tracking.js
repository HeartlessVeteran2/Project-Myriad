// Reading tracking and history management
export class Tracking {
  constructor() {
    this.history = new Map(); // userId -> reading history
    this.bookmarks = new Map(); // userId -> bookmarks
    this.readingProgress = new Map(); // userId -> progress data
  }

  // Add reading history entry
  addHistory(userId, entry) {
    if (!this.history.has(userId)) {
      this.history.set(userId, []);
    }

    const historyEntry = {
      id: entry.id,
      title: entry.title,
      type: entry.type, // 'manga', 'anime', 'novel'
      chapter: entry.chapter || null,
      episode: entry.episode || null,
      timestamp: new Date(),
      duration: entry.duration || 0,
      completed: entry.completed || false,
    };

    this.history.get(userId).unshift(historyEntry);
    // Keep only last 500 entries
    if (this.history.get(userId).length > 500) {
      this.history.get(userId).splice(500);
    }
  }

  // Get user's reading history
  getHistory(userId, limit = 50) {
    if (!this.history.has(userId)) {
      return [];
    }
    return this.history.get(userId).slice(0, limit);
  }

  // Update reading progress
  updateProgress(userId, contentId, progress) {
    const key = `${userId}-${contentId}`;
    this.readingProgress.set(key, {
      contentId,
      currentChapter: progress.currentChapter || 0,
      currentEpisode: progress.currentEpisode || 0,
      currentPage: progress.currentPage || 0,
      totalChapters: progress.totalChapters || 0,
      totalEpisodes: progress.totalEpisodes || 0,
      status: progress.status || 'reading', // 'reading', 'completed', 'dropped', 'plan_to_read'
      rating: progress.rating || null,
      lastUpdated: new Date(),
    });
  }

  // Get reading progress
  getProgress(userId, contentId) {
    const key = `${userId}-${contentId}`;
    return this.readingProgress.get(key) || null;
  }

  // Add bookmark
  addBookmark(userId, bookmark) {
    if (!this.bookmarks.has(userId)) {
      this.bookmarks.set(userId, []);
    }

    const bookmarkEntry = {
      id: Date.now().toString(),
      contentId: bookmark.contentId,
      title: bookmark.title,
      chapter: bookmark.chapter,
      page: bookmark.page,
      note: bookmark.note || '',
      timestamp: new Date(),
    };

    this.bookmarks.get(userId).push(bookmarkEntry);
  }

  // Get user bookmarks
  getBookmarks(userId) {
    return this.bookmarks.get(userId) || [];
  }

  // Get reading statistics
  getStats(userId) {
    const history = this.getHistory(userId, 1000);
    const progress = Array.from(this.readingProgress.values()).filter(
      p => p.contentId && this.readingProgress.has(`${userId}-${p.contentId}`)
    );

    return {
      totalRead: history.length,
      mangaRead: history.filter(h => h.type === 'manga').length,
      animeWatched: history.filter(h => h.type === 'anime').length,
      novelsRead: history.filter(h => h.type === 'novel').length,
      completed: progress.filter(p => p.status === 'completed').length,
      reading: progress.filter(p => p.status === 'reading').length,
      planToRead: progress.filter(p => p.status === 'plan_to_read').length,
      dropped: progress.filter(p => p.status === 'dropped').length,
      totalBookmarks: this.getBookmarks(userId).length,
    };
  }
}
