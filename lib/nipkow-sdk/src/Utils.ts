import { Network, bip32, BIP32Interface, payments } from 'bitcoinjs-lib';
import * as bip39 from 'bip39';

class Utils {
  generateMnemonic = (
    strength?: number,
    rng?: (size: number) => Buffer,
    wordlist?: string[]
  ): string => {
    return bip39.generateMnemonic(strength, rng, wordlist);
  };

  mnemonicToSeedSync = (mnemonic: string, password?: string): Buffer => {
    return bip39.mnemonicToSeedSync(mnemonic, password);
  };

  mnemonicToSeed = async (
    mnemonic: string,
    password?: string
  ): Promise<Buffer> => {
    return await bip39.mnemonicToSeed(mnemonic, password);
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

  getBIP32RootKeyFromSeed = (
    seed: Buffer,
    network?: Network
  ): BIP32Interface => {
    return bip32.fromSeed(seed, network);
  };

  getBIP32RootKeyBase58 = (bip32RootKey: BIP32Interface) => {
    return bip32RootKey.toBase58();
  };

  getBIP32ExtendedKey = (
    path: string,
    bip32RootKey: BIP32Interface
  ): BIP32Interface => {
    if (!bip32RootKey) {
      return bip32RootKey;
    }
    let extendedKey = bip32RootKey;
    const pathBits = path.split('/');
    for (var i = 0; i < pathBits.length; i++) {
      const bit = pathBits[i];
      const index = parseInt(bit);
      if (isNaN(index)) {
        continue;
      }
      const hardened = bit[bit.length - 1] === "'";
      if (hardened) {
        extendedKey = extendedKey.deriveHardened(index);
      } else {
        extendedKey = extendedKey.derive(index);
      }
    }
    return extendedKey;
  };

  getAccountExtendedPrivKey = (bip32ExtendedKey: BIP32Interface) => {
    return bip32ExtendedKey.toBase58();
  };

  getAccountExtendedPubKey = (bip32ExtendedKey: BIP32Interface) => {
    return bip32ExtendedKey.neutered().toBase58();
  };

  getBIP32ExtendedPrivKey = (bip32ExtendedKey: BIP32Interface) => {
    let xprvkeyB58 = 'NA';
    if (!bip32ExtendedKey.isNeutered()) {
      xprvkeyB58 = bip32ExtendedKey.toBase58();
    }
    return xprvkeyB58;
  };

  getBIP32ExtendedPubKey = (bip32ExtendedKey: BIP32Interface) => {
    return bip32ExtendedKey.neutered().toBase58();
  };

  getDerivationPath = (): string => {
    const purpose = 44;
    const coin = 0;
    const account = 0;
    const change = 0;
    let path = 'm/';
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
  };

  generateDerivedAddress = (
    bip32ExtendedKey: BIP32Interface,
    index: number,
    // bip38password?: string,
    useHardenedAddresses?: boolean
    // useBip38?: boolean
  ) => {
    debugger;
    let key;
    if (useHardenedAddresses) {
      key = bip32ExtendedKey.deriveHardened(index);
    } else {
      key = bip32ExtendedKey.derive(index);
    }
    console.log(key);
    const addr = payments.p2pkh({ pubkey: key.publicKey }).address!;
    console.log(addr);
  };
}

export const utils = new Utils();
