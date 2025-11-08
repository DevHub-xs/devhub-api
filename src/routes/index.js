import express from 'express';
import userRoutes from './userRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import developerToolRoutes from './developerToolRoutes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DevHub API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DevHub API - Internal Developer Portal',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      services: '/api/services',
      tools: '/api/tools',
      health: '/api/health',
    },
  });
});

// Mount routes
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/tools', developerToolRoutes);

export default router;
