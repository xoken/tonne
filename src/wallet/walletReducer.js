import { createReducer } from 'redux-act';
import auth from '../auth';
import * as actions from './walletActions';

const INITIAL_STATE = {
  // mnemonicLanguage: '',
  // bip39SplitMnemonic: [],
  isSessionValid: false,
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
    [auth.actions.loginSuccess]: (state, { loginResult }) => ({
      ...state,
      isSessionValid: loginResult,
    }),
    [actions.initWalletSuccess]: state => ({
      ...state,
      // bip39SeedHex: payload.bip39SeedHex,
      // bip32RootKeyBase58: payload.bip32RootKeyBase58,
      // bip32ExtendedKey: payload.bip32ExtendedKey,
      // accountExtendedPrivateKey: payload.accountExtendedPrivateKey,
      // accountExtendedPublicKey: payload.accountExtendedPublicKey,
      // bip32ExtendedPrivateKey: payload.bip32ExtendedPrivateKey,
      // bip32ExtendedPublicKey: payload.bip32ExtendedPublicKey,
      // derivedKeys: payload.derivedKeys,
    }),
    [actions.getOutputsRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getOutputsSuccess]: (state, { outputs }) => ({
      ...state,
      outputs,
      isLoading: false,
    }),
    [actions.getBalanceSuccess]: (state, { balance }) => ({
      ...state,
      balance,
    }),
    [actions.getOutputsFailure]: state => ({
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
