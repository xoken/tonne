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
  psbt: null,
  outpoint: null,
  inputs: null,
  ownOutputs: null,
  snv: null,
  addressCommitment: null,
  utxoCommitment: null,
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
    [allpayActions.buyNameSuccess]: (state, { psbt, outpoint, inputs, ownOutputs, snv }) => ({
      ...state,
      psbt,
      outpoint,
      inputs,
      ownOutputs,
      snv,
    }),
    [allpayActions.registerNameRequest]: state => ({
      ...state,
      psbt: null,
      inputs: null,
      ownOutputs: null,
      snv: null,
      addressCommitment: null,
      utxoCommitment: null,
    }),
    [allpayActions.registerNameSuccess]: (state, { psbt, inputs, ownOutputs }) => ({
      ...state,
      psbt,
      inputs,
      ownOutputs,
    }),
    [allpayActions.signRelayTransactionSuccess]: state => ({
      ...state,
      snv: null,
      addressCommitment: null,
      utxoCommitment: null,
    }),
    [walletActions.createAllpaySendTransactionSuccess]: (
      state,
      { psbt, inputs, ownOutputs, addressCommitment, utxoCommitment }
    ) => ({
      ...state,
      psbt,
      inputs,
      ownOutputs,
      addressCommitment,
      utxoCommitment,
    }),
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
  },
  INITIAL_STATE
);
