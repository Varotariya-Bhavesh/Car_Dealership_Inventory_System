# 🚘 AutoVault — Car Dealership Inventory System (Frontend)

AutoVault is a modern, fully responsive Single-Page Application (SPA) built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Canvas Confetti**. It interfaces seamlessly with the Express + Supabase backend API to manage dealership vehicle inventory, customer purchases, role-based user authentication, and admin inventory operations.

---

## 🚀 Tech Stack

* **Framework:** React 18 + TypeScript (scaffolded with Vite)
* **Styling:** Tailwind CSS (Luxury automotive dark aesthetic `#080d1a`, glassmorphism panels, glow inputs, gradient typography)
* **Animations & FX:** `framer-motion` (backdrop blur fade-in & scale-up modal transitions), `canvas-confetti` (purchase celebration confetti burst)
* **Routing:** React Router DOM (v6)
* **State Management:** React Context API (`AuthContext` & `ToastContext`)
* **API Integration:** Axios (with request/response interceptors for JWT bearer tokens)
* **Icons:** Lucide React

---

## ✨ Key Features

### 🔑 Split-Screen Auth & Role Scoping
* **Luxury Sign In & Registration Pages:** Split-screen showcase layout displaying AutoVault feature highlights alongside floating 3D-styled glass cards with animated glowing focus rings (`focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.5)]`).
* **JWT Persistence:** JWT tokens and user profiles are stored in `localStorage` for session persistence across page refreshes.
* **Role-Based Access Control:** Displays a polished user profile badge with dynamic glowing `ADMIN` pill tag (`shadow-lg shadow-amber-500/20`) or `STAFF` badge, conditionally enabling administrative controls.

### 📊 Interactive Executive Metrics Bar & Stock Inspection
* **4 Executive Summary Cards:**
  1. **Total Fleet Vehicles:** Sum of available inventory units and distinct model count.
  2. **Total Fleet Valuation ($):** Gross showroom capital value.
  3. **Low Stock Alerts (≤ 3):** Clickable with hover scaling and glow indicator (`hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]`).
  4. **Out of Stock:** Clickable with hover scaling and glow indicator (`hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]`).
* **Interactive Inspection Modal (`StockDetailsModal.tsx`):** Clicking on *Low Stock Alerts* or *Out of Stock* opens a glassmorphic modal listing affected vehicles with direct Admin "Restock" CTA buttons and "Filter Catalog Below" navigation.

### 🚗 Vehicle Catalog & Search/Filter
* **Responsive Showroom Grid:** Displays vehicle photo banner with smooth hover zoom (`group-hover:scale-110`), specs (Make, Model, Category, Price, and Stock Quantity), neon stock badges, and Admin hover quick action overlay menu.
* **Live Search & Specs Filter:** Filter by Make, Model, Category dropdown, and Price Range (Min/Max price limits). Includes active filter tag pills with quick "Clear All" functionality.

### 🛒 One-Click Vehicle Purchase & Celebration
* **Purchase Trigger:** Sends `POST /api/vehicles/:id/purchase` to decrement stock quantity by 1.
* **Celebratory Confetti:** Triggers a `canvas-confetti` particle burst upon successful purchase!
* **Strict Stock Check:** The **Purchase** button is automatically **disabled** when `quantity === 0` to prevent over-purchasing.

### 🛡️ Admin Management Dashboard & Dropzones
Visible **ONLY** to logged-in users with the `Admin` role:
* **Add Vehicle Modal:** Framer Motion scale-up transition with interactive drag-and-drop photo file upload dropzone and live preview thumbnail (`POST /api/vehicles` via `FormData`).
* **Edit Vehicle Modal:** Update existing vehicle parameters and upload/replace vehicle photo (`PUT /api/vehicles/:id` via `FormData`).
* **Delete Vehicle Modal:** Permanent vehicle removal with safety confirmation dialog (`DELETE /api/vehicles/:id`).
* **Restock Vehicle Modal:** Adjust inventory stock levels (`POST /api/vehicles/:id/restock`).

### 🔔 Global Toast Notifications & Feedback
* Toast notifications for actions (login/register success, vehicle purchases, restock operations, error alerts).
* Animated skeleton loaders and button spinners (`Loader2`).

---

## 🛠️ Project Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the `frontend` root directory:
```bash
cp .env.example .env
```
Ensure `VITE_API_BASE_URL` points to your active backend:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Install Dependencies
```bash
cd frontend
npm install
```

### 4. Start Development Server
```bash
npm run dev
```
The application will launch on **http://localhost:3001/** with an active proxy rule routing `/api` requests to backend port `3000`.

### 5. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 📁 Directory Structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.ts              # Configured Axios client & JWT interceptors
│   ├── components/
│   │   ├── AddVehicleModal.tsx   # Admin Add Vehicle Modal (Framer Motion + photo picker & preview)
│   │   ├── DashboardStats.tsx    # Interactive executive summary cards (Low/Out of Stock click handlers)
│   │   ├── DeleteVehicleModal.tsx# Admin Delete Vehicle Modal with scale transition
│   │   ├── EditVehicleModal.tsx  # Admin Edit Vehicle Modal (Framer Motion + photo upload/replace)
│   │   ├── Navbar.tsx            # Glassmorphic header with user profile & Admin badge
│   │   ├── ProtectedRoute.tsx    # Protected route guard component
│   │   ├── RestockVehicleModal.tsx# Admin Restock Vehicle Modal
│   │   ├── StockDetailsModal.tsx # Interactive low stock / out of stock inspection modal
│   │   ├── Toast.tsx             # Action feedback toast alert
│   │   ├── VehicleCard.tsx       # Grid card with image zoom & purchase confetti burst
│   │   └── VehicleFilters.tsx    # Search and specs filter bar with active tag pills
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth state, login/register & JWT persistence
│   │   └── ToastContext.tsx      # Global notification context
│   ├── pages/
│   │   ├── Dashboard.tsx         # Main vehicle catalog & executive metrics view
│   │   ├── Login.tsx             # Split-screen luxury sign in page
│   │   └── Register.tsx          # Split-screen luxury account creation page
│   ├── services/
│   │   └── vehicleService.ts     # Vehicle API endpoints service (supports FormData uploads)
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces for Auth & Vehicles
│   ├── App.tsx                   # Main Router, Providers & ambient glowing background setup
│   ├── main.tsx                  # React DOM root entry
│   └── index.css                 # Tailwind CSS directives & luxury dark design tokens
├── .env                          # Local environment variables (git-ignored)
├── .env.example                  # Template environment variables for setup
├── .gitignore                    # Git ignore rules configuration
├── apidocs.md                    # Backend API specification documentation
├── index.html                    # HTML entry template
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite config & dev server proxy
```

---

## 🔗 Backend API Integration Matrix

| Endpoint | Method | Role Scoping | Action |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new user account |
| `/api/auth/login` | `POST` | Public | Authenticate user & obtain JWT |
| `/api/vehicles` | `GET` | Staff / Admin | Fetch all inventory vehicles |
| `/api/vehicles/search` | `GET` | Staff / Admin | Search/filter vehicle catalog |
| `/api/vehicles/:id/purchase` | `POST` | Staff / Admin | Purchase vehicle (decrements quantity & triggers confetti) |
| `/api/vehicles` | `POST` | Admin Only | Add new vehicle record (supports `multipart/form-data` image upload) |
| `/api/vehicles/:id` | `PUT` | Admin Only | Update vehicle details (supports `multipart/form-data` image upload) |
| `/api/vehicles/:id/restock` | `POST` | Admin Only | Add stock quantity |
| `/api/vehicles/:id` | `DELETE` | Admin Only | Delete vehicle from inventory |
