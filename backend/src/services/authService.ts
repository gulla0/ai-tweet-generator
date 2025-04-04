// src/services/authService.ts
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
import { AuthRequest, AuthResponse, AuthenticatedRequest } from '../types';

/**
 * Authenticate a user by email and password
 * For this prototype, we're using simple hardcoded authentication
 * In a production environment, you'd want to use a database and proper encryption
 */
export const authenticate = (req: AuthRequest): AuthResponse => {
  const { email, password } = req;
  
  if (email === config.auth.adminEmail && password === config.auth.adminPassword) {
    return {
      success: true,
      token: 'admin' // Simple token for prototype, would use JWT in production
    };
  }
  
  return {
    success: false,
    message: 'Invalid credentials'
  };
};

/**
 * Middleware that allows all requests through
 * For this open prototype, we don't require authentication
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // No authentication required, simply proceed to route handler
  // We still set a dummy user on the request for backward compatibility
  req.user = { email: 'guest@example.com' };
  
  // Proceed to route handler
  next();
};