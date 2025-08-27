#!/bin/bash

echo "🐳 Starting Docker Daemon for PremiumMen E-commerce"
echo "=================================================="

# Check if Docker daemon is already running
if docker info >/dev/null 2>&1; then
    echo "✅ Docker daemon is already running"
    exit 0
fi

echo "🚀 Starting Docker daemon..."

# Create directories for Docker data
mkdir -p /tmp/docker-data
mkdir -p /tmp/docker-exec

# Start Docker daemon with custom settings
dockerd \
    --data-root /tmp/docker-data \
    --exec-root /tmp/docker-exec \
    --pid-file /tmp/docker.pid \
    --host unix:///var/run/docker.sock \
    --host tcp://0.0.0.0:2376 \
    --storage-driver overlay2 \
    > /tmp/dockerd.log 2>&1 &

DOCKER_PID=$!
echo "📝 Docker daemon PID: $DOCKER_PID"

# Wait for Docker daemon to start
echo "⏳ Waiting for Docker daemon to start..."
for i in {1..30}; do
    if docker info >/dev/null 2>&1; then
        echo "✅ Docker daemon started successfully!"
        echo "🆔 Process ID: $DOCKER_PID"
        echo "📄 Logs: /tmp/dockerd.log"
        echo ""
        echo "🔧 You can now run:"
        echo "   docker compose up -d"
        echo "   ./test-docker.sh"
        exit 0
    fi
    echo "   Attempt $i/30..."
    sleep 2
done

echo "❌ Docker daemon failed to start within 60 seconds"
echo "📄 Check logs: cat /tmp/dockerd.log"
echo ""
echo "🔧 Alternative methods to try:"
echo "   1. sudo systemctl start docker"
echo "   2. sudo service docker start"
echo "   3. dockerd --rootless"
exit 1