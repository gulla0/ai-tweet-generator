"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSampleTranscript = exports.generateTweets = exports.createTweet = exports.getTweetsByTranscriptId = exports.getTweets = exports.createTranscript = exports.getTranscriptById = exports.getTranscripts = void 0;
// src/services/transcriptService.ts
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config/config");
// Initialize Anthropic client
const anthropic = new sdk_1.default({
    apiKey: config_1.config.anthropicApiKey,
});
// Path to data files
const DATA_DIR = config_1.config.paths.data;
const TRANSCRIPTS_FILE = config_1.config.paths.transcripts;
const TWEETS_FILE = config_1.config.paths.tweets;
// Ensure data directory exists
const ensureDataDir = async () => {
    try {
        await promises_1.default.mkdir(DATA_DIR, { recursive: true });
    }
    catch (error) {
        console.error('Error creating data directory:', error);
        throw new Error('Failed to create data directory');
    }
};
// Read data from JSON file
const readJsonFile = async (filePath) => {
    try {
        await ensureDataDir();
        try {
            const data = await promises_1.default.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            // If file doesn't exist, create it with empty array
            if (error.code === 'ENOENT') {
                await promises_1.default.writeFile(filePath, JSON.stringify([]));
                return [];
            }
            throw error;
        }
    }
    catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        throw new Error(`Failed to read data from ${filePath}`);
    }
};
// Write data to JSON file
const writeJsonFile = async (filePath, data) => {
    try {
        await ensureDataDir();
        await promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
        throw new Error(`Failed to write data to ${filePath}`);
    }
};
// Get all transcripts
const getTranscripts = async () => {
    return readJsonFile(TRANSCRIPTS_FILE);
};
exports.getTranscripts = getTranscripts;
// Get transcript by ID
const getTranscriptById = async (id) => {
    const transcripts = await (0, exports.getTranscripts)();
    return transcripts.find(transcript => transcript.id === id) || null;
};
exports.getTranscriptById = getTranscriptById;
// Create a new transcript
const createTranscript = async (data) => {
    const transcripts = await (0, exports.getTranscripts)();
    const newTranscript = {
        id: (0, uuid_1.v4)(),
        title: data.title,
        date: data.date,
        content: data.content,
        createdAt: new Date().toISOString()
    };
    transcripts.push(newTranscript);
    await writeJsonFile(TRANSCRIPTS_FILE, transcripts);
    return newTranscript;
};
exports.createTranscript = createTranscript;
// Get all tweets
const getTweets = async () => {
    return readJsonFile(TWEETS_FILE);
};
exports.getTweets = getTweets;
// Get tweets by transcript ID
const getTweetsByTranscriptId = async (transcriptId) => {
    const tweets = await (0, exports.getTweets)();
    return tweets.filter(tweet => tweet.transcriptId === transcriptId);
};
exports.getTweetsByTranscriptId = getTweetsByTranscriptId;
// Create a tweet - Updated version with state
const createTweet = async (data) => {
    const tweets = await (0, exports.getTweets)();
    const newTweet = {
        id: (0, uuid_1.v4)(),
        transcriptId: data.transcriptId,
        category: data.category,
        content: data.content,
        state: 'draft', // Default state is 'draft'
        createdAt: new Date().toISOString()
    };
    tweets.push(newTweet);
    await writeJsonFile(TWEETS_FILE, tweets);
    return newTweet;
};
exports.createTweet = createTweet;
// Generate tweets from transcript - Modified to include state
const generateTweets = async (transcript, transcriptId) => {
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
        console.log('🔍 Making Anthropic API call with model:', config_1.config.model);
        console.log('📝 System prompt:', systemPrompt);
        console.log('📄 Transcript length:', transcript.length, 'characters');
        const response = await anthropic.messages.create({
            model: config_1.config.model,
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
        let tweetsData = [];
        try {
            // Try to parse the entire response as JSON first
            tweetsData = JSON.parse(content);
            console.log('✅ Successfully parsed JSON directly');
        }
        catch (error) {
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
        const tweets = tweetsData.map(tweetData => ({
            id: (0, uuid_1.v4)(),
            transcriptId,
            category: tweetData.category,
            content: tweetData.content,
            state: 'draft', // Set default state to 'draft'
            createdAt: new Date().toISOString()
        }));
        // Save tweets to file
        const existingTweets = await (0, exports.getTweets)();
        await writeJsonFile(TWEETS_FILE, [...existingTweets, ...tweets]);
        return tweets;
    }
    catch (error) {
        console.error('❌ Error generating tweets:', error);
        throw new Error('Failed to generate tweets');
    }
};
exports.generateTweets = generateTweets;
// Get sample transcript
const getSampleTranscript = async () => {
    try {
        const samplePath = path_1.default.join(process.cwd(), 'sample-transcript.txt');
        return await promises_1.default.readFile(samplePath, 'utf-8');
    }
    catch (error) {
        console.error('Error reading sample transcript:', error);
        throw new Error('Failed to read sample transcript');
    }
};
exports.getSampleTranscript = getSampleTranscript;
