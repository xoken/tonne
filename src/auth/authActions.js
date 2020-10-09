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

export const updateProfileNameRequest = createAction('UPDATE_PROFILE_NAME_REQUEST');
export const updateProfileNameSuccess = createAction('UPDATE_PROFILE_NAME_SUCCESS');
export const updateProfileNameFailure = createAction('UPDATE_PROFILE_NAME_FAILURE');

export const setMnemonicRequest = createAction('SET_MNEMONIC_REQUEST');
export const setMnemonicSuccess = createAction('SET_MNEMONIC_SUCCESS');
export const setMnemonicFailure = createAction('SET_MNEMONIC_FAILURE');

export const loginRequest = createAction('LOGIN_REQUEST');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const loginFailure = createAction('LOGIN_FAILURE');

export const logoutRequest = createAction('LOGOUT_REQUEST');
export const logoutSuccess = createAction('LOGOUT_SUCCESS');
export const logoutFailure = createAction('LOGOUT_FAILURE');

export const getProfiles = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getProfileRequest());
  try {
    const { profiles } = await serviceInjector(AuthService).getProfiles();
    dispatch(getProfileSuccess({ profiles }));
  } catch (error) {
    dispatch(getProfileFailure());
    throw error;
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
    try {
      dispatch(setMnemonicSuccess({ bip39Mnemonic }));
    } catch (error) {
      dispatch(setMnemonicFailure());
    }
  } catch (error) {
    dispatch(generateMnemonicFailure());
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
    await dispatch(login(profile, password));
  } catch (error) {
    dispatch(createProfileFailure());
    throw error;
  }
};

export const updateProfileName = (currentProfileName, newProfileName) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(updateProfileNameRequest());
  try {
    const { profile } = await serviceInjector(AuthService).updateProfileName(
      currentProfileName,
      newProfileName
    );
    dispatch(updateProfileNameSuccess({ profile }));
    return false;
  } catch (error) {
    dispatch(updateProfileNameFailure());
    return true;
  }
};

export const login = (profileId, password) => async (dispatch, getState, { serviceInjector }) => {
  dispatch(loginRequest());
  try {
    const { profile } = await serviceInjector(AuthService).login(profileId, password);
    if (profile) {
      dispatch(loginSuccess({ profile }));
    } else {
      dispatch(loginFailure());
    }
  } catch (error) {
    dispatch(loginFailure());
  }
};

export const logout = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(logoutRequest());
  try {
    await serviceInjector(AuthService).logout();
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFailure());
  }
};
