#!/bin/bash

# Pre-deployment checks script

set -e

echo "🔍 Running pre-deployment checks..."

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        return 1
    fi
}

check_service() {
    if docker-compose ps --services --filter "status=running" | grep -q $1; then
        echo -e "${GREEN}✓${NC} $1 is running"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT running"
        return 1
    fi
}

echo ""
echo "=== Checking Required Tools ==="
check_command docker
check_command docker-compose
check_command git
check_command python3

echo ""
echo "=== Checking Running Services ==="
docker-compose ps --all

echo ""
echo "=== Checking Environment Files ==="
if [ -f "django-api/.env.production" ]; then
    echo -e "${GREEN}✓${NC} Django production env exists"
else
    echo -e "${YELLOW}⚠${NC} Django production env missing"
fi

if [ -f "Crud/Crud/.env.production" ]; then
    echo -e "${GREEN}✓${NC} Frontend production env exists"
else
    echo -e "${YELLOW}⚠${NC} Frontend production env missing"
fi

echo ""
echo "=== Testing API Endpoints ==="
if curl -s http://localhost:8000/api/ > /dev/null; then
    echo -e "${GREEN}✓${NC} Backend API is responding"
else
    echo -e "${RED}✗${NC} Backend API is NOT responding"
fi

if curl -s http://localhost:80/ > /dev/null; then
    echo -e "${GREEN}✓${NC} Frontend is responding"
else
    echo -e "${RED}✗${NC} Frontend is NOT responding"
fi

echo ""
echo "=== Checking Database ==="
if docker-compose exec -T db psql -U postgres -c "\l" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Database is accessible"
else
    echo -e "${RED}✗${NC} Database is NOT accessible"
fi

echo ""
echo "=== Checking Migrations ==="
if docker-compose exec -T django_api python manage.py showmigrations --plan | grep -q "ok"; then
    echo -e "${GREEN}✓${NC} Migrations are up to date"
else
    echo -e "${YELLOW}⚠${NC} Pending migrations detected"
fi

echo ""
echo -e "${GREEN}✓${NC} Pre-deployment checks completed!"
