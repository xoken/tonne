export const satoshiToBSV = (satoshi) => {
  return satoshi / 100000000;
};

export const unique = (array, col) => [...new Set(array.map(() => col))];

export const groupBy = (arr, col) => {
  return arr.reduce((finalOutput, currVal) => {
    if (!finalOutput[currVal[col]]) {
      finalOutput[currVal[col]] = [];
    }
    finalOutput[currVal[col]].push(currVal);
    return finalOutput;
  }, {});
};
