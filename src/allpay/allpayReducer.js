import { createReducer } from 'redux-act';
import * as allpayActions from './allpayActions';
import * as walletActions from '../wallet/walletActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  psbt: null,
  name: null,
  inputs: null,
  ownOutputs: null,
  snv: null,
  addressCommitment: null,
  utxoCommitment: null,
  proxyHost: null,
  proxyPort: null,
};

export default createReducer(
  {
    [allpayActions.buyNameSuccess]: (state, { psbt, name, inputs, ownOutputs, snv }) => ({
      ...state,
      psbt,
      name,
      inputs,
      ownOutputs,
      snv,
    }),
    [allpayActions.registerNameRequest]: () => ({
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
      { psbt, inputs, addressCommitment, utxoCommitment }
    ) => ({
      ...state,
      psbt,
      inputs,
      addressCommitment,
      utxoCommitment,
    }),
    [allpayActions.selectProxyProviderSuccess]: (state, { proxyHost, proxyPort }) => ({
      ...state,
      proxyHost,
      proxyPort,
    }),
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
  },
  INITIAL_STATE
);
