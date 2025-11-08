import mongoose from 'mongoose';

const developerToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tool name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Tool description is required'],
  },
  category: {
    type: String,
    enum: ['ci-cd', 'monitoring', 'logging', 'testing', 'security', 'collaboration', 'deployment', 'other'],
    required: [true, 'Tool category is required'],
  },
  provider: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  apiEndpoint: {
    type: String,
    trim: true,
  },
  authentication: {
    type: {
      type: String,
      enum: ['api-key', 'oauth', 'basic', 'none'],
      default: 'api-key',
    },
    configRequired: {
      type: Boolean,
      default: true,
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deprecated'],
    default: 'active',
  },
  integrations: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    config: mongoose.Schema.Types.Mixed,
  }],
  features: [{
    type: String,
  }],
  documentation: {
    url: String,
    setupGuide: String,
  },
  icon: {
    type: String,
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Index for better query performance
developerToolSchema.index({ name: 1, category: 1 });
developerToolSchema.index({ status: 1 });

const DeveloperTool = mongoose.model('DeveloperTool', developerToolSchema);

export default DeveloperTool;
