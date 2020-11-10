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
import * as _ from 'lodash';
// import { differenceInMinutes } from 'date-fns';
import * as Persist from './Persist';
import derivationPaths from './constants/derivationPaths';
import network from './constants/network';
import { addressAPI } from './AddressAPI';
import { transactionAPI } from './TransactionAPI';
import { chainAPI } from './ChainAPI';

class ProxyProvider {
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
      // const { txBroadcast } = await transactionAPI.broadcastRawTransaction(
      //   base64
      // );
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
}

export default new ProxyProvider();
