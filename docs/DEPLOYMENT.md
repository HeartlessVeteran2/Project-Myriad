# Deployment Guide

This guide covers deploying Project Myriad to various environments.

## Prerequisites

- Docker and Docker Compose
- PostgreSQL database
- Node.js 18+ (for non-Docker deployments)
- Reverse proxy (nginx, Apache, or cloud load balancer)

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/project_myriad

# JWT Secret (MUST be secure in production)
JWT_SECRET=your-super-secure-jwt-secret-change-this

# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com
PORT=3001
NODE_ENV=production

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=100MB
```

## Docker Deployment (Recommended)

### 1. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/project_myriad
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
    volumes:
      - uploads:/app/uploads
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=project_myriad
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./src/server/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  uploads:
```

### 2. Deploy with Docker

```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## Manual Deployment

### 1. Server Setup

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install PM2 for process management
npm install -g pm2
```

### 2. Application Setup

```bash
# Clone repository
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with production values

# Set up database
sudo -u postgres createdb project_myriad
sudo -u postgres psql -d project_myriad -f src/server/schema.sql

# Build frontend
npm run build
```

### 3. Process Management with PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'myriad-backend',
      script: 'src/server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'myriad-frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

Start services:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Cloud Deployment

### AWS Deployment

#### Using AWS ECS with Fargate

1. **Push Docker images to ECR**:
```bash
# Build and tag images
docker build -f Dockerfile.frontend -t myriad-frontend .
docker build -f Dockerfile.backend -t myriad-backend .

# Tag for ECR
docker tag myriad-frontend:latest 123456789.dkr.ecr.region.amazonaws.com/myriad-frontend:latest
docker tag myriad-backend:latest 123456789.dkr.ecr.region.amazonaws.com/myriad-backend:latest

# Push to ECR
docker push 123456789.dkr.ecr.region.amazonaws.com/myriad-frontend:latest
docker push 123456789.dkr.ecr.region.amazonaws.com/myriad-backend:latest
```

2. **Create ECS Task Definitions** for frontend and backend
3. **Set up Application Load Balancer**
4. **Configure RDS PostgreSQL instance**
5. **Set up EFS for file storage**

#### Using AWS Elastic Beanstalk

Create `.ebextensions/` configuration files for environment setup.

### Google Cloud Platform

#### Using Cloud Run

```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT_ID/myriad-backend
gcloud run deploy myriad-backend --image gcr.io/PROJECT_ID/myriad-backend --platform managed

# Build and deploy frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/myriad-frontend
gcloud run deploy myriad-frontend --image gcr.io/PROJECT_ID/myriad-frontend --platform managed
```

### DigitalOcean App Platform

Create `.do/app.yaml`:

```yaml
name: project-myriad
services:
- name: backend
  source_dir: /
  dockerfile_path: Dockerfile.backend
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DATABASE_URL
    value: ${DATABASE_URL}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  
- name: frontend
  source_dir: /
  dockerfile_path: Dockerfile.frontend
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NEXT_PUBLIC_API_URL
    value: ${backend.PUBLIC_URL}

databases:
- name: postgres
  engine: PG
  version: "15"
```

## Nginx Configuration

Create `nginx.conf` for reverse proxy:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:3001;
    }
    
    server {
        listen 80;
        server_name yourdomain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl;
        server_name yourdomain.com;
        
        ssl_certificate /etc/ssl/certs/cert.pem;
        ssl_certificate_key /etc/ssl/certs/key.pem;
        
        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
        
        # Backend API
        location /api {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            
            # File upload size limit
            client_max_body_size 100M;
        }
        
        # Health check
        location /health {
            proxy_pass http://backend;
        }
    }
}
```

## SSL/TLS Setup

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logging

### Application Monitoring

1. **Health Checks**: Use `/health` endpoint
2. **Logging**: Configure structured logging
3. **Metrics**: Set up Prometheus/Grafana
4. **Error Tracking**: Consider Sentry integration

### Database Monitoring

```sql
-- Monitor database performance
SELECT * FROM pg_stat_activity;
SELECT * FROM pg_stat_user_tables;
```

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U postgres project_myriad > backup_$DATE.sql

# Upload to cloud storage
# aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### File Storage Backups

```bash
# Backup uploads directory
tar -czf uploads_$DATE.tar.gz uploads/
# Upload to cloud storage
```

## Security Checklist

- [ ] Change default JWT secret
- [ ] Enable HTTPS with valid certificates
- [ ] Configure firewall (only ports 80, 443, 22)
- [ ] Set up fail2ban for SSH protection
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] File upload validation
- [ ] Rate limiting implementation
- [ ] Security headers in nginx
- [ ] Regular backup verification

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Check network connectivity

2. **File Upload Issues**
   - Verify upload directory permissions
   - Check disk space
   - Confirm nginx client_max_body_size

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

### Logs Location

- **Docker**: `docker-compose logs [service_name]`
- **PM2**: `pm2 logs [app_name]`
- **Nginx**: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- **PostgreSQL**: `/var/log/postgresql/`

## Performance Optimization

1. **Database Indexing**
```sql
CREATE INDEX idx_series_user_id ON series(user_id);
CREATE INDEX idx_reading_progress_user_series ON reading_progress(user_id, series_id);
```

2. **Image Optimization**
   - Implement image resizing
   - Add CDN for static assets
   - Enable browser caching

3. **Caching Strategy**
   - Redis for session storage
   - Database query caching
   - Static asset caching
