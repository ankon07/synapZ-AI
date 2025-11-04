#!/bin/bash

# SynapZ AI - Development Environment Setup

set -e

echo "🔧 Starting SynapZ AI Development Environment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
fi

# Start development containers
echo -e "${GREEN}🚀 Starting development containers...${NC}"
docker compose -f docker-compose.dev.yml up -d

echo -e "${GREEN}✅ Development environment is ready!${NC}"
echo ""
echo "🗄️  PostgreSQL: localhost:5432"
echo "📦 Redis: localhost:6379"
echo "🔧 Backend: localhost:8000 (with hot-reload)"
echo ""
echo "To start the frontend:"
echo "  cd synapz-learn-connect"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "📊 View logs: docker compose -f docker-compose.dev.yml logs -f"
echo "🛑 Stop services: docker compose -f docker-compose.dev.yml down"
