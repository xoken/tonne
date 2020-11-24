import { httpClient, authAPI } from 'nipkow-sdk';

class SettingsService {
  constructor(store) {
    this.store = store;
  }

  async changeConfig(nexaHost, nexaPort, userName, password) {
    return await this.setConfig(nexaHost, nexaPort, userName, password);
  }

  async setConfig(nexaHost, nexaPort, userName, password) {
    httpClient.init(nexaHost, nexaPort);
    const {
      auth: { sessionKey },
    } = await authAPI.login(userName, password);
    if (sessionKey) {
      localStorage.setItem('userName', userName);
      localStorage.setItem('password', password);
      localStorage.setItem('sessionKey', sessionKey);
      return { sessionKey };
    } else {
      throw new Error('Incorrect settings');
    }
  }

  async testConfig(nexaHost, nexaPort, userName, password) {
    httpClient.init(nexaHost, nexaPort);
    const {
      auth: { sessionKey },
    } = await authAPI.login(userName, password);
    if (sessionKey) {
      return true;
    } else {
      throw new Error('Incorrect settings');
    }
  }

  async setDefaultConfig() {
    // const nexaHost = 'sb2.xoken.org';
    // const nexaPort = 9091;
    // const userName = 'ExplorerUser';
    // const password = 'MjYxNjM5NjQyMjU0NzMxMjQyNw';
    const nexaHost = '127.0.0.1';
    const nexaPort = 9091;
    const userName = 'admin';
    const password = 'ODI3MDg3MjA1MDI3MzcyNDQzNA';
    const { sessionKey } = await this.setConfig(nexaHost, nexaPort, userName, password);
    return { nexaHost, nexaPort, userName, password, sessionKey };
  }

  initHttp(nexaHost, nexaPort) {
    httpClient.init(nexaHost, nexaPort);
  }
}

export default SettingsService;
