pipeline {
  agent any
  stages {

    stage('Prepare') {
      steps {
        sh 'mkdir -p allegory-allpay-sdk'
        dir(path: 'allegory-allpay-sdk') {
          git( credentialsId: 'github', url: 'https://github.com/xoken/allegory-allpay-sdk' , branch: 'master')
        }

        sh 'mkdir -p tonne'
        dir(path: 'tonne') {
          git( credentialsId: 'github', url: 'https://github.com/xoken/tonne' , branch: "${env.BRANCH_NAME}")
        }
      }
    }

    stage('Clean') {
      steps {
        dir(path: 'allegory-allpay-sdk') {
          sh 'rm -rf node_modules'
        }

        dir(path: 'tonne') {
          sh 'rm -rf node_modules'
          sh 'rm -rf build'
          sh 'rm -rf tonne-web-regtest'
          sh 'rm -rf tonne-web-testnet'
          sh 'rm -rf *.zip'
        }
      }
    }

    stage('Build') {
      steps {
        dir(path: 'allegory-allpay-sdk') {
          sh 'yarn'
          sh 'npm run build'
        }
        dir(path: 'tonne') {
          sh 'npm install'
        }
      }
    }

    stage('Release') {
      steps {
        script {
          // if ((env.BRANCH_NAME).startsWith("release")) {
            // echo '****** Starting Linux Desktop Build ******'
            // dir(path: 'tonne') {
            //   sh 'npx electron-packager .'
            //   sh 'zip -r tonne-"$(basename $(git symbolic-ref HEAD))"-linux-x64.zip tonne-linux-x64/'
            // }

            echo '****** Starting Regtest Web Build ******'
            dir(path: 'tonne') {
              sh 'npm run build:regtest'
              sh 'mv build tonne-web-regtest'
              sh 'git log -n 1 >> commit.log'
              sh 'mv commit.log tonne-web-regtest'
              sh 'zip -r tonne-"$(basename $(git symbolic-ref HEAD))"-web-regtest.zip tonne-web-regtest'
            }
            archiveArtifacts(artifacts: 'tonne/tonne-*.zip', followSymlinks: true)

            echo '****** Starting Testnet Web Build ******'
            dir(path: 'tonne') {
              sh 'npm run build:testnet'
              sh 'mv build tonne-web-testnet'
              sh 'git log -n 1 >> commit.log'
              sh 'mv commit.log tonne-web-testnet'
              sh 'zip -r tonne-"$(basename $(git symbolic-ref HEAD))"-web-testnet.zip tonne-web-testnet'
            }
            archiveArtifacts(artifacts: 'tonne/tonne-*.zip', followSymlinks: true)
          // } else {
          //   echo 'skipping release packaging.'
          // }
        }
      }
    }

  }

  post {
    unsuccessful {
      emailext(subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', body: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS    ||   Please check attached logfile for more details.', attachLog: true, from: 'buildmaster@xoken.org', replyTo: 'buildmaster@xoken.org', to: 'jenkins-notifications@xoken.org')
    }
    fixed {
      emailext(subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', body: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS  ||  Previous build was not successful and the current builds status is SUCCESS ||  Please check attached logfile for more details.', attachLog: true, from: 'buildmaster@xoken.org', replyTo: 'buildmaster@xoken.org', to: 'jenkins-notifications@xoken.org')
    }
  }
}
