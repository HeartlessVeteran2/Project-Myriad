// Error handling utilities and custom error classes

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class FileUploadError extends AppError {
  constructor(message) {
    super(message, 400, 'FILE_UPLOAD_ERROR');
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

// Error handler middleware for Fastify
const errorHandler = async (error, request, reply) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString()
  });

  // Handle operational errors
  if (error.isOperational) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && { details: error.details })
      }
    });
  }

  // Handle validation errors from Fastify
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.validation
      }
    });
  }

  // Handle file upload errors
  if (error.code === 'FST_FILES_LIMIT' || error.code === 'FST_FILE_SIZE_LIMIT') {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'FILE_UPLOAD_ERROR',
        message: 'File upload failed: ' + error.message
      }
    });
  }

  // Handle unknown errors
  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message
    }
  });
};

// Async error wrapper for route handlers
const asyncHandler = (fn) => {
  return async (request, reply) => {
    try {
      await fn(request, reply);
    } catch (error) {
      throw error;
    }
  };
};

// Input validation helpers
const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(`${fieldName} is required`);
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
};

const validateFileType = (filename, allowedTypes) => {
  const ext = filename.toLowerCase().split('.').pop();
  if (!allowedTypes.includes(ext)) {
    throw new FileUploadError(`File type .${ext} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

const validateFileSize = (fileSize, maxSize) => {
  if (fileSize > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    throw new FileUploadError(`File size exceeds limit of ${maxSizeMB}MB`);
  }
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  FileUploadError,
  DatabaseError,
  errorHandler,
  asyncHandler,
  validateRequired,
  validateEmail,
  validateFileType,
  validateFileSize
};
