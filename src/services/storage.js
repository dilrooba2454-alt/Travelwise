/**
 * Centralized Browser Storage Service for TravelWise
 * Phase 3 Data Persistence using browser localStorage.
 * 
 * Features:
 * - Safe read/write/clear operations with robust try/catch blocks
 * - Graceful fallback if localStorage is disabled, full, or throws SecurityError
 * - Data validation to sanitize and ignore corrupted or invalid entries
 * - Initialization tracking to prevent demo items from overwriting user data on refresh
 * - Strictly stores trip itinerary data only (never stores passwords, keys, or secrets)
 */

export const STORAGE_KEY = 'travelwise_saved_trips';
export const STORAGE_INIT_KEY = 'travelwise_trips_initialized';

// Default initial demo itinerary for first-time visitors
export const DEFAULT_DEMO_TRIPS = [
  {
    id: 'hotel-munnar-1',
    hotelId: 'hotel-munnar-1',
    itemType: 'hotel',
    name: 'Tea Valley Cloud Resort & Spa',
    destination: 'Munnar',
    location: 'Chithirapuram, Munnar Hills',
    image: '/munnar-tea.jpg',
    pricePerNight: 4200,
    nights: 3,
    totalEstimatedPrice: 12600,
    departureDate: '2026-10-15',
    returnDate: '2026-10-18',
    date: '2026-10-15',
    travellers: 2
  },
  {
    id: 'tr-vande-bharat-1',
    itemType: 'transport',
    transportType: 'Train',
    name: 'Vande Bharat Express',
    operator: 'Southern Railway (IRCTC)',
    route: 'Kochi (Ernakulam Jn) → Munnar',
    origin: 'Kochi (Ernakulam Jn)',
    destination: 'Munnar',
    departureTime: '07:05 AM',
    arrivalTime: '07:55 AM',
    duration: '50m',
    fare: 480,
    fareType: 'per-person',
    totalEstimatedPrice: 960,
    travellers: 2,
    travelDate: '2026-10-15',
    date: '2026-10-15'
  },
  {
    id: 'act-tea-tour-1',
    itemType: 'activity',
    activityType: 'Plantation Tour',
    name: 'Lockhart Tea Estate Heritage Walking Tour',
    title: 'Lockhart Tea Estate Heritage Walking Tour',
    location: 'Lockhart Estate, Munnar',
    destination: 'Munnar',
    image: '/munnar-tea.jpg',
    duration: '3.5 hours',
    pricePerPerson: 850,
    fare: 850,
    totalEstimatedPrice: 1700,
    travellers: 2,
    travelDate: '2026-10-16',
    date: '2026-10-16'
  }
];

/**
 * Check if browser localStorage is supported and accessible
 */
export function isLocalStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__tw_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize an item to ensure it contains only expected trip itinerary fields
 * and never any sensitive data or circular references.
 */
function sanitizeTripItem(item) {
  if (!item || typeof item !== 'object') return null;

  const sanitized = {
    id: item.id || item.hotelId || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    itemType: item.itemType || 'hotel',
    name: item.name || item.title || 'Trip Item',
    destination: item.destination || 'Kerala',
    location: item.location || item.route || item.origin || '',
    totalEstimatedPrice: Number(item.totalEstimatedPrice || item.fare || item.price || 0),
    date: item.date || item.travelDate || item.departureDate || '2026-10-15',
    travellers: Number(item.travellers || 2)
  };

  // Optional specific properties
  if (item.hotelId) sanitized.hotelId = item.hotelId;
  if (item.image) sanitized.image = item.image;
  if (item.pricePerNight) sanitized.pricePerNight = Number(item.pricePerNight);
  if (item.nights) sanitized.nights = Number(item.nights);
  if (item.departureDate) sanitized.departureDate = item.departureDate;
  if (item.returnDate) sanitized.returnDate = item.returnDate;
  if (item.transportType) sanitized.transportType = item.transportType;
  if (item.operator) sanitized.operator = item.operator;
  if (item.route) sanitized.route = item.route;
  if (item.origin) sanitized.origin = item.origin;
  if (item.departureTime) sanitized.departureTime = item.departureTime;
  if (item.arrivalTime) sanitized.arrivalTime = item.arrivalTime;
  if (item.duration) sanitized.duration = item.duration;
  if (item.fare) sanitized.fare = Number(item.fare);
  if (item.fareType) sanitized.fareType = item.fareType;
  if (item.travelDate) sanitized.travelDate = item.travelDate;
  if (item.activityType) sanitized.activityType = item.activityType;
  if (item.title) sanitized.title = item.title;
  if (item.pricePerPerson) sanitized.pricePerPerson = Number(item.pricePerPerson);

  return sanitized;
}

/**
 * Load saved trips from localStorage.
 * 
 * Logic:
 * - If user has visited before (STORAGE_INIT_KEY is true): returns the saved trips (even if empty []).
 * - If user is visiting for the first time: initializes with DEFAULT_DEMO_TRIPS and persists them.
 * - If localStorage data is corrupted: safely parses what it can or falls back to an empty list.
 */
export function loadSavedTrips() {
  if (!isLocalStorageAvailable()) {
    console.warn('TravelWise: localStorage is not available, falling back to in-memory defaults.');
    return DEFAULT_DEMO_TRIPS;
  }

  try {
    const isInitialized = window.localStorage.getItem(STORAGE_INIT_KEY) === 'true';
    const rawData = window.localStorage.getItem(STORAGE_KEY);

    if (rawData !== null) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        // Sanitize every entry and filter out invalid/corrupt elements
        const validTrips = parsed
          .map(sanitizeTripItem)
          .filter((t) => t !== null && typeof t.id === 'string');
        return validTrips;
      }
    }

    // If initialized previously but storage is empty or invalid array, preserve empty state
    if (isInitialized) {
      return [];
    }

    // First time visit: Seed default demo trips and mark as initialized
    const initialTrips = DEFAULT_DEMO_TRIPS.map(sanitizeTripItem);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTrips));
      window.localStorage.setItem(STORAGE_INIT_KEY, 'true');
    } catch (writeErr) {
      console.warn('TravelWise: Failed to seed initial trips in localStorage:', writeErr);
    }
    return initialTrips;
  } catch (err) {
    console.warn('TravelWise: Error reading trips from localStorage, recovering gracefully:', err);
    return [];
  }
}

/**
 * Persist trips to localStorage.
 * Automatically called upon additions or removals.
 */
export function persistSavedTrips(trips) {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const list = Array.isArray(trips) ? trips : [];
    const sanitized = list.map(sanitizeTripItem).filter((t) => t !== null);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    window.localStorage.setItem(STORAGE_INIT_KEY, 'true');
    return true;
  } catch (err) {
    console.warn('TravelWise: Failed to persist trips to localStorage:', err);
    return false;
  }
}

/**
 * Clear all trips from localStorage and mark as user-cleared.
 * Prevents demo items from re-appearing on subsequent page refreshes.
 */
export function clearSavedTrips() {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.localStorage.setItem(STORAGE_INIT_KEY, 'true');
    return true;
  } catch (err) {
    console.warn('TravelWise: Failed to clear trips from localStorage:', err);
    return false;
  }
}
