import { wallet } from 'nipkow-sdk';

class AuthService {
  constructor(store) {
    this.store = store;
  }

  async createProfile(bip39Mnemonic, password) {
    return await wallet.createProfile(bip39Mnemonic, password);
  }

  async login(profile, password) {
    return await wallet.login(profile, password);
  }

  async getProfiles() {
    return await wallet.getProfiles();
  }

  generateMnemonic = () => {
    return wallet.generateMnemonic();
  };
}

export default AuthService;
