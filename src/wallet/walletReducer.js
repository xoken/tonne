import { createReducer } from 'redux-act';
import * as actions from './walletActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  isLoading: false,
  transactions: [],
  nextTransactionCursor: null,
  balance: 0,
  usedDerivedKeys: null,
  unusedDerivedAddresses: [],
};

const RESET_RECEIVE_STATE = {
  unusedDerivedAddresses: [],
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
    [actions.getUsedDerivedKeysRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getUsedDerivedKeysSuccess]: (state, { usedDerivedKeys }) => ({
      ...state,
      isLoading: false,
      usedDerivedKeys,
    }),
    [actions.getUsedDerivedKeysFailure]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getUnusedDerivedKeysSuccess]: (state, { unusedDerivedAddresses }) => ({
      ...state,
      unusedDerivedAddresses: state.unusedDerivedAddresses
        ? [...state.unusedDerivedAddresses, ...unusedDerivedAddresses]
        : unusedDerivedAddresses,
    }),
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
    [actions.receiveResetSuccess]: state => ({
      ...state,
      unusedDerivedAddresses: [],
    }),
  },
  INITIAL_STATE
);
