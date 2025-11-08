import express from 'express';
import userRoutes from './userRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import developerToolRoutes from './developerToolRoutes.js';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running and get uptime information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: DevHub API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 */
// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DevHub API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API information
 *     description: Get API version and available endpoints
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 version:
 *                   type: string
 *                 endpoints:
 *                   type: object
 */
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
