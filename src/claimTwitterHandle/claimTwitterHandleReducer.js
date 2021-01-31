import { createReducer } from 'redux-act';
import * as actions from './claimTwitterHandleActions';

const INITIAL_STATE = {
  ui: {
    activeStep: 1,
    title: null,
    progressTotalSteps: 7,
  },
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
