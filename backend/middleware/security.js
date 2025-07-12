import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const securityMiddleware = [
  // Rate limiting
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Security headers
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production'
        ? {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", 'data:', 'https:'],
            },
          }
        : false, // Disable CSP in development for easier debugging
    crossOriginResourcePolicy: false, // Allow CORS
  }),

  // CORS
  cors({
    origin: (origin, callback) => {
      const allowed = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
];

// Validate input using Joi or similar schema
export const validateInput = schema => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res
        .status(400)
        .json({ error: 'Validation Error', details: error.details.map(d => d.message) });
    }
    req.body = value;
    next();
  };
};

export const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (err, req, res, _next) => {
  // Log error stack only in development
  if (process.env.NODE_ENV !== 'test') {
    console.error(err.stack || err);
  }

  if (err.name === 'ValidationError' || err.isJoi) {
    return res.status(400).json({ error: 'Validation Error', details: err.message || err.details });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: 'CORS Error', details: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
