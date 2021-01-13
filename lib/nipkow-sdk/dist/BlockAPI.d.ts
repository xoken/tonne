declare class BlockAPI {
    getBlockByBlockHeight: (height: number) => Promise<any>;
    getBlocksByBlockHeights: (heights: number[]) => Promise<any>;
    getBlockByBlockHash: (blockHash: string) => Promise<any>;
    getBlocksByBlockHashes: (blockHashes: string[]) => Promise<any>;
    getTXIDByHash: (blockHash: string, pagenumber?: number | undefined, pagesize?: number | undefined) => Promise<any>;
}
export declare const blockAPI: BlockAPI;
export {};
