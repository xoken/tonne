import {
  Network,
  bip32,
  ECPair,
  networks,
  payments,
  Psbt,
} from 'bitcoinjs-lib';
import AES from 'crypto-js/aes';
import coinSelect from 'coinselect';
import faker from 'faker';
import * as bip38 from 'bip38';
import * as bip39 from 'bip39';
import * as Persist from './Persist';
import derivationPaths from './constants/derivationPaths';
import network from './constants/network';
import { addressAPI } from './AddressAPI';
import { transactionAPI } from './TransactionAPI';

class Wallet {
  async _initWallet(bip39Mnemonic: string, password?: string) {
    const seed = this._mnemonicToSeedSync(bip39Mnemonic, password);
    const bip32RootKey = this._getBIP32RootKeyFromSeed(
      seed,
      network.BITCOIN_SV_REGTEST
    );
    const bip32ExtendedKey = this._getBIP32ExtendedKey(
      derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath,
      bip32RootKey
    );
    await Persist.setBip32ExtendedKey(bip32ExtendedKey);
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
    let extendedKey = bip32.fromBase58(
      bip32RootKey,
      network.BITCOIN_SV_REGTEST
    );
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

  _generateDerivedAddress(
    bip32ExtendedKey: string,
    index: number,
    useBip38?: boolean,
    bip38password: string = '',
    useHardenedAddresses?: boolean
  ) {
    const bip32Interface = bip32.fromBase58(
      bip32ExtendedKey,
      network.BITCOIN_SV_REGTEST
    );
    let key;
    if (useHardenedAddresses) {
      key = bip32Interface.deriveHardened(index);
    } else {
      key = bip32Interface.derive(index);
    }
    const useUncompressed = useBip38;
    let keyPair = ECPair.fromPrivateKey(key.privateKey!, {
      network: network.BITCOIN_SV_REGTEST,
    });
    if (useUncompressed) {
      keyPair = ECPair.fromPrivateKey(key.privateKey!, {
        compressed: false,
        network: network.BITCOIN_SV_REGTEST,
      });
    }
    const address = payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: network.BITCOIN_SV_REGTEST,
    }).address!;
    const hasPrivkey = !key.isNeutered();
    let privkey;
    if (hasPrivkey) {
      privkey = keyPair.toWIF();
      if (useBip38) {
        privkey = bip38.encrypt(keyPair.privateKey!, false, bip38password);
      }
    }
    const pubkey = keyPair.publicKey.toString('hex');
    let indexText =
      derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath + '/' + index;
    if (useHardenedAddresses) {
      indexText = indexText + "'";
    }
    return { indexText, address, pubkey, privkey };
  }

  _generateDerivedKeys(
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
        derivedKey.address = 'mfX15Eq6QHZ55YnfJg8XDY4kNVim9d9PXK';
        // derivedKey.address = 'mkTJA5GAsJQp7UmAgh43AVAVM4BvjWbG7z';
        //   derivedKey.privkey =
        //     'cTP23waCMwbWfDoH53PGJNpbyiyMk2g2djhuXff5XhPNuewqdKNY';
        //   derivedKey.address = 'mmKu1EzwGmicQA5XwpFVDBegwNjf7h55MP';
        //   derivedKey.privkey =
        //     'cSn2zVDF4c7w63rH1Cc2uXsMr6UzFAwasTRmm4CpQet1ofuVKzRj';
      }
      derivedKeys.push({ ...derivedKey, isUsed: false });
    }
    return derivedKeys;
  }

  _getAddressesFromKeys(derivedKeys: any[]) {
    return derivedKeys.map((key: { address: any }) => key.address);
  }

  async getOutputs() {
    const initialDerivedKeys = this._generateDerivedKeys(
      await Persist.getBip32ExtendedKey(),
      0,
      20,
      false
    );
    const { outputs, derivedKeys } = await this._getOutputs(initialDerivedKeys);
    await Persist.setOutputs(outputs); // compare and set
    await Persist.setDerivedKeys(derivedKeys);
    return {
      outputs,
    };
  }

  getTransaction(txid: string) {
    const txoutputs = transactionAPI
      .getTransactionByTxID(txid)
      .then(data => {
        return data;
      })
      .catch(err => {
        throw err;
      });
  }

  async _getOutputs(
    keys: any[],
    prevOutputs: any[] = [],
    prevKeys: any[] = []
  ): Promise<any> {
    const outputs = await this._getOutputsByAddresses(keys);
    const updatedKeys = keys.map((key: { address: any; indexText: string }) => {
      const found = outputs.some(
        (output: { address: any }) => output.address === key.address
      );
      return { ...key, isUsed: found };
    });
    const newOutputs = [...prevOutputs, ...outputs];
    const newKeys = [...prevKeys, ...updatedKeys];
    const isAllKeyUsed = updatedKeys.every(
      (key: { isUsed: boolean }) => key.isUsed === true
    );
    const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
    const lastKeyIndex = updatedKeys[updatedKeys.length - 1].indexText
      .split('/')
      .pop();
    if (isAllKeyUsed) {
      const newDerivedKeys = this._generateDerivedKeys(
        bip32ExtendedKey,
        Number(lastKeyIndex) + 1,
        20,
        false
      );
      return this._getOutputs(newDerivedKeys, newOutputs, newKeys);
    } else {
      const countOfUnusedKeys = updatedKeys.reduce((acc, currKey) => {
        if (!currKey.isUsed) {
          acc = acc + 1;
        }
        return acc;
      }, 0);
      if (countOfUnusedKeys < 20) {
        const remainingDerivedKeys = this._generateDerivedKeys(
          bip32ExtendedKey,
          Number(lastKeyIndex) + 1,
          20 - countOfUnusedKeys,
          false
        );
        return {
          outputs: newOutputs,
          derivedKeys: [...newKeys, ...remainingDerivedKeys],
        };
      }
      return { outputs: newOutputs, derivedKeys: newKeys };
    }
  }

  async _getOutputsByAddresses(
    keys: any[],
    prevOutputs: any[] = [],
    nextCursor?: number
  ): Promise<any> {
    const addresses = this._getAddressesFromKeys(keys);
    const data: {
      outputs: any[];
      nextCursor: number;
    } = await addressAPI.getOutputsByAddresses(addresses, 100, nextCursor);
    const outputs = [...prevOutputs, ...data.outputs];
    if (data.nextCursor) {
      return await this._getOutputsByAddresses(keys, outputs, data.nextCursor);
    } else {
      return outputs;
    }
  }

  async getUTXOs() {
    const derivedKeys = await Persist.getDerivedKeys();
    const usedDerivedKeys = derivedKeys.filter(
      (derivedKey: { isUsed: boolean }) => derivedKey.isUsed === true
    );
    const addresses = usedDerivedKeys.map(
      (usedDerivedKey: { address: any }) => usedDerivedKey.address
    );
    return await this._getUTXOsByAddresses(addresses);
  }

  async _getUTXOsByAddresses(
    addresses: string[],
    prevUTXOs: any[] = [],
    nextCursor?: number
  ): Promise<any> {
    const data: {
      utxos: any[];
      nextCursor: number;
    } = await addressAPI.getUTXOsByAddresses(addresses, 100, nextCursor);
    const utxos = [...prevUTXOs, ...data.utxos];
    if (data.nextCursor) {
      return await this._getUTXOsByAddresses(addresses, utxos, data.nextCursor);
    } else {
      return { utxos };
    }
  }

  async _getChangeAddress() {
    const derivedKeys = await Persist.getDerivedKeys();
    const ununsedKeyIndex = derivedKeys.findIndex(
      (derivedKey: { isUsed: boolean }) => derivedKey.isUsed === false
    );
    const newDerivedKeys = [...derivedKeys];
    newDerivedKeys[ununsedKeyIndex] = {
      ...newDerivedKeys[ununsedKeyIndex],
      isUsed: true,
    };
    Persist.setDerivedKeys(newDerivedKeys);
    return newDerivedKeys[ununsedKeyIndex].address;
  }

  async _getKeys(addresses: string[]): Promise<object[]> {
    const derivedKeys = await Persist.getDerivedKeys();
    return addresses.map(address => {
      const derivedKey = derivedKeys.find(
        (derivedKey: { address: string }) => derivedKey.address === address
      );
      //return ECPair.fromWIF(derivedKey.privkey, networks.regtest);
      return ECPair.fromWIF(
        'cVi5XGpCSSooYdVreWzTHJHg1cAW1q2Hu9MK64jEsBobYBbfpFBi',
        networks.regtest
      );
    });
  }

  async createSendTransaction(
    receiverAddress: string,
    amountInSatoshi: number,
    transactionFee: number
  ) {
    const { utxos } = await this.getUTXOs();
    const mUTXOs = utxos.map((utxo: any) => ({ ...utxo, isUsed: false }));
    const cachedUTXOs = await Persist.getUtxos();
    let finalUTXOs;
    if (cachedUTXOs.length > 0) {
      const mergedUTXOs = mUTXOs.map((mUTXO: any, index: string | number) => {
        return Object.assign(mUTXO, cachedUTXOs[index]);
      });
      finalUTXOs = mergedUTXOs.filter(
        (mergedUTXO: { isUsed: boolean }) => mergedUTXO.isUsed === false
      );
    } else {
      await Persist.setUtxos(mUTXOs);
      finalUTXOs = mUTXOs;
    }
    const targets = [
      { address: receiverAddress, value: Number(amountInSatoshi) },
    ];
    await this._createSendTransaction(finalUTXOs, targets, transactionFee);
  }

  async _createSendTransaction(
    utxos: [],
    targets: any[],
    transactionFee: number
  ) {
    try {
      const feeRate = 5; // satoshis per byte
      let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);
      // the accumulated fee is always returned for analysis
      // .inputs and .outputs will be undefined if no solution was found
      if (!inputs || !outputs) throw new Error('Empty inputs || outputs');

      const txIds = inputs.map(
        (input: { outputTxHash: any }) => input.outputTxHash
      );
      const rawTxsResponse = await transactionAPI.getRawTransactionsByTxIDs(
        txIds
      );
      const inputsWithRawTxs = rawTxsResponse.rawTxs.map((rawTx: any) => {
        const hex = Buffer.from(rawTx.txSerialized, 'base64').toString('hex');
        return { ...rawTx, hex };
      });
      let merged = [];
      for (let i = 0; i < inputs.length; i++) {
        merged.push({
          ...inputs[i],
          ...inputsWithRawTxs.find(
            (element: { txId: any }) => element.txId === inputs[i].outputTxHash
          ),
        });
      }
      const psbt = new Psbt({
        network: network.BITCOIN_SV_REGTEST,
        forkCoin: 'bch',
      });
      psbt.setVersion(1);
      merged.forEach(
        (input: { outputTxHash: any; outputIndex: any; hex: any }) => {
          psbt.addInput({
            hash: input.outputTxHash,
            index: input.outputIndex,
            nonWitnessUtxo: Buffer.from(input.hex, 'hex'),
            // redeemScript: output,
          });
        }
      );
      outputs.forEach(async (output: { address: any; value: any }) => {
        // watch out, outputs may have been added that you need to provide
        // an output address/script for
        if (!output.address) {
          output.address = await this._getChangeAddress();
        }
        psbt.addOutput({
          address: output.address,
          value: output.value,
        });
      });

      const addresses = merged.map(input => input.address);
      const keys: object[] = await this._getKeys(addresses);
      keys.forEach((key: any, i) => {
        psbt.signInput(i, key);
      });

      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();
      const transactionHex = psbt.extractTransaction(true).toHex();
      const base64 = Buffer.from(transactionHex, 'hex').toString('base64');
      await transactionAPI.broadcastRawTransaction(base64);
      await this._updateUTXOs(inputs, utxos);
    } catch (error) {
      throw error;
    }
  }

  async _updateUTXOs(inputs: any[], utxos: any[]) {
    const newUTXOs = [...utxos];
    inputs.forEach(input => {
      const utxoIndex = utxos.findIndex(utxo => utxo.address === input.address);
      newUTXOs[utxoIndex] = {
        ...newUTXOs[utxoIndex],
        isUsed: true,
      };
    });

    await Persist.setUtxos(newUTXOs);
  }

  async login(profileId: string, password: string) {
    try {
      const bip39Mnemonic = await Persist.login(profileId, password);
      await Persist.init(profileId);
      await this._initWallet(bip39Mnemonic);
      return { profile: profileId };
    } catch (error) {
      throw error;
    }
  }

  async createProfile(bip39Mnemonic: string, password: string) {
    const cryptedText = AES.encrypt(bip39Mnemonic, password).toString();
    const profileName = faker.name.firstName();
    localStorage.setItem('currentprofile', profileName);
    try {
      await Persist.createProfile(cryptedText, profileName);
      return { profile: profileName };
    } catch (error) {
      throw error;
    }
  }

  async updateProfileName(currentProfileName: string, newProfileName: string) {
    try {
      await Persist.updateProfileName(currentProfileName, newProfileName);
      return { profile: newProfileName };
    } catch (error) {
      throw error;
    }
  }

  async getProfiles() {
    return { profiles: await Persist.getProfiles() };
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

  generateMnemonic(
    strength?: number,
    rng?: (size: number) => Buffer,
    wordlist?: string[]
  ): string {
    return bip39.generateMnemonic(strength, rng, wordlist);
  }

  logout() {
    return Persist.destroy();
  }
}

export default new Wallet();
