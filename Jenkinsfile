pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:latest'
            args '-u root:root'  // run as root to install dependencies if needed
        }
    }
    environment {
        CURRENTS_PROJECT_ID = 'LrO7nE'
        CURRENTS_RECORD_KEY = 'KPEvZL0LDYzcZH3U' // Ensure CURRENTS_RECORD_KEY is stored in Jenkins credentials
        CURRENTS_CI_BUILD_ID = "reporter-${JOB_NAME}-${BUILD_ID}-${BUILD_NUMBER}"
    }
    options {
        timeout(time: 60, unit: 'MINUTES')  // Set a timeout of 60 minutes
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git config --global --add safe.directory "$WORKSPACE"'
            }
        }

        stage('Setup Node.js') {
            steps {
                sh 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -'
                sh 'apt-get install -y nodejs'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install chrome'
            }
        }

        stage('Run Playwright Last Failed Action') {
            steps {
                script {
                    def shardTotal = 3  // Total number of shards
                    parallel (
                        "shard1": {
                            runPlaywrightTests(1, shardTotal)
                        },
                        "shard2": {
                            runPlaywrightTests(2, shardTotal)
                        },
                        "shard3": {
                            runPlaywrightTests(3, shardTotal)
                        }
                    )
                }
            }
        }
    }
}

def runPlaywrightTests(shardIndex, shardTotal) {
    stage("Run Playwright Tests - Shard ${shardIndex}") {
        steps {
            script {
                def command = "npx playwright test --project=${shardIndex} --total-shards=${shardTotal}"
                echo "Running command: ${command}"
                sh "cd basic && ${command}"
            }
        }
    }
}
