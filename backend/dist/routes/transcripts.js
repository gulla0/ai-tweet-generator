"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/transcripts.ts
const express_1 = __importDefault(require("express"));
const authService_1 = require("../services/authService");
const transcriptService_1 = require("../services/transcriptService");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(authService_1.authMiddleware);
/**
 * GET /api/transcripts
 * Get all transcripts
 */
router.get('/', async (req, res) => {
    try {
        const transcripts = await (0, transcriptService_1.getTranscripts)();
        res.json(transcripts);
    }
    catch (error) {
        console.error('Error fetching transcripts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transcripts'
        });
    }
});
/**
 * GET /api/transcripts/:id
 * Get a transcript by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const transcript = await (0, transcriptService_1.getTranscriptById)(req.params.id);
        if (!transcript) {
            return res.status(404).json({
                success: false,
                message: 'Transcript not found'
            });
        }
        res.json(transcript);
    }
    catch (error) {
        console.error('Error fetching transcript:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transcript'
        });
    }
});
/**
 * POST /api/transcripts
 * Create a new transcript and generate tweets
 */
router.post('/', async (req, res) => {
    try {
        const { title, date, content } = req.body;
        if (!title || !date || !content) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        // Create transcript
        const transcript = await (0, transcriptService_1.createTranscript)({ title, date, content });
        // Generate tweets in the background
        (0, transcriptService_1.generateTweets)(content, transcript.id)
            .catch(error => console.error('Background tweet generation error:', error));
        res.status(201).json({
            success: true,
            transcript
        });
    }
    catch (error) {
        console.error('Error creating transcript:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create transcript'
        });
    }
});
/**
 * GET /api/transcripts/:id/tweets
 * Get tweets by transcript ID
 */
router.get('/:id/tweets', async (req, res) => {
    try {
        const transcriptId = req.params.id;
        // Verify transcript exists
        const transcript = await (0, transcriptService_1.getTranscriptById)(transcriptId);
        if (!transcript) {
            return res.status(404).json({
                success: false,
                message: 'Transcript not found'
            });
        }
        // Get tweets
        const tweets = await (0, transcriptService_1.getTweetsByTranscriptId)(transcriptId);
        res.json(tweets);
    }
    catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tweets'
        });
    }
});
/**
 * GET /api/transcripts/sample/transcript
 * Get sample transcript
 */
router.get('/sample/transcript', async (req, res) => {
    try {
        const content = await (0, transcriptService_1.getSampleTranscript)();
        res.json({ content });
    }
    catch (error) {
        console.error('Error reading sample transcript:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to read sample transcript'
        });
    }
});
exports.default = router;
