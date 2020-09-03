import {
  Network,
  bip32,
  ECPair,
  payments,
  Psbt,
  networks,
} from 'bitcoinjs-lib';
import * as bip38 from 'bip38';
import * as bip39 from 'bip39';
import coinSelect from 'coinselect';
import pako from 'pako';
import * as Persist from './Persist';
import derivationPaths from './constants/derivationPaths';
import coin from './constants/coin';
import { addressAPI } from './AddressAPI';
import { transactionAPI } from './TransactionAPI';

class Wallet {
  async init() {
    Persist.createDB('mydb');
    await Persist.setInitialState();
  }

  generateMnemonic(
    strength?: number,
    rng?: (size: number) => Buffer,
    wordlist?: string[]
  ): string {
    return bip39.generateMnemonic(strength, rng, wordlist);
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
    let extendedKey = bip32.fromBase58(bip32RootKey);
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

  _getDerivationPath(): string {
    const { purpose, coin, account, change } = derivationPaths.BITCOIN_SV;
    let path = 'm/';
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
  }

  _generateDerivedAddress(
    bip32ExtendedKey: string,
    index: number,
    useBip38?: boolean,
    bip38password: string = '',
    useHardenedAddresses?: boolean
  ) {
    const bip32Interface = bip32.fromBase58(bip32ExtendedKey);
    let key;
    if (useHardenedAddresses) {
      key = bip32Interface.deriveHardened(index);
    } else {
      key = bip32Interface.derive(index);
    }
    const useUncompressed = useBip38;
    let keyPair = ECPair.fromPrivateKey(key.privateKey!);
    if (useUncompressed) {
      keyPair = ECPair.fromPrivateKey(key.privateKey!, { compressed: false });
    }
    const address = payments.p2pkh({ pubkey: keyPair.publicKey }).address!;
    const hasPrivkey = !key.isNeutered();
    let privkey;
    if (hasPrivkey) {
      privkey = keyPair.toWIF();
      if (useBip38) {
        privkey = bip38.encrypt(keyPair.privateKey!, false, bip38password);
      }
    }
    const pubkey = keyPair.publicKey.toString('hex');
    let indexText = this._getDerivationPath() + '/' + index;
    if (useHardenedAddresses) {
      indexText = indexText + "'";
    }
    return { indexText, address, pubkey, privkey };
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
      if (i === 0) {
        derivedKey.address = 'mnGY8nS44fs11yYBJ3Lo3PX3Kdgyfup7d3';
      } else if (i === 1) {
        derivedKey.address = 'mnGY8nS44fs11yYBJ3Lo3PX3Kdgyfup7d3';
        // derivedKey.address = 'mn4vGSceDVbuSHUL6LQQ1P7RxPRkVRdyZH';
      } else if (i === 2) {
        // derivedKey.address = '1Lv8ehbvL7LbB93NuPPdLb6U7NsTyX1uao';
      }
      derivedKeys.push({ ...derivedKey, isUsed: false });
    }
    await Persist.setDerivedKeys(derivedKeys);
    return derivedKeys;
  }

  _getAddressesFromKeys(derivedKeys: any[]) {
    return derivedKeys.map((key: { address: any }) => key.address);
  }

  async initWallet(bip39Mnemonic: string, password: string) {
    const seed = this._mnemonicToSeedSync(bip39Mnemonic, password);
    const bip32RootKey = this._getBIP32RootKeyFromSeed(seed, coin.BITCOIN_SV);
    const bip32ExtendedKey = this._getBIP32ExtendedKey(
      this._getDerivationPath(),
      bip32RootKey
    );
    await Persist.setBip32ExtendedKey(bip32ExtendedKey);
    await this._generateDerivedKeys(bip32ExtendedKey, 0, 20, false);
  }

  async getOutputs() {
    const { outputs } = await this._getOutputs(await Persist.getDerivedKeys());
    await Persist.setOutputs(outputs);
    return {
      outputs,
    };
  }

  async _getOutputs(keys: any[], prevOutputs: any[] = []): Promise<any> {
    const outputs = await this._getOutputsByAddresses(keys);
    const updatedKeys = keys.map((key: { address: any; indexText: string }) => {
      const found = outputs.some(
        (output: { address: any }) => output.address === key.address
      );
      return { ...key, isUsed: found };
    });
    const newOutputs = [...prevOutputs, ...outputs];
    const isAllKeyUsed = updatedKeys.every(
      (key: { isUsed: boolean }) => key.isUsed === true
    );
    const bip32ExtendedKey = await Persist.getBip32ExtendedKey();
    if (isAllKeyUsed) {
      const lastKeyIndex = updatedKeys[updatedKeys.length - 1].indexText
        .split('/')
        .pop();
      const newDerivedKeys = await this._generateDerivedKeys(
        bip32ExtendedKey,
        Number(lastKeyIndex) + 1,
        20,
        false
      );
      return this._getOutputs(newDerivedKeys, newOutputs);
    } else {
      return { outputs: newOutputs };
    }
  }

  async _getOutputsByAddresses(
    keys: any[],
    prevOutputs: any[] = [],
    nextCursor?: number
  ): Promise<any> {
    const addressess = this._getAddressesFromKeys(keys);
    const data: {
      outputs: any[];
      nextCursor: number;
    } = await addressAPI.getOutputsByAddresses(addressess, 100, nextCursor);
    const outputs = [...prevOutputs, ...data.outputs];
    if (data.nextCursor) {
      return await this._getOutputsByAddresses(keys, outputs, data.nextCursor);
    } else {
      return outputs;
    }
  }

  async getBalance() {
    const outputs = await Persist.getOutputs();
    const balance = outputs.reduce((acc: number, currOutput: any) => {
      if (!currOutput.spendInfo) {
        acc = acc + currOutput.value;
      }
      return acc;
    }, 0);
    return { balance };
  }

  async createSendTransaction(
    receiverAddress: string,
    amountInSatoshi: number,
    transactionFee: number
  ) {
    const derivedKeys = await Persist.getDerivedKeys();
    const addressess = this._getAddressesFromKeys(derivedKeys);
    const utxos = await addressAPI.getUTXOsByAddresses(addressess);
    Persist.setUtxos(utxos);
    const targets = [
      { address: receiverAddress, value: Number(amountInSatoshi) },
    ];
    const transactionHex = await this._createSendTransaction(
      'cN6NafxmNHmhhF6uUug2VuagYm5DWMhRQ5qZDLHyd7Sinbji69Ui',
      utxos,
      targets,
      transactionFee
    );
    await transactionAPI.broadcastRawTransaction(transactionHex);
  }

  async _createSendTransaction(
    privateKey: string,
    utxos: [],
    targets: any[],
    transactionFee: number
  ): Promise<string> {
    console.log(privateKey);
    console.log(transactionFee);
    const key = ECPair.fromPrivateKey(
      Buffer.from(
        '0f4396a043a09537e8712f49828863552bfb0ee7f763fc0c0e06f5ace8da133a',
        'hex'
      ),
      { network: networks.regtest }
    );
    const feeRate = 5; // satoshis per byte
    let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);
    // the accumulated fee is always returned for analysis
    console.log(fee);
    // .inputs and .outputs will be undefined if no solution was found
    if (!inputs || !outputs) throw new Error('Empty inputs || outputs');

    const psbt = new Psbt({ network: networks.regtest });
    psbt.setVersion(1);
    const txIds = inputs.map(
      (input: { outputTxHash: any }) => input.outputTxHash
    );
    const rawTxsResponse = await transactionAPI.getRawTransactionsByTxIDs(
      txIds
    );
    const inputsWithRawTxs = rawTxsResponse.rawTxs.map((rawTx: any) => {
      const base64Decode = atob(rawTx.txSerialized);
      const decompressed = pako.ungzip(base64Decode);
      const hex = Buffer.from(decompressed).toString('hex');
      return { ...rawTx, hex };
    });

    // const payment = payments.p2pkh({
    //   pubkey: key.publicKey,
    //   network: networks.regtest,
    // });
    // const output = payment.pubkey;

    let merged = [];
    for (let i = 0; i < inputs.length; i++) {
      merged.push({
        ...inputs[i],
        ...inputsWithRawTxs.find(
          (element: { txId: any }) => element.txId === inputs[i].outputTxHash
        ),
      });
    }
    merged.forEach(
      (input: { outputTxHash: any; outputIndex: any; hex: any }) => {
        psbt.addInput({
          hash: input.outputTxHash,
          index: input.outputIndex,
          nonWitnessUtxo: Buffer.from(input.hex, 'hex'),
          sighashType: 0x41,
          // redeemScript: output,
        });
      }
    );
    outputs.forEach((output: { address: any; value: any }) => {
      // watch out, outputs may have been added that you need to provide
      // an output address/script for
      if (!output.address) {
        output.address = 'mnPbBBvj9JPJ4RHJfWLSwFDpfRCP81F1Zr';
      }
      psbt.addOutput({
        address: output.address,
        value: output.value,
      });
    });
    psbt.signAllInputs(key, [0x41]);
    psbt.validateSignaturesOfAllInputs();
    psbt.finalizeAllInputs();
    const transactionHex = psbt.extractTransaction().toHex();
    const base64 = Buffer.from(transactionHex).toString('base64');
    console.log(base64);
    return base64;

    /*var tx = new TransactionBuilder(networks.regtest);
      inputs.forEach(
        (input: {
          outputTxHash: string | Buffer | Transaction;
          outputIndex: number;
        }) => {
          tx.addInput(input.outputTxHash, input.outputIndex);
        }
      );
      outputs.forEach((output: { address: any; value: any }) => {
        // watch out, outputs may have been added that you need to provide
        // an output address/script for
        if (!output.address) {
          output.address = 'mnPbBBvj9JPJ4RHJfWLSwFDpfRCP81F1Zr';
        }
        tx.addOutput(output.address, output.value);
      });
      tx.sign(0, key);
      tx.sign(1, key);
      tx.sign(2, key);
      const transactionHex = tx.build().toHex();
      const base64 = Buffer.from(transactionHex).toString('base64');
      const compressedHex = Buffer.from(base64).toString('utf-8');
      return compressedHex;
    */
  }
}

export default new Wallet();
