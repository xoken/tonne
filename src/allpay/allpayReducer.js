import { createReducer } from 'redux-act';
import * as allpayActions from './allpayActions';
import * as walletActions from '../wallet/walletActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  ui: {
    activeStep: 1,
    title: null,
    progressTotalSteps: 4,
  },
  requestInProgress: false,
  psbt: null,
  outpoint: null,
  inputs: null,
  ownOutputs: null,
  snv: null,
};

export default createReducer(
  {
    [allpayActions.ALLPAY_UPDATE_SCREEN_PROPS]: (state, payload) => ({
      ...state,
      ui: {
        ...state.ui,
        ...payload,
      },
    }),
    [allpayActions.RESET_ALLPAY]: () => ({
      ...INITIAL_STATE,
    }),
    [allpayActions.SET_NAME]: (state, { name }) => ({
      ...state,
      outpoint: {
        name,
      },
    }),
    [allpayActions.getResellerURIRequest]: state => ({
      ...state,
      requestInProgress: true,
    }),
    [allpayActions.getResellerURISuccess]: state => ({
      ...state,
      requestInProgress: false,
    }),
    [allpayActions.getResellerURIFailure]: state => ({
      ...state,
      requestInProgress: false,
    }),
    [allpayActions.buyNameRequest]: state => ({
      ...state,
      requestInProgress: true,
    }),
    [allpayActions.buyNameSuccess]: (state, { psbt, outpoint, inputs, ownOutputs, snv }) => ({
      ...state,
      requestInProgress: false,
      psbt,
      outpoint,
      inputs,
      ownOutputs,
      snv,
    }),
    [allpayActions.buyNameFailure]: state => ({
      ...state,
      requestInProgress: false,
    }),
    [allpayActions.registerNameRequest]: state => ({
      ...state,
      requestInProgress: true,
      psbt: null,
      inputs: null,
      ownOutputs: null,
      snv: null,
    }),
    // [allpayActions.registerNameSuccess]: (state, { psbt, inputs, ownOutputs }) => ({
    //   ...state,
    //   psbt,
    //   inputs,
    //   ownOutputs,
    // }),
    [allpayActions.registerNameSuccess]: state => ({
      ...state,
      requestInProgress: false,
      snv: null,
    }),
    [allpayActions.registerNameFailure]: state => ({
      ...state,
      requestInProgress: false,
    }),
    [allpayActions.signRelayTransactionRequest]: state => ({
      ...state,
      requestInProgress: true,
    }),
    [allpayActions.signRelayTransactionSuccess]: state => ({
      ...state,
      requestInProgress: false,
      snv: null,
    }),
    [allpayActions.signRelayTransactionFailure]: state => ({
      ...state,
      requestInProgress: false,
    }),
    [walletActions.createAllpayTransactionSuccess]: (state, { psbt, inputs, ownOutputs }) => ({
      ...state,
      psbt,
      inputs,
      ownOutputs,
    }),
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
  },
  INITIAL_STATE
);
