// src/routes/transcripts.ts
import express from 'express';
import { authMiddleware } from '../services/authService';
import { 
  getTranscripts, 
  getTranscriptById, 
  createTranscript,
  generateTweets, 
  getTweetsByTranscriptId,
  getSampleTranscript
} from '../services/transcriptService';
import { TranscriptRequest } from '../types';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware as express.RequestHandler);

/**
 * GET /api/transcripts
 * Get all transcripts
 */
router.get('/', async (req, res) => {
  try {
    const transcripts = await getTranscripts();
    res.json(transcripts);
  } catch (error) {
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
    const transcript = await getTranscriptById(req.params.id);
    
    if (!transcript) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transcript not found' 
      });
    }
    
    res.json(transcript);
  } catch (error) {
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
    const { title, date, content } = req.body as TranscriptRequest;
    
    if (!title || !date || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Create transcript
    const transcript = await createTranscript({ title, date, content });
    
    // Generate tweets in the background
    generateTweets(content, transcript.id)
      .catch(error => console.error('Background tweet generation error:', error));
    
    res.status(201).json({
      success: true,
      transcript
    });
  } catch (error) {
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
    const transcript = await getTranscriptById(transcriptId);
    if (!transcript) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transcript not found' 
      });
    }
    
    // Get tweets
    const tweets = await getTweetsByTranscriptId(transcriptId);
    res.json(tweets);
  } catch (error) {
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
    const content = await getSampleTranscript();
    res.json({ content });
  } catch (error) {
    console.error('Error reading sample transcript:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to read sample transcript' 
    });
  }
});

export default router; 