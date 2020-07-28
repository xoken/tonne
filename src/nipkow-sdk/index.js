export * from "./address";

import * as Bitcoin from "bitcoinjs-lib";

export const generateRandomAddress = () => {
  return Bitcoin.ECPair.makeRandom().toWIF();
};

export const generateAddressFromWIF = (wifString) => {
  return Bitcoin.ECPair.fromWIF(wifString);
};

export const createTransaction = () => {
  const transaction = new Bitcoin.Transaction();
};
