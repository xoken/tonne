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
import * as bip39 from 'bip39';
import * as _ from 'lodash';
// import { differenceInMinutes } from 'date-fns';
import * as Persist from './Persist';
import derivationPaths from './constants/derivationPaths';
import network from './constants/network';
import { addressAPI } from './AddressAPI';
import { transactionAPI } from './TransactionAPI';
import { chainAPI } from './ChainAPI';
// import { allPay } from './allPay';

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
      const { derivedKeys: newDerivedKeys } = await this.generateDerivedKeys(
        bip32ExtendedKey,
        Number(lastKeyIndex) + 1,
        20 - countOfUnusedKeys,
        true
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
    //     privkey: 'cTP23waCMwbWfDoH53PGJNpbyiyMk2g2djhuXff5XhPNuewqdKNY',
    //   };
    // }
    return { privkey };
  }

  async generateDerivedKeys(
    bip32ExtendedKey: string,
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
      //   derivedKey.address = 'mkTJA5GAsJQp7UmAgh43AVAVM4BvjWbG7z';
      // derivedKey.privkey =
      //   'cTP23waCMwbWfDoH53PGJNpbyiyMk2g2djhuXff5XhPNuewqdKNY';
      // derivedKey.address = 'mmKu1EzwGmicQA5XwpFVDBegwNjf7h55MP';
      // derivedKey.privkey =
      //   'cSn2zVDF4c7w63rH1Cc2uXsMr6UzFAwasTRmm4CpQet1ofuVKzRj';
      // derivedKeys.push({ ...derivedKey, isUsed: false });
      // } else {
      const derivedKey = this._generateDerivedKeys(
        bip32ExtendedKey,
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

  async getTransaction(txid: string) {
    try {
      return await transactionAPI.getTransactionByTxID(txid);
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

  async getTransactions(options?: {
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
        // const { txs } = await transactionAPI.getTransactionsByTxIDs(txIds);
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
              confirmations?: number;
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
                    const isMineAddress = newDerivedKeys.find(
                      (derivedKey: { address: any }) =>
                        derivedKey.address === input.address
                    );
                    return {
                      address: input.address,
                      txInputIndex: input.txInputIndex,
                      value: input.value,
                      isMine: isMineAddress ? true : false,
                    };
                  }
                );
                const newTxOuts = txOuts.map(
                  (output: {
                    address: string;
                    outputIndex: number;
                    value: number;
                  }) => {
                    const isMineAddress = newDerivedKeys.find(
                      (derivedKey: { address: any }) =>
                        derivedKey.address === output.address
                    );
                    return {
                      address: output.address,
                      outputIndex: output.outputIndex,
                      value: output.value,
                      isMine: isMineAddress ? true : false,
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
                  confirmations: blockHeight
                    ? chainTip - blockHeight
                    : undefined,
                };
              }
            );
            let confirmedTxs: any[] = [];
            let unConfirmedTxs: any[] = [];
            transactions.forEach((transaction) => {
              if (transaction.confirmations! >= 0) {
                confirmedTxs.push(transaction);
              } else {
                unConfirmedTxs.push(transaction);
              }
            });
            await Persist.upsertOutputs(diffOutputs);
            await Persist.upsertTransactions(confirmedTxs);
            await Persist.upsertUnconfirmedTransactions(unConfirmedTxs);
            await Persist.upsertDerivedKeys(newDerivedKeys);
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

  // async getOutputs(options?: {
  //   startkey?: string;
  //   limit?: number;
  //   pageNo?: number;
  //   diff?: boolean;
  // }) {
  //   const { existingDerivedKeys } = await Persist.getDerivedKeys();
  //   if (existingDerivedKeys.length > 0) {
  //     const {
  //       derivedKeys: newDerivedKeys,
  //       diffOutputs,
  //     } = await this._getOutputs(existingDerivedKeys);
  //     if (diffOutputs.length > 0) {
  //       const outputsGroupedByTx = _.groupBy(diffOutputs, (output) => {
  //         return output.outputTxHash;
  //       });
  //       const diffTrasactions = Object.entries(outputsGroupedByTx).map(
  //         ([key, value], index) => {
  //           return {
  //             txId: key,
  //             confirmed: true,
  //             outputs: value,
  //           };
  //         }
  //       );
  //       await Persist.upsertOutputs(diffOutputs);
  //       await Persist.upsertTransactions(diffTrasactions);
  //       await Persist.upsertDerivedKeys(newDerivedKeys);
  //     }
  //     if (options?.diff) {
  //       return { outputs: diffOutputs };
  //     } else {
  //       return await Persist.getOutputs(options);
  //     }
  //   }
  //   return { outputs: [] };
  // }

  async _getOutputs(
    derivedKeys: any[],
    prevOutputs: any[] = [],
    prevDiffOutputs: any[] = [],
    prevKeys: any[] = []
  ): Promise<any> {
    const chunkedUsedDerivedKeys = _.chunk(derivedKeys, 20);
    const data = await Promise.all(
      chunkedUsedDerivedKeys.map(async (chunkedUsedDerivedKey) => {
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
      const { derivedKeys: nextDerivedKeys } = await this.generateDerivedKeys(
        bip32ExtendedKey,
        Number(lastKeyIndex) + 1,
        20 - countOfUnusedKeys,
        true
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

  async updateconfirmations() {
    // const {
    //   unconfirmedTransactions,
    // } = await Persist.getUnconfirmedTransactions();
    // const unconfirmedTxIds = unconfirmedTransactions.map(
    //   (unconfirmedTx: { txId: any }) => unconfirmedTx.txId
    // );
    // if (unconfirmedTxIds.length > 0) {
    //   const { txs } = await transactionAPI.getTransactionsByTxIDs(
    //     unconfirmedTxIds
    //   );
    //   if (txs.length > 0) {
    //     const updatedUnconfirmedTransactions = unconfirmedTransactions.map(
    //       (unconfirmedTx: { txId: any }) => {
    //         const isConfirmed = txs.find(
    //           (tx: { txId: any; blockHeight: number }) => {
    //             if (tx.blockHeight && tx.txId === unconfirmedTx.txId) {
    //               return true;
    //             }
    //             return false;
    //           }
    //         );
    //         if (isConfirmed) {
    //           return {
    //             ...unconfirmedTx,
    //             confirmed: true,
    //           };
    //         }
    //         return {
    //           ...unconfirmedTx,
    //           confirmed: false,
    //         };
    //       }
    //     );
    //     const confirmedTxs = updatedUnconfirmedTransactions.filter(
    //       (tx: { confirmed: boolean }) => tx.confirmed === true
    //     );
    //     if (confirmedTxs.length > 0) {
    //       const confirmedOutputsPerTx = confirmedTxs.map(
    //         (confirmedTx: { outputs: any }) => confirmedTx.outputs
    //       );
    //       const confirmedOutputs = confirmedOutputsPerTx.flat();
    //       const updatedConfirmedOutputs = confirmedOutputs.map(
    //         (output: any) => ({
    //           ...output,
    //           confirmed: true,
    //         })
    //       );
    //       await Persist.updateOutputs(updatedConfirmedOutputs);
    //       await Persist.deleteUnconfirmedTx(confirmedTxs);
    //     }
    //   }
    // }
  }

  async updateUnconfirmedTransactions() {
    const {
      unconfirmedTransactions,
    } = await Persist.getUnconfirmedTransactions();
    const unconfirmedTxIds = unconfirmedTransactions.map(
      (unconfirmedTx: { txId: any }) => unconfirmedTx.txId
    );
    if (unconfirmedTxIds.length > 0) {
      const { txs } = await transactionAPI.getTransactionsByTxIDs(
        unconfirmedTxIds
      );
      if (txs.length > 0) {
        const updatedUnconfirmedTransactions = unconfirmedTransactions.map(
          (unconfirmedTx: { txId: any }) => {
            const isConfirmed = txs.find(
              (tx: { txId: any; blockHeight: number }) => {
                if (tx.blockHeight && tx.txId === unconfirmedTx.txId) {
                  return true;
                }
                return false;
              }
            );
            if (isConfirmed) {
              return {
                ...unconfirmedTx,
                confirmed: true,
              };
            }
            return {
              ...unconfirmedTx,
              confirmed: false,
            };
          }
        );
        const confirmedTxs = updatedUnconfirmedTransactions.filter(
          (tx: { confirmed: boolean }) => tx.confirmed === true
        );
        if (confirmedTxs.length > 0) {
          const confirmedOutputsPerTx = confirmedTxs.map(
            (confirmedTx: { outputs: any }) => confirmedTx.outputs
          );
          const confirmedOutputs = confirmedOutputsPerTx.flat();
          const updatedConfirmedOutputs = confirmedOutputs.map(
            (output: any) => ({
              ...output,
              confirmed: true,
            })
          );
          await Persist.updateOutputs(updatedConfirmedOutputs);
          await Persist.deleteUnconfirmedTx(confirmedTxs);
        }
      }
    }
  }

  // async getUTXOs() {
  //   const { existingDerivedKeys } = await Persist.getDerivedKeys();
  //   if (existingDerivedKeys.length > 0) {
  //     const { derivedKeys: newDerivedKeys, diffUTXOs } = await this._getUTXOs(
  //       existingDerivedKeys
  //     );
  //     if (diffUTXOs.length > 0) {
  //       const { lastUpdated } = await Persist.getOutputsLastUpdated();
  //       const newDiffUtxos = [];
  //       for (let index = 0; index < diffUTXOs.length; index++) {
  //         const { isPresent, _id, _rev } = await Persist.isInOutputsNew(
  //           diffUTXOs[index]
  //         );
  //         if (!isPresent) {
  //           newDiffUtxos.push({ ...diffUTXOs[index], isSpent: false });
  //         } else {
  //           const diffInMinutes = differenceInMinutes(
  //             new Date(),
  //             Date.parse(lastUpdated)
  //           );
  //           if (diffInMinutes > 30) {
  //             newDiffUtxos.push({
  //               ...diffUTXOs[index],
  //               _id,
  //               _rev,
  //               isSpent: false,
  //             });
  //           }
  //         }
  //       }
  //       if (newDiffUtxos.length > 0) {
  //         await Persist.upsertDerivedKeys(newDerivedKeys);
  //         await Persist.updateOutputs(newDiffUtxos);
  //       }
  //     }
  //   }
  // }

  // async _getUTXOs(
  //   derivedKeys: any[],
  //   prevUtxos: any[] = [],
  //   prevDiffUtxos: any[] = [],
  //   prevKeys: any[] = []
  // ): Promise<any> {
  //   const chunkedUsedDerivedKeys = _.chunk(derivedKeys, 20);
  //   const data = await Promise.all(
  //     chunkedUsedDerivedKeys.map(async (chunkedUsedDerivedKey) => {
  //       return await this._getUTXOsByAddresses(chunkedUsedDerivedKey);
  //     })
  //   );
  //   const utxos = data.flat();
  //   const diffUTXOs = await this._getDiffUTXOs(utxos);
  //   const updatedKeys = derivedKeys.map(
  //     (key: { address: string; indexText: string; isUsed: boolean }) => {
  //       if (!key.isUsed) {
  //         const found = utxos.some(
  //           (utxo: { address: any }) => utxo.address === key.address
  //         );
  //         return { ...key, isUsed: found };
  //       }
  //       return key;
  //     }
  //   );
  //   const newUtxos = [...prevUtxos, ...utxos];
  //   const newDiffUtxos = [...prevDiffUtxos, ...diffUTXOs];
  //   const newKeys = [...prevKeys, ...updatedKeys];
  //   const countOfUnusedKeys = this._countOfUnusedKeys(newKeys);
  //   if (countOfUnusedKeys < 20) {
  //     const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
  //     const lastKeyIndex = derivedKeys[derivedKeys.length - 1].indexText
  //       .split('/')
  //       .pop();
  //     const { derivedKeys: nextDerivedKeys } = await this.generateDerivedKeys(
  //       bip32ExtendedKey,
  //       Number(lastKeyIndex) + 1,
  //       20 - countOfUnusedKeys,
  //       false
  //     );
  //     return await this._getUTXOs(
  //       nextDerivedKeys,
  //       newUtxos,
  //       newDiffUtxos,
  //       newKeys
  //     );
  //   } else {
  //     return {
  //       utxos: newUtxos,
  //       diffUTXOs: newDiffUtxos,
  //       derivedKeys: newKeys,
  //     };
  //   }
  // }

  // async _getUTXOsByAddresses(
  //   keys: any[],
  //   prevUtxos: any[] = [],
  //   nextCursor?: number
  // ): Promise<any> {
  //   const addresses = this._getAddressesFromKeys(keys);
  //   const data: {
  //     utxos: any[];
  //     nextCursor: number;
  //   } = await addressAPI.getUTXOsByAddresses(addresses, 100, nextCursor);
  //   const { lastFetched } = await Persist.getOutputsLastFetched();
  //   if (lastFetched) {
  //     const diffUTXOs = await this._getDiffUTXOs(data.utxos);
  //     if (diffUTXOs.length === data.utxos.length) {
  //       const utxos = [...prevUtxos, ...diffUTXOs];
  //       if (data.nextCursor) {
  //         return await this._getUTXOsByAddresses(keys, utxos, data.nextCursor);
  //       } else {
  //         return utxos;
  //       }
  //     } else {
  //       return diffUTXOs;
  //     }
  //   } else {
  //     const utxos = [...prevUtxos, ...data.utxos];
  //     if (data.nextCursor) {
  //       return await this._getUTXOsByAddresses(keys, utxos, data.nextCursor);
  //     } else {
  //       return utxos;
  //     }
  //   }
  // }

  // async _getDiffUTXOs(utxos: any[]) {
  //   const newUTXOs: any[] = [];
  //   for (let index = 0; index < utxos.length; index++) {
  //     if (!(await Persist.isInUTXOs(utxos[index]))) {
  //       newUTXOs.push(utxos[index]);
  //     } else {
  //       return newUTXOs;
  //     }
  //   }
  //   return newUTXOs;
  // }

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
    return addresses.map((address) => {
      const derivedKey = existingDerivedKeys.find(
        (derivedKey: { address: string }) => derivedKey.address === address
      );
      const KeyIndex = derivedKey.indexText.split('/').pop();
      const { privkey } = this._getPrivKey(
        bip32ExtendedKey,
        Number(KeyIndex),
        true
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
      const addresses = merged.map((input) => input.address);
      const keys: object[] = await this._getKeys(addresses);
      keys.forEach((key: any, i) => {
        psbt.signInput(i, key);
      });
      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();
      const transaction = psbt.extractTransaction(true);
      const transactionHex = transaction.toHex();
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
        await Persist.upsertUnconfirmedTransactions([
          {
            txId: transaction.getId(),
            confirmed: false,
            outputs: spentUtxos,
            createdAt: new Date(),
          },
        ]);
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

  async getUsedDerivedKeys() {
    const { outputs } = await Persist.getOutputs();
    const outputsGroupedByAddress = _.groupBy(outputs, (output) => {
      return output.address;
    });
    const usedDerivedKeys: {
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
      usedDerivedKeys.push({
        address,
        incomingBalance,
        outgoingBalance,
        currentBalance,
        lastTransaction: outputs[0].address,
      });
    }
    return {
      usedDerivedKeys,
    };
  }

  async getUnusedDerivedKeys(options?: {
    excludeAddresses?: string[];
    count?: number;
  }): Promise<{ unusedDerivedAddresses: any[] }> {
    const { existingDerivedKeys } = await Persist.getDerivedKeys();
    const unusedDerivedKeys = existingDerivedKeys
      .filter(
        (existingDerivedKey: { isUsed: any }) =>
          existingDerivedKey.isUsed === false
      )
      .map(
        ({ indexText, address }: { indexText: string; address: string }) => ({
          address,
        })
      );
    if (options?.excludeAddresses) {
      const filteredUnusedDerivedKeys = unusedDerivedKeys.filter(
        (existingDerivedKey: { address: string }) => {
          return !options.excludeAddresses?.includes(
            existingDerivedKey.address
          );
        }
      );
      if (options?.count) {
        return {
          unusedDerivedAddresses: filteredUnusedDerivedKeys.slice(
            0,
            options.count
          ),
        };
      } else {
        return {
          unusedDerivedAddresses: filteredUnusedDerivedKeys.slice(0, 1),
        };
      }
    }
    if (options?.count) {
      return {
        unusedDerivedAddresses: unusedDerivedKeys.slice(0, options.count),
      };
    }
    return {
      unusedDerivedAddresses: unusedDerivedKeys.slice(0, 1),
    };
  }

  async updateDerivedKeys(addresses: string[]) {
    await Persist.updateDerivedKeys(addresses);
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

  async logout() {
    return await Persist.destroy();
  }

  async runScript() {
    // const targets = [
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    //   { address: 'mtrhqWnEWA8TRmp6oJLoxEVrR1Pc28h9ZX', value: 500 },
    // ];
    // const { utxos } = await Persist.getUTXOs();
    // const feeRate = 5;
    // await this._createSendTransaction(utxos, targets, feeRate);
    const keys: any[] = await this._getKeys([
      'n3VYrcmpsEKiCJizffyvGit7hq2uS2sLfu',
    ]);
    console.log(keys[0].privateKey.toString('hex'));
    // Persist.runScript();
  }
}

export default new Wallet();
