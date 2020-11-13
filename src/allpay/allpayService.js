import { allPay } from 'nipkow-sdk';

class AllpayService {
  constructor(store) {
    this.store = store;
  }

  async getOutpointForName(name) {
    return await allPay.getOutpointByName(name);
  }

  async buyName(data) {
    return await allPay.getPartiallySignTx(data);
  }
}

export default AllpayService;
