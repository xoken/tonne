import { utils } from 'nipkow-sdk';

class WalletService {
  constructor(store) {
    this.store = store;
  }

  generateMnemonic = () => {
    return utils.generateMnemonic();
  };
}
export default WalletService;
