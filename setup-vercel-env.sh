#!/bin/bash

# Vercel Environment Variables Setup Script
# This script automatically adds all required environment variables to your Vercel project

echo "🚀 Setting up Vercel environment variables..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "📝 Logging into Vercel..."
vercel whoami || vercel login

# Link to Vercel project (if not already linked)
echo "🔗 Linking to Vercel project..."
vercel link

echo ""
echo "📊 Adding database environment variables..."
echo ""

# Add database environment variables
echo "Adding DB_HOST..."
echo "turntable.proxy.rlwy.net" | vercel env add DB_HOST production preview development

echo "Adding DB_USER..."
echo "root" | vercel env add DB_USER production preview development

echo "Adding DB_PASSWORD..."
echo "QiKmEvAEDvFpnrBzcWTNOmsCnGppkTrE" | vercel env add DB_PASSWORD production preview development

echo "Adding DB_NAME..."
echo "railway" | vercel env add DB_NAME production preview development

echo "Adding DB_PORT..."
echo "56189" | vercel env add DB_PORT production preview development

echo "Adding NODE_ENV..."
echo "production" | vercel env add NODE_ENV production preview development

echo ""
echo "✅ All environment variables added successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Get your Vercel project URL from the dashboard"
echo "2. Add VITE_API_URL environment variable with your project URL"
echo "   Example: https://your-project.vercel.app"
echo ""
echo "Run this command to add it:"
echo "vercel env add VITE_API_URL"
echo ""
echo "Then deploy with: vercel --prod"
