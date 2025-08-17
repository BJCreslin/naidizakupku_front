pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        APP_DIR = '/var/www/naidizakupku'
        PM2_APP_NAME = 'naidizakupku-front'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Node.js version:"
                    node --version
                    npm --version

                    echo "Installing dependencies..."
                    if [ -f "package-lock.json" ]; then
                        npm ci
                    else
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
                sh '''
                    echo "Building Next.js application..."
                    npm run build
                    
                    echo "Build artifacts:"
                    ls -la .next/
                    du -sh .next/
                '''
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Deploy files
                    sh '''
                        echo "🚀 Deploying to server..."
                        
                        # Create directory and set permissions
                        sudo mkdir -p ${APP_DIR}
                        sudo chown jenkins:jenkins ${APP_DIR}
                        
                        # Create home directory for naidizakupku user
                        sudo mkdir -p /home/naidizakupku
                        sudo chown naidizakupku:naidizakupku /home/naidizakupku
                        
                        # Stop and remove existing PM2 process (try different users)
                        echo "🛑 Stopping existing PM2 processes..."
                        pm2 stop ${PM2_APP_NAME} 2>/dev/null || echo "No PM2 process to stop (current user)"
                        pm2 delete ${PM2_APP_NAME} 2>/dev/null || echo "No PM2 process to delete (current user)"
                        sudo -u naidizakupku pm2 stop ${PM2_APP_NAME} 2>/dev/null || echo "No PM2 process to stop (naidizakupku)"
                        sudo -u naidizakupku pm2 delete ${PM2_APP_NAME} 2>/dev/null || echo "No PM2 process to delete (naidizakupku)"
                        
                        # Clean and copy files
                        sudo rm -rf ${APP_DIR}/*
                        cp -R ./* ${APP_DIR}/
                        sudo chown -R naidizakupku:naidizakupku ${APP_DIR}
                        
                        echo "✓ Files deployed successfully"
                    '''
                    
                    // Install dependencies and start
                    sh '''
                        cd ${APP_DIR}
                        
                        echo "📦 Installing all dependencies..."
                        sudo -u naidizakupku npm ci
                        
                        echo "🔍 Checking .next directory..."
                        if [ ! -d ".next" ]; then
                            echo "❌ .next directory missing - rebuilding..."
                            sudo -u naidizakupku npm run build
                        fi
                        
                        echo "🚀 Starting application..."
                        
                        # Switch to naidizakupku user and start PM2
                        sudo -u naidizakupku bash -c "
                            export HOME=/home/naidizakupku
                            cd ${APP_DIR}
                            export PATH=\$PATH:/usr/local/bin:/usr/bin
                            pm2 start npm --name '${PM2_APP_NAME}' -- start
                            pm2 save
                        "
                        
                        echo "📊 PM2 status:"
                        sudo -u naidizakupku pm2 list
                        
                        echo "📋 PM2 logs (last 10 lines):"
                        sudo -u naidizakupku pm2 logs ${PM2_APP_NAME} --lines 10
                        
                        echo "🎉 Deployment completed!"
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
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}