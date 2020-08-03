import * as Bitcoin from 'bitcoinjs-lib';
export { addressAPI } from './AddressAPI';
export { authAPI } from './AuthAPI';
export { blockAPI } from './BlockAPI';
export { chainAPI } from './ChainAPI';
export { merkleBranchAPI } from './MerkleBranchAPI';
export { scriptHashAPI } from './ScriptHashAPI';
export { transactionAPI } from './TransactionAPI';
export { userAPI } from './UserAPI';

export const generateRandomAddress = () => {
  return Bitcoin.ECPair.makeRandom().toWIF();
};

// export const generateAddressFromWIF = (wifString: string) => {
//   return Bitcoin.ECPair.fromWIF(wifString);
// };

// export const createTransaction = () => {
//   const transaction = new Bitcoin.Transaction();
// };
