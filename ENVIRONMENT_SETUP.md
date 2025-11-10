# Environment Configuration Guide

This document describes the environment configuration setup for the DevHub project (frontend and backend).

## Overview

The DevHub project supports three distinct environments:
- **Development** - Local development and testing
- **Certification** - Pre-production validation and UAT
- **Production** - Live production deployment

---

## Frontend (devhub-portal)

### Environment Files

Located in `src/environments/`:

| File | Purpose | API URL |
|------|---------|---------|
| `environment.ts` | Default (development) | `http://localhost:3000` |
| `environment.development.ts` | Development | `http://localhost:3000` |
| `environment.certification.ts` | Certification | `https://api-cert.devhub.example.com` |
| `environment.production.ts` | Production | `https://api.devhub.example.com` |

### Environment Configuration Properties

```typescript
{
  production: boolean;           // Is production mode
  envName: string;               // Environment name
  apiUrl: string;                // Backend API base URL
  apiTimeout: number;            // API request timeout (ms)
  enableDebugTools: boolean;     // Enable Angular debug tools
  logLevel: string;              // Logging level (debug/info/error)
  features: {
    analytics: boolean;          // Enable analytics
    errorReporting: boolean;     // Enable error reporting
    advancedLogging: boolean;    // Enable detailed logs
  }
}
```

### Running Frontend

**[Terminals | terminal 2 — PowerShell | cwd=C:\Projects\DevHub-Project\devhub-portal]:**

```powershell
# Development (default)
npm start
# or
npm run start:dev

# Certification
npm run start:cert

# Production
npm run start:prod
```

### Building Frontend

**[Terminals | terminal 2 — PowerShell | cwd=C:\Projects\DevHub-Project\devhub-portal]:**

```powershell
# Development build
npm run build:dev

# Certification build
npm run build:cert

# Production build
npm run build:prod
# or
npm run build
```

---

## Backend (devhub-api)

### Environment Files

Located in root directory:

| File | Purpose | Database |
|------|---------|----------|
| `.env` | Current/default | MongoDB Atlas (dev) |
| `.env.development` | Development | MongoDB Atlas (dev database) |
| `.env.certification` | Certification | MongoDB Atlas (cert database) |
| `.env.production` | Production | To be configured |

### Environment Variables

#### Server Configuration
```bash
NODE_ENV=development|certification|production
PORT=3000
HOST=localhost|0.0.0.0
```

#### Database Configuration
```bash
MONGODB_URI=<connection-string>
MONGODB_TEST_URI=<test-connection-string>
```

#### JWT Configuration
```bash
JWT_SECRET=<secret-key>
JWT_EXPIRES_IN=24h|12h|8h
JWT_REFRESH_SECRET=<refresh-secret>
JWT_REFRESH_EXPIRES_IN=7d
```

#### Security & Performance
```bash
RATE_LIMIT_WINDOW_MS=900000     # 15 min (dev), 5 min (prod)
RATE_LIMIT_MAX_REQUESTS=100     # Requests per window
CORS_ORIGIN=<frontend-url>
```

#### Logging & Features
```bash
LOG_LEVEL=debug|info|error
ENABLE_REQUEST_LOGGING=true|false
ENABLE_SWAGGER=true|false
ENABLE_RATE_LIMITING=true|false
```

### Running Backend

**[Terminals | terminal 3 — PowerShell | cwd=C:\Projects\DevHub-Project\devhub-api]:**

```powershell
# Development (with auto-reload)
npm run dev
# or
npm run start:dev

# Certification
npm run start:cert

# Production
npm run start:prod
# or
npm start
```

---

## Environment-Specific Configuration

### Development Environment

**Purpose:** Local development and rapid iteration

**Frontend:**
- API: `http://localhost:3000`
- Debug tools enabled
- Detailed logging
- Source maps enabled
- Hot reload enabled

**Backend:**
- Port: 3000
- MongoDB: Dev database
- JWT expires: 24h
- Rate limiting: 100 req/15min
- Swagger enabled
- Debug logging

### Certification Environment

**Purpose:** Pre-production testing, UAT, integration testing

**Frontend:**
- API: `https://api-cert.devhub.example.com`
- Debug tools enabled (for troubleshooting)
- Info-level logging
- Source maps enabled
- Optimized build

**Backend:**
- Port: 3000
- MongoDB: Cert database
- JWT expires: 12h
- Rate limiting: 200 req/10min
- Swagger enabled
- Info logging

### Production Environment

**Purpose:** Live production deployment

**Frontend:**
- API: `https://api.devhub.example.com`
- Debug tools disabled
- Error-only logging
- Full optimization
- No source maps

**Backend:**
- Port: 3000
- MongoDB: Production database
- JWT expires: 8h
- Rate limiting: 50 req/5min
- Swagger disabled
- Error-only logging

---

## Configuration Workflow

### 1. Initial Setup

**Frontend:**
```powershell
cd C:\Projects\DevHub-Project\devhub-portal
npm install
```

**Backend:**
```powershell
cd C:\Projects\DevHub-Project\devhub-api
npm install
```

### 2. Update Environment Variables

Before deploying to certification or production:

1. **Backend**: Update `.env.certification` and `.env.production`
   - Change database connection strings
   - Set strong JWT secrets
   - Configure CORS origins
   - Set appropriate rate limits

2. **Frontend**: Update `environment.certification.ts` and `environment.production.ts`
   - Set correct API URLs
   - Configure feature flags
   - Adjust timeout values

### 3. Local Development

**Start backend:**
```powershell
# [Terminals | terminal 3 — PowerShell]
cd C:\Projects\DevHub-Project\devhub-api
npm run dev
```

**Start frontend:**
```powershell
# [Terminals | terminal 2 — PowerShell]
cd C:\Projects\DevHub-Project\devhub-portal
npm start
```

**Access:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs (if enabled)

---

## Security Considerations

### Development
- ✅ Use weak secrets (for convenience)
- ✅ Enable all debug tools
- ✅ Permissive CORS
- ✅ Detailed error messages

### Certification
- ⚠️ Use moderate security
- ⚠️ Enable monitoring
- ⚠️ Restrictive CORS
- ⚠️ Generic error messages

### Production
- 🔒 Use strong, unique secrets
- 🔒 Disable all debug tools
- 🔒 Strict CORS policies
- 🔒 No detailed errors exposed
- 🔒 Enable rate limiting
- 🔒 Use environment variables (not hardcoded)

---

## Environment File Management

### Git Strategy

**Committed to repository:**
- `.env.example`
- `environment.ts`
- `environment.*.ts` (with placeholder URLs)

**Not committed (in .gitignore):**
- `.env`
- `.env.development`
- `.env.certification`
- `.env.production`

### Deployment Strategy

1. **Development**: Developers maintain local `.env` files
2. **Certification**: Deploy with `.env.certification` via CI/CD secrets
3. **Production**: Deploy with `.env.production` via CI/CD secrets

---

## Troubleshooting

### Frontend can't connect to backend
- Verify backend is running
- Check `environment.ts` has correct `apiUrl`
- Verify CORS is configured correctly in backend `.env`

### Environment not switching
- Clear browser cache
- Rebuild with `npm run build:dev` (or cert/prod)
- Check Angular configuration in `angular.json`

### Backend using wrong environment
- Verify you're using correct npm script (`start:dev`, `start:cert`, `start:prod`)
- Check `.env.*` file exists
- Verify environment variables are loading

---

## Next Steps

1. ✅ Environment files created
2. ⏭️ Update certification/production URLs when infrastructure is ready
3. ⏭️ Connect frontend to backend APIs
4. ⏭️ Implement CI/CD pipeline with environment secrets
5. ⏭️ Set up monitoring for certification and production

---

## Quick Reference

| Task | Frontend Command | Backend Command |
|------|------------------|-----------------|
| Local dev | `npm start` | `npm run dev` |
| Build dev | `npm run build:dev` | N/A |
| Build cert | `npm run build:cert` | N/A |
| Build prod | `npm run build:prod` | N/A |
| Run cert | `npm run start:cert` | `npm run start:cert` |
| Run prod | `npm run start:prod` | `npm run start:prod` |
