#!/bin/bash

# Deployment script for production

set -e

echo "🚀 Starting Deployment Process..."

DEPLOY_DATE=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="deployment_${DEPLOY_DATE// /_}.log"

{
    echo "========================================="
    echo "Deployment started at: $DEPLOY_DATE"
    echo "========================================="
    
    echo ""
    echo "Step 1: Pulling latest code..."
    git pull origin main
    
    echo ""
    echo "Step 2: Backing up database..."
    docker-compose exec -T db pg_dump -U postgres todo_db > "backups/backup_${DEPLOY_DATE// /_}.sql"
    
    echo ""
    echo "Step 3: Pulling latest Docker images..."
    docker-compose pull
    
    echo ""
    echo "Step 4: Building images..."
    docker-compose build --no-cache
    
    echo ""
    echo "Step 5: Stopping old containers..."
    docker-compose down
    
    echo ""
    echo "Step 6: Starting new containers..."
    docker-compose up -d
    
    echo ""
    echo "Step 7: Running migrations..."
    docker-compose exec -T django_api python manage.py migrate
    
    echo ""
    echo "Step 8: Collecting static files..."
    docker-compose exec -T django_api python manage.py collectstatic --noinput
    
    echo ""
    echo "Step 9: Verification..."
    docker-compose ps
    
    echo ""
    echo "Step 10: Testing endpoints..."
    
    # Test backend
    if curl -s http://localhost:8000/api/ > /dev/null; then
        echo "✓ Backend is responding"
    else
        echo "✗ Backend is NOT responding"
        exit 1
    fi
    
    # Test frontend
    if curl -s http://localhost:80/ > /dev/null; then
        echo "✓ Frontend is responding"
    else
        echo "✗ Frontend is NOT responding"
        exit 1
    fi
    
    echo ""
    echo "========================================="
    echo "Deployment completed successfully!"
    echo "Completed at: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "========================================="
    
} | tee "logs/$LOG_FILE"

echo ""
echo "📋 Deployment log saved to: logs/$LOG_FILE"
