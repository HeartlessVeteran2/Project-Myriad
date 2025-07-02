const {
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  FileUploadError,
  errorHandler,
  validateRequired,
  validateEmail,
  validateFileType,
  validateFileSize
} = require('../src/lib/errors');

describe('Error Handling System', () => {
  describe('Custom Error Classes', () => {
    test('AppError should create proper error with status code', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isOperational).toBe(true);
    });

    test('ValidationError should extend AppError', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    test('AuthenticationError should have proper defaults', () => {
      const error = new AuthenticationError();
      
      expect(error.message).toBe('Authentication required');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });

    test('NotFoundError should format resource name', () => {
      const error = new NotFoundError('User');
      
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('Validation Functions', () => {
    test('validateRequired should throw for empty values', () => {
      expect(() => validateRequired('', 'username')).toThrow('username is required');
      expect(() => validateRequired(null, 'password')).toThrow('password is required');
      expect(() => validateRequired('  ', 'email')).toThrow('email is required');
      expect(() => validateRequired('valid', 'field')).not.toThrow();
    });

    test('validateEmail should validate email format', () => {
      expect(() => validateEmail('invalid-email')).toThrow('Invalid email format');
      expect(() => validateEmail('test@')).toThrow('Invalid email format');
      expect(() => validateEmail('test@example.com')).not.toThrow();
    });

    test('validateFileType should check allowed extensions', () => {
      expect(() => validateFileType('test.txt', ['jpg', 'png'])).toThrow('File type .txt is not allowed');
      expect(() => validateFileType('image.JPG', ['jpg', 'png'])).not.toThrow();
      expect(() => validateFileType('archive.cbz', ['cbz', 'zip'])).not.toThrow();
    });

    test('validateFileSize should check size limits', () => {
      const maxSize = 1024 * 1024; // 1MB
      expect(() => validateFileSize(maxSize + 1, maxSize)).toThrow('File size exceeds limit');
      expect(() => validateFileSize(maxSize, maxSize)).not.toThrow();
      expect(() => validateFileSize(maxSize - 1, maxSize)).not.toThrow();
    });
  });

  describe('Error Handler', () => {
    let mockRequest, mockReply;

    beforeEach(() => {
      mockRequest = {
        url: '/test',
        method: 'GET'
      };
      
      mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      };
    });

    test('should handle operational errors correctly', async () => {
      const error = new ValidationError('Test validation error');
      
      await errorHandler(error, mockRequest, mockReply);
      
      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Test validation error'
        }
      });
    });

    test('should handle Fastify validation errors', async () => {
      const error = {
        validation: [
          { keyword: 'required', dataPath: '.username' }
        ]
      };
      
      await errorHandler(error, mockRequest, mockReply);
      
      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.validation
        }
      });
    });

    test('should handle unknown errors safely', async () => {
      const error = new Error('Unknown error');
      
      await errorHandler(error, mockRequest, mockReply);
      
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unknown error'
        }
      });
    });
  });
});
