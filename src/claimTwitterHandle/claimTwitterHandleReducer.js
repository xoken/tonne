import { createReducer } from 'redux-act';
import * as actions from './claimTwitterHandleActions';
import * as allpayActions from '../allpay/allpayActions';

const INITIAL_STATE = {
  ui: {
    activeStep: 1,
    title: null,
    progressTotalSteps: 7,
  },
  message: '',
  oauthToken: undefined,
  oauthTokenSecret: undefined,
  user: undefined,
  purchasedTwitterFollowers: [],
};

export default createReducer(
  {
    [actions.updateTwitterInfo]: (state, { oauthToken, oauthTokenSecret }) => ({
      ...state,
      oauthToken,
      oauthTokenSecret,
    }),
    [actions.getPurchasedFollowersSuccess]: (state, { user, purchasedTwitterFollowers }) => ({
      ...state,
      user,
      purchasedTwitterFollowers,
    }),
    [actions.SET_MESSAGE]: (state, { message }) => ({
      ...state,
      message,
    }),
    [allpayActions.signRelayTransactionSuccess]: state => ({
      ...state,
      message: '',
    }),
    [actions.UPDATE_SCREEN_PROPS]: (state, payload) => ({
      ...state,
      ui: {
        ...state.ui,
        ...payload,
      },
    }),
    [actions.RESET_FLOW]: () => ({
      ...INITIAL_STATE,
    }),
    [actions.SET_NAME]: state => ({
      ...state,
    }),
  },
  INITIAL_STATE
);
