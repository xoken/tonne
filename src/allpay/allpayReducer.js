import { createReducer } from 'redux-act';
import * as allpayActions from './allpayActions';
import * as walletActions from '../wallet/walletActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  psbt: null,
  name: null,
  inputs: null,
  outputOwner: null,
  outputChange: null,
  proxyHost: null,
  proxyPort: null,
};

export default createReducer(
  {
    [allpayActions.buyNameSuccess]: (state, { psbt, name, inputs, outputOwner, outputChange }) => ({
      ...state,
      psbt,
      name,
      inputs,
      outputOwner,
      outputChange,
    }),
    [allpayActions.registerNameSuccess]: (state, { psbt, inputs }) => ({
      ...state,
      psbt,
      inputs,
    }),
    [walletActions.createAllpaySendTransactionSuccess]: (state, { psbt, inputs }) => ({
      ...state,
      psbt,
      inputs,
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
