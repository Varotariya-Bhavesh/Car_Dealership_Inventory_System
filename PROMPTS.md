# 📜 PROMPTS.md — AI Co-creation & Prompt Log

This document records the prompts, technical specifications, and AI interaction history used to build the **AutoVault Car Dealership Inventory System**.

---

## 🏗️ Phase 1: Architecture, Database & Backend Setup

### Prompt 1.1: System Architecture & Database Schema
> **User Prompt:**  
> "Design a full-stack Car Dealership Inventory System using Node.js, Express, TypeScript, and Supabase (PostgreSQL). Define the DDL schema for `users` and `vehicles` tables, including foreign keys, image URLs, and constraints."
> 
> **AI Outcome:**  
> Created modular backend structure (`/src/config`, `/src/controllers`, `/src/services`, `/src/repositories`, `/src/middleware`, `/src/routes`) and generated Supabase PostgreSQL schema with role constraints (`admin` vs `staff`).

---

## 🔑 Phase 2: Authentication & Role-Based Authorization

### Prompt 2.1: JWT Authentication & Password Hashing
> **User Prompt:**  
> "Implement registration and login services in TypeScript using `bcryptjs` and `jsonwebtoken`. Provide Express middleware to verify JWT tokens and restrict admin-only endpoints."
> 
> **AI Outcome:**  
> Implemented `AuthService`, `auth.middleware.ts` (`authenticateJWT`, `requireRole`), and input validation middleware to secure admin routes (`POST /vehicles`, `PUT /vehicles/:id`, `DELETE /vehicles/:id`, `POST /vehicles/:id/restock`).

---

## 🚗 Phase 3: Vehicle Inventory CRUD & Supabase Photo Upload

### Prompt 3.1: Inventory CRUD & Supabase Storage Integration
> **User Prompt:**  
> "Create a vehicle service and repository supporting search, filtering by make/model/category/price, purchase (stock decrement), and image uploads using Multer memory storage and Supabase Storage bucket (`vehicle-images`)."
> 
> **AI Outcome:**  
> Developed `VehicleRepository`, `VehicleService`, `StorageService`, and `upload.middleware.ts`. Enabled multipart form data parsing with 5MB file validation.

---

## 🎨 Phase 4: Frontend Development (React + Tailwind CSS)

### Prompt 4.1: Modern Glassmorphism Dashboard & Modals
> **User Prompt:**  
> "Build a responsive React 18 + Vite frontend with Tailwind CSS featuring a sleek dark Glassmorphism theme. Create a vehicle catalog grid, filtering controls, one-click purchase button, and admin modals (Add, Edit, Restock, Delete) with photo upload previews."
> 
> **AI Outcome:**  
> Built `Dashboard`, `VehicleCard`, `VehicleFilters`, `AddVehicleModal`, `EditVehicleModal`, `RestockVehicleModal`, and Axios interceptors in `AuthContext` for JWT authorization.

---

## 🧪 Phase 5: Testing Suite (Jest + Supertest)

### Prompt 5.1: 100% Mocked Integration Tests
> **User Prompt:**  
> "Write Jest and Supertest integration tests for all auth routes, vehicle endpoints, and OpenAPI Swagger documentation without connecting to a live database."
> 
> **AI Outcome:**  
> Delivered 3 test suites (`auth.test.ts`, `vehicle.test.ts`, `swagger.test.ts`) containing 48 passing tests with statement coverage over 78%.

---

## 🧹 Phase 6: Code Quality Audit & Test Reports

### Prompt 6.1: Final Refactoring & Report Generation
> **User Prompt:**  
> "Perform a final code review for SOLID principles, remove lingering debug statements, generate a test coverage report (`TEST_REPORT.md`), and draft a production README.md."
> 
> **AI Outcome:**  
> Cleaned up test logs, generated `TEST_REPORT.md`, updated `README.md` with complete API matrix & AI usage reflection, and authored `PROMPTS.md`.
