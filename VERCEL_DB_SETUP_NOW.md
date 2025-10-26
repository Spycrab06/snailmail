# Connect Railway to Vercel - Do This Now

## Step 1: Go to Vercel Dashboard
Open: https://vercel.com/dashboard

## Step 2: Find Your Project
Look for your project (it should be something like "snailmail" or "snailmailvercel")
Click on it.

## Step 3: Go to Settings → Environment Variables
1. Click **Settings** in the top menu
2. Click **Environment Variables** in the left sidebar
3. You'll see a page to add variables

## Step 4: Add These 5 Variables

For EACH variable below, click "Add New" and:
- Enter the **Name** (left column)
- Enter the **Value** (right column)
- **IMPORTANT**: Check ALL THREE boxes: ☑ Production ☑ Preview ☑ Development
- Click **Save**

### Variable 1: DB_HOST
```
Name:  DB_HOST
Value: turntable.proxy.rlwy.net
Environments: ☑ Production ☑ Preview ☑ Development
```

### Variable 2: DB_USER
```
Name:  DB_USER
Value: root
Environments: ☑ Production ☑ Preview ☑ Development
```

### Variable 3: DB_PASSWORD
```
Name:  DB_PASSWORD
Value: QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE
Environments: ☑ Production ☑ Preview ☑ Development
```

### Variable 4: DB_NAME
```
Name:  DB_NAME
Value: railway
Environments: ☑ Production ☑ Preview ☑ Development
```

### Variable 5: DB_PORT
```
Name:  DB_PORT
Value: 56189
Environments: ☑ Production ☑ Preview ☑ Development
```

## Step 5: Redeploy Your Site

1. Go to the **Deployments** tab (top menu)
2. Find your latest deployment (should be at the top)
3. Click the **three dots (...)** on the right side
4. Click **Redeploy**
5. Confirm by clicking **Redeploy** again
6. Wait for the build to complete (usually 1-2 minutes)

## Step 6: Test It

Once deployed:
1. Visit your Vercel site URL
2. Go to the login page
3. Try logging in with:
   - Email: `OscarTheGrouch@email.com`
   - Password: `pass1234`

If it works, you'll be redirected to the customer page! ✅

---

## Why This Is Needed

Your local server uses the `.env` file in the `server/` directory, but that file is NOT pushed to GitHub (it's in `.gitignore` for security).

Vercel needs these environment variables to be manually added through their dashboard so your deployed site can connect to Railway.

---

## Troubleshooting

**Can't find Environment Variables?**
- Make sure you're in Settings → Environment Variables (left sidebar)

**Variables not working after adding them?**
- Make sure you clicked **Redeploy** after adding all 5 variables
- Check that you selected all 3 environments for each variable

**Login still fails?**
- Check the Vercel deployment logs for specific errors
- Go to Deployments → Click on your deployment → Click "View Function Logs"
