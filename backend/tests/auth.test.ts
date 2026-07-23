/**
 * Auth Endpoint Test Suite — RED PHASE
 *
 * Tests for:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *
 * Strategy: Supabase client is mocked via Jest so tests are fast,
 * deterministic, and do NOT touch the real database.
 */

import request from 'supertest';
import app from '../src/app';

// ─── Mock the Supabase config module ─────────────────────────────────────────
// We mock the entire module so no real network calls are made.
jest.mock('../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Import the mock AFTER jest.mock() so we can control its return values
import { supabase } from '../src/config/supabase';

// ─── Typed mock helpers ───────────────────────────────────────────────────────
const mockFrom = supabase.from as jest.Mock;

// ─── Inline mock pattern ──────────────────────────────────────────────────────
// Each test uses an inline mock object for clarity and explicitness.
// Pattern: mockFrom.mockReturnValue({ select, insert, eq, single, maybeSingle })

// ─── Seed data ────────────────────────────────────────────────────────────────
const MOCK_HASHED_PASSWORD =
  '$2b$10$abcdefghijklmnopqrstuvwxyz012345678901234567890'; // bcrypt-shaped hash

const MOCK_USER = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'john.doe@example.com',
  password_hash: MOCK_HASHED_PASSWORD,
  name: 'John Doe',
  role: 'staff' as const,
  created_at: new Date().toISOString(),
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
describe('POST / */register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Happy Path ──────────────────────────────────────────────────────────────
  it('should register a new user and return 201 with user data (no password)', async () => {
    // Arrange: Supabase returns the newly created user
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: MOCK_USER,
        error: null,
      }),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null, // email not already in use
        error: null,
      }),
    });

    // Act
    const res = await request(app).post('/api/auth/register').send({
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      name: 'John Doe',
    });

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('email', 'john.doe@example.com');
    expect(res.body.user).toHaveProperty('name', 'John Doe');
    expect(res.body.user).toHaveProperty('role', 'staff');
    // CRITICAL: password hash must NEVER be returned to the client
    expect(res.body.user).not.toHaveProperty('password_hash');
    expect(res.body.user).not.toHaveProperty('password');
  });

  // ── Validation Failures ─────────────────────────────────────────────────────

  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      password: 'SecurePass123!',
      name: 'John Doe',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/email/i);
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'john.doe@example.com',
      name: 'John Doe',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/password/i);
  });

  it('should return 400 if name is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/name/i);
  });

  it('should return 400 if email format is invalid', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: 'SecurePass123!',
      name: 'John Doe',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/email/i);
  });

  it('should return 400 if password is shorter than 8 characters', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'john.doe@example.com',
      password: 'abc',
      name: 'John Doe',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/password/i);
  });

  it('should return 400 if request body is empty', async () => {
    const res = await request(app).post('/api/auth/register').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  // ── Conflict ────────────────────────────────────────────────────────────────

  it('should return 409 if email is already registered', async () => {
    // Arrange: Supabase signals a unique constraint violation
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate key value violates unique constraint' },
      }),
      maybeSingle: jest.fn().mockResolvedValue({
        data: MOCK_USER, // email already exists
        error: null,
      }),
    });

    const res = await request(app).post('/api/auth/register').send({
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      name: 'John Doe',
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/already/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Happy Path ──────────────────────────────────────────────────────────────

  it('should login successfully and return 200 with a JWT token', async () => {
    // We need bcrypt to produce a real hash for this test to pass the
    // password comparison inside the controller. We use bcrypt directly here.
    const bcrypt = await import('bcryptjs');
    const realHash = await bcrypt.hash('SecurePass123!', 10);

    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { ...MOCK_USER, password_hash: realHash },
        error: null,
      }),
      maybeSingle: jest.fn().mockResolvedValue({
        data: { ...MOCK_USER, password_hash: realHash },
        error: null,
      }),
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    // Basic JWT structure: three base64 segments separated by dots
    expect(res.body.token.split('.').length).toBe(3);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'john.doe@example.com');
    // CRITICAL: password must never be in the response
    expect(res.body.user).not.toHaveProperty('password_hash');
    expect(res.body.user).not.toHaveProperty('password');
  });

  // ── Validation Failures ─────────────────────────────────────────────────────

  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      password: 'SecurePass123!',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/email/i);
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'john.doe@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/password/i);
  });

  it('should return 400 if request body is completely empty', async () => {
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  // ── Auth Failures ───────────────────────────────────────────────────────────

  it('should return 401 if email is not found', async () => {
    // Arrange: Supabase returns no user for this email
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      }),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'ghost@example.com',
      password: 'SecurePass123!',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
    // SECURITY: must NOT reveal whether the email exists or not
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should return 401 if password is incorrect', async () => {
    // Arrange: Supabase returns the user, but wrong password will be supplied
    const bcrypt = await import('bcryptjs');
    const realHash = await bcrypt.hash('CorrectPassword!', 10);

    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { ...MOCK_USER, password_hash: realHash },
        error: null,
      }),
      maybeSingle: jest.fn().mockResolvedValue({
        data: { ...MOCK_USER, password_hash: realHash },
        error: null,
      }),
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'john.doe@example.com',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
    // SECURITY: same generic message — don't leak which field was wrong
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  // ── Security Checks ─────────────────────────────────────────────────────────

  it('should return 401 and NOT reveal user existence when both are wrong', async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    });

    const resA = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'AnyPassword!',
    });

    expect(resA.status).toBe(401);
    expect(resA.body.message).toMatch(/invalid credentials/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Miscellaneous / Health
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});

describe('Unknown routes', () => {
  it('should return 404 for an unregistered route', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
  });
});
