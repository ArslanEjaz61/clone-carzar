#!/bin/bash

# CarZar Deployment Script
echo "🚀 Starting deployment to carzarpk.store..."

# SSH into server and deploy
ssh root@carzarpk.store << 'ENDSSH'
    echo "📂 Navigating to project directory..."
    cd /root/clone-carzar
    
    echo "📥 Pulling latest changes from GitHub..."
    git pull origin main
    
    echo "📦 Installing server dependencies..."
    cd server
    npm install
    
    echo "📦 Installing client dependencies..."
    cd ../client
    npm install
    
    echo "🔄 Restarting PM2 services..."
    cd ..
    pm2 restart all
    
    echo "✅ Deployment completed!"
    pm2 status
ENDSSH

echo "🎉 Deployment finished!"
