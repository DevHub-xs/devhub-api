import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevHub API',
      version: '1.0.0',
      description: 'Internal Developer Portal API - A microservices-based API for managing development services, tools, and user authentication',
      contact: {
        name: 'DevHub Team',
        email: 'support@devhub.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.devhub.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Services',
        description: 'Service catalog endpoints'
      },
      {
        name: 'Tools',
        description: 'Developer tools endpoints'
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/index.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
