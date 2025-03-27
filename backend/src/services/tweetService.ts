// src/services/tweetService.ts
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';
import { Tweet, TweetState, TweetUpdateRequest } from '../types';

const TWEETS_FILE = config.paths.tweets;

// Ensure data directory exists
const ensureDataDir = async (): Promise<void> => {
  try {
    await fs.mkdir(config.paths.data, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
    throw new Error('Failed to create data directory');
  }
};

// Read tweets from file
export const getTweets = async (): Promise<Tweet[]> => {
  try {
    await ensureDataDir();
    
    try {
      const data = await fs.readFile(TWEETS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, create it with empty array
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(TWEETS_FILE, JSON.stringify([]));
        return [];
      }
      throw error;
    }
  } catch (error) {
    console.error(`Error reading tweets:`, error);
    throw new Error(`Failed to read tweets`);
  }
};

// Write tweets to file
export const saveTweets = async (tweets: Tweet[]): Promise<void> => {
  try {
    await ensureDataDir();
    await fs.writeFile(TWEETS_FILE, JSON.stringify(tweets, null, 2));
  } catch (error) {
    console.error(`Error writing tweets:`, error);
    throw new Error(`Failed to save tweets`);
  }
};

// Get tweets by transcript ID
export const getTweetsByTranscriptId = async (transcriptId: string): Promise<Tweet[]> => {
  const tweets = await getTweets();
  return tweets.filter(tweet => tweet.transcriptId === transcriptId);
};

// Get a single tweet by ID
export const getTweetById = async (id: string): Promise<Tweet | null> => {
  const tweets = await getTweets();
  return tweets.find(tweet => tweet.id === id) || null;
};

// Update tweet state
export const updateTweetState = async (id: string, state: TweetState): Promise<Tweet | null> => {
  const tweets = await getTweets();
  const tweetIndex = tweets.findIndex(tweet => tweet.id === id);
  
  if (tweetIndex === -1) {
    return null;
  }
  
  // Update the tweet
  const updatedTweet = {
    ...tweets[tweetIndex],
    state,
    updatedAt: new Date().toISOString()
  };
  
  tweets[tweetIndex] = updatedTweet;
  await saveTweets(tweets);
  
  return updatedTweet;
};

// Edit a tweet
export const editTweet = async (id: string, data: TweetUpdateRequest): Promise<Tweet | null> => {
  const tweets = await getTweets();
  const tweetIndex = tweets.findIndex(tweet => tweet.id === id);
  
  if (tweetIndex === -1) {
    return null;
  }
  
  // Update the tweet
  const updatedTweet = {
    ...tweets[tweetIndex],
    content: data.content,
    state: 'edited' as TweetState,
    updatedAt: new Date().toISOString()
  };
  
  tweets[tweetIndex] = updatedTweet;
  await saveTweets(tweets);
  
  return updatedTweet;
};

// Send a tweet (simulate sending to X)
export const sendTweet = async (id: string): Promise<Tweet | null> => {
  const tweets = await getTweets();
  const tweetIndex = tweets.findIndex(tweet => tweet.id === id);
  
  if (tweetIndex === -1) {
    return null;
  }
  
  // In a real implementation, this would connect to X API
  // For now, we'll just update the state
  console.log(`Simulating sending tweet to X: ${tweets[tweetIndex].content}`);
  
  // Update the tweet state
  const updatedTweet = {
    ...tweets[tweetIndex],
    state: 'sent' as TweetState,
    updatedAt: new Date().toISOString()
  };
  
  tweets[tweetIndex] = updatedTweet;
  await saveTweets(tweets);
  
  return updatedTweet;
};

// Delete a tweet
export const deleteTweet = async (id: string): Promise<boolean> => {
  const tweets = await getTweets();
  const initialLength = tweets.length;
  
  const filteredTweets = tweets.filter(tweet => tweet.id !== id);
  
  if (filteredTweets.length === initialLength) {
    return false; // No tweet was removed
  }
  
  await saveTweets(filteredTweets);
  return true;
};