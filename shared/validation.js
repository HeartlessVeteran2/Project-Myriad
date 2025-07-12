// Shared validation schemas for web and mobile
import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().min(3).max(32).required(),
});

export const profileSchema = Joi.object({
  username: Joi.string().min(3).max(32),
  bio: Joi.string().max(256),
  avatar: Joi.string().uri().optional(),
});
