import { allPay } from 'client-sdk';

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

  async registerName(data) {
    return await allPay.registerName(data);
  }

  async signRelayTransaction(data) {
    return await allPay.signRelayTransaction(data);
  }
}

export default AllpayService;
