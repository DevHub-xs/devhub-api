# DevHub API

> Enterprise-grade Node.js API for Internal Developer Portal with microservices architecture.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com)

**Production-ready REST API with JWT authentication, service catalog, and developer tools management.**

---

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
cp .env.example .env
docker-compose up -d
```

API available at `http://localhost:3000`

### Manual Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## ✨ Features

- 🔐 **JWT Authentication** with role-based access control
- 📦 **Service Catalog** management
- 🛠️ **Developer Tools** integration
- 🔒 **Security**: Helmet, CORS, rate limiting
- ✅ **Input Validation** with express-validator
- 🐳 **Docker** support with compose
- 🏗️ **Microservices** architecture

## 📚 API Overview

### Core Endpoints

**Authentication**
```bash
POST /api/users/register
POST /api/users/login
GET  /api/users/profile (Protected)
```

**Service Catalog**
```bash
GET    /api/services
POST   /api/services (Protected)
PUT    /api/services/:id (Protected)
DELETE /api/services/:id (Protected)
```

**Developer Tools**
```bash
GET    /api/tools
POST   /api/tools (Admin)
PATCH  /api/tools/:id/toggle-status (Admin)
```

### Example Request

```bash
# Register user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "developer",
    "email": "dev@example.com",
    "password": "secure123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## 🏗️ Architecture

A comprehensive Node.js + Express API for managing an Internal Developer Portal with microservices architecture. Built with MongoDB, Mongoose, JWT authentication, and organized services for user management, service catalog, and developer tools integration.

```
src/
├── config/        # Configuration (database, env)
├── middleware/    # Auth, validation, error handling
├── models/        # Mongoose schemas
├── routes/        # API route definitions
├── services/      # Business logic (microservices)
└── utils/         # Helper functions
```

## 🔒 Security

- **JWT** token-based authentication
- **Bcrypt** password hashing
- **Rate limiting** on all endpoints
- **Helmet** security headers
- **Input validation** on all requests
- **RBAC** (Role-Based Access Control)

### Rate Limits
- API: 100 req/15min
- Auth: 5 req/15min
- Register: 3 req/hour

## ⚙️ Configuration

Required environment variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/devhub
JWT_SECRET=your-secure-secret-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-domain.com
```

## 🐳 Docker Commands

```bash
docker-compose up -d          # Start services
docker-compose logs -f        # View logs
docker-compose down           # Stop services
docker-compose down -v        # Remove volumes
```

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Production server |
| `npm run dev` | Development with auto-reload |
| `npm test` | Run test suite |

## 📊 Health Check

```bash
curl http://localhost:3000/api/health
```

## 📄 License

**Copyright © 2024-2025 Pedro Accarini. All Rights Reserved.**

This is proprietary software. See [LICENSE](./LICENSE) for details.

## 👤 Author

**Pedro Accarini**
- Email: paccarini.bar@outlook.com

## 🔐 Security

See [SECURITY.md](./SECURITY.md) for reporting vulnerabilities.

---

Built with ❤️ for developers