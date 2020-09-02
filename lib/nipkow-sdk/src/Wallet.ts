import { Network, bip32, ECPair, payments } from 'bitcoinjs-lib';
import * as bip38 from 'bip38';
import * as bip39 from 'bip39';
import * as Persist from './Persist';
import derivationPaths from './constants/derivationPaths';
import networks from './constants/networks';
import { addressAPI } from './AddressAPI';

class Wallet {
  async init() {
    Persist.createDB('mydb');
    await Persist.setInitialState();
  }

  generateMnemonic(
    strength?: number,
    rng?: (size: number) => Buffer,
    wordlist?: string[]
  ): string {
    return bip39.generateMnemonic(strength, rng, wordlist);
  }

  _mnemonicToSeedSync(bip39Mnemonic: string, password?: string): Buffer {
    return bip39.mnemonicToSeedSync(bip39Mnemonic, password);
  }

  _getBIP32RootKeyFromSeed(seed: Buffer, network?: Network): string {
    return bip32.fromSeed(seed, network).toBase58();
  }

  _getBIP32ExtendedKey(path: string, bip32RootKey: string): string {
    if (!bip32RootKey) {
      return bip32RootKey;
    }
    let extendedKey = bip32.fromBase58(bip32RootKey);
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
    return extendedKey.toBase58();
  }

  _getDerivationPath(): string {
    const { purpose, coin, account, change } = derivationPaths.BITCOIN_SV;
    let path = 'm/';
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
  }

  _generateDerivedAddress(
    bip32ExtendedKey: string,
    index: number,
    useBip38?: boolean,
    bip38password: string = '',
    useHardenedAddresses?: boolean
  ) {
    const bip32Interface = bip32.fromBase58(bip32ExtendedKey);
    let key;
    if (useHardenedAddresses) {
      key = bip32Interface.deriveHardened(index);
    } else {
      key = bip32Interface.derive(index);
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
    let indexText = this._getDerivationPath() + '/' + index;
    if (useHardenedAddresses) {
      indexText = indexText + "'";
    }
    return { indexText, address, pubkey, privkey };
  }

  async _generateDerivedKeys(
    bip32ExtendedKey: string,
    indexStart: number,
    count: number,
    useBip38: boolean,
    bip38password?: string,
    useHardenedAddresses?: boolean
  ) {
    const derivedKeys = [];
    for (let i = indexStart; i < indexStart + count; i++) {
      const derivedKey = this._generateDerivedAddress(
        bip32ExtendedKey,
        i,
        useBip38,
        bip38password,
        useHardenedAddresses
      );
      if (i === 0) {
        derivedKey.address = 'mnGY8nS44fs11yYBJ3Lo3PX3Kdgyfup7d3';
      } else if (i === 1) {
        derivedKey.address = 'mnGY8nS44fs11yYBJ3Lo3PX3Kdgyfup7d3';
        // derivedKey.address = 'mn4vGSceDVbuSHUL6LQQ1P7RxPRkVRdyZH';
      } else if (i === 2) {
        // derivedKey.address = '1Lv8ehbvL7LbB93NuPPdLb6U7NsTyX1uao';
      }
      derivedKeys.push({ ...derivedKey, isUsed: false });
    }
    await Persist.setDerivedKeys(derivedKeys);
    return derivedKeys;
  }

  async initWallet(bip39Mnemonic: string, password: string) {
    const seed = this._mnemonicToSeedSync(bip39Mnemonic, password);
    const bip32RootKey = this._getBIP32RootKeyFromSeed(
      seed,
      networks.BITCOIN_SV
    );
    const bip32ExtendedKey = this._getBIP32ExtendedKey(
      this._getDerivationPath(),
      bip32RootKey
    );
    await Persist.setBip32ExtendedKey(bip32ExtendedKey);
    await this._generateDerivedKeys(bip32ExtendedKey, 0, 20, false);
  }

  async getOutputs() {
    const { outputs } = await this._getOutputs(await Persist.getDerivedKeys());
    await Persist.setOutputs(outputs);
    return {
      outputs,
    };
  }

  async _getOutputs(keys: any[], prevOutputs: any[] = []): Promise<any> {
    const outputs = await this._getOutputsByAddresses(keys);
    const updatedKeys = keys.map((key: { address: any; indexText: string }) => {
      const found = outputs.some(
        (output: { address: any }) => output.address === key.address
      );
      return { ...key, isUsed: found };
    });
    const newOutputs = [...prevOutputs, ...outputs];
    const isAllKeyUsed = updatedKeys.every(
      (key: { isUsed: boolean }) => key.isUsed === true
    );
    const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
    if (isAllKeyUsed) {
      const lastKeyIndex = updatedKeys[updatedKeys.length - 1].indexText
        .split('/')
        .pop();
      const newDerivedKeys = await this._generateDerivedKeys(
        bip32ExtendedKey,
        Number(lastKeyIndex) + 1,
        20,
        false
      );
      return this._getOutputs(newDerivedKeys, newOutputs);
    } else {
      return { outputs: newOutputs };
    }
  }

  async _getOutputsByAddresses(
    keys: any[],
    prevOutputs: any[] = [],
    nextCursor?: number
  ): Promise<any> {
    const addressess = keys.map((key: { address: any }) => key.address);
    const data: {
      outputs: any[];
      nextCursor: number;
    } = await addressAPI.getOutputsByAddresses(addressess, 100, nextCursor);
    const outputs = [...prevOutputs, ...data.outputs];
    if (data.nextCursor) {
      return await this._getOutputsByAddresses(keys, outputs, data.nextCursor);
    } else {
      return outputs;
    }
  }

  async getBalance() {
    const outputs = await Persist.getOutputs();
    const balance = outputs.reduce((acc: number, currOutput: any) => {
      if (!currOutput.spendInfo) {
        acc = acc + currOutput.value;
      }
      return acc;
    }, 0);
    return { balance };
  }

  async createSendTransaction(
    receiverAddress: string,
    amountInSatoshi: number,
    transactionFee: number
  ) {
    console.log(receiverAddress);
    console.log(amountInSatoshi);
    console.log(transactionFee);
    // try {
    //   const utxos = outputs.filter(output => output.spendInfo === null);
    //   const targets = [
    //     { address: receiverAddress, value: Number(amountInSatoshi) },
    //   ];
    //   const derivedKey = derivedKeys.find(
    //     derivedKey => derivedKey.isUsed === false
    //   );
    //   // });
    //   console.log(derivedKey);
    //   // var inputs = utxos.slice(0, 5).map((element) => {
    //   //   return { ...element, value: 5000 };
    //   const transactionHex = await utils.createSendTransaction(
    //     'cN6NafxmNHmhhF6uUug2VuagYm5DWMhRQ5qZDLHyd7Sinbji69Ui',
    //     utxos,
    //     targets,
    //     transactionFee
    //   );
    //   return await transactionAPI.broadcastRawTransaction(transactionHex);
    // } catch (error) {
    //   throw error;
    // }
  }
}

export default new Wallet();
