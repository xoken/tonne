import {
  Network,
  bip32,
  ECPair,
  networks,
  payments,
  Psbt,
  Transaction,
} from 'bitcoinjs-lib';
import AES from 'crypto-js/aes';
import coinSelect from 'coinselect';
import faker from 'faker';
import * as bip39 from 'bip39';
import * as _ from 'lodash';
import { differenceInMinutes } from 'date-fns';
import {
  decodeCBORData,
  getAllegoryType,
  ProducerAction,
  Extension,
  OwnerExtension,
} from './Allegory';
import * as Persist from './Persist';
import derivationPaths from './constants/derivationPaths';
import network from './constants/network';
import { addressAPI } from './AddressAPI';
import { transactionAPI } from './TransactionAPI';
import { chainAPI } from './ChainAPI';
import utils from './Utils';
import { post } from './httpClient';

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
    const nUTXOExtendedKey = this._getBIP32ExtendedKey(
      derivationPaths.BITCOIN_SV_REGTEST.BIP44.nUTXODerivationPath,
      bip32RootKey
    );
    await Persist.setBip32ExtendedKey(bip32ExtendedKey);
    await Persist.setNUTXOExtendedKey(nUTXOExtendedKey);

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
      const { derivedKeys: newDerivedKeys } = await this.generateDerivedKeys(
        bip32ExtendedKey,
        derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath,
        Number(lastKeyIndex) + 1,
        20 - countOfUnusedKeys,
        false
      );
      await Persist.upsertDerivedKeys(newDerivedKeys);
    }

    const { existingNUTXODerivedKeys } = await Persist.getNUTXODerivedKeys();
    const countOfUnusedNUTXOKeys = this._countOfUnusedKeys(
      existingNUTXODerivedKeys
    );
    if (countOfUnusedNUTXOKeys < 20) {
      let lastKeyIndex = -1;
      if (existingNUTXODerivedKeys.length > 0) {
        lastKeyIndex = existingNUTXODerivedKeys[
          existingNUTXODerivedKeys.length - 1
        ].indexText
          .split('/')
          .pop();
      }
      const { derivedKeys: newDerivedKeys } = await this.generateDerivedKeys(
        nUTXOExtendedKey,
        derivationPaths.BITCOIN_SV_REGTEST.BIP44.nUTXODerivationPath,
        Number(lastKeyIndex) + 1,
        20 - countOfUnusedNUTXOKeys,
        false
      );
      await Persist.upsertNUTXODerivedKeys(newDerivedKeys);
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

  getBIP32ExtendedPrivKey = (bip32ExtendedKey: string) => {
    const bip32Interface = bip32.fromBase58(
      bip32ExtendedKey,
      network.BITCOIN_SV_REGTEST
    );
    let xprvkeyB58 = 'NA';
    if (!bip32Interface.isNeutered()) {
      xprvkeyB58 = bip32Interface.toBase58();
    }
    return xprvkeyB58;
  };

  getBIP32ExtendedPubKey = (bip32ExtendedKey: string) => {
    const bip32Interface = bip32.fromBase58(
      bip32ExtendedKey,
      network.BITCOIN_SV_REGTEST
    );
    return bip32Interface.neutered().toBase58();
  };

  _generateDerivedKeys(
    bip32ExtendedKey: string,
    derivationPath: string,
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
    let indexText = derivationPath + '/' + index;
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
      // if (useBip38) {
      //   privkey = bip38.encrypt(keyPair.privateKey!, false, bip38password);
      // }
    }
    // const pubkey = keyPair.publicKey.toString('hex');
    // let indexText =
    //   derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath + '/' + index;
    // if (useHardenedAddresses) {
    //   indexText = indexText + "'";
    // }
    // if (index === 0) {
    //   return {
    //     privkey: 'cQmNC5DxFdWhEqmzeWZ1Gk62hmLTai8vs9fvRVz2KsxKd9fYJTWH',
    //   };
    // }
    return { privkey };
  }

  async generateDerivedKeys(
    bip32ExtendedKey: string,
    derivationPath: string,
    indexStart: number,
    count: number,
    useBip38: boolean,
    bip38password?: string,
    useHardenedAddresses?: boolean
  ) {
    const derivedKeys = [];
    for (let i = indexStart; i < indexStart + count; i++) {
      // if (i === 0) {
      //   const derivedKey = { address: '', indexText: 'm/44/1/0/0/0' };
      //   derivedKey.address = 'msWHgqiPB4dDe7MK455MvkNkixhCZsNKdy';
      //   derivedKeys.push({ ...derivedKey, isUsed: false });
      // } else {
      const derivedKey = this._generateDerivedKeys(
        bip32ExtendedKey,
        derivationPath,
        i,
        useBip38,
        bip38password,
        useHardenedAddresses
      );
      derivedKeys.push({ ...derivedKey, isUsed: false });
      // }
    }
    return { derivedKeys };
  }

  _getAddressesFromKeys(derivedKeys: any[]) {
    return derivedKeys.map((key: { address: any }) => key.address);
  }

  _countOfUnusedKeys(keys: any[]) {
    return keys.reduce((acc: number, currKey: { isUsed: boolean }) => {
      if (!currKey.isUsed) {
        acc = acc + 1;
      }
      return acc;
    }, 0);
  }

  _removeDuplicate(outputs: any[]) {
    const unconfirmedOutputs = [];
    for (let index = 0; index < outputs.length; index++) {
      const output = outputs[index];
      if (output.txIndex === null) {
        unconfirmedOutputs.push(output);
      } else {
        break;
      }
    }
    if (unconfirmedOutputs.length > 0) {
      for (let index = 0; index < unconfirmedOutputs.length; index++) {
        const unconfirmedOutput = unconfirmedOutputs[index];
        const duplicateOutputs = outputs.splice(
          0,
          unconfirmedOutputs.length * 2
        );
        const uniqueOutputs = duplicateOutputs.filter(
          (element, index, self) => {
            return (
              index ===
              self.findIndex(
                (t) =>
                  t.txIndex !== null &&
                  t.outputTxHash === element.outputTxHash &&
                  t.outputIndex === element.outputIndex
              )
            );
          }
        );
        return [...uniqueOutputs, ...outputs];
      }
    }
    return outputs;
  }

  async processAllegoryTransactions(outputs: any[], transactions: any[]) {
    const allegoryTransactions = transactions.filter((transaction) => {
      if (
        transaction.outputs.length > 0 &&
        transaction.outputs[0].lockingScript.startsWith(
          '006a0f416c6c65676f72792f416c6c506179'
        )
      ) {
        return true;
      }
      return false;
    });

    const confirmedNamePurchaseTxs: any[] = [];
    allegoryTransactions.forEach((allegoryTransaction) => {
      const allegoryData = decodeCBORData(
        allegoryTransaction.outputs[0].lockingScript
      );
      const allegory = getAllegoryType(allegoryData);
      const { name, action } = allegory;
      let codepoints: number[] = [];
      if (action instanceof ProducerAction) {
        const producerAction = action as ProducerAction;
        if (producerAction.extensions.length > 0) {
          codepoints = producerAction.extensions.map((extension: Extension) => {
            return extension.codePoint;
            // return [
            //   extension.codePoint,
            //   (extension as OwnerExtension).ownerOutputEx.owner,
            // ];
          });
        }
      }
      confirmedNamePurchaseTxs.push({
        name: utils.codePointToName([...name, ...codepoints]),
        tx: allegoryTransaction,
      });
    });
    const validConfirmedNamePurchaseTxs: any[] = [];
    for (let index = 0; index < confirmedNamePurchaseTxs.length; index++) {
      const confirmedNamePurchaseTx = confirmedNamePurchaseTxs[index];
      const {
        name,
        tx: { txId },
      } = confirmedNamePurchaseTx;
      if (name) {
        const {
          data: {
            forName,
            isProducer,
            outPoint: { opIndex, opTxHash },
            script,
          },
        } = await post('allegory/name-outpoint', {
          name: utils.getCodePoint(name),
          isProducer: false,
        });
        if (utils.codePointToName(forName) === name && txId === opTxHash) {
          validConfirmedNamePurchaseTxs.push(confirmedNamePurchaseTx);
        }
      }
    }
    const diffOutputs = outputs.map(
      (diffOutput: { outputTxHash: any; outputIndex: any }) => {
        const nameOutput = validConfirmedNamePurchaseTxs.find(
          (validConfirmedNamePurchaseTx: { tx: any; index: any }) => {
            return (
              diffOutput.outputTxHash ===
                validConfirmedNamePurchaseTx.tx.txId &&
              diffOutput.outputIndex === 2
              // validConfirmedNamePurchaseTx.index
            );
          }
        );

        if (nameOutput) {
          return {
            ...diffOutput,
            name: nameOutput.name,
            isNameOutpoint: true,
          };
        } else {
          return diffOutput;
        }
      }
    );
    return { diffOutputs };
  }

  async getTransactions(options?: {
    startkey?: string;
    limit?: number;
    pageNo?: number;
    diff?: boolean;
  }) {
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    const { existingNUTXODerivedKeys } = await Persist.getNUTXODerivedKeys();
    const keys = [...existingDerivedKeys, ...existingNUTXODerivedKeys];
    if (keys.length > 0) {
      const {
        derivedKeys: newDerivedKeys,
        nUTXODerivedKeys: newNUTXODerivedKeys,
        diffOutputs: diffOutputsWithDuplicate,
      } = await this._getOutputs(keys);
      if (diffOutputsWithDuplicate.length > 0) {
        const diffOutputs = this._removeDuplicate(diffOutputsWithDuplicate);
        const newKeys = [...newDerivedKeys, ...newNUTXODerivedKeys];
        /* FIX: A Tx can be in spendInfo, and it may not appear in getOutputs API */
        const spentOutputs = diffOutputs.filter(
          (output: { spendInfo: any }) => {
            if (output.spendInfo) return true;
            return false;
          }
        );
        const outgoingTxIds: string[] = Array.from(
          new Set(
            spentOutputs.map(
              (output: { spendInfo: { spendingTxId: any } }) =>
                output.spendInfo.spendingTxId
            )
          )
        );
        const incomingTxIds: string[] = Array.from(
          new Set(
            diffOutputs.map(
              (output: { outputTxHash: any }) => output.outputTxHash
            )
          )
        );
        const txIds: string[] = Array.from(
          new Set([...incomingTxIds, ...outgoingTxIds])
        );
        const { txs } = await this._getTransactions(txIds);
        const { chainInfo } = await chainAPI.getChainInfo();
        if (chainInfo) {
          const { chainTip } = chainInfo;
          if (txs.length > 0) {
            const sortedTx = txs.sort(
              (tx1: { blockHeight: number }, tx2: { blockHeight: number }) => {
                return tx2.blockHeight - tx1.blockHeight;
              }
            );
            const transactions: {
              txId: any;
              inputs: any;
              outputs: any;
              confirmation?: number | null;
            }[] = sortedTx.map(
              (transaction: { txId?: any; tx?: any; blockHeight?: any }) => {
                const {
                  tx: { txInps, txOuts },
                  blockHeight,
                } = transaction;
                const newTxInps = txInps.map(
                  (input: {
                    address: string;
                    txInputIndex: number;
                    value: number;
                  }) => {
                    const isMineAddress = newKeys.find(
                      (derivedKey: { address: any }) =>
                        derivedKey.address === input.address
                    );
                    const isNUTXOAddress = newNUTXODerivedKeys.find(
                      (derivedKey: { address: any }) =>
                        derivedKey.address === input.address
                    );
                    return {
                      address: input.address,
                      txInputIndex: input.txInputIndex,
                      value: input.value,
                      isMine: isMineAddress ? true : false,
                      isNUTXO: isNUTXOAddress ? true : false,
                    };
                  }
                );
                const newTxOuts = txOuts.map(
                  (output: {
                    address: string;
                    lockingScript: string;
                    outputIndex: number;
                    value: number;
                  }) => {
                    const isMineAddress = newKeys.find(
                      (derivedKey: { address: any }) =>
                        derivedKey.address === output.address
                    );
                    const isNUTXOAddress = newNUTXODerivedKeys.find(
                      (derivedKey: { address: any }) =>
                        derivedKey.address === output.address
                    );
                    return {
                      address: output.address,
                      lockingScript: output.lockingScript,
                      outputIndex: output.outputIndex,
                      value: output.value,
                      isMine: isMineAddress ? true : false,
                      isNUTXO: isNUTXOAddress ? true : false,
                    };
                  }
                );
                const newTransaction = {
                  txId: transaction.txId,
                  inputs: newTxInps,
                  outputs: newTxOuts,
                };
                return {
                  ...newTransaction,
                  confirmation: blockHeight ? chainTip - blockHeight : null,
                };
              }
            );
            const {
              diffOutputs: newDiffOutputs,
            } = await this.processAllegoryTransactions(
              diffOutputs,
              transactions
            );
            await Persist.upsertOutputs(newDiffOutputs);
            await Persist.upsertTransactions(transactions);
            await Persist.upsertDerivedKeys(newDerivedKeys);
            await Persist.upsertNUTXODerivedKeys(newNUTXODerivedKeys);
            if (options?.diff) {
              return { transactions };
            } else {
              return await Persist.getTransactions(options);
            }
          } else {
            throw new Error('Error in fetching transactions');
          }
        } else {
          throw new Error('Error in fetching transactions');
        }
      } else {
        if (options?.diff) {
          return { transactions: [] };
        } else {
          return await Persist.getTransactions(options);
        }
      }
    }
    return { transactions: [] };
  }

  async _getTransactions(txIds: string[]) {
    const chunkedTxIds = _.chunk(txIds, 20);
    const data = await Promise.all(
      chunkedTxIds.map(async (chunkedTxId) => {
        return await transactionAPI.getTransactionsByTxIDs(chunkedTxId);
      })
    );
    const transactions = data.map((element) => element.txs).flat();
    return { txs: transactions };
  }

  async _getOutputs(
    derivedKeys: any[],
    prevDiffOutputs: any[] = [],
    prevKeys: any[] = []
  ): Promise<any> {
    const chunkedUsedDerivedKeys = _.chunk(derivedKeys, 20);
    const outputsByAddresses = await Promise.all(
      chunkedUsedDerivedKeys.map(async (chunkedUsedDerivedKey) => {
        return await this._getOutputsByAddresses(chunkedUsedDerivedKey);
      })
    );
    const diffOutputs = outputsByAddresses.flat();
    const updatedKeys = derivedKeys.map(
      (key: { address: string; indexText: string; isUsed: boolean }) => {
        if (!key.isUsed) {
          const found = diffOutputs.some(
            (output: { address: any }) => output.address === key.address
          );
          return { ...key, isUsed: found };
        }
        return key;
      }
    );
    const newDiffOutputs = [...prevDiffOutputs, ...diffOutputs];
    const newKeys = [...prevKeys, ...updatedKeys];
    const walletKeys = newKeys.filter((key: { indexText: string }) => {
      return key.indexText.startsWith(
        derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath
      );
    });
    const nUTXOKeys = newKeys.filter((key: { indexText: string }) => {
      return key.indexText.startsWith(
        derivationPaths.BITCOIN_SV_REGTEST.BIP44.nUTXODerivationPath
      );
    });
    const countOfUnusedKeys = this._countOfUnusedKeys(walletKeys);
    const countOfUnusedNUTXOKeys = this._countOfUnusedKeys(nUTXOKeys);
    if (countOfUnusedKeys < 20 || countOfUnusedNUTXOKeys < 20) {
      const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
      const lastKeyIndex = walletKeys[walletKeys.length - 1].indexText
        .split('/')
        .pop();

      const { derivedKeys: nextDerivedKeys } = await this.generateDerivedKeys(
        bip32ExtendedKey,
        derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath,
        Number(lastKeyIndex) + 1,
        20 - countOfUnusedKeys,
        false
      );

      const nUTXOExtendedKey = await Persist.getNUTXOExtendedKey();
      const lastNUTXOKeyIndex = nUTXOKeys[nUTXOKeys.length - 1].indexText
        .split('/')
        .pop();
      const {
        derivedKeys: nextNUTXODerivedKeys,
      } = await this.generateDerivedKeys(
        nUTXOExtendedKey,
        derivationPaths.BITCOIN_SV_REGTEST.BIP44.nUTXODerivationPath,
        Number(lastNUTXOKeyIndex) + 1,
        20 - countOfUnusedNUTXOKeys,
        false
      );

      const nextKeys = [...nextDerivedKeys, ...nextNUTXODerivedKeys];

      return await this._getOutputs(nextKeys, newDiffOutputs, newKeys);
    } else {
      return {
        diffOutputs: newDiffOutputs,
        derivedKeys: walletKeys,
        nUTXODerivedKeys: nUTXOKeys,
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
    const { outputs } = await Persist.getOutputs();
    if (outputs.length > 0) {
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
        return [...prevOutputs, ...diffOutputs];
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

  async getUnusedNUTXOAddress() {
    const { existingNUTXODerivedKeys } = await Persist.getNUTXODerivedKeys();
    const unusedNUTXODerivedKeys = existingNUTXODerivedKeys
      .filter(
        (existingDerivedKey: { isUsed: any }) =>
          existingDerivedKey.isUsed === false
      )
      .map(
        ({ indexText, address }: { indexText: string; address: string }) =>
          address
      );
    return unusedNUTXODerivedKeys.find(Boolean);
  }

  async _getKeys(addresses: string[]): Promise<object[]> {
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    const { existingNUTXODerivedKeys } = await Persist.getNUTXODerivedKeys();
    const keys = [...existingDerivedKeys, ...existingNUTXODerivedKeys];
    const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
    const nUTXOExtendedKey = await Persist.getNUTXOExtendedKey();

    return addresses.map((address) => {
      const derivedKey = keys.find(
        (derivedKey: { address: string }) => derivedKey.address === address
      );
      let extendedKey;
      if (
        derivedKey.indexText.startsWith(
          derivationPaths.BITCOIN_SV_REGTEST.BIP44.derivationPath
        )
      ) {
        extendedKey = bip32ExtendedKey;
      } else {
        extendedKey = nUTXOExtendedKey;
      }
      const KeyIndex = derivedKey.indexText.split('/').pop();
      const { privkey } = this._getPrivKey(
        extendedKey,
        Number(KeyIndex),
        false
      );
      return ECPair.fromWIF(privkey, networks.regtest);
    });
  }

  async updateTransactionsConfirmations() {
    const { transactions } = await Persist.getTransactionsByConfirmations();
    const txIds = transactions.map((tx: { txId: any }) => tx.txId);
    if (txIds.length > 0) {
      const { txs } = await this._getTransactions(txIds);
      if (txs.length > 0) {
        const { chainInfo } = await chainAPI.getChainInfo();
        if (chainInfo) {
          const { chainTip } = chainInfo;
          const txsWithConfirmation = txs.map(
            (transaction: { blockHeight?: any; txId: string }) => {
              const { blockHeight } = transaction;
              return {
                ...transaction,
                confirmation: blockHeight ? chainTip - blockHeight : null,
              };
            }
          );

          const updatedTransactions: any[] = [];
          const deletedTransactions: any[] = [];
          const unconfirmedTransactions: any[] = [];
          transactions.forEach(
            (transaction: { txId: string; confirmation: number | null }) => {
              const matchedTxWithConfirmation = txsWithConfirmation.find(
                (tx: { txId: string; confirmation: number | null }) =>
                  tx.txId === transaction.txId
              );
              if (
                matchedTxWithConfirmation?.confirmation !==
                transaction.confirmation
              ) {
                updatedTransactions.push({
                  ...transaction,
                  confirmation: matchedTxWithConfirmation?.confirmation,
                });
              }
              if (matchedTxWithConfirmation?.confirmation === null) {
                unconfirmedTransactions.push({
                  ...transaction,
                });
              }
            }
          );

          await Persist.upsertTransactions(updatedTransactions);

          if (unconfirmedTransactions.length > 0) {
            for (
              let index = 0;
              index < unconfirmedTransactions.length;
              index++
            ) {
              const unconfirmedTransaction = unconfirmedTransactions[index];
              const diffInMinutes = differenceInMinutes(
                new Date(),
                Date.parse(unconfirmedTransaction.createdAt)
              );
              if (diffInMinutes > 30) {
                // make inputs of the tx as unspent
                const unspentOutputs = unconfirmedTransaction.inputs.map(
                  (input: { outputTxHash: string; txInputIndex: number }) => {
                    return {
                      outputTxHash: input.outputTxHash,
                      outputIndex: input.txInputIndex,
                    };
                  }
                );
                await Persist.markOutputAsUnspent(unspentOutputs);

                // delete own outputs of this tx
                const ownOutputs = unconfirmedTransaction.outputs.filter(
                  (output: { isMine: boolean }) => output.isMine === true
                );
                const deletedOutputs = ownOutputs.map(
                  (output: { outputIndex: number }) => {
                    return {
                      outputTxHash: unconfirmedTransaction.txId,
                      outputIndex: output.outputIndex,
                    };
                  }
                );
                await Persist.deleteOutputs(deletedOutputs);

                // delete transaction
                deletedTransactions.push(unconfirmedTransaction);
                await Persist.deleteTransactions([unconfirmedTransaction]);
              }
            }
            return {
              updatedTransactions,
              deletedTransactions,
            };
          }
          return { updatedTransactions, deletedTransactions };
        }
      }
    }
    return { updatedTransactions: [], deletedTransactions: [] };
  }

  async relayTx(
    psbt: Psbt,
    transaction: Transaction,
    inputs: any[],
    ownOutputs: any[]
  ) {
    const transactionHex = transaction.toHex();
    const base64 = Buffer.from(transactionHex, 'hex').toString('base64');
    const { txBroadcast } = await transactionAPI.broadcastRawTransaction(
      base64
    );
    if (txBroadcast) {
      const spentUtxos = inputs.map((input: any) => ({
        ...input,
        isSpent: true,
      }));
      const changeOutputs = ownOutputs.map(
        (ownOutput: { address: string }, index) => {
          const transactionOutput = transaction.outs.find((output, index) => {
            const p2pkh = payments.p2pkh({
              output: output.script,
              network: network.BITCOIN_SV_REGTEST,
            });
            return ownOutput.address === p2pkh.address!;
          });

          const transactionIndex = transaction.outs.findIndex(
            (output, index) => {
              const p2pkh = payments.p2pkh({
                output: output.script,
                network: network.BITCOIN_SV_REGTEST,
              });
              return ownOutput.address === p2pkh.address!;
            }
          );

          return {
            address: ownOutput.address,
            isSpent: false,
            outputIndex: transactionIndex,
            outputTxHash: transaction.getId(),
            value: transactionOutput?.value,
          };
        }
      );
      const unconfirmedTransaction = {
        txId: transaction.getId(),
        inputs: transaction.ins.map((input, index) => {
          const p2pkh = payments.p2pkh({
            input: input.script,
            network: network.BITCOIN_SV_REGTEST,
          });
          const isMineInput = inputs.find(
            (inp: { outputTxHash: string; outputIndex: number }) => {
              return (
                inp.outputTxHash ===
                  Buffer.from(input.hash).reverse().toString('hex') &&
                inp.outputIndex === input.index
              );
            }
          );
          return {
            address: p2pkh.address!,
            isMine: isMineInput ? true : false,
            isNUTXO: isMineInput && isMineInput.isNameOutpoint ? true : false,
            txInputIndex: input.index,
            outputTxHash: Buffer.from(input.hash).reverse().toString('hex'),
            value: psbt.data.inputs[index].witnessUtxo?.value,
          };
        }),
        outputs: transaction.outs.map((output, index) => {
          const p2pkh = payments.p2pkh({
            output: output.script,
            network: network.BITCOIN_SV_REGTEST,
          });
          const isMineOutput = ownOutputs.find(
            (ownOutput: { address: string }) => {
              return ownOutput.address === p2pkh.address!;
            }
          );
          return {
            address: p2pkh.address!,
            isMine: isMineOutput ? true : false,
            isNUTXO:
              isMineOutput && isMineOutput.type === 'nUTXO' ? true : false,
            lockingScript: Buffer.from(output.script).toString('hex'),
            outputIndex: index,
            value: output.value,
          };
        }),
        confirmation: null,
        createdAt: new Date(),
      };
      await this.markAddressesUsed(ownOutputs.map(({ address }) => address));
      await Persist.upsertOutputs(spentUtxos);
      await Persist.upsertOutputs(changeOutputs);
      await Persist.upsertTransactions([unconfirmedTransaction]);
      return { transaction: unconfirmedTransaction, txBroadcast };
    }
    throw new Error('Broadcast failed');
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

      const psbt = new Psbt({
        network: network.BITCOIN_SV_REGTEST,
        forkCoin: 'bch',
      });
      psbt.setVersion(1);
      inputs.forEach(
        (input: {
          outputTxHash: any;
          outputIndex: any;
          address: string;
          value: number;
        }) => {
          const p2pkh = payments.p2pkh({
            address: input.address,
            network: network.BITCOIN_SV_REGTEST,
          });
          psbt.addInput({
            hash: input.outputTxHash,
            index: input.outputIndex,
            witnessUtxo: {
              script: p2pkh.output!,
              value: input.value,
            },
          });
        }
      );
      const usedAddresses: any[] = [];
      for (let index = 0; index < outputs.length; index++) {
        const output = outputs[index];
        if (!output.address) {
          const { unusedAddresses } = await this.getUnusedAddresses({
            excludeAddresses: usedAddresses,
          });
          const address = unusedAddresses[0];
          usedAddresses.push({ type: '', title: '', address });
          output.address = address;
        }
        psbt.addOutput({
          address: output.address,
          value: output.value,
        });
      }
      const addresses = inputs.map(
        (input: { address: string }) => input.address
      );
      const keys: object[] = await this._getKeys(addresses);
      keys.forEach((key: any, i) => {
        psbt.signInput(i, key);
      });
      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();
      const transaction = psbt.extractTransaction(true);
      return await this.relayTx(psbt, transaction, inputs, usedAddresses);
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
    return await this._createSendTransaction(utxos, targets, feeRate);
  }

  async getTransactionFee(
    receiverAddress: string,
    amountInSatoshi: number,
    feeRate: number
  ) {
    try {
      const { utxos } = await Persist.getUTXOs();
      const targets = [
        { address: receiverAddress, value: Number(amountInSatoshi) },
      ];
      let { fee } = coinSelect(utxos, targets, feeRate);
      // if (!inputs) throw new Error('Not sufficient funds');
      // if (!outputs) throw new Error('No Receiver specified');
      return fee;
    } catch (error) {
      throw error;
    }
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

  async getUsedAddresses() {
    const { outputs } = await Persist.getOutputs();
    const outputsGroupedByAddress = _.groupBy(outputs, (output) => {
      return output.address;
    });
    const usedAddresses: {
      address: string;
      incomingBalance: number;
      outgoingBalance: number;
      currentBalance: number;
      lastTransaction: any;
    }[] = [];
    for (const [address, outputs] of Object.entries(outputsGroupedByAddress)) {
      const currentBalance = outputs.reduce((acc: number, currOutput: any) => {
        if (!currOutput.spendInfo) {
          acc = acc + currOutput.value;
        }
        return acc;
      }, 0);
      let incomingBalance = 0;
      let outgoingBalance = 0;
      outputs.forEach((output) => {
        if (output.spendInfo) {
          outgoingBalance = outgoingBalance + output.value;
        }
        incomingBalance = incomingBalance + output.value;
      });
      usedAddresses.push({
        address,
        incomingBalance,
        outgoingBalance,
        currentBalance,
        lastTransaction: outputs[0].address,
      });
    }
    return {
      usedAddresses,
    };
  }

  async getUnusedAddresses(options?: {
    excludeAddresses?: string[];
    count?: number;
  }): Promise<{ unusedAddresses: any[] }> {
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    const unusedAddresses = existingDerivedKeys
      .filter(
        (existingDerivedKey: { isUsed: any }) =>
          existingDerivedKey.isUsed === false
      )
      .map(({ address }: { address: string }) => address);
    if (options?.excludeAddresses) {
      const filteredUnusedAddresses = unusedAddresses.filter(
        (unusedAddress: string) => {
          return !options.excludeAddresses?.includes(unusedAddress);
        }
      );
      if (options?.count) {
        return {
          unusedAddresses: filteredUnusedAddresses.slice(0, options.count),
        };
      } else {
        return {
          unusedAddresses: filteredUnusedAddresses.slice(0, 1),
        };
      }
    }
    if (options?.count) {
      return {
        unusedAddresses: unusedAddresses.slice(0, options.count),
      };
    }
    return {
      unusedAddresses: unusedAddresses.slice(0, 1),
    };
  }

  async markAddressesUsed(addresses: string[]) {
    await Persist.markAddressesUsed(addresses);
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
      await Persist.updateProfile(currentProfileName, newProfileName);
      return { profile: newProfileName };
    } catch (error) {
      throw error;
    }
  }

  async getProfiles() {
    return { profiles: await Persist.getProfiles() };
  }

  async getUnregisteredName() {
    return await Persist.getUnregisteredName();
  }

  async logout() {
    return await Persist.destroy();
  }

  async runScript() {
    const targets = [
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
      { address: 'mruMP6ZsrgnqMs1S39nAJNDrwJd2i12eNx', value: 500 },
    ];
    // const { utxos } = await Persist.getUTXOs();
    // const feeRate = 5;
    // await this._createSendTransaction(utxos, targets, feeRate);
    // const keys: any[] = await this._getKeys([
    //   'n3cFZxbA1TAfwQk2HEBYw35L47g5M4BeEL',
    // ]);
    // console.log(keys[0].privateKey.toString('hex'));
    // console.log(await this.getBalance());
    // const { utxos } = await Persist.getUTXOs();
    // const balance = utxos.reduce((acc: number, currOutput: any) => {
    //   if (!currOutput.isSpent) {
    //     acc = acc + currOutput.value;
    //   }
    //   return acc;
    // }, 0);
    // console.log(balance);
    await Persist.deleteOutputs([
      {
        outputTxHash:
          'ffcd565d5ccd065e73463304f30009e5c9d542d3cec274e4a5d6cebfd943bf88',
        outputIndex: 1,
      },
    ]);
  }
}

export default new Wallet();
