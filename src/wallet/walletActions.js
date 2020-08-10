import { createAction } from 'redux-act';
import WalletService from './walletService';

export const generateMnemonicRequest = createAction(
  'GENERATE_MNEMONIC_REQUEST'
);
export const generateMnemonicSuccess = createAction(
  'GENERATE_MNEMONIC_SUCCESS'
);
export const generateMnemonicFailure = createAction(
  'GENERATE_MNEMONIC_FAILURE'
);

export const getCurrentBalanceRequest = createAction(
  'GET_CURRENT_BALANCE_REQUEST'
);
export const getCurrentBalanceSuccess = createAction(
  'GET_CURRENT_BALANCE_SUCCESS'
);
export const getCurrentBalanceFailure = createAction(
  'GET_CURRENT_BALANCE_FAILURE'
);

export const generateMnemonic = () => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(generateMnemonicRequest());
  try {
    const info = serviceInjector(WalletService).generateMnemonic();
    console.log(info);
    // dispatch(generateMnemonicSuccess({ mnemonic }));
  } catch (error) {
    console.log(error);
    dispatch(generateMnemonicFailure());
  }
};

export const fromMnemonic = (mnemonic) => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(generateMnemonicRequest());
  try {
    const info = serviceInjector(WalletService).generateKeysFromMnemonic(
      mnemonic
    );
    console.log(info);
    // dispatch(generateMnemonicSuccess({ mnemonic }));
  } catch (error) {
    console.log(error);
    dispatch(generateMnemonicFailure());
  }
};

export const getCurrentBalance = () => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(getCurrentBalanceRequest());
  try {
    const balance = serviceInjector(WalletService).getCurrentBalance();
    dispatch(getCurrentBalanceSuccess({ balance }));
  } catch (error) {
    dispatch(getCurrentBalanceFailure());
  }
};
