import { createAction } from 'redux-act';
import WalletService from './walletService';

export const getTransactionsRequest = createAction('GET_TRANSACTIONS_REQUEST');
export const getTransactionsSuccess = createAction('GET_TRANSACTIONS_SUCCESS');
export const getDiffTransactionsSuccess = createAction('GET_TRANSACTIONS_DIFF_SUCCESS');
export const getTransactionsFailure = createAction('GET_TRANSACTIONS_FAILURE');

export const updateUnconfirmedTransactionsRequest = createAction(
  'UPDATE_UNCONFIRMED_TRANSACTIONS_REQUEST'
);
export const updateUnconfirmedTransactionsSuccess = createAction(
  'UPDATE_UNCONFIRMED_TRANSACTIONS_SUCCESS'
);
export const updateUnconfirmedTransactionsFailure = createAction(
  'UPDATE_UNCONFIRMED_TRANSACTIONS_FAILURE'
);

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
      if (transactions.length > 0) {
        const { balance } = await serviceInjector(WalletService).getBalance();
        dispatch(getDiffTransactionsSuccess({ transactions }));
        dispatch(getBalanceSuccess({ balance }));
      } else {
        dispatch(getTransactionsSuccess({ transactions }));
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

export const getTransaction = txid => async (dispatch, getState, { serviceInjector }) => {
  // dispatch(getTransactionRequest());
  try {
    const { tx } = await serviceInjector(WalletService).getTransaction(txid);
    // dispatch(getTransactionSuccess());
    return tx;
  } catch (error) {
    // dispatch(getTransactionFailure());
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
    wallet: { unusedDerivedKeys },
  } = getState();
  const currentUnusedKeyIndex = unusedDerivedKeys
    ? unusedDerivedKeys[unusedDerivedKeys.length - 1].indexText
    : null;
  dispatch(getUnusedDerivedKeysRequest());
  try {
    const { unusedDerivedKeys } = await serviceInjector(WalletService).getUnusedDerivedKeys({
      currentUnusedKeyIndex,
    });
    dispatch(getUnusedDerivedKeysSuccess({ unusedDerivedKeys }));
  } catch (error) {
    dispatch(getUnusedDerivedKeysFailure());
    throw error;
  }
};
