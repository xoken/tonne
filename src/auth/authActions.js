import { createAction } from 'redux-act';
import AuthService from './authService';

export const getProfileRequest = createAction('GET_PROFILE_REQUEST');
export const getProfileSuccess = createAction('GET_PROFILE_SUCCESS');
export const getProfileFailure = createAction('GET_PROFILE_FAILURE');

export const generateMnemonicRequest = createAction('GENERATE_MNEMONIC_REQUEST');
export const generateMnemonicSuccess = createAction('GENERATE_MNEMONIC_SUCCESS');
export const generateMnemonicFailure = createAction('GENERATE_MNEMONIC_FAILURE');

export const createProfileRequest = createAction('CREATE_PROFILE_REQUEST');
export const createProfileSuccess = createAction('CREATE_PROFILE_SUCCESS');
export const createProfileFailure = createAction('CREATE_PROFILE_FAILURE');

export const setMnemonicRequest = createAction('SET_MNEMONIC_REQUEST');
export const setMnemonicSuccess = createAction('SET_MNEMONIC_SUCCESS');
export const setMnemonicFailure = createAction('SET_MNEMONIC_FAILURE');

export const setProfileRequest = createAction('SET_PROFILE_REQUEST');
export const setProfileSuccess = createAction('SET_PROFILE_SUCCESS');
export const setProfileFailure = createAction('SET_PROFILE_FAILURE');

export const loginRequest = createAction('LOGIN_REQUEST');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const loginFailure = createAction('LOGIN_FAILURE');

export const getProfiles = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getProfileRequest());
  try {
    const { profiles } = await serviceInjector(AuthService).getProfiles();
    dispatch(getProfileSuccess({ profiles }));
  } catch (error) {
    console.log(error);
    dispatch(getProfileFailure());
  }
};

export const setMnemonic = bip39Mnemonic => (dispatch, getState, { serviceInjector }) => {
  dispatch(setMnemonicRequest());
  try {
    dispatch(setMnemonicSuccess({ bip39Mnemonic }));
  } catch (error) {
    dispatch(setMnemonicFailure());
    throw error;
  }
};

export const generateMnemonic = () => (dispatch, getState, { serviceInjector }) => {
  dispatch(generateMnemonicRequest());
  try {
    const bip39Mnemonic = serviceInjector(AuthService).generateMnemonic();
    dispatch(generateMnemonicSuccess());
    dispatch(setMnemonicSuccess({ bip39Mnemonic }));
  } catch (error) {
    dispatch(generateMnemonicFailure());
    dispatch(setMnemonicFailure());
    throw error;
  }
};

export const createProfile = password => async (dispatch, getState, { serviceInjector }) => {
  dispatch(createProfileRequest());
  try {
    const {
      auth: { bip39Mnemonic },
    } = getState();
    const { profile } = await serviceInjector(AuthService).createProfile(bip39Mnemonic, password);
    dispatch(createProfileSuccess());
    return login(profile, password);
  } catch (error) {
    console.log(error);
    dispatch(createProfileFailure());
  }
};

export const setProfile = profile => (dispatch, getState, { serviceInjector }) => {
  dispatch(setProfileRequest());
  try {
    dispatch(setProfileSuccess({ profile }));
  } catch (error) {
    dispatch(setProfileFailure());
    throw error;
  }
};

export const login = password => async (dispatch, getState, { serviceInjector }) => {
  dispatch(loginRequest());
  try {
    const {
      auth: { profile },
    } = getState();
    const loginResult = await serviceInjector(AuthService).login(profile, password);
    if (loginResult) {
      dispatch(loginSuccess({ loginResult }));
    } else {
      dispatch(loginFailure());
    }
    return loginResult;
  } catch (error) {
    dispatch(loginFailure());
  }
};
