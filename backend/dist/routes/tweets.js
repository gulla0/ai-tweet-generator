"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/tweets.ts
const express_1 = __importDefault(require("express"));
const authService_1 = require("../services/authService");
const tweetService_1 = require("../services/tweetService");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(authService_1.authMiddleware);
/**
 * PUT /api/tweets/:id/edit
 * Edit a tweet
 */
router.put('/:id/edit', async (req, res) => {
    try {
        const tweetId = req.params.id;
        const updateData = req.body;
        if (!updateData.content || updateData.content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Tweet content cannot be empty'
            });
        }
        const tweet = await (0, tweetService_1.getTweetById)(tweetId);
        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: 'Tweet not found'
            });
        }
        const updatedTweet = await (0, tweetService_1.editTweet)(tweetId, updateData);
        res.json({
            success: true,
            tweet: updatedTweet
        });
    }
    catch (error) {
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
        const tweet = await (0, tweetService_1.getTweetById)(tweetId);
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
        const sentTweet = await (0, tweetService_1.sendTweet)(tweetId);
        res.json({
            success: true,
            tweet: sentTweet
        });
    }
    catch (error) {
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
        const tweet = await (0, tweetService_1.getTweetById)(tweetId);
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
        const success = await (0, tweetService_1.deleteTweet)(tweetId);
        if (success) {
            res.json({
                success: true,
                message: 'Tweet successfully deleted'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete tweet'
            });
        }
    }
    catch (error) {
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
        const { apiKey, apiSecret, accessToken, accessSecret } = req.body;
        // Validate X credentials
        if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
            return res.status(400).json({
                success: false,
                message: 'Missing X API credentials'
            });
        }
        const tweet = await (0, tweetService_1.getTweetById)(tweetId);
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
        const updatedTweet = await (0, tweetService_1.sendToX)(tweetId, {
            apiKey,
            apiSecret,
            accessToken,
            accessSecret
        });
        res.json({
            success: true,
            tweet: updatedTweet
        });
    }
    catch (error) {
        console.error('Error sending tweet to X:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send tweet to X'
        });
    }
});
exports.default = router;
