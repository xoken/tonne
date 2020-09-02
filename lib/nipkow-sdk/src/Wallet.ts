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
import * as Persist from './Persist';
import { addressAPI } from './AddressAPI';
import { BITCOIN_SV } from './constants/networks';

class Wallet {
  // constructor() {
  //   if (Wallet.instance) {
  //     return Wallet.instance;
  //   }
  //   Wallet.instance = this;
  //   return this;
  // }

  async init() {
    await Persist.setInitialState();
  }

  initWallet = async (bip39Mnemonic: string, password: string) => {
    const seed = this.mnemonicToSeedSync(bip39Mnemonic, password);
    // const bip39SeedHex = this.getSeedHex(seed);
    const bip32RootKey = this.getBIP32RootKeyFromSeed(seed, BITCOIN_SV);
    // const bip32RootKeyBase58 = this.getBIP32RootKeyBase58(bip32RootKey);
    const bip32ExtendedKey = this.getBIP32ExtendedKey(
      this.getDerivationPath(),
      bip32RootKey
    );
    /*const accountExtendedKey = this.getBIP32ExtendedKey(
      this.getDerivationPathAccount(),
      bip32RootKey
    );
    const accountExtendedPrivateKey = this.getAccountExtendedPrivKey(
      accountExtendedKey
    );
    const accountExtendedPublicKey = this.getAccountExtendedPubKey(
      accountExtendedKey
    );
    const bip32ExtendedPrivateKey = this.getBIP32ExtendedPrivKey(
      bip32ExtendedKey
    );
    const bip32ExtendedPublicKey = this.getBIP32ExtendedPubKey(
      bip32ExtendedKey
    );*/
    const derivedKeys = this.generateDerivedKeys(
      bip32ExtendedKey,
      0,
      20,
      false
    );
    try {
      await Persist.bulkUpdate([
        {
          key: Persist.BIP32_EXTENDED_KEY,
          value: bip32ExtendedKey,
        },
        {
          key: Persist.DERIVED_KEYS,
          value: derivedKeys,
        },
      ]);
      return {
        bip32ExtendedKey,
        derivedKeys,
      };
    } catch (error) {
      throw error;
    }
  };

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

  getOutputs = async () => {
    debugger;
    const x = await Persist.getDerivedKeys();
    debugger;
    const { balance, outputs, derivedKeys } = await this._getOutputs(x);
    debugger;
    try {
      await Persist.bulkUpdate([
        {
          key: Persist.DERIVED_KEYS,
          value: derivedKeys,
        },
        {
          key: Persist.OUTPUTS,
          value: outputs,
        },
      ]);
      debugger;
      return {
        outputs,
        derivedKeys,
        balance,
      };
    } catch (error) {
      console.log(error);
      debugger;
      throw error;
    }
  };

  generateDerivedKeys = (
    bip32ExtendedKey: BIP32Interface,
    indexStart: number,
    count: number,
    useBip38: boolean,
    bip38password?: string,
    useHardenedAddresses?: boolean
  ) => {
    if (indexStart === 0) {
      const addressess = [];
      addressess.push({
        address: 'mn4vGSceDVbuSHUL6LQQ1P7RxPRkVRdyZH',
        // address: '1Lv8ehbvL7LbB93NuPPdLb6U7NsTyX1uao',
        isUsed: false,
      });
      return addressess;
    }

    const derivedKeys = [];
    for (let i = indexStart; i < indexStart + count; i++) {
      const derivedKey = this.generateDerivedAddress(
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

  _getOutputs = async (
    keys: any[],
    prevBalance: number = 0,
    prevOutputs: any[] = [],
    prevKeys: any[] = []
  ): Promise<any> => {
    debugger;
    const { balance, outputs } = await this.getOutputsByAddresses(keys);
    debugger;
    const updatedKeys = keys.map((key: { address: any }) => {
      const found = outputs.some(
        (output: { address: any }) => output.address === key.address
      );
      return { ...key, isUsed: found };
    });
    const newBalance = prevBalance + balance;
    const newKeys = [...prevKeys, ...updatedKeys];
    const newOutputs = [...prevOutputs, ...outputs];
    const isAllKeyUsed = updatedKeys.some((key: { isUsed: boolean }) => {
      if (key.isUsed === false) {
        return false;
      }
      return true;
    });
    const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
    if (isAllKeyUsed) {
      const newDerivedKeys = this.generateDerivedKeys(
        bip32ExtendedKey,
        newKeys.length,
        20,
        false
      );
      debugger;
      return this._getOutputs(newDerivedKeys, newBalance, newOutputs, newKeys);
    } else {
      const countOfUnusedKeys = updatedKeys.reduce(
        (acc: number, currKey: { isUsed: any }) => {
          if (!currKey.isUsed) {
            acc = acc + 1;
          }
          return acc;
        },
        0
      );
      if (countOfUnusedKeys < 20) {
        const remainingDerivedKeys = this.generateDerivedKeys(
          bip32ExtendedKey,
          newKeys.length,
          20 - countOfUnusedKeys,
          false
        );
        debugger;
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
    keys: any[],
    prevBalance = 0,
    prevOutputs: any[] = [],
    nextCursor?: number
  ): Promise<any> => {
    const addressess = keys.map((key: { address: any }) => key.address);
    try {
      const data: {
        outputs: any[];
        nextCursor: number;
      } = await addressAPI.getOutputsByAddresses(addressess, 100, nextCursor);
      const balance = data.outputs.reduce(
        (acc: any, currOutput: { spendInfo: any; value: any }) => {
          if (!currOutput.spendInfo) {
            acc = acc + currOutput.value;
          }
          return acc;
        },
        prevBalance
      );
      const outputs = [...prevOutputs, ...data.outputs];
      // if (false && data.nextCursor) {
      if (data.nextCursor) {
        return await this.getOutputsByAddresses(
          keys,
          balance,
          outputs,
          data.nextCursor
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

  /*createSendTransaction = async (
    receiverAddress: any,
    amountInSatoshi: any,
    transactionFee: any
  ) => {
    try {
      const {
        wallet: { outputs, derivedKeys },
      } = this.store.getState();
      const utxos = outputs.filter((output: { spendInfo: null; }) => output.spendInfo === null);
      const targets = [
        { address: receiverAddress, value: Number(amountInSatoshi) },
      ];
      const derivedKey = derivedKeys.find(
        (        derivedKey: { isUsed: boolean; }) => derivedKey.isUsed === false
      );
      // });
      console.log(derivedKey);
      // var inputs = utxos.slice(0, 5).map((element) => {
      //   return { ...element, value: 5000 };
      const transactionHex = await utils.createSendTransaction(
        'cN6NafxmNHmhhF6uUug2VuagYm5DWMhRQ5qZDLHyd7Sinbji69Ui',
        utxos,
        targets,
        transactionFee
      );
      return await transactionAPI.broadcastRawTransaction(transactionHex);
    } catch (error) {
      throw error;
    }
  };*/

  /*getTransactions = async (outputs: any[]) => {
    const uniqueTx = [
      ...new Set(
        outputs.map((output: { outputTxHash: any }) => output.outputTxHash)
      ),
    ];
    const transactions = await transactionAPI.getTransactionsByTxIDs(uniqueTx);
    return transactions.txs;
  };*/
}

export default new Wallet();
