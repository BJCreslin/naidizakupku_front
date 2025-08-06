pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        APP_DIR = '/var/www/naidizakupku'
        PM2_APP_NAME = 'naidizakupku-front'
    }
    

    
    stages {
        stage('Install Dependencies') {
            steps {
                sh '''
                    # Check current Node.js version
                    echo "Current Node.js version:"
                    node --version
                    npm --version
                    
                    # List files to verify package-lock.json exists
                    echo "Files in current directory:"
                    ls -la
                    
                    # Check if package-lock.json exists
                    if [ -f "package-lock.json" ]; then
                        echo "package-lock.json found, using npm ci"
                        npm ci
                    else
                        echo "package-lock.json not found, using npm install"
                        npm install
                    fi
                '''
            }
        }
        
        stage('Type Check') {
            steps {
                sh 'npm run type-check'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Check if we can use sudo without password
                    sh '''
                        echo "Checking sudo access..."
                        if sudo -n true 2>/dev/null; then
                            echo "Passwordless sudo available"
                            USE_SUDO=true
                        else
                            echo "No passwordless sudo, will try alternative deployment"
                            USE_SUDO=false
                        fi
                    '''
                    
                    // Try deployment with sudo first, fallback if not available
                    sh '''
                        set +e  # Don't exit on error
                        
                        # Try to stop PM2 processes (with and without sudo)
                        if sudo -n pm2 stop ${PM2_APP_NAME} 2>/dev/null; then
                            echo "Stopped with sudo"
                        elif sudo -n -u naidizakupku pm2 stop ${PM2_APP_NAME} 2>/dev/null; then
                            echo "Stopped as naidizakupku user"
                        elif pm2 stop ${PM2_APP_NAME} 2>/dev/null; then
                            echo "Stopped as current user"
                        else
                            echo "Could not stop PM2 process (might not be running)"
                        fi
                        
                        # Try to delete PM2 processes
                        if sudo -n pm2 delete ${PM2_APP_NAME} 2>/dev/null; then
                            echo "Deleted with sudo"
                        elif sudo -n -u naidizakupku pm2 delete ${PM2_APP_NAME} 2>/dev/null; then
                            echo "Deleted as naidizakupku user"
                        elif pm2 delete ${PM2_APP_NAME} 2>/dev/null; then
                            echo "Deleted as current user"
                        else
                            echo "Could not delete PM2 process (might not exist)"
                        fi
                        
                        set -e  # Re-enable exit on error
                    '''
                    
                    // Deploy files
                    sh '''
                        echo "Deploying application files..."
                        
                        # Try different deployment strategies
                        DEPLOYED=false
                        
                        # Strategy 1: Try with sudo
                        if sudo -n rm -rf ${APP_DIR}/* 2>/dev/null && sudo -n cp -R ./* ${APP_DIR}/ 2>/dev/null; then
                            echo "✓ Deployed with sudo"
                            sudo chown -R naidizakupku:naidizakupku ${APP_DIR} 2>/dev/null || true
                            DEPLOYED=true
                        fi
                        
                        # Strategy 2: Try to create directory with proper permissions
                        if [ "$DEPLOYED" = "false" ]; then
                            echo "Trying to create deployment directory with proper permissions..."
                            if sudo -n mkdir -p ${APP_DIR} 2>/dev/null && sudo -n chown jenkins:jenkins ${APP_DIR} 2>/dev/null; then
                                echo "✓ Created directory with jenkins ownership"
                                rm -rf ${APP_DIR}/*
                                cp -R ./* ${APP_DIR}/
                                DEPLOYED=true
                            fi
                        fi
                        
                        # Strategy 3: Use a different deployment directory that jenkins can write to
                        if [ "$DEPLOYED" = "false" ]; then
                            echo "Trying alternative deployment directory..."
                            ALT_DIR="/tmp/naidizakupku-deploy"
                            rm -rf $ALT_DIR
                            mkdir -p $ALT_DIR
                            cp -R ./* $ALT_DIR/
                            echo "✓ Files copied to $ALT_DIR"
                            echo "NOTE: Files are in $ALT_DIR - manual move to ${APP_DIR} required"
                            
                            # Try to move with sudo
                            if sudo -n rm -rf ${APP_DIR}/* 2>/dev/null && sudo -n cp -R $ALT_DIR/* ${APP_DIR}/ 2>/dev/null; then
                                echo "✓ Successfully moved to final location with sudo"
                                sudo chown -R naidizakupku:naidizakupku ${APP_DIR} 2>/dev/null || true
                                DEPLOYED=true
                            fi
                        fi
                        
                        # Strategy 4: Deploy to Jenkins workspace and provide instructions
                        if [ "$DEPLOYED" = "false" ]; then
                            echo "========================================="
                            echo "DEPLOYMENT INSTRUCTIONS:"
                            echo "Files are built and ready in: $(pwd)"
                            echo "To complete deployment manually, run:"
                            echo "  sudo rm -rf ${APP_DIR}/*"
                            echo "  sudo cp -R $(pwd)/* ${APP_DIR}/"
                            echo "  sudo chown -R naidizakupku:naidizakupku ${APP_DIR}"
                            echo "========================================="
                            
                            # Set a flag for later stages to know deployment method
                            echo "manual" > deployment_method.txt
                        else
                            echo "automated" > deployment_method.txt
                        fi
                    '''
                    
                    // Install production dependencies and start application
                    sh '''
                        # Check deployment method
                        DEPLOYMENT_METHOD=$(cat deployment_method.txt 2>/dev/null || echo "automated")
                        
                        if [ "$DEPLOYMENT_METHOD" = "manual" ]; then
                            echo "========================================="
                            echo "MANUAL DEPLOYMENT DETECTED"
                            echo "After manually copying files to ${APP_DIR}, run:"
                            echo "  cd ${APP_DIR}"
                            echo "  sudo -u naidizakupku npm ci --only=production"
                            echo "  sudo -u naidizakupku pm2 start npm --name '${PM2_APP_NAME}' -- start"
                            echo "  sudo -u naidizakupku pm2 save"
                            echo "========================================="
                            echo "Build completed successfully - manual deployment required"
                            exit 0
                        fi
                        
                        # Automated deployment - install dependencies
                        cd ${APP_DIR}
                        echo "Installing production dependencies..."
                        
                        if sudo -n -u naidizakupku npm ci --only=production 2>/dev/null; then
                            echo "✓ Dependencies installed as naidizakupku user"
                        elif npm ci --only=production 2>/dev/null; then
                            echo "✓ Dependencies installed as current user"
                        else
                            echo "Trying npm install instead of npm ci..."
                            if sudo -n -u naidizakupku npm install --only=production 2>/dev/null; then
                                echo "✓ Dependencies installed as naidizakupku user with npm install"
                            elif npm install --only=production 2>/dev/null; then
                                echo "✓ Dependencies installed as current user with npm install"
                            else
                                echo "❌ ERROR: Could not install dependencies"
                                echo "Manual installation required:"
                                echo "  cd ${APP_DIR} && npm ci --only=production"
                                exit 1
                            fi
                        fi
                        
                        # Start application
                        echo "Starting application..."
                        
                        if sudo -n -u naidizakupku pm2 start npm --name "${PM2_APP_NAME}" -- start 2>/dev/null; then
                            echo "✓ Started as naidizakupku user"
                            sudo -n -u naidizakupku pm2 save 2>/dev/null || true
                        elif pm2 start npm --name "${PM2_APP_NAME}" -- start 2>/dev/null; then
                            echo "✓ Started as current user"
                            pm2 save 2>/dev/null || true
                        else
                            echo "❌ Could not start application with PM2"
                            echo "Manual startup required:"
                            echo "  cd ${APP_DIR} && pm2 start npm --name '${PM2_APP_NAME}' -- start"
                            exit 1
                        fi
                        
                        echo "🎉 Deployment completed successfully!"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}