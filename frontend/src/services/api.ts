// src/services/api.ts
import axios from 'axios';
import { TweetUpdateRequest } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Add auth token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['X-Auth'] = token;
  }
  return config;
});

// Handle API errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      
      // If unauthorized, remove token and reload
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      }
      
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Auth API
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

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

// New Tweet API endpoints
export const editTweet = async (id: string, data: TweetUpdateRequest) => {
  const response = await api.put(`/tweets/${id}/edit`, data);
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