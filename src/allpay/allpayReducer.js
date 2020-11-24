import { createReducer } from 'redux-act';
import * as allpayActions from './allpayActions';
import * as authActions from '../auth/authActions';

const INITIAL_STATE = {
  psaTx: null,
};

export default createReducer(
  {
    [allpayActions.buyNameSuccess]: (state, { psaTx }) => ({
      ...state,
      psaTx,
    }),
    [authActions.logoutSuccess]: state => ({
      ...INITIAL_STATE,
    }),
  },
  INITIAL_STATE
);
