#!/bin/bash

# Reset database for Card Linked Benefits Platform
echo "🔄 Resetting Card Linked Benefits Platform Database"

# Warning message
echo "⚠️  WARNING: This will delete all data in the database!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled."
    exit 1
fi

# Stop backend service
echo "🛑 Stopping backend service..."
docker-compose stop backend

# Remove database volume
echo "🗑️  Removing database volume..."
docker-compose down
docker volume rm card-linked-benefits-platform_mysql_data 2>/dev/null || true
docker volume rm card-linked-benefits-platform_mysql_dev_data 2>/dev/null || true

# Restart services
echo "🚀 Restarting services..."
docker-compose up -d mysql redis

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 30

# Start backend service
echo "🔧 Starting backend service..."
docker-compose up -d backend

echo "✅ Database reset completed successfully!"
echo "🌐 The application should be available at http://localhost:3000"