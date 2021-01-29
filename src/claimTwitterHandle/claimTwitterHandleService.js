import { authAPI, allPay } from 'allegory-allpay-sdk';

class ClaimTwitterHandleService {
  constructor(store) {
    this.store = store;
  }

  async getTwitterFollowers(screenName, oauthToken, oauthTokenSecret) {
    return await authAPI.getTwitterFollowers(screenName, oauthToken, oauthTokenSecret);
  }

  async getPurchasedNames(args) {
    return await allPay.getPurchasedNames(args);
  }
}

export default ClaimTwitterHandleService;
