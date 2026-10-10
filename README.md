# ✈️ TravelWise — Full-Stack Travel Planning Application

Welcome to **TravelWise**, your all-in-one travel planning application! This repository contains the complete implementation of:
- **Screen 1**: Immersive Splash Screen with backend configuration fetching and offline fallback.
- **Screen 2**: Polished, responsive **Login & Sign Up Interface** with complete validation, password toggles, modal dialogs, and prototype session simulation.
- **Screen 3**: Comprehensive **Home Dashboard** featuring a brand navbar, hero trip search widget, interactive service cards (Hotels, Transport, Tickets), popular Kerala destinations with rich imagery, and a prototype search results view.
- **Screen 4**: Dedicated **Hotels & Stays Search Results** view featuring search parameter summary, dynamic destination/type/rating/price filters, sorting options, sample accommodation cards for Kerala, details modal with estimated stay price calculation, and prototype itinerary stay selection.
- **Screen 5**: Dedicated **Transport Options & Transit Results** view featuring route selection (origin & destination), travel date and passenger counts, mode filters (Trains, Buses, Cabs/Taxis, Ferries), maximum estimated fare slider, sorting options (lowest fare, shortest duration, earliest departure), journey timeline cards, stay details modal with calculated total fares, and direct selection into the prototype My Trips itinerary.
- **Screen 6**: Dedicated **Tickets, Tours & Activities** view featuring destination and category filters (Cultural Performance, Plantation Tour, Backwater Cruise, Wildlife Experience, Sightseeing), maximum price slider, sorting by lowest price, rich attraction cards with local photography and duration tags, activity details modal, and direct booking into the prototype My Trips state.
- **Screen 7**: Dedicated **My Trip Planner & Itinerary** view featuring chronological day-by-day scheduling of all saved stays, transport rides, and activities, real-time total budget & category breakdown calculations, item removal actions updating shared state immediately, engaging empty states, Clear All Trips confirmation modal, and quick exploration shortcuts.
- **Screen 8**: Dedicated **AI Travel Assistant** interface ("Aria") featuring interactive prompt suggestions ("Plan a 3-day Munnar trip under ₹8,000", "Suggest a family trip in Kerala", "How can I travel on a low budget?"), budget- and duration-aware customized suggestions, rich recommended item cards with "Add to My Trips" actions, simulated typing indicator, and transparent demo-data disclaimers without requiring external API keys.
- **Phase 3 Persistence**: Complete client-side browser **localStorage** data persistence keeping Screen 3 (Dashboard My Trips), Screen 7 (Trip Planner), and Screen 8 (Aria) synchronized in real-time, preventing demo item duplication on refresh, supporting graceful error handling, and providing confirmed "Clear All Trips" capabilities.

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
│   │   ├── api.js           # Centralized backend API service with offline fallback
│   │   └── storage.js       # Phase 3 browser localStorage persistence engine
│   ├── App.jsx              # Main app router / shared state coordinator
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

## 💾 Phase 3 Data Persistence Architecture

The persistence layer is managed cleanly in [`src/services/storage.js`](file:///c:/Users/ashfi_/Desktop/Travel/src/services/storage.js):

1. **Storage Keys**:
   - `travelwise_saved_trips`: Stores the JSON array of saved hotels, transport rides, and activities.
   - `travelwise_trips_initialized`: Tracks whether the user has interacted with the app.
2. **First-Visit vs. Refresh Guarantee**:
   - On the very first visit, initial sample bookings are loaded and persisted to storage.
   - On subsequent visits or page refreshes, items are loaded from `localStorage`.
   - If the user clears all items (`[]`) or removes individual items, their modifications are preserved — default demo items will **never** overwrite user changes or re-appear after being deleted.
3. **Data Sanitization & Security**:
   - Trips are validated on load and save to strip out corrupt or invalid properties.
   - **Zero Secrets**: Passwords, auth credentials, and API keys are strictly never written to `localStorage`.
4. **Multi-Tab Real-Time Synchronization**:
   - `window.addEventListener('storage', ...)` ensures that adding, removing, or clearing items in one browser tab immediately reflects across all other open tabs without a manual reload.
5. **Fault Tolerance**:
   - Wrapped in full `try...catch` blocks to gracefully handle disabled storage, private browsing restrictions, or quota limits without application crashes.

---

## 🛠️ Technologies Used

### Frontend
- **React (v18)**: Component-driven UI framework with responsive state management across all 8 screens.
- **Vite (v6)**: Blazing-fast development server and build tool running at [http://localhost:5173](http://localhost:5173).
- **Web Storage API (localStorage)**: Zero external databases required; fast and private client-side persistence.
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

## 🧪 Step-by-Step Manual Testing for Data Persistence

Follow these steps in your browser to verify that Phase 3 localStorage persistence works reliably:

### Test 1: Verify Initial Persistence
1. Open [http://localhost:5173](http://localhost:5173).
2. Click **Continue as Guest** to enter Screen 3 (Dashboard).
3. Notice the top navbar **My Trips** counter shows **3**.
4. Open your browser Developer Tools (**F12** → **Application** tab → **Local Storage** → `http://localhost:5173`):
   - You will see `travelwise_saved_trips` containing the 3 initial demo bookings.
   - You will see `travelwise_trips_initialized` set to `"true"`.

### Test 2: Add New Bookings & Refresh
1. On Screen 3 (Dashboard), click **Hotels & Stays** to open Screen 4.
2. Select any hotel (e.g. *Grand Vembanad Luxury Houseboat*) and click **Book Stay (Prototype)**.
3. Return to Dashboard: notice the navbar counter is now **4**.
4. Press **F5 (Refresh)** in your browser:
   - Notice the count remains **4**.
   - Open **My Trips**: the newly added houseboat is still there with all dates and pricing intact!

### Test 3: Remove an Individual Item
1. Open Screen 7 (**My Trip Planner**).
2. Click the red **Remove** button on any itinerary card.
3. Notice the item disappears immediately, the item count drops to **3**, and the **Total Estimated Budget** updates instantaneously.
4. Press **F5 (Refresh)** in your browser:
   - The removed item is **not** restored and demo data does **not** duplicate. The count remains **3**.

### Test 4: Clear All Trips (Confirmation Step)
1. On Screen 7, click the red **Clear All** button in the top action bar.
2. A confirmation modal will appear: *"Are you sure you want to remove all saved bookings?"*.
3. Click **Cancel**: your itinerary remains safe and untouched.
4. Click **Clear All** again, then click **Yes, Clear All Trips**:
   - All items are removed immediately.
   - The empty state card is displayed.
   - Both Screen 7 and Dashboard My Trips navbar counter display **0**.
5. Press **F5 (Refresh)** in your browser:
   - The empty state persists! Demo items will **not** be re-seeded because user action took precedence.

### Test 5: Multi-Tab Synchronization
1. Open [http://localhost:5173](http://localhost:5173) in two side-by-side browser tabs.
2. In Tab 1, navigate to Screen 8 (Aria AI Assistant) and add a suggested activity to your trips.
3. Without refreshing, switch to Tab 2:
   - Notice the **My Trips** counter in Tab 2 updates in real-time thanks to the storage synchronization listener!

---

## 🏗️ Production Build Verification

Both `npm run build` and `npm run test:api` have been tested and verified:
```text
✓ 1582 modules transformed.
dist/index.html                   1.20 kB │ gzip:  0.71 kB
dist/assets/index-BrO49p3U.css   87.15 kB │ gzip: 13.48 kB
dist/assets/index-C3RmG04Z.js   311.04 kB │ gzip: 86.01 kB
✓ built in 4.05s
```
Backend health and configuration endpoints are running and 100% active.
