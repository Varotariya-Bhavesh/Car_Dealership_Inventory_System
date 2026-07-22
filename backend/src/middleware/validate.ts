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

// ─── Create Vehicle Validator ──────────────────────────────────────────────────

/**
 * Validates the request body for POST /api/vehicles.
 * Checks make, model, category, price, quantity.
 */
export const validateCreateVehicle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { make, model, category, price, quantity } = req.body as Record<string, unknown>;

  if (!make || typeof make !== 'string' || make.trim() === '') {
    res.status(400).json({ message: 'Vehicle make is required' });
    return;
  }

  if (!model || typeof model !== 'string' || model.trim() === '') {
    res.status(400).json({ message: 'Vehicle model is required' });
    return;
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    res.status(400).json({ message: 'Vehicle category is required' });
    return;
  }

  if (price === undefined || price === null || typeof price !== 'number' || isNaN(price) || price < 0) {
    res.status(400).json({ message: 'Vehicle price is required and must be a non-negative number' });
    return;
  }

  if (
    quantity === undefined ||
    quantity === null ||
    typeof quantity !== 'number' ||
    isNaN(quantity) ||
    quantity < 0
  ) {
    res.status(400).json({ message: 'Vehicle quantity in stock is required and must be a non-negative number' });
    return;
  }

  next();
};

// ─── Update Vehicle Validator ──────────────────────────────────────────────────

/**
 * Validates optional fields for PUT /api/vehicles/:id.
 */
export const validateUpdateVehicle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { price, quantity } = req.body as Record<string, unknown>;

  if (price !== undefined && (typeof price !== 'number' || isNaN(price) || price < 0)) {
    res.status(400).json({ message: 'Vehicle price must be a non-negative number' });
    return;
  }

  if (quantity !== undefined && (typeof quantity !== 'number' || isNaN(quantity) || quantity < 0)) {
    res.status(400).json({ message: 'Vehicle quantity must be a non-negative number' });
    return;
  }

  next();
};

// ─── Restock Vehicle Validator ─────────────────────────────────────────────────

/**
 * Validates quantity for POST /api/vehicles/:id/restock.
 */
export const validateRestockVehicle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { quantity, adjustment } = req.body as Record<string, unknown>;
  const amount = (quantity ?? adjustment) as unknown;

  if (amount === undefined || amount === null || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    res.status(400).json({ message: 'Restock quantity must be a positive number' });
    return;
  }

  next();
};


