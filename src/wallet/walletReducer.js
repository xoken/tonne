import { createReducer } from 'redux-act';
import * as actions from './walletActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  isLoading: false,
  balance: 0,
  nextOutputsCursor: null,
  outputs: [],
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
    [actions.getOutputsRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getOutputsSuccess]: (state, { outputs, nextOutputsCursor, diffBalance }) => ({
      ...state,
      outputs: [...state.outputs, ...outputs],
      nextOutputsCursor: nextOutputsCursor,
      balance: diffBalance ? state.balance + diffBalance : state.balance,
      isLoading: false,
    }),
    [actions.getOutputsFailure]: state => ({
      ...state,
      isLoading: false,
    }),
    [actions.getTransactionRequest]: state => ({
      ...state,
      isLoading: true,
    }),
    [actions.getTransactionSuccess]: state => ({
      ...state,
      isLoading: false,
    }),
    [actions.getTransactionFailure]: state => ({
      ...state,
      isLoading: false,
    }),
    [authActions.logoutSuccess]: state => ({
      ...state,
      isLoading: false,
      balance: 0,
      nextOutputsCursor: null,
      outputs: [],
      totalOutputs: null,
    }),
  },
  INITIAL_STATE
);
