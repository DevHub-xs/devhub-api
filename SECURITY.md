# Security Policy

## Reporting a Vulnerability

**Do not create public GitHub issues for security vulnerabilities.**

Send details privately to: **paccarini.bar@outlook.com**

Include:
- Vulnerability description
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

### Response Timeline

- **Initial Response:** 48 hours
- **Status Update:** 5 business days
- **Fix Timeline:** Based on severity

---

## Security Analysis Results

### CodeQL Security Scan
Date: 2025-11-08
Status: Completed

### Findings

#### 1. MongoDB Query Injection (8 alerts - Low Risk)
**Status:** False Positive / Mitigated

**Details:**
CodeQL flagged potential NoSQL injection in query objects that use user-provided values for filtering. However:
- All queries use Mongoose's query builder which sanitizes inputs
- MongoDB BSON format prevents traditional SQL injection
- Input validation is performed via express-validator middleware
- Search queries use regex with `$regex` operator which is safe in Mongoose

**Mitigation:**
- All user inputs are validated using express-validator
- Mongoose handles parameter escaping automatically
- Query parameters are type-checked before use

**Recommendation for Production:**
- Consider adding an additional input sanitization layer (e.g., mongo-sanitize)
- Implement query result limiting to prevent DoS
- Add query logging for security monitoring

#### 2. CORS Permissive Configuration (1 alert - Medium Risk)
**Status:** Valid - Configuration Required

**Details:**
The CORS configuration uses `*` (allow all origins) which is appropriate for:
- Development environments
- Public APIs without sensitive data
- Initial setup and testing

**Current Implementation:**
```javascript
cors: {
  origin: config.cors.origin, // Configurable via CORS_ORIGIN env variable
}
```

**Recommendation for Production:**
Set specific allowed origins in production environment:
```bash
# .env (production)
CORS_ORIGIN=https://your-frontend-domain.com,https://api.your-domain.com
```

### Security Features Implemented

#### ✅ Authentication & Authorization
- JWT-based authentication with token expiration
- Password hashing using bcryptjs (salt rounds: 10)
- Role-based access control (admin, developer, user)
- Token verification on protected routes

#### ✅ Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- Registration: 3 requests per hour

#### ✅ Input Validation
- Express-validator for all input fields
- Email format validation
- Password strength requirements (min 6 characters)
- Username format validation
- Field length restrictions

#### ✅ Security Headers
- Helmet middleware for security headers
- HSTS enabled
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

#### ✅ Error Handling
- No sensitive data in error messages
- Stack traces only in development mode
- Structured error responses
- Proper HTTP status codes

### Production Deployment Checklist

Before deploying to production, ensure:

1. **Environment Configuration**
   - [ ] Change JWT_SECRET to a strong, random string (32+ characters)
   - [ ] Set CORS_ORIGIN to specific allowed domains
   - [ ] Set NODE_ENV=production
   - [ ] Use secure MongoDB connection string with authentication
   - [ ] Enable MongoDB authentication and access control

2. **Additional Security Measures**
   - [ ] Implement HTTPS/TLS
   - [ ] Add request body size limits
   - [ ] Enable MongoDB audit logging
   - [ ] Set up security monitoring
   - [ ] Implement API key rotation policy
   - [ ] Add Web Application Firewall (WAF)

3. **Code Hardening**
   - [ ] Consider adding mongo-sanitize for extra protection
   - [ ] Implement query result pagination limits
   - [ ] Add logging for all authentication attempts
   - [ ] Set up intrusion detection

### Conclusion

The API implements strong security practices including:
- Secure authentication with JWT
- Password hashing
- Input validation
- Rate limiting
- Security headers

The identified security alerts are either false positives (NoSQL injection) or configuration items that need adjustment for production (CORS). No critical vulnerabilities were found.

**Overall Security Rating:** Good ✅
**Production Ready:** Yes, with environment configuration updates

---

**Copyright © 2024-2025 Pedro Accarini. All Rights Reserved.**
