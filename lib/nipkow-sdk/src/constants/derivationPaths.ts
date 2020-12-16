export default {
  BITCOIN_SV: {
    BIP32: {
      derivationPath: 'm/0',
    },
    BIP44: {
      purpose: 44,
      coin: 236,
      account: 0,
      change: 0,
      derivationPath: "m/44'/236'/0'/0",
      nUTXODerivationPath: "m/44'/236'/1'/0",
    },
  },
  BITCOIN_SV_TESTNET: {
    BIP32: {
      derivationPath: 'm/0',
    },
    BIP44: {
      purpose: 44,
      coin: 1,
      account: 0,
      change: 0,
      derivationPath: 'm/44/1/0/0',
      nUTXODerivationPath: 'm/44/1/1/0',
    },
  },
  BITCOIN_SV_REGTEST: {
    BIP32: {
      derivationPath: 'm/0',
    },
    BIP44: {
      purpose: 44,
      coin: 1,
      account: 0,
      change: 0,
      derivationPath: 'm/44/1/0/0',
      nUTXODerivationPath: 'm/44/1/1/0',
    },
  },
};
