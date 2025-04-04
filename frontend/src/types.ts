// src/types.ts

// Transcript entity
export interface Transcript {
  id: string;
  title: string;
  date: string;
  content: string;
  createdAt: string;
}

// Tweet state type
export type TweetState = 'draft' | 'approved' | 'edited' | 'sent';

// X Credentials type
export interface XCredentialType {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

// Tweet entity
export interface Tweet {
  id: string;
  transcriptId: string;
  category: string;
  content: string;
  state: TweetState;
  createdAt: string;
  updatedAt?: string;
  xPostId?: string;
}

// Tweet update request
export interface TweetUpdateRequest {
  content: string;
}

// Auth response
export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// API error
export interface ApiError {
  success: boolean;
  message: string;
}