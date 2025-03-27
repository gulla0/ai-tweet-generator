// src/routes/tweets.ts
import express from 'express';
import { authMiddleware } from '../services/authService';
import {
  getTweetById,
  editTweet,
  sendTweet,
  deleteTweet
} from '../services/tweetService';
import { TweetUpdateRequest } from '../types';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware as express.RequestHandler);

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

export default router;