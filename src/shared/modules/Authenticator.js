const apis = require('nipkow-sdk');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

export default class Authenticator {
  static checkCredentials = async () => {
    if (
      localStorage.getItem('username') === undefined ||
      localStorage.getItem('password') === undefined ||
      localStorage.getItem('username') === '' ||
      localStorage.getItem('password') === '' ||
      localStorage.getItem('username') === null ||
      localStorage.getItem('password') === null
    ) {
      this.setCredentials();
      Authenticator.httpsauth(localStorage.getItem('username'), localStorage.getItem('password'));
      console.log('called from undefined');
    } else {
      if (
        localStorage.getItem('callsremaining') === null ||
        localStorage.getItem('callsremaining') <= 3
      ) {
        Authenticator.httpsauth(localStorage.getItem('username'), localStorage.getItem('password'));
        console.log('httpsauth called from else in auth');
      }
    }
  };

  static httpsauth = async (username, password) => {
    console.log(localStorage.getItem('port'));
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
  };

  static setCredentials = () => {
    localStorage.setItem('username', 'ExplorerUser');
    localStorage.setItem('password', 'OTQ2Nzc1MDIwNDA5MDcyMTM2Ng');
    localStorage.setItem('hostname', 'sb1.xoken.org');
    localStorage.setItem('port', 9091);
  };
}
