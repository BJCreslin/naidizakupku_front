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
                    // Останавливаем приложение
                    sh '''
                        sudo -u naidizakupku pm2 stop ${PM2_APP_NAME} || true
                        sudo -u naidizakupku pm2 delete ${PM2_APP_NAME} || true
                    '''
                    
                    // Копируем файлы
                    sh '''
                        sudo rm -rf ${APP_DIR}/*
                        sudo cp -R ./* ${APP_DIR}/
                        sudo chown -R naidizakupku:naidizakupku ${APP_DIR}
                    '''
                    
                    // Устанавливаем зависимости в production
                    sh '''
                        cd ${APP_DIR}
                        sudo -u naidizakupku npm ci --only=production
                    '''
                    
                    // Запускаем приложение через PM2
                    sh '''
                        cd ${APP_DIR}
                        sudo -u naidizakupku pm2 start npm --name "${PM2_APP_NAME}" -- start
                        sudo -u naidizakupku pm2 save
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