import { wallet, allPay } from 'allegory-allpay-sdk';

class WalletService {
  constructor(store) {
    this.store = store;
  }

  async getTransactions(options) {
    return await wallet.getTransactions(options);
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

  async createTransaction(args) {
    return await wallet.createTransaction(args);
  }

  async createAllpayTransaction(args) {
    return await allPay.createAllpayTransaction(args);
  }

  async getUsedAddresses() {
    return await wallet.getUsedAddresses();
  }

  async getUnusedAddresses(options) {
    return await wallet.getUnusedAddresses(options);
  }

  async getUnregisteredNames() {
    return await wallet.getUnregisteredNames();
  }

  async getAllpayHandles() {
    return await wallet.getAllpayHandles();
  }
}

export default WalletService;
