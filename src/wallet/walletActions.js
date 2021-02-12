import { createAction } from 'redux-act';
import WalletService from './walletService';

export const getTransactionsRequest = createAction('GET_TRANSACTIONS_REQUEST');
export const getTransactionsSuccess = createAction('GET_TRANSACTIONS_SUCCESS');
export const getTransactionsFailure = createAction('GET_TRANSACTIONS_FAILURE');

export const getDiffTransactionsSuccess = createAction('GET_TRANSACTIONS_DIFF_SUCCESS');

export const updateTransactionsConfirmationsRequest = createAction(
  'UPDATE_TRANSACTIONS_CONFIRMATIONS_REQUEST'
);
export const updateTransactionsConfirmationsSuccess = createAction(
  'UPDATE_TRANSACTIONS_CONFIRMATIONS_SUCCESS'
);
export const updateTransactionsConfirmationsFailure = createAction(
  'UPDATE_TRANSACTIONS_CONFIRMATIONS_FAILURE'
);

export const getBalanceRequest = createAction('GET_BALANCE_REQUEST');
export const getBalanceSuccess = createAction('GET_BALANCE_SUCCESS');
export const getBalanceFailure = createAction('GET_BALANCE_FAILURE');

export const getTransactionFeeRequest = createAction('GET_TRANSACTION_FEE_REQUEST');
export const getTransactionFeeSuccess = createAction('GET_TRANSACTION_FEE_SUCCESS');
export const getTransactionFeeFailure = createAction('GET_TRANSACTION_FEE_FAILURE');

export const createSendTransactionRequest = createAction('CREATE_SEND_TRANSACTION_REQUEST');
export const createSendTransactionSuccess = createAction('CREATE_SEND_TRANSACTION_SUCCESS');
export const createSendTransactionFailure = createAction('CREATE_SEND_TRANSACTION_FAILURE');

export const createAllpaySendTransactionRequest = createAction(
  'CREATE_ALLPAY_SEND_TRANSACTION_REQUEST'
);
export const createAllpaySendTransactionSuccess = createAction(
  'CREATE_ALLPAY_SEND_TRANSACTION_SUCCESS'
);
export const createAllpaySendTransactionFailure = createAction(
  'CREATE_ALLPAY_SEND_TRANSACTION_FAILURE'
);

export const getUsedAddressesRequest = createAction('GET_USED_ADDRESSES_REQUEST');
export const getUsedAddressesSuccess = createAction('GET_USED_ADDRESSES_SUCCESS');
export const getUsedAddressesFailure = createAction('GET_USED_ADDRESSES_FAILURE');

export const getUnusedAddressesRequest = createAction('GET_UNUSED_ADDRESSES_REQUEST');
export const getUnusedAddressesSuccess = createAction('GET_UNUSED_ADDRESSES_SUCCESS');
export const getUnusedAddressesFailure = createAction('GET_UNUSED_ADDRESSES_FAILURE');

export const getUnregisteredNameRequest = createAction('GET_UNREGISTERED_NAMES_REQUEST');
export const getUnregisteredNameSuccess = createAction('GET_UNREGISTERED_NAMES_SUCCESS');
export const getUnregisteredNameFailure = createAction('GET_UNREGISTERED_NAMES_FAILURE');

export const getAllpayHandlesRequest = createAction('GET_ALLPAY_HANDLES_REQUEST');
export const getAllpayHandlesSuccess = createAction('GET_ALLPAY_HANDLES_SUCCESS');
export const getAllpayHandlesFailure = createAction('GET_ALLPAY_HANDLES_FAILURE');

export const getTransactions = options => async (dispatch, getState, { serviceInjector }) => {
  try {
    const {
      wallet: { nextTransactionCursor: startkey, isLoadingTransactions },
    } = getState();
    if (!isLoadingTransactions) {
      dispatch(getTransactionsRequest());
      if (startkey) {
        options.startkey = startkey;
      }
      if (options.diff) {
        const { transactions } = await serviceInjector(WalletService).getTransactions(options);
        await dispatch(getBalance());
        dispatch(getDiffTransactionsSuccess({ transactions }));
      } else {
        const { transactions, nextTransactionCursor } = await serviceInjector(
          WalletService
        ).getTransactions(options);
        await dispatch(getBalance());
        dispatch(getTransactionsSuccess({ transactions, nextTransactionCursor }));
      }
    }
  } catch (error) {
    dispatch(getTransactionsFailure());
    throw error;
  }
};

export const updateTransactionsConfirmations = () => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(updateTransactionsConfirmationsRequest());
  try {
    const { updatedTransactions, deletedTransactions } = await serviceInjector(
      WalletService
    ).updateTransactionsConfirmations();
    dispatch(updateTransactionsConfirmationsSuccess({ updatedTransactions, deletedTransactions }));
  } catch (error) {
    dispatch(updateTransactionsConfirmationsFailure());
    throw error;
  }
};

export const getBalance = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getBalanceRequest());
  try {
    const { balance } = await serviceInjector(WalletService).getBalance();
    dispatch(getBalanceSuccess({ balance }));
    return { balance };
  } catch (error) {
    dispatch(getBalanceFailure());
    throw error;
  }
};

export const getTransactionFee = (receiverAddress, amountInSatoshi, feeRate) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(getTransactionFeeRequest());
  try {
    const fee = await serviceInjector(WalletService).getTransactionFee(
      receiverAddress,
      amountInSatoshi,
      feeRate
    );
    return fee;
  } catch (error) {
    throw error;
  }
};

export const createSendTransaction = args => async (dispatch, getState, { serviceInjector }) => {
  dispatch(createSendTransactionRequest());
  try {
    const { transaction } = await serviceInjector(WalletService).createSendTransaction(args);
    await dispatch(getBalance());
    dispatch(createSendTransactionSuccess({ transaction }));
  } catch (error) {
    dispatch(createSendTransactionFailure());
    throw error;
  }
};

export const createAllpaySendTransaction = args => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(createAllpaySendTransactionRequest());
  try {
    const { inputs, ownOutputs, psbt, addressCommitment, utxoCommitment } = await serviceInjector(
      WalletService
    ).createAllpaySendTransaction(args);
    dispatch(
      createAllpaySendTransactionSuccess({
        inputs,
        ownOutputs,
        psbt,
        addressCommitment,
        utxoCommitment,
      })
    );
  } catch (error) {
    dispatch(createAllpaySendTransactionFailure());
    throw error;
  }
};

export const getUsedAddresses = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getUsedAddressesRequest());
  try {
    const { usedAddresses } = await serviceInjector(WalletService).getUsedAddresses();
    dispatch(getUsedAddressesSuccess({ usedAddresses }));
  } catch (error) {
    dispatch(getUsedAddressesFailure());
    throw error;
  }
};

export const getUnusedAddresses = () => async (dispatch, getState, { serviceInjector }) => {
  const {
    wallet: { unusedAddresses },
  } = getState();
  dispatch(getUnusedAddressesRequest());
  const excludeAddresses = unusedAddresses.map(unusedAddress => unusedAddress);
  try {
    const { unusedAddresses } = await serviceInjector(WalletService).getUnusedAddresses({
      excludeAddresses,
    });
    dispatch(getUnusedAddressesSuccess({ unusedAddresses }));
    return { unusedAddresses };
  } catch (error) {
    dispatch(getUnusedAddressesFailure());
    throw error;
  }
};

export const getUnregisteredNames = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getUnregisteredNameRequest());
  try {
    const { names } = await serviceInjector(WalletService).getUnregisteredNames();
    dispatch(getUnregisteredNameSuccess({ unregisteredNames: names }));
    return { names };
  } catch (error) {
    dispatch(getUnregisteredNameFailure());
    throw error;
  }
};

export const getAllpayHandles = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getAllpayHandlesRequest());
  try {
    const { allpayHandles } = await serviceInjector(WalletService).getAllpayHandles();
    dispatch(getAllpayHandlesSuccess({ allpayHandles }));
  } catch (error) {
    dispatch(getAllpayHandlesFailure());
    throw error;
  }
};

export const CLEAR_USED_UNUSED_ADDRESS = 'CLEAR_USED_UNUSED_ADDRESS';
export const clearUsedUnusedAddresses = () => (dispatch, getState, { serviceInjector }) => {
  dispatch({
    type: CLEAR_USED_UNUSED_ADDRESS,
  });
};
