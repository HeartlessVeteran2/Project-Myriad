// Accessibility features for inclusive user experience
export class Accessibility {
  constructor() {
    this.settings = new Map(); // userId -> accessibility settings
    this.defaultSettings = {
      screenReader: false,
      highContrast: false,
      largeFonts: false,
      reducedMotion: false,
      colorBlindMode: 'none', // 'none', 'deuteranopia', 'protanopia', 'tritanopia'
      keyboardNavigation: true,
      audioDescriptions: false,
      textToSpeech: false,
      fontSize: 'medium', // 'small', 'medium', 'large', 'extra-large'
      dyslexiaFont: false
    };
  }

  // Get user accessibility settings
  getUserSettings(userId) {
    return this.settings.get(userId) || { ...this.defaultSettings };
  }

  // Update user accessibility settings
  updateUserSettings(userId, newSettings) {
    const currentSettings = this.getUserSettings(userId);
    const updatedSettings = { ...currentSettings, ...newSettings };
    this.settings.set(userId, updatedSettings);
    return updatedSettings;
  }

  // Enable screen reader support
  enableScreenReader(userId) {
    const settings = this.getUserSettings(userId);
    settings.screenReader = true;
    this.settings.set(userId, settings);
    return {
      success: true,
      message: 'Screen reader support enabled',
      ariaLabels: this.generateAriaLabels(),
      keyboardShortcuts: this.getKeyboardShortcuts()
    };
  }

  // Enable high contrast mode
  enableHighContrast(userId) {
    const settings = this.getUserSettings(userId);
    settings.highContrast = true;
    this.settings.set(userId, settings);
    return {
      success: true,
      message: 'High contrast mode enabled',
      cssOverrides: this.getHighContrastCSS()
    };
  }

  // Enable large fonts
  enableLargeFonts(userId, size = 'large') {
    const settings = this.getUserSettings(userId);
    settings.largeFonts = true;
    settings.fontSize = size;
    this.settings.set(userId, settings);
    return {
      success: true,
      message: `Font size set to ${size}`,
      cssOverrides: this.getFontSizeCSS(size)
    };
  }

  // Enable reduced motion
  enableReducedMotion(userId) {
    const settings = this.getUserSettings(userId);
    settings.reducedMotion = true;
    this.settings.set(userId, settings);
    return {
      success: true,
      message: 'Reduced motion enabled',
      cssOverrides: this.getReducedMotionCSS()
    };
  }

  // Set color blind mode
  setColorBlindMode(userId, mode) {
    const validModes = ['none', 'deuteranopia', 'protanopia', 'tritanopia'];
    if (!validModes.includes(mode)) {
      return { success: false, message: 'Invalid color blind mode' };
    }

    const settings = this.getUserSettings(userId);
    settings.colorBlindMode = mode;
    this.settings.set(userId, settings);
    
    return {
      success: true,
      message: `Color blind mode set to ${mode}`,
      cssOverrides: this.getColorBlindCSS(mode)
    };
  }

  // Enable dyslexia-friendly font
  enableDyslexiaFont(userId) {
    const settings = this.getUserSettings(userId);
    settings.dyslexiaFont = true;
    this.settings.set(userId, settings);
    return {
      success: true,
      message: 'Dyslexia-friendly font enabled',
      cssOverrides: this.getDyslexiaFontCSS()
    };
  }

  // Generate ARIA labels for screen readers
  generateAriaLabels() {
    return {
      navigation: 'Main navigation menu',
      search: 'Search for manga, anime, or novels',
      library: 'Your personal library',
      chapters: 'Chapter list',
      episodes: 'Episode list',
      bookmarks: 'Your bookmarks',
      settings: 'Accessibility settings',
      profile: 'User profile menu',
      notifications: 'Notifications panel'
    };
  }

  // Get keyboard shortcuts
  getKeyboardShortcuts() {
    return {
      'Alt + 1': 'Go to home page',
      'Alt + 2': 'Go to library',
      'Alt + 3': 'Go to search',
      'Alt + 4': 'Go to settings',
      'Ctrl + K': 'Open search',
      'Esc': 'Close modal or menu',
      'Tab': 'Navigate to next element',
      'Shift + Tab': 'Navigate to previous element',
      'Enter': 'Activate button or link',
      'Space': 'Scroll down or activate button'
    };
  }

  // Get high contrast CSS
  getHighContrastCSS() {
    return `
      :root {
        --bg-primary: #000000 !important;
        --bg-secondary: #1a1a1a !important;
        --text-primary: #ffffff !important;
        --text-secondary: #cccccc !important;
        --accent-color: #ffff00 !important;
        --border-color: #ffffff !important;
      }
      
      * {
        background-color: var(--bg-primary) !important;
        color: var(--text-primary) !important;
        border-color: var(--border-color) !important;
      }
      
      a, button {
        color: var(--accent-color) !important;
        text-decoration: underline !important;
      }
    `;
  }

  // Get font size CSS
  getFontSizeCSS(size) {
    const sizes = {
      'small': '0.875rem',
      'medium': '1rem',
      'large': '1.25rem',
      'extra-large': '1.5rem'
    };

    return `
      :root {
        --font-size-base: ${sizes[size] || sizes.medium};
      }
      
      body, p, span, div {
        font-size: var(--font-size-base) !important;
      }
      
      h1 { font-size: calc(var(--font-size-base) * 2.5) !important; }
      h2 { font-size: calc(var(--font-size-base) * 2) !important; }
      h3 { font-size: calc(var(--font-size-base) * 1.75) !important; }
      h4 { font-size: calc(var(--font-size-base) * 1.5) !important; }
      h5 { font-size: calc(var(--font-size-base) * 1.25) !important; }
      h6 { font-size: calc(var(--font-size-base) * 1.1) !important; }
    `;
  }

  // Get reduced motion CSS
  getReducedMotionCSS() {
    return `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
  }

  // Get color blind mode CSS
  getColorBlindCSS(mode) {
    const filters = {
      'deuteranopia': 'filter: url(#deuteranopia-filter)',
      'protanopia': 'filter: url(#protanopia-filter)',
      'tritanopia': 'filter: url(#tritanopia-filter)',
      'none': ''
    };

    return filters[mode] || '';
  }

  // Get dyslexia-friendly font CSS
  getDyslexiaFontCSS() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=OpenDyslexic:wght@400;700&display=swap');
      
      * {
        font-family: 'OpenDyslexic', Arial, sans-serif !important;
      }
    `;
  }

  // Text-to-speech functionality
  async textToSpeech(text, userId) {
    const settings = this.getUserSettings(userId);
    if (!settings.textToSpeech) {
      return { success: false, message: 'Text-to-speech is disabled' };
    }

    // In a real implementation, you would use Web Speech API or a TTS service
    return {
      success: true,
      message: 'Text-to-speech initiated',
      text,
      audioUrl: `/api/tts?text=${encodeURIComponent(text)}`
    };
  }

  // Generate accessibility report
  generateAccessibilityReport(userId) {
    const settings = this.getUserSettings(userId);
    const enabledFeatures = Object.entries(settings)
      .filter(([_key, value]) => value === true || (typeof value === 'string' && value !== 'none'))
      .map(([key]) => key);

    return {
      userId,
      enabledFeatures,
      settings,
      recommendations: this.getAccessibilityRecommendations(settings),
      complianceLevel: this.calculateComplianceLevel(settings)
    };
  }

  // Get accessibility recommendations
  getAccessibilityRecommendations(settings) {
    const recommendations = [];

    if (!settings.screenReader && !settings.keyboardNavigation) {
      recommendations.push('Consider enabling keyboard navigation for better accessibility');
    }

    if (!settings.highContrast && settings.fontSize === 'small') {
      recommendations.push('High contrast mode can improve readability');
    }

    if (settings.reducedMotion === false) {
      recommendations.push('Reduced motion can help users with vestibular disorders');
    }

    return recommendations;
  }

  // Calculate WCAG compliance level
  calculateComplianceLevel(settings) {
    let score = 0;
    const maxScore = 10;

    if (settings.keyboardNavigation) score += 2;
    if (settings.screenReader) score += 2;
    if (settings.highContrast) score += 1;
    if (settings.fontSize !== 'small') score += 1;
    if (settings.reducedMotion) score += 1;
    if (settings.colorBlindMode !== 'none') score += 1;
    if (settings.dyslexiaFont) score += 1;
    if (settings.textToSpeech) score += 1;

    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) return 'AAA';
    if (percentage >= 60) return 'AA';
    if (percentage >= 40) return 'A';
    return 'Below A';
  }

  // Reset settings to default
  resetSettings(userId) {
    this.settings.set(userId, { ...this.defaultSettings });
    return {
      success: true,
      message: 'Accessibility settings reset to default',
      settings: this.defaultSettings
    };
  }
}
