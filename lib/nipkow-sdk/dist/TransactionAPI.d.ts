declare class TransactionAPI {
    getTransactionByTxID: (txId: string) => Promise<any>;
    getTransactionsByTxIDs: (txIDs: string[]) => Promise<any>;
    getRawTransactionByTxID: (txID: string) => Promise<any>;
    getRawTransactionsByTxIDs: (txIDs: string[]) => Promise<any>;
    broadcastRawTransaction: (hash: string) => Promise<any>;
    getSpendStatusByOutpoint: (outpoint: string) => Promise<any>;
}
export declare const transactionAPI: TransactionAPI;
export {};
