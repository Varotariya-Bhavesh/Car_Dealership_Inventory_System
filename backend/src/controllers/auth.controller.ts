import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterRequestBody, LoginRequestBody } from '../types';
import { AppError } from '../errors/app-error';

/**
 * POST /api/auth/register
 */
export const register = async (
  req: Request<Record<string, never>, unknown, RegisterRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({
      message: 'Registration successful',
      user,
    });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Auth] Register error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (
  req: Request<Record<string, never>, unknown, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { token, user } = await AuthService.loginUser(req.body);
    res.status(200).json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Auth] Login error:', message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
