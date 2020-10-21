pipeline {
  agent any
  stages {

    stage('Prepare') {
      steps {
        sh 'mkdir -p nipkow'
        dir(path: 'nipkow') {
          git( credentialsId: 'github', url: 'https://github.com/xoken/nipkow' , branch: 'master')
        }
      }
    }

    stage('Clean') {
      steps {
        dir(path: 'nipkow') {
          sh 'rm -r lib/nipkow-sdk/node_modules'
          sh 'rm -r node_modules'
        }
      }
    }

    stage('Build') {
      steps {
        dir(path: 'nipkow') {
          sh 'cd lib/nipkow-sdk && npm install'
          sh 'npm install'
        }
      }
    }

    stage('Release') {
      steps {
        script {
          // if ((env.BRANCH_NAME).startsWith("release")) {
            echo '****** Starting Linux Build ******'
            dir(path: 'nipkow') {
                    sh 'npm run build'
                    sh 'npx electron-packager .'
                    sh 'zip nipkow-linux-x64'
                  }
          // } else { 
            // echo 'skipping Docker release packaging..'
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
