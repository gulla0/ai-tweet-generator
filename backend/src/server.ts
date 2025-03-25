import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import authRoutes from './routes/auth';
import transcriptRoutes from './routes/transcripts';

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '5mb' })); // Parse JSON bodies with increased limit for large transcripts

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transcripts', transcriptRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 