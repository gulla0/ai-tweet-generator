"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToX = exports.deleteTweet = exports.sendTweet = exports.editTweet = exports.updateTweetState = exports.getTweetById = exports.getTweetsByTranscriptId = exports.saveTweets = exports.getTweets = void 0;
// src/services/tweetService.ts
const promises_1 = __importDefault(require("fs/promises"));
const twitter_api_v2_1 = require("twitter-api-v2");
const config_1 = require("../config/config");
const TWEETS_FILE = config_1.config.paths.tweets;
// Ensure data directory exists
const ensureDataDir = async () => {
    try {
        await promises_1.default.mkdir(config_1.config.paths.data, { recursive: true });
    }
    catch (error) {
        console.error('Error creating data directory:', error);
        throw new Error('Failed to create data directory');
    }
};
// Read tweets from file
const getTweets = async () => {
    try {
        await ensureDataDir();
        try {
            const data = await promises_1.default.readFile(TWEETS_FILE, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            // If file doesn't exist, create it with empty array
            if (error.code === 'ENOENT') {
                await promises_1.default.writeFile(TWEETS_FILE, JSON.stringify([]));
                return [];
            }
            throw error;
        }
    }
    catch (error) {
        console.error(`Error reading tweets:`, error);
        throw new Error(`Failed to read tweets`);
    }
};
exports.getTweets = getTweets;
// Write tweets to file
const saveTweets = async (tweets) => {
    try {
        await ensureDataDir();
        await promises_1.default.writeFile(TWEETS_FILE, JSON.stringify(tweets, null, 2));
    }
    catch (error) {
        console.error(`Error writing tweets:`, error);
        throw new Error(`Failed to save tweets`);
    }
};
exports.saveTweets = saveTweets;
// Get tweets by transcript ID
const getTweetsByTranscriptId = async (transcriptId) => {
    const tweets = await (0, exports.getTweets)();
    return tweets.filter(tweet => tweet.transcriptId === transcriptId);
};
exports.getTweetsByTranscriptId = getTweetsByTranscriptId;
// Get a single tweet by ID
const getTweetById = async (id) => {
    const tweets = await (0, exports.getTweets)();
    return tweets.find(tweet => tweet.id === id) || null;
};
exports.getTweetById = getTweetById;
// Update tweet state
const updateTweetState = async (id, state) => {
    const tweets = await (0, exports.getTweets)();
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
    await (0, exports.saveTweets)(tweets);
    return updatedTweet;
};
exports.updateTweetState = updateTweetState;
// Edit a tweet
const editTweet = async (id, data) => {
    const tweets = await (0, exports.getTweets)();
    const tweetIndex = tweets.findIndex(tweet => tweet.id === id);
    if (tweetIndex === -1) {
        return null;
    }
    // Update the tweet
    const updatedTweet = {
        ...tweets[tweetIndex],
        content: data.content,
        state: 'edited',
        updatedAt: new Date().toISOString()
    };
    tweets[tweetIndex] = updatedTweet;
    await (0, exports.saveTweets)(tweets);
    return updatedTweet;
};
exports.editTweet = editTweet;
// Send a tweet (simulate sending to X)
const sendTweet = async (id) => {
    const tweets = await (0, exports.getTweets)();
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
        state: 'sent',
        updatedAt: new Date().toISOString()
    };
    tweets[tweetIndex] = updatedTweet;
    await (0, exports.saveTweets)(tweets);
    return updatedTweet;
};
exports.sendTweet = sendTweet;
// Delete a tweet
const deleteTweet = async (id) => {
    const tweets = await (0, exports.getTweets)();
    const initialLength = tweets.length;
    const filteredTweets = tweets.filter(tweet => tweet.id !== id);
    if (filteredTweets.length === initialLength) {
        return false; // No tweet was removed
    }
    await (0, exports.saveTweets)(filteredTweets);
    return true;
};
exports.deleteTweet = deleteTweet;
const sendToX = async (id, creds) => {
    const tweets = await (0, exports.getTweets)();
    const tweetIndex = tweets.findIndex(tweet => tweet.id === id);
    if (tweetIndex === -1) {
        return null;
    }
    try {
        // Create Twitter client with provided credentials
        const client = new twitter_api_v2_1.TwitterApi({
            appKey: creds.apiKey,
            appSecret: creds.apiSecret,
            accessToken: creds.accessToken,
            accessSecret: creds.accessSecret
        });
        // Post tweet to X (Twitter)
        const response = await client.v2.tweet(tweets[tweetIndex].content);
        // Update the tweet in our local database
        const updatedTweet = {
            ...tweets[tweetIndex],
            state: 'sent',
            updatedAt: new Date().toISOString(),
            xPostId: response.data.id
        };
        tweets[tweetIndex] = updatedTweet;
        await (0, exports.saveTweets)(tweets);
        return updatedTweet;
    }
    catch (error) {
        console.error('Error sending tweet to X:', error);
        throw error;
    }
};
exports.sendToX = sendToX;
