const environments = {
  development: {
    PORT: 3000,
    API_URL: 'http://localhost:3000',
    DB_URL: 'mongodb://localhost:27017/devhub',
  },
  certification: {
    PORT: process.env.PORT || 3000,
    API_URL: process.env.API_URL,
    DB_URL: process.env.DB_URL,
  },
  production: {
    PORT: process.env.PORT || 3000,
    API_URL: process.env.API_URL,
    DB_URL: process.env.DB_URL,
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = environments[env];