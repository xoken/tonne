import { bip32, Network, BIP32Interface } from 'bitcoinjs-lib';
import derivationPaths from './constants/derivationPaths';
import * as bip39 from 'bip39';

class Utils {
  mnemonicToSeed = async (
    bip39Mnemonic: string,
    password?: string
  ): Promise<Buffer> => {
    return await bip39.mnemonicToSeed(bip39Mnemonic, password);
  };

  getSeedHex = (seed: Buffer) => {
    return seed.toString('hex');
  };

  getBIP32RootKeyFromSeedHex = (
    seed: string,
    network?: Network
  ): BIP32Interface => {
    return bip32.fromBase58(seed, network);
  };

  getBIP32RootKeyBase58 = (bip32RootKey: BIP32Interface) => {
    return bip32RootKey.toBase58();
  };

  getAccountExtendedPrivKey = (bip32ExtendedKey: BIP32Interface) => {
    return bip32ExtendedKey.toBase58();
  };

  getAccountExtendedPubKey = (bip32ExtendedKey: any) => {
    return bip32ExtendedKey.neutered().toBase58();
  };

  getDerivationPathAccount = (): string => {
    const { purpose, coin, account } = derivationPaths.BITCOIN_SV.BIP44;
    let path = 'm/';
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    return path;
  };

  getCodePoint(name: string) {
    const nameCodePoints: number[] = [];
    for (let i = 0; i < name.length; i++) {
      nameCodePoints.push(name.codePointAt(i)!);
    }
    return nameCodePoints;
  }

  codePointToName = (codePoints: number[]) => {
    let name = '';
    for (let i = 0; i < codePoints.length; i++) {
      name += String.fromCodePoint(codePoints[i]);
    }
    return name;
  };

  // unique = (array, col) => [...new Set(array.map(() => col))];

  // groupBy = (arr, col) => {
  //   return arr.reduce((finalOutput, currVal) => {
  //     if (!finalOutput[currVal[col]]) {
  //       finalOutput[currVal[col]] = [];
  //     }
  //     finalOutput[currVal[col]].push(currVal);
  //     return finalOutput;
  //   }, {});
  // };

  // chunk = () => {};

  arraysEqual(a: any[], b: any[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  satoshiToBSV = (satoshi: number) => {
    if (satoshi) return satoshi / 100000000;
    return 0;
  };
}

export default new Utils();
