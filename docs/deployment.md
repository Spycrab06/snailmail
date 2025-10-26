# Deployment Guide

This guide covers deploying SnailMail to Vercel with automatic deployments for both frontend and backend.

## Overview

SnailMail uses Vercel for hosting with the following setup:

- **Frontend**: Static React app built with Vite
- **Backend**: Serverless API functions on Vercel

## Vercel Configuration

The project is configured with `vercel.json` files that handle:

1. Frontend deployment from `/client`
2. Backend API deployment from `/server`
3. Automatic builds on git push

## Deployment Steps

### 1. Prerequisites

- [Vercel account](https://vercel.com/signup)
- Vercel CLI installed: `npm i -g vercel`
- GitHub repository connected to your project

### 2. Environment Variables

Set up the following environment variables in Vercel dashboard:

#### Backend Environment Variables

```bash
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
```

To set environment variables:

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable for Production, Preview, and Development environments

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

#### Option B: Deploy via CLI

```bash
# From project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? snailmailvercel
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### 4. Automatic Deployments

Once connected to GitHub:

- **Production**: Push to `main` branch triggers production deployment
- **Preview**: Push to any other branch creates preview deployment
- **Pull Requests**: Each PR gets a unique preview URL

## Deployment Architecture

### Frontend Deployment

- Built from `/client` directory
- Output directory: `client/dist`
- Serves static files via Vercel CDN
- Environment: `VITE_API_URL` points to backend API

### Backend Deployment

- Node.js serverless functions
- API routes accessible at `/api/*`
- Database connections handled per request
- Auto-scales based on traffic

## Database Setup

For production, you'll need a hosted MySQL database. Options include:

- [PlanetScale](https://planetscale.com/) - MySQL-compatible serverless database
- [Railway](https://railway.app/) - Hosted MySQL
- [AWS RDS](https://aws.amazon.com/rds/) - Managed MySQL
- [DigitalOcean Managed Databases](https://www.digitalocean.com/products/managed-databases)

## Monitoring Deployments

### View Deployment Status

```bash
# List all deployments
vercel ls

# View deployment logs
vercel logs <deployment-url>
```

### Vercel Dashboard

Monitor deployments at: `https://vercel.com/[your-username]/snailmailvercel`

- Deployment history
- Real-time logs
- Performance analytics
- Error tracking

## Rollback

If a deployment has issues:

```bash
# Promote a previous deployment to production
vercel promote <deployment-url>
```

Or use the Vercel dashboard to promote a previous deployment.

## Troubleshooting

### Build Failures

Check build logs in Vercel dashboard:
1. Go to Deployments
2. Click on the failed deployment
3. Review the build logs

### API Connection Issues

Verify:
- Environment variables are set correctly
- Database is accessible from Vercel's network
- Database credentials are correct
- Database allows connections from Vercel IPs

### Frontend Not Loading

Check:
- Build completed successfully in `client/dist`
- No errors in browser console
- API URL is correctly configured

## Custom Domain

To add a custom domain:

1. Go to Project Settings → Domains
2. Enter your domain name
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

## Performance Optimization

- Frontend assets are automatically optimized
- CDN caching enabled by default
- Serverless functions cache database connections when possible
- Consider adding Redis for API caching

## Security

- Always use environment variables for secrets
- Never commit `.env` files
- Enable Vercel's security headers
- Use HTTPS for all API calls
- Implement rate limiting for API endpoints
