import { allPay, wallet } from 'allegory-allpay-sdk';

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
}

export default MailService;
