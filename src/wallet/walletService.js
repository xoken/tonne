import { wallet } from 'nipkow-sdk';

class WalletService {
  constructor(store) {
    this.store = store;
  }

  async initWallet(bip39Mnemonic) {
    return await wallet.initWallet(bip39Mnemonic);
  }

  async getOutputs() {
    return await wallet.getOutputs();
  }

  async getBalance() {
    return await wallet.getBalance();
  }

  async createSendTransaction(receiverAddress, amountInSatoshi, transactionFee) {
    return await wallet.createSendTransaction(receiverAddress, amountInSatoshi, transactionFee);
  }
}

export default WalletService;
