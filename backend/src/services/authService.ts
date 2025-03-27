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
 * Middleware to check if user is authenticated
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Get auth token from header
  const authToken = req.headers['x-auth'] as string;
  
  // For this prototype, we just check for a specific token
  // In production, you'd validate a JWT or other secure token
  if (!authToken || authToken !== 'admin') {
    res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
    return;
  }
  
  // Add user info to request
  req.user = { email: config.auth.adminEmail };
  
  // Proceed to route handler
  next();
};