import { wallet } from 'nipkow-sdk';

class WalletService {
  constructor(store) {
    this.store = store;
  }

  async getTransactions(options) {
    return await wallet.getTransactions(options);
  }

  async updateUnconfirmedTransactions(options) {
    return await wallet.updateUnconfirmedTransactions();
  }

  async getOutputs(options) {
    return await wallet.getOutputs(options);
  }

  async getUTXOs() {
    return await wallet.getUTXOs();
  }

  getTransactionFee(receiverAddress, amountInSatoshi, feeRate) {
    return wallet.getTransactionFee(receiverAddress, amountInSatoshi, feeRate);
  }

  async getTransaction(txid) {
    return await wallet.getTransaction(txid);
  }

  async getBalance() {
    return await wallet.getBalance();
  }

  async createSendTransaction(receiverAddress, amountInSatoshi, satoshisPerByte) {
    return await wallet.createSendTransaction(receiverAddress, amountInSatoshi, satoshisPerByte);
  }

  async getUsedDerivedKeys() {
    return await wallet.getUsedDerivedKeys();
  }

  async getUnusedDerivedKeys(options) {
    return await wallet.getUnusedDerivedKeys(options);
  }
}

export default WalletService;
