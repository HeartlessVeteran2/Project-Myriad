# 🚀 Deployment Guide

## Overview

This guide covers various deployment options for Project Myriad, from simple local setups to production-ready cloud deployments with high availability and scalability.

## Quick Deployment Options

### Option 1: Docker Compose (Recommended for Development)

The fastest way to get Project Myriad running locally:

```bash
# Clone the repository
git clone https://github.com/HeartlessVeteran2/Project-Myriad.git
cd Project-Myriad

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Access the application
# Web: http://localhost:3001
# API: http://localhost:3000
# Database: localhost:5432
```

### Option 2: Cloud Deployment Buttons

#### Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/HeartlessVeteran2/Project-Myriad)

#### Vercel (Frontend Only)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/HeartlessVeteran2/Project-Myriad)

#### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/project-myriad)

### Option 3: DigitalOcean App Platform

```yaml
# app.yaml
name: project-myriad
services:
  - name: backend
    source_dir: backend/
    github:
      repo: HeartlessVeteran2/Project-Myriad
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs

  - name: frontend
    source_dir: frontend/
    github:
      repo: HeartlessVeteran2/Project-Myriad
      branch: main
    build_command: npm run build
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs

databases:
  - name: postgres-db
    engine: PG
    version: '15'

static_sites:
  - name: docs
    source_dir: docs/
    build_command: npm run build:docs
```

## Production Deployment

### Prerequisites

**System Requirements**:

- **CPU**: 2 cores minimum, 4+ cores recommended
- **RAM**: 4GB minimum, 8GB+ recommended
- **Storage**: 50GB minimum, SSD recommended
- **Network**: 100Mbps+ bandwidth for optimal performance

**Software Dependencies**:

- **Docker**: 20.10+ and Docker Compose 2.0+
- **Node.js**: 18+ (for manual installation)
- **PostgreSQL**: 14+ (if not using Docker)
- **Redis**: 6+ (for caching and sessions)
- **Nginx**: 1.20+ (for reverse proxy)

### Environment Configuration

Create production environment file:

```bash
# .env.production
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/myriad_production
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# File Storage
STORAGE_TYPE=local # local, s3, gcs, azure
STORAGE_PATH=/app/storage
MAX_FILE_SIZE=500MB

# S3 Configuration (if using S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=myriad-storage

# External Services
MYANIMELIST_CLIENT_ID=your-mal-client-id
MYANIMELIST_CLIENT_SECRET=your-mal-client-secret
ANILIST_CLIENT_ID=your-anilist-client-id
ANILIST_CLIENT_SECRET=your-anilist-client-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
RATE_LIMIT_WINDOW=3600000
RATE_LIMIT_MAX=1000

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info

# Feature Flags
ENABLE_REGISTRATION=true
ENABLE_COMMUNITY_FEATURES=true
ENABLE_AI_RECOMMENDATIONS=false
ENABLE_WEB3_FEATURES=false
```

### Docker Production Setup

#### Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - static_files:/var/www/static:ro
    depends_on:
      - backend
      - frontend
    restart: unless-stopped
    networks:
      - myriad-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    volumes:
      - storage_data:/app/storage
      - logs:/app/logs
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - myriad-network
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    volumes:
      - static_files:/var/www/static
    restart: unless-stopped
    networks:
      - myriad-network

  # Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myriad_production
      POSTGRES_USER: myriad
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d:ro
    restart: unless-stopped
    networks:
      - myriad-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U myriad -d myriad_production']
      interval: 30s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - myriad-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 30s
      timeout: 3s
      retries: 5

  # Background Worker (Optional)
  worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.worker
    environment:
      - NODE_ENV=production
      - WORKER_MODE=true
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - myriad-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  storage_data:
    driver: local
  static_files:
    driver: local
  logs:
    driver: local

networks:
  myriad-network:
    driver: bridge
```

#### Production Dockerfiles

**Backend Dockerfile.prod**:

```dockerfile
# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy built dependencies
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Create necessary directories
RUN mkdir -p /app/storage /app/logs && chown nodejs:nodejs /app/storage /app/logs

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
```

**Frontend Dockerfile.prod**:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend
COPY --from=builder /app/dist /var/www/html

# Copy static assets
COPY --from=builder /app/dist /var/www/static

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 500M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=1r/s;

    # Upstream backend
    upstream backend {
        least_conn;
        server backend:3000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # Main server block
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_session_tickets off;

        # Modern SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header Strict-Transport-Security "max-age=63072000" always;
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";

        # Frontend static files
        location / {
            root /var/www/static;
            index index.html;
            try_files $uri $uri/ /index.html;

            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Authentication routes (stricter rate limiting)
        location /api/auth/ {
            limit_req zone=auth burst=5 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check endpoint
        location /health {
            proxy_pass http://backend;
            access_log off;
        }

        # File uploads
        location /api/upload {
            client_max_body_size 500M;
            proxy_pass http://backend;
            proxy_request_buffering off;
        }

        # WebSocket support
        location /ws {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
}
```

## Cloud Deployment Options

### AWS Deployment

#### ECS with Fargate

```yaml
# ecs-task-definition.json
{
  'family': 'project-myriad',
  'networkMode': 'awsvpc',
  'requiresCompatibilities': ['FARGATE'],
  'cpu': '1024',
  'memory': '2048',
  'executionRoleArn': 'arn:aws:iam::account:role/ecsTaskExecutionRole',
  'taskRoleArn': 'arn:aws:iam::account:role/ecsTaskRole',
  'containerDefinitions':
    [
      {
        'name': 'backend',
        'image': 'your-repo/myriad-backend:latest',
        'portMappings': [{ 'containerPort': 3000, 'protocol': 'tcp' }],
        'environment': [{ 'name': 'NODE_ENV', 'value': 'production' }],
        'secrets':
          [
            {
              'name': 'DATABASE_URL',
              'valueFrom': 'arn:aws:secretsmanager:region:account:secret:myriad/database',
            },
          ],
        'logConfiguration':
          {
            'logDriver': 'awslogs',
            'options':
              {
                'awslogs-group': '/ecs/project-myriad',
                'awslogs-region': 'us-east-1',
                'awslogs-stream-prefix': 'ecs',
              },
          },
        'healthCheck':
          {
            'command': ['CMD-SHELL', 'curl -f http://localhost:3000/health || exit 1'],
            'interval': 30,
            'timeout': 5,
            'retries': 3,
          },
      },
    ],
}
```

#### CloudFormation Template

```yaml
# cloudformation-template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Project Myriad Infrastructure'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues: [development, staging, production]

Resources:
  # VPC and Networking
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub ${AWS::StackName}-vpc

  # RDS Database
  DatabaseSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupDescription: Subnet group for RDS database
      SubnetIds:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2

  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: !Sub ${AWS::StackName}-db
      DBInstanceClass: db.t3.micro
      Engine: postgres
      EngineVersion: '15.4'
      AllocatedStorage: 20
      StorageType: gp2
      DBName: myriad
      MasterUsername: myriad
      MasterUserPassword: !Ref DatabasePassword
      DBSubnetGroupName: !Ref DatabaseSubnetGroup
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup
      BackupRetentionPeriod: 7
      DeletionProtection: true

  # ECS Cluster
  Cluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Sub ${AWS::StackName}-cluster
      CapacityProviders:
        - FARGATE
        - FARGATE_SPOT

  # Load Balancer
  LoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: !Sub ${AWS::StackName}-alb
      Type: application
      Scheme: internet-facing
      SecurityGroups:
        - !Ref LoadBalancerSecurityGroup
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2

Outputs:
  LoadBalancerDNS:
    Description: Load Balancer DNS Name
    Value: !GetAtt LoadBalancer.DNSName
    Export:
      Name: !Sub ${AWS::StackName}-LoadBalancerDNS
```

### Google Cloud Platform

#### Cloud Run Deployment

```yaml
# cloudbuild.yaml
steps:
  # Build backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/myriad-backend', './backend']

  # Build frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/myriad-frontend', './frontend']

  # Push images
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/myriad-backend']

  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/myriad-frontend']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'myriad-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/myriad-backend'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

### Azure Deployment

#### Container Apps

```yaml
# azure-container-app.yaml
properties:
  managedEnvironmentId: /subscriptions/{subscription}/resourceGroups/{rg}/providers/Microsoft.App/managedEnvironments/{env}
  configuration:
    secrets:
      - name: database-url
        value: postgresql://username:password@host:5432/database
    ingress:
      external: true
      targetPort: 3000
      traffic:
        - weight: 100
          latestRevision: true
  template:
    containers:
      - image: your-registry/myriad-backend:latest
        name: backend
        env:
          - name: NODE_ENV
            value: production
          - name: DATABASE_URL
            secretRef: database-url
        resources:
          cpu: 1.0
          memory: 2Gi
    scale:
      minReplicas: 1
      maxReplicas: 10
      rules:
        - name: http-scaling
          http:
            metadata:
              concurrentRequests: '100'
```

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get update
sudo apt-get install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add line: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare SSL

```nginx
# Cloudflare-specific SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;

# Cloudflare IP ranges
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
# ... more IP ranges
real_ip_header CF-Connecting-IP;
```

## Monitoring and Logging

### Prometheus + Grafana

```yaml
# monitoring/docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources

volumes:
  prometheus_data:
  grafana_data:
```

### Centralized Logging with ELK Stack

```yaml
# logging/docker-compose.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - '9200:9200'
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.8.0
    ports:
      - '5044:5044'
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    ports:
      - '5601:5601'
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

volumes:
  elasticsearch_data:
```

## Backup and Recovery

### Database Backup

```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="myriad_production"
DB_USER="myriad"
DB_HOST="localhost"

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://your-backup-bucket/database/

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

### File Storage Backup

```bash
#!/bin/bash
# backup-storage.sh

DATE=$(date +%Y%m%d_%H%M%S)
STORAGE_DIR="/app/storage"
BACKUP_DIR="/backups"

# Create compressed archive
tar -czf $BACKUP_DIR/storage_backup_$DATE.tar.gz -C $STORAGE_DIR .

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/storage_backup_$DATE.tar.gz s3://your-backup-bucket/storage/

# Clean old backups
find $BACKUP_DIR -name "storage_backup_*.tar.gz" -mtime +7 -delete

echo "Storage backup completed: storage_backup_$DATE.tar.gz"
```

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX CONCURRENTLY idx_media_items_user_type ON media_items(user_id, type);
CREATE INDEX CONCURRENTLY idx_reading_progress_user_media ON reading_progress(user_id, media_id);
CREATE INDEX CONCURRENTLY idx_downloads_user_status ON downloads(user_id, status);

-- Enable query optimization
ANALYZE;

-- Connection pooling settings
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
```

### Application Optimization

```javascript
// backend/config/performance.js
module.exports = {
  // Connection pooling
  database: {
    pool: {
      min: 2,
      max: 20,
      acquire: 30000,
      idle: 10000,
    },
  },

  // Redis caching
  cache: {
    ttl: 3600, // 1 hour
    maxSize: 1000,
    checkperiod: 600,
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};
```

## Scaling Strategies

### Horizontal Scaling

1. **Load Balancing**: Use multiple backend instances behind a load balancer
2. **Database Read Replicas**: Separate read and write operations
3. **Microservices**: Split monolith into smaller services
4. **CDN**: Use CloudFlare or AWS CloudFront for static assets

### Vertical Scaling

1. **Resource Monitoring**: Monitor CPU, memory, and disk usage
2. **Database Tuning**: Optimize queries and indexes
3. **Caching**: Implement Redis for session and data caching
4. **Asset Optimization**: Compress images and optimize bundles

This deployment guide provides comprehensive instructions for deploying Project Myriad in various environments. Choose the option that best fits your needs and scale accordingly as your user base grows.
