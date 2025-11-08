# Production Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- MongoDB instance (or use Docker Compose)
- Domain name configured
- SSL/TLS certificate

## Quick Start with Docker

### 1. Clone the Repository

```bash
git clone https://github.com/DevHub-xs/devhub-api.git
cd devhub-api
```

### 2. Configure Environment Variables

Create a `.env` file with production settings:

```bash
# Copy the example and modify
cp .env.example .env
```

**Required Production Settings:**

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# MongoDB Configuration (Use your production MongoDB)
MONGODB_URI=mongodb://username:password@mongodb-host:27017/devhub?authSource=admin

# JWT Configuration (CHANGE THIS!)
JWT_SECRET=<generate-a-strong-random-secret-min-32-chars>
JWT_EXPIRES_IN=24h

# Rate Limiting (Adjust as needed)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration (Set to your frontend domain)
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. Generate a Strong JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### 4. Deploy with Docker Compose

```bash
# Build and start services
docker compose up -d

# Check logs
docker compose logs -f

# Check status
docker compose ps
```

### 5. Verify Deployment

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Expected response:
# {
#   "success": true,
#   "message": "DevHub API is running",
#   "timestamp": "...",
#   "uptime": ...
# }
```

## Manual Deployment (Without Docker)

### 1. Install Dependencies

```bash
npm install --production
```

### 2. Set Environment Variables

Set the required environment variables in your deployment environment.

### 3. Start the Application

```bash
# Using PM2 (Recommended)
npm install -g pm2
pm2 start src/index.js --name devhub-api

# Or using Node directly
node src/index.js
```

## Kubernetes Deployment

### 1. Create ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: devhub-api-config
data:
  NODE_ENV: "production"
  PORT: "3000"
  CORS_ORIGIN: "https://your-frontend-domain.com"
```

### 2. Create Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: devhub-api-secrets
type: Opaque
stringData:
  MONGODB_URI: "mongodb://username:password@mongodb:27017/devhub"
  JWT_SECRET: "your-strong-secret-key"
```

### 3. Create Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devhub-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: devhub-api
  template:
    metadata:
      labels:
        app: devhub-api
    spec:
      containers:
      - name: devhub-api
        image: devhub-api:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: devhub-api-config
        - secretRef:
            name: devhub-api-secrets
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 4. Create Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: devhub-api
spec:
  selector:
    app: devhub-api
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## Nginx Reverse Proxy

If you're using Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # API Location
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## MongoDB Setup

### Using Docker

Already included in `docker-compose.yml`. For production, consider:
- Using MongoDB Atlas (managed service)
- Setting up replica sets for high availability
- Enabling authentication
- Regular backups

### Production MongoDB Configuration

```yaml
mongodb:
  image: mongo:7.0
  restart: always
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: strongpassword
    MONGO_INITDB_DATABASE: devhub
  volumes:
    - mongodb_data:/data/db
  networks:
    - devhub-network
```

## Monitoring and Logging

### PM2 Monitoring

```bash
# Monitor with PM2
pm2 monit

# View logs
pm2 logs devhub-api

# View metrics
pm2 show devhub-api
```

### Docker Logs

```bash
# View logs
docker compose logs -f devhub-api

# Export logs
docker compose logs devhub-api > app.log
```

## Backup and Recovery

### MongoDB Backup

```bash
# Create backup
docker compose exec mongodb mongodump --out /backup/$(date +%Y%m%d)

# Restore backup
docker compose exec mongodb mongorestore /backup/20240101
```

### Application State

```bash
# Backup volumes
docker compose down
tar -czf devhub-backup-$(date +%Y%m%d).tar.gz mongodb_data/

# Restore
tar -xzf devhub-backup-20240101.tar.gz
docker compose up -d
```

## Scaling

### Horizontal Scaling

1. Deploy multiple instances behind a load balancer
2. Use session-less JWT authentication (already implemented)
3. Ensure MongoDB can handle increased connections
4. Consider using MongoDB replica sets

### Vertical Scaling

Update Docker Compose with resource limits:

```yaml
devhub-api:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        cpus: '1'
        memory: 1G
```

## Health Checks

The API includes a built-in health check endpoint:

```
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "DevHub API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

## Troubleshooting

### Application Won't Start

1. Check logs: `docker compose logs devhub-api`
2. Verify environment variables are set correctly
3. Ensure MongoDB is accessible
4. Check port 3000 is not in use

### Database Connection Issues

1. Verify MONGODB_URI is correct
2. Check MongoDB is running: `docker compose ps mongodb`
3. Test connection: `docker compose exec mongodb mongosh`
4. Check network connectivity

### Performance Issues

1. Check MongoDB indexes are created
2. Monitor resource usage: `docker stats`
3. Review rate limiting settings
4. Consider connection pooling adjustments

## Security Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set CORS_ORIGIN to specific domains
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS/TLS in production
- [ ] Set up firewall rules
- [ ] Enable MongoDB access control
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Implement backup strategy
- [ ] Set up monitoring and alerting

## Support

For issues or questions:
- Check logs first
- Review documentation
- Open an issue on GitHub
- Contact your DevOps team

---

**Production deployment requires careful configuration and monitoring. Always test in a staging environment first!**
