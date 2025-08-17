#!/bin/bash

echo "🔧 Fixing PM2 state..."

# Stop and delete the current PM2 process
echo "Stopping current PM2 process..."
pm2 stop naidizakupku-front 2>/dev/null || echo "Process already stopped"
pm2 delete naidizakupku-front 2>/dev/null || echo "Process already deleted"

# Switch to naidizakupku user and start properly
echo "Starting application as naidizakupku user..."
sudo -u naidizakupku bash -c "
    cd /var/www/naidizakupku
    echo 'Current directory: \$(pwd)'
    echo 'Directory contents:'
    ls -la
    
    echo 'Checking .next directory...'
    if [ -d '.next' ]; then
        echo '✅ .next directory exists'
        ls -la .next/
    else
        echo '❌ .next directory missing'
        exit 1
    fi
    
    echo 'Starting PM2...'
    pm2 start npm --name 'naidizakupku-front' -- start
    pm2 save
    
    echo 'PM2 status:'
    pm2 list
    
    echo 'PM2 logs:'
    pm2 logs naidizakupku-front --lines 5
"

echo "✅ PM2 fix completed!"
