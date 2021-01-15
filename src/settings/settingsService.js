import { httpClient, authAPI } from 'client-sdk';

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
    const {
      REACT_APP_NEXA_HOST: nexaHost,
      REACT_APP_NEXA_PORT: nexaPort,
      REACT_APP_NEXA_USERNAME: userName,
      REACT_APP_NEXA_PASSWORD: password,
    } = process.env;
    const { sessionKey } = await this.setConfig(nexaHost, nexaPort, userName, password);
    return { nexaHost, nexaPort, userName, password, sessionKey };
  }

  initHttp(nexaHost, nexaPort) {
    httpClient.init(nexaHost, nexaPort);
  }
}

export default SettingsService;
