import { createReducer } from 'redux-act';
import * as actions from './walletActions';

const INITIAL_STATE = {
  mnemonicLanguage: '',
  bip39Mnemonic: '',
  // bip39SplitMnemonic: [],
  bip39Passphrase: '',
  bip39Seed: '',
  coin: '',
  bip32RootKey: '',
  accountExtendedPrivateKey: '',
  accountExtendedPublicKey: '',
  bip32DerivationPath: '',
  bip32ExtendedPrivateKey: '',
  bip32ExtendedPublicKey: '',
  derivedAddress: [],
  isLoading: false,
  currentBalance: 0,
};

export default createReducer(
  {
    [actions.generateMnemonicSuccess]: (state, payload) => ({
      ...state,
      mnemonic: payload.mnemonic,
    }),
    [actions.getCurrentBalanceSuccess]: (state, payload) => ({
      ...state,
      currentBalance: payload.balance,
    }),
  },
  INITIAL_STATE
);
