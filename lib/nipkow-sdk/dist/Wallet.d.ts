/// <reference types="node" />
/// <reference types="pouchdb-core" />
import { Network, Psbt, Transaction } from 'bitcoinjs-lib';
declare class Wallet {
    _initWallet(bip39Mnemonic: string, password?: string): Promise<void>;
    _mnemonicToSeedSync(bip39Mnemonic: string, password?: string): Buffer;
    _getBIP32RootKeyFromSeed(seed: Buffer, network?: Network): string;
    _getBIP32ExtendedKey(path: string, bip32RootKey: string): string;
    getBIP32ExtendedPrivKey: (bip32ExtendedKey: string) => string;
    getBIP32ExtendedPubKey: (bip32ExtendedKey: string) => string;
    _generateDerivedKeys(bip32ExtendedKey: string, derivationPath: string, index: number, useBip38?: boolean, bip38password?: string, useHardenedAddresses?: boolean): {
        indexText: string;
        address: string;
    };
    _getPrivKey(bip32ExtendedKey: string, index: number, useBip38?: boolean, bip38password?: string, useHardenedAddresses?: boolean): {
        privkey: string;
    };
    generateDerivedKeys(bip32ExtendedKey: string, derivationPath: string, indexStart: number, count: number, useBip38: boolean, bip38password?: string, useHardenedAddresses?: boolean): Promise<{
        derivedKeys: {
            isUsed: boolean;
            indexText: string;
            address: string;
        }[];
    }>;
    _getAddressesFromKeys(derivedKeys: any[]): any[];
    _countOfUnusedKeys(keys: any[]): any;
    _removeDuplicate(outputs: any[]): any[];
    processAllegoryTransactions(outputs: any[], transactions: any[]): Promise<{
        outputs: ({
            outputTxHash: any;
            outputIndex: any;
        } | {
            name: any;
            isNameOutpoint: boolean;
            outputTxHash: any;
            outputIndex: any;
        })[];
    }>;
    getTransactions(options?: {
        startkey?: string;
        limit?: number;
        pageNo?: number;
        diff?: boolean;
    }): Promise<{
        nextTransactionCursor: any;
        transactions: any;
    } | {
        transactions: {
            txId: any;
            inputs: any;
            outputs: any;
            confirmation?: number | null | undefined;
        }[];
    }>;
    _getTransactions(txIds: string[]): Promise<{
        txs: any[];
    }>;
    _getOutputs(derivedKeys: any[], prevDiffOutputs?: any[], prevKeys?: any[]): Promise<any>;
    _getOutputsByAddresses(keys: any[], prevOutputs?: any[], nextCursor?: number): Promise<any>;
    _getDiffOutputs(outputs: any): Promise<any[]>;
    getUnusedNUTXOAddress(): Promise<any>;
    _getKeys(addresses: string[]): Promise<object[]>;
    updateTransactionsConfirmations(): Promise<{
        updatedTransactions: any[];
        deletedTransactions: any[];
    }>;
    relayTx(psbt: Psbt, transaction: Transaction, inputs: any[], ownOutputs: any[]): Promise<{
        transaction: {
            txId: string;
            inputs: {
                address: string;
                isMine: boolean;
                isNUTXO: boolean;
                txInputIndex: number;
                outputTxHash: string;
                value: number | undefined;
            }[];
            outputs: ({
                address: string;
                isMine: boolean;
                isNUTXO: boolean;
                lockingScript: string;
                outputIndex: number;
                value: number;
            } | {
                address: null;
                isMine: boolean;
                isNUTXO: boolean;
                lockingScript: string;
                outputIndex: number;
                value: number;
            })[];
            confirmation: null;
            createdAt: Date;
        };
        txBroadcast: any;
    }>;
    _createSendTransaction(utxos: any[], targets: any[], feeRate: number): Promise<{
        transaction: {
            txId: string;
            inputs: {
                address: string;
                isMine: boolean;
                isNUTXO: boolean;
                txInputIndex: number;
                outputTxHash: string;
                value: number | undefined;
            }[];
            outputs: ({
                address: string;
                isMine: boolean;
                isNUTXO: boolean;
                lockingScript: string;
                outputIndex: number;
                value: number;
            } | {
                address: null;
                isMine: boolean;
                isNUTXO: boolean;
                lockingScript: string;
                outputIndex: number;
                value: number;
            })[];
            confirmation: null;
            createdAt: Date;
        };
        txBroadcast: any;
    }>;
    createSendTransaction(receiverAddress: string, amountInSatoshi: number, feeRate: number): Promise<{
        transaction: {
            txId: string;
            inputs: {
                address: string;
                isMine: boolean;
                isNUTXO: boolean;
                txInputIndex: number;
                outputTxHash: string;
                value: number | undefined;
            }[];
            outputs: ({
                address: string;
                isMine: boolean;
                isNUTXO: boolean;
                lockingScript: string;
                outputIndex: number;
                value: number;
            } | {
                address: null;
                isMine: boolean;
                isNUTXO: boolean;
                lockingScript: string;
                outputIndex: number;
                value: number;
            })[];
            confirmation: null;
            createdAt: Date;
        };
        txBroadcast: any;
    }>;
    getTransactionFee(receiverAddress: string, amountInSatoshi: number, feeRate: number): Promise<any>;
    getBalance(): Promise<{
        balance: any;
    }>;
    generateMnemonic(strength?: number, rng?: (size: number) => Buffer, wordlist?: string[]): string;
    getUsedAddresses(): Promise<{
        usedAddresses: {
            address: string;
            incomingBalance: number;
            outgoingBalance: number;
            currentBalance: number;
            lastTransaction: any;
        }[];
    }>;
    getUnusedAddresses(options?: {
        excludeAddresses?: string[];
        count?: number;
    }): Promise<{
        unusedAddresses: any[];
    }>;
    markAddressesUsed(addresses: string[]): Promise<void>;
    login(profileId: string, password: string): Promise<{
        profile: string;
    }>;
    createProfile(bip39Mnemonic: string, password: string): Promise<{
        profile: string;
    }>;
    updateProfileName(currentProfileName: string, newProfileName: string): Promise<{
        profile: string;
    }>;
    getProfiles(): Promise<{
        profiles: any;
    }>;
    getUnregisteredName(): Promise<{
        names: any;
    }>;
    logout(): Promise<boolean>;
    runScript(): Promise<void>;
}
declare const _default: Wallet;
export default _default;
