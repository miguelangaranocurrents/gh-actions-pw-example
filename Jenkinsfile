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
        TOTAL_SHARDS = 3
    }
    options {
        timeout(time: 60, unit: 'MINUTES')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install'
                sh 'rm -r test-results'
                sh 'rm -r scripts/.last-run.json'
            }
        }

        stage('Set params CI Build ID') {
            steps {
                script {
                    env.CI_BUILD_ID = "${params.CI_BUILD_ID} ?: 'none'"
                    echo "CI_BUILD_ID is set to: ${params.CI_BUILD_ID}"
                }
                echo "Verify value: ${env.CI_BUILD_ID}"
            }
        }

        stage('Run Tests decision') {
            steps {
                runTestsDecision(env.CI_BUILD_ID)
            }
        }
    }
}

def runTestsDecision(ciBuildId) {
    def lastRunJson = readFile('scripts/.last-run.json')
    if (ciBuildId != 'none' && !lastRunJson.contains('FAILED')) {
        stage('Run Tests with last failed') {
            script {
                echo "${lastRunJson}"
                echo "Running tests with last failed: ${ciBuildId} ${env.TOTAL_SHARDS}"
                script {
                    sh 'node scripts/apiRequest.js'
                }
                runPlaywrightSharded(env.TOTAL_SHARDS.toInteger(), true)
            }
        }
    } else {
        stage('Run Tests') {
            script {
                echo 'Running tests'
                runPlaywrightSharded(env.TOTAL_SHARDS.toInteger(), false)
            }
        }
    }
}

def runPlaywrightSharded(shardTotal, lastFailed) {
    def parallelStages = [:]
    echo "SHARDTOTAL ${shardTotal} ${lastFailed}"
    for (int i = 1; i <= shardTotal; i++) {
        def shardIndex = i
        echo "SHARDINDEX ${shardIndex}"
        parallelStages["shard${shardIndex}"] = {
            if (lastFailed) {
                sh "mkdir -p test-results/shard-${shardIndex}"
                sh "cp scripts/.last-run.json test-results/shard-${shardIndex}/.last-run.json"
                runPlaywrightTestsLastFailed(shardIndex, shardTotal)
            } else {
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
        }
    }
}

def runPlaywrightTestsLastFailed(shardIndex, shardTotal) {
    stage("Run Playwright Tests - Shard ${shardIndex}") {
        script {
            def command = "npx pwc --shard=${shardIndex}/${shardTotal} --last-failed --output test-results/shard-${shardIndex}"
            echo "Running command: ${command}"
            sh "${command}"
        }
    }
}
