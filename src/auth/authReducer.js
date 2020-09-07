import { createReducer } from 'redux-act';
import * as actions from './authActions';

const INITIAL_STATE = {
  isLoading: false,
  bip39Mnemonic: null,
  profile: null,
  profiles: [],
};

export default createReducer(
  {
    [actions.getProfileRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getProfileSuccess]: (state, { profiles }) => ({
      ...state,
      profiles,
      isLoading: false,
    }),
    [actions.getProfileFailure]: state => ({
      ...state,
      isLoading: false,
    }),
    [actions.setMnemonicSuccess]: (state, { bip39Mnemonic }) => ({
      ...state,
      bip39Mnemonic,
    }),
    [actions.loginSuccess]: (state, { loginResult }) => ({
      ...state,
    }),
    [actions.setProfileSuccess]: (state, { profile }) => ({
      ...state,
      profile,
    }),
  },
  INITIAL_STATE
);
