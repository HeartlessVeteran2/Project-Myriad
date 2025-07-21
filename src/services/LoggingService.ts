import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4, // Used to disable logging
}

// Define log entry structure
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  tag: string;
  message: string;
  data?: any;
}

// Define log storage options
interface LogStorageOptions {
  enabled: boolean;
  maxEntries: number;
  persistenceKey: string;
}

/**
 * Logging service for application-wide logging
 * Provides methods for logging at different levels and storing logs
 */
class LoggingService {
  private static instance: LoggingService;
  private currentLogLevel: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.INFO;
  private logs: LogEntry[] = [];
  private storageOptions: LogStorageOptions = {
    enabled: true,
    maxEntries: 1000,
    persistenceKey: '@ProjectMyriad:logs',
  };

  // Private constructor for singleton pattern
  private constructor() {
    this.loadLogs();
  }

  // Get singleton instance
  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  // Set the current log level
  public setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  // Get the current log level
  public getLogLevel(): LogLevel {
    return this.currentLogLevel;
  }

  // Configure log storage options
  public configureStorage(options: Partial<LogStorageOptions>): void {
    this.storageOptions = { ...this.storageOptions, ...options };
  }

  // Debug level logging
  public debug(tag: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, tag, message, data);
  }

  // Info level logging
  public info(tag: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, tag, message, data);
  }

  // Warning level logging
  public warn(tag: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, tag, message, data);
  }

  // Error level logging
  public error(tag: string, message: string, data?: any): void {
    this.log(LogLevel.ERROR, tag, message, data);
  }

  // Generic logging method
  private log(level: LogLevel, tag: string, message: string, data?: any): void {
    // Skip if the level is below the current log level
    if (level < this.currentLogLevel) {
      return;
    }

    // Create log entry
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      tag,
      message,
      data,
    };

    // Add to in-memory logs
    this.logs.push(entry);

    // Trim logs if they exceed the maximum
    if (this.logs.length > this.storageOptions.maxEntries) {
      this.logs = this.logs.slice(-this.storageOptions.maxEntries);
    }

    // Log to console
    this.logToConsole(entry);

    // Store logs if enabled
    if (this.storageOptions.enabled) {
      this.saveLogs();
    }
  }

  // Log to console with appropriate formatting
  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}][${LogLevel[entry.level]}][${entry.tag}]`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.data || '');
        break;
    }
  }

  // Get all logs
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Get logs filtered by level
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Get logs filtered by tag
  public getLogsByTag(tag: string): LogEntry[] {
    return this.logs.filter(log => log.tag === tag);
  }

  // Clear all logs
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