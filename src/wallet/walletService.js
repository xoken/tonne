import { wallet, allPay } from 'nipkow-sdk';

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

  async updateTransactionsConfirmations(options) {
    return await wallet.updateTransactionsConfirmations();
  }

  getTransactionFee(receiverAddress, amountInSatoshi, feeRate) {
    return wallet.getTransactionFee(receiverAddress, amountInSatoshi, feeRate);
  }

  async getBalance() {
    return await wallet.getBalance();
  }

  async createSendTransaction(receiverAddress, amountInSatoshi, satoshisPerByte) {
    return await wallet.createSendTransaction(receiverAddress, amountInSatoshi, satoshisPerByte);
  }

  async createAllpaySendTransaction(args) {
    return await allPay.createTransaction(args);
  }

  async getUsedDerivedKeys() {
    return await wallet.getUsedDerivedKeys();
  }

  async getUnusedDerivedKeys(options) {
    return await wallet.getUnusedDerivedKeys(options);
  }
}

export default WalletService;
