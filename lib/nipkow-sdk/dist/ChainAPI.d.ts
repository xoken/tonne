declare class ChainAPI {
    getChainInfo: () => Promise<any>;
    getBlockHeaders: (startBlockHeight: number, pagesize?: number | undefined) => Promise<any>;
}
export declare const chainAPI: ChainAPI;
export {};
