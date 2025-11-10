#!/bin/bash
# Development deployment script

set -e

echo "🚀 Deploying to Development environment..."

# Load environment variables
if [ -f .env.development ]; then
    export $(cat .env.development | grep -v '^#' | xargs)
else
    echo "❌ .env.development not found!"
    exit 1
fi

# Start services
echo "📦 Starting Docker containers..."
cd .devhub/deployment/development/docker
docker-compose up -d

echo "✅ Development deployment complete!"
echo "🌐 API running at http://localhost:3000"
