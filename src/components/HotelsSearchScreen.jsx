import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  SlidersHorizontal,
  Hotel,
  ShieldAlert,
  CheckCircle2,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

/**
 * Screen 4: Hotels & Stays Search Results
 * 
 * Features:
 * - Search summary banner displaying destination, check-in, check-out, and traveller count
 * - "Edit Search" action returning to Screen 3 search form
 * - Comprehensive filtering by destination, accommodation type, rating, and max price
 * - Sorting by lowest estimated price, highest rating, and recommendations
 * - At least six realistic sample Kerala stays using verified local images
 * - Polished details modal with nightly rate, estimated total, amenities, and "Select Stay" action
 * - Saves selected stay to prototype itinerary state with confirmation
 * - Transparent prototype data notices throughout
 */

export const SAMPLE_HOTELS = [
  {
    id: 'hotel-munnar-1',
    name: 'Tea Valley Cloud Resort & Spa',
    destination: 'Munnar',
    type: 'Luxury Resort',
    image: '/munnar-tea.jpg',
    price: 4200,
    rating: 4.9,
    reviews: 412,
    location: 'Chithirapuram, Munnar Hills',
    description: 'Perched high among mist-shrouded organic tea slopes, offering panoramic valley balconies, evening plantation campfires, and authentic Ayurvedic therapies.',
    amenities: ['Free High-Speed WiFi', 'Organic Breakfast Included', 'Valley-View Balcony', 'Ayurvedic Wellness Spa', 'Plantation Trek Guide'],
    badge: 'Top Pick'
  },
  {
    id: 'hotel-alleppey-1',
    name: 'Grand Vembanad Luxury Houseboat',
    destination: 'Alleppey',
    type: 'Traditional Houseboat',
    image: '/alleppey-houseboat.jpg',
    price: 6800,
    rating: 4.8,
    reviews: 328,
    location: 'Punnamada Jetty, Alleppey',
    description: 'Handcrafted traditional Kettuvallam wooden houseboat cruising palm-fringed backwaters, featuring air-conditioned suites and an onboard private chef.',
    amenities: ['Full Board Chef Meals', 'Air Conditioned Suite', 'Sunset Canal Cruise', 'Private Sundeck', 'Fishing Gear'],
    badge: 'Bestseller'
  },
  {
    id: 'hotel-kovalam-1',
    name: 'Lighthouse Promenade Heritage Villa',
    destination: 'Kovalam',
    type: 'Heritage Villa',
    image: '/kovalam-beach.jpg',
    price: 3600,
    rating: 4.7,
    reviews: 264,
    location: 'Lighthouse Beach Road, Kovalam',
    description: 'Colonial cliff-top villa walking distance from Kovalam’s striped lighthouse, featuring Arabian Sea ocean balconies and direct golden beach access.',
    amenities: ['Direct Beach Access', 'Complimentary Breakfast', 'Ocean-Facing Balcony', 'Ayurveda Treatments', 'Free Parking'],
    badge: 'Scenic View'
  },
  {
    id: 'hotel-kochi-1',
    name: 'Old Harbour Heritage Boutique Hotel',
    destination: 'Kochi',
    type: 'Heritage Villa',
    image: '/beach-hero.jpg',
    price: 2950,
    rating: 4.8,
    reviews: 310,
    location: 'Fort Kochi Heritage Quarter',
    description: 'Restored 300-year-old Portuguese-Dutch heritage mansion in Fort Kochi surrounded by lush garden courtyards, steps away from ancient Chinese fishing nets.',
    amenities: ['Garden Swimming Pool', 'Artisan Coffee Bar', 'Heritage Walking Tour', 'Free High-Speed WiFi', 'Bicycle Rentals'],
    badge: 'Heritage Classic'
  },
  {
    id: 'hotel-wayanad-1',
    name: 'Rainforest Canopy Treehouse & Eco Retreat',
    destination: 'Wayanad',
    type: 'Nature Retreat',
    image: '/munnar-tea.jpg',
    price: 5100,
    rating: 4.9,
    reviews: 188,
    location: 'Lakkidi Rainforest, Wayanad',
    description: 'Eco-luxury elevated wooden treehouse surrounded by indigenous evergreen rainforest, cascading mountain streams, and spice plantation walking trails.',
    amenities: ['Treehouse Forest Canopy', 'Spice Plantation Walks', 'Bonfire Dinner', 'Birdwatching Guide', 'Organic Dining'],
    badge: 'Eco Luxury'
  },
  {
    id: 'hotel-alleppey-2',
    name: 'Marari Palm Shores Beach Cottages',
    destination: 'Alleppey',
    type: 'Luxury Resort',
    image: '/kovalam-beach.jpg',
    price: 4450,
    rating: 4.8,
    reviews: 215,
    location: 'Marari Beach, Alleppey Coast',
    description: 'Thatched-roof coastal cottages set amidst quiet coconut groves, footsteps away from pristine white sand shores and serene backwater inlets.',
    amenities: ['Private Beach Hammocks', 'Fresh Seafood Grill', 'Ayurveda Massage', 'Coastal Bicycle Trails', 'Free Breakfast'],
    badge: 'Beachfront'
  },
  {
    id: 'hotel-munnar-2',
    name: 'Eravikulam Misty Heights Cottage Retreat',
    destination: 'Munnar',
    type: 'Nature Retreat',
    image: '/munnar-tea.jpg',
    price: 3200,
    rating: 4.6,
    reviews: 175,
    location: 'Near Eravikulam National Park, Munnar',
    description: 'Charming stone cottages overlooking high-altitude cardamom and tea gardens, known for cool mountain mist and panoramic sunrise viewpoints.',
    amenities: ['Mountain View Terraces', 'Cardamom Trail Walk', 'Complimentary Breakfast', 'Fireplace Lounge', 'Free Parking'],
    badge: 'Great Value'
  }
];

export default function HotelsSearchScreen({
  searchParams,
  onBackToDashboard,
  onEditSearch,
  onSelectStay,
  savedTrips = []
}) {
  // Normalize search parameters with safe fallbacks
  const currentDestination = searchParams?.destination || 'Munnar';
  const departureDate = searchParams?.departureDate || '2026-10-15';
  const returnDate = searchParams?.returnDate || '2026-10-19';
  const travellers = searchParams?.travellers || 2;

  // Calculate approximate number of nights
  const nightsCount = useMemo(() => {
    try {
      const dep = new Date(departureDate);
      const ret = new Date(returnDate);
      const diffTime = ret.getTime() - dep.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 3;
    } catch {
      return 3;
    }
  }, [departureDate, returnDate]);

  // Filters state
  const [filterDestination, setFilterDestination] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [maxPrice, setMaxPrice] = useState(7000);
  const [sortBy, setSortBy] = useState('recommended');

  // Details Modal state
  const [selectedStay, setSelectedStay] = useState(null);
  const [selectionConfirmed, setSelectionConfirmed] = useState(false);

  // Filter & sort logic
  const filteredHotels = useMemo(() => {
    return SAMPLE_HOTELS.filter((hotel) => {
      // 1. Destination filter
      if (filterDestination !== 'All' && hotel.destination.toLowerCase() !== filterDestination.toLowerCase()) {
        return false;
      }
      // 2. Type filter
      if (filterType !== 'All' && hotel.type !== filterType) {
        return false;
      }
      // 3. Rating filter
      if (filterRating === '4.8+' && hotel.rating < 4.8) {
        return false;
      }
      if (filterRating === '4.7+' && hotel.rating < 4.7) {
        return false;
      }
      // 4. Max Price filter
      if (hotel.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'rating-high') {
        return b.rating - a.rating;
      }
      return 0; // 'recommended' preserves default ordering
    });
  }, [filterDestination, filterType, filterRating, maxPrice, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilterDestination('All');
    setFilterType('All');
    setFilterRating('All');
    setMaxPrice(7000);
    setSortBy('recommended');
  };

  // Handle stay selection
  const handleConfirmSelectStay = (hotel) => {
    if (onSelectStay) {
      onSelectStay({
        hotelId: hotel.id,
        name: hotel.name,
        destination: hotel.destination,
        location: hotel.location,
        image: hotel.image,
        pricePerNight: hotel.price,
        nights: nightsCount,
        totalEstimatedPrice: hotel.price * nightsCount,
        departureDate,
        returnDate,
        travellers
      });
    }
    setSelectionConfirmed(true);
  };

  return (
    <div className="hotels-page-container">
      {/* ---------------- 1. TOP HEADER & SEARCH SUMMARY ---------------- */}
      <header className="hotels-top-header">
        <div className="hotels-header-inner">
          <div className="hotels-header-left">
            <button
              id="btn-back-to-dashboard"
              type="button"
              className="btn-back-nav"
              onClick={onBackToDashboard}
              title="Return to Dashboard (Screen 3)"
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </button>

            <div className="hotels-header-brand">
              <Hotel size={22} className="brand-hotels-icon" />
              <h1 className="hotels-page-title">Hotels & Stays Results</h1>
            </div>
          </div>

          {/* Edit Search action */}
          <button
            id="btn-edit-search"
            type="button"
            className="btn-edit-search"
            onClick={onEditSearch}
            title="Modify destination and travel dates on Dashboard"
          >
            <Search size={16} />
            <span>Edit Search</span>
          </button>
        </div>

        {/* Search Parameter Summary Bar */}
        <div className="search-summary-bar">
          <div className="summary-pill">
            <MapPin size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Destination</span>
              <span className="pill-val">{currentDestination}, Kerala</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-pill">
            <Calendar size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Dates</span>
              <span className="pill-val">
                {departureDate} → {returnDate} ({nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'})
              </span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-pill">
            <Users size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Guests</span>
              <span className="pill-val">{travellers} {travellers === 1 ? 'Traveller' : 'Travellers'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- 2. PROTOTYPE NOTICE BANNER ---------------- */}
      <div className="hotels-notice-container">
        <div className="hotels-demo-alert">
          <ShieldAlert size={18} className="demo-alert-icon" />
          <span>
            <strong>Demo results only:</strong> Availability, sample star ratings, and prices are illustrative for Screen 4 testing and not live booking data.
          </span>
        </div>
      </div>

      {/* ---------------- 3. MAIN CONTENT: FILTERS SIDEBAR + RESULTS GRID ---------------- */}
      <main className="hotels-main-layout">
        {/* Filters & Sorting Sidebar */}
        <aside className="hotels-filter-sidebar">
          <div className="sidebar-header-row">
            <div className="sidebar-title-group">
              <SlidersHorizontal size={18} color="#0866F5" />
              <h3>Filter Stays</h3>
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

          {/* Filter 1: Destination */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-destination-select">
              Destination
            </label>
            <select
              id="filter-destination-select"
              className="filter-select"
              value={filterDestination}
              onChange={(e) => setFilterDestination(e.target.value)}
            >
              <option value="All">All Destinations</option>
              <option value="Munnar">Munnar (Tea Hills)</option>
              <option value="Alleppey">Alleppey (Backwaters)</option>
              <option value="Kovalam">Kovalam (Beaches)</option>
              <option value="Kochi">Kochi (Heritage)</option>
              <option value="Wayanad">Wayanad (Rainforest)</option>
            </select>
          </div>

          {/* Filter 2: Accommodation Type */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-type-select">
              Property Type
            </label>
            <select
              id="filter-type-select"
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Property Types</option>
              <option value="Luxury Resort">Luxury Resort</option>
              <option value="Traditional Houseboat">Traditional Houseboat</option>
              <option value="Heritage Villa">Heritage Villa</option>
              <option value="Nature Retreat">Nature Retreat</option>
            </select>
          </div>

          {/* Filter 3: Sample Star Rating */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-rating-select">
              Sample Rating
            </label>
            <select
              id="filter-rating-select"
              className="filter-select"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="All">All Ratings</option>
              <option value="4.8+">4.8★ & Above</option>
              <option value="4.7+">4.7★ & Above</option>
            </select>
          </div>

          {/* Filter 4: Maximum Price Range Slider */}
          <div className="filter-group">
            <div className="filter-label-row">
              <span className="filter-label">Max Price / Night</span>
              <span className="filter-val-badge">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              id="filter-price-slider"
              type="range"
              min="3000"
              max="8000"
              step="200"
              className="price-range-slider"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <div className="price-slider-bounds">
              <span>₹3,000</span>
              <span>₹8,000</span>
            </div>
          </div>

          {/* Sorting */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="sort-hotels-select">
              Sort By
            </label>
            <select
              id="sort-hotels-select"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended (Top Picks)</option>
              <option value="price-low">Lowest Estimated Price</option>
              <option value="price-high">Highest Estimated Price</option>
              <option value="rating-high">Highest Sample Rating</option>
            </select>
          </div>
        </aside>

        {/* Results Area */}
        <section className="hotels-results-container">
          <div className="results-status-bar">
            <div>
              <h2 className="results-heading">
                Available Accommodations ({filteredHotels.length})
              </h2>
              <p className="results-subheading">
                Showing realistic sample stays matching your travel criteria in Kerala.
              </p>
            </div>
          </div>

          {/* Stays Grid */}
          {filteredHotels.length > 0 ? (
            <div className="hotels-cards-grid">
              {filteredHotels.map((hotel) => (
                <article key={hotel.id} className="hotel-card">
                  <div className="hotel-card-image-wrap">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="hotel-card-img"
                      loading="lazy"
                    />
                    <span className="hotel-badge-tag">{hotel.badge}</span>
                    <span className="hotel-type-tag">{hotel.type}</span>
                  </div>

                  <div className="hotel-card-body">
                    <div className="hotel-meta-top">
                      <div className="hotel-location-tag">
                        <MapPin size={14} />
                        <span>{hotel.location}</span>
                      </div>

                      <div className="hotel-rating-box" title="Sample Demonstration Rating">
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span className="rating-num">{hotel.rating}</span>
                        <span className="rating-sample-label">(Sample)</span>
                      </div>
                    </div>

                    <h3 className="hotel-name">{hotel.name}</h3>
                    <p className="hotel-desc">{hotel.description}</p>

                    <div className="hotel-amenities-row">
                      {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="hotel-amenity-chip">
                          ✓ {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="hotel-amenity-more">
                          +{hotel.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="hotel-card-footer">
                      <div className="hotel-pricing-box">
                        <span className="pricing-label">Estimated Rate</span>
                        <div className="pricing-amount">
                          ₹{hotel.price.toLocaleString()}
                          <span className="pricing-unit"> / night</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        id={`btn-view-${hotel.id}`}
                        className="btn-view-stay"
                        onClick={() => {
                          setSelectedStay(hotel);
                          setSelectionConfirmed(false);
                        }}
                      >
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-hotels-fallback">
              <Hotel size={44} color="#94A3B8" />
              <h3>No stays match your active filters</h3>
              <p>Try widening your price range slider or switching the property type filter.</p>
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

      {/* ---------------- 4. HOTEL DETAILS MODAL ---------------- */}
      {selectedStay && (
        <div className="modal-backdrop" onClick={() => setSelectedStay(null)}>
          <div className="modal-window stay-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-badge">
                <Hotel size={20} color="#0866F5" />
              </div>
              <h3 className="modal-title">{selectedStay.name}</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedStay(null)}
                title="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="stay-modal-body">
              <div className="stay-modal-hero-image-wrap">
                <img
                  src={selectedStay.image}
                  alt={selectedStay.name}
                  className="stay-modal-hero-image"
                />
                <span className="stay-modal-badge">{selectedStay.type}</span>
              </div>

              <div className="stay-modal-location-row">
                <div className="location-pill">
                  <MapPin size={14} color="#0866F5" />
                  <span>{selectedStay.location}</span>
                </div>
                <div className="rating-pill">
                  <Star size={13} fill="#F59E0B" color="#F59E0B" />
                  <span>{selectedStay.rating} (Sample Rating • {selectedStay.reviews} reviews)</span>
                </div>
              </div>

              <p className="stay-modal-description">{selectedStay.description}</p>

              {/* Selected Dates & Guest Summary */}
              <div className="stay-dates-summary-box">
                <div className="date-summary-item">
                  <span className="summary-hdr">Check-In</span>
                  <span className="summary-data">{departureDate}</span>
                </div>
                <div className="date-summary-item">
                  <span className="summary-hdr">Check-Out</span>
                  <span className="summary-data">{returnDate}</span>
                </div>
                <div className="date-summary-item">
                  <span className="summary-hdr">Duration</span>
                  <span className="summary-data">{nightsCount} Nights • {travellers} Guests</span>
                </div>
              </div>

              {/* Amenities List */}
              <div className="stay-amenities-section">
                <h4 className="amenities-title">Included Stays Amenities:</h4>
                <div className="amenities-grid">
                  {selectedStay.amenities.map((am, i) => (
                    <div key={i} className="amenity-item">
                      <Check size={14} color="#10B981" />
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Pricing Calculation */}
              <div className="stay-pricing-calculation-card">
                <div className="calculation-row">
                  <span>Nightly Rate (Estimated):</span>
                  <span>₹{selectedStay.price.toLocaleString()}</span>
                </div>
                <div className="calculation-row">
                  <span>Stay Duration:</span>
                  <span>{nightsCount} Nights</span>
                </div>
                <div className="calculation-row total-row">
                  <span>Total Estimated Stay:</span>
                  <span className="total-price-val">
                    ₹{(selectedStay.price * nightsCount).toLocaleString()}
                  </span>
                </div>
                <span className="calculation-disclaimer">
                  *Demonstration price estimate only. Taxes, seasonal rates, and real payments are excluded.
                </span>
              </div>

              {/* Confirmation Toast or Action */}
              {selectionConfirmed ? (
                <div className="stay-confirmed-box">
                  <CheckCircle2 size={24} color="#10B981" />
                  <div>
                    <strong>Stay Added to Your Prototype Itinerary!</strong>
                    <p>
                      "{selectedStay.name}" has been saved to your active travel session.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Modal Buttons */}
              <div className="modal-buttons-row" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setSelectedStay(null)}
                >
                  Close
                </button>

                <button
                  id="btn-select-stay-action"
                  type="button"
                  className="btn-modal-submit"
                  onClick={() => handleConfirmSelectStay(selectedStay)}
                >
                  <Sparkles size={16} />
                  <span>{selectionConfirmed ? '✓ Stay Selected' : 'Select Stay'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
