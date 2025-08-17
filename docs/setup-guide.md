# Setup Guide

This guide will help you set up the MagicTruck API with Google Maps integration for shipment cost calculation.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (version 12 or higher)
- **Git** for version control

### Check Node.js Version

```bash
node --version
npm --version
```

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MagicTruck
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/magictruck"

# Google Maps API Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (if using authentication)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
```

### 4. Google Maps API Setup

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project

#### Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud project:

- **Distance Matrix API**
- **Geocoding API**

#### Step 3: Create API Key

1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key

#### Step 4: Restrict API Key (Recommended)

1. Click on the created API key
2. Under "Application restrictions", select "HTTP referrers" or "IP addresses"
3. Under "API restrictions", select "Restrict key"
4. Choose the APIs you enabled (Distance Matrix API, Geocoding API)

#### Step 5: Add API Key to Environment

Add your API key to the `.env` file:

```env
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 5. Database Setup

#### PostgreSQL Installation

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS (using Homebrew):**

```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

#### Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE magictruck;
CREATE USER magictruck_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE magictruck TO magictruck_user;
\q
```

#### Update Database URL

Update your `.env` file with the correct database URL:

```env
DATABASE_URL="postgresql://magictruck_user:your_password@localhost:5432/magictruck"
```

### 6. Database Migration

Run the database migrations to create the required tables:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 7. Verify Installation

Test that everything is working correctly:

```bash
# Start the development server
npm run dev

# In another terminal, test the API
node test-shipment-api.js
```

## Development Setup

### 1. Development Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:reset": "prisma migrate reset",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

### 2. TypeScript Configuration

Ensure your `tsconfig.json` is properly configured:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Development Tools

Install development dependencies:

```bash
npm install --save-dev @types/node @types/express @types/cors
```

## Production Setup

### 1. Environment Variables

For production, use a more secure configuration:

```env
# Production Environment
NODE_ENV=production
PORT=3000

# Database (use connection pooling)
DATABASE_URL="postgresql://user:password@host:5432/magictruck?connection_limit=20"

# Google Maps API (restricted key)
GOOGLE_MAPS_API_KEY=your_production_api_key

# Security
JWT_SECRET=your_very_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

### 2. Process Manager

Use PM2 for process management:

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js

# Monitor the application
pm2 monit

# View logs
pm2 logs
```

### 3. Reverse Proxy (Nginx)

Configure Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL Certificate

Use Let's Encrypt for free SSL certificates:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## Troubleshooting

### Common Issues

#### 1. Google Maps API Errors

**Error:** "GOOGLE_MAPS_API_KEY environment variable is required"

**Solution:**

- Ensure the API key is set in your `.env` file
- Verify the API key is valid and not restricted
- Check if the required APIs are enabled

#### 2. Database Connection Issues

**Error:** "Connection to database failed"

**Solution:**

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure the database exists
- Test connection manually: `psql -h localhost -U username -d magictruck`

#### 3. Port Already in Use

**Error:** "EADDRINUSE: address already in use"

**Solution:**

```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

#### 4. Prisma Migration Issues

**Error:** "Migration failed"

**Solution:**

```bash
# Reset the database
npx prisma migrate reset

# Or manually fix the migration
npx prisma migrate dev --name fix_migration
```

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=magictruck:*
```

### Logs

Check application logs:

```bash
# Development
npm run dev

# Production (with PM2)
pm2 logs

# Direct log files
tail -f logs/combined.log
tail -f logs/error.log
```

## Security Considerations

### 1. API Key Security

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Restrict Google Maps API key to your domain/IP
- Rotate API keys regularly

### 2. Database Security

- Use strong passwords for database users
- Enable SSL for database connections
- Restrict database access to application servers only
- Regular database backups

### 3. Application Security

- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS in production
- Implement proper CORS policies
- Add request logging and monitoring

## Monitoring and Maintenance

### 1. Health Checks

Create a health check endpoint:

```typescript
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

### 2. Logging

Configure comprehensive logging:

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
```

### 3. Performance Monitoring

Monitor key metrics:

- API response times
- Database query performance
- Google Maps API usage
- Error rates
- Memory and CPU usage

## Next Steps

After successful setup:

1. **Test the API** using the provided test scripts
2. **Review the documentation** in the `docs/` folder
3. **Set up monitoring** and logging
4. **Configure CI/CD** pipeline
5. **Deploy to production** environment

For additional help, refer to:

- [API Reference](./api-reference.md)
- [Error Handling](./error-handling.md)
- [Testing Guide](./testing-guide.md)
