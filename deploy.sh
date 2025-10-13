#!/bin/bash

# Vercel Deployment Script for PizzaXperts
# This script will deploy the application to Vercel

echo "🚀 Starting Vercel deployment for PizzaXperts..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (you'll need to authenticate)
echo "Please login to Vercel..."
vercel login

# Link to existing project
echo "Linking to existing Vercel project..."
vercel link --project-id prj_RnjvB2aAfdCAtKmpP6IK37L8kohM

# Deploy to production
echo "Deploying to production..."
vercel --prod --yes

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: https://pizzaxeprt.vercel.app"