#!/bin/bash

# SynapZ AI - Production Deployment Script

set -e

echo "🚀 Starting SynapZ AI Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${RED}❌ Please edit .env file with your configuration and run again${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Stop existing containers
echo -e "${YELLOW}⏹️  Stopping existing containers...${NC}"
docker compose down

# Build and start containers
echo -e "${GREEN}🔨 Building Docker images...${NC}"
docker compose build

echo -e "${GREEN}🚢 Starting containers...${NC}"
docker compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check if services are running
if docker compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ SynapZ AI is now running!${NC}"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8000"
    echo "🏥 Health Check: http://localhost:8000/health"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo "📦 Redis: localhost:6379"
    echo ""
    echo "📊 View logs: docker compose logs -f"
    echo "🛑 Stop services: docker compose down"
else
    echo -e "${RED}❌ Failed to start services. Check logs with: docker compose logs${NC}"
    exit 1
fi
