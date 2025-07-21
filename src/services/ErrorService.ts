import { Platform } from 'react-native';

// Define error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Define error types
export enum ErrorType {
  NETWORK = 'network',
  API = 'api',
  STORAGE = 'storage',
  PARSING = 'parsing',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown',
}

// Define error context
export interface ErrorContext {
  component?: string;
  action?: string;
  data?: Record<string, any>;
  timestamp: number;
}

// Define error object
export interface ErrorObject {
  message: string;
  originalError?: Error;
  stack?: string;
  type: ErrorType;
  severity: ErrorSeverity;
  context: ErrorContext;
  handled: boolean;
}

// Define error handler function type
export type ErrorHandler = (error: ErrorObject) => void;

class ErrorService {
  private static instance: ErrorService;
  private handlers: ErrorHandler[] = [];
  private isInitialized = false;

  // Private constructor for singleton pattern
  private constructor() {}

  // Get singleton instance
  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  // Initialize global error handlers
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Handle unhandled promise rejections
    if (Platform.OS === 'web') {
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    } else {
      // For React Native
      const originalHandler = global.ErrorUtils.getGlobalHandler();
      
      global.ErrorUtils.setGlobalHandler((error, isFatal) => {
        this.handleError({
          message: error.message || 'An unknown error occurred',
          originalError: error,
          stack: error.stack,
          type: ErrorType.UNKNOWN,
          severity: isFatal ? ErrorSeverity.CRITICAL : ErrorSeverity.ERROR,
          context: {
            timestamp: Date.now(),
          },
          handled: false,
        });
        
        // Call original handler
        originalHandler(error, isFatal);
      });
    }

    this.isInitialized = true;
  }

  // Clean up event listeners
  public cleanup(): void {
    if (Platform.OS === 'web') {
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
    this.isInitialized = false;
  }

  // Register an error handler
  public registerHandler(handler: ErrorHandler): () => void {
    this.handlers.push(handler);
    
    // Return a function to unregister the handler
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  // Handle an error
  public handleError(error: ErrorObject): void {
    // Mark as handled
    error.handled = true;
    
    // Log the error
    this.logError(error);
    
    // Call all registered handlers
    this.handlers.forEach(handler => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    });
  }

  // Create and handle an error from various inputs
  public captureError(
    errorOrMessage: Error | string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    context: Partial<ErrorContext> = {}
  ): void {
    const errorObject: ErrorObject = {
      message: typeof errorOrMessage === 'string' ? errorOrMessage : errorOrMessage.message,
      originalError: typeof errorOrMessage === 'string' ? undefined : errorOrMessage,
      stack: typeof errorOrMessage === 'string' ? undefined : errorOrMessage.stack,
      type,
      severity,
      context: {
        ...context,
        timestamp: Date.now(),
      },
      handled: false,
    };
    
    this.handleError(errorObject);
  }

  // Log an error to the console and potentially to a remote service
  private logError(error: ErrorObject): void {
    // Log to console
    const logMethod = this.getLogMethodForSeverity(error.severity);
    
    logMethod(
      `[${error.severity.toUpperCase()}][${error.type}] ${error.message}`,
      error.originalError || '',
      error.context
    );
    
    // TODO: Send to remote logging service when implemented
  }

  // Get the appropriate console method based on severity
  private getLogMethodForSeverity(severity: ErrorSeverity): (...args: any[]) => void {
    switch (severity) {
      case ErrorSeverity.INFO:
        return console.info;
      case ErrorSeverity.WARNING:
        return console.warn;
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }

  // Handle unhandled promise rejections (for web)
  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    this.captureError(
      event.reason || 'Unhandled Promise Rejection',
      ErrorType.UNKNOWN,
      ErrorSeverity.ERROR,
      {
        action: 'unhandledRejection',
      }
    );
  };
}

// Export singleton instance
export const errorService = ErrorService.getInstance();

// Utility functions for common error scenarios
export const captureNetworkError = (error: Error | string, context?: Partial<ErrorContext>): void => {
  errorService.captureError(error, ErrorType.NETWORK, ErrorSeverity.ERROR, context);
};

export const captureApiError = (error: Error | string, context?: Partial<ErrorContext>): void => {
  errorService.captureError(error, ErrorType.API, ErrorSeverity.ERROR, context);
};

export const captureStorageError = (error: Error | string, context?: Partial<ErrorContext>): void => {
  errorService.captureError(error, ErrorType.STORAGE, ErrorSeverity.ERROR, context);
};

export default errorService;