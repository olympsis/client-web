# Cloud Run Deployment Guide

This document provides instructions for deploying the Olympsis Client Web application to Google Cloud Run.

## Prerequisites

1. **Google Cloud SDK**: Install and configure the `gcloud` CLI
2. **Project Setup**: Ensure you have a Google Cloud project with billing enabled
3. **APIs Enabled**: Enable the following APIs:
   - Cloud Run API
   - Cloud Build API
   - Artifact Registry API (if using custom container registry)

## Environment Variables Setup

Before deploying, you need to configure the following environment variables in your `app.yaml` file:

```yaml
env_variables:
  NODE_ENV: production
  NITRO_HOST: '0.0.0.0'
  NITRO_PORT: '8080'
  
  # API Configuration
  API: 'your-backend-api-url'
  
  # Firebase Configuration
  FB_APP_ID: 'your-firebase-app-id'
  FB_API_KEY: 'your-firebase-api-key'
  FB_PROJECT_ID: 'your-firebase-project-id'
  FB_AUTH_DOMAIN: 'your-firebase-auth-domain'
  FB_STORAGE_BUCKET: 'your-firebase-storage-bucket'
  FB_MEASUREMENT_ID: 'your-firebase-measurement-id'
  FB_MESSAGING_SENDER_ID: 'your-firebase-messaging-sender-id'
  
  # Apple MapKit Configuration
  APL_APP_ID: 'your-apple-app-id'
  APL_KEY_ID: 'your-apple-key-id'
  APL_TEAM_ID: 'your-apple-team-id'
  APL_MAPKIT_SNAPSHOT_TOKEN: 'your-mapkit-token'
  MAPKIT_ORIGIN: 'your-mapkit-origin'
  MAPKIT_KEY: 'your-mapkit-key'
```

## Deployment Methods

### Method 1: Direct Cloud Run Deployment (Recommended)

1. **Deploy using gcloud**:
   ```bash
   gcloud run deploy olympsis-client-web \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8080 \
     --memory 512Mi \
     --cpu 1 \
     --min-instances 0 \
     --max-instances 10
   ```

2. **Set environment variables** (replace with your actual values):
   ```bash
   gcloud run services update olympsis-client-web \
     --region us-central1 \
     --update-env-vars \
     NODE_ENV=production,\
     API=your-api-url,\
     FB_APP_ID=your-firebase-app-id
     # Add other environment variables as needed
   ```

### Method 2: Using Docker Container

1. **Build the Docker image**:
   ```bash
   docker build -t gcr.io/[PROJECT-ID]/olympsis-client-web .
   ```

2. **Push to Google Container Registry**:
   ```bash
   docker push gcr.io/[PROJECT-ID]/olympsis-client-web
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy olympsis-client-web \
     --image gcr.io/[PROJECT-ID]/olympsis-client-web \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Method 3: Using App Engine (Alternative)

If you prefer App Engine over Cloud Run:

1. **Update app.yaml** with your environment variables
2. **Deploy**:
   ```bash
   gcloud app deploy
   ```

## Health Checks

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2025-08-06T...",
  "uptime": 123.456,
  "version": "1.0.0",
  "environment": "production"
}
```

Cloud Run will automatically use this for health monitoring.

## Custom Domain Setup

1. **Map your domain**:
   ```bash
   gcloud run domain-mappings create \
     --service olympsis-client-web \
     --domain your-domain.com \
     --region us-central1
   ```

2. **Update DNS records** as instructed by the output

## Monitoring and Logging

- **Logs**: View logs in Cloud Console or using `gcloud logs`
- **Metrics**: Monitor performance in Cloud Console
- **Sentry**: Error tracking is already configured (see `nuxt.config.ts`)

## Scaling Configuration

The current configuration includes:
- **Min instances**: 0 (scales to zero when not used)
- **Max instances**: 10
- **CPU target**: 60%
- **Memory**: 512Mi
- **CPU**: 1 vCPU

Adjust these in `app.yaml` or via gcloud commands as needed.

## Troubleshooting

### Common Issues

1. **Build failures**: Check that all dependencies are in `package.json`
2. **Environment variables**: Ensure all required vars are set in `app.yaml`
3. **Static files**: Verify the handlers in `app.yaml` match your build output

### Debug Commands

```bash
# Check service status
gcloud run services describe olympsis-client-web --region us-central1

# View recent logs
gcloud logs read --service olympsis-client-web --limit 50

# Test health endpoint
curl https://your-service-url/api/health
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive values to version control
2. **HTTPS**: Cloud Run enforces HTTPS by default
3. **Authentication**: Configure IAM roles for service access
4. **Secrets**: Consider using Google Secret Manager for sensitive data

## Cost Optimization

1. **Scale to Zero**: Configured to minimize costs during low usage
2. **Resource Limits**: Optimized CPU/memory allocation
3. **Static Assets**: Cached with 1-day expiration
4. **Build Optimization**: `.gcloudignore` excludes unnecessary files

## Continuous Deployment

Consider setting up Cloud Build triggers for automatic deployment on code changes:

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'olympsis-client-web', '--source', '.', '--region', 'us-central1']
```

## Support

For deployment issues:
1. Check Cloud Console logs
2. Verify environment configuration
3. Test health endpoint
4. Review resource allocation

The application is configured for optimal performance and cost-effectiveness on Google Cloud Run.