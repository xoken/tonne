import { allPay } from 'nipkow-sdk';

class AllpayService {
  constructor(store) {
    this.store = store;
  }

  async getOutpointForName(name) {
    return await allPay.getOutpointForName(name);
  }

  async buyName(data) {
    return await allPay.buyName(data);
  }

  async registerName(data) {
    return await allPay.registerName(data);
  }

  async relayTransaction(transactionHex) {
    return await allPay.relayTransaction(transactionHex);
  }
}

export default AllpayService;
