pipeline {
    agent any
    environment {
        CURRENTS_PROJECT_ID = 'LrO7nE'
        CURRENTS_RECORD_KEY = 'KPEvZL0LDYzcZH3U'
        CURRENTS_CI_BUILD_ID = "reporter-${JOB_NAME}-${BUILD_ID}-${BUILD_NUMBER}"
    }
    parameters {
        string(name: 'CI_BUILD_ID', defaultValue: '', description: 'Set this value if you want to execute only the failed tests from a specific run')
    }
    options {
        timeout(time: 60, unit: 'MINUTES')
    }
    stages {
        stage('Print Parameters') {
            steps {
                script {
                    def ciBuildId = params.CI_BUILD_ID
                    echo "CI Build ID: ${ciBuildId}"
                }
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

        stage('Run Tests if last failed') {
            when {
                expression { params.CI_BUILD_ID != '' }
            }
            steps {
                echo "Running tests with last failed: ${params.CI_BUILD_ID}"
                runPlaywrightSharded(3, true)
            }
        }

        stage('Run Tests ') {
            when {
                expression { params.CI_BUILD_ID == '' }
            }
            steps {
                echo "Running tests"
                runPlaywrightSharded(3, false)
            }
        }
    }
}

def runPlaywrightSharded(shardTotal, lastFailed) {
    stage('Run Playwright Sharded') {
        steps {
            script {
                def parallelStages = [:]
                for (int i = 1; i <= shardTotal; i++) {
                    def shardIndex = i
                    parallelStages["shard${shardIndex}"] = {
                        stage('Running last failed ') {
                            when {
                                expression { lastFailed == true }
                            }
                            steps {
                                echo "Running last failed"
                                runPlaywrightTestsLastFailed(shardIndex, shardTotal)
                            }
                        }
                        stage('Running normal ') {
                            when {
                                expression { lastFailed == false }
                            }
                            steps {
                                echo "Running normal"
                                runPlaywrightTests(shardIndex, shardTotal)
                            }
                        }
                    }
                }
                parallel parallelStages
            }
        }
    }
}

def runPlaywrightTests(shardIndex, shardTotal) {
    stage("Run Playwright Tests - Shard ${shardIndex}") {
        script {
            def command = "npx playwright test --shard=${shardIndex}/${shardTotal}"
            echo "Running command: ${command}"
            sh "${command}"
            sh 'ls -R'
        }
    }
}

def runPlaywrightTestsLastFailed(shardIndex, shardTotal) {
    stage("Run Playwright Tests - Shard ${shardIndex}") {
        script {
            def command = "npx playwright test --shard=${shardIndex}/${shardTotal} --last-failed"
            echo "Running command: ${command}"
            sh "${command}"
            sh 'ls -R'
        }
    }
}
