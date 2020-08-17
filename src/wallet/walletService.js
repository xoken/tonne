import { utils, networks, addressAPI, transactionAPI } from 'nipkow-sdk';

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
    const derivedKeys = this.generateDerivedKeys(
      bip32ExtendedKey,
      0,
      20,
      false
    );
    return {
      bip39Mnemonic,
      bip39SeedHex,
      bip32RootKeyBase58,
      bip32ExtendedKey,
      accountExtendedPrivateKey,
      accountExtendedPublicKey,
      bip32ExtendedPrivateKey,
      bip32ExtendedPublicKey,
      derivedKeys,
    };
  };

  getCurrentBalance = async () => {
    const {
      wallet: { derivedKeys },
    } = this.store.getState();
    return await this.calculateBalance(derivedKeys);
  };

  generateDerivedKeys = (
    bip32ExtendedKey,
    indexStart,
    count,
    useBip38,
    bip38password,
    useHardenedAddresses
  ) => {
    if (indexStart === 0) {
      const addressess = [];
      addressess.push({
        address: '14QdCax3sR6ZVMo6smMyUNzN5Fx9zA8Sjj',
        isUsed: false,
      });
      addressess.push({
        address: '17VaRoTC8dkb6vHyE37EPZByzpKvK1u2ZU',
        isUsed: false,
      });
      addressess.push({
        address: '1NGw8LYZ93g2RiZpiP4eCniU4YmQjH1tP9',
        isUsed: false,
      });
      addressess.push({
        address: '1EHM42QUBLSA9AdJGH6XmAMYSnh7rzTPuR',
        isUsed: false,
      });
      addressess.push({
        address: '1JbmUfm9fpu5o9BfCATRhbp4NiDR5D3UBX',
        isUsed: false,
      });
      addressess.push({
        address: '14gMdTsvq3Q6PnXK5jhn8KVgvWJnxzDV5m',
        isUsed: false,
      });
      return addressess;
    }

    const derivedKeys = [];
    for (let i = indexStart; i < indexStart + count; i++) {
      const derivedKey = utils.generateDerivedAddress(
        bip32ExtendedKey,
        i,
        useBip38,
        bip38password,
        useHardenedAddresses
      );
      derivedKeys.push({ ...derivedKey, isUsed: false });
    }
    return derivedKeys;
  };

  calculateBalance = async (
    keys,
    prevBalance = 0,
    prevOutputs = [],
    prevKeys = []
  ) => {
    const { balance, outputs } = await this.getOutputsByAddresses(keys);
    const updatedKeys = keys.map((key) => {
      const found = outputs.some((output) => output.address === key.address);
      return { ...key, isUsed: found };
    });
    const newBalance = prevBalance + balance;
    const newKeys = [...prevKeys, ...updatedKeys];
    const newOutputs = [...prevOutputs, ...outputs];
    const isAllKeyUsed = updatedKeys.some((key) => {
      if (key.isUsed === false) {
        return false;
      }
      return true;
    });
    const {
      wallet: { bip32ExtendedKey },
    } = this.store.getState();
    if (isAllKeyUsed) {
      const newDerivedKeys = this.generateDerivedKeys(
        bip32ExtendedKey,
        newKeys.length,
        20,
        false
      );
      return this.calculateBalance(
        newDerivedKeys,
        newBalance,
        newOutputs,
        newKeys
      );
    } else {
      const countOfUnusedKeys = updatedKeys.reduce((acc, currKey) => {
        if (!currKey.isUsed) {
          acc = acc + 1;
        }
        return acc;
      }, 0);
      if (countOfUnusedKeys < 20) {
        const remainingDerivedKeys = this.generateDerivedKeys(
          bip32ExtendedKey,
          newKeys.length,
          20 - countOfUnusedKeys,
          false
        );
        return {
          balance: newBalance,
          outputs: newOutputs,
          derivedKeys: [...newKeys, ...remainingDerivedKeys],
        };
      }
      return { balance: newBalance, outputs: newOutputs, derivedKeys: newKeys };
    }
  };

  getOutputsByAddresses = async (
    keys,
    nextCursor,
    prevBalance = 0,
    prevOutputs = []
  ) => {
    const addressess = keys.map((key) => key.address);
    try {
      const data = await addressAPI.getOutputsByAddresses(
        addressess,
        1000,
        nextCursor
      );
      const balance = data.outputs.reduce((acc, currOutput) => {
        if (!currOutput.spendInfo) {
          acc = acc + currOutput.value;
        }
        return acc;
      }, prevBalance);
      const outputs = [...prevOutputs, ...data.outputs];
      if (data.nextCursor) {
        return await this.getOutputsByAddresses(
          keys,
          data.nextCursor,
          balance,
          outputs
        );
      } else {
        return {
          balance,
          outputs,
        };
      }
    } catch (error) {
      throw error;
    }
  };

  createSendTransaction = async (
    receiverAddress,
    amountInSatoshi,
    transactionFee
  ) => {
    try {
      const {
        wallet: { outputs, derivedKeys },
      } = this.store.getState();
      const utxos = outputs.filter((output) => output.spendInfo === null);
      const targets = [{ address: receiverAddress, value: amountInSatoshi }];
      const privateKey = derivedKeys.find(
        (derivedKey) => derivedKey.isUsed === false
      );
      const transactionHex = utils.createSendTransaction(
        privateKey,
        utxos,
        targets,
        transactionFee
      );
      return await transactionAPI.broadcastRawTransaction(transactionHex);
    } catch (error) {
      throw error;
    }
  };
}

export default WalletService;
