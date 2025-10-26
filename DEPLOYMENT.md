# Vercel Deployment Guide

Quick guide to deploy SnailMail to Vercel with auto-deployment for both frontend and backend.

## Prerequisites

1. GitHub account with this repository
2. [Vercel account](https://vercel.com/signup) (free tier works)
3. MySQL database (see Database Setup below)

## Quick Deploy

### 1. Import to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click "Add New Project" in Vercel Dashboard
2. Import your GitHub repository
3. Vercel will auto-detect the `vercel.json` configuration
4. Configure environment variables (see below)
5. Click "Deploy"

### 2. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

#### Required for Backend

```
DB_HOST=your-database-host.com
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
NODE_ENV=production
```

#### Optional for Frontend

```
VITE_API_URL=https://your-project.vercel.app/api
```

**Important**: Add variables to all environments (Production, Preview, Development)

### 3. Database Setup

You need a hosted MySQL database. Options:

#### PlanetScale (Recommended - Free Tier Available)

```bash
# Install CLI
npm install -g @planetscale/cli

# Login
pscale auth login

# Create database
pscale database create snailmail --region us-east

# Get connection string
pscale password create snailmail main db-password

# Use the connection details in Vercel env vars
```

#### Railway

1. Go to [Railway.app](https://railway.app)
2. Create new MySQL database
3. Copy connection details to Vercel

#### Other Options

- AWS RDS
- DigitalOcean Managed Database
- Google Cloud SQL
- Azure Database for MySQL

## Project Structure

```
snailmailvercel/
├── client/              # React frontend (Vite)
├── server/              # Node.js backend (Express + MySQL)
├── docs/                # VitePress documentation
├── vercel.json          # Vercel deployment config
└── package.json         # Root package with scripts
```

## How Deployment Works

### Frontend (Client)

- Built from `/client` directory
- Runs `npm install && npm run build`
- Output: `/client/dist`
- Deployed to Vercel CDN
- All routes except `/api/*` go to frontend

### Backend (Server)

- Deployed as serverless functions
- Entry point: `/server/server.js`
- All `/api/*` routes go to backend
- Auto-scales based on traffic
- Environment variables injected at runtime

## Automatic Deployments

Once connected to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Unique preview URL

## Vercel Configuration

The `vercel.json` file configures:

```json
{
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server/server.js" },
    { "src": "/(.*)", "dest": "/client/$1" }
  ]
}
```

## Local Testing

Before deploying, test locally:

```bash
# Install all dependencies
npm run install:all

# Terminal 1: Run frontend
npm run dev:client

# Terminal 2: Run backend
npm run dev:server

# Test production build
npm run build:client
```

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Database created and accessible
- [ ] Environment variables set in Vercel
- [ ] Database connection tested
- [ ] API routes tested locally
- [ ] Frontend build successful
- [ ] All secrets in environment variables (not hardcoded)
- [ ] `.env` files not committed to git

## Troubleshooting

### Build Fails

Check Vercel deployment logs:
1. Go to Deployments in Vercel Dashboard
2. Click failed deployment
3. Check build logs for errors

Common issues:
- Missing dependencies in package.json
- Build script errors
- Environment variables not set

### Database Connection Errors

Verify:
- Database is running and accessible
- Connection credentials are correct
- Database allows connections from Vercel IPs
- Environment variables are set correctly

### API Not Working

Check:
- API routes are prefixed with `/api`
- Backend server.js exports properly for serverless
- CORS is configured correctly
- Environment variables loaded

### Frontend Not Loading

Verify:
- Build completed successfully
- `client/dist` directory created
- No console errors in browser
- Routes configured correctly

## CLI Deployment

Alternatively, deploy via CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Post-Deployment

### Monitor

- View logs: `vercel logs <deployment-url>`
- Check analytics in Vercel Dashboard
- Set up error tracking (e.g., Sentry)

### Custom Domain

1. Go to Settings → Domains in Vercel
2. Add your domain
3. Configure DNS records
4. SSL certificate auto-provisioned

### Performance

- Frontend cached at edge locations globally
- Backend auto-scales with serverless functions
- Consider adding Redis for caching
- Monitor database query performance

## Documentation

Full documentation available at `/docs`:

```bash
# Run docs locally
npm run docs:dev

# Build docs
npm run docs:build
```

Or view online after deployment at: `https://your-project.vercel.app/docs`

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Issues](https://github.com/EdwardVNguyen/SnailMail/issues)
- [VitePress Docs](https://vitepress.dev)

## Next Steps

1. Set up monitoring and error tracking
2. Add rate limiting to API
3. Implement caching strategy
4. Set up CI/CD tests
5. Configure custom domain
6. Add analytics
