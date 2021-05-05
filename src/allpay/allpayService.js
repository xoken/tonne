import { allPay } from 'allegory-allpay-sdk';

class AllpayService {
  constructor(store) {
    this.store = store;
  }

  async getResellerURI(name) {
    return await allPay.getResellerURI(name);
  }

  async buyName(data) {
    return await allPay.buyName(data);
  }

  async registerName(args) {
    return await allPay.registerName(args);
  }

  async signRelayTransaction(data) {
    return await allPay.signRelayTransaction(data);
  }
}

export default AllpayService;
