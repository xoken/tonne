import { wallet, httpClient, authAPI } from 'client-sdk';

class SettingsService {
  constructor(store) {
    this.store = store;
  }

  async changeConfig(nexaURL, userName, password) {
    return await this._setConfig(nexaURL, userName, password);
  }

  async testConfig(nexaURL, userName, password) {
    httpClient.init(nexaURL);
    const {
      auth: { sessionKey },
    } = await authAPI.login(userName, password);
    if (sessionKey) {
      return true;
    } else {
      throw new Error('Incorrect settings');
    }
  }

  async _setConfig({ nexaURL, userName, password, network }) {
    try {
      const { sessionKey } = await wallet.init({ nexaURL, userName, password, network });
      if (sessionKey) {
        localStorage.setItem('userName', userName);
        localStorage.setItem('password', password);
        localStorage.setItem('sessionKey', sessionKey);
        return { sessionKey };
      } else {
        throw new Error('Incorrect settings');
      }
    } catch (error) {
      throw error;
    }
  }

  async setConfig() {
    const {
      REACT_APP_NEXA_URL: nexaURL,
      REACT_APP_NEXA_USERNAME: userName,
      REACT_APP_NEXA_PASSWORD: password,
      REACT_APP_NETWORK: network,
    } = process.env;
    try {
      const { sessionKey } = await this._setConfig({ nexaURL, userName, password, network });
      return { nexaURL, userName, password, sessionKey };
    } catch (error) {
      throw error;
    }
  }
}

export default SettingsService;
