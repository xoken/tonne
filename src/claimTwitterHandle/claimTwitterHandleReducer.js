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
  user: {
    followers_count: 6,
    name: 'Shubendra',
    profile_image_url:
      'http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
    profile_image_url_https:
      'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
    screen_name: 'shubendrak1',
  },
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
