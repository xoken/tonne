declare class ScriptHashAPI {
    getOutputsByScriptHash: (scriptHash: string, pagesize?: number | undefined) => Promise<any>;
    getOutputsByScriptHashes: (scriptHashes: string[]) => Promise<any>;
    getUTXOsByScriptHash: (scriptHash: string, pagesize?: number | undefined) => Promise<any>;
    getUTXOsByScriptHashes: (scriptHashes: string[]) => Promise<any>;
}
export declare const scriptHashAPI: ScriptHashAPI;
export {};
