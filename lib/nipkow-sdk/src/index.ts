import * as Bitcoin from 'bitcoinjs-lib';
export { AuthAPI } from './AuthAPI';
export { UserAPI } from './UserAPI';

export const generateRandomAddress = () => {
  return Bitcoin.ECPair.makeRandom().toWIF();
};

// export const generateAddressFromWIF = (wifString: string) => {
//   return Bitcoin.ECPair.fromWIF(wifString);
// };

// export const createTransaction = () => {
//   const transaction = new Bitcoin.Transaction();
// };
