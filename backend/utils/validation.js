import Joi from 'joi';

export const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .required(),
});

export const profileSchema = Joi.object({
  bio: Joi.string().max(500).allow(''),
  avatar: Joi.string().uri().allow(''),
  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark', 'auto').default('auto'),
    language: Joi.string().length(2).default('en'),
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      push: Joi.boolean().default(true),
    }).default({}),
  }).default({}),
});

export const extensionSchema = Joi.object({
  name: Joi.string().required(),
  version: Joi.string()
    .pattern(/^\d+\.\d+\.\d+$/)
    .required(),
  author: Joi.string().required(),
  description: Joi.string().max(1000),
  sources: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      type: Joi.string().valid('manga', 'anime', 'novel').required(),
      baseUrl: Joi.string().uri().required(),
      language: Joi.string().length(2).default('en'),
      nsfw: Joi.boolean().default(false),
    })
  ),
  features: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      entrypoint: Joi.string().required(),
    })
  ),
});

export const accessibilitySchema = Joi.object({
  highContrast: Joi.boolean().default(false),
  fontSize: Joi.string().valid('small', 'medium', 'large').default('medium'),
  textToSpeech: Joi.boolean().default(false),
  colorBlindnessSupport: Joi.string()
    .valid('none', 'protanopia', 'deuteranopia', 'tritanopia')
    .default('none'),
  reducedMotion: Joi.boolean().default(false),
});

export const parentalControlsSchema = Joi.object({
  ageRating: Joi.number().min(0).max(18).required(),
  blockedTags: Joi.array().items(Joi.string()).default([]),
  blockedCategories: Joi.array().items(Joi.string()).default([]),
  timeRestrictions: Joi.object({
    enabled: Joi.boolean().default(false),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }).default({}),
});
