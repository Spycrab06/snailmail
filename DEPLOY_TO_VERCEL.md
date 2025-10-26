# Deploy to Vercel - Quick Start Guide

## Step 1: Login to Vercel

Run this command in your terminal:

```bash
vercel login
```

This will open a browser window for you to authenticate.

---

## Step 2: Link Your Project

Navigate to your project directory and run:

```bash
vercel link
```

Follow the prompts:
- Set up and deploy: Yes
- Which scope: Select your account
- Link to existing project: No (unless you already created one)
- Project name: snailmailvercel (or your preferred name)

---

## Step 3: Add Environment Variables

You have two options:

### Option A: Using Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Select your project (snailmailvercel)
3. Go to **Settings** → **Environment Variables**
4. Add each of these variables:

**For Production, Preview, AND Development environments:**

| Variable Name | Value |
|--------------|-------|
| `DB_HOST` | `turntable.proxy.rlwy.net` |
| `DB_USER` | `root` |
| `DB_PASSWORD` | `QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE` |
| `DB_NAME` | `railway` |
| `DB_PORT` | `56189` |
| `NODE_ENV` | `production` |

5. Click **Save** after adding each variable
6. Make sure to select all three environments (Production, Preview, Development) for each variable

### Option B: Using Vercel CLI

Run these commands one at a time:

```bash
vercel env add DB_HOST
# When prompted:
# - Enter value: turntable.proxy.rlwy.net
# - Select environments: Production, Preview, Development

vercel env add DB_USER
# Value: root

vercel env add DB_PASSWORD
# Value: QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE

vercel env add DB_NAME
# Value: railway

vercel env add DB_PORT
# Value: 56189

vercel env add NODE_ENV
# Value: production
```

---

## Step 4: Deploy to Vercel

Deploy your application:

```bash
vercel --prod
```

Wait for the deployment to complete. You'll get a URL like: `https://snailmailvercel-xyz.vercel.app`

---

## Step 5: Add Frontend API URL

After your first deployment, you need to add one more environment variable:

### Option A: Dashboard

1. Go to Settings → Environment Variables
2. Add new variable:
   - Name: `VITE_API_URL`
   - Value: Your Vercel URL (e.g., `https://snailmailvercel-xyz.vercel.app`)
   - Environments: Production, Preview, Development

### Option B: CLI

```bash
vercel env add VITE_API_URL
# Enter your actual Vercel URL from Step 4
```

---

## Step 6: Redeploy

After adding `VITE_API_URL`, redeploy:

```bash
vercel --prod
```

---

## Step 7: Test Your Deployment

Visit your Vercel URL and test:

1. Does the frontend load? ✓
2. Can you login with test credentials? ✓
   - Email: `OscarTheGrouch@email.com`
   - Password: `pass1234`
3. Try the SQL query page at `/sql` ✓

---

## Troubleshooting

### "No existing credentials found"
Run `vercel login` first

### Build fails
- Check the build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Make sure both client and server have their own package.json files

### Login doesn't work
- Verify all environment variables are set in Vercel dashboard
- Make sure `VITE_API_URL` points to your actual Vercel URL
- Check the Function logs in Vercel dashboard for errors

### Database connection fails
- Verify Railway database credentials haven't changed
- Check if Railway database allows external connections
- Look for specific error messages in Vercel Function logs

---

## Alternative: Deploy via Git

If your repository is connected to Vercel:

1. Add all environment variables through the Vercel dashboard (Step 3, Option A)
2. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```
3. Vercel will automatically build and deploy
4. After first deployment, add `VITE_API_URL` and redeploy

---

## What Gets Deployed

- **Frontend (client/)**: Built as static site, served from root `/`
- **Backend (server/)**: Deployed as serverless functions
  - Routes: `/login`, `/register`, `/executeQuery`, `/api/*`
- **Database**: Connects to Railway MySQL

---

## Next Steps After Deployment

- Monitor your deployment in Vercel dashboard
- Check Function logs for any errors
- Test all functionality on the live site
- Consider setting up automatic deployments from GitHub
- Review Vercel usage limits (especially database connections)

---

## Important Notes

- Environment variables are encrypted and secure in Vercel
- Never commit `.env` files to git
- Free tier has 10-second timeout for serverless functions
- Database uses connection pooling (max 10 connections)
- CORS is configured to allow all origins (`*`) - consider restricting in production
