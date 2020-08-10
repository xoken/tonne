import * as networks from './constants/networks';
import * as derivationPaths from './constants/derivationPaths';

export { addressAPI } from './AddressAPI';
export { authAPI } from './AuthAPI';
export { blockAPI } from './BlockAPI';
export { chainAPI } from './ChainAPI';
export { merkleBranchAPI } from './MerkleBranchAPI';
export { scriptHashAPI } from './ScriptHashAPI';
export { transactionAPI } from './TransactionAPI';
export { userAPI } from './UserAPI';
export { networks, derivationPaths };
export { utils } from './Utils';

// import { utils } from "nipkow-sdk";

// // const mnemonic = utils.generateMnemonic();
// const mnemonic =
//   "marine wild ranch since gallery asthma liquid tennis finish express over blanket present place swing";
// console.log(mnemonic);
// utils.mnemonicToSeed(mnemonic).then((buffer) => {
//   const masterPrivateKey = utils.generateMasterPrivateKey(buffer);
//   debugger;
//   console.log(`master private key ${masterPrivateKey}`);
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/0`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/1`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/2`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/3`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/4`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/5`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/6`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/7`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/8`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/9`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/10`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/11`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/12`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/13`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/14`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/15`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/16`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/17`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/18`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/19`));
// console.log(utils.derivePath(buffer, `m/44'/236'/0'/0/20`));
// });
