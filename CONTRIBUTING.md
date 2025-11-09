# Contributing Guidelines

## Proprietary Software Notice

This is proprietary software owned by Pedro Accarini. Contributions are only accepted from authorized contributors.

## Development Setup

1. **Prerequisites**
   - Node.js >= 18
   - MongoDB >= 7.0
   - Docker (recommended)

2. **Installation**
   ```bash
   npm install
   cp .env.example .env
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```

## Code Standards

### Node.js/Express
- Use ES6+ modules
- Implement async/await
- Follow RESTful conventions
- Write comprehensive error handling

### Database
- Use Mongoose schemas with validation
- Index frequently queried fields
- Implement soft deletes where appropriate

### Security
- Never commit secrets
- Validate all inputs
- Use parameterized queries
- Implement rate limiting

### Git Workflow
- Branch naming: `feature/`, `bugfix/`, `hotfix/`
- Commit format: `type(scope): description`
  - Types: feat, fix, docs, style, refactor, test, chore

## Pull Request Process

1. Update API documentation
2. Ensure all tests pass
3. Follow code review feedback
4. Update CHANGELOG if applicable

## Testing

```bash
npm test
```

## Questions?

Contact: paccarini.bar@outlook.com

---

**Copyright © 2024-2025 Pedro Accarini. All Rights Reserved.**
