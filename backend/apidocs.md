# 📘 Car Inventory Management System — API Documentation

This document contains the complete specification of all RESTful API endpoints for the **Car Inventory Management System API**, including input parameters, token requirement breakdown, success response examples, and error response examples.

---

## 🔑 Authentication & Token Requirements Summary

Authentication uses **JSON Web Tokens (JWT)**. 

To access protected endpoints, include the token in the `Authorization` header of your HTTP request:
```http
Authorization: Bearer <your_jwt_token>
```

### Quick Reference Matrix

| Endpoint | Method | Token Required? | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/health` | `GET` | ❌ **No** (Public) | Anyone | Service health check |
| `/api-docs` | `GET` | ❌ **No** (Public) | Anyone | Interactive Swagger UI |
| `/api-docs.json` | `GET` | ❌ **No** (Public) | Anyone | Raw OpenAPI 3.0 JSON spec |
| `/api/auth/register` | `POST` | ❌ **No** (Public) | Anyone | Register a new user (`staff` role by default) |
| `/api/auth/login` | `POST` | ❌ **No** (Public) | Anyone | Authenticate credentials & return JWT token |
| `/api/vehicles` | `GET` | ✅ **Yes** | `staff`, `admin` | Retrieve all available vehicles |
| `/api/vehicles/search` | `GET` | ✅ **Yes** | `staff`, `admin` | Search & filter vehicles by query parameters |
| `/api/vehicles/:id` | `GET` | ✅ **Yes** | `staff`, `admin` | Retrieve vehicle details by ID |
| `/api/vehicles` | `POST` | ✅ **Yes** | `staff`, `admin` | Add a new vehicle to inventory |
| `/api/vehicles/:id` | `PUT` | ✅ **Yes** | `staff`, `admin` | Update vehicle details |
| `/api/vehicles/:id/purchase` | `POST` | ✅ **Yes** | `staff`, `admin` | Purchase vehicle (decrements stock by 1) |
| `/api/vehicles/:id/restock` | `POST` | ✅ **Yes** | 🔒 `admin` only | Restock vehicle stock quantity |
| `/api/vehicles/:id` | `DELETE` | ✅ **Yes** | 🔒 `admin` only | Delete a vehicle from inventory |

---

## 1. System & Utility Endpoints

### 1.1 Health Check
Check backend API health status.

- **Method:** `GET`
- **Path:** `/health`
- **Token Required:** ❌ **No** (Public)

#### Output Example (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2026-07-22T10:48:59.000Z"
}
```

---

### 1.2 Interactive OpenAPI Documentation
Interactive Swagger UI for testing API calls.

- **Method:** `GET`
- **Path:** `/api-docs`
- **Token Required:** ❌ **No** (Public)

---

## 2. Authentication APIs (`/api/auth`)

### 2.1 Register User
Create a new user account.

- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Token Required:** ❌ **No** (Public)
- **Headers:** `Content-Type: application/json`

#### Input Parameters (Request Body):
| Field | Type | Required | Validation Rules |
| :--- | :--- | :--- | :--- |
| `email` | `string` | **Yes** | Must be a valid email format |
| `password` | `string` | **Yes** | Minimum 8 characters long |
| `name` | `string` | **Yes** | Non-empty string |

#### Request Body Example:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

#### Output Example (201 Created):
```json
{
  "message": "Registration successful",
  "user": {
    "id": "a3b1c2d4-5678-4901-89ab-cdef01234567",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "staff",
    "created_at": "2026-07-22T10:00:00.000Z"
  }
}
```

#### Error Response Examples:
- **400 Bad Request (Validation Failure):**
  ```json
  {
    "message": "Password must be at least 8 characters"
  }
  ```
- **409 Conflict (Duplicate Email):**
  ```json
  {
    "message": "User with this email already exists"
  }
  ```

---

### 2.2 User Login
Authenticate user credentials and generate a signed JWT bearer token.

- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Token Required:** ❌ **No** (Public)
- **Headers:** `Content-Type: application/json`

#### Input Parameters (Request Body):
| Field | Type | Required | Validation Rules |
| :--- | :--- | :--- | :--- |
| `email` | `string` | **Yes** | Registered email address |
| `password` | `string` | **Yes** | Account password |

#### Request Body Example:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### Output Example (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhM2IxYzJkNC01Njc4LTQ5MDEtODlhYi1jZGVmMDEyMzQ1NjciLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6InN0YWZmIiwiaWF0IjoxNzgwMzU5NjAwLCJleHAiOjE3ODA5NjQ0MDB9...",
  "user": {
    "id": "a3b1c2d4-5678-4901-89ab-cdef01234567",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "staff",
    "created_at": "2026-07-22T10:00:00.000Z"
  }
}
```

#### Error Response Examples:
- **400 Bad Request:**
  ```json
  {
    "message": "Email is required"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

---

## 3. Vehicle Inventory APIs (`/api/vehicles`)

---

### 3.1 Get All Vehicles
Retrieve all vehicles currently stored in the inventory catalog.

- **Method:** `GET`
- **Path:** `/api/vehicles`
- **Token Required:** ✅ **Yes** (User Token required)
- **Allowed Roles:** `staff`, `admin`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`

#### Input Parameters:
None.

#### Output Example (200 OK):
```json
{
  "vehicles": [
    {
      "id": "11111111-2222-3333-4444-555555555555",
      "make": "Toyota",
      "model": "RAV4",
      "category": "SUV",
      "price": 28500,
      "quantity": 12,
      "created_at": "2026-07-22T08:00:00.000Z",
      "updated_at": "2026-07-22T08:00:00.000Z"
    },
    {
      "id": "22222222-3333-4444-5555-666666666666",
      "make": "Honda",
      "model": "Civic",
      "category": "Sedan",
      "price": 24000,
      "quantity": 8,
      "created_at": "2026-07-22T09:00:00.000Z",
      "updated_at": "2026-07-22T09:00:00.000Z"
    }
  ]
}
```

#### Error Response Example:
- **401 Unauthorized:**
  ```json
  {
    "message": "Unauthorized: No token provided"
  }
  ```

---

### 3.2 Search and Filter Vehicles
Dynamically search and filter vehicles based on query filters.

- **Method:** `GET`
- **Path:** `/api/vehicles/search`
- **Token Required:** ✅ **Yes** (User Token required)
- **Allowed Roles:** `staff`, `admin`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`

#### Input Parameters (Query Parameters):
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `make` | `string` | Optional | Partial match on vehicle make (case-insensitive) |
| `model` | `string` | Optional | Partial match on vehicle model (case-insensitive) |
| `category` | `string` | Optional | Filter by category (e.g. `SUV`, `Sedan`, `Truck`) |
| `minPrice` | `number` | Optional | Minimum price limit |
| `maxPrice` | `number` | Optional | Maximum price limit |

#### Request URL Example:
`GET /api/vehicles/search?make=Toyota&category=SUV&minPrice=20000&maxPrice=35000`

#### Output Example (200 OK):
```json
{
  "vehicles": [
    {
      "id": "11111111-2222-3333-4444-555555555555",
      "make": "Toyota",
      "model": "RAV4",
      "category": "SUV",
      "price": 28500,
      "quantity": 12,
      "created_at": "2026-07-22T08:00:00.000Z",
      "updated_at": "2026-07-22T08:00:00.000Z"
    }
  ]
}
```

---

### 3.3 Get Vehicle by ID
Fetch single vehicle details by unique ID.

- **Method:** `GET`
- **Path:** `/api/vehicles/:id`
- **Token Required:** ✅ **Yes** (User Token required)
- **Allowed Roles:** `staff`, `admin`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`

#### Input Parameters (Path Parameter):
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Yes** | Unique UUID of the vehicle |

#### Request URL Example:
`GET /api/vehicles/11111111-2222-3333-4444-555555555555`

#### Output Example (200 OK):
```json
{
  "vehicle": {
    "id": "11111111-2222-3333-4444-555555555555",
    "make": "Toyota",
    "model": "RAV4",
    "category": "SUV",
    "price": 28500,
    "quantity": 12,
    "created_at": "2026-07-22T08:00:00.000Z",
    "updated_at": "2026-07-22T08:00:00.000Z"
  }
}
```

#### Error Response Example:
- **404 Not Found:**
  ```json
  {
    "message": "Vehicle with ID 11111111-2222-3333-4444-555555555555 not found"
  }
  ```

---

### 3.4 Add New Vehicle
Create a new vehicle entry in the inventory.

- **Method:** `POST`
- **Path:** `/api/vehicles`
- **Token Required:** ✅ **Yes** (User Token required)
- **Allowed Roles:** `staff`, `admin`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`

#### Input Parameters (Request Body):
| Field | Type | Required | Validation Rules |
| :--- | :--- | :--- | :--- |
| `make` | `string` | **Yes** | Vehicle make/brand |
| `model` | `string` | **Yes** | Vehicle model name |
| `category` | `string` | **Yes** | Vehicle category (e.g., `Sedan`, `SUV`, `Electric`) |
| `price` | `number` | **Yes** | Non-negative number |
| `quantity` | `number` | **Yes** | Stock count (non-negative integer) |

#### Request Body Example:
```json
{
  "make": "Tesla",
  "model": "Model Y",
  "category": "Electric SUV",
  "price": 45000,
  "quantity": 5
}
```

#### Output Example (201 Created):
```json
{
  "message": "Vehicle created successfully",
  "vehicle": {
    "id": "99999999-8888-7777-6666-555555555555",
    "make": "Tesla",
    "model": "Model Y",
    "category": "Electric SUV",
    "price": 45000,
    "quantity": 5,
    "created_at": "2026-07-22T10:15:00.000Z",
    "updated_at": "2026-07-22T10:15:00.000Z"
  }
}
```

#### Error Response Example:
- **400 Bad Request:**
  ```json
  {
    "message": "Vehicle price is required and must be a non-negative number"
  }
  ```

---

### 3.5 Update Vehicle Details
Modify parameters of an existing vehicle.

- **Method:** `PUT`
- **Path:** `/api/vehicles/:id`
- **Token Required:** ✅ **Yes** (User Token required)
- **Allowed Roles:** `staff`, `admin`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`

#### Input Parameters:
- **Path Parameter:** `id` (string, required) — UUID of the vehicle
- **Request Body Fields (All Optional):**
| Field | Type | Validation Rules |
| :--- | :--- | :--- |
| `make` | `string` | Vehicle make |
| `model` | `string` | Vehicle model |
| `category` | `string` | Vehicle category |
| `price` | `number` | Must be a non-negative number |
| `quantity` | `number` | Must be a non-negative number |

#### Request Body Example:
```json
{
  "model": "Model Y Long Range",
  "price": 47990
}
```

#### Output Example (200 OK):
```json
{
  "message": "Vehicle updated successfully",
  "vehicle": {
    "id": "99999999-8888-7777-6666-555555555555",
    "make": "Tesla",
    "model": "Model Y Long Range",
    "category": "Electric SUV",
    "price": 47990,
    "quantity": 5,
    "created_at": "2026-07-22T10:15:00.000Z",
    "updated_at": "2026-07-22T10:20:00.000Z"
  }
}
```

---

### 3.6 Purchase Vehicle
Record a customer purchase (automatically decrements stock `quantity` by 1).

- **Method:** `POST`
- **Path:** `/api/vehicles/:id/purchase`
- **Token Required:** ✅ **Yes** (User Token required)
- **Allowed Roles:** `staff`, `admin`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`

#### Input Parameters (Path Parameter):
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Yes** | Vehicle UUID |

#### Request URL Example:
`POST /api/vehicles/99999999-8888-7777-6666-555555555555/purchase`

#### Output Example (200 OK):
```json
{
  "message": "Vehicle purchased successfully",
  "vehicle": {
    "id": "99999999-8888-7777-6666-555555555555",
    "make": "Tesla",
    "model": "Model Y Long Range",
    "category": "Electric SUV",
    "price": 47990,
    "quantity": 4,
    "created_at": "2026-07-22T10:15:00.000Z",
    "updated_at": "2026-07-22T10:25:00.000Z"
  }
}
```

#### Error Response Example:
- **400 Bad Request (Stock Empty):**
  ```json
  {
    "message": "Vehicle is out of stock"
  }
  ```

---

### 3.7 Restock Vehicle (Admin Only)
Increase vehicle stock quantity by adding a specified positive number.

- **Method:** `POST`
- **Path:** `/api/vehicles/:id/restock`
- **Token Required:** ✅ **Yes** (Admin User Token required)
- **Allowed Roles:** 🔒 `admin` only
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`

#### Input Parameters:
- **Path Parameter:** `id` (string, required) — Vehicle UUID
- **Request Body Fields:**
| Field | Type | Required | Validation Rules |
| :--- | :--- | :--- | :--- |
| `quantity` | `number` | **Yes** | Must be a positive number (e.g. `10`) |

#### Request Body Example:
```json
{
  "quantity": 10
}
```

#### Output Example (200 OK):
```json
{
  "message": "Vehicle restocked successfully",
  "vehicle": {
    "id": "99999999-8888-7777-6666-555555555555",
    "make": "Tesla",
    "model": "Model Y Long Range",
    "category": "Electric SUV",
    "price": 47990,
    "quantity": 14,
    "created_at": "2026-07-22T10:15:00.000Z",
    "updated_at": "2026-07-22T10:30:00.000Z"
  }
}
```

#### Error Response Example:
- **403 Forbidden (Non-Admin Request):**
  ```json
  {
    "message": "Forbidden: Admin access required"
  }
  ```

---

### 3.8 Delete Vehicle (Admin Only)
Permanently remove a vehicle record from inventory.

- **Method:** `DELETE`
- **Path:** `/api/vehicles/:id`
- **Token Required:** ✅ **Yes** (Admin User Token required)
- **Allowed Roles:** 🔒 `admin` only
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`

#### Input Parameters (Path Parameter):
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Yes** | Vehicle UUID to delete |

#### Request URL Example:
`DELETE /api/vehicles/99999999-8888-7777-6666-555555555555`

#### Output Example (200 OK):
```json
{
  "message": "Vehicle deleted successfully"
}
```

#### Error Response Examples:
- **403 Forbidden (Staff User):**
  ```json
  {
    "message": "Forbidden: Admin access required"
  }
  ```
- **404 Not Found:**
  ```json
  {
    "message": "Vehicle with ID 99999999-8888-7777-6666-555555555555 not found"
  }
  ```
