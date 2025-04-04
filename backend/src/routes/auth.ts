// src/routes/auth.ts
import express from 'express';
import { XCredentialType } from '../types';
import { validateXCredentials } from '../services/tweetService';

const router = express.Router();

/**
 * POST /api/auth/validate-x-credentials
 * Validate X credentials without requiring authentication
 * Used for validating X API credentials
 */
router.post('/validate-x-credentials', async (req, res) => {
  try {
    const { apiKey, apiSecret, accessToken, accessSecret } = req.body as XCredentialType;
    
    // Validate X credentials
    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      return res.status(400).json({
        success: false,
        isValid: false,
        message: 'Missing X API credentials'
      });
    }
    
    const isValid = await validateXCredentials({
      apiKey,
      apiSecret,
      accessToken,
      accessSecret
    });
    
    res.json({
      success: true,
      isValid
    });
  } catch (error: any) {
    console.error('Error validating X credentials:', error);
    res.status(500).json({
      success: false,
      isValid: false,
      message: error.message || 'Failed to validate X credentials'
    });
  }
});

export default router;