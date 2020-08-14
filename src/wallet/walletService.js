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
      0,
      20,
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
    indexStart,
    count,
    useBip38,
    bip38password,
    useHardenedAddresses
  ) => {
    const derivedAddressess = [];
    for (let i = indexStart; i < indexStart + count; i++) {
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

  getOutputs = async () => {
    const placeholderAdd = '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX';
    try {
      const data = await addressAPI.getOutputsByAddress(placeholderAdd);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  getCurrentBalance = async () => {
    // const {
    //   wallet: { derivedAddressess },
    // } = this.store.getState();
    // const addressess = derivedAddressess.map(
    //   (derivedAddress) => derivedAddress.address
    // );
    const addressess = [];
    addressess.push('14QdCax3sR6ZVMo6smMyUNzN5Fx9zA8Sjj');
    addressess.push('17VaRoTC8dkb6vHyE37EPZByzpKvK1u2ZU');
    addressess.push('1NGw8LYZ93g2RiZpiP4eCniU4YmQjH1tP9');
    addressess.push('1EHM42QUBLSA9AdJGH6XmAMYSnh7rzTPuR');
    addressess.push('1JbmUfm9fpu5o9BfCATRhbp4NiDR5D3UBX');
    addressess.push('14gMdTsvq3Q6PnXK5jhn8KVgvWJnxzDV5m');
    const x = await this.recursiveFunction(addressess);
    debugger;
    return x;
  };

  recursiveFunction = async (
    addresses,
    prevBal = 0,
    prevAddressWithStatus = []
  ) => {
    const { currBal, currOutputs } = await this.getOutputsByAddressesRecursive(
      addresses
    );
    const addressesWithStatus = addresses.map((address) => {
      const found = currOutputs.some((output) => output.address === address);
      return { address, isUsed: found };
    });

    const newBal = prevBal + currBal;
    const newAddressWithStatus = [
      ...prevAddressWithStatus,
      ...addressesWithStatus,
    ];

    const isAllAddressUsed = addressesWithStatus.some((newAddress) => {
      if (newAddress.isUsed === false) {
        return false;
      }
      return true;
    });

    if (isAllAddressUsed) {
      const newAddress = this.getMoreAddressess();
      // const newAddress = this.generateDerivedAddessess()
      return this.recursiveFunction(newAddress, newBal, newAddressWithStatus);
    } else {
      return { currBal: newBal, addressesWithStatus };
    }
  };

  getMoreAddressess() {
    const tempAddressess = [
      '18E2ymquodpWHNhNzo8BC8d6QDwJNsEaYV',
      '1A6NvRKPsswAX8wwPKY4Ti5FBeNCpne1NC',
      '1GXRNe36nJinKjFWcknnGH3VpDj5hh5AYv',
      '19irWGAyKawyFUNvgXEKGKUuAdtpDyXd1b',
      '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX',
    ];
    return tempAddressess;
  }

  getOutputsByAddressesRecursive = async (
    addressess,
    nextCursor,
    prevBal = 0,
    prevOutputs = []
  ) => {
    try {
      const data = await addressAPI.getOutputsByAddresses(
        addressess,
        1000,
        nextCursor
      );
      const currOutputs = [...prevOutputs, ...data.outputs];
      const currBal = data.outputs.reduce((acc, currOutput) => {
        if (!currOutput.spendInfo) {
          acc = acc + currOutput.value;
        }
        return acc;
      }, prevBal);
      if (data.nextCursor) {
        return await this.getOutputsByAddressRecursive(
          addressess,
          data.nextCursor,
          currBal,
          currOutputs
        );
      } else {
        return {
          currBal: currBal,
          currOutputs: currOutputs,
        };
      }
    } catch (error) {
      throw error;
    }
  };
}

export default WalletService;
