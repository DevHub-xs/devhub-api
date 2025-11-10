# Deployment Guide

## Deployment Options

### Option 1: Docker Compose (Development)
```bash
cd .devhub/deployment/development/docker
docker-compose up -d
```

### Option 2: Kubernetes (Cert/Prod)
```bash
# Certification
kubectl apply -f .devhub/deployment/certification/kubernetes/

# Production
kubectl apply -f .devhub/deployment/production/kubernetes/
```

### Option 3: Render.com
Push to appropriate branch:
- Certification: `certification` branch
- Production: `main` branch (with manual trigger)

### Option 4: AWS ECS
```bash
# Deploy task definition
aws ecs register-task-definition \
  --cli-input-json file://.devhub/deployment/production/aws/ecs-task-definition.json
```

## Environment-Specific Instructions

### Development
See: `.devhub/docs/development/`

### Certification
See: `.devhub/docs/certification/`

### Production
See: `.devhub/docs/production/`

## Rollback Procedures
See: `TROUBLESHOOTING.md`
