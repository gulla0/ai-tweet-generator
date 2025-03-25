import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add auth token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['X-Auth'] = token;
  }
  return config;
});

// Auth API
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Transcript API
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