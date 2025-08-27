# 🐳 Docker Setup for PremiumMen E-commerce

This guide provides a complete Docker setup that works with just `docker compose up`.

## ✅ Quick Start (One Command)

```bash
docker compose up
```

That's it! The entire application with PostgreSQL database will start automatically.

## 🔧 Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose (included with Docker Desktop)

### Installing Docker

**Windows/Mac:**
1. Download Docker Desktop from https://docker.com
2. Install and start Docker Desktop
3. Verify: `docker --version` and `docker compose version`

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in
```

## 🚀 Usage

### Start Application
```bash
# Start all services in background
docker compose up -d

# Start with logs visible
docker compose up

# Force rebuild if needed
docker compose up --build
```

### Monitor Services
```bash
# View logs
docker compose logs -f

# Check service status
docker compose ps

# View specific service logs
docker compose logs app
docker compose logs postgres
```

### Stop Application
```bash
# Stop services
docker compose down

# Stop and remove data
docker compose down -v
```

## 📊 Services

The setup includes two services:

### 1. PostgreSQL Database (`postgres`)
- **Image**: `postgres:15`
- **Port**: `5432`
- **Database**: `premiummen`
- **Credentials**: `postgres` / `password123`
- **Data**: Persisted in Docker volume

### 2. Application (`app`)
- **Port**: `5000` 
- **Environment**: Production-ready Node.js
- **Features**: React frontend + Express API
- **Health Check**: `http://localhost:5000/api/health`

## 🔍 Verification

After starting with `docker compose up`, verify:

1. **Application**: http://localhost:5000
2. **Health Check**: http://localhost:5000/api/health
3. **Database**: Connect to localhost:5432

### Test Payment System
```bash
curl -X POST http://localhost:5000/api/create-payment-link \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "customerInfo": {
      "firstName": "Test",
      "lastName": "User", 
      "email": "test@example.com",
      "phone": "+1234567890"
    },
    "items": [{"id": "test", "name": "Test Product", "price": 99.99, "quantity": 1}]
  }'
```

## 🐛 Troubleshooting

### Docker Daemon Issues
If you get "Docker daemon not running":

**Windows/Mac:**
- Start Docker Desktop application

**Linux:**
```bash
sudo systemctl start docker
# or
sudo service docker start
```

### Port Conflicts
If port 5000 or 5432 is in use:

```yaml
# Edit docker-compose.yml
services:
  app:
    ports:
      - "3000:5000"  # Use port 3000 instead
  postgres:
    ports:
      - "5433:5432"  # Use port 5433 instead
```

### Build Issues
```bash
# Clean rebuild
docker compose down
docker system prune -f
docker compose up --build --force-recreate
```

### Database Connection Issues
```bash
# Check database logs
docker compose logs postgres

# Connect to database directly
docker compose exec postgres psql -U postgres -d premiummen
```

### Memory Issues
```bash
# Check container resources
docker stats

# Restart with more memory
docker compose down
docker compose up
```

## 🔐 Security Notes

### For Production Use:

1. **Change Database Password**:
   ```yaml
   environment:
     POSTGRES_PASSWORD: your_secure_password_here
   ```

2. **Use Environment Files**:
   ```bash
   # Create .env file
   echo "POSTGRES_PASSWORD=secure_password" > .env
   ```

3. **Enable SSL/TLS**:
   - Configure reverse proxy (nginx/traefik)
   - Use HTTPS certificates

## 📁 File Structure

```
├── docker-compose.yml       # Main orchestration file
├── Dockerfile              # Application container definition
├── init.sql                # Database initialization
├── .dockerignore           # Build optimization
├── start-docker-daemon.sh  # Docker daemon helper
└── test-docker.sh          # Validation script
```

## 🔄 Development vs Production

### Development (Current Setup)
```bash
# Use for local testing
docker compose up
```

### Production Scaling
```yaml
# Scale application instances
docker compose up --scale app=3

# Use with load balancer
# (requires nginx/traefik configuration)
```

## 📋 Environment Variables

The application uses these variables:

```env
# Database
DATABASE_URL=postgresql://postgres:password123@postgres:5432/premiummen
POSTGRES_PASSWORD=password123

# Application  
NODE_ENV=production
PORT=5000

# Payment Processing
PAYFLOWLY_API_URL=https://payflowly.com/sign
PAYFLOWLY_TOKEN=6-u9dQvn2iZ.__qL)n
PAYFLOWLY_APP_ID=dd6d3e8b-4b43-4eee-8854-6cd885222ff4
```

## 🎯 Features Included

✅ **Full E-commerce Stack**
- Product catalog (vanilla products & underwear)
- Shopping cart functionality
- Checkout and payment processing
- Order management

✅ **Payment Integration**  
- Payflowly payment links
- WhatsApp redirect after payment
- Customer information storage

✅ **Database Storage**
- PostgreSQL with persistent data
- Order tracking and history
- Customer information management

✅ **Production Ready**
- Multi-stage Docker build
- Health checks and monitoring
- Security best practices
- Resource optimization

## 📞 Support

For issues:
1. Check logs: `docker compose logs`
2. Verify prerequisites are installed
3. Review this documentation
4. Contact: +201006736720 (WhatsApp)

---

## ⚡ Quick Commands Reference

```bash
# Start everything
docker compose up

# Start in background  
docker compose up -d

# Stop everything
docker compose down

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Rebuild and start
docker compose up --build

# Clean restart
docker compose down && docker compose up --build
```

Your PremiumMen e-commerce platform is now ready to run with a single command! 🚀