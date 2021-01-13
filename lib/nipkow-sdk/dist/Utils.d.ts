/// <reference types="node" />
/// <reference types="pouchdb-core" />
import { Network, BIP32Interface } from 'bitcoinjs-lib';
declare class Utils {
    mnemonicToSeed: (bip39Mnemonic: string, password?: string | undefined) => Promise<Buffer>;
    getSeedHex: (seed: Buffer) => string;
    getBIP32RootKeyFromSeedHex: (seed: string, network?: Network | undefined) => BIP32Interface;
    getBIP32RootKeyBase58: (bip32RootKey: BIP32Interface) => string;
    getAccountExtendedPrivKey: (bip32ExtendedKey: BIP32Interface) => string;
    getAccountExtendedPubKey: (bip32ExtendedKey: any) => any;
    getDerivationPathAccount: () => string;
    getCodePoint(name: string): number[];
    codePointToName: (codePoints: number[]) => string | null;
    arraysEqual(a: any[], b: any[]): boolean;
    satoshiToBSV: (satoshi: number) => number;
}
declare const _default: Utils;
export default _default;
