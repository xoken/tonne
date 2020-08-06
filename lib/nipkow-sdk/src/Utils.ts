import * as Bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';

class Utils {
  generateMnemonic = (): string => {
    return bip39.generateMnemonic();
  };

  mnemonicToSeed = async (mnemonic: string) => {
    const buffer = await bip39.mnemonicToSeed(mnemonic);
    return buffer;
  };

  generateMasterPrivateKey = (seed: Buffer) => {
    const BITCOIN_SV = {
      bip32: {
        public: 76067358,
        private: 76066276,
      },
      messagePrefix: 'unused',
      pubKeyHash: 0,
      scriptHash: 5,
      wif: 128,
    };
    return Bitcoin.bip32.fromSeed(seed, BITCOIN_SV);
  };

  calcBip32ExtendedKey = (path: string, bip32RootKey: any) => {
    if (!bip32RootKey) {
      return bip32RootKey;
    }
    var extendedKey = bip32RootKey;
    var pathBits = path.split('/');
    for (var i = 0; i < pathBits.length; i++) {
      var bit = pathBits[i];
      var index = parseInt(bit);
      if (isNaN(index)) {
        continue;
      }
      var hardened = bit[bit.length - 1] == "'";
      var isPriv = !extendedKey.isNeutered();
      var invalidDerivationPath = hardened && !isPriv;
      if (invalidDerivationPath) {
        extendedKey = null;
      } else if (hardened) {
        extendedKey = extendedKey.deriveHardened(index);
      } else {
        extendedKey = extendedKey.derive(index);
      }
    }
    return extendedKey;
  };

  derivePath = (seed: Buffer, path: string) => {
    return Bitcoin.bip32
      .fromSeed(seed)
      .derivePath(path)
      .privateKey?.toString('hex');
  };
}

export const utils = new Utils();
