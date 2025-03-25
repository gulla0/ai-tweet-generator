import express from 'express';
import { authenticate } from '../core/auth';

const router = express.Router();

router.post('/login', (req, res) => {
  const isAuthenticated = authenticate(req, res);
  
  if (isAuthenticated) {
    res.json({ success: true, token: 'admin' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

export default router; 