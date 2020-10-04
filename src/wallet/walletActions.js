import { createAction } from 'redux-act';
import WalletService from './walletService';

export const getOutputsRequest = createAction('GET_OUTPUTS_REQUEST');
export const getOutputsSuccess = createAction('GET_OUTPUTS_SUCCESS');
export const getOutputsFailure = createAction('GET_OUTPUTS_FAILURE');

export const getUTXOsRequest = createAction('GET_UTXOS_REQUEST');
export const getUTXOsSuccess = createAction('GET_UTXOS_SUCCESS');
export const getUTXOsFailure = createAction('GET_UTXOS_FAILURE');

export const getBalanceRequest = createAction('GET_BALANCE_REQUEST');
export const getBalanceSuccess = createAction('GET_BALANCE_SUCCESS');
export const getBalanceFailure = createAction('GET_BALANCE_FAILURE');

export const getTransactionFeeRequest = createAction('GET_TRANSACTION_FEE_REQUEST');
export const getTransactionFeeSuccess = createAction('GET_TRANSACTION_FEE_SUCCESS');
export const getTransactionFeeFailure = createAction('GET_TRANSACTION_FEE_FAILURE');

export const getTransactionRequest = createAction('GET_TRANSACTION_REQUEST');
export const getTransactionSuccess = createAction('GET_TRANSACTION_SUCCESS');
export const getTransactionFailure = createAction('GET_TRANSACTION_FAILURE');

export const createSendTransactionRequest = createAction('CREATE_SEND_TRANSACTION_REQUEST');
export const createSendTransactionSuccess = createAction('CREATE_SEND_TRANSACTION_SUCCESS');
export const createSendTransactionFailure = createAction('CREATE_SEND_TRANSACTION_FAILURE');

export const getAddressInfoRequest = createAction('GET_ADDRESS_INFO_REQUEST');
export const getAddressInfoSuccess = createAction('GET_ADDRESS_INFO_SUCCESS');
export const getAddressInfoFailure = createAction('GET_ADDRESS_INFO_FAILURE');

export const getOutputs = options => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getOutputsRequest());
  try {
    const {
      wallet: { nextOutputsCursor: startkey },
    } = getState();
    if (startkey) {
      options.startkey = startkey;
    }
    if (options.diff) {
      const { outputs } = await serviceInjector(WalletService).getOutputs(options);
      if (outputs.length > 0) {
        const { balance } = await serviceInjector(WalletService).getBalance();
        dispatch(getOutputsSuccess({ outputs }));
        dispatch(getBalanceSuccess({ balance }));
      } else {
        dispatch(getOutputsSuccess({ outputs }));
      }
    } else {
      const { outputs, nextOutputsCursor } = await serviceInjector(WalletService).getOutputs(
        options
      );
      dispatch(getOutputsSuccess({ outputs, nextOutputsCursor }));
    }
  } catch (error) {
    dispatch(getOutputsFailure());
    throw error;
  }
};

export const getUTXOs = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getUTXOsRequest());
  try {
    await serviceInjector(WalletService).getUTXOs();
  } catch (error) {
    throw error;
  }
};

export const getBalance = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getBalanceRequest());
  try {
    const { balance } = await serviceInjector(WalletService).getBalance();
    dispatch(getBalanceSuccess({ balance }));
  } catch (error) {
    dispatch(getOutputsFailure());
    throw error;
  }
};

export const getTransactionFee = (receiverAddress, amountInSatoshi) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(getTransactionFeeRequest());
  try {
    const fee = await serviceInjector(WalletService).getTransactionFee(
      receiverAddress,
      amountInSatoshi
    );
    return fee;
  } catch (error) {
    throw error;
  }
};

export const getTransaction = txid => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getTransactionRequest());
  try {
    const { txoutputs } = await serviceInjector(WalletService).getTransaction(txid);
    dispatch(getTransactionSuccess({ txoutputs }));
  } catch (error) {
    dispatch(getTransactionFailure());
    throw error;
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
    dispatch(createSendTransactionFailure());
    throw error;
  }
};

export const getAddressInfo = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getAddressInfoRequest());
  try {
    const { addressInfo } = await serviceInjector(WalletService).getAddressInfo();
    dispatch(getAddressInfoSuccess({ addressInfo }));
  } catch (error) {
    dispatch(getAddressInfoFailure());
    throw error;
  }
};
