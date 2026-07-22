import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * JWT Authentication Middleware
 * Protects routes by verifying the Bearer token sent in the Authorization header.
 */
export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET ?? 'fallback-dev-secret';

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (_err) {
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

/**
 * Require Admin Role Guard
 * Ensures only users with role === 'admin' can access restricted endpoints.
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    res.status(401).json({ message: 'Unauthorized: Authentication required' });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
    return;
  }

  next();
};

