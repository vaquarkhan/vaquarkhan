#!/bin/bash

# TurboAgile Enhanced Startup Script
# This script starts the complete application stack

echo "🚀 Starting TurboAgile Enhanced..."
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Start backend services
echo "🐳 Starting PostgreSQL and Spring Boot backend..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi

echo "✅ Backend services started successfully!"

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🌐 Starting frontend development server..."
echo ""
echo "🎯 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8080/api"
echo "   Swagger Docs: http://localhost:8080/api/swagger-ui.html"
echo "   Database: localhost:5432"
echo ""
echo "📋 Default credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🔄 To stop the application, press Ctrl+C and run: docker-compose down"
echo ""

# Start frontend in background
npm run dev &

# Store the frontend PID
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping TurboAgile Enhanced..."
    kill $FRONTEND_PID 2>/dev/null
    docker-compose down
    echo "✅ Application stopped successfully!"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT

# Wait for frontend
wait $FRONTEND_PID


