import wallet from './Wallet';
import coinSelect from 'coinselect';
import { post } from './httpClient';
import * as Persist from './Persist';

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
      const outputOwner = unusedDerivedKeys[0].address;
      const outputChange = wallet.getUnusedDerivedKeys({
        currentUnusedKeyIndex,
      });
      const { data } = await post('partialsign', {
        paymentInputs,
        name: [nameCodePoints, isProducer ? true : false],
        outputOwner,
        outputChange,
      });
      return data;
    } catch (error) {
      console.log(error);
      debugger;
      throw error;
    }
  }
}

export const allPay = new Allpay();
