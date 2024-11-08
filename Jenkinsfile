pipeline {
    agent any
    environment {
        CURRENTS_PROJECT_ID = 'LrO7nE'
        CURRENTS_RECORD_KEY = 'KPEvZL0LDYzcZH3U' // Ensure CURRENTS_RECORD_KEY is stored in Jenkins credentials
        CURRENTS_CI_BUILD_ID = "reporter-${JOB_NAME}-${BUILD_ID}-${BUILD_NUMBER}"
    }
    options {
        timeout(time: 60, unit: 'MINUTES')  // Set a timeout of 60 minutes
    }
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
                sh 'npm ci'
                sh 'npx playwright install'
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
        script {
            def command = "npx playwright test --shard=${shardIndex}/${shardTotal} --last-failed"
            echo "Running command: ${command}"
            sh "${command}"
        }
    }
}
