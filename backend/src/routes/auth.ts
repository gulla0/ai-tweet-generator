// src/routes/auth.ts
import express from 'express';
import { authenticate } from '../services/authService';
import { AuthRequest } from '../types';

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
router.post('/login', (req, res) => {
  try {
    const authResult = authenticate(req.body as AuthRequest);
    
    if (authResult.success) {
      res.json(authResult);
    } else {
      res.status(401).json({
        success: false,
        message: authResult.message || 'Authentication failed'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
});

export default router;