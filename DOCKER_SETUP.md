# Docker Setup Guide for PremiumMen E-commerce

This guide explains how to run the PremiumMen e-commerce application using Docker with PostgreSQL database.

## 🐳 Docker Architecture

The application consists of two containers:

1. **PostgreSQL Database** (`postgres:15`)
   - Stores orders, payments, and customer data
   - Persistent data storage with volumes
   - Health checks for reliability

2. **Application Server** (`Node.js + Express`)
   - Serves React frontend and REST API
   - Handles Payflowly payment integration
   - Connects to PostgreSQL database

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 2GB RAM available

### 1. Build and Start Services
```bash
# Build the application container
docker-compose build

# Start all services (database + app)
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Access the Application
- **Website**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **Database**: localhost:5432 (postgres/password123)

### 3. Stop Services
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v
```

## 📊 Database Configuration

### Connection Details
- **Host**: postgres (internal), localhost:5432 (external)
- **Database**: premiummen
- **Username**: postgres
- **Password**: password123

### Schema
The database automatically creates these tables:
- `users` - User accounts (if needed)
- `orders` - Order details, payments, customer info

### Data Persistence
- Database data is stored in Docker volume `postgres_data`
- Data persists between container restarts
- To reset data: `docker-compose down -v`

## 🔧 Environment Variables

The application uses these environment variables in Docker:

```env
# Database Connection
DATABASE_URL=postgresql://postgres:password123@postgres:5432/premiummen
PGHOST=postgres
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password123
PGDATABASE=premiummen

# Application
NODE_ENV=production
PORT=5000

# Payflowly (Pre-configured)
PAYFLOWLY_API_URL=https://payflowly.com/sign
PAYFLOWLY_TOKEN=6-u9dQvn2iZ.__qL)n
PAYFLOWLY_APP_ID=dd6d3e8b-4b43-4eee-8854-6cd885222ff4
```

## 🛠️ Docker Commands

### Container Management
```bash
# View running containers
docker-compose ps

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up --build -d

# View application logs
docker-compose logs app

# View database logs
docker-compose logs postgres
```

### Database Operations
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d premiummen

# Backup database
docker-compose exec postgres pg_dump -U postgres premiummen > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres -d premiummen < backup.sql
```

### Development vs Production

#### Development Mode
```bash
# Use existing development setup
npm run dev
```

#### Production Mode (Docker)
```bash
# Full production deployment
docker-compose up -d
```

## 📁 File Structure

```
├── docker-compose.yml      # Container orchestration
├── Dockerfile             # Application container
├── init.sql              # Database initialization
├── .dockerignore         # Files to exclude from build
├── server/
│   ├── db.ts            # Database connection
│   ├── storage.ts       # Database operations
│   └── routes.ts        # API endpoints
└── shared/
    └── schema.ts        # Database schema
```

## 🔍 Monitoring & Debugging

### Health Checks
- **Application**: `curl http://localhost:5000/api/health`
- **Database**: Built-in PostgreSQL health check

### View Order Data
```sql
-- Connect to database
docker-compose exec postgres psql -U postgres -d premiummen

-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- View recent payments
SELECT order_number, total, status, customer_email, created_at 
FROM orders 
WHERE created_at > NOW() - INTERVAL '24 hours';
```

### Troubleshooting

#### Database Connection Issues
```bash
# Check if postgres is running
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

#### Application Issues
```bash
# View app logs
docker-compose logs app

# Restart application
docker-compose restart app

# Rebuild if code changed
docker-compose up --build app
```

## 🚀 Production Deployment

### Security Considerations
1. **Change Default Passwords**:
   ```yaml
   environment:
     POSTGRES_PASSWORD: your_secure_password_here
   ```

2. **Use Environment Files**:
   ```bash
   # Create .env file
   echo "POSTGRES_PASSWORD=secure_password" > .env
   ```

3. **Enable SSL** (for production):
   - Configure PostgreSQL with SSL certificates
   - Use HTTPS for the application

### Scaling Options
```yaml
# Scale application instances
docker-compose up --scale app=3

# Use load balancer
# (requires additional nginx/traefik configuration)
```

## 📊 Data Backup Strategy

### Automated Backups
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec postgres pg_dump -U postgres premiummen > "backup_${DATE}.sql"
```

### Backup Schedule
- Run daily backups
- Store in secure location
- Test restore procedures regularly

## 🎯 Production Checklist

- [ ] Change default database password
- [ ] Set up automated backups
- [ ] Configure monitoring/logging
- [ ] Set up SSL certificates
- [ ] Configure firewall rules
- [ ] Test payment flow end-to-end
- [ ] Set up domain and DNS
- [ ] Configure environment variables properly

---

## 📞 Support

- **Technical Issues**: Check logs with `docker-compose logs`
- **Database Issues**: Connect directly with PostgreSQL commands
- **Payment Issues**: Verify Payflowly integration in logs
- **Contact**: +201006736720 (WhatsApp)