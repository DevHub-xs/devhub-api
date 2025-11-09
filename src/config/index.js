import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/devhub',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/devhub-test',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-secret-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

export default config;
