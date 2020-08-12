import { utils, networks, addressAPI } from 'nipkow-sdk';

class WalletService {
  constructor(store) {
    this.store = store;
  }

  initWallet = (bip39Mnemonic, password) => {
    if (!bip39Mnemonic) {
      bip39Mnemonic = utils.generateMnemonic();
    }
    const seed = utils.mnemonicToSeedSync(bip39Mnemonic, password);
    const bip39SeedHex = utils.getSeedHex(seed);
    const bip32RootKey = utils.getBIP32RootKeyFromSeed(
      seed,
      networks.BITCOIN_SV
    );
    const bip32RootKeyBase58 = utils.getBIP32RootKeyBase58(bip32RootKey);
    const bip32ExtendedKey = utils.getBIP32ExtendedKey(
      utils.getDerivationPath(),
      bip32RootKey
    );
    const accountExtendedKey = utils.getBIP32ExtendedKey(
      utils.getDerivationPathAccount(),
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
    const derivedAddressess = this.generateDerivedAddessess(
      bip32ExtendedKey,
      2,
      false
    );

    return {
      bip39Mnemonic,
      bip39SeedHex,
      bip32RootKeyBase58,
      accountExtendedPrivateKey,
      accountExtendedPublicKey,
      bip32ExtendedPrivateKey,
      bip32ExtendedPublicKey,
      derivedAddressess,
    };
  };

  generateDerivedAddessess = (
    bip32ExtendedKey,
    count,
    useBip38,
    bip38password,
    useHardenedAddresses
  ) => {
    const derivedAddressess = [];
    for (let i = 0; i < count; i++) {
      const derivedKey = utils.generateDerivedAddress(
        bip32ExtendedKey,
        i,
        useBip38,
        bip38password,
        useHardenedAddresses
      );
      derivedAddressess.push(derivedKey);
    }
    return derivedAddressess;
  };

  getCurrentBalance = async () => {
    const {
      wallet: { derivedAddressess },
    } = this.store.getState();
    const addressess = derivedAddressess.map(
      (derivedAddress) => derivedAddress.address
    );
    const dummyAddress = '18TLpiL4UFwmQY8nnnjmh2um11dFzZnBd9';
    debugger;
    try {
      const data = await addressAPI.getOutputsByAddress(dummyAddress);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    console.log(addressess);
    return utils.getCurrentBalance();
  };
}

export default WalletService;
