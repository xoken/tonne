const apis = require('nipkow-sdk');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

export default class ExplorerAuth {
  static test = () => {
    if (
      localStorage.getItem('username') === undefined ||
      localStorage.getItem('password') === undefined ||
      localStorage.getItem('hostname') === undefined ||
      localStorage.getItem('port') === undefined ||
      localStorage.getItem('username') === '' ||
      localStorage.getItem('password') === '' ||
      localStorage.getItem('hostname') === '' ||
      localStorage.getItem('port') === '' ||
      localStorage.getItem('username') === null ||
      localStorage.getItem('password') === null ||
      localStorage.getItem('hostname') === null ||
      localStorage.getItem('port') === null
    ) {
      this.authprompt();

      console.log('called from undefined');
    } else {
      if (
        localStorage.getItem('callsremaining') === null ||
        localStorage.getItem('callsremaining') <= 3
      ) {
        this.httpsauth();
        console.log('httpsauth called from else in auth');
      }
    }
  };

  static httpsauth = () => {
    apis.authAPI
      .login('' + localStorage.getItem('username') + '', '' + localStorage.getItem('password') + '')
      .then(data => {
        console.log(data.auth.sessionKey);
        if (Object.keys(data).length !== 0) {
          localStorage.setItem('sessionkey', data.auth.sessionKey);
          localStorage.setItem('callsremaining', data.auth.callsRemaining);
          window.location.reload();
        }
      })
      .catch(error => {
        console.log(error);
        //authprompt();
        // console.log('called from error');
      });
  };
  static authprompt = () => {
    localStorage.setItem('username', 'ExplorerUser');
    localStorage.setItem('password', 'OTQ2Nzc1MDIwNDA5MDcyMTM2Ng');
    localStorage.setItem('hostname', 'sb1.xoken.org');
    localStorage.setItem('port', 9091);
    this.httpsauth();
  };

  componentDidMount() {
    this.test();
  }
  componentDidUpdate() {
    this.test();
  }
}
