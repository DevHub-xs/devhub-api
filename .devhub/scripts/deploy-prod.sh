#!/bin/bash
# Production deployment script

set -e

echo "🚀 Deploying to Production environment..."
echo "⚠️  This will deploy to PRODUCTION. Are you sure? (yes/no)"
read confirmation

if [ "$confirmation" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Build Docker image
echo "🔨 Building production Docker image..."
docker build -f .devhub/deployment/production/docker/Dockerfile -t devhub-api:prod .

# Deploy based on target
if [ "$DEPLOY_TARGET" == "k8s" ]; then
    echo "☸️  Deploying to Kubernetes..."
    kubectl apply -f .devhub/deployment/production/kubernetes/
fi

if [ "$DEPLOY_TARGET" == "aws" ]; then
    echo "☁️  Deploying to AWS ECS..."
    # Add AWS deployment logic here
    echo "AWS deployment requires additional setup"
fi

echo "✅ Production deployment complete!"
