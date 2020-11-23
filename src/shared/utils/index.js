export const satoshiToBSV = satoshi => {
  if (satoshi) return satoshi / 100000000;
  return 0;
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

export const getCodePoint = name => {
  const nameCodePoints = [];
  for (let i = 0; i < name.length; i++) {
    nameCodePoints.push(name.codePointAt(i));
  }
  return nameCodePoints;
};

export const codePointToName = codePoints => {
  let name = '';
  for (let i = 0; i < codePoints.length; i++) {
    name += String.fromCodePoint(codePoints[i]);
  }
  return name;
};
