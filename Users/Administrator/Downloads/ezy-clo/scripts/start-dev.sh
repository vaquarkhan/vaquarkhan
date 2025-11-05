#!/bin/bash

# Start development environment for Card Linked Benefits Platform
echo "🚀 Starting Card Linked Benefits Platform - Development Environment"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration before running again."
    exit 1
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Show useful information
echo ""
echo "✅ Development environment is ready!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080/api"
echo "🗄️  Database Admin: http://localhost:8081 (adminer)"
echo "📊 Redis Admin: http://localhost:8082 (redis-commander)"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose logs -f [service-name]"
echo "  - Stop services: docker-compose down"
echo "  - Restart service: docker-compose restart [service-name]"
echo "  - Access database: docker-compose exec mysql mysql -u benefits_user -p card_benefits_platform"
echo ""