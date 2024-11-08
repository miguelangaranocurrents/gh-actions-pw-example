pipeline {
    agent any

    stages {
        stage('Cleanup') {
            steps {
                deleteDir()
                sh 'npx playwright uninstall --all'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci || npm install' // npm ci for clean install, fallback to npm install
                sh 'npx playwright install'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
    
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}