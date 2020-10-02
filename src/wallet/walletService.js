import { wallet } from 'nipkow-sdk';

class WalletService {
  constructor(store) {
    this.store = store;
  }

  async getOutputs(options) {
    return await wallet.getOutputs(options);
  }

  async getUTXOs() {
    return await wallet.getUTXOs();
  }

  getTransactionFee(receiverAddress, amountInSatoshi) {
    return wallet.getTransactionFee(receiverAddress, amountInSatoshi);
  }

  async getTransaction(txid) {
    return await wallet.getTransaction(txid);
  }

  async getBalance() {
    return await wallet.getBalance();
  }

  async createSendTransaction(receiverAddress, amountInSatoshi, transactionFee) {
    return await wallet.createSendTransaction(receiverAddress, amountInSatoshi, transactionFee);
  }

  async getAddressInfo() {
    return await wallet.getAddressInfo();
  }
}

export default WalletService;
