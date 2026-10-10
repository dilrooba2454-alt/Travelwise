import React, { useState, useEffect } from 'react';
import { Plane, Compass, Hotel, Bus, MapPin, ArrowRight, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { fetchAppConfig, DEFAULT_APP_CONFIG } from '../services/api';

/**
 * SplashScreen Component
 * Screen 1 of TravelWise
 * 
 * Features:
 * - Dynamic config fetching from GET /api/app-config with immediate fallback
 * - High-resolution tropical beach hero with CSS gradient overlay
 * - Stylized dotted flight-path vector with animated airplane
 * - "Get Started" button routing to LoginPlaceholder
 */
export default function SplashScreen({ onGetStarted, onContinueAsGuest }) {
  // Config state initialized immediately with sensible defaults
  const [config, setConfig] = useState(DEFAULT_APP_CONFIG);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [imgError, setImgError] = useState(false);
  const [userNotification, setUserNotification] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      setBackendStatus('checking');
      const result = await fetchAppConfig();

      if (isMounted) {
        if (result.success) {
          setConfig(result.data);
          setBackendStatus('online');
        } else {
          // Graceful fallback: defaults are retained, status set to offline
          setConfig(DEFAULT_APP_CONFIG);
          setBackendStatus('offline');
        }
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGetStartedClick = () => {
    // If backend is offline, we can still proceed smoothly while alerting the user gently if needed
    if (backendStatus === 'offline') {
      setUserNotification('Note: Backend server is offline, running in offline preview mode.');
      // Auto clear notification after 4 seconds
      setTimeout(() => setUserNotification(null), 4000);
    }
    
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div className="splash-container">
      {/* 1. Background Media Layer */}
      {!imgError ? (
        <img
          src="/beach-hero.jpg"
          alt="Tropical paradise destination"
          className="splash-bg-media"
          onError={() => setImgError(true)}
        />
      ) : null}

      {/* 2. Deep Blue Gradient Overlay for High Readability */}
      <div className="splash-overlay" />

      {/* 3. Ambient Lighting Glow */}
      <div className="ambient-glow" />

      {/* 4. Decorative Flight Path & Airplane Motif */}
      <div className="splash-flight-path" aria-hidden="true">
        <svg
          className="flight-path-svg"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Curved Flight Path Trajectory */}
          <path
            d="M -50 720 C 350 780, 500 450, 800 520 C 1100 590, 1250 280, 1380 230"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2.5"
            strokeDasharray="8 10"
          />

          {/* Secondary Arc */}
          <path
            d="M 100 850 C 400 900, 750 700, 1050 760"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />

          {/* Dotted Airport Waypoint Markers */}
          <circle cx="800" cy="520" r="4" fill="rgba(255, 255, 255, 0.7)" />
          <circle cx="1050" cy="760" r="3" fill="rgba(255, 255, 255, 0.5)" />
        </svg>

        {/* Floating Mini Airplane at the end of the path */}
        <div
          className="flying-plane"
          style={{
            position: 'absolute',
            top: '25%',
            right: '8%',
            color: '#FFFFFF',
            opacity: 0.9,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
          }}
        >
          <Plane size={32} style={{ transform: 'rotate(25deg)' }} />
        </div>
      </div>

      {/* 5. Top Header with Brand and API Health Indicator */}
      <header className="splash-header">
        <div className="brand-badge">
          <div className="brand-icon-wrapper">
            <Plane className="brand-icon" size={24} />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">{config.appName}</span>
            <span className="brand-tagline-mini">{config.tagline}</span>
          </div>
        </div>

        {/* Backend Connection Pill */}
        <div
          className="connection-pill"
          title={
            backendStatus === 'online'
              ? 'Backend API connected (http://localhost:5000)'
              : backendStatus === 'offline'
              ? 'Backend offline: Showing fallback configuration'
              : 'Connecting to backend...'
          }
        >
          {backendStatus === 'online' ? (
            <>
              <span className="status-dot online" />
              <span>API Connected</span>
            </>
          ) : backendStatus === 'offline' ? (
            <>
              <span className="status-dot offline" />
              <span>Fallback Mode</span>
            </>
          ) : (
            <>
              <span className="status-dot loading" />
              <span>Connecting...</span>
            </>
          )}
        </div>
      </header>

      {/* 6. Main Hero Centerpiece */}
      <main className="splash-content-wrapper">
        {/* Brand Pill Feature */}
        <div className="hero-logo-box">
          <Plane size={20} color="#FFFFFF" />
          <span className="hero-logo-text">{config.appName}</span>
          <span className="tagline-pill">{config.tagline}</span>
        </div>

        {/* Dynamic Heading & Description from Backend/Fallback */}
        <h1 className="splash-heading">{config.heading}</h1>
        <p className="splash-description">{config.description}</p>

        {/* Feature Pills */}
        <div className="features-pills-row">
          <div className="feature-tag">
            <Hotel size={16} />
            <span>Curated Hotels</span>
          </div>
          <div className="feature-tag">
            <Bus size={16} />
            <span>Transport Options</span>
          </div>
          <div className="feature-tag">
            <MapPin size={16} />
            <span>Smart Itineraries</span>
          </div>
          <div className="feature-tag">
            <ShieldCheck size={16} />
            <span>Zero Booking Fees</span>
          </div>
        </div>

        {/* User Notification Toast (if triggered) */}
        {userNotification && (
          <div className="friendly-toast warning" style={{ marginBottom: '16px' }}>
            <WifiOff size={16} />
            <span>{userNotification}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="splash-actions">
          <button
            id="btn-get-started"
            className="btn-get-started"
            onClick={handleGetStartedClick}
          >
            <span>Get Started</span>
            <ArrowRight size={20} className="btn-arrow-icon" />
          </button>

          <button
            id="btn-guest-explore"
            className="guest-link-btn"
            onClick={() => {
              if (onContinueAsGuest) {
                onContinueAsGuest();
              } else {
                handleGetStartedClick();
              }
            }}
          >
            <Compass size={16} />
            <span>Continue as Guest</span>
          </button>
        </div>
      </main>

      {/* 7. Footer */}
      <footer className="splash-footer">
        <div>© 2026 {config.appName}. Plan · Book · Explore Kerala & Beyond.</div>
        <div className="footer-links">
          <span className="footer-link-item">Screen 1 Prototype</span>
          <span className="footer-link-item">Vite + React + Express</span>
        </div>
      </footer>
    </div>
  );
}
