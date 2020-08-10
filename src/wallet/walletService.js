import { utils, networks, derivationPaths } from 'nipkow-sdk';

class WalletService {
  constructor(store) {
    this.store = store;
  }

  generateMnemonic = (password) => {
    const mnemonic = utils.generateMnemonic();
    const seed = utils.mnemonicToSeedSync(mnemonic, password);
    const seedHex = utils.getSeedHex(seed);
    const bip32RootKey = utils.getBIP32RootKeyFromSeed(
      seed,
      networks.BITCOIN_SV
    );
    const bip32RootKeyBase58 = utils.getBIP32RootKeyBase58(bip32RootKey);
    const bip32ExtendedKey = utils.getBIP32ExtendedKey(
      derivationPaths.BITCOIN_SV.root,
      bip32RootKey
    );
    const accountExtendedKey = utils.getBIP32ExtendedKey(
      derivationPaths.BITCOIN_SV.account,
      bip32RootKey
    );
    const accountExtendedPrivateKey = utils.getAccountExtendedPrivKey(
      accountExtendedKey
    );
    const accountExtendedPublicKey = utils.getAccountExtendedPubKey(
      accountExtendedKey
    );
    const bip32ExtendedPrivateKey = utils.getBIP32ExtendedPrivKey(
      bip32ExtendedKey
    );
    const bip32ExtendedPublicKey = utils.getBIP32ExtendedPubKey(
      bip32ExtendedKey
    );
    return {
      seedHex,
      bip32RootKeyBase58,
      accountExtendedPrivateKey,
      accountExtendedPublicKey,
      bip32ExtendedPrivateKey,
      bip32ExtendedPublicKey,
    };
  };

  generateKeysFromMnemonic = (mnemonic, password) => {
    const seed = utils.mnemonicToSeedSync(mnemonic, password);
    const seedHex = utils.getSeedHex(seed);
    const bip32RootKey = utils.getBIP32RootKeyFromSeed(
      seed,
      networks.BITCOIN_SV
    );
    const bip32RootKeyBase58 = utils.getBIP32RootKeyBase58(bip32RootKey);
    const bip32ExtendedKey = utils.getBIP32ExtendedKey(
      derivationPaths.BITCOIN_SV.root,
      bip32RootKey
    );

    const accountExtendedKey = utils.getBIP32ExtendedKey(
      derivationPaths.BITCOIN_SV.account,
      bip32RootKey
    );
    const accountExtendedPrivateKey = utils.getAccountExtendedPrivKey(
      accountExtendedKey
    );
    const accountExtendedPublicKey = utils.getAccountExtendedPubKey(
      accountExtendedKey
    );
    const bip32ExtendedPrivateKey = utils.getBIP32ExtendedPrivKey(
      bip32ExtendedKey
    );
    const bip32ExtendedPublicKey = utils.getBIP32ExtendedPubKey(
      bip32ExtendedKey
    );

    utils.generateDerivedAddress(bip32ExtendedKey, 0, false);
    // utils.generateDerivedAddress(bip32ExtendedKey, 1);
    // utils.generateDerivedAddress(bip32ExtendedKey, 2);
    // utils.generateDerivedAddress(bip32ExtendedKey, 3);
    // utils.generateDerivedAddress(bip32ExtendedKey, 4);
    return {
      seedHex,
      bip32RootKeyBase58,
      accountExtendedPrivateKey,
      accountExtendedPublicKey,
      bip32ExtendedPrivateKey,
      bip32ExtendedPublicKey,
    };
  };

  getCurrentBalance = () => {
    return 100;
  };
}

export default WalletService;
