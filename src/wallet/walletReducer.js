import { createReducer } from 'redux-act';
import * as actions from './walletActions';

const INITIAL_STATE = {
  mnemonic: '',
  isLoading: false,
};

export default createReducer(
  {
    [actions.generateMnemonicSuccess]: (state, payload) => ({
      ...state,
      mnemonic: payload.mnemonic,
    }),
  },
  INITIAL_STATE
);
