import {
  Network,
  bip32,
  ECPair,
  payments,
  Psbt,
  networks,
  // Transaction,
  // TransactionBuilder,
} from 'bitcoinjs-lib';
import * as bip38 from 'bip38';
import * as bip39 from 'bip39';
// import coinSelect from 'coinselect';
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
        // derivedKey.address = 'mnGY8nS44fs11yYBJ3Lo3PX3Kdgyfup7d3';
      } else if (i === 1) {
        // derivedKey.address = 'mnGY8nS44fs11yYBJ3Lo3PX3Kdgyfup7d3';
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
    Persist.setUtxos(utxos.utxos);
    console.log(receiverAddress);
    console.log(amountInSatoshi);
    // const targets = [
    //   { address: receiverAddress, value: Number(amountInSatoshi) },
    // ];
    const targets = [
      { address: 'mnPbBBvj9JPJ4RHJfWLSwFDpfRCP81F1Zr', value: 10000000 },
    ];
    try {
      const transactionHex = await this._createSendTransaction(
        'cMwS7zdHqkyEuQiKtm8vANacXrFtZ8DrueJyVGwb7aeGnQKPdNfc',
        utxos.utxos,
        targets,
        transactionFee
      );
      await transactionAPI.broadcastRawTransaction(transactionHex);
    } catch (error) {
      console.log(error);
    }
  }

  async _createSendTransaction(
    privateKey: string,
    utxos: [],
    targets: any[],
    transactionFee: number
  ): Promise<string> {
    console.log(transactionFee);
    // const key = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), {
    //   network: networks.regtest,
    // });
    const key = ECPair.fromWIF(privateKey, networks.testnet);
    const feeRate = 5; // satoshis per byte
    // let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);
    // the accumulated fee is always returned for analysis
    console.log(feeRate);
    console.log(utxos);
    console.log(targets);
    // .inputs and .outputs will be undefined if no solution was found
    // if (!inputs || !outputs) throw new Error('Empty inputs || outputs');

    // const txIds = inputs.map(
    //   (input: { outputTxHash: any }) => input.outputTxHash
    // );
    // const rawTxsResponse = await transactionAPI.getRawTransactionsByTxIDs(
    //   txIds
    // );
    // const inputsWithRawTxs = rawTxsResponse.rawTxs.map((rawTx: any) => {
    //   const hex = Buffer.from(rawTx.txSerialized, 'base64').toString('hex');
    //   return { ...rawTx, hex };
    // });
    // let merged = [];
    // for (let i = 0; i < inputs.length; i++) {
    //   merged.push({
    //     ...inputs[i],
    //     ...inputsWithRawTxs.find(
    //       (element: { txId: any }) => element.txId === inputs[i].outputTxHash
    //     ),
    //   });
    // }
    if (true) {
      const psbt = new Psbt({ network: networks.testnet, forkCoin: 'bch' });
      psbt.setVersion(1);
      // const payment = payments.p2pkh({
      //   pubkey: key.publicKey,
      //   network: networks.regtest,
      // });
      // const output = payment.pubkey;
      // merged.forEach(
      //   (input: { outputTxHash: any; outputIndex: any; hex: any }) => {
      //     psbt.addInput({
      //       hash: input.outputTxHash,
      //       index: input.outputIndex,
      //       nonWitnessUtxo: Buffer.from(input.hex, 'hex'),
      //       // redeemScript: output,
      //     });
      //   }
      // );

      psbt.addInput({
        hash:
          '66446a1ba6bed10558ae5ac48ecb170a5d84e13e32251f443bbe6af7a9108373',
        index: 1,
        nonWitnessUtxo: Buffer.from(
          '02000000013cac6fda76da1d1850b4c885276aefb57d8d0069b8e27614aeac9caca83f7f96010000006a4730440220353102fd5e7ef0d3449dd731e123528d5cc6164b773dc7ecfdbefbb3fd68ee1a02206b1e048c648db0b5adc82194f27d56263a41ecf9070d98e5b8ff98093e8c0216412102ccd25a957cecccf29ab8ee39ab5a2971ff6c19b982965af92d764af602ddc966feffffff0244f27201000000001976a914a14186606a9b27cabf6d4db4924bd36c94f1103b88ac00093d00000000001976a9144a0ee3b0aaac9f27361db1f6816dd769975623a388aca1191500',
          'hex'
        ),
        // redeemScript: output,
      });
      psbt.addOutput({
        address: 'mnPbBBvj9JPJ4RHJfWLSwFDpfRCP81F1Zr',
        value: 2000000,
      });
      debugger;
      // outputs.forEach((output: { address: any; value: any }) => {
      //   // watch out, outputs may have been added that you need to provide
      //   // an output address/script for
      //   if (!output.address) {
      //     output.address = 'mnPbBBvj9JPJ4RHJfWLSwFDpfRCP81F1Zr';
      //   }
      //   psbt.addOutput({
      //     address: output.address,
      //     value: output.value,
      //   });
      // });
      psbt.signAllInputs(key);
      psbt.validateSignaturesOfAllInputs();
      psbt.finalizeAllInputs();
      const transactionHex = psbt.extractTransaction(true).toHex();
      console.log(transactionHex);
      const base64 = Buffer.from(transactionHex, 'hex').toString('base64');
      console.log(base64);
      return base64;
    } else {
      /*const tx = new TransactionBuilder(networks.regtest);
      tx.setVersion(1);
      tx.enableBitcoinCash();
      merged.forEach(
        (input: {
          outputTxHash: string | Buffer | Transaction;
          outputIndex: number;
          hex: string;
        }) => {
          // const spk = payments.p2pkh({
          //   pubkey: key.publicKey,
          //   network: networks.regtest,
          // }).output;
          // tx.addInput(Transaction.fromHex(input.hex), input.outputIndex);
          tx.addInput(input.hex, input.outputIndex);
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
      const hashType =
        Transaction.SIGHASH_ALL | Transaction.SIGHASH_BITCOINCASHBIP143;
      // tx.sign({
      //   prevOutScriptType: '',
      //   vin: 0,
      //   keyPair: key,
      //   hashType,
      // });

      tx.sign(0, key, undefined, hashType);
      tx.sign(1, key, undefined, hashType);
      const transactionHex = tx.build().toHex();
      console.log(transactionHex);
      const base64 = Buffer.from(transactionHex, 'hex').toString('base64');
      console.log(base64);
      return base64;*/
    }
  }
}

export default new Wallet();
