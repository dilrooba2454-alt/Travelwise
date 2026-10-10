import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  Users,
  Train,
  Bus,
  Car,
  Ship,
  Clock,
  SlidersHorizontal,
  ShieldAlert,
  CheckCircle2,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Navigation,
  ArrowRight,
  Filter
} from 'lucide-react';

/**
 * Screen 5: Transport Options & Transit Results
 * 
 * Features:
 * - Top header with TravelWise branding, Back to Dashboard button, and Edit Search action
 * - Preserves destination, departure date, and traveller count from the Dashboard
 * - Interactive transit search controls for Origin, Destination, Travel Date, and Transport Mode
 * - Realistic Kerala transport options across 4 modes: Trains, Buses, Cabs/Taxis, and Ferries
 * - Operator names, departure/arrival times, estimated duration, and illustrative fares in INR
 * - Dynamic filtering by transport mode, maximum fare slider, and sorting (lowest fare, shortest duration, earliest departure)
 * - View Details modal with journey breakdown, route timeline, vehicle features, and fare calculation
 * - "Select Transport" action that saves the selected transit option to the prototype My Trips state
 * - Transparent prototype data notices throughout
 */

export const SAMPLE_TRANSPORTS = [
  {
    id: 'tr-vande-bharat-1',
    name: 'Vande Bharat Express',
    type: 'Train',
    operator: 'Southern Railway (IRCTC)',
    number: '20632 / 20631',
    origin: 'Kochi (Ernakulam Jn)',
    destination: 'Alleppey',
    departureTime: '07:05 AM',
    arrivalTime: '07:55 AM',
    duration: '50m',
    durationMinutes: 50,
    fare: 480,
    fareType: 'per-person',
    badge: 'Fastest Transit',
    rating: 4.9,
    reviews: 620,
    vehicle: 'Executive AC Chair Car (Electric Trainset)',
    amenities: ['Air Conditioned Coach', 'Onboard Catering Options', 'USB Charging Sockets', 'Panoramic Sealed Windows', 'Free Bottled Water'],
    description: 'Kerala’s flagship high-speed semi-bullet express connecting Kochi to backwater stations in comfort with plush 180° rotatable reclining chairs.'
  },
  {
    id: 'tr-ksrtc-swift-1',
    name: 'KSRTC SWIFT Super Fast',
    type: 'Bus',
    operator: 'KSRTC SWIFT Premium Services',
    number: 'SWIFT-AC-104',
    origin: 'Kochi (Vyttila Mobility Hub)',
    destination: 'Munnar',
    departureTime: '06:30 AM',
    arrivalTime: '10:45 AM',
    duration: '4h 15m',
    durationMinutes: 255,
    fare: 320,
    fareType: 'per-person',
    badge: 'Scenic Hill Route',
    rating: 4.7,
    reviews: 430,
    vehicle: 'Air-Suspension AC Semi-Sleeper Coach',
    amenities: ['Comfort Climate AC', 'Reclining Push-Back Seats', 'Mobile Charging Ports', 'Scenic Waterfall Viewstops', 'Overhead Luggage Racks'],
    description: 'Direct mountain express winding through mist-clad tea slopes and Cheeyappara waterfalls up to Munnar central bus terminal.'
  },
  {
    id: 'tr-suv-chauffeur-1',
    name: 'Private Chauffeur SUV Transfer',
    type: 'Cab',
    operator: 'TravelWise Verified Fleet',
    number: 'KL-07-TW-8820',
    origin: 'Cochin International Airport (COK)',
    destination: 'Munnar',
    departureTime: '08:00 AM (Flexible)',
    arrivalTime: '11:30 AM',
    duration: '3h 30m',
    durationMinutes: 210,
    fare: 2650,
    fareType: 'per-vehicle',
    badge: 'Private & Direct',
    rating: 4.9,
    reviews: 290,
    vehicle: 'Toyota Innova Crysta (6-Passenger SUV)',
    amenities: ['Doorstep Hotel/Airport Pickup', 'English & Local Language Driver', 'Flexible Photography Stops', 'Toll Fees & Fuel Included', 'Ample Boot Luggage Space'],
    description: 'Exclusive air-conditioned SUV transfer with dedicated driver, offering customizable photo stops at spice plantations and tea terraces.'
  },
  {
    id: 'tr-swtd-ferry-1',
    name: 'State Water Transport Ferry',
    type: 'Ferry',
    operator: 'SWTD Kerala State Water Transport',
    number: 'SWTD-Express-08',
    origin: 'Alleppey Main Boat Jetty',
    destination: 'Kottayam (Kumarakom)',
    departureTime: '09:00 AM',
    arrivalTime: '11:15 AM',
    duration: '2h 15m',
    durationMinutes: 135,
    fare: 120,
    fareType: 'per-person',
    badge: 'Eco-Scenic Choice',
    rating: 4.8,
    reviews: 510,
    vehicle: 'Twin-Engine Steel Backwater Passenger Vessel',
    amenities: ['Open Observation Sundeck', 'Life Jackets & Marine Safety Gear', 'Paddy Canal Navigation', 'Bicycle Transport Permitted', 'Low Carbon Transit'],
    description: 'Peaceful public water commute navigating narrow palm backwaters, historic village footbridges, and duck farms across Lake Vembanad.'
  },
  {
    id: 'tr-jan-shatabdi-1',
    name: 'Jan Shatabdi Coastal Express',
    type: 'Train',
    operator: 'Indian Railways (Southern Railway)',
    number: '12075 / 12076',
    origin: 'Kochi (Ernakulam Jn)',
    destination: 'Kovalam (via Trivandrum Central)',
    departureTime: '05:40 PM',
    arrivalTime: '09:05 PM',
    duration: '3h 25m',
    durationMinutes: 205,
    fare: 290,
    fareType: 'per-person',
    badge: 'Best Value',
    rating: 4.6,
    reviews: 780,
    vehicle: 'Second Class AC Chair Car',
    amenities: ['Reserved Seating', 'Air Conditioned Coach', 'Wide Legroom Space', 'Direct Coastal Rail Corridor', 'Pantry Food Vendors'],
    description: 'Speedy intercity train connecting Kochi directly to Trivandrum Central station, situated just 20 minutes from Kovalam Lighthouse beach.'
  },
  {
    id: 'tr-garuda-scania-1',
    name: 'Garuda Maharaja AC Sleeper',
    type: 'Bus',
    operator: 'KSRTC Inter-District Premium',
    number: 'KL-15-A-9012',
    origin: 'Kochi (Vyttila Mobility Hub)',
    destination: 'Wayanad (Kalpetta)',
    departureTime: '10:00 PM',
    arrivalTime: '05:30 AM',
    duration: '7h 30m',
    durationMinutes: 450,
    fare: 750,
    fareType: 'per-person',
    badge: 'Overnight Sleeper',
    rating: 4.8,
    reviews: 340,
    vehicle: 'Multi-Axle Scania AC Sleeper Coach',
    amenities: ['Full Flat Reclining Berth', 'Sanitized Bed Linen & Blanket', 'Individual Privacy Curtain', 'Smooth Multi-Axle Air Brakes', 'Personal USB Port'],
    description: 'Overnight luxury sleeper bus climbing Thamarassery Churam hairpin curves while passengers sleep, arriving in misty Wayanad at dawn.'
  },
  {
    id: 'tr-sedan-cab-1',
    name: 'Express Highway Sedan Taxi',
    type: 'Cab',
    operator: 'TravelWise QuickCab Fleet',
    number: 'KL-04-AB-3421',
    origin: 'Kochi (Ernakulam South)',
    destination: 'Alleppey (Marari Beach / Jetty)',
    departureTime: '09:30 AM (On-Demand)',
    arrivalTime: '10:50 AM',
    duration: '1h 20m',
    durationMinutes: 80,
    fare: 1400,
    fareType: 'per-vehicle',
    badge: 'Fast & Private',
    rating: 4.7,
    reviews: 215,
    vehicle: 'Maruti Suzuki Dzire (4-Seater AC Sedan)',
    amenities: ['Direct Door-to-Door Service', 'Full AC Climate Control', 'All Tolls & Parking Included', 'Sanitized Vehicle Interior', 'Complimentary Bottled Water'],
    description: 'Affordable private AC sedan connecting Ernakulam city directly to your resort or houseboat jetty in Alleppey in just over an hour.'
  },
  {
    id: 'tr-vega-ferry-1',
    name: 'Vega AC Fast Catamaran',
    type: 'Ferry',
    operator: 'SWTD Fast Craft Division',
    number: 'VEGA-CAT-02',
    origin: 'Vaikom Pier',
    destination: 'Kochi (Fort Kochi Customs Jetty)',
    departureTime: '08:15 AM',
    arrivalTime: '09:45 AM',
    duration: '1h 30m',
    durationMinutes: 90,
    fare: 180,
    fareType: 'per-person',
    badge: 'Scenic Catamaran',
    rating: 4.9,
    reviews: 190,
    vehicle: 'High-Speed Twin-Hull Catamaran',
    amenities: ['Air Conditioned Main Cabin', 'Panoramic Ocean/Backwater Windows', 'Avoids City Traffic Jams', 'Life Jackets for All', 'Onboard Snack Counter'],
    description: 'Modern high-speed catamaran cruising scenic Vembanad backwaters straight into Fort Kochi harbor, skipping highway congestion.'
  }
];

export default function TransportSearchScreen({
  searchParams,
  savedTrips = [],
  onBackToDashboard,
  onEditSearch,
  onSelectTransport
}) {
  // Safe defaults from preserved searchParams
  const initialDestination = searchParams?.destination || 'Munnar';
  const initialDepartureDate = searchParams?.departureDate || '2026-10-15';
  const initialTravellers = searchParams?.travellers || 2;

  // Search Controls State
  const [selectedOrigin, setSelectedOrigin] = useState('Kochi (Cochin)');
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [travelDate, setTravelDate] = useState(initialDepartureDate);
  const [travellers, setTravellers] = useState(initialTravellers);

  // Filters State
  const [filterType, setFilterType] = useState('All'); // 'All', 'Train', 'Bus', 'Cab', 'Ferry'
  const [maxFare, setMaxFare] = useState(3000); // INR slider bounds 100 - 3000
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'fare-low', 'fare-high', 'duration-short', 'departure-early'

  // Modal State
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectionConfirmed, setSelectionConfirmed] = useState(false);

  // Filter and sort transport options
  const filteredTransports = useMemo(() => {
    return SAMPLE_TRANSPORTS.filter((item) => {
      // 1. Filter by transport type
      if (filterType !== 'All' && item.type.toLowerCase() !== filterType.toLowerCase()) {
        return false;
      }

      // 2. Filter by max fare
      // Calculate effective fare (if per-vehicle, compared directly; if per-person, compared per person)
      if (item.fare > maxFare) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'fare-low') {
        return a.fare - b.fare;
      }
      if (sortBy === 'fare-high') {
        return b.fare - a.fare;
      }
      if (sortBy === 'duration-short') {
        return a.durationMinutes - b.durationMinutes;
      }
      if (sortBy === 'departure-early') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      // 'recommended'
      return b.rating - a.rating;
    });
  }, [filterType, maxFare, sortBy]);

  // Reset filters to defaults
  const handleResetFilters = () => {
    setFilterType('All');
    setMaxFare(3000);
    setSortBy('recommended');
  };

  // Helper to render mode icon
  const renderModeIcon = (type, size = 18) => {
    switch (type.toLowerCase()) {
      case 'train':
        return <Train size={size} className="transit-mode-icon train" />;
      case 'bus':
        return <Bus size={size} className="transit-mode-icon bus" />;
      case 'cab':
        return <Car size={size} className="transit-mode-icon cab" />;
      case 'ferry':
        return <Ship size={size} className="transit-mode-icon ferry" />;
      default:
        return <Navigation size={size} className="transit-mode-icon" />;
    }
  };

  // Confirm selection into prototype itinerary
  const handleConfirmSelect = (transport) => {
    const totalFare = transport.fareType === 'per-vehicle'
      ? transport.fare
      : transport.fare * travellers;

    if (onSelectTransport) {
      onSelectTransport({
        id: transport.id,
        itemType: 'transport',
        transportType: transport.type,
        name: transport.name,
        operator: transport.operator,
        route: `${selectedOrigin} → ${selectedDestination}`,
        origin: selectedOrigin,
        destination: selectedDestination,
        departureTime: transport.departureTime,
        arrivalTime: transport.arrivalTime,
        duration: transport.duration,
        fare: transport.fare,
        fareType: transport.fareType,
        totalEstimatedPrice: totalFare,
        travellers,
        travelDate,
        date: travelDate,
        vehicle: transport.vehicle
      });
    }
    setSelectionConfirmed(true);
  };

  return (
    <div className="transport-page-container">
      {/* ---------------- 1. TOP HEADER & SUMMARY NAVIGATION ---------------- */}
      <header className="transport-top-header">
        <div className="transport-header-top-row">
          <div className="transport-nav-left">
            <button
              id="btn-back-to-dashboard"
              type="button"
              className="btn-back-nav"
              onClick={onBackToDashboard}
              title="Return to Screen 3 Dashboard"
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </button>

            <div className="transport-header-brand">
              <Bus size={22} className="brand-transport-icon" />
              <h1 className="transport-page-title">Transport Options & Transit Hub</h1>
            </div>
          </div>

          <button
            id="btn-edit-search"
            type="button"
            className="btn-edit-search"
            onClick={onEditSearch}
            title="Modify destination and travel parameters on Dashboard"
          >
            <Search size={16} />
            <span>Edit Search</span>
          </button>
        </div>

        {/* Route & Travel Parameter Bar */}
        <div className="transport-summary-bar">
          <div className="summary-pill">
            <Navigation size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Route</span>
              <span className="pill-val">{selectedOrigin} → {selectedDestination}</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-pill">
            <Calendar size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Travel Date</span>
              <span className="pill-val">{travelDate}</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-pill">
            <Users size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Travellers</span>
              <span className="pill-val">{travellers} {travellers === 1 ? 'Passenger' : 'Passengers'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- 2. PROTOTYPE NOTICE BANNER ---------------- */}
      <div className="transport-notice-container">
        <div className="transport-demo-alert">
          <ShieldAlert size={18} className="demo-alert-icon" />
          <span>
            <strong>Demo results only:</strong> Transport schedules, operator names, and fares are illustrative for Screen 5 testing and not live booking data. IRCTC / KSRTC live reservation APIs will be connected in future milestones.
          </span>
        </div>
      </div>

      {/* ---------------- 3. MAIN TRANSIT LAYOUT ---------------- */}
      <main className="transport-main-layout">
        {/* Filters Sidebar */}
        <aside className="transport-filter-sidebar">
          <div className="sidebar-header-row">
            <div className="sidebar-title-group">
              <SlidersHorizontal size={18} color="#0866F5" />
              <h3>Filter Transport</h3>
            </div>
            <button
              id="btn-reset-filters"
              type="button"
              className="btn-reset-filters"
              onClick={handleResetFilters}
              title="Reset all filters to defaults"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Route Modifier */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="select-transit-destination">
              Destination Point
            </label>
            <select
              id="select-transit-destination"
              className="filter-select"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
            >
              <option value="Munnar">Munnar (High Ranges)</option>
              <option value="Alleppey">Alleppey (Backwaters)</option>
              <option value="Kovalam">Kovalam (Beaches / Trivandrum)</option>
              <option value="Kochi">Kochi (Fort Kochi & Port)</option>
              <option value="Wayanad">Wayanad (Rainforest Hills)</option>
            </select>
          </div>

          {/* Filter 1: Transport Type */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-transport-type">
              Transport Mode
            </label>
            <div className="transport-type-chips">
              {['All', 'Train', 'Bus', 'Cab', 'Ferry'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  id={`btn-mode-${mode.toLowerCase()}`}
                  className={`type-chip-btn ${filterType === mode ? 'active' : ''}`}
                  onClick={() => setFilterType(mode)}
                >
                  {mode === 'Train' && <Train size={14} />}
                  {mode === 'Bus' && <Bus size={14} />}
                  {mode === 'Cab' && <Car size={14} />}
                  {mode === 'Ferry' && <Ship size={14} />}
                  {mode === 'All' && <Filter size={14} />}
                  <span>{mode}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter 2: Maximum Estimated Fare Slider */}
          <div className="filter-group">
            <div className="filter-label-row">
              <span className="filter-label">Max Estimated Fare</span>
              <span className="filter-val-badge">₹{maxFare.toLocaleString()}</span>
            </div>
            <input
              id="filter-fare-slider"
              type="range"
              min="200"
              max="3000"
              step="100"
              className="fare-range-slider"
              value={maxFare}
              onChange={(e) => setMaxFare(Number(e.target.value))}
            />
            <div className="price-slider-bounds">
              <span>₹200</span>
              <span>₹3,000</span>
            </div>
          </div>

          {/* Filter 3: Sorting */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="sort-transport-select">
              Sort By
            </label>
            <select
              id="sort-transport-select"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended (Top Rated)</option>
              <option value="fare-low">Lowest Estimated Fare</option>
              <option value="fare-high">Highest Estimated Fare</option>
              <option value="duration-short">Shortest Journey Duration</option>
              <option value="departure-early">Earliest Departure Time</option>
            </select>
          </div>
        </aside>

        {/* Transport Results Container */}
        <section className="transport-results-container">
          <div className="results-status-bar">
            <div>
              <h2 className="results-heading">
                Available Transit Services ({filteredTransports.length})
              </h2>
              <p className="results-subheading">
                Showing realistic train, bus, cab, and ferry services connecting to {selectedDestination}.
              </p>
            </div>
          </div>

          {/* Cards List */}
          {filteredTransports.length > 0 ? (
            <div className="transport-cards-list">
              {filteredTransports.map((transport) => (
                <article key={transport.id} className="transport-card">
                  {/* Card Header */}
                  <div className="transport-card-header">
                    <div className="operator-group">
                      <div className={`mode-badge ${transport.type.toLowerCase()}`}>
                        {renderModeIcon(transport.type, 16)}
                        <span>{transport.type}</span>
                      </div>
                      <div>
                        <h3 className="transport-title">{transport.name}</h3>
                        <span className="operator-subtext">{transport.operator} • {transport.number}</span>
                      </div>
                    </div>

                    <div className="header-tags-group">
                      <span className="transport-badge-tag">{transport.badge}</span>
                      <div className="transport-rating-pill" title="Demonstration Rating">
                        <span>★ {transport.rating}</span>
                        <span className="rating-sample-tag">(Sample)</span>
                      </div>
                    </div>
                  </div>

                  {/* Journey Route & Time Details */}
                  <div className="transport-timeline-row">
                    <div className="timeline-point departure">
                      <span className="time-val">{transport.departureTime}</span>
                      <span className="station-name">{transport.origin}</span>
                    </div>

                    <div className="timeline-connector">
                      <span className="duration-pill">
                        <Clock size={12} />
                        <span>{transport.duration}</span>
                      </span>
                      <div className="connector-line">
                        <div className="connector-dot start" />
                        <div className="connector-dash" />
                        <div className="connector-dot end" />
                      </div>
                      <span className="route-direct-label">Direct Connection</span>
                    </div>

                    <div className="timeline-point arrival">
                      <span className="time-val">{transport.arrivalTime}</span>
                      <span className="station-name">{selectedDestination}</span>
                    </div>
                  </div>

                  {/* Vehicle Description & Amenity Chips */}
                  <div className="transport-details-middle">
                    <p className="transport-desc">{transport.description}</p>
                    <div className="transport-amenities-row">
                      {transport.amenities.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="amenity-chip">
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Fare & Action Button */}
                  <div className="transport-card-footer">
                    <div className="fare-box">
                      <span className="fare-label">Estimated Fare</span>
                      <div className="fare-amount">
                        ₹{transport.fare.toLocaleString()}
                        <span className="fare-unit">
                          {transport.fareType === 'per-vehicle' ? ' / whole vehicle' : ' / passenger'}
                        </span>
                      </div>
                    </div>

                    <button
                      id={`btn-view-${transport.id}`}
                      type="button"
                      className="btn-view-transport"
                      onClick={() => {
                        setSelectedOption(transport);
                        setSelectionConfirmed(false);
                      }}
                    >
                      <span>View Details</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-transport-fallback">
              <Bus size={44} color="#94A3B8" />
              <h3>No transit options match your active filters</h3>
              <p>Try widening your maximum fare slider or switching your selected transport mode.</p>
              <button
                type="button"
                className="btn-primary-action"
                style={{ width: 'auto', padding: '10px 22px' }}
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ---------------- 4. TRANSPORT DETAILS MODAL ---------------- */}
      {selectedOption && (
        <div className="modal-backdrop" onClick={() => setSelectedOption(null)}>
          <div className="modal-window transport-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-badge">
                {renderModeIcon(selectedOption.type, 20)}
              </div>
              <h3 className="modal-title">{selectedOption.name}</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedOption(null)}
                title="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="transport-modal-body">
              {/* Operator & Type Banner */}
              <div className="modal-transit-banner">
                <div className="banner-mode-pill">
                  {renderModeIcon(selectedOption.type, 16)}
                  <span>{selectedOption.type} Express</span>
                </div>
                <div className="banner-operator-title">
                  <strong>{selectedOption.operator}</strong>
                  <span>Service Code: {selectedOption.number}</span>
                </div>
              </div>

              {/* Journey Route Visual Timeline */}
              <div className="modal-route-card">
                <h4 className="modal-section-title">Transit Route Timeline</h4>
                <div className="modal-timeline-display">
                  <div className="modal-timeline-stop">
                    <span className="stop-time">{selectedOption.departureTime}</span>
                    <span className="stop-location">{selectedOption.origin}</span>
                    <span className="stop-label">Departure</span>
                  </div>

                  <div className="modal-timeline-travel">
                    <span className="travel-duration-badge">
                      <Clock size={13} />
                      <span>{selectedOption.duration} Journey</span>
                    </span>
                    <div className="travel-line-bar" />
                    <span className="travel-type-note">{selectedOption.vehicle}</span>
                  </div>

                  <div className="modal-timeline-stop">
                    <span className="stop-time">{selectedOption.arrivalTime}</span>
                    <span className="stop-location">{selectedDestination}</span>
                    <span className="stop-label">Destination</span>
                  </div>
                </div>
              </div>

              {/* Travel Date & Passengers Summary */}
              <div className="modal-params-summary-row">
                <div className="param-summary-item">
                  <span className="param-label">Travel Date</span>
                  <span className="param-value">{travelDate}</span>
                </div>
                <div className="param-summary-item">
                  <span className="param-label">Passengers</span>
                  <span className="param-value">{travellers} {travellers === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div className="param-summary-item">
                  <span className="param-label">Seat/Class</span>
                  <span className="param-value">Reserved Standard</span>
                </div>
              </div>

              {/* Vehicle Amenities Grid */}
              <div className="modal-amenities-section">
                <h4 className="modal-section-title">Included Onboard Amenities:</h4>
                <div className="modal-amenities-grid">
                  {selectedOption.amenities.map((amenity, i) => (
                    <div key={i} className="modal-amenity-item">
                      <Check size={14} color="#10B981" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Fare Calculation Breakdown */}
              <div className="modal-fare-calc-card">
                <div className="calc-row">
                  <span>Base Fare ({selectedOption.fareType === 'per-vehicle' ? 'Vehicle Flat' : 'Per Passenger'}):</span>
                  <span>₹{selectedOption.fare.toLocaleString()}</span>
                </div>
                {selectedOption.fareType !== 'per-vehicle' && (
                  <div className="calc-row">
                    <span>Passenger Count:</span>
                    <span>× {travellers}</span>
                  </div>
                )}
                <div className="calc-row total-calc-row">
                  <span>Total Estimated Transit Fare:</span>
                  <span className="total-fare-value">
                    ₹{(selectedOption.fareType === 'per-vehicle'
                      ? selectedOption.fare
                      : selectedOption.fare * travellers
                    ).toLocaleString()}
                  </span>
                </div>
                <span className="calc-disclaimer">
                  *Demonstration fare only. Real-time booking charges, peak surcharges, and payment gateways are excluded.
                </span>
              </div>

              {/* Confirmation Toast */}
              {selectionConfirmed && (
                <div className="stay-confirmed-box">
                  <CheckCircle2 size={24} color="#10B981" />
                  <div>
                    <strong>Transport Added to Your Prototype Itinerary!</strong>
                    <p>
                      "{selectedOption.name}" ({selectedOption.type}) has been saved to your active travel session.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="modal-buttons-row">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setSelectedOption(null)}
                >
                  Close
                </button>

                <button
                  id="btn-select-transport-action"
                  type="button"
                  className="btn-modal-submit"
                  onClick={() => handleConfirmSelect(selectedOption)}
                >
                  <Sparkles size={16} />
                  <span>{selectionConfirmed ? '✓ Transport Selected' : 'Select Transport'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
