# 🚀 DevOps Deployment Guide - Jenkins & Production Setup

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Jenkins Setup](#jenkins-setup)
3. [Repository Configuration](#repository-configuration)
4. [Docker Deployment](#docker-deployment)
5. [Production Checklist](#production-checklist)
6. [Monitoring & Logging](#monitoring--logging)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- **Jenkins** (v2.400+) with Git and Docker plugins
- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Git** with webhook support (GitHub, GitLab, Bitbucket)
- **PostgreSQL** (for production database)
- **Nginx** (reverse proxy)
- **Linux Server** (Ubuntu 20.04+ recommended)

### System Requirements
- **CPU:** Minimum 2 cores (4+ recommended)
- **RAM:** Minimum 4GB (8GB+ recommended)
- **Storage:** Minimum 20GB SSD
- **Network:** Public IP with SSL certificate

---

## Jenkins Setup

### 1. Install Jenkins

```bash
# On Ubuntu/Debian
sudo apt-get update
sudo apt-get install openjdk-11-jdk
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Access Jenkins at http://localhost:8080
```

### 2. Install Required Plugins

In Jenkins UI: **Manage Jenkins → Plugins → Available Plugins**, install:
- **Pipeline** (Declarative and Scripted)
- **Docker Pipeline**
- **GitHub Integration** (or GitLab/Bitbucket)
- **Email Extension**
- **Slack Integration**
- **SonarQube Scanner**
- **Blue Ocean** (optional, better UI)

### 3. Configure Jenkins Credentials

Navigate to **Manage Jenkins → Credentials → System → Global credentials**

Add credentials for:
- **Git SSH Key** (for repository access)
- **Docker Registry** (Docker Hub or private registry)
- **Production Server** (SSH key for deployment)
- **Slack/Email** (for notifications)

### 4. Create a New Pipeline Job

```
1. Click "New Item"
2. Enter job name: "TodoApp-Pipeline"
3. Select "Pipeline"
4. Click "OK"
```

### 5. Configure Pipeline

In the Pipeline section:
```
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/your-username/your-repo.git
Branch: */main
Script Path: Jenkinsfile
```

Click **Save**

### 6. Setup GitHub Webhook (for automatic triggers)

**In GitHub Repository:**
1. Go to **Settings → Webhooks → Add webhook**
2. **Payload URL:** `http://your-jenkins-server:8080/github-webhook/`
3. **Content type:** application/json
4. **Events:** Push events, Pull requests
5. Click **Add webhook**

---

## Repository Configuration

### 1. Branch Strategy

Recommended Git flow:
```
main (production)
  ↓
develop (staging)
  ↓
feature/* (development)
```

### 2. Commit Strategy

Use conventional commits:
```
feat: Add user authentication
fix: Fix login token validation
docs: Update deployment guide
chore: Update dependencies
```

### 3. Repository Structure (What you have)

```
├── Jenkinsfile                 # CI/CD pipeline
├── docker-compose.yml          # Local dev environment
├── django-api/                 # Backend
│   ├── Dockerfile              # Backend production image
│   ├── requirements.txt         # Python dependencies
│   ├── .env.production          # Production environment
│   └── manage.py
├── Crud/Crud/                  # Frontend
│   ├── Dockerfile              # Frontend production image
│   ├── nginx.conf              # Nginx configuration
│   ├── .env.production          # Production environment
│   └── package.json
└── DEPLOYMENT.md               # This file
```

---

## Docker Deployment

### 1. Build and Push Images

```bash
# Build backend
cd django-api
docker build -t your-registry/django-api:1.0.0 .
docker push your-registry/django-api:1.0.0

# Build frontend
cd ../Crud/Crud
docker build -t your-registry/react-frontend:1.0.0 .
docker push your-registry/react-frontend:1.0.0
```

### 2. Deploy with Docker Compose

```bash
# Create .env file
cp .env.example .env
# Edit .env with your production settings

# Pull images and start services
docker-compose -f docker-compose.yml pull
docker-compose -f docker-compose.yml up -d

# Verify services
docker-compose ps
docker-compose logs -f

# Run migrations
docker-compose exec django_api python manage.py migrate
```

### 3. Health Checks

```bash
# Backend health check
curl http://localhost:8000/api/

# Frontend health check
curl http://localhost:80/

# Database health check
docker-compose exec db pg_isready -U postgres
```

---

## Kubernetes Deployment (Alternative)

For production at scale, use Kubernetes:

```bash
# Install kubectl and helm
kubectl create namespace todo-app
helm install todo-app ./chart -n todo-app -f values.yaml

# Verify deployment
kubectl get pods -n todo-app
kubectl logs -f deployment/django-api -n todo-app
```

---

## Production Checklist

### Before Deploying to Production

**Django Backend:**
- [ ] Set `DEBUG=False`
- [ ] Change `SECRET_KEY` to a random value
- [ ] Update `ALLOWED_HOSTS`
- [ ] Configure PostgreSQL instead of SQLite
- [ ] Setup CORS properly (`CORS_ALLOWED_ORIGINS`)
- [ ] Enable HTTPS (`SECURE_SSL_REDIRECT=True`)
- [ ] Configure email backend
- [ ] Setup logging to files
- [ ] Run `python manage.py collectstatic`
- [ ] Run database migrations
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Test API endpoints

**React Frontend:**
- [ ] Update `VITE_API_URL` to production API
- [ ] Build production bundle: `npm run build`
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Setup error tracking (Sentry)
- [ ] Test all routes work

**Infrastructure:**
- [ ] Setup SSL/TLS certificate (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Setup automated backups
- [ ] Configure monitoring and alerting
- [ ] Setup log aggregation
- [ ] Configure load balancer
- [ ] Test disaster recovery

### Production Settings

**Create `docker-compose.prod.yml`:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Monitoring & Logging

### 1. Application Monitoring

```bash
# Install Prometheus and Grafana
docker run -d -p 9090:9090 prom/prometheus
docker run -d -p 3000:3000 grafana/grafana

# Add metrics endpoint to Django
pip install django-prometheus
```

### 2. Centralized Logging (ELK Stack)

```bash
# Docker Compose with ELK
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.0.0
    ports:
      - "5601:5601"
```

### 3. Error Tracking (Sentry)

```bash
# Install Sentry for Django
pip install sentry-sdk

# Add to Django settings.py
import sentry_sdk
sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0
)
```

### 4. Log Files

```bash
# Backend logs
docker-compose logs -f django_api

# Frontend logs (Nginx)
docker-compose logs -f react_frontend

# Database logs
docker-compose logs -f db
```

---

## Jenkins Pipeline Stages Explained

### 1. **Checkout** 
   - Clones your repository

### 2. **Backend Setup**
   - Creates Python virtual environment
   - Installs dependencies

### 3. **Frontend Setup**
   - Installs Node.js packages

### 4. **Backend Testing**
   - Runs migrations
   - Executes unit tests

### 5. **Frontend Testing**
   - Runs linting (ESLint)
   - Builds production bundle

### 6. **Security Scan**
   - Checks for vulnerabilities
   - Uses Bandit (backend) and npm audit (frontend)

### 7. **Docker Build**
   - Builds Docker images for both services
   - (Only on main branch)

### 8. **Artifact Archive**
   - Saves build artifacts for deployment

### 9. **Deploy to Staging**
   - Deploys to staging environment
   - (Only on develop branch)

### 10. **Deploy to Production**
   - Requires manual approval
   - Deploys to production
   - (Only on main branch)

---

## Manual Deployment Steps

If not using CI/CD:

```bash
# 1. SSH into server
ssh user@production-server.com

# 2. Clone/update repository
cd /var/www/todo-app
git pull origin main

# 3. Build Docker images
docker-compose build

# 4. Pull images from registry
docker-compose pull

# 5. Backup database
docker-compose exec db pg_dump -U postgres todo_db > backup_$(date +%Y%m%d).sql

# 6. Stop old containers
docker-compose down

# 7. Start new containers
docker-compose up -d

# 8. Run migrations
docker-compose exec django_api python manage.py migrate

# 9. Verify deployment
docker-compose ps
curl http://localhost:8000/api/
curl http://localhost:80/
```

---

## Scaling Considerations

### Load Balancing
- Use Nginx as reverse proxy
- Configure upstream servers for multiple API instances

### Database
- Switch to managed PostgreSQL (AWS RDS, DigitalOcean)
- Enable replication and backups
- Setup read replicas for scaling reads

### Caching
- Add Redis for session management
- Cache API responses
- Use CDN for static files

### Containerization
- Use container orchestration (Kubernetes, Docker Swarm)
- Enable auto-scaling based on metrics

---

## Troubleshooting

### Jenkins Pipeline Fails

```bash
# Check Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Check pipeline stage logs in UI
Job → Build Details → Logs
```

### Docker Container Won't Start

```bash
# Check container logs
docker-compose logs django_api
docker-compose logs react_frontend

# Check container status
docker-compose ps -a

# Rebuild container
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Error

```bash
# Verify PostgreSQL is running
docker-compose exec db psql -U postgres -c "\l"

# Check DATABASE_URL format
# Should be: postgresql://user:password@host:port/database

# Reset database
docker-compose down -v  # WARNING: Deletes data
docker-compose up -d
```

### API Not Responding

```bash
# Check if Django is running
docker-compose exec django_api curl http://localhost:8000/api/

# Check for migration issues
docker-compose exec django_api python manage.py showmigrations

# Check environment variables
docker-compose exec django_api env | grep -i secret
```

### Frontend Not Showing

```bash
# Check Nginx logs
docker-compose logs react_frontend

# Verify build was successful
docker exec react_frontend ls -la /usr/share/nginx/html/

# Test Nginx configuration
docker exec react_frontend nginx -t
```

---

## Support & Documentation

- **Jenkins**: https://www.jenkins.io/doc/
- **Docker**: https://docs.docker.com/
- **Django**: https://docs.djangoproject.com/
- **React**: https://react.dev/
- **PostgreSQL**: https://www.postgresql.org/docs/

---

**Last Updated:** April 2026  
**Maintained By:** DevOps Team
