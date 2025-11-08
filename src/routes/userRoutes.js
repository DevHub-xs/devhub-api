import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { authLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import { userValidation, validate } from '../middleware/validator.js';
import userService from '../services/user-management/userService.js';
import { successResponse } from '../utils/response.js';

const router = express.Router();

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

// Protected routes
router.get(
  '/profile',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user._id);
    res.json(successResponse(user, 'Profile retrieved successfully'));
  })
);

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
