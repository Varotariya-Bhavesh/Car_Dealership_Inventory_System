# 🧪 Car Dealership Inventory System - Test Suite Report

**Executed At:** `2026-07-22`  
**Test Framework:** Jest + Supertest  
**Environment:** `NODE_ENV=test`

---

## 📊 Summary Results

| Metric | Result |
| :--- | :--- |
| **Test Suites** | **3 Passed**, 3 Total (`auth.test.ts`, `vehicle.test.ts`, `swagger.test.ts`) |
| **Total Tests** | **48 Passed**, 48 Total (100% Pass Rate) |
| **Statement Coverage** | **78.24%** |
| **Branch Coverage** | **63.60%** |
| **Function Coverage** | **85.41%** |
| **Line Coverage** | **78.41%** |

---

## 📋 Detailed Coverage Breakdown by Module

```text
------------------------|---------|----------|---------|---------|---------------------------------------------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                       
------------------------|---------|----------|---------|---------|---------------------------------------------------------
All files               |   78.24 |     63.6 |   85.41 |   78.41 |                                                         
 src                    |    92.3 |      100 |      75 |    92.3 |                                                         
  app.ts                |    92.3 |      100 |      75 |    92.3 | 47-48                                                   
 src/config             |    90.9 |       75 |     100 |    90.9 |                                                         
  supabase.ts           |    87.5 |       75 |     100 |    87.5 | 10                                                      
  swagger.ts            |     100 |      100 |     100 |     100 |                                                         
 src/controllers        |   66.08 |     18.6 |     100 |   62.85 |                                                         
  auth.controller.ts    |      75 |       25 |     100 |   72.72 | 24-26,49-51                                             
  vehicle.controller.ts |   63.73 |    17.14 |     100 |   60.24 | 20-26,41-47,62-68,87-89,111-113,132-134,156-158,181-183 
 src/errors             |   84.61 |        0 |      60 |   84.61 |                                                         
  app-error.ts          |   84.61 |        0 |      60 |   84.61 | 14,26                                                   
 src/middleware         |   90.35 |    83.16 |    87.5 |   89.71 |                                                         
  auth.middleware.ts    |   91.66 |       80 |     100 |    90.9 | 49-50                                                   
  upload.middleware.ts  |   66.66 |        0 |       0 |   66.66 | 12-15                                                   
  validate.ts           |   92.59 |    85.39 |     100 |    92.1 | 154-160                                                 
 src/repositories       |    71.6 |     66.3 |     100 |      76 |                                                         
  vehicle.repository.ts |    71.6 |     66.3 |     100 |      76 | 18,29-41,45,51,83,100,124,154-167,177,212               
 src/routes             |     100 |      100 |     100 |     100 |                                                         
  auth.routes.ts        |     100 |      100 |     100 |     100 |                                                         
  vehicle.routes.ts     |     100 |      100 |     100 |     100 |                                                         
 src/services           |   72.91 |       62 |   78.57 |   73.68 |                                                         
  auth.service.ts       |   96.96 |    72.22 |     100 |   96.96 | 51                                                      
  storage.service.ts    |   17.39 |    16.66 |       0 |   18.18 | 11-51                                                   
  vehicle.service.ts    |      85 |       80 |     100 |      85 | 15-16,55-56,88,103                                      
------------------------|---------|----------|---------|---------|---------------------------------------------------------
```

---

## 🧪 Test Suite Details

### 1. Authentication Suite (`auth.test.ts`)
* Register User (Happy Path & Validation Errors - email format, password length, existing email)
* Login User (Valid Credentials, Non-existent User, Invalid Password)
* JWT Middleware Validation (Missing Token, Invalid Token, Admin Route Authorization)

### 2. Vehicle Inventory Suite (`vehicle.test.ts`)
* Add Vehicle (Admin Authorization, Input Validation, Image Upload handling)
* List Vehicles (Pagination, Filtering by make/model/year/price, Sorting)
* Search Vehicles (Full-text query handling)
* Update & Delete Vehicle (Role Enforcement - Admin only, NotFound handling)
* Purchase & Restock Operations (Stock decrement/increment logic, zero stock edge cases)

### 3. API Documentation Suite (`swagger.test.ts`)
* OpenAPI UI Endpoint Availability (`GET /api-docs`)
* OpenAPI JSON Specification Integrity (`GET /api-docs/swagger.json`)
