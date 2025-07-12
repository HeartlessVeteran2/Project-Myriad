import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT Authentication middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      code: 'NO_TOKEN',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      });
    }
    req.user = user;
    next();
  });
};

// Optional authentication middleware (doesn't reject if no token)
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

// Role-based authorization middleware
export const requireRole = role => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NO_AUTH',
      });
    }

    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_ROLE',
        required: role,
        current: req.user.role,
      });
    }

    next();
  };
};

// Admin only middleware
export const requireAdmin = requireRole('admin');

// Moderator or admin middleware
export const requireModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'NO_AUTH',
    });
  }

  if (!['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({
      error: 'Moderator permissions required',
      code: 'INSUFFICIENT_ROLE',
      required: 'moderator',
      current: req.user.role,
    });
  }

  next();
};

// API Key authentication middleware
export const authenticateApiKey = (req, res, next) => {
  const apiKey = req.get('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      code: 'NO_API_KEY',
    });
  }

  // In a real application, you'd validate against a database
  // For now, we'll use a simple check
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];

  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key',
      code: 'INVALID_API_KEY',
    });
  }

  req.apiKey = apiKey;
  next();
};

// User ownership middleware (user can only access their own data)
export const requireOwnership = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'NO_AUTH',
      });
    }

    const resourceUserId = req.params[userIdParam] || req.body[userIdParam];

    if (req.user.role === 'admin') {
      return next(); // Admins can access any user's data
    }

    if (req.user.id !== resourceUserId && req.user.userId !== resourceUserId) {
      return res.status(403).json({
        error: 'Access denied - not your resource',
        code: 'NOT_OWNER',
      });
    }

    next();
  };
};

// Generate JWT token
export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Hash password
export const hashPassword = async password => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
