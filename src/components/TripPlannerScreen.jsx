import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Hotel,
  Bus,
  Train,
  Car,
  Ship,
  Ticket,
  Trash2,
  Plus,
  Sparkles,
  ShieldAlert,
  Clock,
  ArrowRight,
  Share2,
  CheckCircle2,
  Compass,
  DollarSign,
  Info
} from 'lucide-react';

/**
 * Screen 7: My Trip Planner & Itinerary
 * 
 * Features:
 * - Top header with TravelWise branding and Back to Dashboard button
 * - Preserves destination, dates, and traveller count
 * - Displays all selected hotels, transport, and activities from shared savedTrips state
 * - Groups itinerary items chronologically by travel date
 * - Shows item type, name, location/route, schedule details, and estimated price
 * - Real-time calculation of total estimated trip budget and category sub-totals
 * - Allows removing items, updating shared state immediately
 * - Polished empty states when itinerary is empty or has category gaps
 * - Quick shortcuts to add more stays, transport, or activities
 * - Transparent prototype notice throughout (no real bookings or payments)
 */
export default function TripPlannerScreen({
  searchParams,
  savedTrips = [],
  onRemoveItem,
  onBackToDashboard,
  onOpenHotels,
  onOpenTransport,
  onOpenActivities,
  onOpenAssistant
}) {
  const destination = searchParams?.destination || 'Munnar';
  const departureDate = searchParams?.departureDate || '2026-10-15';
  const returnDate = searchParams?.returnDate || '2026-10-19';
  const travellers = searchParams?.travellers || 2;

  // UI toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Category counts and subtotal calculations
  const summaryBreakdown = useMemo(() => {
    let staysTotal = 0;
    let transportTotal = 0;
    let activitiesTotal = 0;
    let staysCount = 0;
    let transportCount = 0;
    let activitiesCount = 0;

    savedTrips.forEach((item) => {
      const price = Number(item.totalEstimatedPrice || item.fare || 0);

      if (item.itemType === 'transport') {
        transportTotal += price;
        transportCount += 1;
      } else if (item.itemType === 'activity') {
        activitiesTotal += price;
        activitiesCount += 1;
      } else {
        // Default to hotel / stay
        staysTotal += price;
        staysCount += 1;
      }
    });

    return {
      staysTotal,
      transportTotal,
      activitiesTotal,
      grandTotal: staysTotal + transportTotal + activitiesTotal,
      staysCount,
      transportCount,
      activitiesCount
    };
  }, [savedTrips]);

  // Group items by date chronologically
  const groupedByDate = useMemo(() => {
    const groups = {};

    savedTrips.forEach((item) => {
      const itemDate = item.travelDate || item.date || item.departureDate || 'Flexible Dates';
      if (!groups[itemDate]) {
        groups[itemDate] = [];
      }
      groups[itemDate].push(item);
    });

    // Sort dates in ascending order where possible
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'Flexible Dates') return 1;
      if (b === 'Flexible Dates') return -1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((dateKey) => ({
      date: dateKey,
      items: groups[dateKey]
    }));
  }, [savedTrips]);

  // Handle item deletion
  const handleDeleteItem = (item) => {
    const itemId = item.id || item.hotelId;
    if (onRemoveItem) {
      onRemoveItem(itemId);
      showToast(`Removed "${item.name || item.title}" from itinerary`);
    }
  };

  // Helper to render type-specific icons
  const renderItemIcon = (item) => {
    if (item.itemType === 'transport') {
      const t = (item.transportType || '').toLowerCase();
      if (t === 'train') return <Train size={18} />;
      if (t === 'bus') return <Bus size={18} />;
      if (t === 'cab') return <Car size={18} />;
      if (t === 'ferry') return <Ship size={18} />;
      return <Bus size={18} />;
    }
    if (item.itemType === 'activity') {
      return <Ticket size={18} />;
    }
    return <Hotel size={18} />;
  };

  // Helper for category badge text & style
  const getBadgeMeta = (item) => {
    if (item.itemType === 'transport') {
      return {
        label: `Transport • ${item.transportType || 'Transit'}`,
        className: 'badge-transport'
      };
    }
    if (item.itemType === 'activity') {
      return {
        label: `Activity • ${item.activityType || 'Experience'}`,
        className: 'badge-activity'
      };
    }
    return {
      label: 'Stay • Hotel & Resort',
      className: 'badge-stay'
    };
  };

  return (
    <div className="planner-page-container">
      {/* ---------------- 1. TOP HEADER & SUMMARY NAVIGATION ---------------- */}
      <header className="planner-top-header">
        <div className="planner-header-top-row">
          <div className="planner-nav-left">
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

            <div className="planner-header-brand">
              <Calendar size={22} className="brand-planner-icon" />
              <h1 className="planner-page-title">My Trip Planner & Itinerary</h1>
            </div>
          </div>

          <div className="planner-header-actions">
            <button
              id="btn-planner-ask-ai"
              type="button"
              className="btn-action-ghost"
              style={{
                background: '#EFF6FF',
                color: '#0866F5',
                borderColor: '#93C5FD'
              }}
              onClick={() => onOpenAssistant && onOpenAssistant({ destination, departureDate, returnDate, travellers })}
              title="Ask AI Travel Assistant for suggestions"
            >
              <Sparkles size={16} />
              <span>Ask AI Concierge</span>
            </button>

            <button
              id="btn-share-itinerary"
              type="button"
              className="btn-action-ghost"
              onClick={() => showToast('Prototype itinerary link copied to clipboard!')}
              title="Share this prototype itinerary"
            >
              <Share2 size={16} />
              <span>Share Trip</span>
            </button>
          </div>
        </div>

        {/* Route / Trip Parameter Bar */}
        <div className="planner-summary-bar">
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
              <span className="pill-label">Travel Dates</span>
              <span className="pill-val">{departureDate} → {returnDate}</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-pill">
            <Users size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Travellers</span>
              <span className="pill-val">{travellers} {travellers === 1 ? 'Guest' : 'Guests'}</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-pill">
            <Sparkles size={16} className="pill-icon" />
            <div className="pill-text-group">
              <span className="pill-label">Saved Items</span>
              <span className="pill-val">{savedTrips.length} Bookings</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- 2. PROTOTYPE NOTICE BANNER ---------------- */}
      <div className="planner-notice-container">
        <div className="planner-demo-alert">
          <ShieldAlert size={18} className="demo-alert-icon" />
          <span>
            <strong>Demo results only:</strong> All scheduled dates, routes, and prices are illustrative prototype data for Screen 7 testing. No real bookings or financial transactions are processed.
          </span>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="planner-toast-alert">
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ---------------- 3. MAIN PLANNER LAYOUT ---------------- */}
      <main className="planner-main-layout">
        {/* Left Side: Chronological Day-by-Day Itinerary */}
        <section className="planner-itinerary-section">
          <div className="section-title-row">
            <div>
              <h2 className="planner-section-heading">Day-by-Day Schedule</h2>
              <p className="planner-section-subheading">
                Organized itinerary of all your selected stays, transit rides, and local experiences.
              </p>
            </div>
          </div>

          {/* Empty State */}
          {savedTrips.length === 0 ? (
            <div className="planner-empty-card">
              <div className="empty-icon-box">
                <Compass size={48} color="#0866F5" />
              </div>
              <h3 className="empty-title">Your Trip Itinerary is Empty</h3>
              <p className="empty-desc">
                You haven't added any stays, transport options, or activities yet. Explore our curated categories to build your dream Kerala getaway.
              </p>
              <div className="empty-actions-row">
                <button
                  type="button"
                  id="btn-empty-find-hotels"
                  className="btn-primary-action"
                  onClick={() => onOpenHotels && onOpenHotels({ destination, departureDate, returnDate, travellers })}
                >
                  <Hotel size={16} />
                  <span>Browse Stays (Screen 4)</span>
                </button>
                <button
                  type="button"
                  id="btn-empty-find-transport"
                  className="btn-outline-action"
                  onClick={() => onOpenTransport && onOpenTransport({ destination, departureDate, returnDate, travellers })}
                >
                  <Bus size={16} />
                  <span>Compare Transport (Screen 5)</span>
                </button>
                <button
                  type="button"
                  id="btn-empty-find-activities"
                  className="btn-outline-action"
                  onClick={() => onOpenActivities && onOpenActivities({ destination, departureDate, returnDate, travellers })}
                >
                  <Ticket size={16} />
                  <span>Explore Activities (Screen 6)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="planner-days-list">
              {groupedByDate.map((group, groupIdx) => (
                <div key={`group-${groupIdx}`} className="planner-day-group">
                  {/* Date Header Pill */}
                  <div className="planner-day-header">
                    <div className="day-badge">Day {groupIdx + 1}</div>
                    <span className="day-date-label">{group.date}</span>
                    <span className="day-items-count">({group.items.length} {group.items.length === 1 ? 'item' : 'items'})</span>
                  </div>

                  {/* Items for this date */}
                  <div className="planner-day-cards">
                    {group.items.map((item, itemIdx) => {
                      const badgeMeta = getBadgeMeta(item);
                      const priceVal = Number(item.totalEstimatedPrice || item.fare || 0);

                      return (
                        <article key={`item-${itemIdx}`} className="itinerary-item-card">
                          <div className="item-card-left-col">
                            <div className="item-icon-wrapper">
                              {renderItemIcon(item)}
                            </div>
                            <div className="item-connector-line" />
                          </div>

                          <div className="item-card-content">
                            <div className="item-card-header">
                              <span className={`item-category-tag ${badgeMeta.className}`}>
                                {badgeMeta.label}
                              </span>

                              <button
                                type="button"
                                id={`btn-remove-${item.id || item.hotelId}`}
                                className="btn-remove-item"
                                onClick={() => handleDeleteItem(item)}
                                title="Remove item from itinerary"
                              >
                                <Trash2 size={15} />
                                <span>Remove</span>
                              </button>
                            </div>

                            <h4 className="item-title">{item.name || item.title}</h4>

                            <div className="item-location-row">
                              <MapPin size={14} color="#64748B" />
                              <span>{item.route || item.location || destination}</span>
                            </div>

                            {/* Specific contextual metadata */}
                            <div className="item-details-meta">
                              {item.itemType === 'transport' ? (
                                <>
                                  <span className="meta-chip">
                                    <Clock size={12} />
                                    <span>{item.departureTime} → {item.arrivalTime} ({item.duration})</span>
                                  </span>
                                  <span className="meta-chip">
                                    <span>{item.operator}</span>
                                  </span>
                                </>
                              ) : item.itemType === 'activity' ? (
                                <>
                                  <span className="meta-chip">
                                    <Clock size={12} />
                                    <span>Duration: {item.duration}</span>
                                  </span>
                                  <span className="meta-chip">
                                    <span>{item.travellers} Participants</span>
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="meta-chip">
                                    <Calendar size={12} />
                                    <span>{item.departureDate} → {item.returnDate} ({item.nights} Nights)</span>
                                  </span>
                                  <span className="meta-chip">
                                    <span>{item.travellers} Guests</span>
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="item-card-footer">
                              <div className="item-price-block">
                                <span className="price-label">Estimated Cost</span>
                                <span className="price-val">₹{priceVal.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Side: Cost Summary & Quick Add Shortcuts */}
        <aside className="planner-summary-sidebar">
          {/* Estimated Cost Breakdown Card */}
          <div className="cost-summary-card">
            <div className="cost-card-header">
              <div className="cost-header-title">
                <DollarSign size={20} color="#0866F5" />
                <h3>Estimated Trip Cost</h3>
              </div>
              <span className="cost-badge">{savedTrips.length} Items</span>
            </div>

            <div className="cost-rows-list">
              <div className="cost-breakdown-row">
                <div className="cost-label-group">
                  <Hotel size={15} color="#0866F5" />
                  <span>Stays & Resorts ({summaryBreakdown.staysCount}):</span>
                </div>
                <strong>₹{summaryBreakdown.staysTotal.toLocaleString()}</strong>
              </div>

              <div className="cost-breakdown-row">
                <div className="cost-label-group">
                  <Bus size={15} color="#10B981" />
                  <span>Transit & Rides ({summaryBreakdown.transportCount}):</span>
                </div>
                <strong>₹{summaryBreakdown.transportTotal.toLocaleString()}</strong>
              </div>

              <div className="cost-breakdown-row">
                <div className="cost-label-group">
                  <Ticket size={15} color="#8B5CF6" />
                  <span>Tours & Activities ({summaryBreakdown.activitiesCount}):</span>
                </div>
                <strong>₹{summaryBreakdown.activitiesTotal.toLocaleString()}</strong>
              </div>

              <div className="cost-divider" />

              <div className="cost-total-row">
                <span>Total Estimated Budget:</span>
                <span className="grand-total-val">₹{summaryBreakdown.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <p className="cost-disclaimer-note">
              *Calculated using demonstration sample rates for {travellers} {travellers === 1 ? 'traveller' : 'travellers'}. Live booking prices, taxes, and service fees may vary.
            </p>
          </div>

          {/* Quick Add Exploration Panel */}
          <div className="quick-add-panel">
            <h4 className="quick-add-title">Add More to Your Itinerary</h4>
            <p className="quick-add-subtext">
              Continue exploring Kerala options to enrich your travel schedule:
            </p>

            <div className="quick-add-buttons">
              <button
                id="btn-add-more-hotels"
                type="button"
                className="btn-quick-add"
                onClick={() => onOpenHotels && onOpenHotels({ destination, departureDate, returnDate, travellers })}
              >
                <div className="quick-add-left">
                  <div className="quick-icon-box stays">
                    <Hotel size={18} />
                  </div>
                  <div>
                    <strong>Explore Stays</strong>
                    <span>Luxury villas & houseboats</span>
                  </div>
                </div>
                <ArrowRight size={16} />
              </button>

              <button
                id="btn-add-more-transport"
                type="button"
                className="btn-quick-add"
                onClick={() => onOpenTransport && onOpenTransport({ destination, departureDate, returnDate, travellers })}
              >
                <div className="quick-add-left">
                  <div className="quick-icon-box transport">
                    <Bus size={18} />
                  </div>
                  <div>
                    <strong>Add Transport</strong>
                    <span>Trains, buses, cabs & ferries</span>
                  </div>
                </div>
                <ArrowRight size={16} />
              </button>

              <button
                id="btn-add-more-activities"
                type="button"
                className="btn-quick-add"
                onClick={() => onOpenActivities && onOpenActivities({ destination, departureDate, returnDate, travellers })}
              >
                <div className="quick-add-left">
                  <div className="quick-icon-box activities">
                    <Ticket size={18} />
                  </div>
                  <div>
                    <strong>Add Activities</strong>
                    <span>Kathakali, tea & boat tours</span>
                  </div>
                </div>
                <ArrowRight size={16} />
              </button>

              <button
                id="btn-add-more-ai"
                type="button"
                className="btn-quick-add"
                onClick={() => onOpenAssistant && onOpenAssistant({ destination, departureDate, returnDate, travellers })}
              >
                <div className="quick-add-left">
                  <div className="quick-icon-box" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <strong>Ask AI Concierge</strong>
                    <span>Custom budget & 3-day plans</span>
                  </div>
                </div>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
