#!/bin/bash
# BizBloom AI - One Command Setup Script
# Usage: ./setup.sh

set -e

echo "🚀 BizBloom AI - Starting Setup..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.10+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source .venv/bin/activate
pip install -r requirements.txt --quiet

# Copy .env.example to .env if .env doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your API keys!"
fi

cd ..

echo -e "${BLUE}📦 Setting up Frontend...${NC}"
cd frontend

# Install npm dependencies
echo "Installing Node.js dependencies..."
npm install --silent

cd ..

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "=================================="
echo "🎯 To start the application, run:"
echo "   ./start.sh"
echo ""
echo "Or manually:"
echo "   Backend:  cd backend && source .venv/bin/activate && uvicorn app.main:app --reload"
echo "   Frontend: cd frontend && npm run dev"
echo "=================================="
