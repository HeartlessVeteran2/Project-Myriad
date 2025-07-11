// Parental controls and content filtering system
export class ParentalControls {
  constructor() {
    this.userProfiles = new Map(); // userId -> parental settings
    this.contentRatings = new Map(); // contentId -> rating info
    this.accessLogs = new Map(); // userId -> access history
    this.defaultSettings = {
      enabled: false,
      maxRating: 'PG-13',
      allowedGenres: ['Adventure', 'Comedy', 'Fantasy', 'Sports'],
      blockedGenres: ['Horror', 'Ecchi', 'Mature'],
      timeRestrictions: {
        enabled: false,
        allowedHours: { start: '06:00', end: '21:00' },
        weekdayLimits: 120, // minutes per day
        weekendLimits: 180,
      },
      requirePinForSettings: true,
      requirePinForMature: true,
      blockUnratedContent: true,
      allowFriends: false,
      allowCommunityFeatures: false,
    };
  }

  // Initialize parental controls for a user
  initializeParentalControls(userId, parentEmail, settings = {}) {
    const profile = {
      userId,
      parentEmail,
      pin: this.generateSecurePin(),
      settings: { ...this.defaultSettings, ...settings },
      createdAt: new Date(),
      lastUpdated: new Date(),
      active: true,
    };

    this.userProfiles.set(userId, profile);
    this.accessLogs.set(userId, []);

    return {
      success: true,
      message: 'Parental controls initialized',
      pin: profile.pin,
    };
  }

  // Enable content filtering
  enableContentFilter(userId, pin) {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return { success: false, message: 'Parental profile not found' };
    }

    if (!this.validatePin(userId, pin)) {
      return { success: false, message: 'Invalid PIN' };
    }

    profile.settings.enabled = true;
    profile.lastUpdated = new Date();

    return {
      success: true,
      message: 'Content filtering enabled',
      settings: profile.settings,
    };
  }

  // Disable content filtering
  disableContentFilter(userId, pin) {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return { success: false, message: 'Parental profile not found' };
    }

    if (!this.validatePin(userId, pin)) {
      return { success: false, message: 'Invalid PIN' };
    }

    profile.settings.enabled = false;
    profile.lastUpdated = new Date();

    return {
      success: true,
      message: 'Content filtering disabled',
    };
  }

  // Check if content is allowed for user
  isContentAllowed(userId, contentInfo) {
    const profile = this.userProfiles.get(userId);
    if (!profile || !profile.settings.enabled) {
      return { allowed: true, reason: null };
    }

    const settings = profile.settings;

    // Check rating
    if (contentInfo.rating && !this.isRatingAllowed(contentInfo.rating, settings.maxRating)) {
      return {
        allowed: false,
        reason: `Content rating ${contentInfo.rating} exceeds allowed rating ${settings.maxRating}`,
      };
    }

    // Check genres
    if (contentInfo.genres) {
      const blockedGenres = contentInfo.genres.filter(genre =>
        settings.blockedGenres.includes(genre)
      );

      if (blockedGenres.length > 0) {
        return {
          allowed: false,
          reason: `Content contains blocked genres: ${blockedGenres.join(', ')}`,
        };
      }

      const allowedGenres = contentInfo.genres.filter(genre =>
        settings.allowedGenres.includes(genre)
      );

      if (allowedGenres.length === 0 && contentInfo.genres.length > 0) {
        return {
          allowed: false,
          reason: 'Content does not contain any allowed genres',
        };
      }
    }

    // Check if unrated content is blocked
    if (settings.blockUnratedContent && !contentInfo.rating) {
      return {
        allowed: false,
        reason: 'Unrated content is blocked',
      };
    }

    // Check time restrictions
    if (settings.timeRestrictions.enabled) {
      const timeCheck = this.checkTimeRestrictions(userId, settings.timeRestrictions);
      if (!timeCheck.allowed) {
        return timeCheck;
      }
    }

    // Log access attempt
    this.logAccess(userId, contentInfo, true);

    return { allowed: true, reason: null };
  }

  // Check if rating is allowed
  isRatingAllowed(contentRating, maxAllowedRating) {
    const ratingHierarchy = {
      G: 1,
      PG: 2,
      'PG-13': 3,
      R: 4,
      'NC-17': 5,
      M: 6,
    };

    const contentLevel = ratingHierarchy[contentRating] || 6;
    const maxLevel = ratingHierarchy[maxAllowedRating] || 1;

    return contentLevel <= maxLevel;
  }

  // Check time restrictions
  checkTimeRestrictions(userId, timeRestrictions) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = currentDay === 0 || currentDay === 6;

    // Check allowed hours
    if (
      currentTime < timeRestrictions.allowedHours.start ||
      currentTime > timeRestrictions.allowedHours.end
    ) {
      return {
        allowed: false,
        reason: `Access not allowed outside of ${timeRestrictions.allowedHours.start}-${timeRestrictions.allowedHours.end}`,
      };
    }

    // Check daily time limits
    const todayUsage = this.getTodayUsage(userId);
    const dailyLimit = isWeekend ? timeRestrictions.weekendLimits : timeRestrictions.weekdayLimits;

    if (todayUsage >= dailyLimit) {
      return {
        allowed: false,
        reason: `Daily time limit of ${dailyLimit} minutes exceeded`,
      };
    }

    return { allowed: true, reason: null };
  }

  // Get today's usage in minutes
  getTodayUsage(userId) {
    const accessLog = this.accessLogs.get(userId) || [];
    const today = new Date().toDateString();

    const todayLogs = accessLog.filter(log => new Date(log.timestamp).toDateString() === today);

    // Calculate total minutes (simplified calculation)
    return todayLogs.length * 2; // Assume 2 minutes per access for simplification
  }

  // Update parental settings
  updateSettings(userId, pin, newSettings) {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return { success: false, message: 'Parental profile not found' };
    }

    if (!this.validatePin(userId, pin)) {
      return { success: false, message: 'Invalid PIN' };
    }

    profile.settings = { ...profile.settings, ...newSettings };
    profile.lastUpdated = new Date();

    return {
      success: true,
      message: 'Parental settings updated',
      settings: profile.settings,
    };
  }

  // Change PIN
  changePin(userId, oldPin, newPin) {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return { success: false, message: 'Parental profile not found' };
    }

    if (!this.validatePin(userId, oldPin)) {
      return { success: false, message: 'Invalid current PIN' };
    }

    if (!this.isValidPinFormat(newPin)) {
      return { success: false, message: 'PIN must be 4-6 digits' };
    }

    profile.pin = this.hashPin(newPin);
    profile.lastUpdated = new Date();

    return {
      success: true,
      message: 'PIN changed successfully',
    };
  }

  // Get user's parental settings (without sensitive info)
  getSettings(userId) {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return null;
    }

    return {
      enabled: profile.settings.enabled,
      maxRating: profile.settings.maxRating,
      allowedGenres: profile.settings.allowedGenres,
      blockedGenres: profile.settings.blockedGenres,
      timeRestrictions: profile.settings.timeRestrictions,
      blockUnratedContent: profile.settings.blockUnratedContent,
      allowFriends: profile.settings.allowFriends,
      allowCommunityFeatures: profile.settings.allowCommunityFeatures,
    };
  }

  // Get access history for parents
  getAccessHistory(userId, pin, days = 7) {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return { success: false, message: 'Parental profile not found' };
    }

    if (!this.validatePin(userId, pin)) {
      return { success: false, message: 'Invalid PIN' };
    }

    const accessLog = this.accessLogs.get(userId) || [];
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const recentLogs = accessLog.filter(log => new Date(log.timestamp) > cutoffDate);

    return {
      success: true,
      history: recentLogs,
      summary: this.generateAccessSummary(recentLogs),
    };
  }

  // Generate access summary
  generateAccessSummary(logs) {
    const summary = {
      totalAccess: logs.length,
      allowedAccess: logs.filter(log => log.allowed).length,
      blockedAccess: logs.filter(log => !log.allowed).length,
      topGenres: {},
      dailyUsage: {},
    };

    logs.forEach(log => {
      // Count genres
      if (log.content.genres) {
        log.content.genres.forEach(genre => {
          summary.topGenres[genre] = (summary.topGenres[genre] || 0) + 1;
        });
      }

      // Count daily usage
      const date = new Date(log.timestamp).toDateString();
      summary.dailyUsage[date] = (summary.dailyUsage[date] || 0) + 1;
    });

    return summary;
  }

  // Generate secure PIN
  generateSecurePin() {
    const pin = Math.floor(Math.random() * 9000) + 1000; // 4-digit PIN
    return this.hashPin(pin.toString());
  }

  // Hash PIN for security
  hashPin(pin) {
    // In a real implementation, use a proper hashing algorithm like bcrypt
    return `hashed_${pin}_${Date.now()}`;
  }

  // Validate PIN
  validatePin(userId, pin) {
    const profile = this.userProfiles.get(userId);
    if (!profile) return false;

    // Simplified validation - in real implementation, compare hashed values
    return profile.pin.includes(pin);
  }

  // Validate PIN format
  isValidPinFormat(pin) {
    return /^\d{4,6}$/.test(pin);
  }

  // Log access attempt
  logAccess(userId, contentInfo, allowed) {
    const accessLog = this.accessLogs.get(userId) || [];

    accessLog.push({
      timestamp: new Date(),
      content: {
        id: contentInfo.id,
        title: contentInfo.title,
        type: contentInfo.type,
        rating: contentInfo.rating,
        genres: contentInfo.genres,
      },
      allowed,
    });

    // Keep only last 1000 entries
    if (accessLog.length > 1000) {
      accessLog.splice(0, accessLog.length - 1000);
    }

    this.accessLogs.set(userId, accessLog);
  }

  // Remove parental controls
  removeParentalControls(userId, pin, parentEmail) {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      return { success: false, message: 'Parental profile not found' };
    }

    if (!this.validatePin(userId, pin) || profile.parentEmail !== parentEmail) {
      return { success: false, message: 'Invalid PIN or email' };
    }

    this.userProfiles.delete(userId);
    this.accessLogs.delete(userId);

    return {
      success: true,
      message: 'Parental controls removed',
    };
  }

  // Get system statistics
  getSystemStats() {
    const profiles = Array.from(this.userProfiles.values());

    return {
      totalProfiles: profiles.length,
      activeProfiles: profiles.filter(p => p.active).length,
      enabledProfiles: profiles.filter(p => p.settings.enabled).length,
      averageUsage: this.calculateAverageUsage(),
      topBlockedGenres: this.getTopBlockedGenres(profiles),
    };
  }

  // Calculate average usage across all users
  calculateAverageUsage() {
    const allLogs = Array.from(this.accessLogs.values()).flat();
    const totalUsers = this.accessLogs.size;

    if (totalUsers === 0) return 0;

    return Math.round(allLogs.length / totalUsers);
  }

  // Get most commonly blocked genres
  getTopBlockedGenres(profiles) {
    const genreCounts = {};

    profiles.forEach(profile => {
      profile.settings.blockedGenres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));
  }
}
