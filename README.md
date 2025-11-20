# DevHub API

> Enterprise-grade Node.js API for Developer Hub Portal.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com)

---

## 🚀 Quick Start

### Manual Setup

```bash
npm install
cp .env.example .env
npm run dev
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

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Production server |
| `npm run dev` | Development with auto-reload |
| `npm test` | Run test suite |

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
