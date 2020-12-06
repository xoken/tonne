import sha256 from 'crypto-js/sha256';
import coinSelect from 'coinselect';
import { Psbt, payments } from 'bitcoinjs-lib';
import { decodeCBORData } from './Allegory';
import wallet from './Wallet';
import utils from './Utils';
import { post } from './httpClient';
import * as Persist from './Persist';
import { transactionAPI } from './TransactionAPI';
import proxyProvider from './ProxyProvider';
import Config from './Config.json';
import network from './constants/network';

class Allpay {
  async buyName(data: {
    host: string;
    port: number;
    name: number[];
    priceInSatoshi: number;
    isProducer: boolean;
  }) {
    try {
      const { host, port, name, isProducer } = data;
      const priceInSatoshi = 1000000;
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
        const { psbt } = await this.decodeTransaction(psaBase64);
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

  async decodeTransaction(psaBase64: string, addFunding?: boolean) {
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
      let fundingInputs: any[] = [];
      if (addFunding) {
        const { utxos } = await Persist.getUTXOs();
        const feeRate = 5000;
        const amountInSatoshi = 10000;
        const targets = [{ value: Number(amountInSatoshi) }];
        const { inputs, outputs } = coinSelect(utxos, targets, feeRate);
        fundingInputs = inputs;

        const txIds = fundingInputs.map(
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
        for (let i = 0; i < fundingInputs.length; i++) {
          merged.push({
            ...fundingInputs[i],
            ...inputsWithRawTxs.find(
              (element: { txId: any }) =>
                element.txId === fundingInputs[i].outputTxHash
            ),
          });
        }
        merged.forEach(
          (input: { outputTxHash: any; outputIndex: any; hex: any }) => {
            psbt.addInput({
              hash: input.outputTxHash,
              index: input.outputIndex,
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

        for (let index = 0; index < outputs.length; index++) {
          const output = outputs[index];
          if (!output.address) {
            output.address = await wallet._getChangeAddress();
          }
          psbt.addOutput({
            address: output.address,
            value: output.value,
          });
        }
      } else {
        partiallySignTransaction.outs.forEach(
          (output: { script: any; value: any }, index: number) => {
            psbt.addOutput({
              script: Buffer.from(output.script, 'hex'),
              value: output.value,
            });
          }
        );
      }
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
      return { psbt, fundingInputs };
    } catch (error) {
      throw error;
    }
  }

  async signRelayTransaction({
    psbtHex,
    inputs,
  }: {
    psbtHex: string;
    inputs: any[];
  }) {
    const psbt: Psbt = Psbt.fromHex(psbtHex, {
      network: network.BITCOIN_SV_REGTEST,
      forkCoin: 'bch',
    });
    for (let index = 0; index < psbt.data.inputs.length; index++) {
      const input = psbt.data.inputs[index];
      if (!input.partialSig) {
        const txInput = psbt.txInputs[index];
        const utxo = inputs.find((input) => {
          return (
            input.outputTxHash ===
              Buffer.from(txInput.hash).reverse().toString('hex') &&
            input.outputIndex === txInput.index
          );
        });
        if (utxo) {
          const keys: any[] = await wallet._getKeys([utxo.address]);
          if (keys.length > 0) {
            const key: any = keys[0];
            console.log(key.privateKey.toString('hex'));
            psbt.signInput(index, key);
          }
        } else {
          throw new Error('Error in signing transaction');
        }
      }
    }
    psbt.validateSignaturesOfAllInputs();
    psbt.finalizeAllInputs();
    const transaction = psbt.extractTransaction(true);
    const transactionHex = transaction.toHex();
    const base64 = Buffer.from(transactionHex, 'hex').toString('base64');
    const { txBroadcast } = await transactionAPI.broadcastRawTransaction(
      base64
    );
    return { txBroadcast };
  }

  async verifyRootTx(args: { psbt?: Psbt; transaction?: any }) {
    const { psbt, transaction } = args;
    let inputHash;
    if (psbt || transaction) {
      if (psbt) {
        inputHash = Buffer.from(psbt.txInputs[0].hash)
          .reverse()
          .toString('hex');
      }
      if (transaction) {
        const { txInps } = transaction;

        inputHash = txInps[0].outpointTxID;
      }
      if (inputHash !== Config.allegoryRootNode) {
        const {
          tx: { tx },
        } = await transactionAPI.getTransactionByTxID(inputHash);
        await this.verifyRootTx({ transaction: tx });
      } else {
        return true;
      }
    }
    return false;
  }

  async getOutpointForName(name: number[]) {
    if (name && name.length) {
      try {
        const { data } = await post('allegory/name-outpoint', {
          name,
          isProducer: false,
        });
        return data;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Invalid name error');
    }
  }

  async getResellerURI(name: number[]) {
    if (name && name.length) {
      try {
        const {
          data: { forName, uri, protocol, isProducer },
        } = await post('allegory/reseller-uri', {
          name,
          isProducer: true,
        });
        if (utils.arraysEqual(name, forName) && isProducer === true) {
          return { isAvailable: false, name };
        } else {
          return { isAvailable: true, name, uri, protocol };
        }
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Invalid name error');
    }
  }

  async createTransaction(args: {
    allpayName: string;
    amountInSatoshi: number;
    feeRate: number;
  }) {
    const { allpayName, amountInSatoshi, feeRate } = args;
    const {
      forName,
      isProducer,
      outPoint: { opTxHash, opIndex },
      script,
    } = await this.getOutpointForName(utils.getCodePoint(allpayName));
    const {
      tx: {
        tx: { txOuts },
      },
    } = await transactionAPI.getTransactionByTxID(opTxHash);
    const OP_RETURN_OUTPUT = txOuts[0];
    const { lockingScript } = OP_RETURN_OUTPUT;
    const cborData = decodeCBORData(lockingScript);
    console.log(cborData);
    const proxyHost = '127.0.0.1';
    const proxyPort = 9099;
    const recipient = sha256(lockingScript).toString();
    console.log(lockingScript);
    console.log(recipient);
    const { unusedDerivedAddresses } = await wallet.getUnusedDerivedKeys();
    const changeAddress = unusedDerivedAddresses[0].address;
    const { utxos } = await Persist.getUTXOs();
    const targets = [{ value: Number(amountInSatoshi) }];
    let { inputs, outputs } = coinSelect(utxos, targets, feeRate);
    debugger;
    if (!inputs || !outputs) throw new Error('Empty inputs or outputs');
    const {
      result: { tx: psaBase64 },
    } = await this._createTransaction({
      proxyHost,
      proxyPort,
      recipient,
      amountInSatoshi,
      changeAddress,
      utxos: inputs,
    });
    const { psbt } = await this.decodeTransaction(psaBase64);
    return {
      psbt,
      inputs: inputs,
    };
  }

  async _createTransaction(data: {
    proxyHost: string;
    proxyPort: number;
    recipient: string;
    amountInSatoshi: number;
    changeAddress: string;
    utxos: {
      outputTxHash: string;
      outputIndex: number;
      value: number;
    }[];
  }): Promise<any> {
    const { recipient, amountInSatoshi, changeAddress, utxos } = data;
    const inputs = utxos.map((utxo) => {
      return [
        {
          txid: utxo.outputTxHash,
          index: utxo.outputIndex,
        },
        Number(utxo.value),
      ];
    });
    const jsonRPCRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: 'PS_ALLPAY_TX',
      params: {
        inputs: inputs,
        recipient: recipient,
        amount: Number(amountInSatoshi),
        change: changeAddress,
      },
    };
    return await proxyProvider.sendRequest(
      data.proxyHost,
      data.proxyPort,
      JSON.stringify(jsonRPCRequest)
    );
  }

  async registerName(data: {
    proxyHost: string;
    proxyPort: number;
    name: string;
    addressCount: number;
  }) {
    const { proxyHost, proxyPort, name, addressCount } = data;
    const nameCodePoint = utils.getCodePoint(name);
    const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
    const xpubKey = wallet.getBIP32ExtendedPubKey(bip32ExtendedKey);
    const { unusedDerivedAddresses } = await wallet.getUnusedDerivedKeys();
    const returnAddress = unusedDerivedAddresses[0].address;
    const { nUTXOs } = await Persist.getNUtxo(name);
    if (nUTXOs) {
      const {
        result: { tx: psaBase64 },
      } = await this._registerName({
        proxyHost,
        proxyPort,
        name: nameCodePoint,
        xpubKey,
        returnAddress,
        addressCount,
        nutxo: nUTXOs,
      });

      const { psbt, fundingInputs } = await this.decodeTransaction(psaBase64);
      debugger;
      return {
        psbt,
        inputs: [...nUTXOs, ...fundingInputs],
      };
    } else {
      throw new Error("Couldn't find utxo for selected name");
    }
  }

  async _registerName(data: {
    proxyHost: string;
    proxyPort: number;
    name: number[];
    xpubKey: string;
    returnAddress: string;
    addressCount: number;
    nutxo: {
      outputTxHash: string;
      outputIndex: number;
      value: number;
    };
  }): Promise<any> {
    const { name, xpubKey, nutxo, returnAddress, addressCount } = data;
    const nameUtxo = [
      {
        txid: nutxo.outputTxHash,
        index: nutxo.outputIndex,
      },
      nutxo.value,
    ];
    const jsonRPCRequest = {
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
    return await proxyProvider.sendRequest(
      data.proxyHost,
      data.proxyPort,
      JSON.stringify(jsonRPCRequest)
    );
  }
}

export const allPay = new Allpay();
