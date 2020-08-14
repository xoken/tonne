import { createAction } from 'redux-act';
import WalletService from './walletService';

export const initWalletRequest = createAction('INIT_WALLET_REQUEST');
export const initWalletSuccess = createAction('INIT_WALLET_SUCCESS');
export const initWalletFailure = createAction('INIT_WALLET_FAILURE');

export const getCurrentBalanceRequest = createAction(
  'GET_CURRENT_BALANCE_REQUEST'
);
export const getCurrentBalanceSuccess = createAction(
  'GET_CURRENT_BALANCE_SUCCESS'
);
export const getCurrentBalanceFailure = createAction(
  'GET_CURRENT_BALANCE_FAILURE'
);

export const getOutputsRequest = createAction('GET_OUTPUTS_REQUEST');
export const getOutputsSuccess = createAction('GET_OUTPUTS_SUCCESS');
export const getOutputsFailure = createAction('GET_OUTPUTS_FAILURE');

export const initWallet = (bip39Mnemonic) => (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(initWalletRequest());
  try {
    const response = serviceInjector(WalletService).initWallet(bip39Mnemonic);
    dispatch(initWalletSuccess(response));
  } catch (error) {
    console.log(error);
    dispatch(initWalletFailure());
  }
};

export const getCurrentBalance = () => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(getCurrentBalanceRequest());
  try {
    const response = await serviceInjector(WalletService).getCurrentBalance();
    dispatch(getCurrentBalanceSuccess(response));
  } catch (error) {
    dispatch(getCurrentBalanceFailure());
  }
};

export const getOutputs = () => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(getOutputsRequest());
  try {
    const outputs = await serviceInjector(WalletService).getOutputs();
    dispatch(getOutputsSuccess({ outputs }));
  } catch (error) {
    dispatch(getOutputsFailure());
  }
};
