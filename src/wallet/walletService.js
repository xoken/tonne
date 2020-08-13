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
    addressess.push('14QdCax3sR6ZVMo6smMyUNzN5Fx9zA8Sjj');
    addressess.push('17VaRoTC8dkb6vHyE37EPZByzpKvK1u2ZU');
    addressess.push('1NGw8LYZ93g2RiZpiP4eCniU4YmQjH1tP9');
    addressess.push('1EHM42QUBLSA9AdJGH6XmAMYSnh7rzTPuR');
    addressess.push('1JbmUfm9fpu5o9BfCATRhbp4NiDR5D3UBX');
    addressess.push('14gMdTsvq3Q6PnXK5jhn8KVgvWJnxzDV5m');
    addressess.push('18E2ymquodpWHNhNzo8BC8d6QDwJNsEaYV');
    addressess.push('1A6NvRKPsswAX8wwPKY4Ti5FBeNCpne1NC');
    addressess.push('18TLpiL4UFwmQY8nnnjmh2um11dFzZnBd9');
    addressess.push('1GXRNe36nJinKjFWcknnGH3VpDj5hh5AYv');
    addressess.push('19irWGAyKawyFUNvgXEKGKUuAdtpDyXd1b');

    const bal = await this.recursive(addressess);
    console.log(bal);
    return utils.getCurrentBalance();
  };

  recursive = async (addressess, cursor, currBal = 0) => {
    // const dummyAddress = '18TLpiL4UFwmQY8nnnjmh2um11dFzZnBd9';
    try {
      const data = await addressAPI.getOutputsByAddress(
        addressess,
        1000,
        cursor
      );
      console.log(data);
      const dummyData = { nextCursor: "5", outputs: [1, 2, 3, 4, 5] };
      const balance = dummyData.outputs.reduce(
        (acc, currValue, currIndex, array) => {
          return acc + currValue;
        },
        currBal
      );
      if (!cursor) {
        this.recursive(addressess, dummyData.nextCursor, balance);
      } else {
        return balance;
      }
    } catch (error) {
      throw error;
    }
  };

  getAllTx = async () => {
    const placeholderAdd = "12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX";
    try {
      const data = await addressAPI.getOutputsByAddress(placeholderAdd, 5);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
}

export default WalletService;
