import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import { authValidation, validate } from '../middleware/validator.js';
import authService from '../services/auth/authService.js';
import { successResponse } from '../utils/response.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post(
  '/register',
  registerLimiter,
  authValidation.register,
  validate,
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json(successResponse(result, 'User registered successfully', 201));
  })
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  '/login',
  authLimiter,
  authValidation.login,
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(successResponse(result, 'Login successful'));
  })
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json(successResponse(result, 'Token refreshed successfully'));
  })
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    await authService.logout(req.user._id);
    res.json(successResponse(null, 'Logout successful'));
  })
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user._id);
    res.json(successResponse(user, 'User retrieved successfully'));
  })
);

/**
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch(
  '/profile',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user._id, req.body);
    res.json(successResponse(user, 'Profile updated successfully'));
  })
);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post(
  '/change-password',
  authenticate,
  authValidation.changePassword,
  validate,
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, oldPassword, newPassword);
    res.json(successResponse(null, 'Password changed successfully'));
  })
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post(
  '/forgot-password',
  authValidation.forgotPassword,
  validate,
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.json(successResponse(null, 'Password reset instructions sent to email'));
  })
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post(
  '/reset-password',
  authValidation.resetPassword,
  validate,
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json(successResponse(null, 'Password reset successful'));
  })
);

export default router;
