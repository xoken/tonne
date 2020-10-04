import { createReducer } from 'redux-act';
import * as actions from './walletActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  isLoading: false,
  balance: 0,
  nextOutputsCursor: null,
  outputs: [],
  addressInfo: [],
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
    [actions.getOutputsSuccess]: (state, { outputs, nextOutputsCursor }) => ({
      ...state,
      outputs: [...state.outputs, ...outputs],
      nextOutputsCursor:
        nextOutputsCursor !== undefined ? nextOutputsCursor : state.nextOutputsCursor,
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
      nextOutputsCursor: null,
      outputs: [],
      totalOutputs: null,
    }),
  },
  INITIAL_STATE
);
