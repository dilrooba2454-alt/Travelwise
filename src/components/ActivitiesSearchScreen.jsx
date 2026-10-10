import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  Users,
  Ticket,
  Clock,
  SlidersHorizontal,
  ShieldAlert,
  CheckCircle2,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Star,
  Filter,
  Compass,
  Tag,
  ArrowRight
} from 'lucide-react';

/**
 * Screen 6: Tickets & Activities Search Results
 * 
 * Features:
 * - Top header with TravelWise branding, Back to Dashboard button, and Edit Search action
 * - Preserves destination, travel dates, and traveller count from Screen 3 Dashboard
 * - Comprehensive Kerala attractions dataset: Kathakali dance, tea plantation tours,
 *   backwater shikara cruises, wildlife safaris, and heritage sightseeing passes
 * - Functional filters by activity type, destination, and maximum price slider
 * - Sorting by lowest price, highest rating, and recommendations
 * - Interactive activity cards with photos, duration pills, type tags, and illustrative fares
 * - View Details modal with full tour itinerary, highlights checklist, and traveller total calculation
 * - "Select Activity" action saving to prototype My Trips state with instant feedback
 * - Clear data transparency demo notices
 */

export const SAMPLE_ACTIVITIES = [
  {
    id: 'act-kathakali-1',
    title: 'Traditional Kathakali Classical Dance & Makeup Demo',
    type: 'Cultural Performance',
    location: 'Fort Kochi Cultural Centre, Kochi',
    destination: 'Kochi',
    image: '/beach-hero.jpg',
    duration: '2 hours',
    durationMinutes: 120,
    price: 650,
    rating: 4.9,
    reviews: 480,
    badge: 'Must-See Culture',
    highlights: ['Live Makeup Demonstration', 'English Commentary & Story Introduction', 'Mudras (Hand Gestures) Workshop', 'Photo Opportunity with Performers'],
    description: 'Immerse yourself in centuries of Kerala heritage with an evening of Kathakali dramatic storytelling, elaborate green face-paint artistry, and live percussion rhythms.'
  },
  {
    id: 'act-tea-tour-1',
    title: 'Lockhart Tea Estate Heritage Walking Tour & Tasting',
    type: 'Plantation Tour',
    location: 'Lockhart Estate, Munnar',
    destination: 'Munnar',
    image: '/munnar-tea.jpg',
    duration: '3.5 hours',
    durationMinutes: 210,
    price: 850,
    rating: 4.8,
    reviews: 395,
    badge: 'Top Rated Tour',
    highlights: ['Guided Tea Leaf Plucking', 'Historic 1879 Factory Machinery Tour', 'Master Tea Sommelier Tasting', 'Scenic Valley Panoramic Viewpoint'],
    description: 'Walk through rolling colonial emerald tea slopes, witness traditional orthodox leaf curing, and sample premium silver tips with an estate agronomist.'
  },
  {
    id: 'act-backwater-cruise-1',
    title: 'Pampa River Sunset Shikara Boat & Village Canal Cruise',
    type: 'Backwater Cruise',
    location: 'Kuttanad & Punnamada, Alleppey',
    destination: 'Alleppey',
    image: '/alleppey-houseboat.jpg',
    duration: '3 hours',
    durationMinutes: 180,
    price: 1200,
    rating: 4.9,
    reviews: 520,
    badge: 'Bestseller Cruise',
    highlights: ['Quiet Motorized Shikara Canopy Boat', 'Narrow Palm Canal Navigation', 'Traditional Kerala Tea & Banana Fritters', 'Village Coir & Duck Farm Stop'],
    description: 'Glide silently through narrow backwater canals inaccessible to large houseboats, watching evening life along the banks as the sun sets over Lake Vembanad.'
  },
  {
    id: 'act-wildlife-1',
    title: 'Eravikulam National Park Nilgiri Tahr Guided Safari',
    type: 'Wildlife Experience',
    location: 'Eravikulam Sanctuary, Munnar',
    destination: 'Munnar',
    image: '/munnar-tea.jpg',
    duration: '4 hours',
    durationMinutes: 240,
    price: 950,
    rating: 4.7,
    reviews: 310,
    badge: 'Wildlife Explorer',
    highlights: ['Endangered Nilgiri Tahr Mountain Goats', 'Anamudi Peak Lookout (Highest in S. India)', 'Forest Department Eco-Bus Transfer', 'Biodiversity Interpretation Centre'],
    description: 'Ascend into the misty high-altitude shola grasslands to spot the endangered Nilgiri Tahr and take in staggering panoramas of South India’s highest summit.'
  },
  {
    id: 'act-sightseeing-1',
    title: 'Fort Kochi Heritage Quarter & Chinese Fishing Nets Walking Pass',
    type: 'Sightseeing',
    location: 'Mattancherry & Fort Kochi, Kochi',
    destination: 'Kochi',
    image: '/beach-hero.jpg',
    duration: '2.5 hours',
    durationMinutes: 150,
    price: 450,
    rating: 4.8,
    reviews: 440,
    badge: 'Heritage Walking',
    highlights: ['Historic Chinese Cantilever Nets Demo', 'St. Francis Church (Vasco da Gama Tomb)', 'Jew Town & Paradesi Synagogue', 'Dutch Palace Wall Murals'],
    description: 'Explore colonial spice corridors, Dutch courtyards, ancient Jewish synagogue alleys, and watch local fishermen operate majestic ancient Chinese cantilever nets.'
  },
  {
    id: 'act-kovalam-surf-1',
    title: 'Lighthouse Beach Sea Kayaking & Coastal Sunset Pass',
    type: 'Sightseeing',
    location: 'Lighthouse Beach, Kovalam',
    destination: 'Kovalam',
    image: '/kovalam-beach.jpg',
    duration: '2 hours',
    durationMinutes: 120,
    price: 1100,
    rating: 4.7,
    reviews: 260,
    badge: 'Coastal Adventure',
    highlights: ['Guided Arabian Sea Kayak Excursion', 'Striped Lighthouse Deck Entry Ticket', 'Certified Marine Lifeguard Escort', 'Safety Life Vests & Dry Bags Provided'],
    description: 'Paddle along the curved cliffs of Kovalam beach, view the historic candy-striped lighthouse from the water, and ascend to the observation deck for panoramic ocean views.'
  },
  {
    id: 'act-periyar-bamboo-1',
    title: 'Periyar Lake Bamboo Rafting & Forest Jungle Trek',
    type: 'Wildlife Experience',
    location: 'Periyar Tiger Reserve, Thekkady',
    destination: 'Munnar',
    image: '/munnar-tea.jpg',
    duration: '5 hours',
    durationMinutes: 300,
    price: 1650,
    rating: 4.9,
    reviews: 220,
    badge: 'Eco-Adventure',
    highlights: ['Tribal Community Forest Guides', 'Silent Composite Bamboo Rafting', 'Wild Elephant & Sambar Deer Spotting', 'Packed Forest Trail Lunch Included'],
    description: 'An eco-tourism journey combining a morning forest trek through deciduous woodlands followed by peaceful bamboo rafting across tranquil Periyar lake.'
  },
  {
    id: 'act-kalaripayattu-1',
    title: 'Kalaripayattu Ancient Martial Arts Evening Showcase',
    type: 'Cultural Performance',
    location: 'Kerala Kalari Arena, Kochi',
    destination: 'Kochi',
    image: '/kovalam-beach.jpg',
    duration: '1.5 hours',
    durationMinutes: 90,
    price: 500,
    rating: 4.8,
    reviews: 350,
    badge: 'Action & Heritage',
    highlights: ['Traditional Clay Pit Arena', 'Sword, Shield & Fire Weapon Demonstrations', 'Ancient Animal Stance Acrobatics', 'Aromatherapy Oil Display'],
    description: 'Witness the mother of all martial arts live in action, featuring astonishing leaps, synchronized wooden staff battles, and flaming spear maneuvers.'
  }
];

export default function ActivitiesSearchScreen({
  searchParams,
  savedTrips = [],
  onBackToDashboard,
  onEditSearch,
  onSelectActivity
}) {
  // Safe defaults from preserved searchParams
  const destination = searchParams?.destination || 'Munnar';
  const travelDate = searchParams?.departureDate || '2026-10-15';
  const travellers = searchParams?.travellers || 2;

  // Filter States
  const [filterDestination, setFilterDestination] = useState('All');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Cultural Performance', 'Plantation Tour', 'Backwater Cruise', 'Wildlife Experience', 'Sightseeing'
  const [maxPrice, setMaxPrice] = useState(2000); // INR slider bounds 400 - 2500
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'price-low', 'price-high', 'rating-high'

  // Modal State
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectionConfirmed, setSelectionConfirmed] = useState(false);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    return SAMPLE_ACTIVITIES.filter((item) => {
      // 1. Destination filter
      if (filterDestination !== 'All' && item.destination.toLowerCase() !== filterDestination.toLowerCase()) {
        return false;
      }

      // 2. Type filter
      if (filterType !== 'All' && item.type.toLowerCase() !== filterType.toLowerCase()) {
        return false;
      }

      // 3. Price filter
      if (item.price > maxPrice) {
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
      // 'recommended'
      return b.rating - a.rating;
    });
  }, [filterDestination, filterType, maxPrice, sortBy]);

  // Reset filters
  const handleResetFilters = () => {
    setFilterDestination('All');
    setFilterType('All');
    setMaxPrice(2000);
    setSortBy('recommended');
  };

  // Confirm activity selection
  const handleConfirmSelectActivity = (activity) => {
    const totalCost = activity.price * travellers;

    if (onSelectActivity) {
      onSelectActivity({
        id: activity.id,
        itemType: 'activity',
        activityType: activity.type,
        name: activity.title,
        title: activity.title,
        location: activity.location,
        destination: activity.destination,
        image: activity.image,
        duration: activity.duration,
        pricePerPerson: activity.price,
        fare: activity.price,
        totalEstimatedPrice: totalCost,
        travellers,
        travelDate,
        date: travelDate
      });
    }
    setSelectionConfirmed(true);
  };

  return (
    <div className="activities-page-container">
      {/* ---------------- 1. TOP HEADER & SUMMARY NAVIGATION ---------------- */}
      <header className="activities-top-header">
        <div className="activities-header-top-row">
          <div className="activities-nav-left">
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

            <div className="activities-header-brand">
              <Ticket size={22} className="brand-activities-icon" />
              <h1 className="activities-page-title">Tickets, Tours & Activities</h1>
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

        {/* Search Parameter Summary Bar */}
        <div className="activities-summary-bar">
          <div className="summary-pill">
            <MapPin size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Destination</span>
              <span className="pill-val">{destination}, Kerala</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-pill">
            <Calendar size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Activity Date</span>
              <span className="pill-val">{travelDate}</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-pill">
            <Users size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Participants</span>
              <span className="pill-val">{travellers} {travellers === 1 ? 'Guest' : 'Guests'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- 2. PROTOTYPE NOTICE BANNER ---------------- */}
      <div className="activities-notice-container">
        <div className="activities-demo-alert">
          <ShieldAlert size={18} className="demo-alert-icon" />
          <span>
            <strong>Demo results only:</strong> Activity availability, timing schedules, and admission prices are illustrative for Screen 6 demonstration and not live ticketing data. No real bookings or payment processing are supported.
          </span>
        </div>
      </div>

      {/* ---------------- 3. MAIN ACTIVITIES LAYOUT ---------------- */}
      <main className="activities-main-layout">
        {/* Filters Sidebar */}
        <aside className="activities-filter-sidebar">
          <div className="sidebar-header-row">
            <div className="sidebar-title-group">
              <SlidersHorizontal size={18} color="#0866F5" />
              <h3>Filter Activities</h3>
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
              Destination Area
            </label>
            <select
              id="filter-destination-select"
              className="filter-select"
              value={filterDestination}
              onChange={(e) => setFilterDestination(e.target.value)}
            >
              <option value="All">All Destinations</option>
              <option value="Munnar">Munnar (Tea & Wildlife)</option>
              <option value="Alleppey">Alleppey (Backwater Cruises)</option>
              <option value="Kochi">Kochi (Heritage & Culture)</option>
              <option value="Kovalam">Kovalam (Coastal & Beaches)</option>
            </select>
          </div>

          {/* Filter 2: Activity Type */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="filter-activity-type-select">
              Experience Category
            </label>
            <select
              id="filter-activity-type-select"
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Experiences</option>
              <option value="Cultural Performance">Cultural Performance</option>
              <option value="Plantation Tour">Plantation Tour</option>
              <option value="Backwater Cruise">Backwater Cruise</option>
              <option value="Wildlife Experience">Wildlife Experience</option>
              <option value="Sightseeing">Sightseeing & Heritage</option>
            </select>
          </div>

          {/* Filter 3: Maximum Price Slider */}
          <div className="filter-group">
            <div className="filter-label-row">
              <span className="filter-label">Max Price / Guest</span>
              <span className="filter-val-badge">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              id="filter-activity-price-slider"
              type="range"
              min="400"
              max="2000"
              step="50"
              className="price-range-slider"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <div className="price-slider-bounds">
              <span>₹400</span>
              <span>₹2,000</span>
            </div>
          </div>

          {/* Filter 4: Sorting */}
          <div className="filter-group">
            <label className="filter-label" htmlFor="sort-activities-select">
              Sort By
            </label>
            <select
              id="sort-activities-select"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended (Top Picks)</option>
              <option value="price-low">Lowest Price First</option>
              <option value="price-high">Highest Price First</option>
              <option value="rating-high">Highest Sample Rating</option>
            </select>
          </div>
        </aside>

        {/* Results Area */}
        <section className="activities-results-container">
          <div className="results-status-bar">
            <div>
              <h2 className="results-heading">
                Available Tickets & Tours ({filteredActivities.length})
              </h2>
              <p className="results-subheading">
                Curated experiences across Kerala with verified local guides and cultural passes.
              </p>
            </div>
          </div>

          {/* Activities Cards Grid */}
          {filteredActivities.length > 0 ? (
            <div className="activities-cards-grid">
              {filteredActivities.map((activity) => (
                <article key={activity.id} className="activity-card">
                  <div className="activity-card-image-wrap">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="activity-card-img"
                      loading="lazy"
                    />
                    <span className="activity-badge-tag">{activity.badge}</span>
                    <span className="activity-type-tag">{activity.type}</span>
                  </div>

                  <div className="activity-card-body">
                    <div className="activity-meta-top">
                      <div className="activity-location-tag">
                        <MapPin size={14} />
                        <span>{activity.location}</span>
                      </div>

                      <div className="activity-rating-box" title="Sample Rating">
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span className="rating-num">{activity.rating}</span>
                        <span className="rating-sample-label">(Sample)</span>
                      </div>
                    </div>

                    <h3 className="activity-title">{activity.title}</h3>
                    <p className="activity-desc">{activity.description}</p>

                    <div className="activity-duration-row">
                      <div className="activity-duration-pill">
                        <Clock size={13} color="#0866F5" />
                        <span>Duration: {activity.duration}</span>
                      </div>
                    </div>

                    <div className="activity-highlights-row">
                      {activity.highlights.slice(0, 2).map((highlight, idx) => (
                        <span key={idx} className="activity-highlight-chip">
                          ✓ {highlight}
                        </span>
                      ))}
                      {activity.highlights.length > 2 && (
                        <span className="activity-highlight-more">
                          +{activity.highlights.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="activity-card-footer">
                      <div className="activity-pricing-box">
                        <span className="pricing-label">Admission Fare</span>
                        <div className="pricing-amount">
                          ₹{activity.price.toLocaleString()}
                          <span className="pricing-unit"> / guest</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        id={`btn-view-${activity.id}`}
                        className="btn-view-activity"
                        onClick={() => {
                          setSelectedActivity(activity);
                          setSelectionConfirmed(false);
                        }}
                      >
                        <span>View Details</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-activities-fallback">
              <Ticket size={44} color="#94A3B8" />
              <h3>No activities match your active filters</h3>
              <p>Try widening your maximum price range or switching the experience category filter.</p>
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

      {/* ---------------- 4. ACTIVITY DETAILS MODAL ---------------- */}
      {selectedActivity && (
        <div className="modal-backdrop" onClick={() => setSelectedActivity(null)}>
          <div className="modal-window activity-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-badge">
                <Ticket size={20} color="#0866F5" />
              </div>
              <h3 className="modal-title">{selectedActivity.title}</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedActivity(null)}
                title="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="activity-modal-body">
              <div className="activity-modal-hero-image-wrap">
                <img
                  src={selectedActivity.image}
                  alt={selectedActivity.title}
                  className="activity-modal-hero-image"
                />
                <span className="activity-modal-badge">{selectedActivity.type}</span>
              </div>

              <div className="activity-modal-location-row">
                <div className="location-pill">
                  <MapPin size={14} color="#0866F5" />
                  <span>{selectedActivity.location}</span>
                </div>
                <div className="rating-pill">
                  <Star size={13} fill="#F59E0B" color="#F59E0B" />
                  <span>{selectedActivity.rating} (Sample Rating • {selectedActivity.reviews} reviews)</span>
                </div>
              </div>

              <p className="activity-modal-description">{selectedActivity.description}</p>

              {/* Timing & Participants Card */}
              <div className="activity-timing-summary-box">
                <div className="timing-summary-item">
                  <span className="summary-hdr">Activity Date</span>
                  <span className="summary-data">{travelDate}</span>
                </div>
                <div className="timing-summary-item">
                  <span className="summary-hdr">Estimated Duration</span>
                  <span className="summary-data">{selectedActivity.duration}</span>
                </div>
                <div className="timing-summary-item">
                  <span className="summary-hdr">Participants</span>
                  <span className="summary-data">{travellers} {travellers === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>

              {/* Highlights Checklist */}
              <div className="activity-highlights-section">
                <h4 className="highlights-section-title">Included Experience Highlights:</h4>
                <div className="highlights-grid">
                  {selectedActivity.highlights.map((item, i) => (
                    <div key={i} className="highlight-item">
                      <Check size={14} color="#10B981" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="activity-pricing-calculation-card">
                <div className="calculation-row">
                  <span>Price per Guest:</span>
                  <span>₹{selectedActivity.price.toLocaleString()}</span>
                </div>
                <div className="calculation-row">
                  <span>Participants:</span>
                  <span>× {travellers}</span>
                </div>
                <div className="calculation-row total-row">
                  <span>Total Estimated Activity Price:</span>
                  <span className="total-price-val">
                    ₹{(selectedActivity.price * travellers).toLocaleString()}
                  </span>
                </div>
                <span className="calculation-disclaimer">
                  *Demonstration price estimate only. Taxes, admission surcharges, and real payments are excluded.
                </span>
              </div>

              {/* Confirmation Toast */}
              {selectionConfirmed && (
                <div className="stay-confirmed-box">
                  <CheckCircle2 size={24} color="#10B981" />
                  <div>
                    <strong>Activity Added to Your Prototype Itinerary!</strong>
                    <p>
                      "{selectedActivity.title}" has been saved to your active travel session.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="modal-buttons-row" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setSelectedActivity(null)}
                >
                  Close
                </button>

                <button
                  id="btn-select-activity-action"
                  type="button"
                  className="btn-modal-submit"
                  onClick={() => handleConfirmSelectActivity(selectedActivity)}
                >
                  <Sparkles size={16} />
                  <span>{selectionConfirmed ? '✓ Activity Selected' : 'Select Activity'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
