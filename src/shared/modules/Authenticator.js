const apis = require('nipkow-sdk');

async function checkCredentials() {
  if (
    localStorage.getItem('username') === undefined ||
    localStorage.getItem('password') === undefined ||
    localStorage.getItem('username') === '' ||
    localStorage.getItem('password') === '' ||
    localStorage.getItem('username') === null ||
    localStorage.getItem('password') === null
  ) {
    setCredentials();
    httpsauth(localStorage.getItem('username'), localStorage.getItem('password'));
  } else {
    if (
      localStorage.getItem('callsremaining') === null ||
      localStorage.getItem('callsremaining') <= 3
    ) {
      httpsauth(localStorage.getItem('username'), localStorage.getItem('password'));
    }
  }
}

async function httpsauth(username, password) {
  const authData = await apis.authAPI
    .login('' + username + '', '' + password + '')
    .then(data => {
      return data;
    })
    .catch(error => {
      window.location.reload();
    });
  if (Object.keys(authData).length !== 0) {
    localStorage.setItem('sessionkey', authData.auth.sessionKey);
    localStorage.setItem('callsremaining', authData.auth.callsRemaining);
  }
}

function setCredentials() {
  localStorage.setItem('username', 'ExplorerUser');
  localStorage.setItem('password', 'OTQ2Nzc1MDIwNDA5MDcyMTM2Ng');
  localStorage.setItem('hostname', 'sb1.xoken.org');
  localStorage.setItem('port', 9091);
}

export { checkCredentials, httpsauth, setCredentials };
