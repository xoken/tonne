declare class MerkleBranchAPI {
    getMerkleBranchByTXID: (txId: string) => Promise<any>;
}
export declare const merkleBranchAPI: MerkleBranchAPI;
export {};
