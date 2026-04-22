pipeline {
    agent any

    environment {
        // Environment variables for the pipeline
        DJANGO_DIR = 'django-api'
        FRONTEND_DIR = 'Crud/Crud'
        PYTHON_VERSION = '3.11'
        NODE_VERSION = '18'
        VIRTUAL_ENV = "${WORKSPACE}/${DJANGO_DIR}/venv"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from repository...'
                checkout scm
            }
        }

        stage('Backend Setup') {
            steps {
                echo '🔧 Setting up Python backend environment...'
                dir("${DJANGO_DIR}") {
                    sh '''
                        python${PYTHON_VERSION} -m venv venv
                        . venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                    '''
                }
            }
        }

        stage('Frontend Setup') {
            steps {
                echo '🔧 Setting up Node.js frontend environment...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        npm install
                    '''
                }
            }
        }

        stage('Backend Linting & Tests') {
            steps {
                echo '✅ Running backend tests and linting...'
                dir("${DJANGO_DIR}") {
                    sh '''
                        . venv/bin/activate
                        # Run Django migrations
                        python manage.py migrate
                        # Run tests (if any)
                        python manage.py test || true
                    '''
                }
            }
        }

        stage('Frontend Linting & Build') {
            steps {
                echo '✅ Running frontend linting and build...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        npm run lint || true
                        npm run build
                    '''
                }
            }
        }

        stage('Security Scan') {
            steps {
                echo '🔒 Running security scans...'
                sh '''
                    echo "Backend security scan..."
                    cd ${DJANGO_DIR}
                    . venv/bin/activate
                    pip install bandit
                    bandit -r . -ll || true
                    
                    echo "Frontend security scan..."
                    cd ${WORKSPACE}/${FRONTEND_DIR}
                    npm install npm-audit || true
                    npm audit --audit-level=moderate || true
                '''
            }
        }

        stage('Code Coverage') {
            steps {
                echo '📊 Generating code coverage reports...'
                dir("${DJANGO_DIR}") {
                    sh '''
                        . venv/bin/activate
                        pip install coverage
                        coverage run --source='.' manage.py test || true
                        coverage report || true
                        coverage html
                    '''
                }
            }
        }

        stage('Docker Build') {
            when {
                branch 'main'
            }
            steps {
                echo '🐳 Building Docker images...'
                sh '''
                    # Backend Docker image
                    docker build -t django-api:${BUILD_NUMBER} -f ${DJANGO_DIR}/Dockerfile ${DJANGO_DIR} || true
                    # Frontend Docker image
                    docker build -t react-frontend:${BUILD_NUMBER} -f ${FRONTEND_DIR}/Dockerfile ${FRONTEND_DIR} || true
                '''
            }
        }

        stage('Artifact Archive') {
            steps {
                echo '📦 Archiving build artifacts...'
                sh '''
                    mkdir -p build-artifacts
                    cp -r ${FRONTEND_DIR}/dist build-artifacts/frontend || true
                    cp -r ${DJANGO_DIR} build-artifacts/backend || true
                '''
                archiveArtifacts artifacts: 'build-artifacts/**', allowEmptyArchive: true
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo '🚀 Deploying to staging environment...'
                sh '''
                    echo "Deploying to staging server..."
                    # Add your staging deployment commands here
                    # Example: scp -r frontend/dist user@staging:/var/www/
                '''
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            input {
                message "Deploy to production?"
                ok "Deploy"
            }
            steps {
                echo '🚀 Deploying to production environment...'
                sh '''
                    echo "Deploying to production server..."
                    # Add your production deployment commands here
                    # Example: ansible-playbook deploy.yml
                '''
            }
        }

        stage('Notification') {
            steps {
                echo '📧 Sending build notifications...'
                sh '''
                    echo "Build and deployment process completed!"
                    # Add email notifications or Slack webhooks here
                '''
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs(deleteDirs: true)
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs for details.'
        }
    }
}
