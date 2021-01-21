import { wallet, httpClient, authAPI } from 'allegory-allpay-sdk';

class SettingsService {
  constructor(store) {
    this.store = store;
  }

  async changeConfig(nexaURI, userName, password) {
    return await this._setConfig(nexaURI, userName, password);
  }

  async testConfig(nexaURI, userName, password) {
    httpClient.init(nexaURI);
    const {
      auth: { token },
    } = await authAPI.login(userName, password);
    if (token) {
      return true;
    } else {
      throw new Error('Incorrect settings');
    }
  }

  async _setConfig({ nexaURI, userName, password, nexaToken, network }) {
    try {
      const { token } = await wallet.init({ nexaURI, userName, password, nexaToken, network });
      if (token) {
        // localStorage.setItem('userName', userName);
        // localStorage.setItem('password', password);
        // localStorage.setItem('token', token);
        return { token };
      } else {
        throw new Error('Incorrect settings');
      }
    } catch (error) {
      throw error;
    }
  }

  async setConfig() {
    const {
      REACT_APP_NEXA_URI: nexaURI,
      REACT_APP_NEXA_USERNAME: userName,
      REACT_APP_NEXA_PASSWORD: password,
      REACT_APP_NEXA_TOKEN: nexaToken,
      REACT_APP_NETWORK: network,
    } = process.env;
    try {
      const { token } = await this._setConfig({ nexaURI, userName, password, nexaToken, network });
      return { nexaURI, userName, password, token };
    } catch (error) {
      throw error;
    }
  }
}

export default SettingsService;
