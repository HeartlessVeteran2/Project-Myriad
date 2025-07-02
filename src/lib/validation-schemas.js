// Input validation schemas using Fastify's built-in validation

const userRegistrationSchema = {
  type: 'object',
  required: ['username', 'email', 'password'],
  properties: {
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 30,
      pattern: '^[a-zA-Z0-9_-]+$'
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 128
    }
  },
  additionalProperties: false
};

const userLoginSchema = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: {
      type: 'string',
      minLength: 1,
      maxLength: 30
    },
    password: {
      type: 'string',
      minLength: 1,
      maxLength: 128
    }
  },
  additionalProperties: false
};

const seriesCreationSchema = {
  type: 'object',
  required: ['title'],
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    description: {
      type: 'string',
      maxLength: 2000
    },
    author: {
      type: 'string',
      maxLength: 255
    },
    genre: {
      type: 'string',
      maxLength: 255
    },
    status: {
      type: 'string',
      enum: ['ongoing', 'completed', 'hiatus', 'cancelled']
    }
  },
  additionalProperties: false
};

const seriesUpdateSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    description: {
      type: 'string',
      maxLength: 2000
    },
    author: {
      type: 'string',
      maxLength: 255
    },
    genre: {
      type: 'string',
      maxLength: 255
    },
    status: {
      type: 'string',
      enum: ['ongoing', 'completed', 'hiatus', 'cancelled']
    }
  },
  additionalProperties: false
};

const readingProgressSchema = {
  type: 'object',
  required: ['currentPage'],
  properties: {
    currentPage: {
      type: 'integer',
      minimum: 0
    },
    totalPages: {
      type: 'integer',
      minimum: 1
    },
    completed: {
      type: 'boolean'
    }
  },
  additionalProperties: false
};

const fileUploadSchema = {
  type: 'object',
  required: ['file'],
  properties: {
    file: {
      type: 'object'
    }
  }
};

// Parameter validation schemas
const idParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      pattern: '^[0-9]+$'
    }
  }
};

const paginationQuerySchema = {
  type: 'object',
  properties: {
    page: {
      type: 'string',
      pattern: '^[0-9]+$',
      default: '1'
    },
    limit: {
      type: 'string',
      pattern: '^[0-9]+$',
      default: '20'
    },
    search: {
      type: 'string',
      maxLength: 255
    },
    sortBy: {
      type: 'string',
      enum: ['title', 'created_at', 'updated_at', 'author']
    },
    sortOrder: {
      type: 'string',
      enum: ['asc', 'desc'],
      default: 'desc'
    }
  }
};

// Response schemas for API documentation
const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    username: { type: 'string' },
    email: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }
};

const seriesResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    description: { type: 'string' },
    author: { type: 'string' },
    genre: { type: 'string' },
    status: { type: 'string' },
    cover_path: { type: 'string' },
    page_count: { type: 'integer' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }
};

const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        details: { type: 'object' }
      }
    }
  }
};

module.exports = {
  // Input schemas
  userRegistrationSchema,
  userLoginSchema,
  seriesCreationSchema,
  seriesUpdateSchema,
  readingProgressSchema,
  fileUploadSchema,
  
  // Parameter schemas
  idParamSchema,
  paginationQuerySchema,
  
  // Response schemas
  userResponseSchema,
  seriesResponseSchema,
  errorResponseSchema
};
