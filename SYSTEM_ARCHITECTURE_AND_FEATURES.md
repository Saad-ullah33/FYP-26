# NextProperty / PropSight — Core Features, Application Flow & Architecture

> **Project Name:** NextProperty / PropSight  
> **Repository:** FYP-26  
> **Tech Stack:** React 19, Vite, Tailwind CSS, Mantine UI, Leaflet GIS, Google Gemini AI (Grounding API), WebSockets (STOMP/SockJS), Axios REST API.

---

## 1. Core Features of the Application

NextProperty (PropSight) is an advanced, AI-driven real estate intelligence, property trading, construction estimation, and GIS plot mapping platform designed specifically for Pakistan's real estate market (with primary optimization for Faisalabad and major urban sectors).

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   NEXTPROPERTY CORE FEATURES                                     │
├───────────────────┬───────────────────┬───────────────────┬───────────────────┬──────────────────┤
│ Property Finder & │  Real-Time Live   │ AI Valuation &    │ Title Deed        │ SmartBuild Cost  │
│ Search Engine     │ Auction Platform  │ Investor Radar    │ Verification      │ Estimator        │
├───────────────────┼───────────────────┼───────────────────┼───────────────────┼──────────────────┤
│ GIS Interactive   │ AI Chatbot        │ Multi-Tier        │ User & Admin      │ Area Guides &    │
│ Plot Finder       │ Virtual Assistant │ Subscription System│ Role Dashboards   │ Market Index     │
└───────────────────┴───────────────────┴───────────────────┴───────────────────┴──────────────────┘
```

### 1.1 Property Finder & Multi-Criteria Search Engine
- **Property Directory:** Comprehensive catalog for buying, selling, and renting residential and commercial properties (Houses, Apartments, Plots, Offices, Shops).
- **Advanced Filtering:** Filter by city, sub-location/colony, price range, property type, area size (Marla / Kanal / Sq. Ft.), bedroom count, and bathroom count.
- **Detailed Property Views:** Interactive picture galleries, property specification tables, seller/agent contact cards, tour scheduling forms, and embedded location maps.
- **Property Creation Wizard:** Sellers and agents can publish properties using a multi-step form built with Formik & Yup validation, complete with AI-generated property listing descriptions.

### 1.2 Real-Time Live Property Auctions
- **Live WebSocket Bidding:** Real-time auction room supporting concurrent user bidding powered by STOMP over WebSockets (SockJS fallback).
- **Auction Timer & Status Tracking:** Live countdown timers, dynamic auction statuses (`Upcoming`, `Active / Live`, `Ending Soon`, `Ended`).
- **Interactive Bid Feed:** Real-time stream of incoming bids, active highest bidder indicators, minimum increment validation, and confetti celebrations upon winning.
- **Auction Management:** Admin tools to create, schedule, approve, and finalize auctions.

### 1.3 AI Property Assessor & Investor Radar Hub
- **Google Gemini 2.0 Integration:** Powered by `@google/generative-ai` with **Google Search Grounding** for live web price discovery.
- **Automated Valuation Model (AVM):** Generates market value estimates per Marla/Kanal based on sub-location, size, and property type.
- **5-Year Historical & Projections:** Visualizes past 5-year price trends and projects future 5-year ROI based on regional infrastructure (e.g. CPEC M-4 motorway extensions, ring roads).
- **Budget Feasibility Verdict:** Evaluates user budget against calculated market rates to issue instant verdicts: `Highly Recommended`, `Good Buy`, `Overpriced`, or `Financial Risk`.
- **Investor Radar & Undervalued Deals:** Highlights below-market deals and high-yield investment hot zones with spatial heatmap categorization.

### 1.4 Title Deed & Document Verification System
- **Land Registry Trust Engine:** Digital title deed verification system to prevent real estate fraud and double-allocation.
- **Verification Workflow:** Document upload, legal land record metadata entry, unique verification tracking code generation, and automated hash checks.
- **QR Code Verification Certificates:** Generates instant QR code certificates (`qrcode.react`) for verified title deeds.
- **Admin Moderation:** Dedicated admin review queue for verifying legal deeds, marking status (`APPROVED`, `REJECTED`, `PENDING`), and attaching official notes.

### 1.5 SmartBuild Construction Cost Estimator
- **Live Pakistani Material Pricing:** Dynamically pulls live construction rates (Bricks, OPC Cement, Ravi/Chenab Sand, Sargodha Aggregate/Crush, Grade-60 Steel, Labor rates, Tiling, Painting) via Gemini AI web grounding or high-fidelity local index.
- **Custom Budget Calculations:** Estimates total construction cost based on covered area (Marla / Sq. Ft.), floor count, and finish quality (Grey Structure, Standard Finish, Premium Luxury).
- **Cost Breakdown & Visualization:** Categorized financial summaries and interactive charts built with Recharts.
- **Builder Directory:** Directory of verified construction contractors and civil engineers with ratings and direct inquiry tools.

### 1.6 Interactive GIS Map & Plot Finder
- **Interactive Map Engine:** Integrated with Leaflet and React-Leaflet for smooth vector mapping.
- **Society Plot Overlays:** Custom vector boundaries and plot grids for societies (e.g., FDA City, Canal Road, Wapda City, Eden Valley).
- **Plot Status Color Coding:** Visual plot indicators (`Available` - Green, `Reserved` - Amber, `Sold` - Red).
- **AI Plot Intelligence:** Clicking any plot triggers Gemini AI spatial intelligence analysis evaluating plot position, road connectivity, 6-month appreciation score, and suitability rating.

### 1.7 AI Chatbot Assistant & Subscription System
- **PropSight AI Assistant:** Floating chatbot present across protected routes for instant answers on property law, valuation tips, and local market trends.
- **Multi-Tier Subscriptions:** Feature gating for `FREE`, `PRO`, and `ENTERPRISE` tiers (managed via `SubscriptionContext`).
- **Upgrade Modal & Access Control:** Restricts premium analytics (e.g., deep Investor Radar reports) behind subscription upgrades.

### 1.8 Role-Based Dashboards & Administration
- **User Dashboard:** Centralized workspace for managing posted properties, saved favorites, submitted deed verification requests, and auction participation history.
- **Admin Dashboard:** Management console for system metrics, approving pending property listings, managing auctions, reviewing land deeds, and overseeing registered users.

### 1.9 Property Index, Area Guides & Educational Blogs
- **City & Society Area Guides:** In-depth area guides covering infrastructure, schools, security ratings, and commercial hubs.
- **Property Price Index:** Comparative price charts and trend metrics across top societies.
- **Real Estate Blog Engine:** News, market updates, and buying advice.

---

## 2. Application Flow

### 2.1 User Authentication & Session Lifecycle Flow
```
┌──────────────┐     ┌──────────────┐     ┌────────────────────────┐     ┌──────────────────────┐
│  User Visits │ ──> │ Login/Signup │ ──> │ JWT Access + Refresh   │ ──> │ Stored in LocalStorage│
│   Landing    │     │  Form Submit │     │ Tokens Issued by API   │     │ & AuthContext state  │
└──────────────┘     └──────────────┘     └────────────────────────┘     └──────────────────────┘
                                                                                    │
                                                                                    ▼
┌──────────────┐     ┌──────────────┐     ┌────────────────────────┐     ┌──────────────────────┐
│  Redirect to │ <── │  Auto-Logout │ <── │ Check token expiration │ <── │  AppContent Router   │
│    /login    │     │ Clears Auth  │     │ Interval (Every 10s)   │     │  Route Protection    │
└──────────────┘     └──────────────┘     └────────────────────────┘     └──────────────────────┘
```
1. **Accessing Public Routes:** Users browse Homepage, Property Finder, Area Guides, SmartBuild, and Map without requiring authentication.
2. **Authentication:** Entering credentials at `/login` or `/signup` triggers a POST request to the auth API endpoint. Upon success, JWT `accessToken` and `refreshToken` are saved.
3. **Role-Based Redirection:** `AuthRoute` decodes the JWT role (`ROLE_ADMIN` vs `ROLE_USER`). Admins navigating to `/dashboard` are auto-redirected to `/admin/dashboard`, while regular users load `/dashboard`.
4. **Auto-Logout Security:** `useAutoLogout` hook runs a recurring 10-second interval checking JWT expiration. Expired tokens trigger `clearAuth()` and force navigation back to `/login`.

### 2.2 Property Discovery & Listing Flow
1. **Discovery:** User searches properties from the Hero section or `/property-finder`.
2. **Filtering:** User applies filters (Location, Property Type, Price Range, Beds/Baths).
3. **Detail Inspection:** User opens `/property/:id` to view photos, amenities, price analysis, and map location.
4. **Action:** User submits a contact inquiry or schedules a tour.
5. **Listing Creation:** Logged-in user navigates to `/add-property`. Optionally clicks "Generate Description with AI" (Gemini AI). Submits form -> Property enters `PENDING` status for Admin review -> Approved by Admin -> Published to public directory.

### 2.3 Real-Time Auction Bidding Flow
```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────────────┐
│ Navigate to     │ ──> │ Connect STOMP       │ ──> │ Subscribe to             │
│ /auction/:id    │     │ WebSocket (SockJS)  │     │ /topic/auction/:id       │
└─────────────────┘     └─────────────────────┘     └──────────────────────────┘
                                                                 │
                                                                 ▼
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────────────┐
│ Confetti & Bid  │ <── │ Broadcast New High  │ <── │ Submit Bid payload via   │
│ Log Update      │     │ Bid to All Clients  │     │ socket /app/bid          │
└─────────────────┘     └─────────────────────┘     └──────────────────────────┘
```
1. User enters active auction page `/auction/:id`.
2. `useAuctionSocket` initializes a WebSocket connection to the backend STOMP broker.
3. Subscribes to topic `/topic/auction/{id}` for live bid notifications.
4. User inputs bid amount (> current bid + minimum increment) and submits.
5. Backend validates bid, updates high bidder, and broadcasts updated auction state to all connected clients in real time.
6. When auction timer hits zero, status transitions to `ENDED` and winner details are locked.

### 2.4 Title Deed Verification Flow
1. User visits `/verify-deed`.
2. Uploads scanned land title deed document and enters property identifier details.
3. System generates a unique verification request with a tracking hash.
4. Request appears in Admin Dashboard under **Deed Verification Requests**.
5. Admin cross-checks registry records and updates status to `VERIFIED` or `REJECTED`.
6. Public verification page displays verified status badge along with an auto-generated QR code linkable to the verification record.

### 2.5 SmartBuild Estimator Flow
1. User visits `/smart-build`.
2. Inputs plot size (e.g. 5 Marla, 10 Marla, 1 Kanal), covered area, number of floors, and construction quality level.
3. `geminiService.fetchLiveConstructionRates()` queries live Pakistani construction material rates via Google Search Grounding.
4. System calculates itemized quantities (number of bricks, bags of cement, tons of steel, CFT of sand/crush) and outputs final PKR budget breakdown.
5. User views dynamic pie/bar charts and selects builder profiles for direct quotes.

### 2.6 GIS Plot Finder & Map Flow
1. User opens `/map` or `/plot-finder`.
2. Selects target society/colony (e.g. FDA City Phase 1).
3. Map renders vector overlay of society plots with color-coded availability (`Available`, `Sold`, `Reserved`).
4. Clicking a plot opens a drawer displaying plot number, dimensions, price, and triggers `geminiService.generatePlotAnalysis()` for instant AI investment feedback.

---

## 3. Application Architecture

### 3.1 High-Level Architecture Overview
NextProperty is built as a single-page application (SPA) using React 19 and Vite. The frontend communicates with RESTful microservices / Spring Boot backend APIs and WebSocket message brokers, while integrating external AI models via Google Generative AI SDK.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND (REACT 19 + VITE)                                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │   UI & Components      │  │    State & Context       │  │   Routing & Guards       │ │
│  │ (Tailwind/Mantine/     │  │ (AuthContext /           │  │ (React Router v7 /       │ │
│  │  Lucide / Recharts)    │  │  SubscriptionContext)    │  │  AuthRoute / AutoLogout) │ │
│  └───────────┬────────────┘  └────────────┬─────────────┘  └────────────┬─────────────┘ │
└──────────────┼────────────────────────────┼─────────────────────────────┼────────────────┘
               │                            │                             │
               ▼                            ▼                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                    SERVICES & DATA LAYER                                 │
├────────────────────────────────┬───────────────────────────────┬─────────────────────────┤
│ Axios REST API (`api.js`)      │ WebSocket Engine              │ Gemini AI Service       │
│ (Bearer Auth Interceptor +     │ (STOMP.js / SockJS /          │ (Google Search          │
│ Token Refresh Queueing)        │  useAuctionSocket)            │ Grounding Integration)  │
└──────────────┬─────────────────┴──────────────┬────────────────┴────────────┬────────────┘
               │                                │                             │
               ▼                                ▼                             ▼
┌───────────────────────────┐    ┌───────────────────────────┐    ┌────────────────────────┐
│     REST API Backend      │    ┌   WebSocket Broker        │    │ Google Generative AI   │
│  (Spring Boot / Node.js)  │    │  (STOMP / SockJS Server)  │    │ (Gemini 2.0 Flash API) │
└───────────────────────────┘    └───────────────────────────┘    └────────────────────────┘
```

### 3.2 Key Dependencies & Technology Stack

| Category | Technology | Usage / Description |
| :--- | :--- | :--- |
| **Core Framework** | React 19 (`react`, `react-dom`) | Modern component-based UI framework |
| **Build Tooling** | Vite 7 (`vite`) | Ultra-fast HMR build environment |
| **Routing** | React Router v7 (`react-router-dom`) | Client-side routing, nested routes, navigation guards |
| **Styling & Design System** | Tailwind CSS 3, Mantine Core 8 | Utility-first styling & accessible component library |
| **Icons & Visuals** | Lucide React, Tabler Icons, Canvas-Confetti | Modern UI icons, victory animations |
| **Mapping & GIS** | Leaflet 1.9, React-Leaflet 5 | Interactive map rendering & plot overlay vector shapes |
| **AI Integration** | `@google/generative-ai` (Gemini 2.0 Flash) | Real-time valuation, search grounding, plot analysis, chatbot |
| **HTTP Client** | Axios 1.13 | HTTP client with automatic JWT token refresh queueing |
| **Real-time WebSockets**| `@stomp/stompjs`, `sockjs-client` | Real-time live auction bidding socket connections |
| **Data Visualization** | Recharts 3.9 | Interactive charts for pricing index, budget breakdowns |
| **Form Management** | Formik 2.4, Yup 1.7 | Multi-step form management and schema validation |

### 3.3 Folder Structure
```
FYP-26/
├── public/                     # Static assets, logos, and public files
├── src/
│   ├── Admin/                  # Admin Dashboard panel & management sub-views
│   │   └── AdminDashboard.jsx  # Main admin control panel
│   ├── User/                   # Regular user dashboard
│   │   └── UserDashboard.jsx   # User profile, saved listings, property manager
│   ├── Pages/                  # Route views and page layouts
│   │   ├── AIPrediction/       # AI Investor Radar, valuation cards, trend charts
│   │   ├── Auction/            # Auction listing, bidding room console
│   │   ├── Map/                # Leaflet GIS plot locator, plot details
│   │   ├── auth/               # Login and Signup pages
│   │   ├── AreaGuides.jsx      # Society and locality guides
│   │   ├── DeedVerification.jsx# Title deed submission & verification certificate
│   │   ├── HomePage.jsx        # Main landing page with Hero search console
│   │   ├── PricingPage.jsx     # Subscription plan pricing tier selector
│   │   ├── PropertyDetail.jsx  # Individual property page
│   │   ├── PropertyIndex.jsx   # Market price trends & historical index
│   │   ├── SearchResults.jsx   # Property search result page
│   │   └── Smartbuild.jsx      # Construction cost estimation entry page
│   ├── SmartBuild/             # SmartBuild estimator widgets & calculator results
│   ├── ExploreTools/           # Special tool pages and new project features
│   ├── PostProperty/           # Add property form wizard
│   ├── components/             # Reusable UI components
│   │   ├── Header/             # Global header & navigation bar
│   │   ├── Footer.jsx          # Global footer
│   │   ├── AuthRoute.jsx       # Route guard wrapper for authenticated/role routes
│   │   ├── AIPropertyAssessor.jsx # Property valuation card widget
│   │   └── subscription/       # Upgrade modal & AI chatbot floating widget
│   ├── context/                # React Context Providers
│   │   ├── AuthContext.jsx     # Authentication state, token parsing, login/logout
│   │   └── SubscriptionContext.jsx # User subscription tier state & modal controls
│   ├── services/               # External AI & Third-party services
│   │   └── geminiService.js    # Gemini 2.0 Flash integration + Search Grounding & fallbacks
│   ├── utils/                  # Helper utilities & API callers
│   │   ├── api.js              # Axios instance with request/response interceptors
│   │   ├── auth.js             # Token storage, JWT expiration checker, clearAuth
│   │   ├── useAuctionSocket.js # WebSocket hook for live auction bidding
│   │   ├── deedService.js      # Deed API handler
│   │   ├── adminService.js     # Admin API endpoints
│   │   └── propertyApi.js      # Property CRUD API handler
│   ├── App.jsx                 # Application root routes & global providers
│   ├── main.jsx                # React DOM entrypoint
│   └── index.css               # Global Tailwind CSS styles
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite configuration
└── tailwind.config.js          # Tailwind CSS theme configuration
```

### 3.4 Data Flow & Auth Security Architecture

#### 3.4.1 Centralized Auth Interceptor (`api.js`)
All HTTP requests pass through a custom Axios instance equipped with request and response interceptors:
- **Request Interceptor:** Reads `accessToken` from local storage and injects `Authorization: Bearer <token>` header into all outbound API requests.
- **Response Interceptor & Token Refresh Queue:**
  - Intercepts `401 Unauthorized` errors.
  - If a token refresh is already in progress, queuing promises in `failedQueue`.
  - Executes a single `/auth/refresh` request using the `refreshToken`.
  - Upon success, updates local tokens, updates authorization headers, and resolves all queued requests seamlessly without kicking the user out.
  - If refresh fails, triggers `clearAuth()` and redirects to `/login`.

```
Outbound Request ──> Attach Bearer Token ──> Backend Server
                                                    │
                                             401 Unauthorized?
                                                    │
                                      ┌─────────────┴─────────────┐
                                      ▼                           ▼
                             Refresh In Progress?           Trigger /auth/refresh
                             Queue Request in Promise       Save New Tokens
                                      │                     Retry Queued Requests
                                      └───────────────────────────┘
```

#### 3.4.2 Protected Routing Strategy (`AuthRoute.jsx`)
```jsx
<AuthRoute role="ADMIN">
  <AdminDashboard />
</AuthRoute>
```
- Checks `AuthContext` state for an active user.
- If unauthenticated -> Redirects to `/login`.
- If a specific `role` is required (e.g. `ADMIN` or `USER`) -> Verifies user role, redirecting unauthorized users back to their appropriate context.

---

## 4. Verification & Testing

The system architecture supports:
- **Offline / Standalone Fallbacks:** `geminiService.js` includes local Faisalabad valuation index fallback models ensuring complete functionality even when API quotas or internet connectivity are restricted.
- **WebSocket Reconnection:** `useAuctionSocket.js` maintains automatic socket heartbeat and reconnect handling.
- **Role Isolation:** Admins and regular users are strictly isolated via `DashboardRoute` and `AuthRoute` components.
