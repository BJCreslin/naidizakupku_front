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

                    echo "Checking package-lock.json..."
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
                    echo "→ Building Next.js..."
                    npm run build

                    echo "→ Checking build artifacts..."
                    ls -la .next/
                    du -sh .next/
                '''
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['naidizakupku-deploy-key']) {
                    sh '''
                        echo "🚀 Deploying to server..."

                        rsync -avz --delete \
                          --exclude='.git' \
                          --exclude='node_modules' \
                          --exclude='.next/cache' \
                          ./ user@server:${APP_DIR}/

                        ssh -o StrictHostKeyChecking=no user@server "
                          cd ${APP_DIR} &&
                          echo '→ Installing production dependencies...' &&
                          npm ci --only=production &&
                          echo '→ Restarting PM2 app...' &&
                          if pm2 list | grep -q '${PM2_APP_NAME}'; then
                              pm2 restart ${PM2_APP_NAME} --update-env
                          else
                              pm2 start npm --name '${PM2_APP_NAME}' -- start
                          fi &&
                          pm2 save
                        "

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
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
