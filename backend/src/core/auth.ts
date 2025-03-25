import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
import { AuthRequest } from './types';

export const authenticate = (req: Request, res: Response): boolean => {
  const { email, password } = req.body as AuthRequest;
  
  if (email === config.auth.adminEmail && password === config.auth.adminPassword) {
    return true;
  }
  
  return false;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Simple check for the X-Auth header
  const authHeader = req.headers['x-auth'] as string;
  
  if (!authHeader || authHeader !== 'admin') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  next();
}; 