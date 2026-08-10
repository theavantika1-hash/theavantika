import { Platform } from 'react-native';

/**
 * Backend API Configuration for Delivery Boy App
 * 
 * Change BACKEND_BASE_URL below to your backend server URL or local Wi-Fi IP.
 * 
 * Common Examples:
 * - Real Mobile Device (Same Wi-Fi): 'http://192.168.31.19:45000'
 * - Android Emulator default: 'http://10.0.2.2:45000'
 * - iOS Simulator / Local Machine: 'http://localhost:45000'
 * - Live Production Server: 'https://api.yourdomain.com'
 */
export const BACKEND_BASE_URL = 'http://192.168.31.19:45000';

export const API_PREFIX = '/api/delivery-boy';

/**
 * Helper to construct full API request URL cleanly
 */
export const getApiBaseUrl = (): string => {
  const customUrl = BACKEND_BASE_URL ? BACKEND_BASE_URL.trim().replace(/\/+$/, '') : '';
  
  if (customUrl) {
    return `${customUrl}${API_PREFIX}`;
  }

  // Fallback defaults
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:45000${API_PREFIX}`;
  }
  return `http://localhost:45000${API_PREFIX}`;
};
