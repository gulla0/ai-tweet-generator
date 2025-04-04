// src/routes/tweets.ts
import express from 'express';
import {
  getTweetById,
  editTweet,
  sendTweet,
  deleteTweet,
  sendToX,
  validateXCredentials
} from '../services/tweetService';
import { TweetUpdateRequest, XCredentialType } from '../types';

const router = express.Router();

/**
 * PUT /api/tweets/:id/edit
 * Edit a tweet
 */
router.put('/:id/edit', async (req, res) => {
  try {
    const tweetId = req.params.id;
    const updateData = req.body as TweetUpdateRequest;
    
    if (!updateData.content || updateData.content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tweet content cannot be empty'
      });
    }
    
    const tweet = await getTweetById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found'
      });
    }
    
    const updatedTweet = await editTweet(tweetId, updateData);
    
    res.json({
      success: true,
      tweet: updatedTweet
    });
  } catch (error) {
    console.error('Error editing tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to edit tweet'
    });
  }
});

/**
 * POST /api/tweets/:id/send
 * Send a tweet to X (simulated)
 */
router.post('/:id/send', async (req, res) => {
  try {
    const tweetId = req.params.id;
    
    const tweet = await getTweetById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found'
      });
    }
    
    if (tweet.state === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Tweet has already been sent'
      });
    }
    
    const sentTweet = await sendTweet(tweetId);
    
    res.json({
      success: true,
      tweet: sentTweet
    });
  } catch (error) {
    console.error('Error sending tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send tweet'
    });
  }
});

/**
 * DELETE /api/tweets/:id
 * Delete a tweet
 */
router.delete('/:id', async (req, res) => {
  try {
    const tweetId = req.params.id;
    
    const tweet = await getTweetById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found'
      });
    }
    
    if (tweet.state === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a tweet that has already been sent'
      });
    }
    
    const success = await deleteTweet(tweetId);
    
    if (success) {
      res.json({
        success: true,
        message: 'Tweet successfully deleted'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete tweet'
      });
    }
  } catch (error) {
    console.error('Error deleting tweet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tweet'
    });
  }
});

/**
 * POST /api/tweets/send-to-x/:id
 * Send a tweet to X using provided credentials
 */
router.post('/send-to-x/:id', async (req, res) => {
  try {
    const tweetId = req.params.id;
    const { apiKey, apiSecret, accessToken, accessSecret } = req.body as XCredentialType;
    
    // Validate X credentials
    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      return res.status(400).json({
        success: false,
        message: 'Missing X API credentials'
      });
    }
    
    const tweet = await getTweetById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found'
      });
    }
    
    if (tweet.state === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Tweet has already been sent'
      });
    }
    
    const updatedTweet = await sendToX(tweetId, {
      apiKey,
      apiSecret,
      accessToken,
      accessSecret
    });
    
    res.json({
      success: true,
      tweet: updatedTweet
    });
  } catch (error: any) {
    console.error('Error sending tweet to X:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send tweet to X'
    });
  }
});

/**
 * POST /api/tweets/validate-x-creds
 * Validate X credentials
 */
router.post('/validate-x-creds', async (req, res) => {
  try {
    const { apiKey, apiSecret, accessToken, accessSecret } = req.body as XCredentialType;
    
    // Validate X credentials
    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      return res.status(400).json({
        success: false,
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
      message: error.message || 'Failed to validate X credentials'
    });
  }
});

export default router;