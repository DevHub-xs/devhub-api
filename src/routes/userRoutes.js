import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { authLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import { userValidation, validate } from '../middleware/validator.js';
import userService from '../services/user-management/userService.js';
import { successResponse } from '../utils/response.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Public routes
router.post(
  '/register',
  registerLimiter,
  userValidation.register,
  validate,
  asyncHandler(async (req, res) => {
    const result = await userService.register(req.body);
    res.status(201).json(successResponse(result, 'User registered successfully', 201));
  })
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/login',
  authLimiter,
  userValidation.login,
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(successResponse(result, 'Login successful'));
  })
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
// Protected routes
router.get(
  '/profile',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user._id);
    res.json(successResponse(user, 'Profile retrieved successfully'));
  })
);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/profile',
  authenticate,
  userValidation.update,
  validate,
  asyncHandler(async (req, res) => {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.json(successResponse(user, 'Profile updated successfully'));
  })
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve all users with pagination
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
// Admin routes
router.get(
  '/',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const result = await userService.getAllUsers(req.query);
    res.json(successResponse(result, 'Users retrieved successfully'));
  })
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const user = await userService.deleteUser(req.params.id);
    res.json(successResponse(user, 'User deleted successfully'));
  })
);

router.patch(
  '/:id/toggle-status',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const user = await userService.toggleUserStatus(req.params.id);
    res.json(successResponse(user, 'User status updated successfully'));
  })
);

export default router;
