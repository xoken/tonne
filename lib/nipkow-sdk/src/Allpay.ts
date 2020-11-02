import CBOR from 'cbor-js';
import wallet from './Wallet';
import coinSelect from 'coinselect';
import { get, post } from './httpClient';
import * as Persist from './Persist';
import { transactionAPI } from './TransactionAPI';
import Config from './Config.json';

class Allpay {
  async getPartiallySignTx(
    name: string,
    priceInSatoshi: number,
    isProducer: boolean
  ) {
    try {
      const feeRate = 5;
      const { utxos } = await Persist.getUTXOs();
      const targets = [{ value: Number(priceInSatoshi) }];
      let { inputs, outputs } = coinSelect(utxos, targets, feeRate);
      if (!inputs || !outputs) throw new Error('Empty inputs or outputs');
      const nameCodePoints = [];
      for (let i = 0; i < name.length; i++) {
        nameCodePoints.push(name.codePointAt(i));
      }
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
        } = await post('partialsign', {
          paymentInputs,
          name: [nameCodePoints, isProducer ? true : false],
          outputOwner,
          outputChange,
        });
        return psaTx;
      } else {
        throw new Error('Error configuring input params');
      }
    } catch (error) {
      throw error;
    }
  }

  async decodeTransaction() {
    const transactionHex: string = await this.getPartiallySignTx(
      'sh',
      5000,
      true
    );
    const transaction = JSON.parse(
      Buffer.from(transactionHex, 'base64').toString()
    );
    await this.verifyRootTx(transaction);
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
      const allegoryData = CBOR.decode(allegoryDataArrayBuffer);
      const nameArray = allegoryData[2];
      console.log(nameArray);
      if (allegoryData[3].length === 4) {
        const extensions = allegoryData[3][3];
        console.log(extensions);
      } else {
      }
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

  async getOutpointByName(name: string) {
    if (name) {
      try {
        const {
          data: { nameBranch },
        } = await get(`allegory/${name}`);
        if (nameBranch.length > 0) {
          return nameBranch;
        } else {
          await this.getOutpointByName(name.slice(0, -1));
        }
      } catch (error) {}
    }
  }
}

export const allPay = new Allpay();
