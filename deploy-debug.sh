#!/bin/bash

echo "🔍 Debugging deployment issues..."

# Check if we're in the right directory
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check Node.js and npm
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Check if .next directory exists
if [ -d ".next" ]; then
    echo "✅ .next directory exists"
    echo "Next.js build size: $(du -sh .next)"
    echo "Next.js contents:"
    ls -la .next/
else
    echo "❌ .next directory missing"
fi

# Check package.json
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json missing"
fi

# Check node_modules
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
    echo "node_modules size: $(du -sh node_modules)"
else
    echo "❌ node_modules missing"
fi

# Check PM2
echo "PM2 processes:"
pm2 list

# Check if the app is running
if pm2 list | grep -q "naidizakupku-front"; then
    echo "✅ PM2 process exists"
    pm2 logs naidizakupku-front --lines 20
else
    echo "❌ PM2 process not found"
fi

# Check environment
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Try to start the app manually
echo "Trying to start the app manually..."
npm start
