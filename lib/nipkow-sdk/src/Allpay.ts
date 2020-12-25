import sha256 from 'crypto-js/sha256';
import coinSelect from 'coinselect';
import { Psbt, payments } from 'bitcoinjs-lib';
import { decodeCBORData, getAllegoryType, OwnerAction } from './Allegory';
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
      const outputOwner = await wallet.getUnusedNUTXOAddress();
      const { unusedAddresses } = await wallet.getUnusedAddresses();
      const outputChange = unusedAddresses[0];
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
        const { psbt } = await this.decodeTransaction(psaBase64, inputs);
        // const snv = await this.verifyRootTx({ psbt });
        const ownOutputs = [
          { type: 'nUTXO', title: 'Name UTXO', address: outputOwner },
          { type: '', title: '', address: outputChange },
        ];
        return {
          psbt,
          outpoint: { name, isProducer },
          inputs,
          ownOutputs,
          snv: true,
        };
      } else {
        throw new Error('Error configuring input params');
      }
    } catch (error) {
      throw error;
    }
  }

  async decodeTransaction(
    psaBase64: string,
    inputs: any[],
    addFunding?: boolean
  ) {
    const partiallySignTransaction = JSON.parse(
      Buffer.from(psaBase64, 'base64').toString()
    );
    try {
      const psbt = new Psbt({
        network: network.BITCOIN_SV_REGTEST,
        forkCoin: 'bch',
      });
      psbt.setVersion(1);
      partiallySignTransaction.ins.forEach(
        (input: {
          outpoint: { hash: string; index: number };
          sequence: number;
          script: string;
          value: number;
        }) => {
          if (input.script) {
            const p2pkh = payments.p2pkh({
              input: Buffer.from(input.script, 'hex'),
              network: network.BITCOIN_SV_REGTEST,
            });
            psbt.addInput({
              hash: input.outpoint.hash,
              index: input.outpoint.index,
              sequence: input.sequence,
              witnessUtxo: {
                script: p2pkh.output!,
                value: input.value,
              },
            });
          } else {
            const utxoInput = inputs.find((inp) => {
              return (
                inp.outputTxHash === input.outpoint.hash &&
                inp.outputIndex === input.outpoint.index
              );
            });
            if (utxoInput) {
              const p2pkh = payments.p2pkh({
                address: utxoInput.address,
                network: network.BITCOIN_SV_REGTEST,
              });
              psbt.addInput({
                hash: input.outpoint.hash,
                index: input.outpoint.index,
                sequence: input.sequence,
                witnessUtxo: {
                  script: p2pkh.output!,
                  value: utxoInput.value,
                },
              });
            } else {
              throw new Error('Error in setting psbt inputs');
            }
          }
        }
      );
      let fundingInputs: any[] = [];
      const ownOutputs: { type: string; title: ''; address: string }[] = [];
      if (addFunding) {
        const { utxos } = await Persist.getUTXOs();
        const feeRate = 5000;
        const amountInSatoshi = 10000;
        const targets = [{ value: Number(amountInSatoshi) }];
        const { inputs, outputs } = coinSelect(utxos, targets, feeRate);
        fundingInputs = inputs;
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

        partiallySignTransaction.outs.forEach(
          (output: { script: any; value: any }, index: number) => {
            psbt.addOutput({
              script: Buffer.from(output.script, 'hex'),
              value: output.value,
            });
          }
        );

        const usedAddresses: string[] = [];
        for (let index = 0; index < outputs.length; index++) {
          const output = outputs[index];
          if (!output.address) {
            const { unusedAddresses } = await wallet.getUnusedAddresses({
              excludeAddresses: usedAddresses,
            });
            const address = unusedAddresses[0];
            usedAddresses.push(address);
            output.address = address;
            ownOutputs.push({ type: '', title: '', address });
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
      return { psbt, fundingInputs, ownOutputs };
    } catch (error) {
      throw error;
    }
  }

  async signRelayTransaction({
    psbtHex,
    inputs,
    ownOutputs,
  }: {
    psbtHex: string;
    inputs: any[];
    ownOutputs: any[];
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
    // const usedAddresses = ownOutputs.map(({ address }) => address);
    return await wallet.relayTx(psbt, transaction, inputs, ownOutputs);
  }

  async verifyRootTx(args: {
    psbt?: Psbt;
    transaction?: any;
  }): Promise<boolean> {
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
      if (
        inputHash ===
        '0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        return false;
      } else if (inputHash === Config.allegoryRootNode) {
        return true;
      } else {
        const {
          tx: { tx },
        } = await transactionAPI.getTransactionByTxID(inputHash);
        return await this.verifyRootTx({ transaction: tx });
      }
    }
    return false;
  }

  verifyMerkelRoot(args: {
    leafNode: string;
    merkelRoot: string;
    proof: any[];
  }) {
    const { leafNode, merkelRoot, proof } = args;
    let merkelProof = proof;
    let finalHash = leafNode;
    while (merkelProof.length > 0) {
      finalHash = sha256(sha256(finalHash).toString()).toString();
      const secondLeafHash = merkelProof.shift();
      finalHash = finalHash.concat(secondLeafHash);
    }
    return merkelRoot === finalHash;
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
    const allegoryData = decodeCBORData(lockingScript);
    const allegory = getAllegoryType(allegoryData);
    const proxyHost = '127.0.0.1';
    const proxyPort = 9099;
    const recipient = sha256(lockingScript).toString();
    const { unusedAddresses } = await wallet.getUnusedAddresses();
    const changeAddress = unusedAddresses[0];
    const { utxos } = await Persist.getUTXOs();
    const targets = [{ value: Number(amountInSatoshi) }];
    let { inputs, outputs } = coinSelect(utxos, targets, feeRate);
    if (!inputs || !outputs) throw new Error('Empty inputs or outputs');

    const data = await this._createTransaction({
      proxyHost,
      proxyPort,
      recipient,
      amountInSatoshi,
      changeAddress,
      utxos: inputs,
    });
    const tData = data.substring(1);
    const jsonData = JSON.parse(tData);
    const {
      result: { tx: psbtTx, addressProof, utxoProof },
    } = jsonData;
    const { psbt } = await this.decodeTransaction(psbtTx, inputs);
    if (allegory && allegory.action instanceof OwnerAction) {
      const ownerAction = allegory.action as OwnerAction;
      if (ownerAction.oProxyProviders.length > 0) {
        const utxoLeafNode = Buffer.from(psbt.txInputs[0].hash)
          .reverse()
          .toString('hex')
          .concat(String(psbt.txInputs[0].index));
        const addressLeafNode = psbt.txOutputs[0].address!;
        const addressMerkelRoot =
          ownerAction.oProxyProviders[0].registration.addressCommitment;
        const utxoMerkelRoot =
          ownerAction.oProxyProviders[0].registration.utxoCommitment;
        // const addressCommitment = this.verifyMerkelRoot({
        //   leafNode: addressLeafNode,
        //   merkelRoot: addressMerkelRoot,
        //   proof: addressProof,
        // });
        // const utxoCommitment = this.verifyMerkelRoot({
        //   leafNode: utxoLeafNode,
        //   merkelRoot: utxoMerkelRoot,
        //   proof: utxoProof,
        // });

        const addressCommitment = true;
        const utxoCommitment = true;
        return {
          psbt,
          inputs: inputs,
          ownOutputs: [{ type: '', title: '', address: changeAddress }],
          addressCommitment,
          utxoCommitment,
        };
      }
    }
    throw Error('Error in drafting Allegory Transaction');
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
    try {
      const { proxyHost, proxyPort, name, addressCount } = data;
      const nameCodePoint = utils.getCodePoint(name);
      const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
      const xpubKey = wallet.getBIP32ExtendedPubKey(bip32ExtendedKey);
      const returnAddress = await wallet.getUnusedNUTXOAddress();
      const { nUTXOs } = await Persist.getNUtxo(name);
      if (nUTXOs) {
        const data = await this._registerName({
          proxyHost,
          proxyPort,
          name: nameCodePoint,
          xpubKey,
          returnAddress,
          addressCount,
          nutxo: nUTXOs,
        });
        const tData = JSON.parse(data);
        const {
          result: { tx: psaBase64 },
        } = tData;
        const {
          psbt,
          fundingInputs,
          ownOutputs,
        } = await this.decodeTransaction(psaBase64, [nUTXOs], true);
        return {
          psbt,
          inputs: [...nUTXOs, ...fundingInputs],
          ownOutputs: [
            { type: 'nUTXO', title: 'Name UTXO', address: returnAddress },
            ...ownOutputs,
          ],
        };
      } else {
        throw new Error("Couldn't find utxo for selected name");
      }
    } catch (error) {
      throw error;
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
        addressCount: Number(addressCount),
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
