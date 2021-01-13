declare class Allegory {
    private _version;
    get version(): number;
    set version(value: number);
    private _name;
    get name(): number[];
    set name(value: number[]);
    private _action;
    get action(): Action;
    set action(value: Action);
}
declare type Action = ProducerAction | OwnerAction;
export declare class ProducerAction {
    private _producerInput;
    get producerInput(): Index;
    set producerInput(value: Index);
    private _producerOutput;
    get producerOutput(): ProducerOutput;
    set producerOutput(value: ProducerOutput);
    private _pOwnerOutput?;
    get pOwnerOutput(): OwnerOutput;
    set pOwnerOutput(value: OwnerOutput);
    private _extensions;
    get extensions(): Extension[];
    set extensions(value: Extension[]);
}
export declare class OwnerAction {
    private _ownerInput;
    get ownerInput(): Index;
    set ownerInput(value: Index);
    private _ownerOutput;
    get ownerOutput(): OwnerOutput;
    set ownerOutput(value: OwnerOutput);
    private _oProxyProviders;
    get oProxyProviders(): ProxyProvider[];
    set oProxyProviders(value: ProxyProvider[]);
}
declare class Index {
    private _index;
    get index(): number;
    set index(value: number);
}
declare class ProducerOutput {
    private _producer;
    get producer(): Index;
    set producer(value: Index);
    private _pVendorEndpoint?;
    get pVendorEndpoint(): Endpoint;
    set pVendorEndpoint(value: Endpoint);
}
declare class OwnerOutput {
    private _owner;
    get owner(): Index;
    set owner(value: Index);
    private _oVendorEndpoint?;
    get oVendorEndpoint(): Endpoint;
    set oVendorEndpoint(value: Endpoint);
}
export declare type Extension = OwnerExtension | ProducerExtension;
export declare class OwnerExtension {
    private _ownerOutputEx;
    get ownerOutputEx(): OwnerOutput;
    set ownerOutputEx(value: OwnerOutput);
    private _codePoint;
    get codePoint(): number;
    set codePoint(value: number);
}
export declare class ProducerExtension {
    private _producerOutputEx;
    get producerOutputEx(): ProducerOutput;
    set producerOutputEx(value: ProducerOutput);
    private _codePoint;
    get codePoint(): number;
    set codePoint(value: number);
}
declare class Endpoint {
    private _protocol;
    get protocol(): string;
    set protocol(value: string);
    private _uri;
    get uri(): string;
    set uri(value: string);
}
declare class ProxyProvider {
    private _service;
    get service(): string;
    set service(value: string);
    private _mode;
    get mode(): string;
    set mode(value: string);
    private _endpoint;
    get endpoint(): Endpoint;
    set endpoint(value: Endpoint);
    private _registration;
    get registration(): Registration;
    set registration(value: Registration);
}
declare class Registration {
    private _addressCommitment;
    get addressCommitment(): string;
    set addressCommitment(value: string);
    private _utxoCommitment;
    get utxoCommitment(): string;
    set utxoCommitment(value: string);
    private _signature;
    get signature(): string;
    set signature(value: string);
    private _expiry;
    get expiry(): number;
    set expiry(value: number);
}
export declare function getAllegoryType(decodedCBOR: any): Allegory;
export declare function removeOpReturn(data: string): string;
export declare function decodeCBORData(data: string): any;
export {};
