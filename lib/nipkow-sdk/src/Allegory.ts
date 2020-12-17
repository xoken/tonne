import CBOR from 'cbor-js';

class Allegory {
  private _version!: number;
  public get version(): number {
    return this._version;
  }
  public set version(value: number) {
    this._version = value;
  }
  private _name!: number[];
  public get name(): number[] {
    return this._name;
  }
  public set name(value: number[]) {
    this._name = value;
  }
  private _action!: Action;
  public get action(): Action {
    return this._action;
  }
  public set action(value: Action) {
    this._action = value;
  }
}

type Action = ProducerAction | OwnerAction;

export class ProducerAction {
  private _producerInput!: Index;
  public get producerInput(): Index {
    return this._producerInput;
  }
  public set producerInput(value: Index) {
    this._producerInput = value;
  }
  private _producerOutput!: ProducerOutput;
  public get producerOutput(): ProducerOutput {
    return this._producerOutput;
  }
  public set producerOutput(value: ProducerOutput) {
    this._producerOutput = value;
  }
  private _pOwnerOutput?: OwnerOutput;
  public get pOwnerOutput(): OwnerOutput {
    return this._pOwnerOutput!;
  }
  public set pOwnerOutput(value: OwnerOutput) {
    this._pOwnerOutput = value;
  }
  private _extensions!: Extension[];
  public get extensions(): Extension[] {
    return this._extensions;
  }
  public set extensions(value: Extension[]) {
    this._extensions = value;
  }
}

export class OwnerAction {
  private _ownerInput!: Index;
  public get ownerInput(): Index {
    return this._ownerInput;
  }
  public set ownerInput(value: Index) {
    this._ownerInput = value;
  }
  private _ownerOutput!: OwnerOutput;
  public get ownerOutput(): OwnerOutput {
    return this._ownerOutput;
  }
  public set ownerOutput(value: OwnerOutput) {
    this._ownerOutput = value;
  }
  private _oProxyProviders!: ProxyProvider[];
  public get oProxyProviders(): ProxyProvider[] {
    return this._oProxyProviders;
  }
  public set oProxyProviders(value: ProxyProvider[]) {
    this._oProxyProviders = value;
  }
}

class Index {
  private _index!: number;
  public get index(): number {
    return this._index;
  }
  public set index(value: number) {
    this._index = value;
  }
}

class ProducerOutput {
  private _producer!: Index;
  public get producer(): Index {
    return this._producer;
  }
  public set producer(value: Index) {
    this._producer = value;
  }
  private _pVendorEndpoint?: Endpoint;
  public get pVendorEndpoint(): Endpoint {
    return this._pVendorEndpoint!;
  }
  public set pVendorEndpoint(value: Endpoint) {
    this._pVendorEndpoint = value;
  }
}

class OwnerOutput {
  private _owner!: Index;
  public get owner(): Index {
    return this._owner;
  }
  public set owner(value: Index) {
    this._owner = value;
  }
  private _oVendorEndpoint?: Endpoint;
  public get oVendorEndpoint(): Endpoint {
    return this._oVendorEndpoint!;
  }
  public set oVendorEndpoint(value: Endpoint) {
    this._oVendorEndpoint = value;
  }
}

export type Extension = OwnerExtension | ProducerExtension;

export class OwnerExtension {
  private _ownerOutputEx!: OwnerOutput;
  public get ownerOutputEx(): OwnerOutput {
    return this._ownerOutputEx;
  }
  public set ownerOutputEx(value: OwnerOutput) {
    this._ownerOutputEx = value;
  }
  private _codePoint!: number;
  public get codePoint(): number {
    return this._codePoint;
  }
  public set codePoint(value: number) {
    this._codePoint = value;
  }
}

export class ProducerExtension {
  private _producerOutputEx!: ProducerOutput;
  public get producerOutputEx(): ProducerOutput {
    return this._producerOutputEx;
  }
  public set producerOutputEx(value: ProducerOutput) {
    this._producerOutputEx = value;
  }
  private _codePoint!: number;
  public get codePoint(): number {
    return this._codePoint;
  }
  public set codePoint(value: number) {
    this._codePoint = value;
  }
}

class Endpoint {
  private _protocol!: string;
  public get protocol(): string {
    return this._protocol;
  }
  public set protocol(value: string) {
    this._protocol = value;
  }
  private _uri!: string;
  public get uri(): string {
    return this._uri;
  }
  public set uri(value: string) {
    this._uri = value;
  }
}

class ProxyProvider {
  private _service!: string;
  public get service(): string {
    return this._service;
  }
  public set service(value: string) {
    this._service = value;
  }
  private _mode!: string;
  public get mode(): string {
    return this._mode;
  }
  public set mode(value: string) {
    this._mode = value;
  }
  private _endpoint!: Endpoint;
  public get endpoint(): Endpoint {
    return this._endpoint;
  }
  public set endpoint(value: Endpoint) {
    this._endpoint = value;
  }
  private _registration!: Registration;
  public get registration(): Registration {
    return this._registration;
  }
  public set registration(value: Registration) {
    this._registration = value;
  }
}

class Registration {
  private _addressCommitment!: string;
  public get addressCommitment(): string {
    return this._addressCommitment;
  }
  public set addressCommitment(value: string) {
    this._addressCommitment = value;
  }
  private _utxoCommitment!: string;
  public get utxoCommitment(): string {
    return this._utxoCommitment;
  }
  public set utxoCommitment(value: string) {
    this._utxoCommitment = value;
  }
  private _signature!: string;
  public get signature(): string {
    return this._signature;
  }
  public set signature(value: string) {
    this._signature = value;
  }
  private _expiry!: number;
  public get expiry(): number {
    return this._expiry;
  }
  public set expiry(value: number) {
    this._expiry = value;
  }
}

export function getAllegoryType(decodedCBOR: any): Allegory {
  const allegory = new Allegory();
  if (decodedCBOR.length >= 2) {
    allegory.version = decodedCBOR[1];
    allegory.name = decodedCBOR[2];
    if (decodedCBOR[3].length === 4) {
      allegory.action = _getOwnerAction(decodedCBOR[3]);
    }
    if (decodedCBOR[3].length === 5) {
      allegory.action = _getProducerAction(decodedCBOR[3]);
    }
  }
  return allegory;
}

function _getOwnerAction(data: any): OwnerAction {
  const ownerAction = new OwnerAction();
  ownerAction.ownerInput = _getIndex(data[1]);
  ownerAction.ownerOutput = _getOwnerOutput(data[2]);
  ownerAction.oProxyProviders = _getProxyProviders(data[3]);
  return ownerAction;
}

function _getIndex(data: any[]) {
  const index = new Index();
  index.index = data[1];
  return index;
}

function _getOwnerOutput(data: any[]) {
  const ownerOutput = new OwnerOutput();
  ownerOutput.owner = _getIndex(data[1]);
  ownerOutput.oVendorEndpoint = _getVendorEndpoint(data[2]);
  return ownerOutput;
}

function _getVendorEndpoint(data: any[]) {
  return _getEndPoint(data[0]);
}

function _getProxyProviders(datas: any[]) {
  const proxyProviders: ProxyProvider[] = datas.map((data: any[]) => {
    const proxyProvider = new ProxyProvider();
    proxyProvider.service = data[1];
    proxyProvider.mode = data[2];
    proxyProvider.endpoint = _getEndPoint(data[3]);
    proxyProvider.registration = _getRegistration(data[4]);
    return proxyProvider;
  });
  return proxyProviders;
}

function _getRegistration(data: any[]) {
  const registration = new Registration();
  registration.addressCommitment = data[1];
  registration.utxoCommitment = data[2];
  registration.signature = data[3];
  registration.expiry = data[4];
  return registration;
}

function _getProducerAction(data: any): ProducerAction {
  const producerAction = new ProducerAction();
  producerAction.producerInput = _getIndex(data[1]);
  producerAction.producerOutput = _getProducerOutput(data[2]);
  if (data[3].length > 0) {
    producerAction.pOwnerOutput = _getPOwnerOutput(data[3]);
  }
  producerAction.extensions = _getExtensions(data[4]);
  return producerAction;
}

function _getProducerOutput(data: any[]) {
  const producerOutput = new ProducerOutput();
  producerOutput.producer = _getIndex(data[1]);
  producerOutput.pVendorEndpoint = _getEndPoint(data[2][0]);
  return producerOutput;
}

function _getPOwnerOutput(data: any[]) {
  const ownerOutput = new OwnerOutput();
  ownerOutput.owner = _getIndex(data[1]);
  ownerOutput.oVendorEndpoint = _getVendorEndpoint(data[2]);
  return ownerOutput;
}

function _getExtensions(datas: any[]) {
  const extensions: Extension[] = datas.map((data: any[]) => {
    if (data[0] === 0) {
      return _getOwnerExtension(data);
    } else {
      console.log('Check: Got Producer Extension');
      return _getProducerExtension(data);
    }
  });
  return extensions;
}

function _getOwnerExtension(data: any[]) {
  const ownerExtension = new OwnerExtension();
  ownerExtension.ownerOutputEx = _getOwnerOutput(data[1]);
  ownerExtension.codePoint = data[2];
  return ownerExtension;
}

function _getProducerExtension(data: any[]) {
  const producerExtension = new ProducerExtension();
  producerExtension.producerOutputEx = _getProducerOutput(data[1]);
  producerExtension.codePoint = data[2];
  return producerExtension;
}

function _getEndPoint(data: any[]) {
  const endpoint = new Endpoint();
  endpoint.protocol = data[1];
  endpoint.uri = data[2];
  return endpoint;
}

export function removeOpReturn(data: string) {
  const prefixRemoved = data.substring(36);
  const opcode = parseInt(prefixRemoved.substring(0, 2), 16);
  if (opcode <= 0x4b) {
    return prefixRemoved.substring(2);
    // remaining
  } else if (opcode === 0x4c) {
    return prefixRemoved.substring(4);
    // take 2
  } else if (opcode === 0x4d) {
    return prefixRemoved.substring(6);
    // take 4
  } else if (opcode === 0x4e) {
    return prefixRemoved.substring(10);
    // take 8
  } else if (opcode === 0x99) {
    throw new Error('Incorrect data');
  }
  throw new Error('Incorrect data');
}

export function decodeCBORData(data: string) {
  const hexData = removeOpReturn(data);
  const allegoryDataBuffer = Buffer.from(hexData, 'hex');
  const allegoryDataArrayBuffer = allegoryDataBuffer.buffer.slice(
    allegoryDataBuffer.byteOffset,
    allegoryDataBuffer.byteOffset + allegoryDataBuffer.byteLength
  );
  try {
    return CBOR.decode(allegoryDataArrayBuffer);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
