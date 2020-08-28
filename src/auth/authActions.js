import { createAction } from 'redux-act';
import * as walletActions from '../wallet/walletActions';
import AuthService from './authService';

export const loginRequest = createAction('LOGIN_REQUEST');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const loginFailure = createAction('LOGIN_FAILURE');

export const generateMnemonicRequest = createAction('GENERATE_MNEMONIC_REQUEST');
export const generateMnemonicSuccess = createAction('GENERATE_MNEMONIC_SUCCESS');
export const generateMnemonicFailure = createAction('GENERATE_MNEMONIC_FAILURE');

export const setMnemonicRequest = createAction('SET_MNEMONIC_REQUEST');
export const setMnemonicSuccess = createAction('SET_MNEMONIC_SUCCESS');
export const setMnemonicFailure = createAction('SET_MNEMONIC_FAILURE');

export const setPassPhraseRequest = createAction('SET_PASS_PHRASE_REQUEST');
export const setPassPhraseSuccess = createAction('SET_PASS_PHRASE_SUCCESS');
export const setPassPhraseFailure = createAction('SET_PASS_PHRASE_FAILURE');

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

export const setMnemonic = bip39Mnemonic => (dispatch, getState, { serviceInjector }) => {
  dispatch(setMnemonicRequest());
  try {
    dispatch(setMnemonicSuccess({ bip39Mnemonic }));
  } catch (error) {
    dispatch(setMnemonicFailure());
    throw error;
  }
};

export const setPassPhrase = bip39Passphrase => async (dispatch, getState, { serviceInjector }) => {
  dispatch(setPassPhraseRequest());
  try {
    dispatch(setPassPhraseSuccess({ bip39Passphrase }));
    const {
      auth: { bip39Mnemonic },
    } = getState();
    await dispatch(walletActions.initWallet(bip39Mnemonic, bip39Passphrase));
    dispatch(loginSuccess({ loginResult: true }));
  } catch (error) {
    dispatch(setPassPhraseFailure());
    throw error;
  }
};

export const login = bip39Passphrase => async (dispatch, getState, { serviceInjector }) => {
  const {
    auth: { bip39Passphrase: existingBip39Passphrase },
  } = getState();
  dispatch(loginRequest());
  try {
    const loginResult = await serviceInjector(AuthService).login(
      bip39Passphrase,
      existingBip39Passphrase
    );
    if (loginResult) {
      const {
        auth: { bip39Mnemonic },
      } = getState();
      await dispatch(walletActions.initWallet(bip39Mnemonic, bip39Passphrase));
      dispatch(loginSuccess({ loginResult }));
    } else {
      dispatch(loginFailure());
    }
    return loginResult;
  } catch (error) {
    dispatch(loginFailure());
  }
};
