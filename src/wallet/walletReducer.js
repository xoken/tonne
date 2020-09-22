import { createReducer } from 'redux-act';
import * as actions from './walletActions';

const INITIAL_STATE = {
  isLoading: false,
  balance: 0,
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
    [actions.getOutputsSuccess]: (state, { outputs }) => ({
      ...state,
      outputs: [...state.outputs, ...outputs],
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
  },
  INITIAL_STATE
);
