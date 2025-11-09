import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { serviceValidation, validate } from '../middleware/validator.js';
import serviceCatalogService from '../services/service-catalog/serviceCatalogService.js';
import { successResponse } from '../utils/response.js';

const router = express.Router();

// Get all services (public)
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await serviceCatalogService.getAllServices(req.query);
    res.json(successResponse(result, 'Services retrieved successfully'));
  })
);

// Get service by ID (public)
router.get(
  '/:id',
  serviceValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const service = await serviceCatalogService.getServiceById(req.params.id);
    res.json(successResponse(service, 'Service retrieved successfully'));
  })
);

// Get service statistics
router.get(
  '/stats/overview',
  asyncHandler(async (req, res) => {
    const stats = await serviceCatalogService.getServiceStats();
    res.json(successResponse(stats, 'Service statistics retrieved successfully'));
  })
);

// Create service (authenticated)
router.post(
  '/',
  authenticate,
  serviceValidation.create,
  validate,
  asyncHandler(async (req, res) => {
    const service = await serviceCatalogService.createService(req.body, req.user._id);
    res.status(201).json(successResponse(service, 'Service created successfully', 201));
  })
);

// Update service (owner only)
router.put(
  '/:id',
  authenticate,
  serviceValidation.id,
  serviceValidation.update,
  validate,
  asyncHandler(async (req, res) => {
    const service = await serviceCatalogService.updateService(
      req.params.id,
      req.body,
      req.user._id
    );
    res.json(successResponse(service, 'Service updated successfully'));
  })
);

// Delete service (owner only)
router.delete(
  '/:id',
  authenticate,
  serviceValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const service = await serviceCatalogService.deleteService(
      req.params.id,
      req.user._id
    );
    res.json(successResponse(service, 'Service deleted successfully'));
  })
);

// Add endpoint to service
router.post(
  '/:id/endpoints',
  authenticate,
  serviceValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const service = await serviceCatalogService.addEndpoint(
      req.params.id,
      req.body,
      req.user._id
    );
    res.json(successResponse(service, 'Endpoint added successfully'));
  })
);

// Update health check
router.patch(
  '/:id/health',
  authenticate,
  serviceValidation.id,
  validate,
  asyncHandler(async (req, res) => {
    const service = await serviceCatalogService.updateHealthCheck(
      req.params.id,
      req.body
    );
    res.json(successResponse(service, 'Health check updated successfully'));
  })
);

// Add dependency
router.post(
  '/:id/dependencies/:dependencyId',
  authenticate,
  asyncHandler(async (req, res) => {
    const service = await serviceCatalogService.addDependency(
      req.params.id,
      req.params.dependencyId,
      req.user._id
    );
    res.json(successResponse(service, 'Dependency added successfully'));
  })
);

// Remove dependency
router.delete(
  '/:id/dependencies/:dependencyId',
  authenticate,
  asyncHandler(async (req, res) => {
    const service = await serviceCatalogService.removeDependency(
      req.params.id,
      req.params.dependencyId,
      req.user._id
    );
    res.json(successResponse(service, 'Dependency removed successfully'));
  })
);

export default router;
