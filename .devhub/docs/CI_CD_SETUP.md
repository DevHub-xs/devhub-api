# CI/CD Setup Guide

## Overview
This document describes the CI/CD pipeline configuration for DevHub API.

## Pipeline Stages

### Development
- **Trigger**: Push to `development` branch
- **Steps**: Build → Test → Deploy to dev environment
- **Auto-deploy**: Yes

### Certification
- **Trigger**: Push to `certification` branch or manual dispatch
- **Steps**: Build → Test → Security scan → Deploy to cert environment
- **Auto-deploy**: Yes (with approval)

### Production
- **Trigger**: Git tags (v*.*.*) or manual dispatch
- **Steps**: Build → Test → Security audit → Deploy to production
- **Auto-deploy**: No (manual approval required)

## GitHub Actions Setup

1. Navigate to repository Settings → Secrets and variables → Actions
2. Add required secrets:
   - `MONGODB_URI_CERT`
   - `MONGODB_URI_PROD`
   - `JWT_SECRET_CERT`
   - `JWT_SECRET_PROD`
   - Cloud provider credentials (AWS, Render, etc.)

## Workflows Location
`.devhub/ci/{environment}/github-actions.yml`

## Next Steps
- Configure secrets in GitHub
- Test workflows with pull requests
- Set up branch protection rules
