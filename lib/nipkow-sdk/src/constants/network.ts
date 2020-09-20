export default {
  BITCOIN_SV: {
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    bech32: '',
    messagePrefix: 'unused',
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
  },
  BITCOIN_SV_REGTEST: {
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    bech32: 'bcrt',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    p2wpkh: {
      baseNetwork: 'regtest',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bcrt',
      bip32: {
        public: 0x045f1cf6,
        private: 0x045f18bc,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
    },
    p2wpkhInP2sh: {
      baseNetwork: 'regtest',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bcrt',
      bip32: {
        public: 0x044a5262,
        private: 0x044a4e28,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
    },
    p2wsh: {
      baseNetwork: 'regtest',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bcrt',
      bip32: {
        public: 0x02575483,
        private: 0x02575048,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
    },
    p2wshInP2sh: {
      baseNetwork: 'regtest',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bcrt',
      bip32: {
        public: 0x024289ef,
        private: 0x024285b5,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
    },
  },
  BITCOIN_SV_TESTNET: {
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    bech32: 'tb',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    p2wpkh: {
      baseNetwork: 'testnet',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x045f1cf6,
        private: 0x045f18bc,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
    },
    p2wsh: {
      baseNetwork: 'testnet',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x02575483,
        private: 0x02575048,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
    },
    p2wpkhInP2sh: {
      baseNetwork: 'testnet',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x044a5262,
        private: 0x044a4e28,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
    },
    p2wshInP2sh: {
      baseNetwork: 'testnet',
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x024289ef,
        private: 0x024285b5,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
    },
  },
};