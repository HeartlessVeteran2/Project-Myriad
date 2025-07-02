const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ValidationError } = require('../../../lib/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

async function hashPassword(password) {
  try {
    if (!password || password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }
    return await bcrypt.hash(password, 12);
  } catch (error) {
    if (error.isOperational) throw error;
    throw new AuthenticationError('Failed to hash password');
  }
}

async function comparePassword(password, hash) {
  try {
    if (!password || !hash) {
      throw new ValidationError('Password and hash are required');
    }
    return await bcrypt.compare(password, hash);
  } catch (error) {
    if (error.isOperational) throw error;
    throw new AuthenticationError('Failed to verify password');
  }
}

function generateToken(payload) {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new ValidationError('Token payload must be an object');
    }
    
    if (JWT_SECRET === 'dev_secret' && process.env.NODE_ENV === 'production') {
      throw new AuthenticationError('JWT secret not configured for production');
    }
    
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '7d',
      issuer: 'project-myriad',
      audience: 'project-myriad-users'
    });
  } catch (error) {
    if (error.isOperational) throw error;
    throw new AuthenticationError('Failed to generate token');
  }
}

function verifyToken(token) {
  try {
    if (!token) {
      throw new AuthenticationError('Token is required');
    }
    
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'project-myriad',
      audience: 'project-myriad-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    }
    throw new AuthenticationError('Token verification failed');
  }
}

module.exports = { hashPassword, comparePassword, generateToken, verifyToken };
