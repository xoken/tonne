declare class AddressAPI {
    getOutputsByAddress: (address: string, pagesize?: number | undefined, cursor?: number | undefined) => Promise<any>;
    getOutputsByAddresses: (addresses: string[], pagesize?: number | undefined, cursor?: number | undefined) => Promise<any>;
    getUTXOsByAddress: (address: string, pagesize?: number | undefined, cursor?: number | undefined) => Promise<any>;
    getUTXOsByAddresses: (addresses: string[], pagesize?: number | undefined, cursor?: number | undefined) => Promise<any>;
}
export declare const addressAPI: AddressAPI;
export {};
