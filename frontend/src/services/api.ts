// src/services/api.ts
import axios from 'axios';
import { TweetUpdateRequest, XCredentialType } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Transcripts API
export const getTranscripts = async () => {
  const response = await api.get('/transcripts');
  return response.data;
};

export const getTranscript = async (id: string) => {
  const response = await api.get(`/transcripts/${id}`);
  return response.data;
};

export const createTranscript = async (transcript: { title: string; date: string; content: string }) => {
  const response = await api.post('/transcripts', transcript);
  return response.data;
};

export const getTranscriptTweets = async (id: string) => {
  const response = await api.get(`/transcripts/${id}/tweets`);
  return response.data;
};

export const getSampleTranscript = async () => {
  const response = await api.get('/transcripts/sample/transcript');
  return response.data;
};

// Tweets API
export const editTweet = async (id: string, update: TweetUpdateRequest) => {
  const response = await api.put(`/tweets/${id}/edit`, update);
  return response.data;
};

export const sendTweet = async (id: string) => {
  const response = await api.post(`/tweets/${id}/send`);
  return response.data;
};

export const deleteTweet = async (id: string) => {
  const response = await api.delete(`/tweets/${id}`);
  return response.data;
};

export const sendTweetToX = async (id: string, xCredentials: XCredentialType) => {
  const response = await api.post(`/tweets/send-to-x/${id}`, xCredentials);
  return response.data;
};

export const validateXCreds = async (creds: XCredentialType) => {
  try {
    const response = await api.post('/auth/validate-x-credentials', creds);
    return response.data;
  } catch (error) {
    console.error('Error validating X credentials:', error);
    return { success: false, isValid: false, message: 'Failed to validate credentials' };
  }
};