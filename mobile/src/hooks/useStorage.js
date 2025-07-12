import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook for persisting state with AsyncStorage
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {Array} [storedValue, setValue, loading, error]
 */
export const useAsyncStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load value from storage on mount
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        setLoading(true);
        setError(null);
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (err) {
        console.error(`Error loading ${key} from storage:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  // Save value to storage
  const setValue = useCallback(async (value) => {
    try {
      setError(null);
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(`Error saving ${key} to storage:`, err);
      setError(err);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(async () => {
    try {
      setError(null);
      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error(`Error removing ${key} from storage:`, err);
      setError(err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, loading, error, removeValue];
};

/**
 * Custom hook for debouncing values
 * @param {*} value - Value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for previous value tracking
 * @param {*} value - Current value
 * @returns {*} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * Custom hook for component mount status
 * @returns {Object} Mount status utilities
 */
export const useIsMounted = () => {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMounted;
};

/**
 * Custom hook for local storage with expiration
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Array} [value, setValue, loading, error, isExpired]
 */
export const useExpiringStorage = (key, initialValue, ttl = 86400000) => { // 24 hours default
  const [value, setValue, loading, error, removeValue] = useAsyncStorage(key, {
    data: initialValue,
    timestamp: Date.now()
  });

  const isExpired = value && (Date.now() - value.timestamp > ttl);

  const setValueWithTimestamp = useCallback((newValue) => {
    setValue({
      data: newValue,
      timestamp: Date.now()
    });
  }, [setValue]);

  // Auto-remove expired values
  useEffect(() => {
    if (isExpired) {
      removeValue();
    }
  }, [isExpired, removeValue]);

  return [
    isExpired ? initialValue : value?.data,
    setValueWithTimestamp,
    loading,
    error,
    isExpired
  ];
};

export default {
  useAsyncStorage,
  useDebounce,
  usePrevious,
  useIsMounted,
  useExpiringStorage
};
