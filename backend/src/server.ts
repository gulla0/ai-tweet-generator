// src/server.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/config';
import authRoutes from './routes/auth';
import transcriptRoutes from './routes/transcripts';
import tweetRoutes from './routes/tweets'; // Add the new tweet routes

// Initialize Express app
const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '5mb' })); // For handling large transcripts

// Static files (for production)
if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transcripts', transcriptRoutes);
app.use('/api/tweets', tweetRoutes); // Add the new tweet routes

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    environment: config.nodeEnv
  });
});

// Serve frontend in production
if (config.nodeEnv === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    message
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});