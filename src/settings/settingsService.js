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
      auth: { sessionKey, callsRemaining },
    } = await authAPI.login(userName, password);
    if (sessionKey) {
      localStorage.setItem('sessionKey', sessionKey);
      return { sessionKey, callsRemaining };
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
    const nexaHost = 'sb1.xoken.org';
    const nexaPort = 9091;
    const userName = 'ExplorerUser';
    const password = 'OTQ2Nzc1MDIwNDA5MDcyMTM2Ng';
    const { sessionKey, callsRemaining } = await this.setConfig(
      nexaHost,
      nexaPort,
      userName,
      password
    );
    return { nexaHost, nexaPort, userName, password, sessionKey, callsRemaining };
  }

  initHttp(nexaHost, nexaPort) {
    httpClient.init(nexaHost, nexaPort);
  }
}

export default SettingsService;
