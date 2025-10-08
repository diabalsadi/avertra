#!/bin/bash
# run-migrations.sh - Run database migrations in Docker container

echo "🔄 Running database migrations..."

# Check if the database container is running
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "db.*Up"; then
    echo "❌ Database container is not running. Please start it first:"
    echo "docker-compose -f docker-compose.prod.yml up -d db"
    exit 1
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi