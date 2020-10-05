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
import faker, { address } from 'faker';
import * as bip38 from 'bip38';
import * as bip39 from 'bip39';
import * as _ from 'lodash';
import { differenceInMinutes } from 'date-fns';
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
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    const countOfUnusedKeys = this._countOfUnusedKeys(existingDerivedKeys);
    if (countOfUnusedKeys < 20) {
      let lastKeyIndex = -1;
      if (existingDerivedKeys.length > 0) {
        lastKeyIndex = existingDerivedKeys[
          existingDerivedKeys.length - 1
        ].indexText
          .split('/')
          .pop();
      }
      const { derivedKeys: newDerivedKeys } = await this._generateDerivedKeys(
        bip32ExtendedKey,
        Number(lastKeyIndex) + 1,
        20 - countOfUnusedKeys,
        false
      );
      await Persist.upsertDerivedKeys(newDerivedKeys);
    }
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
    let indexText =
      derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath + '/' + index;
    if (useHardenedAddresses) {
      indexText = indexText + "'";
    }
    return { indexText, address };
  }

  _getPrivKey(
    bip32ExtendedKey: string,
    index: number,
    useBip38?: boolean,
    bip38password: string = '',
    useHardenedAddresses?: boolean
  ): { privkey: string } {
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
    // const address = payments.p2pkh({
    //   pubkey: keyPair.publicKey,
    //   network: network.BITCOIN_SV_REGTEST,
    // }).address!;
    const hasPrivkey = !key.isNeutered();
    let privkey = '';
    if (hasPrivkey) {
      privkey = keyPair.toWIF();
      if (useBip38) {
        privkey = bip38.encrypt(keyPair.privateKey!, false, bip38password);
      }
    }
    // const pubkey = keyPair.publicKey.toString('hex');
    // let indexText =
    //   derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath + '/' + index;
    // if (useHardenedAddresses) {
    //   indexText = indexText + "'";
    // }
    return { privkey };
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
      // if (i === 0) {
      // derivedKey.address = 'mkTJA5GAsJQp7UmAgh43AVAVM4BvjWbG7z';
      // derivedKey.privkey =
      // 'cTP23waCMwbWfDoH53PGJNpbyiyMk2g2djhuXff5XhPNuewqdKNY';
      // derivedKey.address = 'mmKu1EzwGmicQA5XwpFVDBegwNjf7h55MP';
      // derivedKey.privkey =
      //   'cSn2zVDF4c7w63rH1Cc2uXsMr6UzFAwasTRmm4CpQet1ofuVKzRj';
      // }
      derivedKeys.push({ ...derivedKey, isUsed: false });
    }
    return { derivedKeys };
  }

  _getAddressesFromKeys(derivedKeys: any[]) {
    return derivedKeys.map((key: { address: any }) => key.address);
  }

  async getTransaction(txid: string) {
    try {
      const transaction = await transactionAPI.getTransactionByTxID(txid);
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  _countOfUnusedKeys(keys: any[]) {
    return keys.reduce((acc: number, currKey: { isUsed: boolean }) => {
      if (!currKey.isUsed) {
        acc = acc + 1;
      }
      return acc;
    }, 0);
  }

  async getOutputs(options?: {
    startkey?: string;
    limit?: number;
    pageNo?: number;
    diff?: boolean;
  }) {
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    if (existingDerivedKeys.length > 0) {
      const {
        derivedKeys: newDerivedKeys,
        diffOutputs,
      } = await this._getOutputs(existingDerivedKeys);
      if (diffOutputs.length > 0) {
        await Persist.upsertOutputs(diffOutputs);
        await Persist.upsertDerivedKeys(newDerivedKeys);
      }
      if (options?.diff) {
        return { outputs: diffOutputs };
      } else {
        return await Persist.getOutputs(options);
      }
    }
    return { outputs: [] };
  }

  async _getOutputs(
    derivedKeys: any[],
    prevOutputs: any[] = [],
    prevDiffOutputs: any[] = [],
    prevKeys: any[] = []
  ): Promise<any> {
    const chunkedUsedDerivedKeys = _.chunk(derivedKeys, 20);
    const data = await Promise.all(
      chunkedUsedDerivedKeys.map(async chunkedUsedDerivedKey => {
        return await this._getOutputsByAddresses(chunkedUsedDerivedKey);
      })
    );
    const outputs = data.flat();
    const diffOutputs = await this._getDiffOutputs(outputs);
    const updatedKeys = derivedKeys.map(
      (key: { address: string; indexText: string; isUsed: boolean }) => {
        if (!key.isUsed) {
          const found = outputs.some(
            (output: { address: any }) => output.address === key.address
          );
          return { ...key, isUsed: found };
        }
        return key;
      }
    );
    const newOutputs = [...prevOutputs, ...outputs];
    const newDiffOutputs = [...prevDiffOutputs, ...diffOutputs];
    const newKeys = [...prevKeys, ...updatedKeys];
    const countOfUnusedKeys = this._countOfUnusedKeys(newKeys);
    if (countOfUnusedKeys < 20) {
      const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
      const lastKeyIndex = derivedKeys[derivedKeys.length - 1].indexText
        .split('/')
        .pop();
      const { derivedKeys: nextDerivedKeys } = await this._generateDerivedKeys(
        bip32ExtendedKey,
        Number(lastKeyIndex) + 1,
        20 - countOfUnusedKeys,
        false
      );
      return await this._getOutputs(
        nextDerivedKeys,
        newOutputs,
        newDiffOutputs,
        newKeys
      );
    } else {
      return {
        outputs: newOutputs,
        diffOutputs: newDiffOutputs,
        derivedKeys: newKeys,
      };
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
    const { lastFetched } = await Persist.getOutputsLastFetched();
    if (lastFetched) {
      const diffOutputs = await this._getDiffOutputs(data.outputs);
      if (diffOutputs.length === data.outputs.length) {
        const outputs = [...prevOutputs, ...diffOutputs];
        if (data.nextCursor) {
          return await this._getOutputsByAddresses(
            keys,
            outputs,
            data.nextCursor
          );
        } else {
          return outputs;
        }
      } else {
        return diffOutputs;
      }
    } else {
      const outputs = [...prevOutputs, ...data.outputs];
      if (data.nextCursor) {
        return await this._getOutputsByAddresses(
          keys,
          outputs,
          data.nextCursor
        );
      } else {
        return outputs;
      }
    }
  }

  async _getDiffOutputs(outputs: any) {
    const newOutputs: any[] = [];
    for (let index = 0; index < outputs.length; index++) {
      if (!(await Persist.isInOutputs(outputs[index]))) {
        newOutputs.push(outputs[index]);
      } else {
        return newOutputs;
      }
    }
    return newOutputs;
  }

  async getUTXOs() {
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    if (existingDerivedKeys.length > 0) {
      const { derivedKeys: newDerivedKeys, diffUTXOs } = await this._getUTXOs(
        existingDerivedKeys
      );
      if (diffUTXOs.length > 0) {
        const { lastUpdated } = await Persist.getOutputsLastUpdated();
        const newDiffUtxos = [];
        for (let index = 0; index < diffUTXOs.length; index++) {
          const { isPresent, _id, _rev } = await Persist.isInOutputsNew(
            diffUTXOs[index]
          );
          if (!isPresent) {
            newDiffUtxos.push({ ...diffUTXOs[index], isSpent: false });
          } else {
            const diffInMinutes = differenceInMinutes(
              new Date(),
              Date.parse(lastUpdated)
            );
            if (diffInMinutes > 30) {
              newDiffUtxos.push({
                ...diffUTXOs[index],
                _id,
                _rev,
                isSpent: false,
              });
            }
          }
        }
        if (newDiffUtxos.length > 0) {
          debugger;
          await Persist.upsertDerivedKeys(newDerivedKeys);
          await Persist.updateOutputs(newDiffUtxos);
        }
      }
    }
  }

  async _getUTXOs(
    derivedKeys: any[],
    prevUtxos: any[] = [],
    prevDiffUtxos: any[] = [],
    prevKeys: any[] = []
  ): Promise<any> {
    const chunkedUsedDerivedKeys = _.chunk(derivedKeys, 20);
    const data = await Promise.all(
      chunkedUsedDerivedKeys.map(async chunkedUsedDerivedKey => {
        return await this._getUTXOsByAddresses(chunkedUsedDerivedKey);
      })
    );
    const utxos = data.flat();
    const diffUTXOs = await this._getDiffUTXOs(utxos);
    const updatedKeys = derivedKeys.map(
      (key: { address: string; indexText: string; isUsed: boolean }) => {
        if (!key.isUsed) {
          const found = utxos.some(
            (utxo: { address: any }) => utxo.address === key.address
          );
          return { ...key, isUsed: found };
        }
        return key;
      }
    );
    const newUtxos = [...prevUtxos, ...utxos];
    const newDiffUtxos = [...prevDiffUtxos, ...diffUTXOs];
    const newKeys = [...prevKeys, ...updatedKeys];
    const countOfUnusedKeys = this._countOfUnusedKeys(newKeys);
    if (countOfUnusedKeys < 20) {
      const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
      const lastKeyIndex = derivedKeys[derivedKeys.length - 1].indexText
        .split('/')
        .pop();
      const { derivedKeys: nextDerivedKeys } = await this._generateDerivedKeys(
        bip32ExtendedKey,
        Number(lastKeyIndex) + 1,
        20 - countOfUnusedKeys,
        false
      );
      return await this._getUTXOs(
        nextDerivedKeys,
        newUtxos,
        newDiffUtxos,
        newKeys
      );
    } else {
      return {
        utxos: newUtxos,
        diffUTXOs: newDiffUtxos,
        derivedKeys: newKeys,
      };
    }
  }

  async _getUTXOsByAddresses(
    keys: any[],
    prevUtxos: any[] = [],
    nextCursor?: number
  ): Promise<any> {
    const addresses = this._getAddressesFromKeys(keys);
    const data: {
      utxos: any[];
      nextCursor: number;
    } = await addressAPI.getUTXOsByAddresses(addresses, 100, nextCursor);
    const { lastFetched } = await Persist.getOutputsLastFetched();
    if (lastFetched) {
      const diffUTXOs = await this._getDiffUTXOs(data.utxos);
      if (diffUTXOs.length === data.utxos.length) {
        const utxos = [...prevUtxos, ...diffUTXOs];
        if (data.nextCursor) {
          return await this._getUTXOsByAddresses(keys, utxos, data.nextCursor);
        } else {
          return utxos;
        }
      } else {
        return diffUTXOs;
      }
    } else {
      const utxos = [...prevUtxos, ...data.utxos];
      if (data.nextCursor) {
        return await this._getUTXOsByAddresses(keys, utxos, data.nextCursor);
      } else {
        return utxos;
      }
    }
  }

  async _getDiffUTXOs(utxos: any[]) {
    const newUTXOs: any[] = [];
    for (let index = 0; index < utxos.length; index++) {
      if (!(await Persist.isInUTXOs(utxos[index]))) {
        newUTXOs.push(utxos[index]);
      } else {
        return newUTXOs;
      }
    }
    return newUTXOs;
  }

  async _getChangeAddress() {
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    const ununsedKeyIndex = existingDerivedKeys.findIndex(
      (derivedKey: { isUsed: boolean }) => derivedKey.isUsed === false
    );
    const newDerivedKeys = [...existingDerivedKeys];
    newDerivedKeys[ununsedKeyIndex] = {
      ...newDerivedKeys[ununsedKeyIndex],
      isUsed: true,
    };
    Persist.upsertDerivedKeys(newDerivedKeys);
    return newDerivedKeys[ununsedKeyIndex].address;
  }

  async _getKeys(addresses: string[]): Promise<object[]> {
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
    return addresses.map(address => {
      const derivedKey = existingDerivedKeys.find(
        (derivedKey: { address: string }) => derivedKey.address === address
      );
      const KeyIndex = derivedKey.indexText.split('/').pop();
      const { privkey } = this._getPrivKey(
        bip32ExtendedKey,
        Number(KeyIndex),
        false
      );
      return ECPair.fromWIF(privkey, networks.regtest);
      /*
      return ECPair.fromWIF(
        'cVi5XGpCSSooYdVreWzTHJHg1cAW1q2Hu9MK64jEsBobYBbfpFBi',
        networks.regtest
      );*/
    });
  }

  async _createSendTransaction(utxos: any[], targets: any[], feeRate: number) {
    try {
      // let feeRate = 5; // satoshis per byte
      // if (transactionFee === 0) {
      //   feeRate = 0;
      // }
      let { inputs, outputs } = coinSelect(utxos, targets, feeRate);
      if (!inputs || !outputs) throw new Error('Empty inputs or outputs');
      // if (transactionFee !== fee) {
      //   const changeOutputs = outputs.filter((output: { address: any }) => {
      //     if (!output.address) return true;
      //     return false;
      //   });
      //   const diffFee = fee - transactionFee;
      //   if (changeOutputs.length > 0) {
      //     changeOutputs[0].value = Number(changeOutputs[0].value) + diffFee;
      //   }
      // }

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
          });
        }
      );
      for (let index = 0; index < outputs.length; index++) {
        const output = outputs[index];
        if (!output.address) {
          output.address = await this._getChangeAddress();
        }
        psbt.addOutput({
          address: output.address,
          value: output.value,
        });
      }

      const addresses = merged.map(input => input.address);
      const keys: object[] = await this._getKeys(addresses);
      keys.forEach((key: any, i) => {
        psbt.signInput(i, key);
      });

      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();
      const transactionHex = psbt.extractTransaction(true).toHex();
      const base64 = Buffer.from(transactionHex, 'hex').toString('base64');
      const { txBroadcast } = await transactionAPI.broadcastRawTransaction(
        base64
      );
      if (txBroadcast) {
        const spentUtxos = inputs.map((input: any) => ({
          ...input,
          isSpent: true,
          confirmed: false,
        }));
        await Persist.updateOutputs(spentUtxos);
      }
    } catch (error) {
      throw error;
    }
  }

  async createSendTransaction(
    receiverAddress: string,
    amountInSatoshi: number,
    feeRate: number
  ) {
    const { utxos } = await Persist.getUTXOs();
    const targets = [
      { address: receiverAddress, value: Number(amountInSatoshi) },
    ];
    await this._createSendTransaction(utxos, targets, feeRate);
  }

  async getTransactionFee(receiverAddress: string, amountInSatoshi: number) {
    try {
      const { utxos } = await Persist.getUTXOs();
      const feeRate = 5; // satoshis per byte
      const targets = [
        { address: receiverAddress, value: Number(amountInSatoshi) },
      ];
      let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);
      if (!inputs) throw new Error('Not sufficient funds');
      if (!outputs) throw new Error('No Receiver specified');
      return fee;
    } catch (error) {
      throw error;
    }
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
    const { outputs } = await Persist.getOutputs();
    const balance = outputs.reduce((acc: number, currOutput: any) => {
      if (!currOutput.isSpent) {
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

  async getAddressInfo() {
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    const unusedDerivedKey = existingDerivedKeys.find(
      (existingDerivedKey: { isUsed: any }) =>
        existingDerivedKey.isUsed === false
    );
    const { outputs } = await this.getOutputs();
    const outputsGroupedByAddress = _.groupBy(outputs, output => {
      return output.address;
    });
    const usedAddressInfo: {
      address: string;
      currentBalance: number;
      lastTransaction: any;
    }[] = [];
    for (const [key, value] of Object.entries(outputsGroupedByAddress)) {
      const currentBalance = value.reduce((acc: number, currOutput: any) => {
        if (!currOutput.isSpent) {
          acc = acc + currOutput.value;
        }
        return acc;
      }, 0);
      usedAddressInfo.push({
        address: key,
        currentBalance,
        lastTransaction: value[0].address,
      });
    }
    return {
      addressInfo: { unusedAddress: unusedDerivedKey.address, usedAddressInfo },
    };
  }
}

export default new Wallet();
