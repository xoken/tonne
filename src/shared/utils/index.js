export const satoshiToBSV = satoshi => {
  if (satoshi) return satoshi / 100000000;
  return 0;
};
