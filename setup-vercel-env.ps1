# Vercel Environment Variables Setup Script (PowerShell)
# This script automatically adds all required environment variables to your Vercel project

Write-Host "🚀 Setting up Vercel environment variables..." -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
$vercelExists = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelExists) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Login to Vercel (if not already logged in)
Write-Host "📝 Checking Vercel login..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Vercel..." -ForegroundColor Yellow
    vercel login
}

# Link to Vercel project (if not already linked)
Write-Host "🔗 Linking to Vercel project..." -ForegroundColor Yellow
vercel link

Write-Host ""
Write-Host "📊 Adding database environment variables..." -ForegroundColor Cyan
Write-Host ""

# Function to add environment variable
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value
    )

    Write-Host "Adding $Name..." -ForegroundColor Green

    # Check if variable already exists
    $existing = vercel env ls 2>&1 | Select-String $Name
    if ($existing) {
        Write-Host "  ⚠️  $Name already exists, skipping..." -ForegroundColor Yellow
    } else {
        # Use echo to pipe the value to vercel env add
        $Value | vercel env add $Name production preview development
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ $Name added successfully" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Failed to add $Name" -ForegroundColor Red
        }
    }
}

# Add all environment variables
Add-VercelEnv -Name "DB_HOST" -Value "turntable.proxy.rlwy.net"
Add-VercelEnv -Name "DB_USER" -Value "root"
Add-VercelEnv -Name "DB_PASSWORD" -Value "QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE"
Add-VercelEnv -Name "DB_NAME" -Value "railway"
Add-VercelEnv -Name "DB_PORT" -Value "56189"
Add-VercelEnv -Name "NODE_ENV" -Value "production"

Write-Host ""
Write-Host "✅ Database environment variables setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Get your Vercel project URL from the dashboard" -ForegroundColor White
Write-Host "2. Add VITE_API_URL environment variable with your project URL" -ForegroundColor White
Write-Host "   Example: https://your-project.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "Run this command to add it:" -ForegroundColor Yellow
Write-Host "vercel env add VITE_API_URL" -ForegroundColor White
Write-Host ""
Write-Host "Then deploy with: vercel --prod" -ForegroundColor Yellow
