import { createReducer } from 'redux-act';
import * as allpayActions from './allpayActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  psbt: null,
  name: null,
  inputs: null,
  outputOwner: null,
  outputChange: null,
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
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
  },
  INITIAL_STATE
);
