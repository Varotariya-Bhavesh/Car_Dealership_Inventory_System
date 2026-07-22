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
