import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/utils/token';

// Read API URL from environment, defaulting to live backend on port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Callback for auth state clearing on 401
let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

/**
 * Request Interceptor: Injects Bearer JWT token from storage into request headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Handles 401 unauthenticated and standardizes error responses
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: unknown }>) => {
    // Automatically purge session when 401 Unauthorized occurs
    if (error.response?.status === 401) {
      tokenStorage.remove();
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }

    // Standardize error message from backend response
    const customMessage =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    const normalizedError = new Error(customMessage);
    (normalizedError as unknown as { response: unknown }).response = error.response;
    return Promise.reject(normalizedError);
  }
);
