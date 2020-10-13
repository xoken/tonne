import { createReducer } from 'redux-act';
import * as actions from './walletActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  isLoading: false,
  transactions: [],
  nextTransactionCursor: null,
  balance: 0,
  addressInfo: null,
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
      transactions: [...transactions, ...state.transactions],
      nextTransactionCursor:
        nextTransactionCursor !== undefined ? nextTransactionCursor : state.nextTransactionCursor,
      isLoading: false,
    }),
    [actions.getTransactionsFailure]: state => ({
      ...state,
      isLoading: false,
    }),
    [actions.getTransactionRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getAddressInfoRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getAddressInfoSuccess]: (state, { addressInfo }) => ({
      ...state,
      isLoading: false,
      addressInfo,
    }),
    [actions.getAddressInfoFailure]: state => ({
      ...state,
      isLoading: true,
    }),
    [authActions.logoutSuccess]: state => ({
      ...state,
      isLoading: false,
      balance: 0,
      transactions: [],
      nextTransactionCursor: null,
      addressInfo: null,
    }),
  },
  INITIAL_STATE
);
