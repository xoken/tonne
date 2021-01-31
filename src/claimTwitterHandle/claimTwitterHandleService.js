import { authAPI, allPay, getCoin } from 'allegory-allpay-sdk';

class ClaimTwitterHandleService {
  constructor(store) {
    this.store = store;
  }

  async getTwitterFollowers(oauthToken, oauthTokenSecret) {
    return await authAPI.getTwitterFollowers(oauthToken, oauthTokenSecret);
  }

  async getPurchasedNames(args) {
    return await allPay.getPurchasedNames(args);
  }

  async getCoin(args) {
    return await getCoin(args);
  }
}

export default ClaimTwitterHandleService;
