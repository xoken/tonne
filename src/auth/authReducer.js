import { createReducer } from 'redux-act';
import auth from '../auth';

const INITIAL_STATE = {
  isLoading: false,
  bip39Mnemonic: null,
  bip39Passphrase: null,
};

export default createReducer(
  {
    [auth.actions.setMnemonicSuccess]: (state, { bip39Mnemonic }) => ({
      ...state,
      bip39Mnemonic,
    }),
    [auth.actions.setPassPhraseSuccess]: (state, { bip39Passphrase }) => ({
      ...state,
      bip39Passphrase,
    }),
  },
  INITIAL_STATE
);
