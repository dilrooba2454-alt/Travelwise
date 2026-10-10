import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Send,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Hotel,
  Bus,
  Ticket,
  Train,
  Car,
  Ship,
  Info,
  RefreshCw,
  Compass,
  ArrowRight,
  ShieldAlert,
  Clock,
  Heart,
  Tag
} from 'lucide-react';

import { SAMPLE_HOTELS } from './HotelsSearchScreen';
import { SAMPLE_TRANSPORTS } from './TransportSearchScreen';
import { SAMPLE_ACTIVITIES } from './ActivitiesSearchScreen';

/**
 * Screen 8: TravelWise AI Travel Assistant
 * 
 * Features:
 * - Responsive, modern blue-and-white chat UI matching TravelWise design system
 * - Predefined prompt suggestion pills ('Plan a 3-day Munnar trip under ₹8,000', etc.)
 * - Budget, duration, and destination-aware AI recommendation engine
 * - Rich structured item cards for hotels, transport, and activities
 * - "Add to My Trips" action connected directly to shared savedTrips state
 * - Truthful typing indicator simulation and empty/error handling
 * - Clear prototype notice that recommendations are demo suggestions (no live API keys)
 * - Navigation back to Dashboard and quick jump to Screen 7 (Trip Planner)
 */
export default function TravelAssistantScreen({
  searchParams,
  savedTrips = [],
  onBackToDashboard,
  onOpenPlanner,
  onSelectStay,
  onSelectTransport,
  onSelectActivity
}) {
  const destination = searchParams?.destination || 'Munnar';
  const departureDate = searchParams?.departureDate || '2026-10-15';
  const returnDate = searchParams?.returnDate || '2026-10-19';
  const travellers = searchParams?.travellers || 2;

  const messagesEndRef = useRef(null);

  // Suggested Prompts as requested
  const SUGGESTED_PROMPTS = [
    {
      id: 'munnar-budget',
      title: 'Plan a 3-day Munnar trip under ₹8,000',
      icon: '🏔️',
      category: 'Budget Itinerary'
    },
    {
      id: 'family-kerala',
      title: 'Suggest a family trip in Kerala',
      icon: '👨‍👩‍👧‍👦',
      category: 'Family Tour'
    },
    {
      id: 'low-budget',
      title: 'How can I travel on a low budget?',
      icon: '💡',
      category: 'Travel Tips'
    },
    {
      id: 'alleppey-romantic',
      title: 'Top romantic backwater cruise in Alleppey',
      icon: '🌅',
      category: 'Romance'
    },
    {
      id: 'kochi-culture',
      title: 'Cultural highlights in Fort Kochi',
      icon: '🎭',
      category: 'Culture & Art'
    }
  ];

  // Initial welcome message from AI
  const INITIAL_MESSAGES = [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Hello! I'm **Aria**, your TravelWise AI Travel Assistant. 🌿\n\nI can help you build custom Kerala itineraries, find stays within your budget, suggest scenic transit routes, and calculate estimated costs.\n\nTry asking me a question or tap any of the suggested prompts below to get started!`,
      isWelcome: true
    }
  ];

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Scroll to bottom whenever messages update or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Check if an item is already saved
  const isItemSaved = (itemId) => {
    return savedTrips.some((t) => (t.id || t.hotelId) === itemId);
  };

  // Handle adding an AI suggested item to savedTrips
  const handleAddItemToTrip = (item) => {
    if (isItemSaved(item.id || item.hotelId)) {
      showToast(`Already added to your itinerary!`);
      return;
    }

    if (item.itemType === 'hotel' && onSelectStay) {
      onSelectStay({
        ...item,
        hotelId: item.id || item.hotelId,
        departureDate: departureDate,
        returnDate: returnDate,
        date: departureDate,
        travellers: travellers,
        nights: 3,
        totalEstimatedPrice: (item.price || 3500) * 3
      });
      showToast(`Added "${item.name}" to your Trip Planner!`);
    } else if (item.itemType === 'transport' && onSelectTransport) {
      onSelectTransport({
        ...item,
        travelDate: departureDate,
        date: departureDate,
        travellers: travellers,
        totalEstimatedPrice: item.fareType === 'per-vehicle' ? item.fare : (item.fare * travellers)
      });
      showToast(`Added "${item.name}" transit to your Trip Planner!`);
    } else if (item.itemType === 'activity' && onSelectActivity) {
      onSelectActivity({
        ...item,
        travelDate: departureDate,
        date: departureDate,
        travellers: travellers,
        totalEstimatedPrice: item.price * travellers
      });
      showToast(`Added "${item.title || item.name}" to your Trip Planner!`);
    }
  };

  // Knowledge base matcher & response generator
  const generateAssistantResponse = (query) => {
    const q = query.toLowerCase().trim();

    // 1. "Plan a 3-day Munnar trip under ₹8,000"
    if (q.includes('munnar') && (q.includes('8000') || q.includes('8,000') || q.includes('3-day') || q.includes('3 day') || q.includes('budget'))) {
      const stay = SAMPLE_HOTELS.find((h) => h.id === 'hotel-munnar-1') || SAMPLE_HOTELS[0];
      const transport = SAMPLE_TRANSPORTS.find((t) => t.id === 'tr-ksrtc-swift-1') || SAMPLE_TRANSPORTS[1];
      const activity = SAMPLE_ACTIVITIES.find((a) => a.id === 'act-tea-tour-1') || SAMPLE_ACTIVITIES[1];

      return {
        text: `Here is a curated **3-Day Munnar Hill Station Itinerary** tailored to stay comfortably under your **₹8,000** target budget! 🏔️✨\n\n` +
          `### 📅 Day-by-Day Breakdown:\n` +
          `• **Day 1 — Scenic Ascent & Tea Mist Arrival**\n` +
          `  - Board the early morning KSRTC SWIFT AC bus from Kochi (₹320 fare per person).\n` +
          `  - Check into your tea valley resort in Chithirapuram and relax.\n` +
          `  - Sunset stroll across fragrant cardamom plantations.\n\n` +
          `• **Day 2 — Lockhart Tea Factory & Agronomist Tasting**\n` +
          `  - Morning guided heritage walking tour of 1879 Lockhart tea factory (₹850).\n` +
          `  - Afternoon visit to Mattupetty Lake & Echo Point.\n` +
          `  - Evening bonfire with local Kerala black pepper tea.\n\n` +
          `• **Day 3 — Eravikulam Wilderness & Return**\n` +
          `  - Morning safari spotting rare Nilgiri Tahr mountain goats.\n` +
          `  - Explore Munnar spice market for fresh cinnamon and tea leaves.\n` +
          `  - Return journey back to Kochi.\n\n` +
          `### 💰 Estimated Budget Breakdown (Per Person):\n` +
          `• **Transport (Round-trip bus)**: ₹640\n` +
          `• **Accommodation (2 Nights stay share)**: ~₹4,500\n` +
          `• **Activities & Entry Tickets**: ₹1,800\n` +
          `• **Local Meals & Tea Tastings**: ~₹900\n` +
          `• **Total Estimated Cost**: **₹7,840** (Within your ₹8,000 budget!)`,
        recommendations: [
          { ...stay, itemType: 'hotel', customSubtitle: '2 Nights • Tea Valley Balcony' },
          { ...transport, itemType: 'transport', customSubtitle: 'Kochi → Munnar Scenic Route' },
          { ...activity, itemType: 'activity', customSubtitle: 'Estate Plucking & Tasting Tour' }
        ]
      };
    }

    // 2. "Suggest a family trip in Kerala"
    if (q.includes('family') || q.includes('kids') || q.includes('parents')) {
      const stay = SAMPLE_HOTELS.find((h) => h.id === 'hotel-alleppey-1') || SAMPLE_HOTELS[1];
      const transport = SAMPLE_TRANSPORTS.find((t) => t.id === 'tr-suv-chauffeur-1') || SAMPLE_TRANSPORTS[2];
      const activity = SAMPLE_ACTIVITIES.find((a) => a.id === 'act-kathakali-1') || SAMPLE_ACTIVITIES[0];

      return {
        text: `Traveling to Kerala with family is wonderful! Here is a stress-free **4-Day Kerala Family Discovery Tour** blending culture, comfort, and backwater magic. 👨‍👩‍👧‍👦🌴\n\n` +
          `### 👨‍👩‍👧 Family Highlights:\n` +
          `• **Fort Kochi Cultural Evening**: Watch traditional Kathakali classical dance with live face-paint demonstrations that kids and elders love.\n` +
          `• **Private Chauffeur SUV**: Avoid train platform rushes with a dedicated private vehicle and polite local driver for all transfers.\n` +
          `• **Luxury Alleppey Houseboat**: Cruise calm palm canals with an onboard chef cooking mild, fresh family meals.\n\n` +
          `### 💡 Family Travel Tips:\n` +
          `1. Choose private vehicle transfers for luggage convenience and flexible photo breaks.\n` +
          `2. Request mild Kerala coconut stew ("Ishtu") and appams for younger children.\n` +
          `3. Keep lightweight raincoats and mosquito repellent handy for outdoor walks.`,
        recommendations: [
          { ...stay, itemType: 'hotel', customSubtitle: 'Family Friendly • Private Chef' },
          { ...transport, itemType: 'transport', customSubtitle: 'Private Chauffeur • AC Fleet' },
          { ...activity, itemType: 'activity', customSubtitle: 'Live Makeup Demo & Show' }
        ]
      };
    }

    // 3. "How can I travel on a low budget?"
    if (q.includes('low budget') || q.includes('cheap') || q.includes('save money') || q.includes('budget tips')) {
      const transport = SAMPLE_TRANSPORTS.find((t) => t.id === 'tr-ksrtc-swift-1') || SAMPLE_TRANSPORTS[1];
      const activity = SAMPLE_ACTIVITIES.find((a) => a.id === 'act-tea-tour-1') || SAMPLE_ACTIVITIES[1];

      return {
        text: `Here are 5 expert insider strategies to explore Kerala on a **smart backpacker or student budget**: 💡🎒\n\n` +
          `1. **Leverage Public Transit**: Take state **KSRTC SWIFT AC buses** (₹320) or Southern Railway trains (from ₹150) rather than private airport taxis.\n` +
          `2. **Public Government Ferries**: In Alleppey, the SWTD public water ferry costs only **₹25 - ₹40** for stunning backwater views, compared to ₹6,800 for private houseboats!\n` +
          `3. **Dine at Local Cafes**: Enjoy traditional Kerala vegetarian Sadhya on banana leaf at Indian Coffee House or heritage eateries for under ₹120.\n` +
          `4. **Travel Off-Peak**: Visiting in mid-October to November offers lush green landscapes with lower hotel tariffs.\n` +
          `5. **Book Heritage Homestays**: Choose homestays in Chithirapuram or Fort Kochi for authentic hospitality at half the resort price.`,
        recommendations: [
          { ...transport, itemType: 'transport', customSubtitle: 'Best Value Transit' },
          { ...activity, itemType: 'activity', customSubtitle: 'Affordable Guided Experience' }
        ]
      };
    }

    // 4. "Top romantic backwater cruise in Alleppey"
    if (q.includes('romantic') || q.includes('honeymoon') || q.includes('couple') || q.includes('cruise')) {
      const stay = SAMPLE_HOTELS.find((h) => h.id === 'hotel-alleppey-1') || SAMPLE_HOTELS[1];
      const activity = SAMPLE_ACTIVITIES.find((a) => a.id === 'act-backwater-cruise-1') || SAMPLE_ACTIVITIES[2];

      return {
        text: `For a dream romantic retreat in Kerala, nothing matches the golden waters of **Alleppey (Alappuzha)**! 🌅❤️\n\n` +
          `### 🛶 Romantic Highlights:\n` +
          `• **Private Kettuvallam Houseboat**: Spend the night gliding across Lake Vembanad with candlelit dining on the upper sundeck.\n` +
          `• **Sunset Shikara Ride**: Take an intimate wooden canopy canoe through narrow lotus-filled village canals where large boats cannot enter.\n` +
          `• **Chef's Delights**: Savor pearl spot fish (Karimeen Pollichathu) or fresh vegetable thoran prepared fresh onboard.\n\n` +
          `Add these romantic options directly to your trip planner below:`,
        recommendations: [
          { ...stay, itemType: 'hotel', customSubtitle: 'Private AC Suite & Sundeck' },
          { ...activity, itemType: 'activity', customSubtitle: 'Intimate Sunset Canal Cruise' }
        ]
      };
    }

    // 5. "Cultural highlights in Fort Kochi"
    if (q.includes('kochi') || q.includes('culture') || q.includes('kathakali') || q.includes('heritage')) {
      const stay = SAMPLE_HOTELS.find((h) => h.id === 'hotel-kochi-1') || SAMPLE_HOTELS[3];
      const activity = SAMPLE_ACTIVITIES.find((a) => a.id === 'act-kathakali-1') || SAMPLE_ACTIVITIES[0];

      return {
        text: `**Fort Kochi** is Kerala's timeless cultural hub, blending Portuguese, Dutch, British, and ancient Malabar traditions. 🎭🏛️\n\n` +
          `### 🎨 Recommended Cultural Trail:\n` +
          `1. **Chinese Fishing Nets (Cheena Vala)**: Witness 600-year-old cantilever fishing contraptions along Vasco da Gama Square.\n` +
          `2. **Kathakali Performance**: Marvel at the 400-year-old dance drama with intricate hand mudras and drumming.\n` +
          `3. **Jew Town & Paradesi Synagogue**: Explore spice shops selling cardamom, cloves, and vintage curios.\n` +
          `4. **Mattancherry Dutch Palace**: View mythological temple murals and colonial portraits.\n\n` +
          `Here are authentic stay and performance options you can add to your itinerary:`,
        recommendations: [
          { ...stay, itemType: 'hotel', customSubtitle: 'Restored 300-Yr Heritage Mansion' },
          { ...activity, itemType: 'activity', customSubtitle: 'Classic Dance & Live Makeup' }
        ]
      };
    }

    // 6. Generic or keyword-based fallback
    const matchedStay = SAMPLE_HOTELS.find((h) => q.includes(h.destination.toLowerCase())) || SAMPLE_HOTELS[0];
    const matchedTransport = SAMPLE_TRANSPORTS.find((t) => q.includes(t.destination.toLowerCase()) || q.includes(t.type.toLowerCase())) || SAMPLE_TRANSPORTS[0];
    const matchedActivity = SAMPLE_ACTIVITIES.find((a) => q.includes(a.destination.toLowerCase())) || SAMPLE_ACTIVITIES[1];

    return {
      text: `Thanks for your travel question! 🌴\n\n` +
        `Based on your request, I've gathered recommendations matching **${destination}** and Kerala highlights. ` +
        `We suggest combining scenic transit, verified heritage stays, and guided experiences.\n\n` +
        `### 🧭 Quick Tips for Your Trip:\n` +
        `• Ideal trip duration: **3 to 4 days** for a relaxed pace.\n` +
        `• Recommended travel window: **October to March** for pleasant hill breezes and calm waters.\n` +
        `• Review the matched accommodations and experiences below and add them directly to your itinerary!`,
      recommendations: [
        { ...matchedStay, itemType: 'hotel', customSubtitle: `Stay in ${matchedStay.destination}` },
        { ...matchedTransport, itemType: 'transport', customSubtitle: `${matchedTransport.type} Transit` },
        { ...matchedActivity, itemType: 'activity', customSubtitle: `Tour in ${matchedActivity.destination}` }
      ]
    };
  };

  // Submit a user message
  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Truthful, natural thinking delay (700ms)
    setTimeout(() => {
      const response = generateAssistantResponse(query);
      const assistantMessage = {
        id: `msg-assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.text,
        recommendations: response.recommendations
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 700);
  };

  // Handle Enter key submit
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputText('');
    setIsTyping(false);
    showToast('Conversation cleared.');
  };

  return (
    <div className="assistant-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="planner-toast" role="alert">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="assistant-top-header">
        <div className="assistant-header-content">
          <div className="assistant-header-left">
            <button
              id="btn-assistant-back-dashboard"
              type="button"
              className="btn-planner-back"
              onClick={onBackToDashboard}
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </button>

            <div className="assistant-title-group">
              <div className="assistant-badge-pill">
                <Sparkles size={14} />
                <span>Screen 8 • AI Assistant</span>
              </div>
              <h1 className="assistant-main-title">TravelWise AI Travel Assistant</h1>
            </div>
          </div>

          <div className="assistant-header-right">
            <button
              id="btn-assistant-view-planner"
              type="button"
              className="btn-planner-header-action"
              onClick={onOpenPlanner}
              title="Open Screen 7 Trip Planner"
            >
              <Calendar size={16} />
              <span>My Trip Planner ({savedTrips.length})</span>
            </button>

            <button
              id="btn-assistant-reset-chat"
              type="button"
              className="btn-assistant-reset"
              onClick={handleResetChat}
              title="Reset conversation"
            >
              <RefreshCw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Context Summary Bar */}
      <div className="assistant-context-bar">
        <div className="assistant-context-inner">
          <div className="context-item">
            <MapPin size={15} className="context-icon" />
            <span>Target: <strong>{destination}, Kerala</strong></span>
          </div>
          <span className="context-divider">•</span>
          <div className="context-item">
            <Calendar size={15} className="context-icon" />
            <span>Dates: <strong>{departureDate} → {returnDate}</strong></span>
          </div>
          <span className="context-divider">•</span>
          <div className="context-item">
            <Users size={15} className="context-icon" />
            <span>Party: <strong>{travellers} {travellers === 1 ? 'Guest' : 'Guests'}</strong></span>
          </div>
          <span className="context-divider">•</span>
          <div className="context-item">
            <CheckCircle2 size={15} className="context-icon" />
            <span>Saved in Trip: <strong>{savedTrips.length} items</strong></span>
          </div>
        </div>
      </div>

      {/* Transparent Prototype Notice */}
      <div className="assistant-notice-banner">
        <ShieldAlert size={18} className="notice-icon" />
        <div className="notice-content">
          <strong>AI Assistant Prototype Notice:</strong> Recommendations and itineraries are intelligent illustrative suggestions based on curated Kerala travel knowledge. Real-time availability, live carrier pricing, and payment transactions are not processed.
        </div>
      </div>

      {/* Chat Messages Main Layout */}
      <main className="assistant-chat-main">
        <div className="chat-thread-container">
          {/* Messages Feed */}
          <div className="chat-messages-feed" id="chat-messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === 'user' ? 'row-user' : 'row-assistant'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="chat-avatar assistant-avatar" aria-label="AI Assistant Avatar">
                    <Sparkles size={18} />
                  </div>
                )}

                <div className={`chat-bubble-card ${msg.sender === 'user' ? 'bubble-user' : 'bubble-assistant'}`}>
                  <div className="bubble-header-row">
                    <span className="bubble-author">
                      {msg.sender === 'user' ? 'You' : 'Aria (TravelWise AI)'}
                    </span>
                    <span className="bubble-time">{msg.timestamp}</span>
                  </div>

                  {/* Message Body */}
                  <div className="bubble-text-content">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="bubble-heading">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      return (
                        <p key={pIdx} className="bubble-paragraph">
                          {paragraph.split('\n').map((line, lIdx) => (
                            <React.Fragment key={lIdx}>
                              {line.startsWith('• ') ? (
                                <span className="bubble-bullet-item">{line}</span>
                              ) : (
                                line
                              )}
                              {lIdx < paragraph.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                      );
                    })}
                  </div>

                  {/* Suggested Prompts Pill Section for Welcome Message */}
                  {msg.isWelcome && (
                    <div className="welcome-prompts-section">
                      <div className="welcome-prompts-label">
                        <Compass size={14} />
                        <span>Try these popular planning questions:</span>
                      </div>
                      <div className="welcome-prompts-grid">
                        {SUGGESTED_PROMPTS.map((prompt) => (
                          <button
                            key={prompt.id}
                            type="button"
                            className="btn-prompt-pill"
                            onClick={() => handleSendMessage(prompt.title)}
                          >
                            <span className="prompt-icon">{prompt.icon}</span>
                            <span className="prompt-text">{prompt.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Item Cards Inside Assistant Message */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="bubble-recommendations-box">
                      <div className="rec-box-header">
                        <Tag size={15} />
                        <span>Curated Suggestions for Your Trip:</span>
                      </div>

                      <div className="rec-cards-list">
                        {msg.recommendations.map((item, recIdx) => {
                          const saved = isItemSaved(item.id || item.hotelId);

                          let typeBadge = 'Stay';
                          let typeClass = 'rec-stay';
                          let icon = <Hotel size={15} />;
                          let priceLabel = `₹${(item.price || 3500).toLocaleString()} / night`;

                          if (item.itemType === 'transport') {
                            typeBadge = item.type || 'Transit';
                            typeClass = 'rec-transport';
                            icon = item.type === 'Train' ? <Train size={15} /> : item.type === 'Cab' ? <Car size={15} /> : <Bus size={15} />;
                            priceLabel = `₹${(item.fare || 500).toLocaleString()} ${item.fareType === 'per-vehicle' ? '/ cab' : '/ person'}`;
                          } else if (item.itemType === 'activity') {
                            typeBadge = 'Experience';
                            typeClass = 'rec-activity';
                            icon = <Ticket size={15} />;
                            priceLabel = `₹${(item.price || 850).toLocaleString()} / person`;
                          }

                          return (
                            <div key={recIdx} className="rec-item-card">
                              <div className="rec-card-main">
                                <div className="rec-badges-row">
                                  <span className={`rec-type-badge ${typeClass}`}>
                                    {icon}
                                    <span>{typeBadge}</span>
                                  </span>
                                  {item.badge && <span className="rec-special-badge">{item.badge}</span>}
                                </div>

                                <h5 className="rec-item-title">{item.name || item.title}</h5>
                                
                                <div className="rec-item-meta">
                                  <span>{item.location || item.route || item.origin}</span>
                                  {item.customSubtitle && (
                                    <>
                                      <span className="dot">•</span>
                                      <span className="rec-subtitle">{item.customSubtitle}</span>
                                    </>
                                  )}
                                </div>

                                <div className="rec-price-row">
                                  <span className="rec-price-tag">{priceLabel}</span>
                                </div>
                              </div>

                              <div className="rec-card-action">
                                <button
                                  type="button"
                                  className={`btn-rec-add ${saved ? 'is-added' : ''}`}
                                  onClick={() => handleAddItemToTrip(item)}
                                  disabled={saved}
                                >
                                  {saved ? (
                                    <>
                                      <CheckCircle2 size={15} />
                                      <span>Added to Trip</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus size={15} />
                                      <span>Add to My Trips</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="chat-avatar user-avatar" aria-label="User Avatar">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {/* Truthful Simulated Typing Indicator */}
            {isTyping && (
              <div className="chat-bubble-row row-assistant typing-row">
                <div className="chat-avatar assistant-avatar">
                  <Sparkles size={18} />
                </div>
                <div className="chat-bubble-card bubble-assistant typing-card">
                  <div className="typing-dots-box">
                    <span className="dot-pulse"></span>
                    <span className="dot-pulse"></span>
                    <span className="dot-pulse"></span>
                  </div>
                  <span className="typing-label">Aria is researching Kerala routes & calculating budgets...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions Bar */}
          <div className="chat-quick-bar">
            <span className="quick-bar-label">Suggestions:</span>
            <div className="quick-bar-scroll">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={`quick-${prompt.id}`}
                  type="button"
                  className="quick-bar-btn"
                  onClick={() => handleSendMessage(prompt.title)}
                  disabled={isTyping}
                >
                  <span>{prompt.icon}</span>
                  <span>{prompt.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Box */}
          <div className="chat-input-area">
            <form
              className="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                id="assistant-input-box"
                type="text"
                className="chat-text-input"
                placeholder="Ask Aria... e.g. 'Plan a 3-day Munnar trip under ₹8,000' or 'Suggest budget stays'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                autoComplete="off"
              />

              <button
                id="btn-assistant-send"
                type="submit"
                className="btn-chat-send"
                disabled={!inputText.trim() || isTyping}
                aria-label="Send message to AI assistant"
              >
                <Send size={18} />
                <span>Send</span>
              </button>
            </form>

            <div className="chat-input-footer-hint">
              <span>Press <strong>Enter</strong> to send. Offline demo engine: No API key or payment credentials required.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
