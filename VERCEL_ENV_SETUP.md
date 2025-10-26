# Vercel Environment Variables Setup

Copy these exact values into your Vercel project's environment variables.

## How to Add in Vercel

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable below
5. Select all environments: **Production**, **Preview**, and **Development**
6. Click **Save**

## Required Environment Variables

### Database Configuration (Railway)

```
DB_HOST
turntable.proxy.rlwy.net
```

```
DB_USER
root
```

```
DB_PASSWORD
QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE
```

```
DB_NAME
railway
```

```
DB_PORT
56189
```

### Server Configuration

```
NODE_ENV
production
```

```
PORT
8080
```

## Optional: Full Connection URL

If your backend code supports DATABASE_URL:

```
DATABASE_URL
mysql://root:QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE@turntable.proxy.rlwy.net:56189/railway
```

## Step-by-Step Instructions

### Via Vercel Dashboard

1. **Navigate to Environment Variables**:
   - Vercel Dashboard → Your Project → Settings → Environment Variables

2. **Add Each Variable**:
   - Click "Add New"
   - Enter name (e.g., `DB_HOST`)
   - Enter value (e.g., `turntable.proxy.rlwy.net`)
   - Check all three boxes: Production, Preview, Development
   - Click "Save"

3. **Repeat for all variables** listed above

### Via Vercel CLI

Alternatively, use the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Add environment variables
vercel env add DB_HOST production
# Enter: turntable.proxy.rlwy.net

vercel env add DB_USER production
# Enter: root

vercel env add DB_PASSWORD production
# Enter: QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE

vercel env add DB_NAME production
# Enter: railway

vercel env add DB_PORT production
# Enter: 56189

vercel env add NODE_ENV production
# Enter: production

# Repeat for preview and development environments
```

## Testing Database Connection

After deployment, test the connection:

```bash
# Check deployment logs
vercel logs --follow

# Or via dashboard: Deployments → Latest → Logs
```

Look for:
- Database connection success messages
- No connection errors
- API endpoints responding correctly

## Troubleshooting

### Connection Timeout

If you see connection timeouts:
- Railway database might be sleeping (free tier)
- Check Railway dashboard for database status
- Verify the public URL is correct in Railway settings

### Authentication Failed

If authentication fails:
- Double-check DB_PASSWORD matches exactly
- Ensure no extra spaces in environment variables
- Verify DB_USER is `root`

### Wrong Database

If "database not found":
- Verify DB_NAME is `railway`
- Check Railway dashboard for actual database name

### Port Issues

If port errors occur:
- Confirm DB_PORT is `56189` (Railway's public port)
- Don't use port `3306` (that's the internal port)

## Railway Database Info

- **Type**: MySQL
- **Host** (Public): `turntable.proxy.rlwy.net`
- **Port** (Public): `56189`
- **Database**: `railway`
- **User**: `root`

**Note**: Railway's internal host (`mysql.railway.internal:3306`) only works within Railway's network. For external connections (like Vercel), always use the public URL.

## Security Notes

- ✅ Environment variables are encrypted in Vercel
- ✅ Never commit `.env` files to git
- ✅ Rotate passwords periodically
- ✅ Use Railway's built-in security features
- ⚠️ These credentials are already in this document - consider rotating them after setup

## Redeploy After Adding Variables

After adding environment variables:

```bash
# Trigger new deployment
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main

# Or via CLI
vercel --prod
```

## Verify Setup

Check that variables are loaded:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. You should see all variables listed
3. Deploy and check logs for successful database connection
