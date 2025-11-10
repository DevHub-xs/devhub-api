# Troubleshooting Guide

## Common Issues

### Deployment Failures

#### Issue: Container won't start
**Check:**
- Environment variables are set correctly
- MongoDB connection string is valid
- Required secrets are configured

#### Issue: Health check failing
**Check:**
- `/health` endpoint is accessible
- Application is listening on correct port (3000)
- MongoDB connection is established

### Rollback Procedures

#### Kubernetes Rollback
```bash
kubectl rollout undo deployment/devhub-api-prod -n devhub-prod
```

#### Docker Rollback
```bash
docker-compose down
docker-compose up -d --force-recreate
```

### Logs Access

#### Kubernetes Logs
```bash
kubectl logs -f deployment/devhub-api-prod -n devhub-prod
```

#### Docker Logs
```bash
docker-compose logs -f api
```

## Support
Contact: DevOps team
