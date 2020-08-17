import { createReducer } from 'redux-act';
import * as actions from './walletActions';

const INITIAL_STATE = {
  // mnemonicLanguage: '',
  bip39Mnemonic: '',
  // bip39SplitMnemonic: [],
  // bip39Passphrase: '',
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
};

export default createReducer(
  {
    [actions.initWalletSuccess]: (state, payload) => ({
      ...state,
      bip39Mnemonic: payload.bip39Mnemonic,
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
  },
  INITIAL_STATE
);
