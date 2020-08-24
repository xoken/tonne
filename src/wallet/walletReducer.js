import { createReducer } from 'redux-act';
import * as actions from './walletActions';

const INITIAL_STATE = {
  // mnemonicLanguage: '',
  bip39Mnemonic: '',
  // bip39SplitMnemonic: [],
  bip39Passphrase: '',
  bip39SeedHex: '',
  // coin: '',
  bip32RootKeyBase58: '',
  bip32ExtendedKey: '',
  accountExtendedPrivateKey: '',
  accountExtendedPublicKey: '',
  // bip32DerivationPath: '',
  bip32ExtendedPrivateKey: '',
  bip32ExtendedPublicKey: '',
  derivedKeys: [],
  isLoading: false,
  balance: 0,
  outputs: [],
  transactions: [],
};

export default createReducer(
  {
    [actions.generateMnemonicSuccess]: (state, { bip39Mnemonic }) => ({
      ...state,
      bip39Mnemonic,
    }),
    [actions.setPassPhraseSuccess]: (state, { bip39Passphrase }) => ({
      ...state,
      bip39Passphrase,
    }),
    [actions.initWalletSuccess]: (state, payload) => ({
      ...state,
      bip39SeedHex: payload.bip39SeedHex,
      bip32RootKeyBase58: payload.bip32RootKeyBase58,
      bip32ExtendedKey: payload.bip32ExtendedKey,
      accountExtendedPrivateKey: payload.accountExtendedPrivateKey,
      accountExtendedPublicKey: payload.accountExtendedPublicKey,
      bip32ExtendedPrivateKey: payload.bip32ExtendedPrivateKey,
      bip32ExtendedPublicKey: payload.bip32ExtendedPublicKey,
      derivedKeys: payload.derivedKeys,
    }),
    [actions.getCurrentBalanceRequest]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [actions.getCurrentBalanceSuccess]: (state, payload) => ({
      ...state,
      balance: payload.balance,
      outputs: payload.outputs,
      derivedKeys: payload.derivedKeys,
      isLoading: false,
    }),
    [actions.getCurrentBalanceFailure]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [actions.getTransactionSuccess]: (state, { transactions }) => ({
      ...state,
      transactions,
    }),
  },
  INITIAL_STATE
);
