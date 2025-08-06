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
                        
                        # Create app directory if it doesn't exist
                        mkdir -p ${APP_DIR} || sudo mkdir -p ${APP_DIR}
                        
                        # Try to copy files with different approaches
                        if sudo -n rm -rf ${APP_DIR}/* 2>/dev/null && sudo -n cp -R ./* ${APP_DIR}/ 2>/dev/null; then
                            echo "Deployed with sudo"
                            sudo chown -R naidizakupku:naidizakupku ${APP_DIR} 2>/dev/null || true
                        else
                            echo "Trying deployment without sudo..."
                            # Check if we have write access to the directory
                            if [ -w ${APP_DIR} ]; then
                                rm -rf ${APP_DIR}/*
                                cp -R ./* ${APP_DIR}/
                                echo "Deployed without sudo"
                            else
                                echo "ERROR: Cannot deploy - no write access to ${APP_DIR} and no sudo access"
                                exit 1
                            fi
                        fi
                    '''
                    
                    // Install production dependencies
                    sh '''
                        cd ${APP_DIR}
                        echo "Installing production dependencies..."
                        
                        if sudo -n -u naidizakupku npm ci --only=production 2>/dev/null; then
                            echo "Dependencies installed as naidizakupku user"
                        elif npm ci --only=production 2>/dev/null; then
                            echo "Dependencies installed as current user"
                        else
                            echo "Trying npm install instead of npm ci..."
                            if sudo -n -u naidizakupku npm install --only=production 2>/dev/null; then
                                echo "Dependencies installed as naidizakupku user with npm install"
                            elif npm install --only=production 2>/dev/null; then
                                echo "Dependencies installed as current user with npm install"
                            else
                                echo "ERROR: Could not install dependencies"
                                exit 1
                            fi
                        fi
                    '''
                    
                    // Start application
                    sh '''
                        cd ${APP_DIR}
                        echo "Starting application..."
                        
                        if sudo -n -u naidizakupku pm2 start npm --name "${PM2_APP_NAME}" -- start 2>/dev/null; then
                            echo "Started as naidizakupku user"
                            sudo -n -u naidizakupku pm2 save 2>/dev/null || true
                        elif pm2 start npm --name "${PM2_APP_NAME}" -- start 2>/dev/null; then
                            echo "Started as current user"
                            pm2 save 2>/dev/null || true
                        else
                            echo "ERROR: Could not start application with PM2"
                            exit 1
                        fi
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