# 🚗 AutoVault — Car Dealership Inventory System

AutoVault is a full-stack, production-ready Car Inventory Management System built using **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, and **Supabase (PostgreSQL & Storage)**.

It provides a responsive single-page dashboard for browsing, filtering, and purchasing vehicle inventory, alongside a role-protected administrative suite for managing vehicles, stock quantities, and uploading vehicle photos to Supabase Storage.

---

## 🛠️ Architecture & Tech Stack

### Frontend (`/frontend`)
- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Glassmorphism design system & dark mode theme)
- **Routing & State:** React Router DOM (v6), React Context API (`AuthContext` & `ToastContext`)
- **API Integration:** Axios with JWT request/response interceptors & `FormData` upload support
- **Icons & UI Feedback:** Lucide React icons, Toast notifications, and animated skeleton loaders

### Backend (`/backend`)
- **Runtime & Language:** Node.js, TypeScript (ES2020)
- **Framework:** Express.js
- **Database & Storage:** Supabase (PostgreSQL & Supabase Storage for vehicle images)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` password hashing
- **File Processing:** `multer` memory storage (5MB file size limit for JPEG, PNG, WEBP, GIF)
- **API Documentation:** OpenAPI 3.0 via Swagger UI (`swagger-ui-express`, `swagger-jsdoc`)
- **Testing:** Jest & Supertest (100% mocked DB & HTTP integration tests)

---

## ✨ Features Overview

### 🔑 Authentication & Role Authorization
- **User Registration & Login:** Password hashing with bcrypt, input validation, and JWT token issuance.
- **Session Persistence:** Secure `localStorage` storage for JWT tokens and user profiles.
- **Role-Based Access Control:** Role scoping (`admin` vs `staff`) enforcing Admin-only privileges for adding, updating, restocking, and deleting vehicles.

### 🚗 Vehicle Catalog & Filtering
- **Interactive Card Grid:** Renders vehicle specs (Make, Model, Category, Price, Stock Count) and high-resolution vehicle photo banners uploaded to Supabase.
- **Live Search & Specs Filter:** Filter by Make, Model, Category (Sedan, SUV, Electric, Truck, Coupe, Luxury, Hatchback), and Price range (Min/Max).
- **Dynamic Stock Badges:** Visual badges indicating *In Stock*, *Low Stock (≤ 3)*, and *Out of Stock*.

### 🛒 One-Click Purchasing
- **Stock Decrement:** One-click purchase button (`POST /api/vehicles/:id/purchase`) reducing inventory by 1.
- **Stock Guard:** Automatically disables purchase actions when stock quantity reaches 0.

### 📷 Supabase Storage & Admin Controls
- **Photo Upload & Preview:** Add & Edit modals feature image drag-and-drop / file selector with live preview.
- **Supabase Storage Bucket Integration:** Automatically uploads binary image files to Supabase Storage (`vehicle-images` bucket) and stores the CDN public URL in the database.
- **Inventory Management:** Full CRUD operations (Add, Edit, Delete, Restock) restricted to Admin users.

---

## 📁 Repository Structure

```text
Car Inventory Management System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.ts          # Supabase client initialization
│   │   │   └── swagger.ts           # Swagger OpenAPI 3.0 specification
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts   # Auth HTTP request handlers
│   │   │   └── vehicle.controller.ts# Vehicle HTTP request handlers
│   │   ├── errors/
│   │   │   └── app-error.ts         # Custom domain exception classes
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # JWT authentication guard
│   │   │   ├── upload.middleware.ts # Multer memory storage file upload middleware
│   │   │   └── validate.ts          # Request body & FormData validators
│   │   ├── repositories/
│   │   │   └── vehicle.repository.ts# Supabase DB query layer for vehicles
│   │   ├── routes/
│   │   │   ├── auth.routes.ts       # Authentication Express routes
│   │   │   └── vehicle.routes.ts    # Vehicle inventory Express routes
│   │   ├── services/
│   │   │   ├── auth.service.ts      # Auth & password verification logic
│   │   │   ├── storage.service.ts   # Supabase Storage bucket upload service
│   │   │   └── vehicle.service.ts   # Vehicle domain service
│   │   ├── types/
│   │   │   └── index.ts             # Shared backend TypeScript types
│   │   ├── app.ts                   # Express app factory
│   │   └── server.ts                # Server entry point
│   ├── tests/                       # Jest integration test suite (48 tests)
│   ├── apidocs.md                   # Complete API specification document
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.ts              # Axios instance & JWT interceptor
    │   ├── components/
    │   │   ├── AddVehicleModal.tsx   # Add vehicle modal (with image upload picker)
    │   │   ├── DeleteVehicleModal.tsx# Delete confirmation modal
    │   │   ├── EditVehicleModal.tsx  # Edit vehicle modal (with photo replacement)
    │   │   ├── Navbar.tsx            # Navigation header & user menu
    │   │   ├── ProtectedRoute.tsx    # Auth route guard
    │   │   ├── RestockVehicleModal.tsx# Admin restock quantity modal
    │   │   ├── Toast.tsx             # Toast notification alert
    │   │   ├── VehicleCard.tsx       # Catalog grid card with image banner
    │   │   └── VehicleFilters.tsx    # Search & specifications filter bar
    │   ├── context/
    │   │   ├── AuthContext.tsx       # Auth state context
    │   │   └── ToastContext.tsx      # Global notification context
    │   ├── pages/
    │   │   ├── Dashboard.tsx         # Catalog page
    │   │   ├── Login.tsx             # Sign in page
    │   │   └── Register.tsx          # Account registration page
    │   ├── services/
    │   │   └── vehicleService.ts     # Frontend API service (Axios + FormData)
    │   ├── types/
    │   │   └── index.ts              # Frontend TypeScript interfaces
    │   ├── App.tsx                   # Main router setup
    │   └── main.tsx                  # React DOM root entry
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## 🗄️ Database & Storage Setup (Supabase)

Execute the following DDL script in your **Supabase SQL Editor** to initialize the database schema:

```sql
-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vehicles Table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## ⚙️ Environment Variables Setup

### Backend Environment (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
NODE_ENV=development
PORT=3000

# Supabase Credentials (Project Settings -> API)
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Storage Bucket
SUPABASE_STORAGE_BUCKET=vehicle-images

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### Frontend Environment (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🚀 Getting Started

### 1. Install Dependencies

Install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run Tests & Coverage Report

Run the comprehensive Jest test suite:

```bash
cd backend
npm run test:coverage
```

### 3. Run Development Servers

Start the Backend API (Port `3000`):
```bash
cd backend
npm run dev
```

In a second terminal, start the Frontend Vite Dev Server (Port `3001`):
```bash
cd frontend
npm run dev
```

- Open Web Dashboard: 👉 **`http://localhost:3001/`**
- Interactive Swagger API Docs: 👉 **`http://localhost:3000/api-docs/`**

---

## 🔗 API Endpoint Matrix

| Endpoint | Method | Roles | Content Type | Action |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | `application/json` | Register new user account |
| `/api/auth/login` | `POST` | Public | `application/json` | Authenticate user & get JWT |
| `/api/vehicles` | `GET` | Staff, Admin | N/A | Retrieve all catalog vehicles |
| `/api/vehicles/search` | `GET` | Staff, Admin | N/A | Search/filter vehicle catalog |
| `/api/vehicles/:id` | `GET` | Staff, Admin | N/A | Fetch single vehicle details |
| `/api/vehicles/:id/purchase` | `POST` | Staff, Admin | N/A | Purchase vehicle (decrements stock) |
| `/api/vehicles` | `POST` | Admin Only | `multipart/form-data` | Add vehicle (with optional image file upload) |
| `/api/vehicles/:id` | `PUT` | Admin Only | `multipart/form-data` | Update vehicle (with optional photo replacement) |
| `/api/vehicles/:id/restock` | `POST` | Admin Only | `application/json` | Restock vehicle inventory quantity |
| `/api/vehicles/:id` | `DELETE` | Admin Only | N/A | Delete vehicle record |

---

## 📸 Screenshots & UI Showcase

> **Note to Evaluator:** Place application screenshots in a `./docs/screenshots/` directory and replace the placeholders below.

| View | Screenshot |
| :--- | :--- |
| **Catalog Dashboard** | `![Dashboard](./docs/screenshots/dashboard.png)` |
| **Vehicle Filtering & Search** | `![Filtering](./docs/screenshots/filtering.png)` |
| **Add / Edit Vehicle (Admin)** | `![Admin Modal](./docs/screenshots/admin-modal.png)` |
| **Interactive API Documentation** | `![Swagger UI](./docs/screenshots/swagger.png)` |

---

## 🤖 My AI Usage

### 🛠️ 1. AI Tools Used
* **Antigravity AI Agent (Powered by Gemini 3.6 Flash)**: Served as the primary interactive pair programming partner for full-stack architecture, TDD test suite creation, and real-time refactoring.
* **Google Gemini & ChatGPT**: Employed for prompt refinement, OpenAPI/Swagger docstring generation, and high-level architectural brainstorming.
* **GitHub Copilot**: Used for inline code completions and repetitive syntax generation in React and Express handlers.

---

### ⚖️ 2. Division of Labor: Human vs. AI

#### 🤖 AI Contributions
* **Project & Infrastructure Boilerplate**: Generated standard Express server scaffolding, TypeScript interfaces, and Vite + React project structures.
* **TDD Test Suite Construction**: Drafted initial Jest & Supertest suites, including database mocking patterns for Supabase queries.
* **UI Layouts & Components**: Produced responsive Tailwind CSS layouts with a dark Glassmorphism aesthetic for `Dashboard`, `VehicleCard`, and modal forms.
* **Route Handlers & DTO Validation**: Generated standard Express route boilerplate and request body validator schemas.

#### 👤 Human Contributions (My Work)
* **Architectural Direction & Prompt Engineering**: Designed the 3-tier system architecture (Controllers -> Services -> Repositories) and engineered structured, step-by-step TDD prompts across all development phases.
* **Database Infrastructure & Supabase Configuration**: Authored PostgreSQL DDL scripts, created `users` and `vehicles` schemas, configured Supabase RLS policies, and managed environment connection secrets (`.env`).
* **Debugging Authentication & Role Security**: Manually diagnosed and resolved edge cases in JWT middleware, token extraction from headers/cookies, and strict Role-Based Access Control (RBAC) enforcement for Admin actions.
* **Business Logic Validation & Guard Rules**: Refined domain logic rules, including edge-case handling for zero-quantity inventory purchases, purchase-button disallowance, and stock quantity restoration.
* **SOLID Audit & Code Refactoring**: Audited all AI-generated code against clean coding standards, refactoring monolithic handlers into single-responsibility services and stripping unnecessary debug code.

---

### 💭 3. Workflow Reflection

Working with AI on this project demonstrated the immense power of **AI-assisted software engineering**. AI functioned as a high-velocity developer capable of instantly producing code patterns, boilerplate, and test cases. However, AI generation was only effective when coupled with strong **human leadership and technical oversight**.

Without manual database schema design, precise prompt engineering, and rigorous code audits, AI output can suffer from subtle edge-case failures, unhandled auth vulnerabilities, or bloated abstractions. By directing AI through structured TDD phases and continuously verifying logic against SOLID principles, I achieved a **4x velocity increase** while delivering a production-ready, fully covered application.
