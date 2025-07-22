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

  private constructor() {}

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Set up global error handler
    const originalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
      this.captureError(error, ErrorType.UNKNOWN, isFatal ? ErrorSeverity.CRITICAL : ErrorSeverity.ERROR);
      originalHandler(error, isFatal);
    });

    this.isInitialized = true;
  }

  public addHandler(handler: ErrorHandler): void {
    this.handlers.push(handler);
  }

  public removeHandler(handler: ErrorHandler): void {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  public captureError(
    error: Error | string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    context?: Partial<ErrorContext>
  ): void {
    const errorObject: ErrorObject = {
      message: typeof error === 'string' ? error : error.message,
      originalError: typeof error === 'string' ? undefined : error,
      stack: typeof error === 'string' ? undefined : error.stack,
      type,
      severity,
      context: {
        timestamp: Date.now(),
        ...context,
      },
      handled: true,
    };

    this.notifyHandlers(errorObject);
  }

  public handleError(params: {
    type: ErrorType;
    severity: ErrorSeverity;
    message: string;
    details?: any;
  }): void {
    const errorObject: ErrorObject = {
      message: params.message,
      originalError: params.details instanceof Error ? params.details : undefined,
      stack: params.details instanceof Error ? params.details.stack : undefined,
      type: params.type,
      severity: params.severity,
      context: {
        timestamp: Date.now(),
        data: typeof params.details === 'object' ? params.details : { details: params.details },
      },
      handled: true,
    };

    this.notifyHandlers(errorObject);
  }

  private notifyHandlers(error: ErrorObject): void {
    this.handlers.forEach(handler => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    });

    // Always log to console in development
    if (__DEV__) {
      console.error(`[${error.severity.toUpperCase()}] ${error.type}:`, error.message);
      if (error.stack) {
        console.error('Stack:', error.stack);
      }
      if (error.context.data) {
        console.error('Context:', error.context.data);
      }
    }
  }
}

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