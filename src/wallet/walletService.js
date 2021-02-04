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

  async createSendTransaction(receiverAddress, amountInSatoshi, satoshisPerByte) {
    return await wallet.createSendTransaction(receiverAddress, amountInSatoshi, satoshisPerByte);
  }

  async createAllpaySendTransaction(args) {
    return await allPay.createTransaction(args);
  }

  async getUsedAddresses() {
    return await wallet.getUsedAddresses();
  }

  async getUnusedAddresses(options) {
    return await wallet.getUnusedAddresses(options);
  }

  async getAllpayHandle() {
    return await wallet.getAllpayHandle();
  }
}

export default WalletService;
