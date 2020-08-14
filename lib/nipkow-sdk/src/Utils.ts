import {
  Network,
  bip32,
  BIP32Interface,
  ECPair,
  payments,
} from 'bitcoinjs-lib';
import derivationPaths from './constants/derivationPaths';
import * as bip38 from 'bip38';
import * as bip39 from 'bip39';

class Utils {
  generateMnemonic = (
    strength?: number,
    rng?: (size: number) => Buffer,
    wordlist?: string[]
  ): string => {
    return bip39.generateMnemonic(strength, rng, wordlist);
  };

  mnemonicToSeedSync = (bip39Mnemonic: string, password?: string): Buffer => {
    return bip39.mnemonicToSeedSync(bip39Mnemonic, password);
  };

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
    for (let i = 0; i < pathBits.length; i++) {
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
    const { purpose, coin, account, change } = derivationPaths.BITCOIN_SV;
    let path = 'm/';
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
  };

  getDerivationPathAccount = (): string => {
    const { purpose, coin, account } = derivationPaths.BITCOIN_SV;
    let path = 'm/';
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    return path;
  };

  generateDerivedAddress = (
    bip32ExtendedKey: BIP32Interface,
    index: number,
    useBip38?: boolean,
    bip38password: string = '',
    useHardenedAddresses?: boolean
  ) => {
    let key;
    if (useHardenedAddresses) {
      key = bip32ExtendedKey.deriveHardened(index);
    } else {
      key = bip32ExtendedKey.derive(index);
    }
    const useUncompressed = useBip38;
    let keyPair = ECPair.fromPrivateKey(key.privateKey!);
    if (useUncompressed) {
      keyPair = ECPair.fromPrivateKey(key.privateKey!, { compressed: false });
    }
    const address = payments.p2pkh({ pubkey: keyPair.publicKey }).address!;
    const hasPrivkey = !key.isNeutered();
    let privkey;
    if (hasPrivkey) {
      privkey = keyPair.toWIF();
      if (useBip38) {
        privkey = bip38.encrypt(keyPair.privateKey!, false, bip38password);
      }
    }
    const pubkey = keyPair.publicKey.toString('hex');
    let indexText = this.getDerivationPath() + '/' + index;
    if (useHardenedAddresses) {
      indexText = indexText + "'";
    }
    return { indexText, address, pubkey, privkey };
  };
}

export const utils = new Utils();
