pipeline {
    agent any
    parameters {
        string(name: 'CI_BUILD_ID', defaultValue: 'none', description: 'Set this value if you want to execute only the failed tests from a specific run')
    }
    environment {
        CURRENTS_PROJECT_ID = 'LrO7nE'
        CURRENTS_RECORD_KEY = 'KPEvZL0LDYzcZH3U'
        CURRENTS_CI_BUILD_ID = "reporter-${JOB_NAME}-${BUILD_ID}-${BUILD_NUMBER}"
        CURRENTS_API_KEY = 'dXGDik1SmFlDfOCyDpmhS8dNzmMrG27P0noe7qbGNvnMQQmPwWcN51dFGu1SouRP'
    }
    options {
        timeout(time: 60, unit: 'MINUTES')
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    env.CI_BUILD_ID = "${params.CI_BUILD_ID}"
                    echo "CI_BUILD_ID is set to: ${params.CI_BUILD_ID}"
                }
                sh "echo ${env.CI_BUILD_ID}"
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install'
            }
        }

        stage('Run Tests if last failed') {
            when {
                expression { env.CI_BUILD_ID != 'none' }
            }
            steps {
                echo "Running tests with last failed: ${env.CI_BUILD_ID}"
                script {
                    sh 'node scripts/apiRequest.js'
                    sh 'mkdir -p test-results'
                    sh 'cp scripts/.last-run.json test-results/.last-run.json'
                    sh 'cat test-results/.last-run.json'
                }
                runPlaywrightSharded(3, true)
            }
        }

        stage('Run Tests ') {
            when {
                expression { env.CI_BUILD_ID == 'none' }
            }
            steps {
                echo 'Running tests'
                runPlaywrightSharded(3, false)
            }
        }
    }
}

def runPlaywrightSharded(shardTotal, lastFailed) {
    def parallelStages = [:]
    for (int i = 1; i <= shardTotal; i++) {
        def shardIndex = i
        sh "mkdir -p test-results/shard-${shardIndex}"
        sh "cp scripts/.last-run.json test-results/shard-${shardIndex}/.last-run.json"
        parallelStages["shard${shardIndex}"] = {
            if (lastFailed) {
                echo "Running last failed for shard ${shardIndex}"
                runPlaywrightTestsLastFailed(shardIndex, shardTotal)
            } else {
                echo "Running normal for shard ${shardIndex}"
                runPlaywrightTests(shardIndex, shardTotal)
            }
        }
    }
    parallel parallelStages
}

def runPlaywrightTests(shardIndex, shardTotal) {
    stage("Run Playwright Tests - Shard ${shardIndex}") {
        script {
            def command = "npx pwc --shard=${shardIndex}/${shardTotal}"
            echo "Running command: ${command}"
            sh "${command}"
            sh 'ls -R'
        }
    }
}

def runPlaywrightTestsLastFailed(shardIndex, shardTotal) {
    stage("Run Playwright Tests - Shard ${shardIndex}") {
        script {
            def command = "npx pwc --shard=${shardIndex}/${shardTotal} --last-failed --output test-results/shard-${shardIndex}"
            echo "Running command: ${command}"
            sh "${command}"
            sh 'ls -R'
        }
    }
}
