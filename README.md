# DevHub API - Internal Developer Portal

A comprehensive Node.js + Express API for managing an Internal Developer Portal with microservices architecture. Built with MongoDB, Mongoose, JWT authentication, and organized services for user management, service catalog, and developer tools integration.

## 🚀 Features

- **Microservices Architecture**: Organized service structure for scalability
- **User Management**: Complete authentication and authorization system with JWT
- **Service Catalog**: Manage and track all your services and their dependencies
- **Developer Tools Integration**: Integrate and manage development tools (CI/CD, monitoring, etc.)
- **Security**: Helmet, CORS, rate limiting, and JWT authentication
- **Error Handling**: Comprehensive error handling middleware
- **Validation**: Request validation using express-validator
- **Docker Support**: Full Docker and Docker Compose configuration
- **RESTful API**: Well-structured REST endpoints with proper HTTP methods

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 7.0
- Docker and Docker Compose (optional)

## 🛠️ Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/DevHub-xs/devhub-api.git
cd devhub-api
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start services using Docker Compose:
```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000`

### Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/DevHub-xs/devhub-api.git
cd devhub-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Ensure MongoDB is running locally or update MONGODB_URI in .env

5. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔧 Configuration

Environment variables (see `.env.example`):

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://mongodb:27017/devhub

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=*
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### User Management (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/register` | Register new user | No |
| POST | `/users/login` | Login user | No |
| GET | `/users/profile` | Get current user profile | Yes |
| PUT | `/users/profile` | Update user profile | Yes |
| GET | `/users` | Get all users | Yes (Admin) |
| DELETE | `/users/:id` | Delete user | Yes (Admin) |
| PATCH | `/users/:id/toggle-status` | Toggle user status | Yes (Admin) |

**Example: Register User**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "developer1",
    "email": "dev@example.com",
    "password": "secure123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Example: Login**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@example.com",
    "password": "secure123"
  }'
```

#### Service Catalog (`/api/services`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/services` | Get all services | No |
| GET | `/services/:id` | Get service by ID | No |
| GET | `/services/stats/overview` | Get service statistics | No |
| POST | `/services` | Create new service | Yes |
| PUT | `/services/:id` | Update service | Yes (Owner) |
| DELETE | `/services/:id` | Delete service | Yes (Owner) |
| POST | `/services/:id/endpoints` | Add endpoint to service | Yes (Owner) |
| PATCH | `/services/:id/health` | Update health check | Yes |
| POST | `/services/:id/dependencies/:depId` | Add dependency | Yes (Owner) |
| DELETE | `/services/:id/dependencies/:depId` | Remove dependency | Yes (Owner) |

**Example: Create Service**
```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "User Service",
    "description": "Manages user data and authentication",
    "type": "api",
    "version": "1.0.0",
    "team": "Platform Team"
  }'
```

#### Developer Tools (`/api/tools`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tools` | Get all tools | No |
| GET | `/tools/:id` | Get tool by ID | No |
| GET | `/tools/category/:category` | Get tools by category | No |
| GET | `/tools/stats/overview` | Get tool statistics | No |
| POST | `/tools` | Create new tool | Yes (Admin) |
| PUT | `/tools/:id` | Update tool | Yes (Admin) |
| DELETE | `/tools/:id` | Delete tool | Yes (Admin) |
| POST | `/tools/:id/integrations` | Add integration | Yes |
| PUT | `/tools/:id/integrations/:serviceId` | Update integration | Yes |
| DELETE | `/tools/:id/integrations/:serviceId` | Remove integration | Yes |
| PATCH | `/tools/:id/toggle-status` | Toggle tool status | Yes (Admin) |

**Example: Create Developer Tool**
```bash
curl -X POST http://localhost:3000/api/tools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Jenkins",
    "description": "CI/CD automation server",
    "category": "ci-cd",
    "provider": "Jenkins",
    "url": "https://jenkins.example.com"
  }'
```

### Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🏗️ Project Structure

```
devhub-api/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB configuration
│   │   └── index.js      # Main config
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── errorHandler.js  # Error handling
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── validator.js     # Request validation
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── DeveloperTool.js
│   │   └── index.js
│   ├── routes/          # API routes
│   │   ├── userRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── developerToolRoutes.js
│   │   └── index.js
│   ├── services/        # Business logic (microservices)
│   │   ├── user-management/
│   │   │   └── userService.js
│   │   ├── service-catalog/
│   │   │   └── serviceCatalogService.js
│   │   └── developer-tools/
│   │       └── developerToolService.js
│   ├── utils/           # Utility functions
│   │   ├── jwt.js
│   │   └── response.js
│   └── index.js         # Application entry point
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password encryption
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Protect against brute force attacks
- **Input Validation**: Express-validator for request validation
- **Role-based Access Control**: Admin, developer, and user roles

## 🚦 Rate Limiting

- **API Endpoints**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Registration**: 3 requests per hour

## 🧪 Testing

```bash
npm test
```

## 📝 Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with auto-reload
npm test        # Run tests
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Remove volumes (clean database)
docker-compose down -v
```

## 📊 Health Check

Check if the API is running:
```bash
curl http://localhost:3000/api/health
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please open an issue in the GitHub repository.

## 🎯 Roadmap

- [ ] Add comprehensive unit and integration tests
- [ ] Implement API documentation with Swagger/OpenAPI
- [ ] Add WebSocket support for real-time updates
- [ ] Implement audit logging
- [ ] Add metrics and monitoring integration
- [ ] Implement caching with Redis
- [ ] Add GraphQL API support
- [ ] Implement event-driven architecture with message queues

## 👥 Authors

DevHub Team

---

**Built with ❤️ for developers, by developers**