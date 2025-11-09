import { Service } from '../../models/index.js';
import { AppError } from '../../middleware/errorHandler.js';

class ServiceCatalogService {
  // Create new service
  async createService(serviceData, ownerId) {
    const service = await Service.create({
      ...serviceData,
      owner: ownerId,
    });

    return await service.populate('owner', 'username email firstName lastName');
  }

  // Get all services
  async getAllServices(query = {}) {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      owner,
      search,
      tags,
    } = query;

    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (owner) filter.owner = owner;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { team: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate('owner', 'username email firstName lastName')
        .populate('dependencies', 'name type version')
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 }),
      Service.countDocuments(filter),
    ]);

    return {
      services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get service by ID
  async getServiceById(serviceId) {
    const service = await Service.findById(serviceId)
      .populate('owner', 'username email firstName lastName')
      .populate('dependencies', 'name type version status');

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    return service;
  }

  // Update service
  async updateService(serviceId, updates, userId) {
    const service = await Service.findById(serviceId);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    // Check if user is the owner or admin
    if (service.owner.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this service', 403);
    }

    Object.assign(service, updates);
    await service.save();

    return await service.populate('owner', 'username email firstName lastName');
  }

  // Delete service
  async deleteService(serviceId, userId) {
    const service = await Service.findById(serviceId);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    // Check if user is the owner
    if (service.owner.toString() !== userId.toString()) {
      throw new AppError('Not authorized to delete this service', 403);
    }

    await service.deleteOne();
    return service;
  }

  // Add endpoint to service
  async addEndpoint(serviceId, endpointData, userId) {
    const service = await Service.findById(serviceId);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (service.owner.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this service', 403);
    }

    service.endpoints.push(endpointData);
    await service.save();

    return service;
  }

  // Update health check status
  async updateHealthCheck(serviceId, healthData) {
    const service = await Service.findById(serviceId);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    service.healthCheck = {
      ...service.healthCheck,
      ...healthData,
      lastCheck: new Date(),
    };

    await service.save();
    return service;
  }

  // Get service statistics
  async getServiceStats() {
    const stats = await Service.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byType: {
            $push: {
              type: '$type',
              status: '$status',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          byType: 1,
        },
      },
    ]);

    const typeStats = await Service.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = await Service.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      total: stats[0]?.total || 0,
      byType: typeStats.map(s => ({ type: s._id, count: s.count })),
      byStatus: statusStats.map(s => ({ status: s._id, count: s.count })),
    };
  }

  // Add dependency to service
  async addDependency(serviceId, dependencyId, userId) {
    const service = await Service.findById(serviceId);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (service.owner.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this service', 403);
    }

    // Check if dependency exists
    const dependency = await Service.findById(dependencyId);
    if (!dependency) {
      throw new AppError('Dependency service not found', 404);
    }

    // Check if dependency already exists
    if (service.dependencies.includes(dependencyId)) {
      throw new AppError('Dependency already exists', 400);
    }

    service.dependencies.push(dependencyId);
    await service.save();

    return await service.populate('dependencies', 'name type version');
  }

  // Remove dependency from service
  async removeDependency(serviceId, dependencyId, userId) {
    const service = await Service.findById(serviceId);

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (service.owner.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this service', 403);
    }

    service.dependencies = service.dependencies.filter(
      dep => dep.toString() !== dependencyId
    );
    await service.save();

    return service;
  }
}

export default new ServiceCatalogService();
