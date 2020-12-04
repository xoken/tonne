interface Allegory {
  version?: number;
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

class AllegoryType implements Allegory {
  version: number;
  name: number[];
  action: Action;

  constructor(version: number, name: number[], action: Action) {
    this.version = version;
    this.name = name;
    this.action = action;
  }

  getVersion() {
    return this.version;
  }

  getName() {
    return this.name;
  }

  getAction() {
    return this.action;
  }
}

function getAllegoryType(decodedCBOR: any) {
  decodedCBOR = [
    0,
    1,
    [115, 104],
    [
      1,
      [0, 0],
      [0, [0, 1], [[0, 'XokenP2P', 'someuri_1']]],
      [
        [
          0,
          'AllPay',
          'Public',
          [0, 'XokenP2P', 'someuri_2'],
          [0, 'addrCommit', 'utxoCommit', 'signature', 876543],
        ],
      ],
    ],
  ];
  let version: number | null = null;
  let name: number[] | null = null;
  let action: Action | null = null;
  if (decodedCBOR.length >= 2) {
    version = decodedCBOR[1];
    name = decodedCBOR[2];
    if (decodedCBOR[3].length === 3) {
      action = getOwnerAction(decodedCBOR[3]);
    }

    if (decodedCBOR[3].length === 4) {
      action = getProducerAction(decodedCBOR[3]);
    }
  }

  if (version && name && action) {
    const allegory = new AllegoryType(version, name, action);
    return allegory;
  }
  return null;
}

function getOwnerAction(data: any) {
  data = [
    1,
    [0, 0],
    [0, [0, 1], [[0, 'XokenP2P', 'someuri_1']]],
    [
      [
        0,
        'AllPay',
        'Public',
        [0, 'XokenP2P', 'someuri_2'],
        [0, 'addrCommit', 'utxoCommit', 'signature', 876543],
      ],
    ],
  ];
  const ownerAction: OwnerAction | null = null;
  return ownerAction;
}

function getProducerAction(data: any) {
  data = [
    1,
    [0, 0],
    [0, [0, 1], [[0, 'XokenP2P', 'someuri_1']]],
    [
      [
        0,
        'AllPay',
        'Public',
        [0, 'XokenP2P', 'someuri_2'],
        [0, 'addrCommit', 'utxoCommit', 'signature', 876543],
      ],
    ],
  ];

  const producerAction: ProducerAction | null = null;
  return producerAction;
}
