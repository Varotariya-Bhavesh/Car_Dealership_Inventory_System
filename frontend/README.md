# 🚘 AutoVault — Car Dealership Inventory System (Frontend)

AutoVault is a modern, fully responsive Single-Page Application (SPA) built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. It interfaces seamlessly with the Express + Supabase backend API to manage dealership vehicle inventory, customer purchases, role-based user authentication, and admin inventory operations.

---

## 🚀 Tech Stack

* **Framework:** React 18 + TypeScript (scaffolded with Vite)
* **Styling:** Tailwind CSS (with glassmorphism and custom dark mode aesthetic)
* **Routing:** React Router DOM (v6)
* **State Management:** React Context API (`AuthContext` & `ToastContext`)
* **API Integration:** Axios (with request/response interceptors for JWT bearer tokens)
* **Icons:** Lucide React

---

## ✨ Key Features

### 🔑 Authentication & Authorization
* **User Registration & Login:** Form validation (email format, 8-character minimum password rules) with real-time error messages.
* **JWT Persistence:** JWT tokens and user profiles are stored in `localStorage` for session persistence across page refreshes.
* **Role-Based Access Control:** Differentiates between `Staff` users and `Admin` users, conditionally rendering administrative controls.

### 🚗 Vehicle Catalog & Search/Filter
* **Responsive Card Grid:** Displays vehicle photo banner (if available), specs (Make, Model, Category, Price, and Stock Quantity).
* **Live Search & Filtering:** Filter by Make, Model, Category dropdown, and Price Range (Min/Max price limits).
* **Stock Badges:** Clear visual badges for *In Stock*, *Low Stock (≤ 3)*, and *Out of Stock*.

### 🛒 One-Click Vehicle Purchase
* **Purchase Trigger:** Sends `POST /api/vehicles/:id/purchase` to decrement stock quantity by 1.
* **Strict Stock Check:** The **Purchase** button is automatically **disabled** when `quantity === 0` to prevent over-purchasing.

### 🛡️ Admin Management Dashboard
Visible **ONLY** to logged-in users with the `Admin` role:
* **Add Vehicle Modal:** Create new vehicle catalog records with optional photo file upload (`POST /api/vehicles` via `FormData`).
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
│   │   ├── AddVehicleModal.tsx   # Admin Add Vehicle Modal (with photo picker & preview)
│   │   ├── DeleteVehicleModal.tsx# Admin Delete Vehicle Modal
│   │   ├── EditVehicleModal.tsx  # Admin Edit Vehicle Modal (with photo upload/replace)
│   │   ├── Navbar.tsx            # Header with user profile & mobile menu
│   │   ├── ProtectedRoute.tsx    # Protected route guard component
│   │   ├── RestockVehicleModal.tsx# Admin Restock Vehicle Modal
│   │   ├── Toast.tsx             # Action feedback toast alert
│   │   ├── VehicleCard.tsx       # Grid card with image banner & disabled purchase check
│   │   └── VehicleFilters.tsx    # Search and specs filter bar
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth state, login/register & JWT persistence
│   │   └── ToastContext.tsx      # Global notification context
│   ├── pages/
│   │   ├── Dashboard.tsx         # Main vehicle catalog view
│   │   ├── Login.tsx             # Sign in page
│   │   └── Register.tsx          # Account creation page
│   ├── services/
│   │   └── vehicleService.ts     # Vehicle API endpoints service (supports FormData uploads)
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces for Auth & Vehicles
│   ├── App.tsx                   # Main Router & Provider setup
│   ├── main.tsx                  # React DOM root entry
│   └── index.css                 # Tailwind CSS directives
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
| `/api/vehicles/:id/purchase` | `POST` | Staff / Admin | Purchase vehicle (decrements quantity) |
| `/api/vehicles` | `POST` | Admin Only | Add new vehicle record (supports `multipart/form-data` image upload) |
| `/api/vehicles/:id` | `PUT` | Admin Only | Update vehicle details (supports `multipart/form-data` image upload) |
| `/api/vehicles/:id/restock` | `POST` | Admin Only | Add stock quantity |
| `/api/vehicles/:id` | `DELETE` | Admin Only | Delete vehicle from inventory |
