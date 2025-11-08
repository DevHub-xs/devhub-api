import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { developerToolValidation, validate } from '../middleware/validator.js';
import developerToolService from '../services/developer-tools/developerToolService.js';
import { successResponse } from '../utils/response.js';

const router = express.Router();

// Get all developer tools (public)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await developerToolService.getAllTools(req.query);
    res.json(successResponse(result, 'Developer tools retrieved successfully'));
  })
);

// Get tool by ID (public)
router.get(
  '/:id',
  developerToolValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const tool = await developerToolService.getToolById(req.params.id);
    res.json(successResponse(tool, 'Developer tool retrieved successfully'));
  })
);

// Get tools by category
router.get(
  '/category/:category',
  asyncHandler(async (req, res) => {
    const tools = await developerToolService.getToolsByCategory(req.params.category);
    res.json(successResponse(tools, 'Tools retrieved successfully'));
  })
);

// Get tool statistics
router.get(
  '/stats/overview',
  asyncHandler(async (req, res) => {
    const stats = await developerToolService.getToolStats();
    res.json(successResponse(stats, 'Tool statistics retrieved successfully'));
  })
);

// Create tool (admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  developerToolValidation.create,
  validate,
  asyncHandler(async (req, res) => {
    const tool = await developerToolService.createTool(req.body);
    res.status(201).json(successResponse(tool, 'Developer tool created successfully', 201));
  })
);

// Update tool (admin only)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  developerToolValidation.id,
  developerToolValidation.update,
  validate,
  asyncHandler(async (req, res) => {
    const tool = await developerToolService.updateTool(req.params.id, req.body);
    res.json(successResponse(tool, 'Developer tool updated successfully'));
  })
);

// Delete tool (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  developerToolValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const tool = await developerToolService.deleteTool(req.params.id);
    res.json(successResponse(tool, 'Developer tool deleted successfully'));
  })
);

// Add integration (authenticated)
router.post(
  '/:id/integrations',
  authenticate,
  developerToolValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const tool = await developerToolService.addIntegration(req.params.id, req.body);
    res.json(successResponse(tool, 'Integration added successfully'));
  })
);

// Update integration (authenticated)
router.put(
  '/:id/integrations/:serviceId',
  authenticate,
  developerToolValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const tool = await developerToolService.updateIntegration(
      req.params.id,
      req.params.serviceId,
      req.body
    );
    res.json(successResponse(tool, 'Integration updated successfully'));
  })
);

// Remove integration (authenticated)
router.delete(
  '/:id/integrations/:serviceId',
  authenticate,
  developerToolValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const tool = await developerToolService.removeIntegration(
      req.params.id,
      req.params.serviceId
    );
    res.json(successResponse(tool, 'Integration removed successfully'));
  })
);

// Toggle tool status (admin only)
router.patch(
  '/:id/toggle-status',
  authenticate,
  authorize('admin'),
  developerToolValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const tool = await developerToolService.toggleToolStatus(req.params.id);
    res.json(successResponse(tool, 'Tool status updated successfully'));
  })
);

export default router;
