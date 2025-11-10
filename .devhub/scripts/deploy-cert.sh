#!/bin/bash
# Certification deployment script

set -e

echo "🚀 Deploying to Certification environment..."

# Build Docker image
echo "🔨 Building Docker image..."
docker build -f .devhub/deployment/certification/docker/Dockerfile -t devhub-api:cert .

# Option 1: Deploy to Kubernetes
if [ "$DEPLOY_TARGET" == "k8s" ]; then
    echo "☸️  Deploying to Kubernetes..."
    kubectl apply -f .devhub/deployment/certification/kubernetes/
fi

# Option 2: Deploy to Render
if [ "$DEPLOY_TARGET" == "render" ]; then
    echo "🎨 Deploying to Render..."
    # Render auto-deploys from git
    echo "Push to certification branch to trigger Render deployment"
fi

echo "✅ Certification deployment initiated!"
