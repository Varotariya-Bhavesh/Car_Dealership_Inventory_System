/**
 * Vehicle Endpoints Test Suite — RED PHASE
 *
 * Tests for:
 *   POST /api/vehicles          — Add a new vehicle (JWT Protected)
 *   GET /api/vehicles           — Retrieve all available vehicles (JWT Protected)
 *   GET /api/vehicles/search    — Search & filter vehicles by make, model, category, or price range (JWT Protected)
 *
 * Strategy: Supabase client is mocked via Jest so tests run fast and isolated.
 */

import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';

// ─── Mock the Supabase config module ─────────────────────────────────────────
jest.mock('../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { supabase } from '../src/config/supabase';

const mockFrom = supabase.from as jest.Mock;

// ─── Test Helpers & Seed Data ────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';

const generateValidToken = (role: 'admin' | 'staff' = 'staff'): string => {
  return jwt.sign(
    { userId: '123e4567-e89b-12d3-a456-426614174000', email: 'staff@example.com', role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const MOCK_VEHICLE = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  make: 'Toyota',
  model: 'RAV4',
  category: 'SUV',
  price: 28500,
  quantity: 5,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_VEHICLES_LIST = [
  MOCK_VEHICLE,
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 22000,
    quantity: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    make: 'Ford',
    model: 'F-150',
    category: 'Truck',
    price: 45000,
    quantity: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

describe('Vehicle Endpoints Test Suite', () => {
  let validToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = generateValidToken();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 1. JWT Authentication Protection Tests
  // ───────────────────────────────────────────────────────────────────────────
  describe('JWT Authentication Protection', () => {
    it('POST /api/vehicles — should return 401 Unauthorized if no Authorization token is provided', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send({
          make: 'Toyota',
          model: 'Camry',
          category: 'Sedan',
          price: 25000,
          quantity: 4,
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/unauthorized|token/i);
    });

    it('POST /api/vehicles — should return 401 Unauthorized if invalid token is provided', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', 'Bearer invalid-token-string')
        .send({
          make: 'Toyota',
          model: 'Camry',
          category: 'Sedan',
          price: 25000,
          quantity: 4,
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    it('GET /api/vehicles — should return 401 Unauthorized if no Authorization token is provided', async () => {
      const res = await request(app).get('/api/vehicles');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    it('GET /api/vehicles/search — should return 401 Unauthorized if no Authorization token is provided', async () => {
      const res = await request(app).get('/api/vehicles/search?make=Toyota');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 2. POST /api/vehicles — Add New Vehicle
  // ───────────────────────────────────────────────────────────────────────────
  describe('POST /api/vehicles', () => {
    it('should create a vehicle and return 201 with created vehicle data when request is valid and authorized', async () => {
      mockFrom.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: MOCK_VEHICLE,
          error: null,
        }),
      });

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          make: 'Toyota',
          model: 'RAV4',
          category: 'SUV',
          price: 28500,
          quantity: 5,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('vehicle');
      expect(res.body.vehicle).toEqual(MOCK_VEHICLE);
    });

    it('should return 400 Bad Request if make is missing', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          model: 'RAV4',
          category: 'SUV',
          price: 28500,
          quantity: 5,
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/make/i);
    });

    it('should return 400 Bad Request if model is missing', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          make: 'Toyota',
          category: 'SUV',
          price: 28500,
          quantity: 5,
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/model/i);
    });

    it('should return 400 Bad Request if category is missing', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          make: 'Toyota',
          model: 'RAV4',
          price: 28500,
          quantity: 5,
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/category/i);
    });

    it('should return 400 Bad Request if price is missing or invalid', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          make: 'Toyota',
          model: 'RAV4',
          category: 'SUV',
          price: -100,
          quantity: 5,
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/price/i);
    });

    it('should return 400 Bad Request if quantity is missing or invalid', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          make: 'Toyota',
          model: 'RAV4',
          category: 'SUV',
          price: 28500,
          quantity: -2,
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/quantity/i);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. GET /api/vehicles — Retrieve All Vehicles
  // ───────────────────────────────────────────────────────────────────────────
  describe('GET /api/vehicles', () => {
    it('should return 200 OK with an array of all vehicles when authorized', async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: MOCK_VEHICLES_LIST,
          error: null,
        }),
      });

      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('vehicles');
      expect(Array.isArray(res.body.vehicles)).toBe(true);
      expect(res.body.vehicles).toHaveLength(3);
      expect(res.body.vehicles).toEqual(MOCK_VEHICLES_LIST);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. GET /api/vehicles/search — Filter & Search Vehicles
  // ───────────────────────────────────────────────────────────────────────────
  describe('GET /api/vehicles/search', () => {
    it('should filter vehicles by make', async () => {
      const toyotaVehicles = [MOCK_VEHICLE];

      const chain: Record<string, jest.Mock> = {};
      chain.select = jest.fn().mockReturnValue(chain);
      chain.ilike = jest.fn().mockReturnValue(chain);
      chain.gte = jest.fn().mockReturnValue(chain);
      chain.lte = jest.fn().mockReturnValue(chain);
      chain.order = jest.fn().mockResolvedValue({ data: toyotaVehicles, error: null });

      mockFrom.mockReturnValue(chain);

      const res = await request(app)
        .get('/api/vehicles/search?make=Toyota')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('vehicles');
      expect(res.body.vehicles).toEqual(toyotaVehicles);
      expect(mockFrom).toHaveBeenCalledWith('vehicles');
    });

    it('should filter vehicles by price range (minPrice & maxPrice)', async () => {
      const filteredVehicles = [MOCK_VEHICLE];

      const chain: Record<string, jest.Mock> = {};
      chain.select = jest.fn().mockReturnValue(chain);
      chain.ilike = jest.fn().mockReturnValue(chain);
      chain.gte = jest.fn().mockReturnValue(chain);
      chain.lte = jest.fn().mockReturnValue(chain);
      chain.order = jest.fn().mockResolvedValue({ data: filteredVehicles, error: null });

      mockFrom.mockReturnValue(chain);

      const res = await request(app)
        .get('/api/vehicles/search?minPrice=10000&maxPrice=30000')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('vehicles');
      expect(res.body.vehicles).toEqual(filteredVehicles);
    });

    it('should filter vehicles by category', async () => {
      const suvVehicles = [MOCK_VEHICLE];

      const chain: Record<string, jest.Mock> = {};
      chain.select = jest.fn().mockReturnValue(chain);
      chain.ilike = jest.fn().mockReturnValue(chain);
      chain.gte = jest.fn().mockReturnValue(chain);
      chain.lte = jest.fn().mockReturnValue(chain);
      chain.order = jest.fn().mockResolvedValue({ data: suvVehicles, error: null });

      mockFrom.mockReturnValue(chain);

      const res = await request(app)
        .get('/api/vehicles/search?category=SUV')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('vehicles');
      expect(res.body.vehicles).toEqual(suvVehicles);
    });
  });
});
