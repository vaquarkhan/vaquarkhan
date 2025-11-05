#!/bin/bash

# Stop development environment for Card Linked Benefits Platform
echo "🛑 Stopping Card Linked Benefits Platform - Development Environment"

# Stop all services
docker-compose down

# Optional: Remove volumes (uncomment if you want to reset data)
# echo "🗑️  Removing volumes..."
# docker-compose down -v

echo "✅ Development environment stopped successfully!"
echo ""
echo "💡 To start again, run: ./scripts/start-dev.sh"