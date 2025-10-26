# Add Railway Database to Vercel - Quick Steps

Your Vercel site isn't connecting to Railway because the environment variables aren't set yet.

## Quick Fix (2 minutes):

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on your project: **snailmail-km4f3gb4j** (or whatever it's called)

### 3. Go to Settings
Click **Settings** in the top navigation

### 4. Click Environment Variables
In the left sidebar, click **Environment Variables**

### 5. Add These Variables

Click **Add New** for each variable below. **IMPORTANT:** Select all three environments (Production, Preview, Development) for each one!

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `DB_HOST` | `turntable.proxy.rlwy.net` | Production, Preview, Development |
| `DB_USER` | `root` | Production, Preview, Development |
| `DB_PASSWORD` | `QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE` | Production, Preview, Development |
| `DB_NAME` | `railway` | Production, Preview, Development |
| `DB_PORT` | `56189` | Production, Preview, Development |

### 6. Redeploy

After adding all variables:
1. Go to **Deployments** tab
2. Click the three dots (...) on your latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## That's It!

Once redeployed, your Vercel site will connect to the Railway database and login should work.

---

## Visual Guide:

```
Vercel Dashboard
  └─ Your Project (snailmail-km4f3gb4j)
      └─ Settings
          └─ Environment Variables
              └─ Add New (5 times, one for each variable above)
                  ├─ Select: Production ✓
                  ├─ Select: Preview ✓
                  └─ Select: Development ✓
```

---

## Test After Deployment:

1. Visit your Vercel URL
2. Try logging in with:
   - Email: `OscarTheGrouch@email.com`
   - Password: `pass1234`
3. Should redirect to customer page ✅
4. Visit `/sql` page - should load ✅

---

## Note:

The `.env` file in your local `server/` directory is NOT deployed to Vercel (it's in `.gitignore`). That's why you need to manually add these environment variables in the Vercel dashboard.
