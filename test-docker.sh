#!/bin/bash

echo "🐳 Testing Docker Compose Setup for PremiumMen E-commerce"
echo "========================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for service
wait_for_service() {
    local service_url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$service_url" >/dev/null 2>&1; then
            echo "✅ $service_name is ready!"
            return 0
        fi
        echo "   Attempt $attempt/$max_attempts - waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name failed to start within timeout"
    return 1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists docker; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! command_exists docker-compose || ! command_exists docker compose; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Check if Docker daemon is running
echo "🔍 Checking Docker daemon..."
if ! docker info >/dev/null 2>&1; then
    echo "⚠️  Docker daemon is not running. Attempting to start..."
    
    # Try to start Docker daemon in background
    if command_exists dockerd; then
        echo "🚀 Starting Docker daemon..."
        mkdir -p /tmp/docker-data
        dockerd --data-root /tmp/docker-data --pid-file /tmp/docker.pid &
        DOCKER_PID=$!
        
        # Wait for Docker daemon to start
        sleep 5
        
        if ! docker info >/dev/null 2>&1; then
            echo "❌ Failed to start Docker daemon"
            echo "💡 Try running: sudo systemctl start docker"
            echo "💡 Or in some environments: sudo service docker start"
            exit 1
        fi
    else
        echo "❌ Docker daemon (dockerd) not found"
        exit 1
    fi
fi

echo "✅ Docker daemon is running"

# Test build process
echo "🔨 Testing Docker build..."
if ! docker compose build --no-cache; then
    echo "❌ Docker build failed"
    docker compose logs
    exit 1
fi

echo "✅ Docker build successful"

# Start services
echo "🚀 Starting services..."
if ! docker compose up -d; then
    echo "❌ Failed to start services"
    docker compose logs
    exit 1
fi

echo "✅ Services started"

# Wait for PostgreSQL
if ! wait_for_service "http://localhost:5432" "PostgreSQL"; then
    echo "❌ PostgreSQL failed to start"
    docker compose logs postgres
    exit 1
fi

# Wait for application
if ! wait_for_service "http://localhost:5000/api/health" "Application"; then
    echo "❌ Application failed to start"
    docker compose logs app
    exit 1
fi

# Test database connection
echo "🗄️  Testing database connection..."
if docker compose exec -T postgres psql -U postgres -d premiummen -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    docker compose logs postgres
    exit 1
fi

# Test API endpoints
echo "🔗 Testing API endpoints..."

# Test health endpoint
if curl -s -f "http://localhost:5000/api/health" >/dev/null; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
    docker compose logs app
    exit 1
fi

# Test payment creation endpoint
echo "💳 Testing payment creation..."
PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/create-payment-link \
    -H "Content-Type: application/json" \
    -d '{
        "amount": 99.99,
        "customerInfo": {
            "firstName": "Test",
            "lastName": "User",
            "email": "test@example.com",
            "phone": "+1234567890"
        },
        "items": [
            {
                "id": "test-product",
                "name": "Test Product",
                "price": 99.99,
                "quantity": 1
            }
        ]
    }')

if echo "$PAYMENT_RESPONSE" | grep -q "paymentUrl"; then
    echo "✅ Payment creation working"
    echo "   Payment URL created: $(echo "$PAYMENT_RESPONSE" | grep -o '"paymentUrl":"[^"]*"' | cut -d'"' -f4)"
else
    echo "❌ Payment creation failed"
    echo "   Response: $PAYMENT_RESPONSE"
    docker compose logs app
    exit 1
fi

# Show running services
echo "📊 Current service status:"
docker compose ps

echo ""
echo "🎉 All tests passed! Your Docker setup is working correctly."
echo ""
echo "📝 Access your application:"
echo "   🌐 Website: http://localhost:5000"
echo "   🏥 Health Check: http://localhost:5000/api/health"
echo "   🗄️  Database: localhost:5432 (user: postgres, password: password123)"
echo ""
echo "🛑 To stop services: docker compose down"
echo "🔄 To restart: docker compose restart"
echo "📋 To view logs: docker compose logs -f"