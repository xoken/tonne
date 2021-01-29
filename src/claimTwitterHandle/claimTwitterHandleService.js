import { authAPI, allPay } from 'allegory-allpay-sdk';

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
}

export default ClaimTwitterHandleService;
