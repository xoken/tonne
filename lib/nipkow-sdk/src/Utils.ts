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

  isEqualOutput = (
    utxo1: { outputTxHash: any; outputIndex: any },
    utxo2: { outputTxHash: any; outputIndex: any }
  ) => {
    return (
      utxo1.outputTxHash === utxo2.outputTxHash &&
      utxo1.outputIndex === utxo2.outputIndex
    );
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
}

export default new Utils();
