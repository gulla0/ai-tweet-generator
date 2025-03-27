// src/config/config.ts
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = [
  'ANTHROPIC_API_KEY',
];

// Check for required environment variables
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`Warning: Environment variable ${envVar} is not set.`);
  }
});

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Configuration object
export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Anthropic API
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  model: process.env.MODEL || 'claude-3-sonnet-20240229',
  
  // Authentication
  auth: {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key', // For future JWT implementation
    tokenExpiration: process.env.TOKEN_EXPIRATION || '24h',
  },
  
  // File paths
  paths: {
    data: dataDir,
    transcripts: path.join(dataDir, 'transcripts.json'),
    tweets: path.join(dataDir, 'tweets.json'),
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth'],
  },
};

// Export configuration
export default config;