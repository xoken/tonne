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
    [actions.updateProfileNameSuccess]: (state, { profile }) => ({
      ...state,
      profile,
    }),
    [actions.setMnemonicSuccess]: (state, { bip39Mnemonic }) => ({
      ...state,
      bip39Mnemonic,
    }),
    [actions.loginRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.loginSuccess]: (state, { profile }) => ({
      ...state,
      bip39Mnemonic: null,
      isLoading: false,
      profile,
    }),
    [actions.loginFailure]: state => ({
      ...state,
      bip39Mnemonic: null,
      isLoading: false,
    }),
    [actions.logoutSuccess]: state => ({
      ...state,
      profile: null,
    }),
  },
  INITIAL_STATE
);
