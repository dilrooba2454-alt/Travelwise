import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginPlaceholder from './components/LoginPlaceholder';
import HomeDashboard from './components/HomeDashboard';
import HotelsSearchScreen from './components/HotelsSearchScreen';
import TransportSearchScreen from './components/TransportSearchScreen';
import ActivitiesSearchScreen from './components/ActivitiesSearchScreen';
import TripPlannerScreen from './components/TripPlannerScreen';
import TravelAssistantScreen from './components/TravelAssistantScreen';

/**
 * TravelWise Root App Component
 * 
 * Manages screen transitions between:
 * - 'splash': Screen 1 Splash / Welcome Hero
 * - 'login': Screen 2 Login & Sign Up Interface
 * - 'dashboard': Screen 3 TravelWise Home Dashboard
 * - 'hotels': Screen 4 Hotels & Stays Search Results
 * - 'transport': Screen 5 Transport Options & Transit Results
 * - 'activities': Screen 6 Tickets, Tours & Activities Search Results
 * - 'planner': Screen 7 My Trip Planner & Itinerary
 * - 'assistant': Screen 8 AI Travel Assistant & Itinerary Concierge
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [currentUser, setCurrentUser] = useState(null);

  // Search parameters shared across Dashboard, Hotels, Transport, Activities & Planner
  const [searchParams, setSearchParams] = useState({
    destination: 'Munnar',
    departureDate: '2026-10-15',
    returnDate: '2026-10-19',
    travellers: 2
  });

  // Prototype saved stays, transport, and itineraries pre-seeded with sample bookings
  const [savedTrips, setSavedTrips] = useState([
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
  ]);

  // Handle successful prototype login / sign up
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentScreen('dashboard');
  };

  // Handle guest exploration directly from Splash Screen
  const handleContinueAsGuest = () => {
    setCurrentUser({
      name: 'Guest Explorer',
      email: 'guest@travelwise.com',
      isGuest: true
    });
    setCurrentScreen('dashboard');
  };

  // Open Screen 4 (Hotels & Stays) from Dashboard
  const handleOpenHotels = (params) => {
    if (params) {
      setSearchParams(params);
    }
    setCurrentScreen('hotels');
  };

  // Open Screen 5 (Transport Options) from Dashboard
  const handleOpenTransport = (params) => {
    if (params) {
      setSearchParams(params);
    }
    setCurrentScreen('transport');
  };

  // Open Screen 6 (Tickets & Activities) from Dashboard
  const handleOpenActivities = (params) => {
    if (params) {
      setSearchParams(params);
    }
    setCurrentScreen('activities');
  };

  // Open Screen 7 (My Trip Planner) from Dashboard
  const handleOpenPlanner = (params) => {
    if (params) {
      setSearchParams(params);
    }
    setCurrentScreen('planner');
  };

  // Open Screen 8 (AI Travel Assistant) from Dashboard or Planner
  const handleOpenAssistant = (params) => {
    if (params) {
      setSearchParams(params);
    }
    setCurrentScreen('assistant');
  };

  // Handle stay selection on Screen 4
  const handleSelectStay = (stayData) => {
    setSavedTrips((prev) => {
      // Avoid duplicate entries
      const exists = prev.some((item) => (item.id || item.hotelId) === (stayData.id || stayData.hotelId));
      if (exists) return prev;
      return [stayData, ...prev];
    });
  };

  // Handle transport selection on Screen 5
  const handleSelectTransport = (transportData) => {
    setSavedTrips((prev) => {
      // Avoid duplicate entries
      const exists = prev.some((item) => item.id === transportData.id);
      if (exists) return prev;
      return [transportData, ...prev];
    });
  };

  // Handle activity selection on Screen 6
  const handleSelectActivity = (activityData) => {
    setSavedTrips((prev) => {
      // Avoid duplicate entries
      const exists = prev.some((item) => item.id === activityData.id);
      if (exists) return prev;
      return [activityData, ...prev];
    });
  };

  // Remove an item from prototype itinerary
  const handleRemoveTripItem = (itemId) => {
    setSavedTrips((prev) => prev.filter((item) => (item.id || item.hotelId) !== itemId));
  };

  return (
    <div className="app-root">
      {/* Screen 1: Splash Screen */}
      {currentScreen === 'splash' && (
        <SplashScreen
          onGetStarted={() => setCurrentScreen('login')}
          onContinueAsGuest={handleContinueAsGuest}
        />
      )}

      {/* Screen 2: Login & Sign Up */}
      {currentScreen === 'login' && (
        <LoginPlaceholder
          onBack={() => setCurrentScreen('splash')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Screen 3: Home Dashboard */}
      {currentScreen === 'dashboard' && (
        <HomeDashboard
          user={currentUser}
          initialSearchParams={searchParams}
          savedTrips={savedTrips}
          onOpenHotels={handleOpenHotels}
          onOpenTransport={handleOpenTransport}
          onOpenActivities={handleOpenActivities}
          onOpenPlanner={handleOpenPlanner}
          onOpenAssistant={handleOpenAssistant}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onNavigateToSplash={() => setCurrentScreen('splash')}
        />
      )}

      {/* Screen 4: Hotels & Stays Search Results */}
      {currentScreen === 'hotels' && (
        <HotelsSearchScreen
          searchParams={searchParams}
          savedTrips={savedTrips}
          onBackToDashboard={() => setCurrentScreen('dashboard')}
          onEditSearch={() => setCurrentScreen('dashboard')}
          onSelectStay={handleSelectStay}
        />
      )}

      {/* Screen 5: Transport Options & Transit Results */}
      {currentScreen === 'transport' && (
        <TransportSearchScreen
          searchParams={searchParams}
          savedTrips={savedTrips}
          onBackToDashboard={() => setCurrentScreen('dashboard')}
          onEditSearch={() => setCurrentScreen('dashboard')}
          onSelectTransport={handleSelectTransport}
        />
      )}

      {/* Screen 6: Tickets & Activities Search Results */}
      {currentScreen === 'activities' && (
        <ActivitiesSearchScreen
          searchParams={searchParams}
          savedTrips={savedTrips}
          onBackToDashboard={() => setCurrentScreen('dashboard')}
          onEditSearch={() => setCurrentScreen('dashboard')}
          onSelectActivity={handleSelectActivity}
        />
      )}

      {/* Screen 7: My Trip Planner */}
      {currentScreen === 'planner' && (
        <TripPlannerScreen
          searchParams={searchParams}
          savedTrips={savedTrips}
          onRemoveItem={handleRemoveTripItem}
          onBackToDashboard={() => setCurrentScreen('dashboard')}
          onOpenHotels={handleOpenHotels}
          onOpenTransport={handleOpenTransport}
          onOpenActivities={handleOpenActivities}
          onOpenAssistant={handleOpenAssistant}
        />
      )}

      {/* Screen 8: AI Travel Assistant */}
      {currentScreen === 'assistant' && (
        <TravelAssistantScreen
          searchParams={searchParams}
          savedTrips={savedTrips}
          onBackToDashboard={() => setCurrentScreen('dashboard')}
          onOpenPlanner={() => setCurrentScreen('planner')}
          onSelectStay={handleSelectStay}
          onSelectTransport={handleSelectTransport}
          onSelectActivity={handleSelectActivity}
        />
      )}
    </div>
  );
}
