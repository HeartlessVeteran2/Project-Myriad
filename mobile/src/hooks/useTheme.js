import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook for managing theme preferences with system detection
 * @returns {Object} Theme management utilities
 */
export const useTheme = () => {
  const [theme, setTheme] = useState('auto');
  const [effectiveTheme, setEffectiveTheme] = useState('light');
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Calculate effective theme
  useEffect(() => {
    const newEffectiveTheme = theme === 'auto' ? systemTheme : theme;
    setEffectiveTheme(newEffectiveTheme);
  }, [theme, systemTheme]);

  // Save theme preference
  const updateTheme = useCallback(async (newTheme) => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  }, [effectiveTheme, updateTheme]);

  return {
    theme,
    effectiveTheme,
    systemTheme,
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light',
    isAuto: theme === 'auto',
    setTheme: updateTheme,
    toggleTheme
  };
};

export default useTheme;
