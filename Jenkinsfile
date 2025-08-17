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
                sh '''
                    echo "Building Next.js application..."
                    npm run build
                    
                    echo "Build completed, checking .next directory:"
                    ls -la .next/
                    echo "Build artifacts:"
                    du -sh .next/
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "🚀 Starting deployment..."

                    # Копируем все файлы кроме node_modules
                    echo "→ Syncing files to ${APP_DIR}..."
                    rsync -av --delete --exclude=node_modules ./ ${APP_DIR}/

                    cd ${APP_DIR}

                    echo "→ Installing production dependencies..."
                    npm ci --only=production

                    echo "→ Restarting PM2 app..."
                    if pm2 list | grep -q "${PM2_APP_NAME}"; then
                        pm2 restart ${PM2_APP_NAME}
                    else
                        pm2 start npm --name "${PM2_APP_NAME}" -- start
                    fi

                    pm2 save

                    echo "🎉 Deployment completed successfully!"
                '''
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