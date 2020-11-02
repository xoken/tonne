interface Allegory {
  version: number;
  name: number[];
  action: Action;
}

type Action = ProducerAction | OwnerAction;

type Extension = OwnerExtension | ProducerExtension;

interface ProducerAction {
  producerInput: Index;
  producerOutput: ProducerOutput;
  pOwnerOutput?: OwnerOutput;
  extensions: Extension[];
}

interface OwnerAction {
  ownerInput: Index;
  ownerOutput: OwnerOutput;
  oProxyProviders: ProxyProvider[];
}

interface OwnerExtension {
  ownerOutputEx: OwnerOutput;
  codePoint: number;
}

interface ProducerExtension {
  producerOutputEx: ProducerOutput;
  codePoint: number;
}

interface Index {
  index: number;
}

interface Endpoint {
  protocol: string;
  uri: string;
}

interface ProducerOutput {
  producer: Index;
  pVendorEndpoint?: Endpoint;
}

interface OwnerOutput {
  owner: Index;
  oVendorEndpoint: Endpoint;
}

interface ProxyProvider {
  service: string;
  mode: string;
  endpoint: Endpoint;
  registration: Registration;
}

interface Registration {
  addressCommitment: string;
  utxoCommitment: string;
  signature: string;
  expiry: number;
}
