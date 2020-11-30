import CBOR from 'cbor-js';
import wallet from './Wallet';
import coinSelect from 'coinselect';
import { post } from './httpClient';
import * as Persist from './Persist';
import { transactionAPI } from './TransactionAPI';
import proxyProvider from './ProxyProvider';
import Config from './Config.json';
import network from './constants/network';
import { Psbt, payments, Transaction } from 'bitcoinjs-lib';

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
      console.log(inputs);
      const paymentInputs = inputs.map((input: any) => {
        return [
          {
            opTxHash: input.outputTxHash,
            opIndex: input.outputIndex,
          },
          input.value,
        ];
      });
      const { unusedDerivedAddresses } = await wallet.getUnusedDerivedKeys({
        count: 2,
      });
      let outputOwner;
      let outputChange;
      if (unusedDerivedAddresses.length >= 2) {
        outputOwner = unusedDerivedAddresses[0].address;
        outputChange = unusedDerivedAddresses[1].address;
      }
      if (outputOwner && outputChange) {
        const {
          data: { psaTx: psaBase64 },
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
        const { psbt, inputs } = await this.decodeTransaction(psaBase64);
        return {
          psbt,
          name: [name, isProducer],
          inputs,
          outputOwner,
          outputChange,
        };
      } else {
        throw new Error('Error configuring input params');
      }
    } catch (error) {
      throw error;
    }
  }

  async decodeTransaction(psaBase64: string) {
    const partiallySignTransaction = JSON.parse(
      Buffer.from(psaBase64, 'base64').toString()
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
      let inputs = [];
      for (let i = 0; i < partiallySignTransaction.ins.length; i++) {
        const rawTx = inputsWithRawTxs.find(
          (element: { txId: any }) =>
            element.txId === partiallySignTransaction.ins[i].outpoint.hash
        );
        inputs.push({
          ...partiallySignTransaction.ins[i],
          hex: rawTx ? rawTx.hex : '',
        });
      }
      inputs.forEach(
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
          psbt.addOutput({
            script: Buffer.from(output.script, 'hex'),
            value: output.value,
          });
        }
      );
      partiallySignTransaction.ins.forEach(
        (input: { script: string }, index: number) => {
          if (input.script) {
            const p2pkh = payments.p2pkh({
              input: Buffer.from(input.script, 'hex'),
              network: network.BITCOIN_SV_REGTEST,
            });
            psbt.updateInput(index, {
              partialSig: [
                {
                  pubkey: p2pkh.pubkey!,
                  signature: p2pkh.signature!,
                },
              ],
            });
          }
        }
      );
      return { psbt, inputs };
    } catch (error) {
      throw error;
    }
  }

  async signRelayTransaction({
    psbtHex,
    inputs,
    outputOwner,
    outputChange,
  }: {
    psbtHex: string;
    inputs: any[];
    outputOwner: string;
    outputChange: string;
  }) {
    console.log(inputs);
    const psbt: Psbt = Psbt.fromHex(psbtHex, {
      network: network.BITCOIN_SV_REGTEST,
      forkCoin: 'bch',
    });
    for (let index = 0; index < psbt.data.inputs.length; index++) {
      const input = psbt.data.inputs[index];
      if (!input.partialSig) {
        const utxo = inputs.find((inputArg) => {
          return (
            inputArg.hex === Buffer.from(input.nonWitnessUtxo!).toString('hex')
          );
        });
        if (utxo) {
          const address = payments.p2pkh({
            input: Buffer.from(utxo.script, 'hex'),
            network: network.BITCOIN_SV_REGTEST,
          }).address!;
          console.log(address);
          const keys: any[] = await wallet._getKeys([
            'mvgiiNZhBHvq3iKxUbqKJTVhNzC23RQUG9',
          ]);
          console.log(keys[0].privateKey.toString('hex'));
          debugger;
          if (keys.length > 0) {
            const key: any = keys[0];
            psbt.signInput(index, key);
          }
        }
      }
    }
    psbt.validateSignaturesOfAllInputs();
    psbt.finalizeAllInputs();
    const transaction = psbt.extractTransaction(true);
    const transactionHex = transaction.toHex();
    console.log(transactionHex);
    const base64 = Buffer.from(transactionHex, 'hex').toString('base64');
    // const { txBroadcast } = await transactionAPI.broadcastRawTransaction(
    //   base64
    // );
    // if (txBroadcast) {
    // wallet.updateDerivedKeys([outputOwner, outputChange]);
    // const spentUtxos = inputs.map((input: any) => ({
    //   ...input,
    //   isSpent: true,
    //   confirmed: false,
    // }));
    // await Persist.updateOutputs(spentUtxos);
    // await Persist.upsertUnconfirmedTransactions([
    //   {
    //     txId: transaction.getId(),
    //     confirmed: false,
    //     outputs: spentUtxos,
    //     createdAt: new Date(),
    //   },
    // ]);
    // }
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

  async relayTransaction(transactionHex: string) {
    try {
      const base64 = Buffer.from(transactionHex, 'hex').toString('base64');
      const { txBroadcast } = await transactionAPI.broadcastRawTransaction(
        base64
      );
      // if (txBroadcast) {
      //   const spentUtxos = inputs.map((input: any) => ({
      //     ...input,
      //     isSpent: true,
      //     confirmed: false,
      //   }));
      //   await Persist.updateOutputs(spentUtxos);
      //   await Persist.upsertUnconfirmedTransactions([
      //     {
      //       txId: transaction.getId(),
      //       confirmed: false,
      //       outputs: spentUtxos,
      //       createdAt: new Date(),
      //     },
      //   ]);
      // }
      return txBroadcast;
    } catch (error) {
      throw error;
    }
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
      // const action:
      //   | ProducerAction
      //   | OwnerAction
      //   | undefined = allegoryData?.getAction();
      // // const extensions = action.extensions;
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
  }

  async registerName(name: string) {
    const nameCodePoint = this.getCodePoint(name);
    const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
    const xpubKey = wallet.getBIP32ExtendedPubKey(bip32ExtendedKey);
    const { unusedDerivedAddresses } = await wallet.getUnusedDerivedKeys();
    const returnAddress = unusedDerivedAddresses[0];
    const addressCount = 10;
    const nutxo = await Persist.getNUtxo(name);
    try {
      this._registerName(
        {
          proxyHost: '127.0.0.1',
          port: 9099,
          name: nameCodePoint,
          xpubKey,
          returnAddress,
          addressCount,
          nutxo,
        },
        (response: any) => {
          return Promise.resolve(response);
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  _registerName(
    data: {
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
    },
    onResponse: { (response: any): void; (arg0: { psaTx: any }): void }
  ) {
    const { name, xpubKey, nutxo, returnAddress, addressCount } = data;
    const nameUtxo = [
      {
        txid: nutxo.opTxHash,
        index: nutxo.opIndex,
      },
      nutxo.value,
    ];
    const jsonRequest = {
      id: 0,
      jsonrpc: '2.0',
      method: 'REGISTER',
      params: {
        name: name,
        xpubKey: xpubKey,
        nutxo: nameUtxo,
        return: returnAddress,
        addressCount: addressCount,
      },
    };
    proxyProvider.init(
      data.proxyHost,
      9099,
      JSON.stringify(jsonRequest),
      (response: any) => {
        if (response.tx) {
          onResponse({ psaTx: response.tx });
        } else {
          throw new Error('Error in making TLS requst');
        }
      }
    );
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
    const request = {
      id: 0,
      jsonrpc: '2.0',
      method: 'PS_ALLPAY_TX',
      params: {
        methodParams: { inputs: inputs },
        recipient: recipient,
        amount: amount,
        change: changeAddress,
      },
    };
    proxyProvider.init(
      data.proxyHost,
      9099,
      JSON.stringify(request),
      (response: any) => {}
    );
  }

  removeOpReturn(data: string) {
    return Buffer.from(data).toString('hex').substring(38);
  }

  decodeCBORData(data: string) {
    const hexData = this.removeOpReturn(data);
    const allegoryDataBuffer = Buffer.from(hexData, 'hex');
    const allegoryDataArrayBuffer = allegoryDataBuffer.buffer.slice(
      allegoryDataBuffer.byteOffset,
      allegoryDataBuffer.byteOffset + allegoryDataBuffer.byteLength
    );
    return CBOR.decode(allegoryDataArrayBuffer);
  }

  getCodePoint(name: string) {
    const nameCodePoints: number[] = [];
    for (let i = 0; i < name.length; i++) {
      nameCodePoints.push(name.codePointAt(i)!);
    }
    return nameCodePoints;
  }
}

export const allPay = new Allpay();
