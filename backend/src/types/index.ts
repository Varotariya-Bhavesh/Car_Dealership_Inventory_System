/**
 * Shared TypeScript types for the Car Inventory Management System backend.
 */

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: PublicUser;
}

// ─── User Types ───────────────────────────────────────────────────────────────

/** The shape of a user row stored in Supabase */
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'staff';
  created_at: string;
}

/** Safe user shape returned to clients (no password hash) */
export type PublicUser = Omit<User, 'password_hash'>;

// ─── JWT Types ────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'staff';
}

// ─── API Error Types ──────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}
