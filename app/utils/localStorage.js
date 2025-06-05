/**
 * Safe localStorage utilities for Next.js SSR/CSR compatibility
 */
import { useState, useEffect, useCallback } from 'react';

// Check if we're running in the browser
export const isBrowser = () => typeof window !== 'undefined';

// Safe localStorage getter
export const getLocalStorageItem = (key, defaultValue = null) => {
  if (!isBrowser()) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    console.warn(`Error accessing localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

// Safe localStorage setter
export const setLocalStorageItem = (key, value) => {
  if (!isBrowser()) return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Error setting localStorage for key "${key}":`, error);
    return false;
  }
};

// Safe localStorage remover
export const removeLocalStorageItem = (key) => {
  if (!isBrowser()) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing localStorage for key "${key}":`, error);
    return false;
  }
};

// Get multiple localStorage items safely
export const getLocalStorageItems = (keys) => {
  if (!isBrowser()) return {};
  
  const result = {};
  keys.forEach(key => {
    result[key] = getLocalStorageItem(key);
  });
  
  return result;
};

// Client-side hydration hook
export const useClientSideValue = (getValue, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
    setValue(getValue());
    setIsHydrated(true);
  }, [getValue]);
  
  return [value, isHydrated];
};

// Custom hook for localStorage state
export const useLocalStorageState = (key, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    const storedValue = getLocalStorageItem(key, defaultValue);
    setValue(storedValue);
    setIsHydrated(true);
  }, [key, defaultValue]);
  
  const setStoredValue = useCallback((newValue) => {
    setValue(newValue);
    setLocalStorageItem(key, newValue);
  }, [key]);
  
  return [value, setStoredValue, isHydrated];
};
