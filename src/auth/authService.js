import { wallet } from 'nipkow-sdk';

class AuthService {
  constructor(store) {
    this.store = store;
  }

  generateMnemonic = () => {
    return wallet.generateMnemonic();
  };

  login = (bip39Passphrase, existingBip39Passphrase) => {
    return bip39Passphrase === existingBip39Passphrase;
  };
}

export default AuthService;
