import {
  Network,
  bip32,
  BIP32Interface,
  ECPair,
  payments,
  Psbt,
} from 'bitcoinjs-lib';
import derivationPaths from './constants/derivationPaths';
import * as bip38 from 'bip38';
import * as bip39 from 'bip39';
import * as coinSelect from 'coinselect';

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
    const key = ECPair.fromWIF(privateKey);
    // psbt.addInput({
    //   hash: 'd18e7106e5492baf8f3929d2d573d27d89277f3825d3836aa86ea1d843b5158b',
    //   index: 0,
    //   nonWitnessUtxo: Buffer.from(
    //     '0200000001f9f34e95b9d5c8abcd20fc5bd4a825d1517be62f0f775e5f36da944d9' +
    //       '452e550000000006b483045022100c86e9a111afc90f64b4904bd609e9eaed80d48' +
    //       'ca17c162b1aca0a788ac3526f002207bb79b60d4fc6526329bf18a77135dc566020' +
    //       '9e761da46e1c2f1152ec013215801210211755115eabf846720f5cb18f248666fec' +
    //       '631e5e1e66009ce3710ceea5b1ad13ffffffff01' +
    //       // value in satoshis (Int64LE) = 0x015f90 = 90000
    //       '905f010000000000' +
    //       // scriptPubkey length
    //       '19' +
    //       // scriptPubkey
    //       '76a9148bbc95d2709c71607c60ee3f097c1217482f518d88ac' +
    //       // locktime
    //       '00000000',
    //     'hex'
    //   ),
    // });
    // psbt.addOutput({
    //   address: '1KRMKfeZcmosxALVYESdPNez1AP1mEtywp',
    //   value: 80000,
    // });
    console.log(transactionFee);
    const feeRate = 55; // satoshis per byte
    let { inputs, outputs, fee } = coinSelect.coinSelect(
      utxos,
      targets,
      feeRate
    );
    // the accumulated fee is always returned for analysis
    console.log(fee);
    // .inputs and .outputs will be undefined if no solution was found
    if (!inputs || !outputs) return;

    let psbt = new Psbt();

    // inputs.forEach((input: { txId: any; vout: any; nonWitnessUtxo: any }) =>
    //   psbt.addInput({
    //     hash: input.txId,
    //     index: input.vout,
    //     nonWitnessUtxo: input.nonWitnessUtxo,
    //   })
    // );

    inputs.forEach(
      (input: { outputTxHash: string; txIndex: number; nonWitnessUtxo: any }) =>
        psbt.addInput({
          hash: input.outputTxHash,
          index: input.txIndex,
          nonWitnessUtxo: Buffer.from(input.outputTxHash),
        })
    );
    outputs.forEach((output: { address: any; value: any }) => {
      // watch out, outputs may have been added that you need to provide
      // an output address/script for
      if (!output.address) {
        // output.address = wallet.getChangeAddress();
        // wallet.nextChangeAddress();
      }

      psbt.addOutput({
        address: output.address,
        value: output.value,
      });
    });

    psbt.signInput(0, key);
    psbt.validateSignaturesOfInput(0);
    psbt.finalizeAllInputs();
    return psbt.extractTransaction().toHex();
  };
}

export const utils = new Utils();
