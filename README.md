# ✈️ TravelWise — Full-Stack Travel Planning Application

Welcome to **TravelWise**, your all-in-one travel planning application! This repository contains the complete implementation of:
- **Screen 1**: Immersive Splash Screen with backend configuration fetching and offline fallback.
- **Screen 2**: Polished, responsive **Login & Sign Up Interface** with complete validation, password toggles, modal dialogs, and prototype session simulation.
- **Screen 3**: Comprehensive **Home Dashboard** featuring a brand navbar, hero trip search widget, interactive service cards (Hotels, Transport, Tickets), popular Kerala destinations with rich imagery, and a prototype search results view.
- **Screen 4**: Dedicated **Hotels & Stays Search Results** view featuring search parameter summary, dynamic destination/type/rating/price filters, sorting options, sample accommodation cards for Kerala, details modal with estimated stay price calculation, and prototype itinerary stay selection.
- **Screen 5**: Dedicated **Transport Options & Transit Results** view featuring route selection (origin & destination), travel date and passenger counts, mode filters (Trains, Buses, Cabs/Taxis, Ferries), maximum estimated fare slider, sorting options (lowest fare, shortest duration, earliest departure), journey timeline cards, stay details modal with calculated total fares, and direct selection into the prototype My Trips itinerary.
- **Screen 6**: Dedicated **Tickets, Tours & Activities** view featuring destination and category filters (Cultural Performance, Plantation Tour, Backwater Cruise, Wildlife Experience, Sightseeing), maximum price slider, sorting by lowest price, rich attraction cards with local photography and duration tags, activity details modal, and direct booking into the prototype My Trips state.
- **Screen 7**: Dedicated **My Trip Planner & Itinerary** view featuring chronological day-by-day scheduling of all saved stays, transport rides, and activities, real-time total budget & category breakdown calculations, item removal actions updating shared state immediately, engaging empty states, and quick exploration shortcuts.
- **Screen 8**: Dedicated **AI Travel Assistant** interface ("Aria") featuring interactive prompt suggestions ("Plan a 3-day Munnar trip under ₹8,000", "Suggest a family trip in Kerala", "How can I travel on a low budget?"), budget- and duration-aware customized suggestions, rich recommended item cards with "Add to My Trips" actions, simulated typing indicator, and transparent demo-data disclaimers without requiring external API keys.

---

## 📁 Project Structure

```text
Travel/
├── backend/
│   ├── server.js            # Express backend server (health & app-config endpoints)
│   ├── test.js              # Automated verification test script for backend APIs
│   └── package.json         # Backend dependencies (express, cors)
├── public/
│   ├── beach-hero.jpg       # High-definition tropical coastline hero image
│   ├── munnar-tea.jpg       # Munnar rolling tea hills scenic photography
│   ├── alleppey-houseboat.jpg # Alleppey traditional backwaters houseboat photography
│   └── kovalam-beach.jpg    # Kovalam lighthouse and golden beach photography
├── scripts/
│   └── patch-rollup.js      # System security fallback utility
├── src/
│   ├── components/
│   │   ├── SplashScreen.jsx         # Screen 1: Splash screen matching UI design
│   │   ├── LoginPlaceholder.jsx     # Screen 2: Polished Login & Sign Up interface
│   │   ├── HomeDashboard.jsx        # Screen 3: Complete TravelWise Home Dashboard
│   │   ├── HotelsSearchScreen.jsx   # Screen 4: Hotels & Stays Search Results
│   │   ├── TransportSearchScreen.jsx # Screen 5: Transport Options & Transit Results
│   │   ├── ActivitiesSearchScreen.jsx # Screen 6: Tickets & Activities Search Results
│   │   ├── TripPlannerScreen.jsx    # Screen 7: My Trip Planner & Itinerary
│   │   └── TravelAssistantScreen.jsx # Screen 8: AI Travel Assistant Chat Interface
│   ├── services/
│   │   └── api.js           # Centralized API service with offline fallback
│   ├── App.jsx              # Main app router / screen state coordinator
│   ├── main.jsx             # React DOM mounting entrypoint
│   └── styles.css           # TravelWise design system, tokens, and animations
├── .env                     # Local frontend environment variables (VITE_API_URL)
├── .env.example             # Example environment template
├── .gitignore               # Standard git ignore rules
├── index.html               # HTML entrypoint with Plus Jakarta Sans & Inter fonts
├── package.json             # Frontend dependencies & npm run scripts
└── vite.config.js           # Vite configuration
```

---

## 🛠️ Technologies Used

### Frontend
- **React (v18)**: Component-driven UI framework with responsive state management across all 8 screens.
- **Vite (v6)**: Blazing-fast development server and build tool running at [http://localhost:5173](http://localhost:5173).
- **CSS (Vanilla)**: Scoped design system featuring primary blue `#0866F5`, dark navy `#102A56`, soft borders `#E1EDFC`, rounded cards, journey timeline connectors, day-by-day itinerary groups, chat bubbles, pulsing typing indicators, and keyframe animations.
- **Lucide React**: Clean icons (`Plane`, `Home`, `Compass`, `MapPin`, `Calendar`, `Users`, `Search`, `Hotel`, `Ticket`, `Bus`, `Train`, `Car`, `Ship`, `Clock`, `Star`, `ShieldAlert`, `Sparkles`, `User`, `LogOut`, `Menu`, `X`, `SlidersHorizontal`, `ArrowLeft`, `Navigation`, `Tag`, `Trash2`, `Share2`, `Send`, `Bot`, `RefreshCw`, `DollarSign`).

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Lightweight REST API server running at [http://localhost:5000](http://localhost:5000).
- **CORS**: Cross-Origin Resource Sharing enabled for Vite frontend (`localhost:5173`).
- **Zero Database**: Fast, stateless JSON configuration delivery.

---

## 🚀 How to Run the Project

You can run the frontend and backend in two separate terminals:

### Terminal 1: Backend Server (Port 5000)
```powershell
npm run server
```
- Server URL: [http://localhost:5000](http://localhost:5000)
- Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- App config: [http://localhost:5000/api/app-config](http://localhost:5000/api/app-config)

### Terminal 2: Frontend App (Port 5173)
```powershell
npm run dev
```
- Open in your browser: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing Screen 8 (AI Travel Assistant) in Your Browser

1. **Access Screen 8**:
   - Open [http://localhost:5173](http://localhost:5173).
   - On Screen 1 (Splash), click **Continue as Guest** (or log in via Screen 2) to enter Screen 3 (Dashboard).
   - **Method A**: In the top navbar, click **AI Assistant** (with the blue Sparkles icon).
   - **Method B**: On the Dashboard, click the **AI Assistant feature banner** under the service cards ("Need custom trip ideas or budget planning? [Ask AI Assistant]").
   - **Method C**: In the footer, click **Screen 8 (AI Travel Assistant)**.
   - **Method D**: From Screen 7 (Trip Planner), click **Ask AI Concierge** in the header or sidebar shortcuts.

2. **Test Suggested Prompts**:
   - Click the prompt pill: **"Plan a 3-day Munnar trip under ₹8,000"**.
   - Notice the realistic simulated typing indicator: *"Aria is researching Kerala routes & calculating budgets..."*.
   - Review Aria's response:
     - Detailed Day 1, Day 2, Day 3 schedule.
     - Transparent budget breakdown (Transport: ₹640, Accommodation: ~₹4,500, Activities: ₹1,800, Food: ~₹900 = Total: ₹7,840 within ₹8,000 budget!).
     - Curated item cards for Tea Valley Resort, KSRTC SWIFT bus, and Lockhart Tea Estate Tour.

3. **Test Adding Suggestions to Shared Itinerary**:
   - In Aria's recommendation cards, click **Add to My Trips** on any hotel, transport, or activity.
   - The button instantly transforms to **Added to Trip ✓** with a green checkmark and toast notification.
   - Notice the top header counter **My Trip Planner (N items)** immediately increments!

4. **Test Other Predefined Planning Questions**:
   - Click **"Suggest a family trip in Kerala"** to view family-friendly recommendations (Kochi dance demo, chauffeur SUV, luxury houseboat).
   - Click **"How can I travel on a low budget?"** to view insider backpacker savings tips (public ferries, SWIFT buses, homestays).
   - Type your own query into the chat input (e.g. *"Suggest best romantic trip in Alleppey"*) and press **Enter** or click **Send**.

5. **Verify Cross-Screen Consistency (Screen 8 ↔ Screen 7 & 3)**:
   - Click **My Trip Planner** in the top-right header to navigate directly to Screen 7.
   - Notice the items you added via the AI Assistant appear immediately in the day-by-day schedule and are included in the **Estimated Trip Cost** calculation!
   - Click **Back to Dashboard**, open **My Trips**, and verify the items are reflected there as well.

---

## 🏗️ Production Build Verification

Both `npm run build` and `npm run test:api` have been tested and verified:
```text
✓ 1581 modules transformed.
dist/index.html                   1.20 kB │ gzip:  0.71 kB
dist/assets/index-E6e1f1MU.css   86.75 kB │ gzip: 13.43 kB
dist/assets/index-Bv9p079J.js   304.07 kB │ gzip: 83.97 kB
✓ built in 2.53s
```
Backend health and configuration endpoints are running and 100% active.
