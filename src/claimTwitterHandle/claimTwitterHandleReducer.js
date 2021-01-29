import { createReducer } from 'redux-act';
import * as actions from './claimTwitterHandleActions';

const INITIAL_STATE = {
  ui: {
    activeStep: 1,
    title: null,
    progressTotalSteps: 7,
  },
  screenName: undefined,
  followersCount: undefined,
  oauthToken: undefined,
  oauthTokenSecret: undefined,
  purchasedTwitterHandles: [],
};

export default createReducer(
  {
    [actions.updateTwitterInfo]: (
      state,
      { screenName, followersCount, oauthToken, oauthTokenSecret }
    ) => ({
      ...state,
      screenName,
      followersCount,
      oauthToken,
      oauthTokenSecret,
    }),
    [actions.getPurchasedFollowersSuccess]: (state, { purchasedTwitterHandles }) => ({
      ...state,
      purchasedTwitterHandles,
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
