import CBOR from 'cbor-js';
import wallet from './Wallet';
import coinSelect from 'coinselect';
import { post } from './httpClient';
import * as Persist from './Persist';
import { transactionAPI } from './TransactionAPI';
import proxyProvider from './ProxyProvider';
import Config from './Config.json';
import network from './constants/network';
import { Psbt, payments } from 'bitcoinjs-lib';

class Allpay {
  async buyName(data: {
    host: string;
    port: number;
    name: number[];
    priceInSatoshi: number;
    isProducer: boolean;
  }) {
    try {
      const { host, port, name, priceInSatoshi, isProducer } = data;
      const feeRate = 0;
      const { utxos } = await Persist.getUTXOs();
      const targets = [{ value: Number(priceInSatoshi) }];
      let { inputs, outputs } = coinSelect(utxos, targets, feeRate);
      if (!inputs || !outputs) throw new Error('Empty inputs or outputs');
      const paymentInputs = inputs.map((input: any) => {
        return [
          {
            opTxHash: input.outputTxHash,
            opIndex: input.outputIndex,
          },
          input.value,
        ];
      });
      const { unusedDerivedKeys } = await wallet.getUnusedDerivedKeys();
      const currentUnusedKeyIndex = unusedDerivedKeys
        ? unusedDerivedKeys[unusedDerivedKeys.length - 1].indexText
        : null;
      const {
        unusedDerivedKeys: nextUnusedDerivedKeys,
      } = await wallet.getUnusedDerivedKeys({
        currentUnusedKeyIndex,
      });
      let outputOwner;
      let outputChange;
      if (unusedDerivedKeys.length > 0) {
        outputOwner = unusedDerivedKeys[0].address;
      }
      if (nextUnusedDerivedKeys.length > 0) {
        outputChange = nextUnusedDerivedKeys[0].address;
      }
      if (outputOwner && outputChange) {
        const {
          data: { psaTx },
        } = await post(
          'partialsign',
          {
            paymentInputs,
            name: [name, isProducer],
            outputOwner,
            outputChange,
          },
          {
            baseURL: `https://${host}:${port}/v1`,
          }
        );
        return await this.decodeTransaction(psaTx);
      } else {
        throw new Error('Error configuring input params');
      }
    } catch (error) {
      throw error;
    }
  }

  async decodeTransaction(psaTx: string) {
    const partiallySignTransaction = JSON.parse(
      Buffer.from(psaTx, 'base64').toString()
    );
    try {
      const psbt = new Psbt({
        network: network.BITCOIN_SV_REGTEST,
        forkCoin: 'bch',
      });
      psbt.setVersion(1);
      const txIds = partiallySignTransaction.ins.map(
        (input: { outpoint: { hash: string; index: number } }) =>
          input.outpoint.hash
      );
      const rawTxsResponse = await transactionAPI.getRawTransactionsByTxIDs(
        txIds
      );
      const inputsWithRawTxs = rawTxsResponse.rawTxs.map((rawTx: any) => {
        const hex = Buffer.from(rawTx.txSerialized, 'base64').toString('hex');
        return { ...rawTx, hex };
      });
      let merged = [];
      for (let i = 0; i < partiallySignTransaction.ins.length; i++) {
        const rawTx = inputsWithRawTxs.find(
          (element: { txId: any }) =>
            element.txId === partiallySignTransaction.ins[i].outpoint.hash
        );
        merged.push({
          ...partiallySignTransaction.ins[i],
          hex: rawTx ? rawTx.hex : '',
        });
      }
      merged.forEach(
        (input: {
          outpoint: { hash: string; index: number };
          sequence: number;
          script: string;
          hex: string;
        }) => {
          psbt.addInput({
            hash: input.outpoint.hash,
            index: input.outpoint.index,
            sequence: input.sequence,
            nonWitnessUtxo: Buffer.from(input.hex, 'hex'),
          });
        }
      );
      partiallySignTransaction.outs.forEach(
        (output: { script: any; value: any }, index: number) => {
          if (index === 0) {
            debugger;
            const embed = payments.embed({
              data: [
                Buffer.from(
                  '416c6c65676f72792f416c6c50617946840001808500820000830082000181830068586f6b656e50325069736f6d657572695f31809f8300830082000281830068586f6b656e50325069736f6d657572695f331874ff',
                  'hex'
                ),
              ],
              network: network.BITCOIN_SV_REGTEST,
            });
            psbt.addOutput({
              script: embed.output!,
              value: output.value,
            });
          } else {
            const p2pkh = payments.p2pkh({
              output: Buffer.from(output.script, 'hex'),
              network: network.BITCOIN_SV_REGTEST,
            });
            psbt.addOutput({
              script: p2pkh.output!,
              value: output.value,
            });
          }
        }
      );
      // psbt.validateSignaturesOfAllInputs();
      // psbt.finalizeAllInputs();
      // const transaction = psbt.extractTransaction(true);
      // return transaction;
      return '';
    } catch (error) {
      debugger;
      console.log(error);
      throw error;
    }
  }

  async decodeTransactionOld() {
    // const transactionHex: string = await this.buyName({
    //   name: 'sh',
    //   priceInSatoshi: 5000,
    //   isProducer: true,
    // });
    // const transaction = JSON.parse(
    //   Buffer.from(transactionHex, 'base64').toString()
    // );
    // await this.verifyRootTx(transaction);
    // const data = [0, 1, [115, 104], [1, [0, 0], [0, [0, 1], [[0, 'XokenP2P', 'someuri_1']]], [[0, 'AllPay', 'Public', [0, 'XokenP2P', 'someuri_2'], [0, 'addrCommit', 'utxoCommit', 'signature', 876543]]]]]
  }

  async verifyRootTx(transaction: any) {
    if (transaction) {
      const resellerInput = transaction.ins[0].outpoint.hash;
      const opReturnData = transaction.outs[0].script;
      const allegoryDataBuffer = Buffer.from(opReturnData, 'hex');
      const allegoryDataArrayBuffer = allegoryDataBuffer.buffer.slice(
        allegoryDataBuffer.byteOffset,
        allegoryDataBuffer.byteOffset + allegoryDataBuffer.byteLength
      );
      const allegoryData = getAllegoryType(
        CBOR.decode(allegoryDataArrayBuffer)
      );
      const nameArray = allegoryData?.getName();
      console.log(nameArray);
      // const action:
      //   | ProducerAction
      //   | OwnerAction
      //   | undefined = allegoryData?.getAction();
      // // const extensions = action.extensions;
      // console.log(extensions);
      if (resellerInput !== Config.allegoryRootNode) {
        const {
          tx: {
            tx: { txInps, txOuts },
          },
        } = await transactionAPI.getTransactionByTxID(resellerInput);
        const parentTransaction = { ins: txInps, outs: txOuts };
        await this.verifyRootTx(parentTransaction);
      } else {
        return true;
      }
    }
    return false;
  }

  async getOutpointForName(name: number[]) {
    if (name && name.length) {
      return [{ name, priceInSatoshi: 5000, host: '127.0.0.1', port: 9189 }];
      // try {
      //   const {
      //     data: { uri },
      //   } = await post('allegory/reseller-uri', {
      //     name,
      //     isProducer: true,
      //   });
      //   if (uri) {
      //     return uri;
      //   }
      // } catch (error) {
      //   throw error;
      // }
    } else {
      throw new Error('Invalid name error');
    }
  }

  async _registerName() {
    const name = [116];
    const xpubKey =
      'tpubDFUpVvBTaPL1PhgZoXFkc1k3DW3SEfATw2ZihVUSuvrs2iDbmijUHw4Z4tGsahBfZYebeeNEivZJ2zdkRWCgCCFgGNf22fKQnhYMx5xG1pU';
    const returnAddress = 'mw2XLviUgKv1v4Xt1yG3R6gNAV252u19Re';
    const addressCount = 10;
    const nutxo = {
      opTxHash:
        '2f2c8d54715b6ea570145e00dd9ed218ec8604f688ca2b7ca9001994811c3397',
      opIndex: 1,
      value: 100000000,
    };
    const psaTx = await this.registerName({
      proxyHost: '127.0.0.1',
      port: 9099,
      name,
      xpubKey,
      returnAddress,
      addressCount,
      nutxo,
    });
    console.log(psaTx);
  }

  async _createTransaction() {
    const recipient = 't';
    const changeAddress = 'mtPPGa2nXXqdwmXQekWiyr7Jpmbb37NCS1';
    const amount = 100000000;
    const { utxos } = await Persist.getUTXOs();
    const psaTx = await this.createTransaction({
      proxyHost: '127.0.0.1',
      port: 9099,
      recipient,
      amount,
      changeAddress,
      utxos,
    });
    console.log(psaTx);
  }

  async registerName(data: {
    proxyHost: string;
    port: number;
    name: number[];
    xpubKey: string;
    returnAddress: string;
    addressCount: number;
    nutxo: {
      opTxHash: string;
      opIndex: number;
      value: number;
    };
  }) {
    const { name, xpubKey, nutxo, returnAddress, addressCount } = data;
    // const name = [116];
    // const xpubKey =
    //   'tpubDFUpVvBTaPL1PhgZoXFkc1k3DW3SEfATw2ZihVUSuvrs2iDbmijUHw4Z4tGsahBfZYebeeNEivZJ2zdkRWCgCCFgGNf22fKQnhYMx5xG1pU';
    // const returnAddress = 'mw2XLviUgKv1v4Xt1yG3R6gNAV252u19Re';
    // const addressCount = 10;
    const nameUtxo = [
      {
        opTxHash: nutxo.opTxHash,
        opIndex: nutxo.opIndex,
      },
      nutxo.value,
    ];
    const request = `{"id": 0, "jsonrpc": "2.0", "method": "REGISTER", "params": { "name": ${name}, "xpubKey": ${xpubKey}, nutxo: ${nameUtxo}, return: ${returnAddress}, addressCount: ${addressCount} }}`;
    proxyProvider.init(data.proxyHost, 9099, request, (response: any) => {
      console.log(response);
    });
  }

  async createTransaction(data: {
    proxyHost: string;
    port: number;
    recipient: string;
    amount: number;
    changeAddress: string;
    utxos: [
      {
        opTxHash: string;
        opIndex: number;
        value: number;
      }
    ];
  }) {
    const { recipient, amount, changeAddress, utxos } = data;
    const inputs = utxos.map((utxo) => {
      return [
        {
          opTxHash: utxo.opTxHash,
          opIndex: utxo.opIndex,
        },
        utxo.value,
      ];
    });
    const request = `{"id": 0, "jsonrpc": "2.0", "method": "PS_ALLPAY_TX", "params": { "methodParams" : { "inputs": ${inputs}, "recipient": ${recipient}, "amount": ${amount}, "change": ${changeAddress} }}}`;
    proxyProvider.init(data.proxyHost, 9099, request, (response: any) => {
      console.log(response);
    });
  }
}

export const allPay = new Allpay();
