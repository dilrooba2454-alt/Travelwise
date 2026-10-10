import React, { useState } from 'react';
import {
  Plane,
  Home,
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  Hotel,
  Ticket,
  Bus,
  Star,
  ArrowRight,
  ShieldAlert,
  User,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Info,
  ChevronRight,
  Trash2
} from 'lucide-react';

/**
 * Screen 3: TravelWise Home Dashboard
 * 
 * Features:
 * - Brand Navbar with navigation items (Home, Explore, My Trips, Profile)
 * - Hero banner: "Your next adventure starts here"
 * - Interactive trip search with destination, dates, traveller counter, and validation
 * - 3 interactive service cards: Hotels, Transport, Tickets
 * - Popular Destinations section with rich imagery, ratings, tags, and pricing
 * - Prototype results section with clear disclaimer: no live inventory or confirmed prices claimed
 * - Full desktop and mobile responsiveness
 * - Fluid navigation back to Splash Screen or Login Screen
 */
export default function HomeDashboard({
  user,
  onNavigateToLogin,
  onNavigateToSplash,
  onOpenHotels,
  onOpenTransport,
  onOpenActivities,
  onOpenPlanner,
  onOpenAssistant,
  onRemoveItem,
  onClearAllTrips,
  initialSearchParams,
  savedTrips = []
}) {
  // Mobile nav drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');

  // Search form state - preserve passed search params
  const [destination, setDestination] = useState(initialSearchParams?.destination || 'Munnar');
  const [departureDate, setDepartureDate] = useState(initialSearchParams?.departureDate || '2026-10-15');
  const [returnDate, setReturnDate] = useState(initialSearchParams?.returnDate || '2026-10-19');
  const [travellers, setTravellers] = useState(initialSearchParams?.travellers || 2);
  const [searchErrors, setSearchErrors] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Active service filter: 'all' | 'hotels' | 'transport' | 'tickets'
  const [activeService, setActiveService] = useState('hotels');

  // Interactive modal state for My Trips & Profile
  const [modalType, setModalType] = useState(null); // 'trips' | 'profile' | 'details' | null
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Popular Kerala Destinations mock dataset
  const popularDestinations = [
    {
      id: 'munnar',
      name: 'Munnar',
      subtitle: 'Rolling Tea Hills & Mist',
      image: '/munnar-tea.jpg',
      tag: 'Hill Station',
      rating: 4.9,
      reviews: 1240,
      startingPrice: '₹3,500',
      description: 'Mist-clad rolling tea plantations, cool mountain climate, and cascading waterfalls in the Western Ghats.',
      highlights: ['Tea Museum', 'Eravikulam Park', 'Anamudi Peak']
    },
    {
      id: 'alleppey',
      name: 'Alleppey',
      subtitle: 'Tranquil Houseboats & Backwaters',
      image: '/alleppey-houseboat.jpg',
      tag: 'Backwaters',
      rating: 4.8,
      reviews: 980,
      startingPrice: '₹4,800',
      description: 'Serene palm-fringed canals, traditional wooden houseboats, and peaceful village life on the water.',
      highlights: ['Vembanad Lake', 'Luxury Houseboat', 'Marari Beach']
    },
    {
      id: 'kovalam',
      name: 'Kovalam',
      subtitle: 'Golden Beaches & Cliffs',
      image: '/kovalam-beach.jpg',
      tag: 'Coastal Beaches',
      rating: 4.8,
      reviews: 720,
      startingPrice: '₹3,200',
      description: 'Crescent-shaped sandy beaches, historical striped lighthouse, and world-class Ayurvedic wellness resorts.',
      highlights: ['Lighthouse Beach', 'Hawa Beach', 'Ayurveda Spas']
    },
    {
      id: 'kochi',
      name: 'Kochi (Cochin)',
      subtitle: 'Historic Port & Heritage',
      image: '/beach-hero.jpg',
      tag: 'Heritage & Culture',
      rating: 4.7,
      reviews: 850,
      startingPrice: '₹2,900',
      description: 'Ancient spice port featuring Chinese fishing nets, colonial Portuguese quarters, and art cafés.',
      highlights: ['Fort Kochi', 'Chinese Nets', 'Mattancherry Palace']
    }
  ];

  // Sample Prototype Results dataset
  const sampleResults = [
    {
      id: 1,
      title: 'Tea Valley Resort & Spa',
      location: 'Munnar, Kerala',
      category: 'hotels',
      rating: 4.9,
      reviews: 412,
      price: '₹4,200 / night',
      image: '/munnar-tea.jpg',
      badge: 'Top Pick',
      amenities: ['Free WiFi', 'Breakfast Included', 'Mountain View', 'Ayurveda Spa']
    },
    {
      id: 2,
      title: 'Grand Backwater Luxury Houseboat',
      location: 'Alleppey Lagoon, Kerala',
      category: 'hotels',
      rating: 4.8,
      reviews: 320,
      price: '₹6,500 / night',
      image: '/alleppey-houseboat.jpg',
      badge: 'Bestseller',
      amenities: ['Full Board Meals', 'Air Conditioned', 'Private Chef', 'Sunset Cruise']
    },
    {
      id: 3,
      title: 'Private Chauffeur SUV Transfer',
      location: 'Kochi Airport ⇄ Munnar / Alleppey',
      category: 'transport',
      rating: 4.9,
      reviews: 184,
      price: '₹2,800 total',
      image: '/beach-hero.jpg',
      badge: 'Flexible',
      amenities: ['Experienced Local Driver', 'AC Vehicle', 'Tolls Included', 'Free Cancellation']
    },
    {
      id: 4,
      title: 'Kathakali Performance & Spice Walk Pass',
      location: 'Fort Kochi Cultural Centre',
      category: 'tickets',
      rating: 4.8,
      reviews: 295,
      price: '₹650 per guest',
      image: '/kovalam-beach.jpg',
      badge: 'Instant Pass',
      amenities: ['Makeup Demo Included', 'English Commentary', 'Mobile Ticket', 'Reserved Seating']
    }
  ];

  // Handle Search Submission with Validation
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!destination.trim()) {
      errors.destination = 'Please choose a destination.';
    }

    if (!departureDate) {
      errors.departureDate = 'Please select a departure date.';
    }

    if (!returnDate) {
      errors.returnDate = 'Please select a return date.';
    } else if (departureDate && returnDate < departureDate) {
      errors.returnDate = 'Return date cannot precede departure date.';
    }

    if (travellers < 1) {
      errors.travellers = 'At least 1 traveller is required.';
    }

    if (Object.keys(errors).length > 0) {
      setSearchErrors(errors);
      return;
    }

    setSearchErrors({});
    setIsSearching(true);

    // Simulate search processing
    setTimeout(() => {
      setIsSearching(false);
      setSearchPerformed(true);
      // Scroll to results section smoothly
      const resultsEl = document.getElementById('search-results-section');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  // Quick Select Destination from Cards
  const handleSelectDestination = (destName) => {
    setDestination(destName);
    setSearchPerformed(true);
    const resultsEl = document.getElementById('search-results-section');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="dashboard-container">
      {/* ---------------- 1. TOP NAVBAR ---------------- */}
      <nav className="dashboard-navbar">
        <div className="nav-inner-container">
          {/* Brand Logo */}
          <div className="nav-brand-group" onClick={onNavigateToSplash} title="Return to TravelWise Splash">
            <div className="nav-brand-icon">
              <Plane size={20} />
            </div>
            <div className="nav-brand-text">
              <span className="nav-brand-title">TravelWise</span>
              <span className="nav-brand-tag">Dashboard</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="nav-links-desktop">
            <li>
              <button
                type="button"
                className={`nav-link-btn ${activeNav === 'Home' ? 'active' : ''}`}
                onClick={() => setActiveNav('Home')}
              >
                <Home size={16} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link-btn ${activeNav === 'Explore' ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav('Explore');
                  const el = document.getElementById('popular-destinations');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Compass size={16} />
                <span>Explore</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link-btn ${activeNav === 'My Trips' ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav('My Trips');
                  setModalType('trips');
                }}
              >
                <Calendar size={16} />
                <span>My Trips</span>
                <span className="nav-counter-pill">{savedTrips?.length || 0}</span>
              </button>
            </li>
            <li>
              <button
                id="btn-nav-ai-assistant"
                type="button"
                className={`nav-link-btn ${activeNav === 'Assistant' ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav('Assistant');
                  if (onOpenAssistant) {
                    onOpenAssistant({ destination, departureDate, returnDate, travellers });
                  }
                }}
              >
                <Sparkles size={16} color="#0866F5" />
                <span>AI Assistant</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-link-btn ${activeNav === 'Profile' ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav('Profile');
                  setModalType('profile');
                }}
              >
                <User size={16} />
                <span>Profile</span>
              </button>
            </li>
          </ul>

          {/* Right Action: User Status & Navigation Shortcuts */}
          <div className="nav-right-actions">
            <div
              className="user-session-chip"
              onClick={() => setModalType('profile')}
              title="Click to view prototype user profile"
            >
              <div className="user-avatar-circle">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <span className="user-name-text">
                {user?.name ? user.name : 'Guest Traveler'}
              </span>
            </div>

            <button
              id="btn-nav-switch-auth"
              type="button"
              className="btn-nav-auth-toggle"
              onClick={onNavigateToLogin}
              title="Switch to Login / Sign Up screen"
            >
              <span>Switch Auth</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <button
              type="button"
              className={`mobile-nav-item ${activeNav === 'Home' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('Home');
                setMobileMenuOpen(false);
              }}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button
              type="button"
              className={`mobile-nav-item ${activeNav === 'Explore' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('Explore');
                setMobileMenuOpen(false);
                const el = document.getElementById('popular-destinations');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Compass size={18} />
              <span>Explore</span>
            </button>
            <button
              type="button"
              className={`mobile-nav-item ${activeNav === 'My Trips' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('My Trips');
                setMobileMenuOpen(false);
                setModalType('trips');
              }}
            >
              <Calendar size={18} />
              <span>My Trips ({savedTrips?.length || 0} Saved)</span>
            </button>
            <button
              type="button"
              className={`mobile-nav-item ${activeNav === 'Assistant' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('Assistant');
                setMobileMenuOpen(false);
                if (onOpenAssistant) {
                  onOpenAssistant({ destination, departureDate, returnDate, travellers });
                }
              }}
            >
              <Sparkles size={18} color="#0866F5" />
              <span>AI Assistant (Screen 8)</span>
            </button>
            <button
              type="button"
              className={`mobile-nav-item ${activeNav === 'Profile' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('Profile');
                setMobileMenuOpen(false);
                setModalType('profile');
              }}
            >
              <User size={18} />
              <span>Profile ({user?.name || 'Guest'})</span>
            </button>
            <div className="mobile-nav-divider" />
            <button
              type="button"
              className="mobile-nav-item text-danger"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToSplash();
              }}
            >
              <LogOut size={18} />
              <span>Back to Splash Screen</span>
            </button>
          </div>
        )}
      </nav>

      {/* ---------------- 2. HERO SECTION & TRIP SEARCH ---------------- */}
      <header className="dashboard-hero-section">
        <div className="dashboard-hero-overlay" />
        <div className="hero-content-inner">
          <div className="hero-badge-pill">
            <Sparkles size={14} />
            <span>TravelWise Exploration Hub</span>
          </div>

          <h1 className="hero-title">Your next adventure starts here</h1>
          <p className="hero-subtitle">
            Find the best hotels, transport options, and plan your perfect trip — all in one place.
          </p>

          {/* ---------------- 3. TRIP SEARCH FORM ---------------- */}
          <div className="search-card-wrapper">
            <form onSubmit={handleSearchSubmit} className="trip-search-form" noValidate>
              {/* Destination */}
              <div className="search-field-group">
                <label className="search-label" htmlFor="search-destination">
                  <MapPin size={16} className="search-icon" />
                  <span>Destination</span>
                </label>
                <select
                  id="search-destination"
                  className={`search-select ${searchErrors.destination ? 'has-error' : ''}`}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="Munnar">Munnar, Kerala (Tea Hills)</option>
                  <option value="Alleppey">Alleppey, Kerala (Backwaters)</option>
                  <option value="Kovalam">Kovalam, Kerala (Beaches)</option>
                  <option value="Kochi">Kochi, Kerala (Heritage Port)</option>
                  <option value="Wayanad">Wayanad, Kerala (Rainforest)</option>
                </select>
                {searchErrors.destination && (
                  <span className="search-error-text">{searchErrors.destination}</span>
                )}
              </div>

              {/* Departure Date */}
              <div className="search-field-group">
                <label className="search-label" htmlFor="search-departure">
                  <Calendar size={16} className="search-icon" />
                  <span>Departure</span>
                </label>
                <input
                  id="search-departure"
                  type="date"
                  className={`search-input ${searchErrors.departureDate ? 'has-error' : ''}`}
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
                {searchErrors.departureDate && (
                  <span className="search-error-text">{searchErrors.departureDate}</span>
                )}
              </div>

              {/* Return Date */}
              <div className="search-field-group">
                <label className="search-label" htmlFor="search-return">
                  <Calendar size={16} className="search-icon" />
                  <span>Return</span>
                </label>
                <input
                  id="search-return"
                  type="date"
                  className={`search-input ${searchErrors.returnDate ? 'has-error' : ''}`}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
                {searchErrors.returnDate && (
                  <span className="search-error-text">{searchErrors.returnDate}</span>
                )}
              </div>

              {/* Travellers */}
              <div className="search-field-group">
                <label className="search-label" htmlFor="search-travellers">
                  <Users size={16} className="search-icon" />
                  <span>Travellers</span>
                </label>
                <div className="traveller-counter-box">
                  <button
                    type="button"
                    className="btn-counter"
                    onClick={() => setTravellers(Math.max(1, travellers - 1))}
                    title="Decrease travellers"
                  >
                    -
                  </button>
                  <span className="traveller-count-display">
                    {travellers} {travellers === 1 ? 'Guest' : 'Guests'}
                  </span>
                  <button
                    type="button"
                    className="btn-counter"
                    onClick={() => setTravellers(Math.min(10, travellers + 1))}
                    title="Increase travellers"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Submit Search Button */}
              <div className="search-field-group search-submit-group">
                <button
                  id="btn-execute-search"
                  type="submit"
                  className="btn-search-submit"
                  disabled={isSearching}
                >
                  <Search size={18} />
                  <span>{isSearching ? 'Searching...' : 'Search Trips'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        {/* ---------------- 4. THREE INTERACTIVE SERVICE CARDS ---------------- */}
        <section className="services-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Explore TravelWise Services</h2>
              <p className="section-subtitle">
                Select a category to customize your travel arrangements across Kerala.
              </p>
            </div>
          </div>

          <div className="service-cards-grid">
            {/* Service 1: Hotels */}
            <div
              id="card-service-hotels"
              className={`service-card ${activeService === 'hotels' ? 'active' : ''}`}
              onClick={() => {
                if (onOpenHotels) {
                  onOpenHotels({ destination, departureDate, returnDate, travellers });
                } else {
                  setActiveService('hotels');
                  setSearchPerformed(true);
                }
              }}
            >
              <div className="service-icon-box hotels">
                <Hotel size={26} />
              </div>
              <div className="service-card-body">
                <div className="service-badge">Stays & Resorts</div>
                <h3 className="service-title">Hotels & Stays</h3>
                <p className="service-desc">
                  Luxury houseboats, tea estate villas, and scenic beachside cottages with breakfast included.
                </p>
              </div>
              <div className="service-card-footer">
                <span className="service-link-text">Browse 50+ Stays</span>
                <ArrowRight size={16} />
              </div>
            </div>

            {/* Service 2: Transport */}
            <div
              id="card-service-transport"
              className={`service-card ${activeService === 'transport' ? 'active' : ''}`}
              onClick={() => {
                if (onOpenTransport) {
                  onOpenTransport({ destination, departureDate, returnDate, travellers });
                } else {
                  setActiveService('transport');
                  setSearchPerformed(true);
                }
              }}
            >
              <div className="service-icon-box transport">
                <Bus size={26} />
              </div>
              <div className="service-card-body">
                <div className="service-badge">Transit Hub</div>
                <h3 className="service-title">Transport Options</h3>
                <p className="service-desc">
                  Scenic Vande Bharat trains, private chauffeur SUVs, and traditional backwater ferry routes.
                </p>
              </div>
              <div className="service-card-footer">
                <span className="service-link-text">Compare Routes</span>
                <ArrowRight size={16} />
              </div>
            </div>

            {/* Service 3: Tickets */}
            <div
              id="card-service-tickets"
              className={`service-card ${activeService === 'tickets' ? 'active' : ''}`}
              onClick={() => {
                if (onOpenActivities) {
                  onOpenActivities({ destination, departureDate, returnDate, travellers });
                } else {
                  setActiveService('tickets');
                  setSearchPerformed(true);
                }
              }}
            >
              <div className="service-icon-box tickets">
                <Ticket size={26} />
              </div>
              <div className="service-card-body">
                <div className="service-badge">Activities</div>
                <h3 className="service-title">Tickets & Passes</h3>
                <p className="service-desc">
                  Kathakali cultural dance passes, Periyar boat safaris, spice garden walks, and museum passes.
                </p>
              </div>
              <div className="service-card-footer">
                <span className="service-link-text">Book Experiences</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* AI Travel Assistant Feature Banner (Screen 8 Entry) */}
          <div
            id="banner-ai-assistant-entry"
            className="dashboard-ai-banner"
            onClick={() => {
              if (onOpenAssistant) {
                onOpenAssistant({ destination, departureDate, returnDate, travellers });
              }
            }}
          >
            <div className="ai-banner-left">
              <div className="ai-banner-sparkle-circle">
                <Sparkles size={24} />
              </div>
              <div className="ai-banner-text">
                <div className="ai-banner-badge">
                  <Sparkles size={12} />
                  <span>Screen 8 • AI Concierge</span>
                </div>
                <h3 className="ai-banner-title">Need custom trip ideas or budget planning?</h3>
                <p className="ai-banner-subtitle">
                  Chat with <strong>Aria</strong>, our AI Travel Assistant, to plan 3-day itineraries under ₹8,000, compare transit routes, and optimize your Kerala budget in seconds.
                </p>
              </div>
            </div>
            <button
              id="btn-banner-open-assistant"
              type="button"
              className="btn-ai-banner-action"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenAssistant) {
                  onOpenAssistant({ destination, departureDate, returnDate, travellers });
                }
              }}
            >
              <span>Ask AI Assistant</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ---------------- 5. POPULAR DESTINATIONS SECTION ---------------- */}
        <section id="popular-destinations" className="destinations-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Popular Destinations in Kerala</h2>
              <p className="section-subtitle">
                Handpicked iconic spots known for tea hills, backwaters, golden beaches, and heritage ports.
              </p>
            </div>
            <span className="destinations-count-tag">4 Curated Highlights</span>
          </div>

          <div className="destinations-grid">
            {popularDestinations.map((dest) => (
              <div key={dest.id} className="destination-card">
                <div className="dest-image-wrapper">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="dest-image"
                    loading="lazy"
                  />
                  <span className="dest-tag-pill">{dest.tag}</span>
                  <div className="dest-rating-pill">
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <span>{dest.rating}</span>
                    <span className="dest-reviews-count">({dest.reviews})</span>
                  </div>
                </div>

                <div className="dest-card-content">
                  <div className="dest-header-group">
                    <h3 className="dest-name">{dest.name}</h3>
                    <span className="dest-subtitle">{dest.subtitle}</span>
                  </div>

                  <p className="dest-description">{dest.description}</p>

                  <div className="dest-highlights-list">
                    {dest.highlights.map((item, idx) => (
                      <span key={idx} className="dest-highlight-tag">
                        • {item}
                      </span>
                    ))}
                  </div>

                  <div className="dest-footer-row">
                    <div className="dest-price-box">
                      <span className="price-label">From</span>
                      <span className="price-amount">{dest.startingPrice}</span>
                      <span className="price-unit">/ night</span>
                    </div>

                    <button
                      type="button"
                      className="btn-explore-dest"
                      onClick={() => handleSelectDestination(dest.name)}
                    >
                      <span>Explore</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- 6. PROTOTYPE SEARCH RESULTS SECTION ---------------- */}
        <section id="search-results-section" className="search-results-section">
          {/* Transparent Prototype Disclaimer */}
          <div className="prototype-results-notice">
            <ShieldAlert size={20} className="notice-icon" />
            <div>
              <strong>Prototype Demonstration Results:</strong> Showing sample mock data for{' '}
              <strong>{destination}</strong> ({travellers} {travellers === 1 ? 'Guest' : 'Guests'},{' '}
              {departureDate} to {returnDate}). Live hotel availability, real-time airline APIs, and guaranteed prices
              will be connected in future backend milestones.
            </div>
          </div>

          <div className="results-header-bar">
            <div>
              <h3 className="results-title">
                {searchPerformed ? `Search Results for "${destination}"` : 'Sample Recommended Stays & Services'}
              </h3>
              <p className="results-subtitle">
                Displaying curated sample options matching your selected travel parameters.
              </p>
            </div>

            {/* Results Filter Chips */}
            <div className="results-category-chips">
              <button
                type="button"
                className={`filter-chip ${activeService === 'all' ? 'active' : ''}`}
                onClick={() => setActiveService('all')}
              >
                All Options ({sampleResults.length})
              </button>
              <button
                type="button"
                className={`filter-chip ${activeService === 'hotels' ? 'active' : ''}`}
                onClick={() => setActiveService('hotels')}
              >
                Hotels & Stays
              </button>
              <button
                type="button"
                className={`filter-chip ${activeService === 'transport' ? 'active' : ''}`}
                onClick={() => setActiveService('transport')}
              >
                Transport
              </button>
              <button
                type="button"
                className={`filter-chip ${activeService === 'tickets' ? 'active' : ''}`}
                onClick={() => setActiveService('tickets')}
              >
                Tickets
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="results-cards-grid">
            {sampleResults
              .filter((res) => activeService === 'all' || res.category === activeService)
              .map((item) => (
                <div key={item.id} className="result-card">
                  <div className="result-img-wrapper">
                    <img src={item.image} alt={item.title} className="result-img" />
                    <span className="result-badge-pill">{item.badge}</span>
                  </div>

                  <div className="result-body">
                    <div className="result-meta-row">
                      <div className="result-location">
                        <MapPin size={14} />
                        <span>{item.location}</span>
                      </div>
                      <div className="result-rating">
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <h4 className="result-card-title">{item.title}</h4>

                    <div className="result-amenities-row">
                      {item.amenities.map((am, i) => (
                        <span key={i} className="amenity-chip">
                          ✓ {am}
                        </span>
                      ))}
                    </div>

                    <div className="result-card-bottom">
                      <div>
                        <span className="sample-price-label">Sample Price</span>
                        <div className="sample-price-value">{item.price}</div>
                      </div>

                      <button
                        type="button"
                        className="btn-view-result"
                        onClick={() => {
                          setSelectedItem(item);
                          setModalType('details');
                        }}
                      >
                        <span>View Details</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>

      {/* ---------------- 7. FOOTER ---------------- */}
      <footer className="dashboard-footer">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <Plane size={20} />
              <span>TravelWise</span>
            </div>
            <p className="footer-tagline">
              Plan · Book · Explore. Your reliable travel companion for Kerala and beyond.
            </p>
          </div>

          <div className="footer-navigation-col">
            <div className="footer-links-group">
              <span className="footer-group-title">Navigation</span>
              <button type="button" onClick={() => setActiveNav('Home')}>Home</button>
              <button type="button" onClick={() => setActiveNav('Explore')}>Explore</button>
              <button type="button" onClick={() => setModalType('trips')}>My Trips</button>
            </div>

            <div className="footer-links-group">
              <span className="footer-group-title">Screens</span>
              <button type="button" onClick={onNavigateToSplash}>Screen 1 (Splash)</button>
              <button type="button" onClick={onNavigateToLogin}>Screen 2 (Login/Sign Up)</button>
              <button type="button" className="active">Screen 3 (Dashboard)</button>
              <button
                type="button"
                onClick={() => onOpenHotels && onOpenHotels({ destination, departureDate, returnDate, travellers })}
              >
                Screen 4 (Hotels & Stays)
              </button>
              <button
                type="button"
                onClick={() => onOpenTransport && onOpenTransport({ destination, departureDate, returnDate, travellers })}
              >
                Screen 5 (Transport)
              </button>
              <button
                type="button"
                onClick={() => onOpenActivities && onOpenActivities({ destination, departureDate, returnDate, travellers })}
              >
                Screen 6 (Tickets & Activities)
              </button>
              <button
                type="button"
                onClick={() => onOpenPlanner && onOpenPlanner({ destination, departureDate, returnDate, travellers })}
              >
                Screen 7 (Trip Planner)
              </button>
              <button
                type="button"
                onClick={() => onOpenAssistant && onOpenAssistant({ destination, departureDate, returnDate, travellers })}
              >
                Screen 8 (AI Travel Assistant)
              </button>
            </div>
          </div>
        </div>

        <div className="footer-copyright-bar">
          <div>© 2026 TravelWise. Screen 3 Dashboard Prototype. All rights reserved.</div>
          <div className="footer-disclaimer-note">
            Prototype Demo — No live hotel reservations or airline transactions processed.
          </div>
        </div>
      </footer>

      {/* ---------------- INTERACTIVE MODALS ---------------- */}

      {/* Modal: My Trips */}
      {modalType === 'trips' && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-badge">
                <Calendar size={20} color="#0866F5" />
              </div>
              <h3 className="modal-title">My Saved Itineraries</h3>
              <button type="button" className="btn-modal-close" onClick={() => setModalType(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="trips-modal-body">
              {(!savedTrips || savedTrips.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '28px 16px', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                  <Compass size={36} color="#0866F5" style={{ margin: '0 auto 10px', display: 'block' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#102A56', marginBottom: '4px' }}>No Saved Trips Yet</h4>
                  <p style={{ fontSize: '0.84rem', color: '#64748B', maxWidth: '320px', margin: '0 auto 16px' }}>
                    You haven't saved any stays, transport options, or activities. Explore options to build and persist your itinerary!
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-primary-action"
                      style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      onClick={() => {
                        setModalType(null);
                        if (onOpenHotels) onOpenHotels({ destination, departureDate, returnDate, travellers });
                      }}
                    >
                      Explore Stays
                    </button>
                    <button
                      type="button"
                      className="btn-outline-action"
                      style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      onClick={() => {
                        setModalType(null);
                        if (onOpenTransport) onOpenTransport({ destination, departureDate, returnDate, travellers });
                      }}
                    >
                      Transport
                    </button>
                    <button
                      type="button"
                      className="btn-outline-action"
                      style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      onClick={() => {
                        setModalType(null);
                        if (onOpenActivities) onOpenActivities({ destination, departureDate, returnDate, travellers });
                      }}
                    >
                      Activities
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {savedTrips.map((item, idx) => {
                    let badgeBg = '#0866F5';
                    let badgeText = 'Selected Stay';
                    let datesText = `${item.departureDate} → ${item.returnDate} • ${item.travellers} Guests • ${item.nights} Nights`;
                    let borderCol = '#93C5FD';
                    let cardBg = '#F0F7FF';

                    if (item.itemType === 'transport') {
                      badgeBg = '#10B981';
                      badgeText = `Transport (${item.transportType})`;
                      datesText = `${item.travelDate || item.date} • ${item.travellers} Travellers • ${item.duration || 'Direct'}`;
                      borderCol = '#A7F3D0';
                      cardBg = '#F0FDF4';
                    } else if (item.itemType === 'activity') {
                      badgeBg = '#8B5CF6';
                      badgeText = `Activity (${item.activityType || 'Experience'})`;
                      datesText = `${item.travelDate || item.date} • ${item.travellers} Participants • ${item.duration || 'Tour'}`;
                      borderCol = '#DDD6FE';
                      cardBg = '#F5F3FF';
                    }

                    return (
                      <div
                        key={`saved-${idx}`}
                        className="trip-saved-card"
                        style={{
                          marginTop: idx === 0 ? '0' : '12px',
                          borderColor: borderCol,
                          background: cardBg
                        }}
                      >
                        <div className="trip-saved-header">
                          <strong>{item.name || item.title}</strong>
                          <span
                            className="badge-pill"
                            style={{
                              background: badgeBg,
                              color: '#FFFFFF'
                            }}
                          >
                            {badgeText}
                          </span>
                        </div>
                        <p className="trip-saved-dates">{datesText}</p>
                        <div className="trip-saved-features" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span>✓ {item.route || item.location}</span>
                            <span style={{ marginLeft: '8px', color: '#0866F5' }}>
                              Est: ₹{(item.totalEstimatedPrice || item.fare || item.price || 0).toLocaleString()}
                            </span>
                          </div>
                          {onRemoveItem && (
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id || item.hotelId)}
                              title="Remove item"
                              style={{
                                background: '#FEE2E2',
                                border: 'none',
                                color: '#EF4444',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary row */}
                  <div style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E40AF' }}>
                      Estimated Total ({savedTrips.length} items):
                    </span>
                    <strong style={{ fontSize: '1rem', fontWeight: 800, color: '#0866F5' }}>
                      ₹{savedTrips.reduce((acc, t) => acc + Number(t.totalEstimatedPrice || t.fare || t.price || 0), 0).toLocaleString()}
                    </strong>
                  </div>

                  {/* Clear All Trips with Confirmation */}
                  {confirmClearOpen ? (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.84rem', color: '#991B1B', fontWeight: 600, marginBottom: '8px' }}>
                        Remove all {savedTrips.length} saved trips from your itinerary?
                      </p>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-outline-action"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => setConfirmClearOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          id="btn-confirm-clear-dashboard"
                          type="button"
                          style={{
                            padding: '6px 14px',
                            fontSize: '0.8rem',
                            background: '#EF4444',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            if (onClearAllTrips) onClearAllTrips();
                            setConfirmClearOpen(false);
                          }}
                        >
                          Yes, Clear All
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      id="btn-clear-all-dashboard-modal"
                      type="button"
                      className="btn-outline-action"
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        color: '#EF4444',
                        borderColor: '#FCA5A5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onClick={() => setConfirmClearOpen(true)}
                    >
                      <Trash2 size={15} />
                      <span>Clear All Saved Trips</span>
                    </button>
                  )}
                </>
              )}

              <div className="placeholder-badge" style={{ marginTop: '16px' }}>
                Detailed itinerary editing and day-by-day maps will be built in the Itinerary Planner screen.
              </div>

              <button
                id="btn-open-trip-planner"
                type="button"
                className="btn-primary-action"
                style={{
                  width: '100%',
                  marginTop: '16px',
                  background: 'linear-gradient(135deg, #0866F5 0%, #0052CC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onClick={() => {
                  setModalType(null);
                  if (onOpenPlanner) {
                    onOpenPlanner({ destination, departureDate, returnDate, travellers });
                  }
                }}
              >
                <Sparkles size={16} />
                <span>Open Full Trip Planner (Screen 7)</span>
              </button>

              <button
                id="btn-modal-open-assistant"
                type="button"
                className="btn-outline-action"
                style={{
                  width: '100%',
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderColor: '#93C5FD',
                  color: '#0866F5',
                  background: '#EFF6FF'
                }}
                onClick={() => {
                  setModalType(null);
                  if (onOpenAssistant) {
                    onOpenAssistant({ destination, departureDate, returnDate, travellers });
                  }
                }}
              >
                <Sparkles size={16} />
                <span>Ask AI Assistant to Suggest More (Screen 8)</span>
              </button>

              <button
                type="button"
                className="btn-outline-action"
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => setModalType(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: User Profile */}
      {modalType === 'profile' && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-badge">
                <User size={20} color="#0866F5" />
              </div>
              <h3 className="modal-title">Traveler Profile</h3>
              <button type="button" className="btn-modal-close" onClick={() => setModalType(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="profile-modal-body">
              <div className="profile-card-summary">
                <div className="profile-avatar-large">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
                </div>
                <h4 className="profile-name">{user?.name || 'Demo Traveler'}</h4>
                <p className="profile-email">{user?.email || 'traveler.demo@travelwise.com'}</p>
                <span className="profile-badge">Prototype Verified Traveler</span>
              </div>

              <div className="profile-actions-list">
                <button
                  type="button"
                  className="btn-outline-action"
                  onClick={() => {
                    setModalType(null);
                    onNavigateToLogin();
                  }}
                >
                  Switch Account / Re-login
                </button>
                <button
                  type="button"
                  className="btn-primary-action"
                  onClick={() => {
                    setModalType(null);
                    onNavigateToSplash();
                  }}
                >
                  Sign Out to Splash Screen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Item Details */}
      {modalType === 'details' && selectedItem && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-badge">
                <Info size={20} color="#0866F5" />
              </div>
              <h3 className="modal-title">{selectedItem.title}</h3>
              <button type="button" className="btn-modal-close" onClick={() => setModalType(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="details-modal-body">
              <img src={selectedItem.image} alt={selectedItem.title} className="modal-item-photo" />
              <div className="modal-item-location">
                <MapPin size={15} />
                <span>{selectedItem.location}</span>
                <span className="dot">•</span>
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span>{selectedItem.rating} ({selectedItem.reviews} reviews)</span>
              </div>

              <div className="modal-price-box">
                <span className="modal-price-val">{selectedItem.price}</span>
                <span className="modal-price-note">(Estimated prototype rate)</span>
              </div>

              <div className="placeholder-badge" style={{ marginTop: '16px' }}>
                <strong>Milestone 3 Preview:</strong> Full booking checkout and payment gateway will be configured in subsequent screens.
              </div>

              <button
                type="button"
                className="btn-primary-action"
                style={{ width: '100%', marginTop: '20px' }}
                onClick={() => setModalType(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
