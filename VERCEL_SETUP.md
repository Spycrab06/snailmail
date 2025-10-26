# Vercel Database Setup Guide

This guide will help you configure your Railway MySQL database to work with your Vercel deployment.

## Quick Setup (Automated - Recommended)

### Using PowerShell (Windows):

```powershell
# Run the automated setup script
.\setup-vercel-env.ps1
```

This script will:
- Install Vercel CLI if needed
- Login to your Vercel account
- Link your project
- Add all database environment variables automatically

### Using Bash (Mac/Linux):

```bash
# Make the script executable
chmod +x setup-vercel-env.sh

# Run the automated setup script
./setup-vercel-env.sh
```

---

## Manual Setup (Alternative)

### Step 1: Add Environment Variables in Vercel Dashboard

Go to your Vercel project dashboard and add these environment variables:

#### For All Environments (Production, Preview, Development):

```
DB_HOST=turntable.proxy.rlwy.net
DB_USER=root
DB_PASSWORD=QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE
DB_NAME=railway
DB_PORT=56189
NODE_ENV=production
```

#### Steps:
1. Go to https://vercel.com/dashboard
2. Select your project (or create a new one if it doesn't exist)
3. Go to Settings → Environment Variables
4. Add each variable above
5. For each variable, select all environments (Production, Preview, Development)
6. Click "Save"

### Step 2: Add Frontend API URL

After your first deployment, you'll get a Vercel URL. Add this environment variable:

```
VITE_API_URL=https://your-project-name.vercel.app
```

**Important:** Replace `your-project-name.vercel.app` with your actual Vercel project URL.

**Note:** You must redeploy after adding `VITE_API_URL` for the frontend to use it.

### Step 3: Using Vercel CLI (Alternative Method)

If you prefer to use the CLI:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link your project (creates .vercel directory)
vercel link

# Add environment variables interactively
vercel env add DB_HOST
# When prompted, enter: turntable.proxy.rlwy.net
# Select: Production, Preview, Development

vercel env add DB_USER
# Enter: root

vercel env add DB_PASSWORD
# Enter: QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE

vercel env add DB_NAME
# Enter: railway

vercel env add DB_PORT
# Enter: 56189

vercel env add NODE_ENV
# Enter: production
```

After first deployment, add the frontend API URL:

```bash
vercel env add VITE_API_URL
# Enter: https://your-project-name.vercel.app (use your actual URL)
```

---

## Deployment

### Option 1: Deploy via Git (Recommended)

If you've connected your GitHub repository to Vercel:

```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

Vercel will automatically deploy when you push to your connected branch.

### Option 2: Deploy via CLI

```bash
# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

### Option 3: Deploy from Vercel Dashboard

1. Go to your Vercel dashboard
2. Click "Deploy" or "Redeploy"
3. Select the branch to deploy

---

## Verification Steps

After deployment, verify everything is working:

### 1. Check Deployment Logs
- Go to Vercel Dashboard → Your Project → Deployments
- Click on the latest deployment
- Check the build logs for any errors
- Look for "Connected to MySQL database" message

### 2. Test API Endpoints
Try accessing these URLs (replace with your domain):
- `https://your-project.vercel.app/` - Should load the frontend
- Login functionality should work

### 3. Check Environment Variables
- Go to Vercel Dashboard → Settings → Environment Variables
- Verify all variables are present:
  - DB_HOST
  - DB_USER
  - DB_PASSWORD
  - DB_NAME
  - DB_PORT
  - NODE_ENV
  - VITE_API_URL (add this after first deployment)

### 4. Test Login
- Visit your deployed site
- Try logging in with test credentials:
  - Email: `OscarTheGrouch@email.com`
  - Password: `pass1234`

---

## Troubleshooting

### Database Connection Fails
- Verify all environment variables are set correctly in Vercel
- Check Railway database is accessible from external connections
- Verify Railway credentials haven't changed
- Check Vercel deployment logs for specific error messages

### Frontend Can't Connect to Backend
- Make sure `VITE_API_URL` is set with your actual Vercel URL
- Redeploy after adding `VITE_API_URL`
- Check that routes in `vercel.json` are configured correctly
- Verify CORS headers in `server.js`

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

### Environment Variables Not Working
- Make sure you selected all environments when adding variables
- Redeploy after adding/changing environment variables
- For frontend variables, they must start with `VITE_`

---

## Important Notes

1. **Security**: Never commit `.env` files to git. They're in `.gitignore` for a reason.

2. **Railway Database**: Your Railway database is publicly accessible. Consider:
   - Using Railway's private networking if available
   - Restricting IP access in Railway dashboard
   - Rotating credentials periodically

3. **Vercel Limits**: Free tier has limits on:
   - Execution time (10 seconds max for serverless functions)
   - Database connections (configure connection pooling)
   - Monthly bandwidth

4. **Connection Pooling**: The database config already uses connection pooling (limit: 10 connections) to avoid overwhelming Railway's MySQL instance.

5. **After Deployment**: You MUST add `VITE_API_URL` and redeploy for the frontend to connect to the backend.

---

## Project Structure on Vercel

```
├── client/           → Built as static site (@vercel/static-build)
│   └── dist/        → Served from root path "/"
└── server/          → Serverless functions (@vercel/node)
    └── server.js    → Handles /login, /register, /executeQuery, /api/*
```

All API requests are routed to the serverless function, while static files are served from the client build.
