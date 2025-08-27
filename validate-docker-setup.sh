#!/bin/bash

echo "🔍 Validating Docker Setup for PremiumMen E-commerce"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required files exist
echo "📁 Checking required files..."

files=("docker-compose.yml" "Dockerfile" "init.sql" ".dockerignore")
for file in "${files[@]}"; do
    if [[ -f "$file" ]]; then
        success "Found $file"
    else
        error "Missing $file"
        exit 1
    fi
done

# Validate docker-compose.yml
echo ""
echo "🔧 Validating docker-compose.yml..."

if grep -q "postgres:" docker-compose.yml; then
    success "PostgreSQL service defined"
else
    error "PostgreSQL service missing"
    exit 1
fi

if grep -q "app:" docker-compose.yml; then
    success "Application service defined"
else
    error "Application service missing"
    exit 1
fi

if grep -q "5000:5000" docker-compose.yml; then
    success "Application port mapping correct"
else
    warning "Application port mapping not found"
fi

if grep -q "5432:5432" docker-compose.yml; then
    success "Database port mapping correct"
else
    warning "Database port mapping not found"
fi

# Validate Dockerfile
echo ""
echo "🐳 Validating Dockerfile..."

if grep -q "FROM node:" Dockerfile; then
    success "Using Node.js base image"
else
    error "Node.js base image not found"
    exit 1
fi

if grep -q "npm ci" Dockerfile; then
    success "Dependencies installation configured"
else
    error "Dependencies installation missing"
    exit 1
fi

if grep -q "npm run build" Dockerfile; then
    success "Build process configured"
else
    error "Build process missing"
    exit 1
fi

if grep -q "CMD.*npm.*start" Dockerfile; then
    success "Start command configured"
else
    error "Start command missing"
    exit 1
fi

if grep -q "HEALTHCHECK" Dockerfile; then
    success "Health check configured"
else
    warning "Health check not configured"
fi

# Validate package.json scripts
echo ""
echo "📦 Validating package.json..."

if [[ -f "package.json" ]]; then
    if grep -q '"start":' package.json; then
        success "Start script defined"
    else
        error "Start script missing"
        exit 1
    fi
    
    if grep -q '"build":' package.json; then
        success "Build script defined"
    else
        error "Build script missing"
        exit 1
    fi
else
    error "package.json not found"
    exit 1
fi

# Check Docker commands syntax
echo ""
echo "📋 Validating Docker Compose syntax..."

if command -v docker-compose >/dev/null 2>&1 || command -v docker compose >/dev/null 2>&1; then
    # Try to validate the compose file syntax
    if docker compose config >/dev/null 2>&1; then
        success "Docker Compose syntax is valid"
    else
        warning "Docker Compose syntax validation failed (daemon may not be running)"
    fi
else
    warning "Docker Compose not available for syntax validation"
fi

# Check for potential issues
echo ""
echo "🔍 Checking for potential issues..."

# Check for node_modules in .dockerignore
if grep -q "node_modules" .dockerignore; then
    success "node_modules excluded from build"
else
    warning "node_modules not excluded - build may be slow"
fi

# Check for reasonable image names
if grep -q "postgres:15" docker-compose.yml; then
    success "Using specific PostgreSQL version"
else
    warning "PostgreSQL version not specified"
fi

# Validate environment variables
if grep -q "DATABASE_URL" docker-compose.yml; then
    success "Database URL configured"
else
    error "Database URL missing"
    exit 1
fi

echo ""
echo "🎉 Docker setup validation complete!"
echo ""
echo "📝 To start your application:"
echo "   docker compose up"
echo ""
echo "📊 To monitor:"
echo "   docker compose logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker compose down"