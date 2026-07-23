# 🚗 Car Inventory Management System — Backend API

A robust, production-ready RESTful backend API built using **Node.js**, **TypeScript**, **Express**, **Supabase (PostgreSQL)**, and **JWT Authentication**, adhering strictly to **Test-Driven Development (TDD)** and **SOLID design principles**.

---

## 🛠️ Tech Stack

- **Runtime & Language:** Node.js, TypeScript (ES2020)
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL via `@supabase/supabase-js`)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs` for password hashing
- **Testing:** Jest, Supertest (100% mocked DB & HTTP integration tests)
- **API Documentation:** Swagger UI (`swagger-ui-express`, `swagger-jsdoc`)

---

## ✨ Features

- **User Authentication:**
  - `POST /api/auth/register` — Validates payload, checks email uniqueness, hashes passwords with bcrypt, inserts user record into Supabase, and returns a clean public user profile (never exposing `password_hash`).
  - `POST /api/auth/login` — Authenticates credentials, generates a signed JWT token containing `userId`, `email`, and `role`, and protects against user-enumeration attacks by returning uniform error messages.
- **Core Vehicle Inventory Operations (JWT Protected):**
  - `POST /api/vehicles` — Adds a new vehicle to inventory after validating required fields (`make`, `model`, `category`, `price`, `quantity`). Supports uploading vehicle image files (`multipart/form-data`) to Supabase Storage.
  - `GET /api/vehicles` — Retrieves all available vehicles sorted by newest creation date.
  - `GET /api/vehicles/search` — Dynamically searches & filters vehicles by `make`, `model`, `category`, or price range (`minPrice`, `maxPrice`).
  - `GET /api/vehicles/:id` — Retrieves detailed information for a single vehicle by ID.
  - `PUT /api/vehicles/:id` — Updates vehicle details (`make`, `model`, `category`, `price`, `quantity`, `image`) with non-negative validation and optional photo replacement.
  - `DELETE /api/vehicles/:id` — **(Admin Only)** Permanently deletes a vehicle from inventory.
  - `POST /api/vehicles/:id/purchase` — Decrements stock quantity by 1 upon customer purchase (returns `400 Bad Request` if out of stock).
  - `POST /api/vehicles/:id/restock` — **(Admin Only)** Restocks inventory by incrementing vehicle quantity by a positive amount.

- **Supabase Storage Integration:** Automatic image file parsing with `multer` memory storage (5MB max size; JPEG, PNG, WEBP, GIF formats) and seamless CDN public URL generation.
- **Interactive Documentation:** Live Swagger UI available at `/api-docs/` and raw OpenAPI JSON spec at `/api-docs.json`.
- **Domain Layering & Clean Architecture:** Controller -> Service -> Database abstraction with strict TypeScript interfaces and custom domain exception hierarchy.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── supabase.ts          # Supabase Service-Role client initialization
│   │   └── swagger.ts           # Swagger OpenAPI 3.0 configuration
│   ├── controllers/
│   │   ├── auth.controller.ts   # Authentication HTTP request handlers
│   │   └── vehicle.controller.ts# Vehicle inventory HTTP request handlers
│   ├── errors/
│   │   └── app-error.ts         # Custom domain exception classes
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT authentication verification guard
│   │   ├── upload.middleware.ts # Multer memory storage file upload middleware
│   │   └── validate.ts          # Request payload validation guards
│   ├── repositories/
│   │   └── vehicle.repository.ts# Supabase database abstraction layer for vehicles
│   ├── routes/
│   │   ├── auth.routes.ts       # Express auth routes annotated with @openapi
│   │   └── vehicle.routes.ts    # Express vehicle routes annotated with @openapi
│   ├── services/
│   │   ├── auth.service.ts      # Authentication & user business logic
│   │   ├── storage.service.ts   # Supabase Storage bucket upload service
│   │   └── vehicle.service.ts   # Vehicle inventory business logic
│   ├── types/
│   │   └── index.ts             # Shared TypeScript interfaces & types
│   ├── app.ts                   # Express Application factory (testable without port binding)
│   └── server.ts                # Entry point starting HTTP server
├── tests/
│   ├── auth.test.ts             # TDD unit/integration tests for Auth endpoints
│   ├── vehicle.test.ts          # TDD unit/integration tests for Vehicle endpoints
│   └── swagger.test.ts          # Tests verifying Swagger UI endpoints
├── .env.example                 # Environment variables template
├── jest.config.js               # Jest & ts-jest configuration
├── tsconfig.json                # TypeScript configuration (strict mode)
└── package.json
```

---

## 🗄️ Database Setup (Supabase)

To initialize the database table in your Supabase project, execute the following SQL statement in the **Supabase SQL Editor**:

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

-- 3. Migration SQL (Run if your vehicles table already exists)
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS image_url TEXT;
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the `backend/` root folder (copy from `.env.example`):

```bash
cp .env.example .env
```

Configure your environment variables inside `.env`:

```env
NODE_ENV=development
PORT=3000

# Supabase Credentials (Project Settings -> API)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

> ⚠️ **Important:** Ensure `SUPABASE_SERVICE_ROLE_KEY` is kept secret and never committed to version control.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The server will start at: `http://localhost:3000`

### 3. Interactive API Documentation (Swagger)
Open your browser and visit:
👉 **`http://localhost:3000/api-docs/`**

To retrieve the raw OpenAPI 3.0 JSON specification:
👉 **`http://localhost:3000/api-docs.json`**

---

## 🧪 Running Tests (TDD)

The test suite runs using Jest & Supertest without modifying your live database (Supabase is fully mocked for fast, isolated test execution).

All **48 integration & unit tests** across 3 test suites pass cleanly:
- `tests/auth.test.ts` (User Registration, Login, Token generation, Error handling)
- `tests/vehicle.test.ts` (Full CRUD operations, Filtering, Purchase, Restock, Role Authorization)
- `tests/swagger.test.ts` (Swagger UI HTML & OpenAPI JSON specs)

```bash
# Run all test suites
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

---

## 📦 Production Build

```bash
# Compile TypeScript to dist/
npm run build

# Start production server
npm start
```
