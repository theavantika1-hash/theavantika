import { Platform } from 'react-native';

/**
 * Backend API Configuration for Delivery Boy App
 */
export const getBackendServerUrl = (): string => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:45000';
    }
    return 'http://localhost:45000';
  }
  return 'https://theavantika.onrender.com';
};

export const BACKEND_BASE_URL = getBackendServerUrl();

export const API_PREFIX = '/api/delivery-boy';

export const getApiBaseUrl = (): string => {
  return `${getBackendServerUrl()}${API_PREFIX}`;
};
