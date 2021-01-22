pipeline {
  agent any
  stages {

    stage('Prepare') {
      steps {
        sh 'mkdir -p tonne'
        dir(path: 'tonne') {
          git( credentialsId: 'github', url: 'https://github.com/xoken/tonne' , branch: 'master')
        }
      }
    }

    stage('Build') {
      steps {
        dir(path: 'tonne') {
          sh 'cd lib/allegory-allpay-sdk && npm install'
        }
        dir(path: 'tonne') {
          sh 'npm install'
        }
      }
    }

    stage('Release') {
      steps {
        script {
          if ((env.BRANCH_NAME).startsWith("release")) {
            echo '****** Starting Linux Build ******'
            dir(path: 'tonne') {
              sh 'npm run build'
              sh 'npx electron-packager .'
              sh 'zip -r tonne-"$(basename $(git symbolic-ref HEAD))"-linux-x64.zip tonne-linux-x64/'
            }
            archiveArtifacts(artifacts: 'tonne/tonne-*.zip', followSymlinks: true)
          } else {
            echo 'skipping Docker release packaging..'
          }
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
