/**
 * Centralized API Service for TravelWise
 * Handles fetching configuration and health status from Express backend
 * with graceful fallback if the backend is offline.
 */

// Read backend URL from Vite environment variable (default: http://localhost:5000)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Sensible default fallback configuration when backend is offline
export const DEFAULT_APP_CONFIG = {
  appName: 'TravelWise',
  tagline: 'Plan · Book · Explore',
  heading: 'Your Next Adventure Starts Here',
  description: 'Find the best hotels, transport options and plan your perfect trip — all in one place.',
  status: 'offline-fallback'
};

/**
 * Fetch application configuration from the backend.
 * Returns the backend response or gracefully falls back to default config.
 */
export async function fetchAppConfig() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/app-config`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        appName: data.appName || DEFAULT_APP_CONFIG.appName,
        tagline: data.tagline || DEFAULT_APP_CONFIG.tagline,
        heading: data.heading || DEFAULT_APP_CONFIG.heading,
        description: data.description || DEFAULT_APP_CONFIG.description
      },
      isOffline: false,
      error: null
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Backend unavailable, using fallback configuration:', err.message);
    return {
      success: false,
      data: DEFAULT_APP_CONFIG,
      isOffline: true,
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message
    };
  }
}

/**
 * Check backend health status
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return { healthy: false };
    const data = await response.json();
    return { healthy: true, data };
  } catch {
    return { healthy: false };
  }
}
