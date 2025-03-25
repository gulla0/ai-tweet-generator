import express from 'express';
import { createTranscript, getTranscriptById, getTranscripts } from '../core/data';
import { generateTweets } from '../services/anthropicService';
import { createTweet, getTweetsByTranscriptId } from '../core/data';
import { authMiddleware } from '../core/auth';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all transcripts
router.get('/', (req, res) => {
  const transcripts = getTranscripts();
  res.json(transcripts);
});

// Get a specific transcript
router.get('/:id', (req, res) => {
  const transcript = getTranscriptById(req.params.id);
  
  if (!transcript) {
    return res.status(404).json({ error: 'Transcript not found' });
  }
  
  res.json(transcript);
});

// Create a new transcript
router.post('/', async (req, res) => {
  try {
    const { title, date, content } = req.body;
    
    if (!title || !date || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const transcript = createTranscript({ title, date, content });
    
    // Generate tweets for the transcript
    const tweets = await generateTweets(content, transcript.id);
    
    // Save the generated tweets
    tweets.forEach(tweet => {
      createTweet(tweet);
    });
    
    res.status(201).json(transcript);
  } catch (error) {
    console.error('Error creating transcript:', error);
    res.status(500).json({ error: 'Failed to create transcript' });
  }
});

// Get tweets for a specific transcript
router.get('/:id/tweets', (req, res) => {
  const transcriptId = req.params.id;
  const transcript = getTranscriptById(transcriptId);
  
  if (!transcript) {
    return res.status(404).json({ error: 'Transcript not found' });
  }
  
  const tweets = getTweetsByTranscriptId(transcriptId);
  res.json(tweets);
});

// Get sample transcript
router.get('/sample/transcript', (req, res) => {
  try {
    const samplePath = path.join(__dirname, '../../../sample-transcript.txt');
    const content = fs.readFileSync(samplePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading sample transcript:', error);
    res.status(500).json({ error: 'Failed to read sample transcript' });
  }
});

export default router; 