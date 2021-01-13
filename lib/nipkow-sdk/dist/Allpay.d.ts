import { Psbt } from 'bitcoinjs-lib';
declare class Allpay {
    buyName(data: {
        host: string;
        port: number;
        name: number[];
        priceInSatoshi: number;
        isProducer: boolean;
    }): Promise<{
        psbt: Psbt;
        outpoint: {
            name: number[];
            isProducer: boolean;
        };
        inputs: any;
        ownOutputs: {
            type: string;
            title: string;
            address: any;
        }[];
        snv: boolean;
    }>;
    decodeTransaction(psaBase64: string, inputs: any[], addFunding?: boolean): Promise<{
        psbt: Psbt;
        fundingInputs: any[];
        ownOutputs: {
            type: string;
            title: '';
            address: string;
        }[];
    }>;
    signRelayTransaction({ psbtHex, inputs, ownOutputs, }: {
        psbtHex: string;
        inputs: any[];
        ownOutputs: any[];
    }): Promise<{
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
    verifyRootTx(args: {
        psbt?: Psbt;
        transaction?: any;
    }): Promise<boolean>;
    verifyMerkelRoot(args: {
        leafNode: string;
        merkelRoot: string;
        proof: any[];
    }): boolean;
    getOutpointForName(name: number[]): Promise<any>;
    getResellerURI(name: number[]): Promise<{
        isAvailable: boolean;
        name: number[];
        uri?: undefined;
        protocol?: undefined;
    } | {
        isAvailable: boolean;
        name: number[];
        uri: any;
        protocol: any;
    }>;
    createTransaction(args: {
        allpayName: string;
        amountInSatoshi: number;
        feeRate: number;
    }): Promise<{
        psbt: Psbt;
        inputs: any;
        ownOutputs: {
            type: string;
            title: string;
            address: any;
        }[];
        addressCommitment: boolean;
        utxoCommitment: boolean;
    }>;
    _createTransaction(data: {
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
    }): Promise<any>;
    registerName(data: {
        proxyHost: string;
        proxyPort: number;
        name: string;
        addressCount: number;
    }): Promise<{
        psbt: Psbt;
        inputs: any[];
        ownOutputs: {
            type: string;
            title: string;
            address: any;
        }[];
    }>;
    _registerName(data: {
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
    }): Promise<any>;
}
export declare const allPay: Allpay;
export {};
