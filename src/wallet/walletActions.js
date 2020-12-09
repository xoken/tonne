import { createAction } from 'redux-act';
import WalletService from './walletService';

export const getTransactionsRequest = createAction('GET_TRANSACTIONS_REQUEST');
export const getTransactionsSuccess = createAction('GET_TRANSACTIONS_SUCCESS');
export const getTransactionsFailure = createAction('GET_TRANSACTIONS_FAILURE');

export const getDiffTransactionsSuccess = createAction('GET_TRANSACTIONS_DIFF_SUCCESS');

export const updateUnconfirmedTransactionsRequest = createAction(
  'UPDATE_UNCONFIRMED_TRANSACTIONS_REQUEST'
);
export const updateUnconfirmedTransactionsSuccess = createAction(
  'UPDATE_UNCONFIRMED_TRANSACTIONS_SUCCESS'
);
export const updateUnconfirmedTransactionsFailure = createAction(
  'UPDATE_UNCONFIRMED_TRANSACTIONS_FAILURE'
);

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

export const receiveResetRequest = createAction('RECEIVE_RESET_REQUEST');
export const receiveResetSuccess = createAction('RECEIVE_RESET_SUCCESS');
export const receiveResetFailure = createAction('RECEIVE_RESET_FAILURE');

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

export const getUsedDerivedKeysRequest = createAction('GET_USED_DERIVED_KEYS_REQUEST');
export const getUsedDerivedKeysSuccess = createAction('GET_USED_DERIVED_KEYS_SUCCESS');
export const getUsedDerivedKeysFailure = createAction('GET_USED_DERIVED_KEYS_FAILURE');

export const getUnusedDerivedKeysRequest = createAction('GET_UNUSED_DERIVED_KEYS_REQUEST');
export const getUnusedDerivedKeysSuccess = createAction('GET_UNUSED_DERIVED_KEYS_SUCCESS');
export const getUnusedDerivedKeysFailure = createAction('GET_UNUSED_DERIVED_KEYS_FAILURE');

export const getTransactions = options => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getTransactionsRequest());
  try {
    const {
      wallet: { nextTransactionCursor: startkey },
    } = getState();
    if (startkey) {
      options.startkey = startkey;
    }
    if (options.diff) {
      const { transactions } = await serviceInjector(WalletService).getTransactions(options);
      dispatch(getDiffTransactionsSuccess({ transactions }));
      if (transactions.length > 0) {
        const { balance } = await serviceInjector(WalletService).getBalance();
        dispatch(getBalanceSuccess({ balance }));
      }
    } else {
      const { transactions, nextTransactionCursor } = await serviceInjector(
        WalletService
      ).getTransactions(options);
      await dispatch(getBalance());
      dispatch(getTransactionsSuccess({ transactions, nextTransactionCursor }));
    }
  } catch (error) {
    dispatch(getTransactionsFailure());
    throw error;
  }
};

export const updateUnconfirmedTransactions = () => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(updateUnconfirmedTransactionsRequest());
  try {
    await serviceInjector(WalletService).updateUnconfirmedTransactions();
    dispatch(updateUnconfirmedTransactionsSuccess());
  } catch (error) {
    dispatch(updateUnconfirmedTransactionsFailure());
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
    const { updatedTransactions } = await serviceInjector(
      WalletService
    ).updateTransactionsConfirmations();
    dispatch(updateTransactionsConfirmationsSuccess({ updatedTransactions }));
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

export const createSendTransaction = (receiverAddress, amountInSatoshi, satoshisPerByte) => async (
  dispatch,
  getState,
  { serviceInjector }
) => {
  dispatch(createSendTransactionRequest());
  try {
    const response = await serviceInjector(WalletService).createSendTransaction(
      receiverAddress,
      amountInSatoshi,
      satoshisPerByte
    );
    dispatch(createSendTransactionSuccess(response));
    const { balance } = await serviceInjector(WalletService).getBalance();
    dispatch(getBalanceSuccess({ balance }));
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
    const { inputs, psbt } = await serviceInjector(WalletService).createAllpaySendTransaction(args);
    dispatch(createAllpaySendTransactionSuccess({ inputs, psbt }));
  } catch (error) {
    dispatch(createAllpaySendTransactionFailure());
    throw error;
  }
};

export const getUsedDerivedKeys = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(getUsedDerivedKeysRequest());
  try {
    const { usedDerivedKeys } = await serviceInjector(WalletService).getUsedDerivedKeys();
    dispatch(getUsedDerivedKeysSuccess({ usedDerivedKeys }));
  } catch (error) {
    dispatch(getUsedDerivedKeysFailure());
    throw error;
  }
};

export const getUnusedDerivedKeys = () => async (dispatch, getState, { serviceInjector }) => {
  const {
    wallet: { unusedDerivedAddresses },
  } = getState();
  dispatch(getUnusedDerivedKeysRequest());
  const excludeAddresses = unusedDerivedAddresses.map(
    unusedDerivedAddress => unusedDerivedAddress.address
  );
  try {
    const { unusedDerivedAddresses } = await serviceInjector(WalletService).getUnusedDerivedKeys({
      excludeAddresses,
    });
    dispatch(getUnusedDerivedKeysSuccess({ unusedDerivedAddresses }));
  } catch (error) {
    dispatch(getUnusedDerivedKeysFailure());
    throw error;
  }
};

export const receiveReset = () => async (dispatch, getState, { serviceInjector }) => {
  dispatch(receiveResetRequest());
  try {
    const flag = await serviceInjector(WalletService).receiveReset();
    dispatch(receiveResetSuccess());
  } catch (error) {
    dispatch(receiveResetFailure());
    throw error;
  }
};
