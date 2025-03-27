// src/types.ts
import { Request } from 'express';

// Request type for authentication
export interface AuthRequest {
    email: string;
    password: string;
  }
  
  // Response type for authentication
  export interface AuthResponse {
    success: boolean;
    token?: string;
    message?: string;
  }
  
  // Transcript entity
  export interface Transcript {
    id: string;
    title: string;
    date: string;
    content: string;
    createdAt: string;
  }
  
  // Request type for creating a transcript
  export interface TranscriptRequest {
    title: string;
    date: string;
    content: string;
  }
  
  // Tweet entity
  export interface Tweet {
    id: string;
    transcriptId: string;
    category: string;
    content: string;
    createdAt: string;
  }
  
  // Custom error type for API errors
  export class ApiError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'ApiError';
    }
  }
  
  // Express request with auth data
  export interface AuthenticatedRequest extends Request {
    user?: {
      email: string;
    };
  }