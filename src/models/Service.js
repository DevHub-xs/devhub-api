import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['api', 'web', 'mobile', 'library', 'tool', 'infrastructure'],
    required: [true, 'Service type is required'],
  },
  status: {
    type: String,
    enum: ['active', 'deprecated', 'maintenance', 'planned'],
    default: 'active',
  },
  version: {
    type: String,
    required: [true, 'Service version is required'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Service owner is required'],
  },
  team: {
    type: String,
    trim: true,
  },
  repository: {
    url: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      default: 'main',
    },
  },
  documentation: {
    url: {
      type: String,
      trim: true,
    },
    apiSpec: {
      type: String,
      trim: true,
    },
  },
  endpoints: [{
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
    path: String,
    description: String,
  }],
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  healthCheck: {
    url: String,
    interval: {
      type: Number,
      default: 60, // seconds
    },
    lastCheck: Date,
    status: {
      type: String,
      enum: ['healthy', 'unhealthy', 'unknown'],
      default: 'unknown',
    },
  },
  metrics: {
    uptime: {
      type: Number,
      default: 100, // percentage
    },
    responseTime: {
      type: Number, // in milliseconds
    },
    requestCount: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Index for better query performance
serviceSchema.index({ name: 1, type: 1 });
serviceSchema.index({ owner: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ tags: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
