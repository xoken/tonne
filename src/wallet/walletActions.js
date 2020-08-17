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

export const createSendTransactionRequest = createAction(
  'CREATE_SEND_TRANSACTION_REQUEST'
);
export const createSendTransactionSuccess = createAction(
  'CREATE_SEND_TRANSACTION_SUCCESS'
);
export const createSendTransactionFailure = createAction(
  'CREATE_SEND_TRANSACTION_FAILURE'
);

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

export const createSendTransaction = (
  receiverAddress,
  amountInSatoshi,
  transactionFee
) => async (dispatch, getState, { serviceInjector }) => {
  dispatch(createSendTransactionRequest());
  try {
    const response = await serviceInjector(WalletService).createSendTransaction(
      receiverAddress,
      amountInSatoshi,
      transactionFee
    );
    dispatch(createSendTransactionSuccess(response));
  } catch (error) {
    dispatch(createSendTransactionFailure());
  }
};
