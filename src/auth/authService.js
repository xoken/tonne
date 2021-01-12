import { wallet } from 'client-sdk';

class AuthService {
  constructor(store) {
    this.store = store;
  }

  async createProfile(bip39Mnemonic, password) {
    return await wallet.createProfile(bip39Mnemonic, password);
  }

  async updateProfileName(currentProfileName, newProfileName) {
    return await wallet.updateProfileName(currentProfileName, newProfileName);
  }

  async login(profileId, password) {
    return await wallet.login(profileId, password);
  }

  async getProfiles() {
    return await wallet.getProfiles();
  }

  generateMnemonic() {
    return wallet.generateMnemonic();
  }

  logout() {
    return wallet.logout();
  }
}

export default AuthService;
