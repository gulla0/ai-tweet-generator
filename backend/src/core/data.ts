import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';
import { Transcript, Tweet } from './types';

// Helper function to read data from a file
const readData = <T>(filePath: string): T[] => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
  
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write data to a file
const writeData = <T>(filePath: string, data: T[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Transcript data functions
export const getTranscripts = (): Transcript[] => {
  return readData<Transcript>(config.paths.transcripts);
};

export const getTranscriptById = (id: string): Transcript | undefined => {
  const transcripts = getTranscripts();
  return transcripts.find(transcript => transcript.id === id);
};

export const createTranscript = (transcript: Omit<Transcript, 'id' | 'createdAt'>): Transcript => {
  const transcripts = getTranscripts();
  
  const newTranscript: Transcript = {
    ...transcript,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  
  transcripts.push(newTranscript);
  writeData(config.paths.transcripts, transcripts);
  
  return newTranscript;
};

// Tweet data functions
export const getTweets = (): Tweet[] => {
  return readData<Tweet>(config.paths.tweets);
};

export const getTweetsByTranscriptId = (transcriptId: string): Tweet[] => {
  const tweets = getTweets();
  return tweets.filter(tweet => tweet.transcriptId === transcriptId);
};

export const createTweet = (tweet: Omit<Tweet, 'id' | 'createdAt'>): Tweet => {
  const tweets = getTweets();
  
  const newTweet: Tweet = {
    ...tweet,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  
  tweets.push(newTweet);
  writeData(config.paths.tweets, tweets);
  
  return newTweet;
}; 