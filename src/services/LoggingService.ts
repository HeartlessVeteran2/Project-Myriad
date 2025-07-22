   */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
    this.storeLogs();
  DEBUG = 0,
// Define log entry structure
  /**
   * Load logs from storage
   */
}
 */
class LoggingService {
  private static instance: LoggingService;
  private currentLogLevel: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.INFO;
  private logs: LogEntry[] = [];
  private storageOptions: LogStorageOptions = {
      console.error('Failed to load logs from storage:', error);
    maxEntries: 1000,
    persistenceKey: '@ProjectMyriad:logs',
  };
  /**
   * Store logs to persistent storage
   */
  private async storeLogs(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.storageOptions.persistenceKey,
        JSON.stringify(this.logs)
      );
    } catch (error) {
      console.error('Failed to store logs:', error);
    }
  }

  /**
   * Configure storage options
   */
  public configureStorage(options: Partial<LogStorageOptions>): void {
    this.storageOptions = { ...this.storageOptions, ...options };
  }

  /**
   * Export logs as JSON string
   */
  // Private constructor for singleton pattern
    return JSON.stringify(this.logs, null, 2);

  /**
   * Get the current log level
  public getLogLevel(): LogLevel {
   * Log a warning message

   */
  public warn(tag: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, tag, message, data);
  }

  /**
   * Log an error message
   */
  public error(tag: string, message: string, data?: any): void {
    this.log(LogLevel.ERROR, tag, message, data);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, tag: string, message: string, data?: any): void {
    if (level < this.currentLogLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      tag,
      message,
      data,
    };

    // Add to in-memory logs
    this.logs.push(entry);

    // Trim logs if necessary
    if (this.logs.length > this.storageOptions.maxEntries) {
      this.logs = this.logs.slice(-this.storageOptions.maxEntries);
    }

    // Console output in development
    if (__DEV__) {
      const levelName = LogLevel[level];
      const timestamp = new Date(entry.timestamp).toISOString();
      console.log(`[${timestamp}] ${levelName} ${tag}: ${message}`, data || '');
    }

    // Store logs if enabled
    if (this.storageOptions.enabled) {
      this.storeLogs();
    }
  }

  /**
   * Get all stored logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs filtered by tag
   */
  public getLogsByTag(tag: string): LogEntry[] {
    return this.logs.filter(log => log.tag === tag);
  }

  /**
   * Clear all logs
  public clearLogs(): void {
    this.logs = [];
    if (this.storageOptions.enabled) {
      this.saveLogs();
    }
  }

  // Save logs to persistent storage
  private async saveLogs(): Promise<void> {
    if (!this.storageOptions.enabled) {
      return;
    }

    try {
      // Only store the most recent logs up to maxEntries
      const logsToStore = this.logs.slice(-this.storageOptions.maxEntries);
      await AsyncStorage.setItem(
        this.storageOptions.persistenceKey,
        JSON.stringify(logsToStore)
      );
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }

  // Load logs from persistent storage
  private async loadLogs(): Promise<void> {
    if (!this.storageOptions.enabled) {
      return;
    }

    try {
      const storedLogs = await AsyncStorage.getItem(this.storageOptions.persistenceKey);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  }

  // Export logs as a string (for sharing or debugging)
  public exportLogs(): string {
    return this.logs
      .map(entry => {
        const timestamp = new Date(entry.timestamp).toISOString();
        const level = LogLevel[entry.level];
        const data = entry.data ? ` | ${JSON.stringify(entry.data)}` : '';
        return `[${timestamp}][${level}][${entry.tag}] ${entry.message}${data}`;
      })
      .join('\n');
  }

  // Get device info for logging context
  public getDeviceInfo(): Record<string, any> {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      isEmulator: Platform.OS === 'android' ? Platform.isTV : false, // Approximation
      // Add more device info as needed
    };
  }
}

// Export singleton instance
export const loggingService = LoggingService.getInstance();

// Export convenience methods
export const debug = (tag: string, message: string, data?: any): void => {
  loggingService.debug(tag, message, data);
};

export const info = (tag: string, message: string, data?: any): void => {
  loggingService.info(tag, message, data);
};

export const warn = (tag: string, message: string, data?: any): void => {
  loggingService.warn(tag, message, data);
};

export const error = (tag: string, message: string, data?: any): void => {
  loggingService.error(tag, message, data);
};

export default loggingService;