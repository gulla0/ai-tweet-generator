import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const config = {
  port: process.env.PORT || 4000,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  model: process.env.MODEL || 'claude-3-5-sonnet-20240620',
  auth: {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  },
  paths: {
    data: dataDir,
    transcripts: path.join(dataDir, 'transcripts.json'),
    tweets: path.join(dataDir, 'tweets.json'),
  },
}; 