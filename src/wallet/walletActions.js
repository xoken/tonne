import { createAction } from 'redux-act';
import WalletService from './walletService';

export const getOutputsRequest = createAction('GET_OUTPUTS_REQUEST');
export const getOutputsSuccess = createAction('GET_OUTPUTS_SUCCESS');
export const getOutputsFailure = createAction('GET_OUTPUTS_FAILURE');

export const getBalanceRequest = createAction('GET_BALANCE_REQUEST');
export const getBalanceSuccess = createAction('GET_BALANCE_SUCCESS');
export const getBalanceFailure = createAction('GET_BALANCE_FAILURE');

export const getTransactionRequest = createAction('GET_TRANSACTION_REQUEST');
export const getTransactionSuccess = createAction('GET_TRANSACTION_SUCCESS');
export const getTransactionFailure = createAction('GET_TRANSACTION_FAILURE');

export const createSendTransactionRequest = createAction('CREATE_SEND_TRANSACTION_REQUEST');
export const createSendTransactionSuccess = createAction('CREATE_SEND_TRANSACTION_SUCCESS');
export const createSendTransactionFailure = createAction('CREATE_SEND_TRANSACTION_FAILURE');

export const getOutputs = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getOutputsRequest());
  try {
    const { outputs } = await serviceInjector(WalletService).getOutputs();
    dispatch(getOutputsSuccess({ outputs }));
    if (outputs.length > 0) {
      dispatch(getBalanceRequest());
      const { balance } = await serviceInjector(WalletService).getBalance();
      dispatch(getBalanceSuccess({ balance }));
    }
  } catch (error) {
    console.log(error);
    dispatch(getOutputsFailure());
  }
};

export const getTransaction = txid => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getTransactionRequest());
  try {
    const { txoutputs } = await serviceInjector(WalletService).getTransaction(txid);
    dispatch(getTransactionSuccess({ txoutputs }));
  } catch (error) {
    console.log(error);
    dispatch(getTransactionFailure());
  }
};

export const createSendTransaction = (receiverAddress, amountInSatoshi, transactionFee) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(createSendTransactionRequest());
  try {
    const response = await serviceInjector(WalletService).createSendTransaction(
      receiverAddress,
      amountInSatoshi,
      transactionFee
    );
    dispatch(createSendTransactionSuccess(response));
  } catch (error) {
    console.log(error);
    dispatch(createSendTransactionFailure());
  }
};
