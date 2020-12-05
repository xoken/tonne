import CBOR from 'cbor-js';

interface Allegory {
  version?: number;
  name: number[];
  action: Action;
}

type Action = ProducerAction | OwnerAction;

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

interface Index {
  index: number;
}

interface ProducerOutput {
  producer: Index;
  pVendorEndpoint?: Endpoint;
}

interface OwnerOutput {
  owner: Index;
  oVendorEndpoint: Endpoint;
}

type Extension = OwnerExtension | ProducerExtension;

interface OwnerExtension {
  ownerOutputEx: OwnerOutput;
  codePoint: number;
}

interface ProducerExtension {
  producerOutputEx: ProducerOutput;
  codePoint: number;
}

interface Endpoint {
  protocol: string;
  uri: string;
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

export function getAllegoryType(decodedCBOR: any) {
  // decodedCBOR = [
  //   0,
  //   1,
  //   [115, 104],
  //   [
  //     1,
  //     [0, 0],
  //     [0, [0, 1], [[0, 'XokenP2P', 'someuri_1']]],
  //     [
  //       [
  //         0,
  //         'AllPay',
  //         'Public',
  //         [0, 'XokenP2P', 'someuri_2'],
  //         [0, 'addrCommit', 'utxoCommit', 'signature', 876543],
  //       ],
  //     ],
  //   ],
  // ];
  let version: number | null = null;
  let name: number[] | null = null;
  let action: Action | null = null;
  debugger;
  if (decodedCBOR.length >= 2) {
    version = decodedCBOR[1];
    name = decodedCBOR[2];
    if (decodedCBOR[3].length === 3) {
      debugger;
      action = getOwnerAction(decodedCBOR[3]);
    }

    if (decodedCBOR[3].length === 4) {
      debugger;
      action = getProducerAction(decodedCBOR[3]);
    }
  }

  if (version && name && action) {
    const allegory = new AllegoryType(version, name, action);
    return allegory;
  }
  return null;
}

export function getAllegoryName(decodedCBOR: any) {
  // const t = [
  //   0,
  //   1,
  //   [],
  //   [
  //     0,
  //     [0, 0],
  //     [0, [0, 1], [[0, 'XokenP2P', 'someuri_1']]],
  //     [],
  //     [[0, [0, [0, 2], [[0, 'XokenP2P', 'someuri_3']]], 115]],
  //   ],
  // ];
  let name: number[] = [];
  let index;
  if (decodedCBOR.length >= 4) {
    name = [...name, ...decodedCBOR[2]];
    if (decodedCBOR[3].length >= 5) {
      name.push(decodedCBOR[3][4][0][2]);
      index = decodedCBOR[3][4][0][1][1][1];
    }
  }
  return { name, index };
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
