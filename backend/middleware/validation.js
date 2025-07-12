import Joi from 'joi';

// Generic validation middleware
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      });
    }

    req[property] = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  // User registration
  userRegistration: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords must match',
    }),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    birthDate: Joi.date().max('now').optional(),
    acceptTerms: Joi.boolean().valid(true).required(),
  }),

  // User login
  userLogin: Joi.object({
    identifier: Joi.string().required(), // Can be username or email
    password: Joi.string().required(),
    rememberMe: Joi.boolean().optional(),
  }),

  // User update
  userUpdate: Joi.object({
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    email: Joi.string().email().optional(),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().uri().optional(),
    preferences: Joi.object({
      theme: Joi.string().valid('light', 'dark', 'auto').optional(),
      language: Joi.string().length(2).optional(),
      notifications: Joi.object({
        email: Joi.boolean().optional(),
        push: Joi.boolean().optional(),
        newChapters: Joi.boolean().optional(),
        recommendations: Joi.boolean().optional(),
      }).optional(),
    }).optional(),
  }),

  // Password change
  passwordChange: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
      .required(),
    confirmNewPassword: Joi.any().valid(Joi.ref('newPassword')).required(),
  }),

  // Manga/Anime/Novel item
  mediaItem: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    type: Joi.string().valid('manga', 'anime', 'novel').required(),
    description: Joi.string().max(2000).optional(),
    author: Joi.string().max(100).optional(),
    artist: Joi.string().max(100).optional(),
    genres: Joi.array().items(Joi.string().max(50)).max(20).optional(),
    tags: Joi.array().items(Joi.string().max(30)).max(30).optional(),
    status: Joi.string().valid('ongoing', 'completed', 'hiatus', 'cancelled').optional(),
    coverImage: Joi.string().uri().optional(),
    externalId: Joi.string().max(100).optional(),
    source: Joi.string().max(50).optional(),
  }),

  // Reading progress
  readingProgress: Joi.object({
    itemId: Joi.string().required(),
    currentChapter: Joi.number().min(0).optional(),
    currentVolume: Joi.number().min(0).optional(),
    currentEpisode: Joi.number().min(0).optional(),
    status: Joi.string()
      .valid('reading', 'completed', 'paused', 'dropped', 'plan_to_read')
      .required(),
    rating: Joi.number().min(1).max(10).optional(),
    notes: Joi.string().max(1000).optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    favorite: Joi.boolean().optional(),
  }),

  // Community post
  communityPost: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(10).max(10000).required(),
    type: Joi.string().valid('discussion', 'recommendation', 'question', 'review').required(),
    mediaId: Joi.string().optional(),
    tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
    spoilerWarning: Joi.boolean().optional(),
  }),

  // Comment
  comment: Joi.object({
    content: Joi.string().min(1).max(2000).required(),
    parentId: Joi.string().optional(),
    spoilerWarning: Joi.boolean().optional(),
  }),

  // Search query
  search: Joi.object({
    query: Joi.string().min(1).max(200).required(),
    type: Joi.string().valid('manga', 'anime', 'novel', 'all').optional(),
    genres: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('ongoing', 'completed', 'hiatus', 'cancelled').optional(),
    limit: Joi.number().min(1).max(100).default(20),
    offset: Joi.number().min(0).default(0),
    sortBy: Joi.string()
      .valid('relevance', 'title', 'rating', 'updated', 'created')
      .default('relevance'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),

  // File upload
  fileUpload: Joi.object({
    filename: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'image/webp').required(),
    size: Joi.number().max(10485760).required(), // 10MB max
  }),
};

// Specific validation middlewares
export const validateUserRegistration = validate(schemas.userRegistration);
export const validateUserLogin = validate(schemas.userLogin);
export const validateUserUpdate = validate(schemas.userUpdate);
export const validatePasswordChange = validate(schemas.passwordChange);
export const validateMediaItem = validate(schemas.mediaItem);
export const validateReadingProgress = validate(schemas.readingProgress);
export const validateCommunityPost = validate(schemas.communityPost);
export const validateComment = validate(schemas.comment);
export const validateSearch = validate(schemas.search, 'query');
export const validatePagination = validate(schemas.pagination, 'query');
