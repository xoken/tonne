import { createReducer } from 'redux-act';
import * as actions from './walletActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  isLoading: false,
  transactions: [],
  nextTransactionCursor: null,
  balance: 0,
  usedAddresses: null,
  unusedAddresses: [],
};

export default createReducer(
  {
    [actions.getBalanceRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getBalanceSuccess]: (state, { balance }) => ({
      ...state,
      isLoading: false,
      balance,
    }),
    [actions.getBalanceFailure]: state => ({
      ...state,
      isLoading: false,
    }),
    [actions.getTransactionsRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getTransactionsSuccess]: (state, { transactions, nextTransactionCursor }) => ({
      ...state,
      transactions: [...state.transactions, ...transactions],
      nextTransactionCursor:
        nextTransactionCursor !== undefined ? nextTransactionCursor : state.nextTransactionCursor,
      isLoading: false,
    }),
    [actions.getTransactionsFailure]: state => ({
      ...state,
      isLoading: false,
    }),
    [actions.getDiffTransactionsSuccess]: (state, { transactions }) => ({
      ...state,
      transactions: [...transactions, ...state.transactions],
      isLoading: false,
    }),
    [actions.updateTransactionsConfirmationsSuccess]: (state, { updatedTransactions }) => ({
      ...state,
      transactions: state.transactions.map(transaction => {
        const isUpdated = updatedTransactions.find(
          updatedTransaction => updatedTransaction.txId === transaction.txId
        );
        if (isUpdated) {
          return isUpdated;
        }
        return transaction;
      }),
    }),
    [actions.createSendTransactionSuccess]: (state, { transaction }) => ({
      ...state,
      transactions: [transaction, ...state.transactions],
    }),
    [actions.getUsedAddressesRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getUsedAddressesSuccess]: (state, { usedAddresses }) => ({
      ...state,
      isLoading: false,
      usedAddresses,
    }),
    [actions.getUsedAddressesFailure]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getUnusedAddressesSuccess]: (state, { unusedAddresses }) => ({
      ...state,
      unusedAddresses: state.unusedAddresses
        ? [...state.unusedAddresses, ...unusedAddresses]
        : unusedAddresses,
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
