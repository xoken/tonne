import { allPay, wallet, persist } from 'allegory-allpay-sdk';

class MailService {
  constructor(store) {
    this.store = store;
  }
  async createMailTransaction(args) {
    return await allPay.createMailTransaction(args);
  }
  async getMailTransactions(options) {
    return await wallet.getMailTransactions(options);
  }
  async updateTransaction(transaction) {
    await persist.updateTransaction(transaction);
  }
}

export default MailService;
