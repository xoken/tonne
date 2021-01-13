export declare const BIP32_EXTENDED_KEY = "bip32ExtendedKey";
export declare const NUTXO_EXTENDED_KEY = "nUTXOExtendedKey";
export declare const init: (dbName: string) => Promise<void>;
export declare const createProfile: (cryptedMnemonic: string, profileName: string) => Promise<void>;
export declare const updateProfile: (currentProfileName: string, newProfileName: string) => Promise<void>;
export declare const getProfiles: () => Promise<any>;
export declare const login: (profile: string, password: string) => Promise<string>;
export declare const getBip32ExtendedKey: () => Promise<any>;
export declare const setBip32ExtendedKey: (value: any) => Promise<void>;
export declare const getNUTXOExtendedKey: () => Promise<any>;
export declare const setNUTXOExtendedKey: (value: any) => Promise<void>;
export declare const getNUTXODerivedKeys: () => Promise<{
    existingNUTXODerivedKeys: any;
}>;
export declare const upsertNUTXODerivedKeys: (keys: any) => Promise<void>;
export declare const getDerivedKeys: () => Promise<{
    existingDerivedKeys: any;
}>;
export declare const upsertDerivedKeys: (keys: any) => Promise<void>;
export declare const getOutputs: (options?: {
    startkey?: string | undefined;
    limit?: number | undefined;
    diff?: boolean | undefined;
} | undefined) => Promise<{
    nextOutputsCursor: any;
    outputs: any;
}>;
export declare const markOutputAsUnspent: (inputs: [{
    outputTxHash: string;
    outputIndex: number;
}]) => Promise<void>;
export declare const upsertOutputs: (outputs: any) => Promise<void>;
export declare const updateOutputs: (outputs: any) => Promise<void>;
export declare const deleteOutputs: (outputs: [{
    outputTxHash: string;
    outputIndex: number;
}]) => Promise<void>;
export declare const isInOutputs: (output: {
    outputTxHash: string;
    outputIndex: number;
}) => Promise<boolean>;
export declare const getTransactions: (options?: {
    startkey?: string | undefined;
    limit?: number | undefined;
    diff?: boolean | undefined;
} | undefined) => Promise<{
    nextTransactionCursor: any;
    transactions: any;
}>;
export declare const getTransactionsByConfirmations: (options?: {
    startkey?: string | undefined;
    limit?: number | undefined;
    diff?: boolean | undefined;
} | undefined) => Promise<{
    transactions: any;
}>;
export declare const upsertTransactions: (transactions: any[]) => Promise<void>;
export declare const deleteTransactions: (transactions: any) => Promise<void>;
export declare const markAddressesUsed: (addresses: string[]) => Promise<void>;
export declare const getUTXOs: (options?: {
    startkey?: string | undefined;
    limit?: number | undefined;
    diff?: boolean | undefined;
} | undefined) => Promise<{
    utxos: any;
}>;
export declare const getNUtxo: (name: string) => Promise<{
    nUTXOs: any;
}>;
export declare const getUnregisteredName: () => Promise<{
    names: any;
}>;
export declare const destroy: () => Promise<boolean>;
