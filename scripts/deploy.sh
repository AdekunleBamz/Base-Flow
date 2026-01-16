#!/bin/bash

echo "🚀 Starting Baseflow deployment..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t baseflow:latest .

# Stop and remove existing container
echo "🛑 Stopping existing container..."
docker stop baseflow 2>/dev/null || true
docker rm baseflow 2>/dev/null || true

# Run the container
echo "▶️  Starting new container..."
docker run -d \
  --name baseflow \
  -p 3000:3000 \
  --restart unless-stopped \
  -e NODE_ENV=production \
  baseflow:latest

echo "✅ Deployment complete!"
echo "🌐 Application running at http://localhost:3000"
