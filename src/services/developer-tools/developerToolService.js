import { DeveloperTool } from '../../models/index.js';
import { AppError } from '../../middleware/errorHandler.js';

class DeveloperToolService {
  // Create new developer tool
  async createTool(toolData) {
    const tool = await DeveloperTool.create(toolData);
    return tool;
  }

  // Get all developer tools
  async getAllTools(query = {}) {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      search,
      tags,
    } = query;

    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tools, total] = await Promise.all([
      DeveloperTool.find(filter)
        .populate('integrations.service', 'name type')
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 }),
      DeveloperTool.countDocuments(filter),
    ]);

    return {
      tools,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get tool by ID
  async getToolById(toolId) {
    const tool = await DeveloperTool.findById(toolId)
      .populate('integrations.service', 'name type version owner');

    if (!tool) {
      throw new AppError('Developer tool not found', 404);
    }

    return tool;
  }

  // Update tool
  async updateTool(toolId, updates) {
    const tool = await DeveloperTool.findByIdAndUpdate(
      toolId,
      updates,
      { new: true, runValidators: true }
    );

    if (!tool) {
      throw new AppError('Developer tool not found', 404);
    }

    return tool;
  }

  // Delete tool
  async deleteTool(toolId) {
    const tool = await DeveloperTool.findByIdAndDelete(toolId);

    if (!tool) {
      throw new AppError('Developer tool not found', 404);
    }

    return tool;
  }

  // Add integration to tool
  async addIntegration(toolId, integrationData) {
    const tool = await DeveloperTool.findById(toolId);

    if (!tool) {
      throw new AppError('Developer tool not found', 404);
    }

    // Check if integration already exists
    const existingIntegration = tool.integrations.find(
      int => int.service.toString() === integrationData.service
    );

    if (existingIntegration) {
      throw new AppError('Integration already exists for this service', 400);
    }

    tool.integrations.push(integrationData);
    await tool.save();

    return await tool.populate('integrations.service', 'name type');
  }

  // Update integration
  async updateIntegration(toolId, serviceId, updates) {
    const tool = await DeveloperTool.findById(toolId);

    if (!tool) {
      throw new AppError('Developer tool not found', 404);
    }

    const integration = tool.integrations.find(
      int => int.service.toString() === serviceId
    );

    if (!integration) {
      throw new AppError('Integration not found', 404);
    }

    Object.assign(integration, updates);
    await tool.save();

    return tool;
  }

  // Remove integration
  async removeIntegration(toolId, serviceId) {
    const tool = await DeveloperTool.findById(toolId);

    if (!tool) {
      throw new AppError('Developer tool not found', 404);
    }

    tool.integrations = tool.integrations.filter(
      int => int.service.toString() !== serviceId
    );
    await tool.save();

    return tool;
  }

  // Get tools by category
  async getToolsByCategory(category) {
    const tools = await DeveloperTool.find({
      category,
      status: 'active',
    }).sort({ name: 1 });

    return tools;
  }

  // Get tool statistics
  async getToolStats() {
    const stats = await DeveloperTool.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    const categoryStats = await DeveloperTool.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = await DeveloperTool.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      total: stats[0]?.total || 0,
      byCategory: categoryStats.map(s => ({ category: s._id, count: s.count })),
      byStatus: statusStats.map(s => ({ status: s._id, count: s.count })),
    };
  }

  // Toggle tool status
  async toggleToolStatus(toolId) {
    const tool = await DeveloperTool.findById(toolId);

    if (!tool) {
      throw new AppError('Developer tool not found', 404);
    }

    tool.status = tool.status === 'active' ? 'inactive' : 'active';
    await tool.save();

    return tool;
  }
}

export default new DeveloperToolService();
