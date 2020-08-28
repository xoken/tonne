import { utils } from 'nipkow-sdk';

class AuthService {
  constructor(store) {
    this.store = store;
  }

  generateMnemonic = () => {
    return utils.generateMnemonic();
  };

  login = (bip39Passphrase, existingBip39Passphrase) => {
    return bip39Passphrase === existingBip39Passphrase;
  };
}

export default AuthService;
