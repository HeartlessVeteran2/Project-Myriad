/**
 * Advanced error tracking and analytics service
 */

class ErrorTracker {
  constructor(config = {}) {
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      endpoint: config.endpoint || '/api/errors',
      apiKey: config.apiKey,
      maxErrors: config.maxErrors || 50,
      rateLimitMs: config.rateLimitMs || 60000, // 1 minute
      enableConsoleLog: config.enableConsoleLog !== false,
      enableLocalStorage: config.enableLocalStorage !== false,
      ...config
    };

    this.errorQueue = [];
    this.rateLimitTracker = new Map();
    this.sessionId = this.generateSessionId();
    this.initializeErrorHandling();
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  initializeErrorHandling() {
    // Global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError.bind(this));
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    // React Native error handlers
    if (typeof global !== 'undefined' && global.ErrorUtils) {
      const originalHandler = global.ErrorUtils.getGlobalHandler();
      global.ErrorUtils.setGlobalHandler((error, isFatal) => {
        this.trackError(error, { isFatal, source: 'global' });
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }
  }

  handleGlobalError(event) {
    this.trackError(event.error, {
      source: 'window.error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }

  handleUnhandledRejection(event) {
    this.trackError(event.reason, {
      source: 'unhandledrejection',
      promise: true
    });
  }

  trackError(error, context = {}) {
    if (!this.config.enabled) {
      if (this.config.enableConsoleLog) {
        console.error('Error tracked:', error, context);
      }
      return;
    }

    const errorData = this.serializeError(error, context);
    
    // Rate limiting
    const errorKey = this.getErrorKey(errorData);
    if (this.isRateLimited(errorKey)) {
      return;
    }

    this.addToQueue(errorData);
    this.processQueue();
  }

  serializeError(error, context) {
    const timestamp = Date.now();
    const errorData = {
      id: this.generateId(),
      sessionId: this.sessionId,
      timestamp,
      message: error?.message || String(error),
      stack: error?.stack,
      name: error?.name,
      context: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        url: typeof window !== 'undefined' ? window.location?.href : null,
        userId: context.userId,
        ...context
      },
      environment: {
        platform: this.getPlatform(),
        version: this.getAppVersion(),
        buildNumber: this.getBuildNumber()
      },
      breadcrumbs: this.getBreadcrumbs(),
      tags: context.tags || [],
      severity: this.calculateSeverity(error, context)
    };

    // Store locally if enabled
    if (this.config.enableLocalStorage) {
      this.storeErrorLocally(errorData);
    }

    return errorData;
  }

  getErrorKey(errorData) {
    return `${errorData.message}_${errorData.name}_${errorData.context.url}`;
  }

  isRateLimited(errorKey) {
    const now = Date.now();
    const lastSent = this.rateLimitTracker.get(errorKey);
    
    if (lastSent && (now - lastSent) < this.config.rateLimitMs) {
      return true;
    }
    
    this.rateLimitTracker.set(errorKey, now);
    return false;
  }

  addToQueue(errorData) {
    this.errorQueue.push(errorData);
    
    // Limit queue size
    if (this.errorQueue.length > this.config.maxErrors) {
      this.errorQueue.shift();
    }
  }

  async processQueue() {
    if (this.errorQueue.length === 0 || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const errors = [...this.errorQueue];
      this.errorQueue = [];

      await this.sendErrors(errors);
    } catch (sendError) {
      console.error('Failed to send errors:', sendError);
      // Put errors back in queue for retry
      this.errorQueue.unshift(...this.errorQueue);
    } finally {
      this.isProcessing = false;
    }
  }

  async sendErrors(errors) {
    if (!this.config.endpoint) {
      return;
    }

    const payload = {
      errors,
      metadata: {
        sessionId: this.sessionId,
        timestamp: Date.now(),
        batchSize: errors.length
      }
    };

    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to send errors: ${response.status} ${response.statusText}`);
    }
  }

  storeErrorLocally(errorData) {
    try {
      const key = 'error_tracker_data';
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      stored.push(errorData);
      
      // Keep only recent errors
      const maxStored = 100;
      if (stored.length > maxStored) {
        stored.splice(0, stored.length - maxStored);
      }
      
      localStorage.setItem(key, JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to store error locally:', error);
    }
  }

  calculateSeverity(error, context) {
    if (context.isFatal) return 'fatal';
    if (context.severity) return context.severity;
    
    const message = error?.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'warning';
    }
    
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'error';
    }
    
    return 'error';
  }

  getPlatform() {
    if (typeof navigator !== 'undefined') {
      return navigator.platform;
    }
    return 'unknown';
  }

  getAppVersion() {
    // This should be injected during build or from app config
    return process.env.REACT_APP_VERSION || '1.0.0';
  }

  getBuildNumber() {
    // This should be injected during build
    return process.env.REACT_APP_BUILD_NUMBER || '1';
  }

  getBreadcrumbs() {
    // Return recent user actions/navigation
    return this.breadcrumbs || [];
  }

  addBreadcrumb(crumb) {
    if (!this.breadcrumbs) {
      this.breadcrumbs = [];
    }
    
    this.breadcrumbs.push({
      timestamp: Date.now(),
      ...crumb
    });
    
    // Keep only recent breadcrumbs
    if (this.breadcrumbs.length > 20) {
      this.breadcrumbs.shift();
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Public API methods
  setUser(userId, userInfo = {}) {
    this.userId = userId;
    this.userInfo = userInfo;
  }

  setTag(key, value) {
    if (!this.tags) {
      this.tags = {};
    }
    this.tags[key] = value;
  }

  setContext(key, value) {
    if (!this.contextData) {
      this.contextData = {};
    }
    this.contextData[key] = value;
  }

  captureMessage(message, level = 'info', extra = {}) {
    this.trackError(new Error(message), {
      severity: level,
      messageOnly: true,
      ...extra
    });
  }

  captureException(error, extra = {}) {
    this.trackError(error, extra);
  }

  // Get stored errors for debugging
  getStoredErrors() {
    try {
      return JSON.parse(localStorage.getItem('error_tracker_data') || '[]');
    } catch {
      return [];
    }
  }

  clearStoredErrors() {
    try {
      localStorage.removeItem('error_tracker_data');
    } catch (error) {
      console.error('Failed to clear stored errors:', error);
    }
  }
}

// Singleton instance
let errorTrackerInstance = null;

export const initializeErrorTracker = (config) => {
  if (!errorTrackerInstance) {
    errorTrackerInstance = new ErrorTracker(config);
  }
  return errorTrackerInstance;
};

export const getErrorTracker = () => {
  if (!errorTrackerInstance) {
    throw new Error('Error tracker not initialized. Call initializeErrorTracker first.');
  }
  return errorTrackerInstance;
};

// Convenience functions
export const trackError = (error, context) => {
  getErrorTracker().trackError(error, context);
};

export const addBreadcrumb = (crumb) => {
  getErrorTracker().addBreadcrumb(crumb);
};

export const setUser = (userId, userInfo) => {
  getErrorTracker().setUser(userId, userInfo);
};

export const captureMessage = (message, level, extra) => {
  getErrorTracker().captureMessage(message, level, extra);
};

export const captureException = (error, extra) => {
  getErrorTracker().captureException(error, extra);
};

export default ErrorTracker;
