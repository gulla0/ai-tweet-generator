// src/types.ts

// Transcript entity
export interface Transcript {
    id: string;
    title: string;
    date: string;
    content: string;
    createdAt: string;
  }
  
  // Tweet entity
  export interface Tweet {
    id: string;
    transcriptId: string;
    category: string;
    content: string;
    createdAt: string;
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