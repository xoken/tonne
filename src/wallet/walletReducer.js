import { createReducer } from 'redux-act';
import * as actions from './walletActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  isLoadingTransactions: false,
  transactions: [],
  nextTransactionCursor: null,
  balance: 0,
  isLoadingAddresses: false,
  usedAddresses: null,
  unusedAddresses: [],
  allpayHandles: null,
};

export default createReducer(
  {
    [actions.getBalanceSuccess]: (state, { balance }) => ({
      ...state,
      balance,
    }),
    [actions.getTransactionsRequest]: state => ({
      ...state,
      isLoadingTransactions: true,
    }),
    [actions.getTransactionsSuccess]: (state, { transactions, nextTransactionCursor }) => ({
      ...state,
      transactions: [...state.transactions, ...transactions],
      nextTransactionCursor:
        nextTransactionCursor !== undefined ? nextTransactionCursor : state.nextTransactionCursor,
      isLoadingTransactions: false,
    }),
    [actions.getTransactionsFailure]: state => ({
      ...state,
      isLoadingTransactions: false,
    }),
    [actions.getDiffTransactionsSuccess]: (state, { transactions }) => ({
      ...state,
      transactions: [...transactions, ...state.transactions],
      isLoadingTransactions: false,
    }),
    [actions.updateTransactionsConfirmationsSuccess]: (
      state,
      { updatedTransactions, deletedTransactions }
    ) => ({
      ...state,
      transactions: (() => {
        const remainingTransactions = state.transactions.filter(transaction => {
          const isDeleted = deletedTransactions.find(deletedTransaction => {
            return deletedTransaction.txId === transaction.txId;
          });
          if (isDeleted) {
            return false;
          }
          return true;
        });
        const newTransactions = remainingTransactions.map(transaction => {
          const isUpdated = updatedTransactions.find(
            updatedTransaction => updatedTransaction.txId === transaction.txId
          );
          if (isUpdated) {
            return isUpdated;
          }
          return transaction;
        });
        return newTransactions;
      })(),
    }),
    [actions.createSendTransactionSuccess]: (state, { transaction }) => ({
      ...state,
      transactions: [transaction, ...state.transactions],
    }),
    [actions.getUsedAddressesRequest]: state => ({
      ...state,
      isLoadingAddresses: true,
    }),
    [actions.getUsedAddressesSuccess]: (state, { usedAddresses }) => ({
      ...state,
      isLoadingAddresses: false,
      usedAddresses,
    }),
    [actions.getUsedAddressesFailure]: state => ({
      ...state,
      isLoadingAddresses: true,
    }),
    [actions.getUnusedAddressesSuccess]: (state, { unusedAddresses }) => ({
      ...state,
      unusedAddresses: state.unusedAddresses
        ? [...unusedAddresses, ...state.unusedAddresses]
        : unusedAddresses,
    }),
    [actions.getAllpayHandleSuccess]: (state, { allpayHandles }) => ({
      ...state,
      allpayHandles: allpayHandles,
    }),
    [actions.CLEAR_USED_UNUSED_ADDRESS]: state => ({
      ...state,
      usedAddresses: null,
      unusedAddresses: [],
    }),
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
  },
  INITIAL_STATE
);
