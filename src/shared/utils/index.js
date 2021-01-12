export const satoshiToBSV = satoshi => {
  if (satoshi) return `${satoshi / 100000000} BSV`;
  return '0';
};
