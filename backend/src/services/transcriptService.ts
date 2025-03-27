// src/services/transcriptService.ts
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config';
import { Transcript, Tweet, TranscriptRequest } from '../types';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: config.anthropicApiKey,
});

// Path to data files
const DATA_DIR = config.paths.data;
const TRANSCRIPTS_FILE = config.paths.transcripts;
const TWEETS_FILE = config.paths.tweets;

// Ensure data directory exists
const ensureDataDir = async (): Promise<void> => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
    throw new Error('Failed to create data directory');
  }
};

// Read data from JSON file
const readJsonFile = async <T>(filePath: string): Promise<T[]> => {
  try {
    await ensureDataDir();
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, create it with empty array
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(filePath, JSON.stringify([]));
        return [];
      }
      throw error;
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    throw new Error(`Failed to read data from ${filePath}`);
  }
};

// Write data to JSON file
const writeJsonFile = async <T>(filePath: string, data: T[]): Promise<void> => {
  try {
    await ensureDataDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    throw new Error(`Failed to write data to ${filePath}`);
  }
};

// Get all transcripts
export const getTranscripts = async (): Promise<Transcript[]> => {
  return readJsonFile<Transcript>(TRANSCRIPTS_FILE);
};

// Get transcript by ID
export const getTranscriptById = async (id: string): Promise<Transcript | null> => {
  const transcripts = await getTranscripts();
  return transcripts.find(transcript => transcript.id === id) || null;
};

// Create a new transcript
export const createTranscript = async (data: TranscriptRequest): Promise<Transcript> => {
  const transcripts = await getTranscripts();
  
  const newTranscript: Transcript = {
    id: uuidv4(),
    title: data.title,
    date: data.date,
    content: data.content,
    createdAt: new Date().toISOString()
  };
  
  transcripts.push(newTranscript);
  await writeJsonFile(TRANSCRIPTS_FILE, transcripts);
  
  return newTranscript;
};

// Get all tweets
export const getTweets = async (): Promise<Tweet[]> => {
  return readJsonFile<Tweet>(TWEETS_FILE);
};

// Get tweets by transcript ID
export const getTweetsByTranscriptId = async (transcriptId: string): Promise<Tweet[]> => {
  const tweets = await getTweets();
  return tweets.filter(tweet => tweet.transcriptId === transcriptId);
};

// Create a tweet
export const createTweet = async (data: Omit<Tweet, 'id' | 'createdAt'>): Promise<Tweet> => {
  const tweets = await getTweets();
  
  const newTweet: Tweet = {
    id: uuidv4(),
    transcriptId: data.transcriptId,
    category: data.category,
    content: data.content,
    createdAt: new Date().toISOString()
  };
  
  tweets.push(newTweet);
  await writeJsonFile(TWEETS_FILE, tweets);
  
  return newTweet;
};

// Generate tweets from transcript
export const generateTweets = async (transcript: string, transcriptId: string): Promise<Tweet[]> => {
  const systemPrompt = `You are an expert at converting DAO governance meeting transcripts into engaging tweet suggestions.
Your task is to analyze the provided meeting transcript and generate tweet suggestions for the DAO to share with the community.
Focus on key governance updates, community initiatives, and collaborative projects discussed in the meeting.

Create 6-10 tweet-worthy segments from the transcript and convert them into engaging, informative tweets.
Each tweet should:
- Be 280 characters or less
- Be written in a professional but conversational tone
- Include relevant hashtags (like #DAOgovernance, #Web3, etc.)
- Highlight one specific update, decision, or announcement
- Be suitable for community updates and educational content

Format your response as a JSON array where each item has the following structure:
{
  "category": "The category of the tweet (e.g., 'Governance', 'Community', 'Development', 'Treasury', 'Education')",
  "content": "The actual tweet text"
}

DO NOT include any explanations or commentary. Return ONLY valid JSON.`;

  try {
    console.log('🔍 Making Anthropic API call with model:', config.model);
    console.log('📝 System prompt:', systemPrompt);
    console.log('📄 Transcript length:', transcript.length, 'characters');
    
    const response = await anthropic.messages.create({
      model: config.model,
      system: systemPrompt,
      messages: [{ role: 'user', content: transcript }],
      max_tokens: 2000,
    });

    console.log('✅ Received response from Anthropic API');
    console.log('📊 Response details:', {
      id: response.id,
      model: response.model,
      contentType: response.content[0].type,
      contentLength: response.content[0].text.length
    });
    
    const content = response.content[0].text;
    console.log('📋 Raw response content:', content);
    
    // Extract JSON from the response
    let tweetsData: Array<{ category: string; content: string }> = [];
    
    try {
      // Try to parse the entire response as JSON first
      tweetsData = JSON.parse(content);
      console.log('✅ Successfully parsed JSON directly');
    } catch (error) {
      console.log('⚠️ Failed to parse direct JSON, attempting to extract JSON from text');
      // If that fails, try to extract JSON from the response
      const jsonMatch = content.match(/\[\s*{.*}\s*\]/s);
      if (!jsonMatch) {
        console.error('❌ Failed to extract JSON pattern from response');
        throw new Error('Failed to extract valid JSON from the API response');
      }
      
      tweetsData = JSON.parse(jsonMatch[0]);
      console.log('✅ Successfully extracted and parsed JSON from text');
    }
    
    console.log('📊 Generated', tweetsData.length, 'tweets');
    
    // Create tweet objects
    const tweets: Tweet[] = tweetsData.map(tweetData => ({
      id: uuidv4(),
      transcriptId,
      category: tweetData.category,
      content: tweetData.content,
      createdAt: new Date().toISOString()
    }));
    
    // Save tweets to file
    const existingTweets = await getTweets();
    await writeJsonFile(TWEETS_FILE, [...existingTweets, ...tweets]);
    
    return tweets;
  } catch (error) {
    console.error('❌ Error generating tweets:', error);
    throw new Error('Failed to generate tweets');
  }
};

// Get sample transcript
export const getSampleTranscript = async (): Promise<string> => {
  try {
    const samplePath = path.join(process.cwd(), 'sample-transcript.txt');
    return await fs.readFile(samplePath, 'utf-8');
  } catch (error) {
    console.error('Error reading sample transcript:', error);
    throw new Error('Failed to read sample transcript');
  }
};