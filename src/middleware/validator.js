import { body, param, query, validationResult } from 'express-validator';

// Validation result handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  
  next();
};

// User validation rules
export const userValidation = {
  register: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters'),
  ],
  
  login: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  
  update: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters'),
    body('department')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Department cannot exceed 100 characters'),
  ],
};

// Service validation rules
export const serviceValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Service name is required')
      .isLength({ max: 100 })
      .withMessage('Service name cannot exceed 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Service description is required'),
    body('type')
      .isIn(['api', 'web', 'mobile', 'library', 'tool', 'infrastructure'])
      .withMessage('Invalid service type'),
    body('version')
      .trim()
      .notEmpty()
      .withMessage('Service version is required'),
    body('team')
      .optional()
      .trim(),
  ],
  
  update: [
    body('description')
      .optional()
      .trim(),
    body('type')
      .optional()
      .isIn(['api', 'web', 'mobile', 'library', 'tool', 'infrastructure'])
      .withMessage('Invalid service type'),
    body('status')
      .optional()
      .isIn(['active', 'deprecated', 'maintenance', 'planned'])
      .withMessage('Invalid service status'),
    body('version')
      .optional()
      .trim(),
  ],
  
  id: [
    param('id')
      .isMongoId()
      .withMessage('Invalid service ID'),
  ],
};

// Developer tool validation rules
export const developerToolValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Tool name is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Tool description is required'),
    body('category')
      .isIn(['ci-cd', 'monitoring', 'logging', 'testing', 'security', 'collaboration', 'deployment', 'other'])
      .withMessage('Invalid tool category'),
    body('url')
      .optional()
      .trim()
      .isURL()
      .withMessage('Invalid URL'),
  ],
  
  update: [
    body('description')
      .optional()
      .trim(),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'deprecated'])
      .withMessage('Invalid status'),
    body('url')
      .optional()
      .trim()
      .isURL()
      .withMessage('Invalid URL'),
  ],
  
  id: [
    param('id')
      .isMongoId()
      .withMessage('Invalid tool ID'),
  ],
};
