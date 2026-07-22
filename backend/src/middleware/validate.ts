import { Request, Response, NextFunction } from 'express';

// ─── Constants ────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// ─── Register Validator ───────────────────────────────────────────────────────

/**
 * Validates the request body for POST /api/auth/register.
 * Checks for presence and format of email, password, and name.
 * Calls next() only if all fields are valid.
 */
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, name } = req.body as Record<string, unknown>;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  if (!password || typeof password !== 'string' || password === '') {
    res.status(400).json({ message: 'Password is required' });
    return;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
    return;
  }

  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ message: 'Name is required' });
    return;
  }

  next();
};

// ─── Login Validator ──────────────────────────────────────────────────────────

/**
 * Validates the request body for POST /api/auth/login.
 * Checks that email and password are present.
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body as Record<string, unknown>;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  if (!password || typeof password !== 'string' || password === '') {
    res.status(400).json({ message: 'Password is required' });
    return;
  }

  next();
};
