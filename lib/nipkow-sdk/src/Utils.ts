import {
  Network,
  bip32,
  BIP32Interface,
  ECPair,
  payments,
  Psbt,
  networks,
} from 'bitcoinjs-lib';
import derivationPaths from './constants/derivationPaths';
import * as bip38 from 'bip38';
import * as bip39 from 'bip39';
import coinSelect from 'coinselect';
import { fromUint8Array, atob } from 'js-base64';
import pako from 'pako';
import { transactionAPI } from './TransactionAPI';
var zlib = require('zlib');

class Utils {
  generateMnemonic = (
    strength?: number,
    rng?: (size: number) => Buffer,
    wordlist?: string[]
  ): string => {
    return bip39.generateMnemonic(strength, rng, wordlist);
  };

  mnemonicToSeedSync = (bip39Mnemonic: string, password?: string): Buffer => {
    return bip39.mnemonicToSeedSync(bip39Mnemonic, password);
  };

  mnemonicToSeed = async (
    bip39Mnemonic: string,
    password?: string
  ): Promise<Buffer> => {
    return await bip39.mnemonicToSeed(bip39Mnemonic, password);
  };

  getSeedHex = (seed: Buffer) => {
    return seed.toString('hex');
  };

  getBIP32RootKeyFromSeedHex = (
    seed: string,
    network?: Network
  ): BIP32Interface => {
    return bip32.fromBase58(seed, network);
  };

  getBIP32RootKeyFromSeed = (
    seed: Buffer,
    network?: Network
  ): BIP32Interface => {
    return bip32.fromSeed(seed, network);
  };

  getBIP32RootKeyBase58 = (bip32RootKey: BIP32Interface) => {
    return bip32RootKey.toBase58();
  };

  getBIP32ExtendedKey = (
    path: string,
    bip32RootKey: BIP32Interface
  ): BIP32Interface => {
    if (!bip32RootKey) {
      return bip32RootKey;
    }
    let extendedKey = bip32RootKey;
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
    return extendedKey;
  };

  getAccountExtendedPrivKey = (bip32ExtendedKey: BIP32Interface) => {
    return bip32ExtendedKey.toBase58();
  };

  getAccountExtendedPubKey = (bip32ExtendedKey: BIP32Interface) => {
    return bip32ExtendedKey.neutered().toBase58();
  };

  getBIP32ExtendedPrivKey = (bip32ExtendedKey: BIP32Interface) => {
    let xprvkeyB58 = 'NA';
    if (!bip32ExtendedKey.isNeutered()) {
      xprvkeyB58 = bip32ExtendedKey.toBase58();
    }
    return xprvkeyB58;
  };

  getBIP32ExtendedPubKey = (bip32ExtendedKey: BIP32Interface) => {
    return bip32ExtendedKey.neutered().toBase58();
  };

  getDerivationPath = (): string => {
    const { purpose, coin, account, change } = derivationPaths.BITCOIN_SV;
    let path = 'm/';
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
  };

  getDerivationPathAccount = (): string => {
    const { purpose, coin, account } = derivationPaths.BITCOIN_SV;
    let path = 'm/';
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    return path;
  };

  generateDerivedAddress = (
    bip32ExtendedKey: BIP32Interface,
    index: number,
    useBip38?: boolean,
    bip38password: string = '',
    useHardenedAddresses?: boolean
  ) => {
    let key;
    if (useHardenedAddresses) {
      key = bip32ExtendedKey.deriveHardened(index);
    } else {
      key = bip32ExtendedKey.derive(index);
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
    let indexText = this.getDerivationPath() + '/' + index;
    if (useHardenedAddresses) {
      indexText = indexText + "'";
    }
    return { indexText, address, pubkey, privkey };
  };

  createSendTransaction = async (
    privateKey: string,
    utxos: [],
    targets: [],
    transactionFee: number
  ) => {
    const key = ECPair.fromWIF(privateKey, networks.regtest);
    console.log(transactionFee);
    const feeRate = 5; // satoshis per byte
    let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);
    // the accumulated fee is always returned for analysis
    console.log(fee);
    // .inputs and .outputs will be undefined if no solution was found
    // if (!inputs || !outputs) return;

    let psbt = new Psbt({ network: networks.regtest });

    // inputs.forEach((input: { txId: any; vout: any; nonWitnessUtxo: any }) =>
    //   psbt.addInput({
    //     hash: input.txId,
    //     index: input.vout,
    //     nonWitnessUtxo: input.nonWitnessUtxo,
    //   })
    // );
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
    try {
      inputsWithRawTxs.forEach(
        (input: { txId: any; txIndex: any; hex: any }) => {
          psbt.addInput({
            hash: input.txId,
            index: input.txIndex,
            nonWitnessUtxo: Buffer.from(input.hex, 'hex'),
            // redeemScript: output,
          });
        }
      );
    } catch (error) {
      console.log(error);
    }

    try {
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
    } catch (error) {
      console.log(error);
    }
    try {
      // psbt.signInput(0, key);
      psbt.signAllInputs(key);
    } catch (error) {
      debugger;
      console.log(error);
    }
    try {
      psbt.validateSignaturesOfAllInputs();
    } catch (error) {
      debugger;
      console.log(error);
    }
    try {
      psbt.finalizeAllInputs();
    } catch (error) {
      debugger;
      console.log(error);
    }
    const hex = psbt.extractTransaction().toHex();
    debugger;
    try {
      const compressed = zlib.gzipSync(hex, {
        windowBits: 31,
        level: 9,
      });
      const compressed1 = pako.gzip(hex, { level: 9, windowBits: 31 });
      console.log(compressed);
      console.log(compressed1);
      debugger;
      const base64 = fromUint8Array(compressed, true);
      const compressedHex = Buffer.from(base64).toString('utf-8');
      console.log(compressedHex);
      debugger;
    } catch (error) {
      console.log(error);
    }
    // return compressedHex;
    return 'H4sIAAAAAAACE2NiYGBgXqRqEBq/tiowZ85Rd8egZVsP5+SGNxzn+PJA2fdk3/sgY6AahmwPA1cmRYZNBs+OHrylc/nu5m9834OWSd2OOsKglb0h6tF6j8u1adymTAplFvInw5kFds0XK5qnwP8+6lbV3fiVUn7q286/MIiY+l2XUZH53smvbo0vNQ+dLbvS9X/259Xcl7TW66ZxOlvMDeS/f37ao/9A8C0qrHj++7V9q/1+N7xo52ay9VoeteOWbOX34GtXnjE4XgW5KcvdwIVJIe6/Nfv1156VXGfc9wcsaGl/J1vx6sD9oo71vx0d99yV6WVSSMmqqb2WqZOivGD/pMyGr/Im2YG1j9avWRmdNv0Ve2+DFpFOil/W+Ts6/g6v42KGzdOdfzob/v81vyNO7VnAkkbjxbJP7iGcFLnoYHqCy2F9kSs/HqrNd1sReXJXxaevOrWh/6/VKk0JdGZSkJTVKIvYtqU0wdVw0RGX7WckbqmnrpQt/7xrs5b1NxeZIiKdxHiBnQEMJMtWinjxPd6was18dTPZjd8ac69nTg9TXtyxBiQLAMwtCivmAQAA';
  };
}

export const utils = new Utils();
